import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  chains: ['Ethereum', 'Solana'],
  tokens: [
    // Whitelist BONK on every whitelisted chain
    'BONK',
    // Also whitelist USDC, specifically on Solana
    ['Solana', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
  ],
  ...
};

function App() {
  return <WormholeConnect config={config} />;
}
