'use client'

import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

function Page() {
  const config: WormholeConnectConfig = {
    // Define the network
    network: 'Testnet',

    // Define the chains to support
    chains: [
      'Solana',
      'Sepolia',
    ],

    //Define the RPC URLs
    rpcs: {
      Solana: 'https://api.devnet.solana.com',
      Sepolia: 'https://ethereum-sepolia-rpc.publicnode.com'
    },

    // Add a title to the widget UI
    ui: {
      title: 'Wormhole Connect Demo',
    }
  };

  const theme: WormholeConnectTheme = {
    // Define mode and primary color 
    mode: 'dark',
    primary: '#78c4b6',
  };

  return <WormholeConnect config={config} theme={theme} />;
}

export default Page;