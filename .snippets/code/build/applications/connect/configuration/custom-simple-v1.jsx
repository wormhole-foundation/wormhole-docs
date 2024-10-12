import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  chains: ['Ethereum', 'Polygon', 'Solana'],
  rpcs: {
    Ethereum: 'https://rpc.ankr.com/eth',
    Solana: 'https://rpc.ankr.com/solana',
  },
};

function App() {
  return <WormholeConnect config={config} />;
}
