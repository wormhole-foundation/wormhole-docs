

import WormholeConnect, {
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  "ui": {
    "showHamburgerMenu": false,
    "menu": [
      {
        "label": "Advance Tools",
        "href": "https://portalbridge.com",
        "target": "_self",
        "order": 1
      }
    ]
  }
}

function App() {
  return <WormholeConnect config={config} />;
}
