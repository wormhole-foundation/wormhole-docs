---
title: Live Crypto Price Widget
description: Learn how to fetch real-time crypto prices using Wormhole Queries and display them in a live widget powered by secure and verified Witnet data feeds.
categories: Queries
---

# Live Crypto Price Widget

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/e2e-tutorial-live-crypto-prices){target=\_blank}

In this tutorial, you'll build a widget that displays live crypto prices using [Wormhole Queries](/docs/products/queries/overview/){target=\_blank} and [Witnet](https://witnet.io/){target=\_blank} data feeds. You'll learn how to request signed price data from the network, verify the response, and show it in a responsive frontend built with [Next.js](https://nextjs.org/){target=\_blank} and [TypeScript](https://www.typescriptlang.org/){target=\_blank}.

Wormhole Queries make it possible to fetch verified off-chain data directly on-chain or in web applications without needing your own oracle infrastructure. Each response is cryptographically signed by the [Wormhole Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank}, ensuring authenticity and preventing tampering. By combining Queries with Witnet's decentralized price feeds, you can access real-time, trustworthy market data through a single API call, without managing relayers or custom backends.

## Prerequisites

Before starting, make sure you have the following set up:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your system
 - A [Wormhole Queries API key](/docs/products/queries/get-started/#request-an-api-key){target=\_blank}
 - Access to an EVM-compatible [testnet RPC](https://chainlist.org/?testnets=true){target=\_blank}, such as Arbitrum Sepolia
 - A [Witnet data feed identifier](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses){target=\_blank} (this tutorial uses the ETH/USD feed as an example)

!!! note
    You can use a different Witnet feed or testnet if you prefer. Make sure to update the environment variables later in this tutorial with the correct values for your setup.

## Project Setup

In this section, you will create a new Next.js project, install the required dependencies, and configure the environment variables needed to fetch data from Wormhole Queries.

1. **Create a new Next.js app**: Enable TypeScript, Tailwind CSS, and the `src/` directory when prompted. Other options are up to you. 

    ```bash
    npx create-next-app@latest live-crypto-prices
    cd live-crypto-prices
    ```

2. **Install dependencies**: Add the required packages.

    ```bash
    npm install @wormhole-foundation/wormhole-query-sdk axios ethers
    ```

    - [`@wormhole-foundation/wormhole-query-sdk`](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank}: Build, send, and decode Wormhole Queries.
    - [`axios`](https://www.npmjs.com/package/axios){target=\_blank}: Make JSON-RPC and Query Proxy requests.
    - [`ethers`](https://www.npmjs.com/package/ethers){target=\_blank}: Handle ABI encoding and decoding for Witnet calls.

3. **Add environment variables**: Create a file named `.env.local` in the project root.

    ```env
    # Wormhole Query Proxy
    QUERY_URL=https://testnet.query.wormhole.com/v1/query
    QUERIES_API_KEY=INSERT_API_KEY

    # Chain and RPC
    WORMHOLE_CHAIN_ID=10003
    RPC_URL=https://arbitrum-sepolia.drpc.org

    # Witnet Price Router on Arbitrum Sepolia
    CALL_TO=0x1111AbA2164AcdC6D291b08DfB374280035E1111

    # ETH/USD feed on Witnet, six decimals
    FEED_ID4=0x3d15f701
    FEED_DECIMALS=6
    FEED_HEARTBEAT_SEC=86400
    ```

    !!! warning
        Make sure to add the `.env.local` file to your `.gitignore` to exclude it from version control. Never commit API keys to your repository.

    You can choose a different Witnet feed or network if you prefer. Just update `CALL_TO`, `FEED_ID4`, `FEED_DECIMALS`, and `WORMHOLE_CHAIN_ID`.
    
    They allow the app to fetch a live ETH/USD price with proper scaling, timestamps, and a signed response.

4. **Add a configuration file**: Create `src/lib/config.ts` to access environment variables throughout the app.

    ```typescript
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
    ```

## Build the Server Helpers

1. Encode the Witnet call and build the request. Create a `src/lib/queries/buildRequest.ts` file:

    ```typescript
    import axios from 'axios';
    import {
    EthCallQueryRequest,
    PerChainQueryRequest,
    QueryRequest,
    } from '@wormhole-foundation/wormhole-query-sdk';
    import { Interface } from 'ethers';

    const WITNET_IFACE = new Interface([
    // matches the proxy’s Read as Proxy surface
    'function latestPrice(bytes4 id) view returns (int256 value, uint256 timestamp, bytes32 drTxHash, uint8 status)',
    ]);

    /** Encode calldata for Witnet Router: latestPrice(bytes4) */
    export function encodeWitnetLatestPrice(id4: string): string {
    if (!/^0x[0-9a-fA-F]{8}$/.test(id4)) {
        throw new Error(`Invalid FEED_ID4: ${id4}`);
    }
    return WITNET_IFACE.encodeFunctionData('latestPrice', [id4 as `0x${string}`]);
    }

    export async function buildEthCallRequest(params: {
    rpcUrl: string;
    chainId: number; // Wormhole chain id
    to: string;
    data: string; // 0x-prefixed calldata
    }) {
    const { rpcUrl, chainId, to, data } = params;

    // Fetch the latest block, short timeout so the request never hangs
    const latestBlock: string = (
        await axios.post(
        rpcUrl,
        { method: 'eth_getBlockByNumber', params: ['latest', false], id: 1, jsonrpc: '2.0' },
        { timeout: 5_000, headers: { 'Content-Type': 'application/json' } }
        )
    ).data?.result?.number;

    if (!latestBlock) throw new Error('Failed to fetch latest block');

    const request = new QueryRequest(1, [
        new PerChainQueryRequest(chainId, new EthCallQueryRequest(latestBlock, [{ to, data }]))
    ]);

    return request.serialize(); // Uint8Array
    }
    ```

    This module encodes `latestPrice(bytes4)` with your feed id, anchors the call to the latest block, and serializes a single chain `EthCallQueryRequest`.

2. Post the serialized query to the Query Proxy. Create a `src/lib/queries/client.ts` file:

    ```typescript
    import axios from 'axios';

    export async function postQuery({
    queryUrl,
    apiKey,
    bytes,
    timeoutMs = 25_000,
    }: {
    queryUrl: string;
    apiKey: string;
    bytes: Uint8Array;
    timeoutMs?: number;
    }) {
    const res = await axios.post(
        queryUrl,
        { bytes: Buffer.from(bytes).toString('hex') },
        {
        timeout: timeoutMs,
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        validateStatus: (s) => s === 200,
        }
    );
    return res.data; // throws on non-200
    }
    ```

    This sends your serialized request to the Proxy and returns the raw payload that contains the Guardian signed response.

3. Parse and decode the response. Create a `src/lib/queries/decode.ts` file:

    ```typescript
    import { EthCallQueryResponse, QueryResponse } from '@wormhole-foundation/wormhole-query-sdk';
    import { Interface, Result } from 'ethers';

    const WITNET_IFACE = new Interface([
    'function latestPrice(bytes4 id) view returns (int256 value, uint256 timestamp, bytes32 drTxHash, uint8 status)',
    ]);

    export function parseFirstEthCallResult(proxyResponse: { bytes: string }): {
    chainResp: EthCallQueryResponse;
    raw: string;
    } {
    const qr = QueryResponse.from(proxyResponse.bytes);
    const chainResp = qr.responses[0].response as EthCallQueryResponse;
    const raw = chainResp.results[0]; // hex string
    return { chainResp, raw };
    }

    export function decodeWitnetLatestPrice(
    raw: string,
    decimals: number
    ): { price: string; timestampSec: number; drTxHash: string } {
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

    function scaleBigintToDecimalString(value: bigint, decimals: number): string {
    const zero = BigInt(0);
    const neg = value < zero ? '-' : '';
    const v = value < zero ? -value : value;
    const s = v.toString().padStart(decimals + 1, '0');
    const i = s.slice(0, -decimals);
    const f = s.slice(-decimals).replace(/0+$/, '');
    return neg + (f ? `${i}.${f}` : i);
    }
    ```

    This parses the first `EthCall` result from the proxy response, decodes Witnet’s tuple, and scales the integer value to a human readable string.

## Add Shared Types

Create a `src/lib/types.ts` file:

```typescript
export interface QueryApiSuccess {
	ok: true;
	blockNumber: string;
	blockTimeMicros: string;
	price: string;
	decimals: number;
	updatedAt: string;
	stale?: boolean;
}

export interface QueryApiError {
	ok: false;
	error: string;
}
export type QueryApiResponse = QueryApiSuccess | QueryApiError;
```

These types ensure that both your API route and frontend stay consistent.

## Create the API Route

Create a `src/app/api/queries/route.ts` file:

```typescript
import { NextResponse } from 'next/server';
import { buildEthCallRequest, encodeWitnetLatestPrice } from '@/lib/queries/buildRequest';
import { postQuery } from '@/lib/queries/client';
import { QUERY_URL, QUERIES_API_KEY, RPC_URL, DEFAULTS } from '@/lib/config';
import { parseFirstEthCallResult, decodeWitnetLatestPrice } from '@/lib/queries/decode';
import type { QueryApiSuccess, QueryApiError } from '@/lib/types';

export async function GET() {
	const t0 = Date.now();
	try {
		const data = encodeWitnetLatestPrice(DEFAULTS.feedId4);

		const bytes = await buildEthCallRequest({
			rpcUrl: RPC_URL,
			chainId: DEFAULTS.chainId,
			to: DEFAULTS.to,
			data,
		});
		const t1 = Date.now();

		const proxyResponse = await postQuery({
			queryUrl: QUERY_URL,
			apiKey: QUERIES_API_KEY,
			bytes,
			timeoutMs: 25_000,
		});
		const t2 = Date.now();

		const { chainResp, raw } = parseFirstEthCallResult(proxyResponse);
		const { price, timestampSec } = decodeWitnetLatestPrice(raw, DEFAULTS.feedDecimals);

		// Log timings so we can see which leg is slow
		console.log(`RPC ${t1 - t0}ms → Proxy ${t2 - t1}ms`);

		const heartbeat = Number(process.env.FEED_HEARTBEAT_SEC || 0);
		const stale = heartbeat > 0 && Date.now() / 1000 - timestampSec > heartbeat;

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
		const message = e instanceof Error ? e.message : String(e);
		console.error('Error in /api/queries:', message);
		const body: QueryApiError = { ok: false, error: message };
		return NextResponse.json(body, { status: 500 });
	}
}
```

That gives you a clean endpoint at `/api/price` which returns a small JSON payload with the price, timestamp, block number, and a stale flag based on the feed heartbeat.

If you are ready, next we can create the PriceWidget component that calls this route, renders the value, and auto refreshes on an interval.

## Price Widget

1. Create `src/components/PriceWidget.tsx`:

    ```typescript
    'use client';

    import { useEffect, useRef, useState } from 'react';

    type ApiOk = {
        ok: true;
        asset: string;
        price: string;
        updatedAt: number | string;
        blockNumber: string;
        ageSec: number;
        stale: boolean;
    };

    type ApiErr = { ok: false; error: string };

    function formatTime(ts: number | string) {
        let n: number;
        if (typeof ts === 'string') {
            const numeric = Number(ts);
            if (Number.isFinite(numeric)) {
                n = numeric;
            } else {
                const parsed = new Date(ts);
                return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
            }
        } else {
            n = ts;
        }
        if (!Number.isFinite(n)) return '—';
        // If it looks like seconds, convert to ms
        const ms = n < 1_000_000_000_000 ? n * 1000 : n;
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }

    export default function PriceWidget() {
        const [data, setData] = useState<ApiOk | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);
        const timer = useRef<NodeJS.Timeout | null>(null);
        const inFlight = useRef(false);

        async function fetchPrice() {
            if (inFlight.current) return;
            inFlight.current = true;
            setLoading(true);
            setError(null);

            try {
                const res = await fetch('/api/queries', { cache: 'no-store' });
                const json: ApiOk | ApiErr = await res.json();
                if (!json.ok) throw new Error(json.error);
                setData(json);
            } catch (e: any) {
                setError(e?.message || 'Failed to fetch price');
            } finally {
                setLoading(false);
                inFlight.current = false;
            }
        }

        useEffect(() => {
            fetchPrice();
            timer.current = setInterval(fetchPrice, 30_000);
            return () => {
                if (timer.current) clearInterval(timer.current);
            };
        }, []);

        return (
            <div className='mx-auto w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm'>
                <div className='mb-4 flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>Live Price</h2>
                    {data?.stale ? (
                        <span className='rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800'>
                            Stale
                        </span>
                    ) : (
                        <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800'>
                            Fresh
                        </span>
                    )}
                </div>

                <div className='space-y-2'>
                    <div className='text-3xl font-bold tabular-nums'>
                        {loading && !data ? 'Loading…' : data ? data.price : '—'}
                    </div>

                    <div className='text-sm text-gray-600'>
                        {data ? (
                            <>
                                Updated at {formatTime(data.updatedAt)}, block {data.blockNumber}
                            </>
                        ) : error ? (
                            <span className='text-red-600'>{error}</span>
                        ) : (
                            'Fetching latest price'
                        )}
                    </div>
                </div>

                <div className='mt-4'>
                    <button
                        onClick={fetchPrice}
                        className='w-full rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90'
                        disabled={loading}
                    >
                        {loading ? 'Refreshing…' : 'Refresh now'}
                    </button>
                </div>
            </div>
        );
    }
    ```

2. Add it to the home page at `src/app/page.tsx`:

    ```typescript
    import PriceWidget from '@/components/PriceWidget';

    export default function Page() {
        return (
            <main className='mx-auto flex max-w-2xl flex-col items-center p-6'>
                <h1 className='mb-6 text-center text-2xl font-bold'>Live Crypto Price Widget</h1>
                <PriceWidget />
            </main>
        );
    }
    ```

3. Run the app:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see your app running. You should see the widget displaying the current ETH/USD price, along with the last update time, the block number, and a freshness badge showing whether the data is still within its heartbeat window.

The price will not update every few seconds, because Witnet feeds refresh only when a particular time or price deviation threshold is reached. This ensures data remains reliable and prevents unnecessary network updates.

Your app should look like this:

![Frontend of Queries Live Prices Widget](/docs/images/products/queries/tutorials/live-crypto-prices/live-crypto-prices-1.webp){.half}