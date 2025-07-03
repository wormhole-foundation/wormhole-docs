import { wormholeConnectHosted } from '@wormhole-foundation/wormhole-connect';

// Existing DOM element where you want to mount Connect
const container = document.getElementById('bridge-container');
if (!container) {
  throw new Error("Element with id 'connect' not found");
}

wormholeConnectHosted(container, {
  config: {
    rpcs: {
      // ...
    },
  },
  theme: {
    background: {
      default: '#004547',
    },
  },
});
