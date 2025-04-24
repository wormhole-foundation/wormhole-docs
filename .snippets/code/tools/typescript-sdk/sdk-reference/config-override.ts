const wh = await wormhole('Testnet', [solana], {
  chains: {
    Solana: {
      contracts: {
        coreBridge: '11111111111111111111111111111',
      },
      rpc: 'https://api.devnet.solana.com',
    },
  },
});