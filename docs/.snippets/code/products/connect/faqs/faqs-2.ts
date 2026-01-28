import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const BLOCKED_ADDRESSES = new Set<string>(['INSERT_TOKEN_ADDRESS']);

const config: config.WormholeConnectConfig = {
  // ...
  isRouteSupportedHandler: async ({ route, fromToken }) => {
    const tokenAddress =
      fromToken.tokenId !== 'native' ? fromToken.tokenId.address : 'native';

    if (
      BLOCKED_ADDRESSES.has(tokenAddress) &&
      route === 'AutomaticTokenBridge'
    ) {
      return false;
    }
    return true; // keep other routes visible
  },
};
