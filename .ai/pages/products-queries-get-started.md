---
title: Get Started with Queries
description: Follow this guide to run your first multichain, verifiable query with the Wormhole Queries SDK and Proxy, using eth_call to fetch token metadata.
categories: Queries
url: https://wormhole.com/docs/products/queries/get-started/
---

# Get Started with Queries

[Queries](/docs/products/queries/overview) lets you fetch on-chain data from supported blockchains using `eth_call`-style requests without submitting transactions or paying gas. The Guardian network signs the result, making it verifiable and suitable for use on-chain.

This guide walks you through requesting an API key, constructing your first query using the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank}, and decoding the result.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
 - A basic understanding of JavaScript or TypeScript.
 - An RPC endpoint for a supported chain (e.g., Ethereum Sepolia).
 - A Wormhole Queries API key.

## Request an API Key

Wormhole Queries is in closed beta, but you can start building today.

To interact with the system, you will use the Query Proxy. This hosted service receives your query, routes it to the appropriate chain, and returns a signed, verifiable response from the Guardian network. The Query Proxy allows you to fetch on-chain data without infrastructure overhead.

To request access, join the beta by filling out the [access form](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}. Once approved, you will receive an API key via email.

## Construct a Query and Decode the Response

Using the Wormhole Query Proxy, you will write a lightweight script to query a token contract's `name()` on Ethereum Sepolia. The response is signed by the Guardian network and locally decoded for use in your application.

1. Create a new directory for your script and initialize a Node.js project:

    ```bash
    mkdir queries
    cd queries
    npm init -y
    ```

2. Add the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank}, [Axios](https://www.npmjs.com/package/axios){target=\_blank}, [Web3](https://www.npmjs.com/package/web3){target=\_blank}, and helper tools. This example uses the Queries SDK version `0.0.14`:

    ```bash
    npm install axios web3 @wormhole-foundation/wormhole-query-sdk@0.0.14
    npm install -D tsx typescript
    ```

3. Add a new `query.ts` script where you will write and run your query logic:

    ```bash
    touch query.ts
    ```

4. Paste the following script into `query.ts` to build and submit a query to the token contract's `name()` function on Ethereum Sepolia, then decode the Guardian-signed response:

    ```typescript
    // Import the SDK types and helpers for making the query
    import {
      EthCallQueryRequest,
      EthCallQueryResponse,
      PerChainQueryRequest,
      QueryRequest,
      QueryResponse,
    } from '@wormhole-foundation/wormhole-query-sdk';
    import axios from 'axios';
    import * as eth from 'web3';

    // Define the endpoint and query parameters
    const query_url = 'https://testnet.query.wormhole.com/v1/query';
    const rpc = 'https://ethereum-sepolia.rpc.subquery.network/public';
    const chain_id = 10002; // Sepolia (Wormhole chain ID)
    const token = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC contract
    const data = '0x06fdde03'; // function selector for `name()`

    // Load your API key from environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('API_KEY is not set in your environment');

    (async () => {
      // Fetch the latest block number (required to anchor the query)
      const latestBlock = (
        await axios.post(rpc, {
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
          id: 1,
          jsonrpc: '2.0',
        })
      ).data?.result?.number;

      // Build the query targeting the token contract's name() function
      const request = new QueryRequest(1, [
        new PerChainQueryRequest(
          chain_id,
          new EthCallQueryRequest(latestBlock, [{ to: token, data: data }])
        ),
      ]);
      const serialized = request.serialize();

      // Send the query to the Wormhole Query Proxy
      const response = await axios.post(
        query_url,
        { bytes: Buffer.from(serialized).toString('hex') },
        { headers: { 'X-API-Key': apiKey } }
      );

      // Decode the response returned by the Guardian network
      const queryResponse = QueryResponse.from(response.data.bytes);
      const chainResponse = queryResponse.responses[0]
        .response as EthCallQueryResponse;
      const name = eth.eth.abi.decodeParameter('string', chainResponse.results[0]);

      // Output the results
      console.log('\n\nParsed chain response:');
      console.log(chainResponse);
      console.log('\nToken name:', name);
    })();

    ```

5. Use your API key to execute the script:

    ```bash
    API_KEY=INSERT_QUERIES_API_KEY npx tsx query.ts
    ```

The expected output should be similar to this:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>API_KEY=123_456_789 npx tsx query.ts</span>
	<span data-ty>Parsed chain response:</span>
	<span data-ty>EthCallQueryResponse {</span>
	<span data-ty>blockNumber: 8193548n,</span>
	<span data-ty>blockHash: '0xef97290e043a530dd2cdf2d4c513397495029cdf2ef3e916746c837dadda51a8',</span>
    <span data-ty>blockTime: 1745595132000000n,</span>
    <span data-ty>results: [ '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000045553444300000000000000000000000000000000000000000000000000000000']</span>
    <span data-ty>} </span>
    <span data-ty>  </span>
    <span data-ty>Token name: USDC</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

## Next Steps

Now that you've successfully run your first verifiable query, you are ready to go deeper. Check out the following guides to build on what you've learned:

- **[Query Solana](https://github.com/wormhole-foundation/demo-queries-ts/blob/main/src/query_solana_stake_pool.ts){target=\_blank}**: Try fetching Solana stake pools to see how cross-chain queries apply beyond EVM.
- **[Use Queries](/docs/products/queries/guides/use-queries){target=\_blank}**: Take a deeper look at the complete Queries lifecycle.
- **Browse the [Supported Networks](/docs/products/queries/reference/supported-networks){target=\_blank}**: See where Queries are supported.
