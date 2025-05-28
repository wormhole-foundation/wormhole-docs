---
title: Submit a Query Request
description: Learn how to build a Wormhole QueryRequest to fetch data such as the total supply of WETH on Ethereum.
categories: Queries
---

# Submit a Query Request

## Construct a Query

Use the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} to build a `QueryRequest`. This request defines what data to fetch and from which chain. In this example, we'll construct an `EthCallQueryRequest` to get the total supply of WETH on Ethereum using an `eth_call`.

### Install Dependencies

You’ll need the following packages to create and send a query:

```bash
npm install @wormhole-foundation/wormhole-query-sdk axios
```

### Prepare the Call Data

To construct an `EthCallQueryRequest`, you need the block number or hash and the ABI-encoded call data.

The query requires the following:

- **Chain ID**: Wormhole chain ID for Ethereum is `2`
- **Contract address**: WETH – `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **Function signature**: `totalSupply()` encoded as `0x18160ddd`
- **Block number**: the block tag that determines which block state to query (e.g. `latest`)

You can request the latest block from a public node using `eth_getBlockByNumber`.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:12:12'
--8<-- 'code/build/queries/use-queries/test-full.jsx:19:26'
```

Then construct the call data.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:13:16'
```

### Create the QueryRequest

Now that you have the block number and call data, you can put it all together in a `QueryRequest`.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:44:53'
```

This request consists of one `PerChainQueryRequest`, which is an `EthCallQueryRequest` to Ethereum. You can use `console.log` to print the JSON object and review the structure.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:54:54'
// {
//   "nonce": 0,
//   "requests": [
//     {
//       "chainId": 2,
//       "query": {
//         "callData": [
//           {
//             "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//             "data": "0x18160ddd"
//           }
//         ],
//         "blockTag": "0x11e9068"
//       }
//     }
//   ],
//   "version": 1
// }
```

The `QueryRequest` can now be used to mock, submit, or verify a query response.

## Make a Query Request

Once you've [constructed a `QueryRequest`](/docs/products/queries/guides/submit-query/#construct-a-query){target=\_blank}, you can send it to the Wormhole Query Proxy. The Query Proxy validates the request, collects signed results from Guardians, and returns a Guardian-attested response suitable for on-chain use.

### Send the Request

To submit the request, serialize it and make a POST request to the appropriate proxy endpoint. You must include your API key in the request headers.

The standardized means of making a `QueryRequest` is as follows:

```jsx
--8<-- 'code/build/queries/use-queries/query-request-with-api-key.jsx'
```

### Proxy Endpoints

Use one of the following endpoints depending on your environment:

- Testnet Query Proxy: https://testnet.query.wormhole.com/v1/query
- Mainnet Query Proxy : https://query.wormhole.com/v1/query

Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.