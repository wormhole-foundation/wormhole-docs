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

## Construct a Query and Decode the Response

Using the Wormhole Query Proxy, you will write a lightweight script to query a token contract's `name()` on Ethereum Sepolia. The response is signed by the Guardian network and locally decoded for use in your application.

1. Create a new directory for your script and initialize a Node.js project:

    ```bash
    mkdir queries
    cd queries
    npm init -y
    ```

2. Add the Wormhole Query SDK, Axios, Web3, and helper tools:

    ```bash
    npm install axios web3 @wormhole-foundation/wormhole-query-sdk
    npm install -D tsx typescript
    ```

3. Add a new `query.ts` script where you will write and run your query logic:

    ```bash
    touch query.ts
    ```

4. Paste the complete example script, including inline comments to explain each step of the query process:

    ```typescript
    --8<-- "code/products/queries/get-started/snippet-1.ts"
    ```

5. Use your API key to execute the script:

    ```bash
    API_KEY=<INSERT_QUERIES_API_KEY> npx tsx query.ts
    ```

The expected output should be similar to this:

--8<-- "code/products/queries/get-started/snippet-2.html"

## Next Steps

Now that you've successfully run your first verifiable query, you are ready to go deeper. Check out the following guides to build on what you've learned:

 - [Query Solana](https://github.com/wormhole-foundation/demo-queries-ts/blob/main/src/query_solana_stake_pool.ts){target=\_blank} – try fetching Solana stake pools to see how cross-chain queries apply beyond EVM
 - [Construct a Query](/docs/products/queries/guides/construct-a-query){target=\_blank} – understand how to build different query types using the SDK manually
 - [Verify a Query Response On-Chain](/docs/products/queries/guides/verify-response){target=\_blank} – use signed results in smart contracts

Browse the [Supported Networks](/docs/products/queries/reference/supported-networks){target=\_blank} to see where you can query today.

