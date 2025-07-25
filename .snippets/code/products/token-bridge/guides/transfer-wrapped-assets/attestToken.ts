import {
  wormhole,
  Wormhole,
  TokenId,
  TokenAddress,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
import { getSigner } from './helpers';

async function attestToken() {
  // Initialize wh instance
  const wh = await wormhole('Testnet', [evm, solana]);
  // Define sourceChain and destinationChain, get chain contexts
  const sourceChain = wh.getChain('Moonbeam');
  const destinationChain = wh.getChain('Solana');
  // Load signers for both chains
  const sourceSigner = await getSigner(sourceChain);
  const destinationSigner = await getSigner(destinationChain);

  // Retrieve the token bridge context for the source chain
  // This is where you will send the transaction to attest the token
  const tb = await sourceChain.getTokenBridge();
  // Define token and amount to transfer
  const tokenId: TokenId = Wormhole.tokenId(
    sourceChain.chain,
    '0x9b2ff7B2B5A459853224a3317b786d8E85026660'
  );
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
      const wrapped = await wh.getWrappedAsset(destinationChain.chain, tokenId);
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
  console.log('🚀 Token attestation complete! Proceed with transfer...');
}

attestToken().catch((e) => {
  console.error('❌ Error in transferTokens', e);
  process.exit(1);
});
