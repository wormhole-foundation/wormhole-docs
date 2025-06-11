import { wormhole, toNative, VAA } from '@wormhole-foundation/sdk';
import { deserialize } from '@wormhole-foundation/sdk-definitions';
import evm from '@wormhole-foundation/sdk/evm';
import { getSepoliaSigner, getSepoliaWallet } from './helpers';
import { promises as fs } from 'fs';

async function redeemOnDestination() {
  // Read the raw VAA bytes from file
  const vaaBytes = await fs.readFile('vaa.bin');
  // Initialize the Wormhole SDK
  const wh = await wormhole('Testnet', [evm]);
  // Get the destination chain context
  const destinationChainCtx = wh.getChain('Sepolia');

  // Parse the VAA from bytes
  const vaa = deserialize(
    'TokenBridge:Transfer',
    vaaBytes
  ) as VAA<'TokenBridge:Transfer'>;

  // Get the signer for destination chain
  const destinationSigner = await getSepoliaSigner();
  const destinationWallet = await getSepoliaWallet();
  const recipient = destinationSigner.address();

  // Get the TokenBridge protocol for the destination chain
  const tokenBridge = await destinationChainCtx.getProtocol('TokenBridge');
  // Redeem the VAA on Sepolia to claim the transferred tokens
  // for the specified recipient address
  console.log('📨 Redeeming VAA on Sepolia...');
  const txs = await tokenBridge.redeem(toNative('Sepolia', recipient), vaa);
  // Prepare to collect transaction hashes
  const txHashes: string[] = [];
  // Iterate through the unsigned transactions, sign and send them
  for await (const unsignedTx of txs) {
    const tx = unsignedTx.transaction;
    const sent = await destinationWallet.sendTransaction(tx);
    await sent.wait();
    txHashes.push(sent.hash);
  }
  console.log('✅ Redemption complete. Sepolia txid(s):', txHashes);
}

redeemOnDestination().catch((e) => {
  console.error('❌ Error in redeemOnDestination:', e);
  process.exit(1);
});
