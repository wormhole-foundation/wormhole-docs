import { wormhole, Wormhole, TokenId } from '@wormhole-foundation/sdk';
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

  // Check if the token is registered with destinationChain token bridge contract
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
  // Define automatic transfer
  const automatic = true;
  // Optional native gas amount for automatic transfers only
  const nativeGasAmount = '0.001'; // 0.001 of native gas in human-readable format
  // Get the decimals for the source chain
  const nativeGasDecimals = destinationChain.config.nativeTokenDecimals;
  // If automatic, convert to raw units, otherwise set to 0n
  const nativeGas = automatic
    ? BigInt(Number(nativeGasAmount) * 10 ** nativeGasDecimals)
    : 0n;
  // Build the token transfer object
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    sourceSigner.address,
    destinationSigner.address,
    automatic,
    undefined, // no payload
    nativeGas
  );
  console.log('🚀 Built transfer object:', xfer.transfer);

  // Initiate, sign, and send the token transfer
  const srcTxs = await xfer.initiateTransfer(sourceSigner.signer);
  console.log('🔗 Source chain tx sent:', srcTxs);

  // If automatic, no further action is required. The relayer completes the transfer.
  console.log('✅ Automatic transfer: relayer is handling redemption.');

  process.exit(0);
}

transferTokens().catch((e) => {
  console.error('❌ Error in transferTokens', e);
  process.exit(1);
});
