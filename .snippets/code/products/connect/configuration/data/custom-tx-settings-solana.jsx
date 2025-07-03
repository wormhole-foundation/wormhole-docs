import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
	transactionSettings: {
		Solana: {
			priorityFee: {
				// Number between 0-1, defaults to 0.9. Higher percentile yields higher fees.
				// For example, you can set percentile to 0.95 to make Connect compute the
				// 95th percentile priority fee amount based on recent transactions
				percentile: 0.95,

				// Any number, defaults to 1.0. The fee amount is multiplied by this number.
				// This can be used to further raise or lower the fees Connect is using.
				// For example, percentile=0.95 and percentileMultiple=1.1 would use
				// the 95th percentile fee, with a 10% increase
				percentileMultiple: 1.1,

				// Minimum fee you want to use in microlamports, regardless of recent transactions
				// Defaults to 1
				min: 200_000,

				// Maximum fee you want to use in microlamports, regardless of recent transactions
				// Defaults to 100,000,000
				max: 5_000_000,
			},
		},
	},
};

function App() {
	return <WormholeConnect config={config} />;
}
