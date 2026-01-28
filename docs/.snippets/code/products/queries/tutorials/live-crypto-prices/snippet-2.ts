import axios from 'axios';
import {
  EthCallQueryRequest,
  PerChainQueryRequest,
  QueryRequest,
} from '@wormhole-foundation/wormhole-query-sdk';
import { Interface } from 'ethers';

// ABI interface for Witnet's Price Router
const WITNET_IFACE = new Interface([
  // Function signature for reading the latest price feed
  'function latestPrice(bytes4 id) view returns (int256 value, uint256 timestamp, bytes32 drTxHash, uint8 status)',
]);

// Encode calldata for Witnet Router: latestPrice(bytes4)
export function encodeWitnetLatestPrice(id4: string): string {
  // Validate feed ID format (must be a 4-byte hex)
  if (!/^0x[0-9a-fA-F]{8}$/.test(id4)) {
    throw new Error(`Invalid FEED_ID4: ${id4}`);
  }
  // Return ABI-encoded call data for latestPrice(bytes4)
  return WITNET_IFACE.encodeFunctionData('latestPrice', [id4 as `0x${string}`]);
}

export async function buildEthCallRequest(params: {
  rpcUrl: string;
  chainId: number; // Wormhole chain id
  to: string;
  data: string; // 0x-prefixed calldata
}) {
  const { rpcUrl, chainId, to, data } = params;

  // Get the latest block number via JSON-RPC
  // Short timeout prevents long hangs in the dev environment
  const latestBlock: string = (
    await axios.post(
      rpcUrl,
      {
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
        jsonrpc: '2.0',
      },
      { timeout: 5_000, headers: { 'Content-Type': 'application/json' } }
    )
  ).data?.result?.number;

  if (!latestBlock) throw new Error('Failed to fetch latest block');

  // Build a Wormhole Query that wraps an EthCall to the Witnet contract
  const request = new QueryRequest(1, [
    new PerChainQueryRequest(
      chainId,
      new EthCallQueryRequest(latestBlock, [{ to, data }])
    ),
  ]);

  // Serialize to bytes for sending to the Wormhole Query Proxy
  return request.serialize(); // Uint8Array
}
