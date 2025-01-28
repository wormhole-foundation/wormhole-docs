import WormholeConnect, {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: WormholeConnectConfig = {
  routes: [...DEFAULT_ROUTES, ...nttRoutes(myNttConfig), MayanRouteSWIFT],
};

<WormholeConnect config={config} />;
