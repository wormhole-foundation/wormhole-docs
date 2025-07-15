import {
  wormhole,
  Wormhole,
  TokenId,
  TokenAddress,
} from '@wormhole-foundation/sdk';
import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner } from './helper';

async function attestToken() {
  // Initialize wormhole instance, define the network, platforms, and chains
  const wh = await wormhole('Testnet', [evm, solana]);
  const sourceChain = wh.getChain('Moonbeam');
  const destinationChain = wh.getChain('Solana');

  // Define the token to check for a wrapped version
  const tokenId: TokenId = Wormhole.tokenId(
    sourceChain.chain,
    'INSERT_TOKEN_CONTRACT_ADDRESS'
  );
  // Check if the token is registered with destinationChain token bridge contract
  // Registered = returns the wrapped token ID
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
    // Attestation on the Source Chain flow code
    // Retrieve the token bridge context for the source chain
    // This is where you will send the transaction to attest the token
    const tb = await sourceChain.getTokenBridge();
    // Get the signer for the source chain
    const sourceSigner = await getSigner(sourceChain);
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
      // Attestation on the Destination Chain flow code
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
      // Get the signer for the destination chain
      const destinationSigner = await getSigner(destinationChain);
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
    console.log(
      `🚀 Token attestation complete! Token registered with ${destinationChain.chain}.`
    );
  }
}

attestToken().catch((e) => {
  console.error('❌ Error in attestToken', e);
  process.exit(1);
});
