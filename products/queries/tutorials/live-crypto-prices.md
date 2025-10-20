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
 - [Next.js](https://nextjs.org/docs/app/getting-started/installation){target=\_blank} project environment (you can use an existing one or create a new app)
 - A Wormhole Queries API key, you can get one from the Queries dashboard
 - Access to an EVM-compatible [testnet RPC](https://chainlist.org/?testnets=true){target=\_blank}, such as Arbitrum Sepolia
 - A [Witnet data feed identifier](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses){target=\_blank} (this tutorial uses the ETH/USD feed as an example)

!!! note
    You can use a different Witnet feed or testnet if you prefer. Make sure to update the environment variables later in this tutorial with the correct values for your setup.

## Project Setup

1. Create a new Next.js app:

    ```bash
    npx create-next-app@latest live-crypto-prices
    cd live-crypto-prices
    ```

    Enable TypeScript, Tailwind CSS, and the `src/` directory when prompted. Other options are up to you. 

2. Install dependencies:

    ```bash
    npm install @wormhole-foundation/wormhole-query-sdk axios ethers
    ```

3. Start the dev server to verify the base app:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the default Next.js welcome page.

## Configure the Environment

Create a file named `.env.local` in the project root, then paste the following values. These defaults use Arbitrum Sepolia as the example network; you can replace them later with any supported chain or Witnet feed.

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

These values will let the app fetch a live ETH, USD price with proper scaling, timestamps, and a signed response.

Next, create a small configuration file at `src/lib/config.ts` to access these environment variables in your code easily:

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

You can choose a different Witnet feed or network if you prefer. Just update `CALL_TO`, `FEED_ID4`, `FEED_DECIMALS`, and `WORMHOLE_CHAIN_ID`, then restart the dev server so the new environment values are loaded.

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

