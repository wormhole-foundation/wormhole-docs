import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectTheme,
  wormholeConnectHosted,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  /* Your config... */
};

const theme: WormholeConnectTheme = {
  mode: 'dark',
  primary: '#78c4b6',
  font: 'Comic Sans; sans-serif',
};

const container = document.getElementById('bridge-container');

wormholeConnectHosted(container, {
  config, theme
});
