import { NextResponse } from 'next/server';
import {
  buildEthCallRequest,
  encodeWitnetLatestPrice,
} from '@/lib/queries/buildRequest';
import { postQuery } from '@/lib/queries/client';
import { QUERY_URL, QUERIES_API_KEY, RPC_URL, DEFAULTS } from '@/lib/config';
import {
  parseFirstEthCallResult,
  decodeWitnetLatestPrice,
} from '@/lib/queries/decode';
import type { QueryApiSuccess, QueryApiError } from '@/lib/types';

export async function GET() {
  const t0 = Date.now();
  try {
    // Encode the call for Witnet’s latestPrice(bytes4)
    const data = encodeWitnetLatestPrice(DEFAULTS.feedId4);

    // Build a Wormhole Query request anchored to the latest block
    const bytes = await buildEthCallRequest({
      rpcUrl: RPC_URL,
      chainId: DEFAULTS.chainId,
      to: DEFAULTS.to,
      data,
    });
    const t1 = Date.now();

    // Send the query to the Wormhole Query Proxy and await the signed response
    const proxyResponse = await postQuery({
      queryUrl: QUERY_URL,
      apiKey: QUERIES_API_KEY,
      bytes,
      timeoutMs: 25_000,
    });
    const t2 = Date.now();

    // Decode the signed Guardian response and extract Witnet data
    const { chainResp, raw } = parseFirstEthCallResult(proxyResponse);
    const { price, timestampSec } = decodeWitnetLatestPrice(
      raw,
      DEFAULTS.feedDecimals
    );

    // Log the latency of each leg for debugging
    console.log(`RPC ${t1 - t0}ms → Proxy ${t2 - t1}ms`);

    // Mark data as stale if older than the feed’s heartbeat interval
    const heartbeat = Number(process.env.FEED_HEARTBEAT_SEC || 0);
    const stale = heartbeat > 0 && Date.now() / 1000 - timestampSec > heartbeat;

    // Return a normalized JSON payload for the frontend
    const body: QueryApiSuccess = {
      ok: true,
      blockNumber: chainResp.blockNumber.toString(),
      blockTimeMicros: chainResp.blockTime.toString(),
      price,
      decimals: DEFAULTS.feedDecimals,
      updatedAt: new Date(timestampSec * 1000).toISOString(),
      stale,
    };
    return NextResponse.json(body);
  } catch (e: unknown) {
    // Catch and return a structured error
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error in /api/queries:', message);
    const body: QueryApiError = { ok: false, error: message };
    return NextResponse.json(body, { status: 500 });
  }
}
