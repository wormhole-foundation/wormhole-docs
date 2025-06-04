import WormholeConnect, {
  config,
} from '@wormhole-foundation/wormhole-connect';

const connectConfig: config.WormholeConnectConfig = {
  networks: ['ethereum', 'polygon', 'solana'],
  tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
  rpcs: {
    ethereum: 'https://rpc.ankr.com/eth',
    solana: 'https://rpc.ankr.com/solana',
  }
}

// ...

<WormholeConnect config={connectConfig} />