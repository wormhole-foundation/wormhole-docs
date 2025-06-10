'use client';

import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const config = {
  network: 'Testnet',
  chains: ['Sui', 'Avalanche'],
};

const theme = {
  mode: 'light',
  primary: '#78c4b6',
};

export default function Home() {
  return <WormholeConnect config={config} theme={theme} />;
}
