import WormholeConnect, {
    AutomaticCCTPRoute,
    WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';
  
const config: WormholeConnectConfig = {
    routes: [AutomaticCCTPRoute],
};
  
<WormholeConnect config={config} />;