import {
  Chain,
  Network,
  TokenId,
  TokenTransfer,
  Wormhole,
  amount,
  isTokenId,
  wormhole,
} from '@wormhole-foundation/sdk';

import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { SignerStuff, getSigner, waitLog } from './helpers/index.js';

(async function () {
  // Init Wormhole object, passing config for which network
  // to use (e.g. Mainnet/Testnet) and what Platforms to support
  const wh = await wormhole('Testnet', [evm, solana]);

  // Grab chain Contexts -- these hold a reference to a cached rpc client
  const sendChain = wh.getChain('Avalanche');
  const rcvChain = wh.getChain('Solana');

  // Shortcut to allow transferring native gas token
  const token = Wormhole.tokenId(sendChain.chain, 'native');

  // A TokenId is just a `{chain, address}` pair and an alias for ChainAddress
  // The `address` field must be a parsed address.
  // You can get a TokenId (or ChainAddress) prepared for you
  // by calling the static `chainAddress` method on the Wormhole class.
  // e.g.
  // wAvax on Solana
  // const token = Wormhole.tokenId("Solana", "3Ftc5hTz9sG4huk79onufGiebJNDMZNL8HYgdMJ9E7JR");
  // wSol on Avax
  // const token = Wormhole.tokenId("Avalanche", "0xb10563644a6AB8948ee6d7f5b0a1fb15AaEa1E03");

  // Normalized given token decimals later but can just pass bigints as base units
  // Note: The WTT (Token Bridge) will dedust past 8 decimals
  // This means any amount specified past that point will be returned
  // To the caller
  const amt = '0.05';

  // Protocol options:
  // - "TokenBridge": Manual transfer requiring VAA redemption on the destination chain
  // - "ExecutorTokenBridge": Automatic transfer relayed by the executor service
  // With an automatic transfer, the executor picks up the transfer and redeems it
  // For you. On the destination side, a wrapped version of the token will be minted
  // To the address specified in the transfer VAA
  const protocol: TokenTransfer.Protocol = 'TokenBridge';

  // The executor has the ability to deliver some native gas funds to the destination account
  // The amount specified for native gas will be swapped for the native gas token according
  // To the swap rate provided by the contract, denominated in native gas tokens
  const nativeGas = protocol === 'ExecutorTokenBridge' ? '0.01' : undefined;

  // Get signer from local key but anything that implements
  // Signer interface (e.g. wrapper around web wallet) should work
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Used to normalize the amount to account for the tokens decimals
  const decimals = isTokenId(token)
    ? Number(await wh.getDecimals(token.chain, token.address))
    : sendChain.config.nativeTokenDecimals;

  // Set this to true if you want to perform a round trip transfer
  const roundTrip: boolean = false;

  // Set this to the transfer txid of the initiating transaction to recover a token transfer
  // And attempt to fetch details about its progress.
  let recoverTxid = undefined;

  // Finally create and perform the transfer given the parameters set above
  const xfer = !recoverTxid
    ? // Perform the token transfer
      await tokenTransfer(
        wh,
        {
          token,
          amount: amount.units(amount.parse(amt, decimals)),
          source,
          destination,
          delivery: {
            protocol,
            nativeGas: nativeGas
              ? amount.units(amount.parse(nativeGas, decimals))
              : undefined,
          },
        },
        roundTrip
      )
    : // Recover the transfer from the originating txid
      await TokenTransfer.from(wh, {
        chain: source.chain.chain,
        txid: recoverTxid,
      });

  const receipt = await waitLog(wh, xfer);

  // Log out the results
  console.log(receipt);
})();

async function tokenTransfer<N extends Network>(
  wh: Wormhole<N>,
  route: {
    token: TokenId;
    amount: bigint;
    source: SignerStuff<N, Chain>;
    destination: SignerStuff<N, Chain>;
    delivery?: {
      protocol: TokenTransfer.Protocol;
      nativeGas?: bigint;
    };
    payload?: Uint8Array;
  },
  roundTrip?: boolean
): Promise<TokenTransfer<N>> {
  // Create a TokenTransfer object to track the state of the transfer over time
  const xfer = await wh.tokenTransfer(
    route.token,
    route.amount,
    route.source.address,
    route.destination.address,
    route.delivery?.protocol ?? 'TokenBridge',
    route.payload
  );

  // Automatic transfers are relayed on your behalf, so they need an executor
  // quote. Manual transfers only need the fees, so the plain quote is enough
  const quote =
    xfer.transfer.protocol === 'ExecutorTokenBridge'
      ? await executorQuote(wh, route, xfer)
      : await TokenTransfer.quoteTransfer(
          wh,
          route.source.chain,
          route.destination.chain,
          xfer.transfer
        );
  console.log(quote);

  if (xfer.transfer.protocol === 'ExecutorTokenBridge' && quote.destinationToken.amount < 0)
    throw 'The amount requested is too low to cover the fee and any native gas requested.';

  // 1) Submit the transactions to the source chain, passing a signer to sign any txns
  console.log('Starting transfer');
  const srcTxids = await xfer.initiateTransfer(route.source.signer);
  console.log(`Started transfer: `, srcTxids);

  // If the transfer is automatic, the executor relays it and we're done
  if (xfer.transfer.protocol === 'ExecutorTokenBridge') return xfer;

  // 2) Wait for the VAA to be signed and ready (not required for an automatic transfer)
  console.log('Getting Attestation');
  const attestIds = await xfer.fetchAttestation(60_000);
  console.log(`Got Attestation: `, attestIds);

  // 3) Redeem the VAA on the dest chain
  console.log('Completing Transfer');
  const destTxids = await xfer.completeTransfer(route.destination.signer);
  console.log(`Completed Transfer: `, destTxids);

  // If no need to send back, dip
  if (!roundTrip) return xfer;

  const { destinationToken: token } = quote;
  return await tokenTransfer(wh, {
    ...route,
    token: token.token,
    amount: token.amount,
    source: route.destination,
    destination: route.source,
  });
}

// An automatic transfer cannot be initiated until the executor quote is fetched
// and attached to the transfer, since the quote carries the relay instructions
// the executor uses to redeem the transfer on the destination chain
async function executorQuote<N extends Network>(
  wh: Wormhole<N>,
  route: {
    token: TokenId;
    amount: bigint;
    source: SignerStuff<N, Chain>;
    destination: SignerStuff<N, Chain>;
    delivery?: {
      protocol: TokenTransfer.Protocol;
      nativeGas?: bigint;
    };
  },
  xfer: TokenTransfer<N>
) {
  // The executor needs to know the gas it will spend redeeming the transfer
  const dstTb = await route.destination.chain.getExecutorTokenBridge();
  const dstToken = await TokenTransfer.lookupDestinationToken(
    route.source.chain,
    route.destination.chain,
    route.token
  );
  const { msgValue, gasLimit } = await dstTb.estimateMsgValueAndGasLimit(dstToken);

  const quote = await TokenTransfer.quoteTransfer(
    wh,
    route.source.chain,
    route.destination.chain,
    {
      ...xfer.transfer,
      msgValue,
      gasLimit,
      nativeGas: route.delivery?.nativeGas,
    }
  );
  xfer.transfer.executorQuote = quote.details.executorQuote;

  return quote;
}
