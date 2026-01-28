import {
  EthCallQueryResponse,
  QueryResponse,
} from '@wormhole-foundation/wormhole-query-sdk';
import { Interface, Result } from 'ethers';

// ABI interface for decoding Witnet's latestPrice response
const WITNET_IFACE = new Interface([
  'function latestPrice(bytes4 id) view returns (int256 value, uint256 timestamp, bytes32 drTxHash, uint8 status)',
]);

// Parse the first EthCall result from the proxy's response
export function parseFirstEthCallResult(proxyResponse: { bytes: string }): {
  chainResp: EthCallQueryResponse;
  raw: string;
} {
  // Decode the top-level QueryResponse from Wormhole Guardians
  const qr = QueryResponse.from(proxyResponse.bytes);

  // Extract the first chain response and its raw call result
  const chainResp = qr.responses[0].response as EthCallQueryResponse;
  const raw = chainResp.results[0];
  return { chainResp, raw };
}

// Decode Witnet's latestPrice return tuple into readable fields
export function decodeWitnetLatestPrice(
  raw: string,
  decimals: number
): { price: string; timestampSec: number; drTxHash: string } {
  // Decode ABI-encoded result from the router call
  const r: Result = WITNET_IFACE.decodeFunctionResult('latestPrice', raw);
  const value = BigInt(r[0].toString());
  const timestampSec = Number(r[1].toString());
  const drTxHash = r[2] as string;

  return {
    price: scaleBigintToDecimalString(value, decimals),
    timestampSec,
    drTxHash,
  };
}

// Convert a bigint price into a human-readable decimal string
function scaleBigintToDecimalString(value: bigint, decimals: number): string {
  const zero = BigInt(0);
  const neg = value < zero ? '-' : '';
  const v = value < zero ? -value : value;
  const s = v.toString().padStart(decimals + 1, '0');
  const i = s.slice(0, -decimals);
  const f = s.slice(-decimals).replace(/0+$/, '');
  return neg + (f ? `${i}.${f}` : i);
}
