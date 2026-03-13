import WormholeConnect, {
  DEFAULT_ROUTES,
  MayanRouteSWIFT,
  type config,
} from '@wormhole-foundation/wormhole-connect';
import { nttExecutorRoute } from '@wormhole-foundation/wormhole-connect/ntt';

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: config.WormholeConnectConfig = {
  routes: [...DEFAULT_ROUTES, nttExecutorRoute({ ntt: myNttConfig }), MayanRouteSWIFT],
};

<WormholeConnect config={config} />;
