---
title: Get Started
description: Run your first cross-chain, verifiable query with the Wormhole Queries SDK and Proxy, using eth_call to fetch token metadata.
categories: Queries
---

# Get Started

## Introduction

Wormhole Queries let you fetch on-chain data from supported blockchains using `eth_call`-style requests, without submitting transactions or paying gas. The Guardian network signs the result, making it verifiable and suitable for use on-chain.

This guide walks you through requesting an API key, constructing your first query using the Wormhole Query SDK, and decoding the result.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} 
 - A basic understanding of JavaScript or TypeScript
 - An RPC endpoint for a supported chain (e.g., Ethereum Sepolia)
 - A Wormhole [Queries API key](#request-an-api-key)

## Request an API Key

Wormhole Queries is in closed beta, but you can start building today.

To access the Query Proxy, you’ll need an API key. This allows you to send requests and receive signed responses from the Guardian network.

To request access, join the beta by filling out the [access form](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}. You’ll receive an API key via email once approved.

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

## Run Your First Query

Using the Wormhole Query Proxy, you will run a lightweight script that queries the `name()` of a token contract on Ethereum Sepolia. The response you receive will be signed by the Guardian network and locally decoded.

1. **Create your query file** – add a new `query.ts` script where you will write and run your query logic

    ```bash
    touch query.ts
    ```

2. **Import the required modules** – bring in the SDK, Web3, and Axios to construct and send your query

    ```typescript
    import {
    EthCallQueryRequest,
    EthCallQueryResponse,
    PerChainQueryRequest,
    QueryRequest,
    QueryResponse,
    } from '@wormhole-foundation/wormhole-query-sdk';
    import axios from 'axios';
    import * as eth from 'web3';
    ```

3.  **Set up configuration variables** – define the query target, network RPC, token address, and function selector for your request

    ```ts
    const QUERY_URL = 'https://testnet.query.wormhole.com/v1/query';
    const RPC = 'https://ethereum-sepolia.rpc.subquery.network/public';
    const CHAIN_ID = 10002; // Sepolia
    const TOKEN = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC Contract on Sepolia
    const DATA = '0x06fdde03'; // function selector for `name()`
    ```

4. **Load your API key** – access your key from the environment to authenticate requests to the Query Proxy

    ```ts
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('API_KEY is not set in your environment');
    ```

5. **Define the main function** – use an `async` wrapper to structure your script and run query logic

    ```ts
    (async () => {

    //logic goes here
    
    })();
    ```

6. **Fetch the latest block from your RPC** - Queries must reference a specific block to ensure Guardians verify data from the same state

    ```ts
    const latestBlock = (
        await axios.post(RPC, {
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
        jsonrpc: '2.0',
        })
    ).data?.result?.number;
    ```

7. **Build and send the query** - construct a query that targets the specified contract and function, serialize it, and send it to the Guardian Query Proxy

    ```ts
    const request = new QueryRequest(1, [
        new PerChainQueryRequest(CHAIN_ID, new EthCallQueryRequest(latestBlock, [{ to: TOKEN, data: DATA }])),
    ]);
    const serialized = request.serialize();

    const response = await axios.post(
        QUERY_URL,
        { bytes: Buffer.from(serialized).toString('hex') },
        { headers: { 'X-API-Key': apiKey } }
    );
    ```

8. **Decode the response** - parse the signed response and extract the result of the `eth_call` to display the token name

    ```ts
    const queryResponse = QueryResponse.from(response.data.bytes);
    const chainResponse = queryResponse.responses[0].response as EthCallQueryResponse;
    const name = eth.eth.abi.decodeParameter('string', chainResponse.results[0]);

    console.log("\n\nParsed chain response:");
    console.log(chainResponse);
    console.log('\nToken name:', name);
    ```

???- code "Complete `query.ts`"
    ```ts
    import {
    EthCallQueryRequest,
    EthCallQueryResponse,
    PerChainQueryRequest,
    QueryRequest,
    QueryResponse,
    } from '@wormhole-foundation/wormhole-query-sdk';
    import axios from 'axios';
    import * as eth from 'web3';

    const QUERY_URL = 'https://testnet.query.wormhole.com/v1/query';
    const RPC = 'https://ethereum-sepolia.rpc.subquery.network/public';
    const CHAIN_ID = 10002; // Sepolia
    const TOKEN = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC Sepolia
    const DATA = '0x06fdde03'; // function selector for `name()`

    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('API_KEY is not set in your environment');

    (async () => {

    const latestBlock = (
        await axios.post(RPC, {
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
        jsonrpc: '2.0',
        })
    ).data?.result?.number;

    const request = new QueryRequest(1, [
        new PerChainQueryRequest(CHAIN_ID, new EthCallQueryRequest(latestBlock, [{ to: TOKEN, data: DATA }])),
    ]);
    const serialized = request.serialize();

    const response = await axios.post(
        QUERY_URL,
        { bytes: Buffer.from(serialized).toString('hex') },
        { headers: { 'X-API-Key': apiKey } }
    );

    const queryResponse = QueryResponse.from(response.data.bytes);
    const chainResponse = queryResponse.responses[0].response as EthCallQueryResponse;
    const name = eth.eth.abi.decodeParameter('string', chainResponse.results[0]);

    console.log("\n\nParsed chain response:");
    console.log(chainResponse);
    console.log('\nToken name:', name);

    })();
    ```

## Execute the Query

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

