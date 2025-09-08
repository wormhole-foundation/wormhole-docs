import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const BLOCKED_SOURCE_CHAINS = new Set<Chain>(['INSERT_CHAIN_NAME']);

const config: config.WormholeConnectConfig = {
  // ...
  isRouteSupportedHandler: async ({ route, fromChain }) => {
    if (
      BLOCKED_SOURCE_CHAINS.has(fromChain) &&
      route === 'AutomaticTokenBridge'
    ) {
      return false;
    }
    return true; // keep other routes visible
  },
};
