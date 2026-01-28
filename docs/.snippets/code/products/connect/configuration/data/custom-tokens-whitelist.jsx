import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
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
      icon: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587',
      tokenId: {
        chain: 'Ethereum',
        address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6',
      },
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
