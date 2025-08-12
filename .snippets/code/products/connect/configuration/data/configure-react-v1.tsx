import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  chains: ['Ethereum', 'Polygon', 'Solana'],
  tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
  rpcs: {
    Ethereum: 'https://rpc.ankr.com/eth',
    Solana: 'https://rpc.ankr.com/solana',
  }
}

<WormholeConnect config={config} />
