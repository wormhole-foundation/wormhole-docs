---
title: Live Crypto Price Widget
description: Learn how to fetch real-time crypto prices using Wormhole Queries and display them in a live widget powered by secure and verified Witnet data feeds.
categories: Queries
url: https://wormhole.com/docs/products/queries/tutorials/live-crypto-prices/
---

# Live Crypto Price Widget

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/e2e-tutorial-live-crypto-prices){target=\_blank}

In this tutorial, you'll build a widget that displays live crypto prices using [Wormhole Queries](/docs/products/queries/overview/){target=\_blank} and [Witnet](https://witnet.io/){target=\_blank} data feeds. You'll learn how to request signed price data from the network, verify the response, and show it in a responsive frontend built with [Next.js](https://nextjs.org/){target=\_blank} and [TypeScript](https://www.typescriptlang.org/){target=\_blank}.

Queries enable fetching verified off-chain data directly on-chain or in web applications without requiring your own oracle infrastructure. Each response is cryptographically signed by the [Wormhole Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank}, ensuring authenticity and preventing tampering. By combining Queries with Witnet's decentralized price feeds, you can access real-time, trustworthy market data through a single API call, without managing relayers or custom backends.

## Prerequisites

Before starting, make sure you have the following set up:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your system
 - A [Wormhole Queries API key](/docs/products/queries/get-started/#request-an-api-key){target=\_blank}
 - Access to an EVM-compatible [testnet RPC](https://chainlist.org/?testnets=true){target=\_blank}, such as Arbitrum Sepolia
 - A [Witnet data feed identifier](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses){target=\_blank} (this tutorial uses the ETH/USD feed as an example)

    You can use a different Witnet feed or testnet if you prefer. Make sure to update the environment variables later in this tutorial with the correct values for your setup.

## Project Setup

In this section, you will create a new Next.js project, install the required dependencies, and configure the environment variables needed to fetch data from Wormhole Queries.

1. **Create a new Next.js app**: Enable TypeScript, Tailwind CSS, and the `src/` directory when prompted. You can configure the remaining options as you like. Create your app using the following command: 

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

    You can use a different Witnet feed or network by updating `CALL_TO`, `FEED_ID4`, `FEED_DECIMALS`, and `WORMHOLE_CHAIN_ID`. These values allow the app to fetch a live ETH/USD price with proper scaling, timestamps, and a signed response.
    

4. **Add a configuration file**: Create `src/lib/config.ts` to access environment variables throughout the app.

    ```ts title="src/lib/config.ts"
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

## Build the Server Logic

In this section, you will implement the backend that powers the widget. You will encode the Witnet call, create and send a Wormhole Query, decode the signed response, and expose an API route for the frontend.

### Encode Witnet Call and Build the Request

First, encode the function call for Witnet's Price Router using the feed ID and package it into a Wormhole Query request. This query will be anchored to the latest block, ensuring the data you receive is verifiably tied to a recent snapshot of the chain state. This helper will return a serialized request that can be sent to the Wormhole Query Proxy.

```ts title="src/lib/queries/buildRequest.ts"
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

```

### Send Request to the Query Proxy

Next, you will send the serialized query to the Wormhole Query Proxy, which forwards it to the Guardians for verification. The proxy returns a signed response containing the requested data and proof that the Guardians verified it. This step ensures that all the data your app consumes comes from a trusted and authenticated source.

```ts title="src/lib/queries/client.ts"
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
  // Convert the query bytes to hex and POST to the proxy
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

### Decode and Verify Response

Once you receive the signed response, you will decode it to extract the Witnet price data.
Here, you will use ethers to parse the ABI-encoded return values and scale the raw integer to a readable decimal value based on the feed's configured number of decimals. This function will output a clean result containing the latest price, timestamp, and transaction reference from the Witnet feed.

```ts title="src/lib/queries/decode.ts"
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

```

### Add Shared Types

Create a `src/lib/types.ts` file to define the structure of your API responses. These types ensure consistency between the backend and the frontend, keeping the data shape predictable and type-safe.  You will import these types in both the API route and the widget to keep your responses aligned across the app.

```ts title="src/lib/types.ts"
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

### Add  API Route for Frontend

Finally, expose an API endpoint at `/api/queries`. This route ties everything together: it builds the query, sends it, decodes the response, and returns a structured JSON payload containing the current price, timestamp, block number, and a stale flag indicating whether the feed data is still fresh. The frontend widget will call this endpoint every few seconds to display the live, verified price data.

```ts title="src/app/api/queries/route.ts"
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

```

## Price Widget

In this section, you will build a client component that fetches the signed price from your API, renders it with a freshness badge, and refreshes on an interval without overlapping requests.

### Create Widget Component

Create a client component that calls `/api/queries`, renders the current price, shows the last update time and block number, and displays a freshness badge based on the heartbeat. The component uses a ref to avoid overlapping requests and a timed interval to refresh automatically.

```ts title="src/components/PriceWidget.tsx"
'use client';

import { useEffect, useRef, useState } from 'react';

// Expected API success shape from /api/queries
type ApiOk = {
  ok: true;
  price: string;
  updatedAt: number | string;
  blockNumber: string;
  blockTimeMicros: number;
  decimals: number;
  stale: boolean;
};

// API error shape
type ApiErr = { ok: false; error: string };

// Format timestamps for display
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
  // UI state: fetched data, loading state, and any errors
  const [data, setData] = useState<ApiOk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep track of polling and prevent overlapping requests
  const timer = useRef<NodeJS.Timeout | null>(null);
  const inFlight = useRef(false);

  // Fetch price data from the API route
  async function fetchPrice() {
    if (inFlight.current) return; // avoid concurrent requests
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

  // Fetch immediately and refresh every 30 seconds
  useEffect(() => {
    fetchPrice();
    timer.current = setInterval(fetchPrice, 30_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">ETH/USD Live Price</h2>
        {data?.stale ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
            Stale
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Fresh
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold tabular-nums">
          {loading && !data ? 'Loading…' : data ? data.price : '—'}
        </div>

        <div className="text-sm text-gray-600">
          {data ? (
            <>
              Updated at {formatTime(data.updatedAt)}, block {data.blockNumber}
            </>
          ) : error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            'Fetching latest price'
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={fetchPrice}
          className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh now'}
        </button>
      </div>
    </div>
  );
}

```

### Add the Widget to Home Page

Render the widget on the home page with a simple heading and container so users see the price as soon as they load the app.

```ts title="src/app/page.tsx"
import PriceWidget from '@/components/PriceWidget';

export default function Page() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Live Crypto Price Widget
      </h1>
      <PriceWidget />
    </main>
  );
}

```

## Run the App

Start the development server and confirm that the live widget displays data correctly:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running. You should see the widget display the current ETH/USD price, the last update time, the block number, and a freshness badge indicating whether the data is still within its heartbeat window.

The price may update only intermittently. Witnet feeds refresh only when a particular time or price deviation threshold is reached to prevent unnecessary network updates.

Your app should look like this:

![Frontend of Queries Live Prices Widget](/docs/images/products/queries/tutorials/live-crypto-prices/live-crypto-prices-1.webp){.half}

???- tip "Troubleshooting"
    If you encounter a “Request failed with status code 403” error, it likely means your Queries API key is missing or incorrect. Check the `QUERIES_API_KEY` value in your `.env.local` file and restart the development server after updating it.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in the Wormhole's Queries [Tutorial GitHub repository](https://github.com/wormhole-foundation/e2e-tutorial-live-crypto-prices){target=\_blank}.

## Conclusion

You've successfully built a live crypto price widget that fetches verified data from Wormhole Queries and Witnet. Your app encodes a feed request, sends it through the Guardian network for verification, and displays the latest signed price in a simple, responsive widget.

The Queries flow can be extended to fetch other on-chain data or integrate multiple feeds for dashboards and analytics tools.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
