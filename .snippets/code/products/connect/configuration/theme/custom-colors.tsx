import WormholeConnect, {
  type config,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  /* Your config... */
};

const theme: WormholeConnectTheme = {
  mode: 'dark',
  primary: '#78c4b6',
  font: 'Comic Sans; sans-serif',
};

function App() {
  return <WormholeConnect config={config} theme={theme} />;
}
