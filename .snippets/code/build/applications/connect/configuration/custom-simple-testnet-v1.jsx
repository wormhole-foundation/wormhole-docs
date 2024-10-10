import WormholeConnect, {
	WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
	// You can use Connect with testnet chains by specifying "network":
	network: 'Testnet',
	chains: ['Sepolia', 'ArbitrumSepolia', 'BaseSepolia', 'Avalanche'],
	rpcs: {
		Avalanche: 'https://rpc.ankr.com/avalanche_fuji',
		BaseSepolia: 'https://base-sepolia-rpc.publicnode.com',
	},
};

function App() {
	return <WormholeConnect config={config} />;
}
