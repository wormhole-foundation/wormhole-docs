import {
  Environment,
  StandardRelayerApp,
  StandardRelayerContext,
} from '@wormhole-foundation/relayer-engine';
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk';

(async function main() {
  // Initialize relayer engine app and pass relevant config options
  const app = new StandardRelayerApp<StandardRelayerContext>(
    Environment.TESTNET,
    // Other app specific config options can be set here for things
    // like retries, logger, or redis connection settings
    {
      name: 'ExampleRelayer',
    }
  );

  // Add a filter with a callback that will be invoked
  // on finding a VAA that matches the filter
  app.chain(CHAIN_ID_SOLANA).address(
    // Emitter address on Solana
    'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe',
    // Callback function to invoke on new message
    async (ctx, next) => {
      const vaa = ctx.vaa;
      const hash = ctx.sourceTxHash;
      console.log(
        `Got a VAA with sequence: ${vaa.sequence} from with txhash: ${hash}`
      );
    }
  );

  // Add and configure any other middleware here

  // Start app. Blocks until unrecoverable error or process is stopped
  await app.listen();
})();
