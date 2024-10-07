import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  chains: ['Ethereum', 'Solana'],
  tokens: ['ETH', 'SOL', 'BONK'],
  rpcs: {
    Ethereum: 'https://rpc.ankr.com/eth',
    Solana: 'https://rpc.ankr.com/solana',
  },
  tokensConfig: {
    BONK: {
      key: 'BONK',
      symbol: 'BONK',
      nativeChain: 'Ethereum',
      icon: Icon.ETH,
      tokenId: {
        chain: 'Ethereum',
        address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6',
      },
      coinGeckoId: 'bonk',
      decimals: 18,
    },
  },
  wrappedTokens: {
    BONK: {
      Solana: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    },
  },
};

function App() {
  return <WormholeConnect config={config} />;
}

