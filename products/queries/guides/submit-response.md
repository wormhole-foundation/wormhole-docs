---
title: Submit a Query Response On-Chain
description: Learn how to submit a Guardian-signed query response to a smart contract using the SDK helper to format the data correctly.
categories: Queries
---

# Submit a Query Response On-Chain

After [verifying a query response on-chain](/docs/products/queries/guides/verify-response/){target=\_blank} or in a test environment, you may want to submit it to a smart contract for processing. This requires passing the response bytes and Guardian signatures in the correct format.

The `QueryProxyQueryResponse` result includes the raw `bytes` and an array of `signatures`. To match the expected Solidity format for `parseAndVerifyQueryResponse(bytes memory, IWormhole.Signature[] memory)`, you’ll need to convert the signatures using the `signaturesToEvmStruct` helper from the Wormhole SDK.

## Example Submission

Here’s how you can submit the response to the demo contract:

```jsx
--8<-- 'code/build/queries/use-queries/query-proxy-query-response.jsx'
```