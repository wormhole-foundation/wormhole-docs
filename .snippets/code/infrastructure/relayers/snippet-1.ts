import {
  Environment,
  StandardRelayerApp,
  StandardRelayerContext,
} from '@wormhole-foundation/relayer-engine';
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk';

(async function main() {
  // initialize relayer engine app, pass relevant config options
  const app = new StandardRelayerApp<StandardRelayerContext>(
    Environment.TESTNET,
    // other app specific config options can be set here for things
    // like retries, logger, or redis connection settings.
    {
      name: 'ExampleRelayer',
    }
  );

  // add a filter with a callback that will be
  // invoked on finding a VAA that matches the filter
  app.chain(CHAIN_ID_SOLANA).address(
    // emitter address on Solana
    'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe',
    // callback function to invoke on new message
    async (ctx, next) => {
      const vaa = ctx.vaa;
      const hash = ctx.sourceTxHash;
      console.log(
        `Got a VAA with sequence: ${vaa.sequence} from with txhash: ${hash}`
      );
    }
  );

  // add and configure any other middleware ..

  // start app, blocks until unrecoverable error or process is stopped
  await app.listen();
})();
