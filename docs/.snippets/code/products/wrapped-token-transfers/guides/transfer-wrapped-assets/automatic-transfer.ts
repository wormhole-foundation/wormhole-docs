import { wormhole, Wormhole, TokenId, TokenTransfer } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner, getTokenDecimals } from './helpers';

async function transferTokens() {
  // Initialize wh instance
  const wh = await wormhole('Testnet', [evm, solana]);
  // Define sourceChain and destinationChain, get chain contexts
  const sourceChain = wh.getChain('Moonbeam');
  const destinationChain = wh.getChain('Solana');
  // Load signers for both chains
  const sourceSigner = await getSigner(sourceChain);
  const destinationSigner = await getSigner(destinationChain);

  // Define token and amount to transfer
  const tokenId: TokenId = Wormhole.tokenId(
    sourceChain.chain,
    'INSERT_TOKEN_CONTRACT_ADDRESS'
  );
  // Replace with amount you want to transfer
  // This is a human-readable number, e.g., 0.2 for 0.2 tokens
  const amount = INSERT_AMOUNT;
  // Convert to raw units based on token decimals
  const decimals = await getTokenDecimals(wh, tokenId, sourceChain);
  const transferAmount = BigInt(Math.floor(amount * 10 ** decimals));

  // Check if the token is registered with destinationChain WTT (Token Bridge) contract
  // Registered = returns the wrapped token ID, continues with transfer
  // Not registered = runs the attestation flow to register the token
  let wrappedToken: TokenId;
  try {
    wrappedToken = await wh.getWrappedAsset(destinationChain.chain, tokenId);
    console.log(
      '✅ Token already registered on destination:',
      wrappedToken.address
    );
  } catch (e) {
    console.log(
      '⚠️ Token is NOT registered on destination. Attestation required before transfer can proceed...'
    );
  }
  // Insert Initiate Transfer on Source Chain code
  // Build the token transfer object using the executor protocol, which relays
  // the transfer to the destination chain on your behalf
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    sourceSigner.address,
    destinationSigner.address,
    'ExecutorTokenBridge'
  );
  console.log('🚀 Built transfer object:', xfer.transfer);

  // Estimate the destination gas requirements before quoting. The resulting
  // executor quote must be attached before the transfer can be initiated
  const dstTb = await destinationChain.getExecutorTokenBridge();
  const dstToken = await TokenTransfer.lookupDestinationToken(
    sourceChain,
    destinationChain,
    tokenId
  );
  const { msgValue, gasLimit } = await dstTb.estimateMsgValueAndGasLimit(dstToken);

  // Optionally deliver native gas to the destination account
  const nativeGasAmount = '0.001'; // 0.001 of native gas in human-readable format
  const nativeGasDecimals = destinationChain.config.nativeTokenDecimals;
  const nativeGas = BigInt(Number(nativeGasAmount) * 10 ** nativeGasDecimals);

  const quote = await TokenTransfer.quoteTransfer(wh, sourceChain, destinationChain, {
    ...xfer.transfer,
    msgValue,
    gasLimit,
    nativeGas,
  });
  xfer.transfer.executorQuote = quote.details.executorQuote;

  // Initiate, sign, and send the token transfer
  const srcTxs = await xfer.initiateTransfer(sourceSigner.signer);
  console.log('🔗 Source chain tx sent:', srcTxs);

  // The executor relays and redeems the transfer, so no further action is required
  console.log('✅ Automatic transfer: the executor is handling redemption.');

  process.exit(0);
}

transferTokens().catch((e) => {
  console.error('❌ Error in transferTokens', e);
  process.exit(1);
});
