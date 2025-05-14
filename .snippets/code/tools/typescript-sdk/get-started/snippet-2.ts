import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

async function main() {
  console.log('Initializing Wormhole SDK...');

  const network = 'Testnet';  
  const wh = await wormhole(network, [evm, solana]);

  console.log('Wormhole SDK Initialized!');

  // Example: Get a chain ID and RPC for Solana
  const solanaDevnetChain = wh.getChain('Solana');
  console.log(
    `Chain ID for Solana Testnet: ${solanaDevnetChain.config.chainId}`
  );
  console.log(`RPC for Solana Testnet: ${solanaDevnetChain.config.rpc}`);

  // Example: Get a chain ID for Sepolia (EVM Testnet)
  const sepoliaChain = wh.getChain('Sepolia');
  console.log(`Chain ID for Sepolia: ${sepoliaChain.config.chainId}`);
  console.log(`RPC for Sepolia: ${sepoliaChain.config.rpc}`);
}

main().catch((e) => {
  console.error(
    'Error initializing Wormhole SDK or fetching chain information:',
    e
  );
  process.exit(1);
});
