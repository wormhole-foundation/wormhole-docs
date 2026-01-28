import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const BLOCKED_ADDRESSES = new Set<string>(['INSERT_TOKEN_ADDRESS']);

const config: config.WormholeConnectConfig = {
  // ...
  isTokenSupportedHandler: (token) => {
    // Address string provided by Connect
    const addr = token.addressString;

    if (addr && BLOCKED_ADDRESSES.has(addr)) {
      return false;
    }
    return true; // show all others
  },
};
