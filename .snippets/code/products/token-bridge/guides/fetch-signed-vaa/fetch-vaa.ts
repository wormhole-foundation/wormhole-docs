import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import { serialize } from '@wormhole-foundation/sdk-definitions';
import { toChainId } from '@wormhole-foundation/sdk-base';

async function main() {
  // Initialize the Wormhole SDK with the network and platform
  // to match the source chain for the transaction ID
  const wh = await wormhole('Testnet', [evm]);
  // Source chain transaction ID for the VAA you want to fetch
  const txid =
    'INSERT_TRANSACTION_ID';
  // Call getVaa to fetch the VAA associated with the transaction ID
  // and decode returned data into human-readable format
  const vaa = await wh.getVaa(txid, 'Uint8Array', 60000);
  if (!vaa) {
    console.error('❌ VAA not found');
    process.exit(1);
  }
  const { emitterChain, emitterAddress, sequence } = vaa;
  const chainId = toChainId(emitterChain);
  const emitterHex = emitterAddress.toString();

  const vaaBytes = serialize(vaa);
  const vaaHex = Buffer.from(vaaBytes).toString('hex');

  console.log('✅ VAA Info');
  console.log(`Chain: ${chainId}`);
  console.log(`Emitter: ${emitterHex}`);
  console.log(`Sequence: ${sequence}`);
  console.log('---');
  console.log(`VAA Bytes (hex):\n${vaaHex}`);
  // Return the VAA object for further processing if needed
  return vaa;
}

main().catch(console.error);
