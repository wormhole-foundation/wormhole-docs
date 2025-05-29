---
title: Submit a Query Response
description: Use the Wormhole Solidity SDK to parse and verify Guardian-signed query responses and validate data before using it on-chain.
categories: Queries
---

# Verify a Query Response On-Chain

Query responses returned by the Wormhole Query Proxy are signed by the Guardians Network. You can use the Wormhole Solidity SDK to verify these signatures on-chain and validate the query details before using the results in your application logic.

## Install the SDK

First, install the Wormhole Solidity SDK if you haven’t already:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk
```

## Parse and Verify

The SDK provides a [`QueryResponseLib` library](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/libraries/QueryResponse.sol){target=\_blank} to assist with verifying query responses. It handles:

- Parsing the signed response
- Verifying Guardian signatures against the on-chain Guardian set
- Validating the structure and contents of the request and response

## Basic Verification Workflow

Broadly, using a query response on-chain comes down to three main steps:

   1. Parse and verify the query response
   2. The `parseAndVerifyQueryResponse` handles verifying the Guardian signatures against the current Guardian set stored in the Core bridge contract
   3. Validate the request details. This may be different for every integrator depending on their use case, but generally checks the following:
    - Is the request against the expected chain?
    - Is the request of the expected type? The `parseEthCall` helpers perform this check when parsing
    - Is the resulting block number and time expected? Some consumers might require that a block number be higher than the last, or the block time be within the last 5 minutes. `validateBlockNum` and `validateBlockTime` can help with the checks
    - Is the request for the expected contract and function signature? The `validateMultipleEthCallData` can help with non-parameter-dependent cases
    - Is the result of the expected length for the expected result type?
   4. Run `abi.decode` on the result 

## Example: QueryDemo Contract

The [QueryDemo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol){target=\_blank} contract demonstrates how to verify and use a query result. It includes signature verification, replay protection, and result parsing. Read the docstrings of the preceding methods for detailed usage instructions.

This contract uses `parseEthCallQueryResponse()`, `validateBlockNum()`, and `validateMultipleEthCallData()` to verify the results before accepting them.

```solidity
--8<-- 'code/build/queries/use-queries/query-demo.sol'
```

# Submit a Query Response On-Chain

After [verifying a query response on-chain](/docs/products/queries/guides/verify-response/){target=\_blank} or in a test environment, you may want to submit it to a smart contract for processing. This requires passing the response bytes and Guardian signatures in the correct format.

The `QueryProxyQueryResponse` result includes the raw `bytes` and an array of `signatures`. To match the expected Solidity format for `parseAndVerifyQueryResponse(bytes memory, IWormhole.Signature[] memory)`, you’ll need to convert the signatures using the `signaturesToEvmStruct` helper from the Wormhole SDK.

## Example Submission

Here’s how you can submit the response to the demo contract:

```jsx
--8<-- 'code/build/queries/use-queries/query-proxy-query-response.jsx'
```