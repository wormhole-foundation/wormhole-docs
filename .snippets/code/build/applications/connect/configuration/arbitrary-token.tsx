const config: WormholeConnectConfig = {
	networks: ['solana', 'ethereum'],
	tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC', 'BSKT'],
	tokensConfig: {
		BSKT: {
			key: 'BSKT',
			symbol: 'BSKT',
			nativeChain: 'solana',
			tokenId: {
				chain: 'solana',
				address: '6gnCPhXtLnUD76HjQuSYPENLSZdG8RvDB1pTLM5aLSJA',
			},
			coinGeckoId: 'basket',
			icon: 'https://assets.coingecko.com/coins/images/34661/standard/BSKT_Logo.png?1705636891',
			color: '#2894EE',
			decimals: {
				default: 5,
			},
		},
	},
};
