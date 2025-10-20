export const QUERY_URL = process.env.QUERY_URL!;
export const QUERIES_API_KEY = process.env.QUERIES_API_KEY!;
export const RPC_URL = process.env.RPC_URL!;

export const DEFAULTS = {
  chainId: Number(process.env.WORMHOLE_CHAIN_ID || 0),
  to: process.env.CALL_TO || '',
  feedId4: process.env.FEED_ID4 || '',
  feedDecimals: Number(process.env.FEED_DECIMALS || 0),
  feedHeartbeatSec: Number(process.env.FEED_HEARTBEAT_SEC || 0),
};
