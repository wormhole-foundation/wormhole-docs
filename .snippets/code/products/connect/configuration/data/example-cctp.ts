import WormholeConnect, {
  AutomaticCCTPRoute,
  type config,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  routes: [AutomaticCCTPRoute],
};

<WormholeConnect config={config} />;
