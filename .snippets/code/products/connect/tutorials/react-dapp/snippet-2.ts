'use client';

import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

export default function Home() {
  const config: WormholeConnectConfig = {
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
