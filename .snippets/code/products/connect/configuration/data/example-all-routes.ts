import WormholeConnect, {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  type config,
} from '@wormhole-foundation/wormhole-connect';

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: config.WormholeConnectConfig = {
  routes: [...DEFAULT_ROUTES, ...nttRoutes(myNttConfig), MayanRouteSWIFT],
};

<WormholeConnect config={config} />;
