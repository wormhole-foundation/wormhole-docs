import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  env: 'testnet',
  networks: ['sepolia', 'arbitrum_sepolia', 'base_sepolia', 'fuji'],

  rpcs: {
    fuji: 'https://rpc.ankr.com/avalanche_fuji',
    base_sepolia: 'https://base-sepolia-rpc.publicnode.com',
  },
};

function App() {
  return <WormholeConnect config={config} />;
}
