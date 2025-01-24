import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  ui: {
    disableArbitraryTokens: true
  }
};

function App() {
  return <WormholeConnect config={config} />;
}
