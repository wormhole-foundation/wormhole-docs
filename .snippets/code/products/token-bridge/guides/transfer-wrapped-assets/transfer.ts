import {
  wormhole,
  Wormhole,
  TokenId,
  TokenAddress,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
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
      '⚠️ Token is NOT registered on destination. Running attestation flow...'
    );
    // Retrieve the token bridge context for the source chain
    // This is where you will send the transaction to attest the token
    const tb = await sourceChain.getTokenBridge();
    // Define the token to attest and a payer address
    const token: TokenAddress<typeof sourceChain.chain> = toNative(
      sourceChain.chain,
      tokenId.address.toString()
    );
    const payer = toNative(sourceChain.chain, sourceSigner.signer.address());
    // Call the `createAttestation` method to create a new attestation
    // and sign and send the transaction
    for await (const tx of tb.createAttestation(token, payer)) {
      const txids = await signSendWait(
        sourceChain,
        tb.createAttestation(token),
        sourceSigner.signer
      );
      console.log('✅ Attestation transaction sent:', txids);
      // Parse the transaction to get Wormhole message ID
      const messages = await sourceChain.parseTransaction(txids[0].txid);
      console.log('✅ Attestation messages:', messages);
      // Set a timeout for fetching the VAA, this can take several minutes
      // depending on the source chain network and finality
      const timeout = 25 * 60 * 1000;
      // Fetch the VAA for the attestation message
      const vaa = await wh.getVaa(
        messages[0]!,
        'TokenBridge:AttestMeta',
        timeout
      );
      if (!vaa) throw new Error('❌ VAA not found before timeout.');
      // Get the token bridge context for the destination chain
      // and submit the attestation VAA
      const destTb = await destinationChain.getTokenBridge();
      const payer = toNative(
        destinationChain.chain,
        destinationSigner.signer.address()
      );
      const destTxids = await signSendWait(
        destinationChain,
        destTb.submitAttestation(vaa, payer),
        destinationSigner.signer
      );
      console.log('✅ Attestation submitted on destination:', destTxids);
    }
    // Poll for the wrapped token to appear on the destination chain
    // before proceeding with the transfer
    const maxAttempts = 50; // ~5 minutes with 6s interval
    const interval = 6000;
    let attempt = 0;
    let registered = false;

    while (attempt < maxAttempts && !registered) {
      attempt++;
      try {
        const wrapped = await wh.getWrappedAsset(
          destinationChain.chain,
          tokenId
        );
        console.log(
          `✅ Wrapped token is now available on ${destinationChain.chain}:`,
          wrapped.address
        );
        registered = true;
      } catch {
        console.log(
          `⏳ Waiting for wrapped token to register on ${destinationChain.chain}...`
        );
        await new Promise((res) => setTimeout(res, interval));
      }
    }

    if (!registered) {
      throw new Error(
        `❌ Token attestation did not complete in time on ${destinationChain.chain}`
      );
    }

    console.log('🚀 Token attestation complete! Proceeding with transfer...');
  }

  // Define whether the transfer is automatic or manual
  const automatic = false;
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
  if (automatic) {
    console.log('✅ Automatic transfer: relayer is handling redemption.');
    return;
  }
  // For manual transfers, wait for VAA
  console.log('⏳ Waiting for attestation (VAA) for manual transfer...');
  const attIds = await xfer.fetchAttestation(120_000); // 2 minutes timeout
  console.log('✅ Got attestation ID(s):', attIds);

  // Complete the manual transfer on the destination chain
  console.log('↪️ Redeeming transfer on destination...');
  const destTxs = await xfer.completeTransfer(destinationSigner.signer);
  console.log('🎉 Destination tx(s) submitted:', destTxs);
}

transferTokens().catch((e) => {
  console.error('❌ Error in transferTokens', e);
  process.exit(1);
});