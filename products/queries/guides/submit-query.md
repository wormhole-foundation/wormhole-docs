---
title: Submit a Query Request
description: 
categories: Queries
---

# Submit a Query Request

You can visit the [Example Queries Demo](https://wormholelabs-xyz.github.io/example-queries-demo/){target=\_blank} to view an interactive example of an application interacting with the [Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol){target=\_blank} contract.

This guide walks through the process of building and sending a verifiable cross-chain query using the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank}. You'll create an `eth_call` request to fetch the total supply of WETH on Ethereum, and submit it to the Query Proxy for a Guardian-signed response.

## Install Dependencies

This example uses [Axios](https://www.npmjs.com/package/axios){target=\_blank} for RPC requests. Ensure that you have [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed and then install the following package to create and send a query:

```bash
npm install @wormhole-foundation/wormhole-query-sdk axios
```

## Prepare Query Inputs

To construct an `EthCallQueryRequest`, you need the block number or hash and the ABI-encoded call data.

The query requires the following:

- **Chain ID**: Wormhole chain ID for Ethereum is `2`
- **Contract address**: WETH – `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **Function signature**: `totalSupply()` encoded as `0x18160ddd`
- **Block number**: the block tag that determines which block state to query (e.g. `latest`)

You can request the latest block from a public node using `eth_getBlockByNumber` and construct the call data.

```jsx
import axios from 'axios';

--8<-- 'code/build/queries/use-queries/test-full.jsx:12:12'
--8<-- 'code/build/queries/use-queries/test-full.jsx:13:16'

--8<-- 'code/build/queries/use-queries/test-full.jsx:19:26'
```

## Construct the Query Request

Now that you have the block number and call data, you can put it all together in a `QueryRequest`.

```jsx
import {
  EthCallQueryRequest,
  PerChainQueryRequest,
  QueryRequest,
} from '@wormhole-foundation/wormhole-query-sdk';

--8<-- 'code/build/queries/use-queries/test-full.jsx:44:53'

--8<-- 'code/build/queries/use-queries/test-full.jsx:54:54'
```

This builds a `QueryRequest` consisting of one `PerChainQueryRequest`, which is an `EthCallQueryRequest` to Ethereum.
You can use `console.log` to print The JSON object printedand review the structure.

```jsx
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

The `QueryRequest` can now be used to [mock](/docs/products/queries/guides/mock-a-query/){target=\_blank}, [submit, or verify](/docs/products/queries/guides/query-response/){target=\_blank} a query response.

## Submit to the Query Proxy

Once you've [constructed a `QueryRequest`](/docs/products/queries/guides/submit-query/#construct-a-query){target=\_blank}, you can send it to the Wormhole Query Proxy. The Query Proxy validates the request, collects signed results from Guardians, and returns a Guardian-attested response suitable for on-chain use.

## Send the Request

To submit the request, serialize it and make a POST request to the appropriate proxy endpoint. You must include your API key in the request headers. The standardized means of making a `QueryRequest` with an API key is as follows:

```jsx
--8<-- 'code/build/queries/use-queries/query-request-with-api-key.jsx'
```

!!!important
    Never commit your API key. Use environment variables and add `.env` to your `.gitignore`.

### Proxy Endpoints

Use one of the following endpoints depending on your environment:

- Testnet Query Proxy: https://testnet.query.wormhole.com/v1/query
- Mainnet Query Proxy : https://query.wormhole.com/v1/query

Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.

## Parse the Response

Use the SDK to decode the Guardian-signed `QueryResponse`:

```ts
import { 
    QueryResponse, 
    EthCallQueryResponse 
} from '@wormhole-foundation/wormhole-query-sdk';

const queryResponse = QueryResponse.from(response.data.bytes);
const result = (queryResponse.responses[0].response as EthCallQueryResponse).results[0];

console.log(`Query Result: ${result} (${BigInt(result)})`);
```

This returns the `totalSupply` result of WETH at the queried block height.