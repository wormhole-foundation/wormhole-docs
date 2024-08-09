import { wormhole } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
(async function () {
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
  console.log(wh.config.chains.Solana);
})();
