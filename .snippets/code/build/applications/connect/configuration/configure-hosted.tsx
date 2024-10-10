import WormholeConnect, {
	wormholeConnectHosted,
	WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
	chains: ['Ethereum', 'Polygon', 'Solana'],
	tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
	rpcs: {
		Ethereum: 'https://rpc.ankr.com/eth',
		Solana: 'https://rpc.ankr.com/solana',
	},
};

const container = document.getElementById('bridge-container');

wormholeConnectHosted(container, {
	config,
});
