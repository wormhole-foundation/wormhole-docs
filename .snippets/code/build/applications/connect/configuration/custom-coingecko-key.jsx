import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  coinGeckoApiKey: 'INSERT_API_KEY',
};

function App() {
  return <WormholeConnect config={config} />;
}
