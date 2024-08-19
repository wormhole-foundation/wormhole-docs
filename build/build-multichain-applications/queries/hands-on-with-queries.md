---
title: Hands on With Queries
description: Explore a simple demo of interacting with Wormhole Queries using an eth_call request to query the supply of wETH on Ethereum using a Wormhole query.
---

# Hands on with Queries {: #hands-on-with-queries}

You can visit the [Example Queries Demo](https://wormholelabs-xyz.github.io/example-queries-demo/) to view an interactive example of an application interacting with the [Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol){target=\_blank} contract.   

This guide covers using a simple `eth_call` request to get the total supply of WETH on Ethereum.

## RPC Basics {: #rpc-basics}

Before digging into anything Queries-specific, this page will look at how to make an [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call){target=\_blank} against a public Ethereum RPC. Suppose you'd like to query the WETH contract for its total supply; before making a request, you need some information about the contract you want to call, including:

- **To** - the contract to call. WETH is [0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2](https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2){target=\_blank}
- **Data** - the method identifier and ABI-encoded parameters, which can be obtained as follows: `web3.eth.abi.encodeFunctionSignature("totalSupply()")` which yields `0x18160ddd`
- **Block ID** - the block number, hash, or tag. Tag options include `latest,` `safe,` or `finalized`

The prepared curl request is as follows:

```bash title="eth_call JSON-RPC request"
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/eth-call-initial-request.txt'
```

And the corresponding response is:

```bash title="eth_call JSON-RPC reponse"
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/eth-call-initial-response.txt'
```

Converting the returned value of the executed call from hexidecimal results in the value `3172615244782286193073777`. You can compare your result to the [**Read Contract**](https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#readContract){target=\_blank} tab in Etherscan. Your result will be different as WETH is minted/burned over time.

## Construct a Query {: #construct-a-query}

You can use the [Wormhole Query SDK](https://www.npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} to construct a query. You will also need an RPC endpoint from the provider of your choice. This example uses [Axios](https://www.npmjs.com/package/axios){target=\_blank} for RPC requests.

```jsx
npm i @wormhole-foundation/wormhole-query-sdk axios
```

In order to make an `EthCallQueryRequest`, you need a specific block number or hash as well as the call data to request.

You can request the latest block from a public node using `eth_getBlockByNumber`.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/get-block-by-number.jsx'
```

Then construct the call data.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/eth-call-data.jsx'
```

Finally, put it all together in a `QueryRequest`.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-request.jsx'
```

This request consists of one `PerChainQueryRequest`, which is an `EthCallQueryRequest` to Ethereum. You can use `console.log` to print the JSON object and review the structure.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/per-chain-query-request.jsx'
```

## Mock a Query {: #mock-a-query}

For easier testing, the Query SDK provides a `QueryProxyMock` method. This method will perform the request and sign the result with the [DevNet](../reference/dev-env/tilt.md) Guardian key. The `mock` call returns the same format as the Query Proxy.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-proxy-mock.jsx'
```

This response is suited for on-chain use, but the SDK also includes a parser to make the results readable via the client.

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-response.jsx'
```

Testing this all together might look like the following:

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/test-full.jsx'
```

### Fork Testing {: #fork-testing}

It is common to test against a local fork of MainNet with something like

```jsx
anvil --fork-url https://ethereum.publicnode.com
```

In order for mock requests to verify against the MainNet Core Contract, you need to replace the current Guardian set with the single DevNet key used by the mock.

Here's an example for Ethereum MainNet, where the `-a` parameter is the [Core Contract address](../reference/constants.md#core-contracts) on that chain.

```jsx
npx @wormhole-foundation/wormhole-cli evm hijack -a 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B -g 0xbeFA429d57cD18b7F8A4d91A2da9AB4AF05d0FBe
```

If you are using `EthCallWithFinality`, you will need to mine additional blocks (32 if using [Anvil](https://book.getfoundry.sh/anvil/){target=\_blank}) after the latest transaction for it to become finalized. Anvil supports [auto-mining](https://book.getfoundry.sh/reference/anvil/#mining-modes){target=\_blank} with the `-b` flag if you want to test code that waits naturally for the chain to advance. For integration tests, you may want to simply `anvil_mine` with `0x20`.

## Make a Query Request {: #make-a-query-request}

The standardized means of making a `QueryRequest` with an API key is as follows:

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-request-with-api-key.jsx'
```

Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.

A TestNet Query Proxy is available at `https://testnet.query.wormhole.com/v1/query`

A MainNet Query Proxy is available at ` https://query.wormhole.com/v1/query`

## Verify a Query Response On-Chain {: #verify-a-query-response-on-chain}

A [`QueryResponse` abstract contract](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/QueryResponse.sol){target=\_blank} is provided to assist with verifying query responses. You can begin by installing the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} with the following command:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk
```

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

See the [QueryDemo](https://github.com/wormholelabs-xyz/example-queries-demo/blob/main/src/QueryDemo.sol) contract for an example and read the docstrings of the above methods for detailed usage instructions.

??? code "View the complete QueryDemo"
    ```solidity
    --8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-demo.sol'
    ```

## Submit a Query Response On-Chain {: #submit-a-query-response-on-chain}

The `QueryProxyQueryResponse` result requires a slight tweak when submitting to the contract to match the format of `function parseAndVerifyQueryResponse(bytes memory response, IWormhole.Signature[] memory signatures)`. A helper function, `signaturesToEvmStruct`, is provided in the SDK for this.

This example submits the transaction to the demo contract:

```jsx
--8<-- 'code/build/build-multichain-applications/queries/hands-on-with-queries/query-proxy-query-response.jsx'
```
