'use client';

import WormholeConnect, {
  type config,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

export default function Home() {
  const config: config.WormholeConnectConfig = {
    network: 'Testnet',
    chains: ['Sui', 'Avalanche'],

    ui: {
      title: 'SUI Connect TS Demo',
    },
  };

  const theme: WormholeConnectTheme = {
    mode: 'light',
    primary: '#78c4b6',
  };
  return <WormholeConnect config={config} theme={theme} />;
}
