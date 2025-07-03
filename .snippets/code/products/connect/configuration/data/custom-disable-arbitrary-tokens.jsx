import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
	ui: {
		disableUserInputtedTokens: true,
	},
};

function App() {
	return <WormholeConnect config={config} />;
}
