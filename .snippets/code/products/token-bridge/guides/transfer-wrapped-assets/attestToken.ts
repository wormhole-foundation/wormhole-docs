import { wormhole, toNative } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import { ethers } from 'ethers';
import {
  getMoonbeamSigner,
  getMoonbeamWallet,
  getSepoliaSigner,
  getSepoliaWallet,
} from './helpers';

async function attestToken() {
  // Initialize the Wormhole SDK, get chain contexts
  const wh = await wormhole('Testnet', [evm]);
  const sourceChainCtx = wh.getChain('Moonbeam');
  const destinationChainCtx = wh.getChain('Sepolia');
  // Get signers for source and destination chains
  const sourceSigner = await getMoonbeamSigner();
  const sourceWallet = getMoonbeamWallet();
  const destinationSigner = await getSepoliaSigner();
  const destinationWallet = await getSepoliaWallet();

  // Define the token to attest for registeration
  // on the destination chain (token you want to transfer)
  const tokenToAttest = 'INSERT_TOKEN_ADDRESS';
  const token = toNative(sourceChainCtx.chain, tokenToAttest);
  console.log(`🔍 Token to attest: ${token.toString()}`);

  // Get the Token Bridge protocol for source chain
  const sourceTokenBridge = await sourceChainCtx.getTokenBridge();
  // Create attestation transactions
  const createAttestationTxs = sourceTokenBridge.createAttestation(token);
  // Prepare to collect transaction hashes
  const sourceTxids: string[] = [];
  // Iterate through the unsigned transactions, sign and send them
  for await (const tx of createAttestationTxs) {
    const txRequest = tx.transaction as ethers.TransactionRequest;
    const sentTx = await sourceWallet.sendTransaction(txRequest); // Use wallet, not SDK signer
    await sentTx.wait();
    sourceTxids.push(sentTx.hash);
  }
  const sourceTxId = sourceTxids[0];
  console.log(`✅ Attestation tx sent: ${sourceTxId}`);
  // Parse the transaction to get messages
  const messages = await sourceChainCtx.parseTransaction(sourceTxId);
  console.log('📦 Parsed messages:', messages);
  // Set a timeout for fetching the VAA, this can take several minutes
  // depending on the source chain network and finality
  const timeout = 25 * 60 * 1000;
  // Fetch the VAA for the attestation message
  const vaa = await wh.getVaa(messages[0]!, 'TokenBridge:AttestMeta', timeout);
  if (!vaa) throw new Error('❌ VAA not found before timeout.');

  console.log(
    `📨 Submitting attestation VAA to ${destinationChainCtx.chain}...`
  );
  // Get the Token Bridge protocol for destination chain
  const destTokenBridge = await destinationChainCtx.getTokenBridge();
  // Submit the attestation VAA
  const submitTxs = destTokenBridge.submitAttestation(vaa);
  // Prepare to collect transaction hashes for the destination chain
  const destTxids: string[] = [];
  // Iterate through the unsigned transactions, sign and send them
  for await (const tx of submitTxs) {
    const txRequest = tx.transaction as ethers.TransactionRequest;
    const sentTx = await destinationWallet.sendTransaction(txRequest);
    await sentTx.wait();
    destTxids.push(sentTx.hash);
  }
  console.log(`✅ Attestation VAA submitted: ${destTxids[0]}`);
  console.log(
    `🎉 Token attestation complete! You are now ready to transfer ${token.toString()} to ${
      destinationChainCtx.chain
    }`
  );
}

attestToken().catch((err) => {
  console.error('❌ Error in attestToken:', err);
  process.exit(1);
});
