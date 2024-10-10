import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  "coinGeckoApiKey": "..."
}

function App() {
  return <WormholeConnect config={config} />;
}
