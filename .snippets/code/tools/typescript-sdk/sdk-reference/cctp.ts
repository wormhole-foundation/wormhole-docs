import {
  Chain,
  CircleTransfer,
  Network,
  Signer,
  TransactionId,
  TransferState,
  Wormhole,
  amount,
  wormhole,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { SignerStuff, getSigner, waitForRelay } from './helpers/index.js';

/*
Notes:
Only a subset of chains are supported by Circle for CCTP, see core/base/src/constants/circle.ts for currently supported chains

AutoRelayer takes a 0.1 USDC fee when transferring to any chain beside Goerli, which is 1 USDC
*/
//

(async function () {
  // Init the Wormhole object, passing in the config for which network
  // to use (e.g. Mainnet/Testnet) and what Platforms to support
  const wh = await wormhole('Testnet', [evm, solana]);

  // Grab chain Contexts
  const sendChain = wh.getChain('Avalanche');
  const rcvChain = wh.getChain('Solana');

  // Get signer from local key but anything that implements
  // Signer interface (e.g. wrapper around web wallet) should work
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // 6 decimals for USDC (except for BSC, so check decimals before using this)
  const amt = amount.units(amount.parse('0.2', 6));

  // Choose whether or not to have the attestation delivered for you
  const automatic = false;

  // If the transfer is requested to be automatic, you can also request that
  // during redemption, the receiver gets some amount of native gas transferred to them
  // so that they may pay for subsequent transactions
  // The amount specified here is denominated in the token being transferred (USDC here)
  const nativeGas = automatic ? amount.units(amount.parse('0.0', 6)) : 0n;

  await cctpTransfer(wh, source, destination, {
    amount: amt,
    automatic,
    nativeGas,
  });

})();

async function cctpTransfer<N extends Network>(
  wh: Wormhole<N>,
  src: SignerStuff<N, any>,
  dst: SignerStuff<N, any>,
  req: {
    amount: bigint;
    automatic: boolean;
    nativeGas?: bigint;
  }
) {

  const xfer = await wh.circleTransfer(
    // Amount as bigint (base units)
    req.amount,
    // Sender chain/address
    src.address,
    // Receiver chain/address
    dst.address,
    // Automatic delivery boolean
    req.automatic,
    // Payload to be sent with the transfer
    undefined,
    // If automatic, native gas can be requested to be sent to the receiver
    req.nativeGas
  );

  // Note, if the transfer is requested to be Automatic, a fee for performing the relay
  // will be present in the quote. The fee comes out of the amount requested to be sent.
  // If the user wants to receive 1.0 on the destination, the amount to send should be 1.0 + fee.
  // The same applies for native gas dropoff
  const quote = await CircleTransfer.quoteTransfer(
    src.chain,
    dst.chain,
    xfer.transfer
  );
  console.log('Quote', quote);

  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(src.signer);
  console.log(`Started Transfer: `, srcTxids);

  if (req.automatic) {
    const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
    console.log(`Finished relay: `, relayStatus);
    return;
  }

  console.log('Waiting for Attestation');
  const attestIds = await xfer.fetchAttestation(60_000);
  console.log(`Got Attestation: `, attestIds);

  console.log('Completing Transfer');
  const dstTxids = await xfer.completeTransfer(dst.signer);
  console.log(`Completed Transfer: `, dstTxids);
}

export async function completeTransfer(
  wh: Wormhole<Network>,
  txid: TransactionId,
  signer: Signer
): Promise<void> {

  const xfer = await CircleTransfer.from(wh, txid);

  const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
  console.log('Got attestation: ', attestIds);

  const dstTxIds = await xfer.completeTransfer(signer);
  console.log('Completed transfer: ', dstTxIds);
}
