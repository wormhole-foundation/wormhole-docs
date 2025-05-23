import { wormhole } from '@wormhole-foundation/sdk';
// Import specific platform modules for the chains you intend to use
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

async function main() {
  console.log('Initializing Wormhole SDK...');

  // Determine the network: "Mainnet", "Testnet", or "Devnet"
  const network = 'Testnet';

  // Initialize the SDK with the chosen network and platform contexts
  const wh = await wormhole(network, [evm, solana]);

  console.log('Wormhole SDK Initialized!');
}

main().catch((e) => {
  console.error('Error initializing Wormhole SDK', e);
  process.exit(1);
});
