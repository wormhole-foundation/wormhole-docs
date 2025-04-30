---
title: Get Started with Queries
description: Run your first cross-chain, verifiable query with the Wormhole Queries SDK and Proxy, using eth_call to fetch token metadata.
categories: Queries
---

# Get Started with Queries

## Introduction

[Queries](/docs/products/queries/overview) lets you fetch on-chain data from supported blockchains using `eth_call`-style requests, without submitting transactions or paying gas. The Guardian network signs the result, making it verifiable and suitable for use on-chain.

This guide walks you through requesting an API key, constructing your first query using the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank}, and decoding the result.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} 
 - A basic understanding of JavaScript or TypeScript
 - An RPC endpoint for a supported chain (e.g., Ethereum Sepolia)
 - A Wormhole Queries API key

## Request an API Key

Wormhole Queries is in closed beta, but you can start building today.

To interact with the system, you will use the Query Proxy, a hosted service that receives your query, routes it to the appropriate chain, and returns a signed, verifiable response from the Guardian network. This allows you to fetch on-chain data without running your own infrastructure.

To request access, join the beta by filling out the [access form](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}. Once approved, you will receive an API key via email.

## Set Up Your Project

1. Create a new directory for your script and initialize a `Node.js` project:

    ```bash
    mkdir queries
    cd queries
    npm init -y
    ```

2. Install the required dependencies:

    ```bash
    npm install axios web3 @wormhole-foundation/wormhole-query-sdk
    npm install -D tsx typescript
    ```

## Create Your Query Script 

Using the Wormhole Query Proxy, you will run a lightweight script that queries the `name()` of a token contract on Ethereum Sepolia. The response you receive will be signed by the Guardian network and locally decoded.

1. **Create your query file** – add a new `query.ts` script where you will write and run your query logic

    ```bash
    touch query.ts
    ```

2. **Import the required modules** – bring in the SDK, Web3, and Axios to construct and send your query

    ```typescript
    --8<-- "code/products/queries/get-started/snippet-1.ts:1:9"
    ```

3.  **Set up configuration variables** – define the query target, network RPC, token address, and function selector for your request

    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts:11:15"
    ```

4. **Load your API key** – access your key from the environment to authenticate requests to the Query Proxy

    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts:17:18"
    ```

5. **Define the main function** – use an `async` wrapper to structure your script and run query logic

    ```ts
    (async () => {

    //logic goes here
    
    })();
    ```

6. **Fetch the latest block from your RPC** - Queries must reference a specific block to ensure Guardians verify data from the same state

    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts:21:28"
    ```

7. **Build and send the query** - construct a query that targets the specified contract and function, serialize it, and send it to the Guardian Query Proxy

    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts:30:42"
    ```

8. **Decode the response** - parse the signed response and extract the result of the `eth_call` to display the token name

    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts:44:51"
    ```

???- code "Complete `query.ts`"
    ```ts
    --8<-- "code/products/queries/get-started/snippet-1.ts"
    ```

## Run Your First Query

With your script in place, run the following command from your queries directory:

```bash
API_KEY=<INSERT_QUERIES_API_KEY> npx tsx query.ts
```

???- code "Expected Output"
    ```bash
    Parsed chain response:
    EthCallQueryResponse {
    blockNumber: 8193548n,
    blockHash: '0xef97290e043a530dd2cdf2d4c513397495029cdf2ef3e916746c837dadda51a8',
    blockTime: 1745595132000000n,
    results: [
        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045553444300000000000000000000000000000000000000000000000000000000'
    ]
    }

    Token name: USDC
    ```

## Next Steps

Now that you've successfully run your first verifiable query, you are ready to go deeper. Check out the following guides to build on what you've learned:

 - [Query Solana](https://github.com/wormhole-foundation/demo-queries-ts/blob/main/src/query_solana_stake_pool.ts){target=\_blank} – try fetching Solana stake pools to see how cross-chain queries apply beyond EVM
 - [Construct a Query](){target=\_blank} – understand how to build different query types using the SDK manually
 - [Verify a Query Response On-Chain](){target=\_blank} – use signed results in smart contracts

Browse the [Supported Networks](){target=\_blank} to see where you can query today.

