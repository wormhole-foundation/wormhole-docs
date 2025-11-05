---
title: Live Crypto Price Widget
description: Learn how to fetch real-time crypto prices using Wormhole Queries and display them in a live widget powered by secure and verified Witnet data feeds.
categories: Queries
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
    ---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-1.ts"
    ```

## Build the Server Logic

In this section, you will implement the backend that powers the widget. You will encode the Witnet call, create and send a Wormhole Query, decode the signed response, and expose an API route for the frontend.

### Encode Witnet Call and Build the Request

First, encode the function call for Witnet's Price Router using the feed ID and package it into a Wormhole Query request. This query will be anchored to the latest block, ensuring the data you receive is verifiably tied to a recent snapshot of the chain state. This helper will return a serialized request that can be sent to the Wormhole Query Proxy.

```ts title="src/lib/queries/buildRequest.ts"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-2.ts"
```

### Send Request to the Query Proxy

Next, you will send the serialized query to the Wormhole Query Proxy, which forwards it to the Guardians for verification. The proxy returns a signed response containing the requested data and proof that the Guardians verified it. This step ensures that all the data your app consumes comes from a trusted and authenticated source.

```ts title="src/lib/queries/client.ts"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-3.ts"
```

### Decode and Verify Response

Once you receive the signed response, you will decode it to extract the Witnet price data.
Here, you will use ethers to parse the ABI-encoded return values and scale the raw integer to a readable decimal value based on the feed's configured number of decimals. This function will output a clean result containing the latest price, timestamp, and transaction reference from the Witnet feed.

```ts title="src/lib/queries/decode.ts"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-4.ts"
```

### Add Shared Types

Create a `src/lib/types.ts` file to define the structure of your API responses. These types ensure consistency between the backend and the frontend, keeping the data shape predictable and type-safe.  You will import these types in both the API route and the widget to keep your responses aligned across the app.

```ts title="src/lib/types.ts"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-5.ts"
```

### Add  API Route for Frontend

Finally, expose an API endpoint at `/api/queries`. This route ties everything together: it builds the query, sends it, decodes the response, and returns a structured JSON payload containing the current price, timestamp, block number, and a stale flag indicating whether the feed data is still fresh. The frontend widget will call this endpoint every few seconds to display the live, verified price data.

```ts title="src/app/api/queries/route.ts"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-6.ts"
```

## Price Widget

In this section, you will build a client component that fetches the signed price from your API, renders it with a freshness badge, and refreshes on an interval without overlapping requests.

### Create Widget Component

Create a client component that calls `/api/queries`, renders the current price, shows the last update time and block number, and displays a freshness badge based on the heartbeat. The component uses a ref to avoid overlapping requests and a timed interval to refresh automatically.

```ts title="src/components/PriceWidget.tsx"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-7.ts"
```

### Add the Widget to Home Page

Render the widget on the home page with a simple heading and container so users see the price as soon as they load the app.

```ts title="src/app/page.tsx"
---8<-- "code/products/queries/tutorials/live-crypto-prices/snippet-8.ts"
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