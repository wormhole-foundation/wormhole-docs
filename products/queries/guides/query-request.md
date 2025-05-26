---
title: Make a Query Request
description: Send a QueryRequest to the Wormhole Query Proxy using an API key and receive a Guardian-signed, on-chain-verifiable response.
categories: Queries
---

# Make a Query Request

Once you've [constructed a `QueryRequest`](/docs/products/queries/guides/construct-a-query/){target=\_blank}, you can send it to the Wormhole Query Proxy. The Query Proxy validates the request, collects signed results from Guardians, and returns a Guardian-attested response suitable for on-chain use.

## Send the Request

To submit the request, serialize it and make a POST request to the appropriate proxy endpoint. You must include your API key in the request headers.

The standardized means of making a `QueryRequest` is as follows:

```jsx
--8<-- 'code/build/queries/use-queries/query-request-with-api-key.jsx'
```

## Proxy Endpoints

Use one of the following endpoints depending on your environment:

- Testnet Query Proxy: https://testnet.query.wormhole.com/v1/query
- Mainnet Query Proxy : https://query.wormhole.com/v1/query

Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.

