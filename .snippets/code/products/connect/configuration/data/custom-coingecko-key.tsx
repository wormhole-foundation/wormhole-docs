import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  coinGeckoApiKey: 'INSERT_API_KEY',
};

function App() {
  return <WormholeConnect config={config} />;
}
