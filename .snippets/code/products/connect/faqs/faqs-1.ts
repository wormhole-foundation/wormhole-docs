import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  // ...
  isRouteSupportedHandler: async ({ route }) => {
    if (route === 'AutomaticTokenBridge') {
      return false;
    }
    return true; // keep other routes visible
  },
};
