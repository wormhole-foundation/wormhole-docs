import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
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
