---
title: Mock a Query
description: Use the QueryProxyMock from the Wormhole SDK to simulate a Wormhole query response to test your app without calling the live Query Proxy.
categories: Queries
---

# Mock a Query

To test your integration without relying on the live Query Proxy, you can simulate a query response using the `QueryProxyMock` class from the Wormhole Query SDK. This mock response mimics what you'd receive from the Guardians, signed with a known [Devnet](https://github.com/wormhole-foundation/wormhole/blob/main/DEVELOP.md){target=\_blank} Guardian key.

## Simulate the Query

The `mock()` method accepts a `QueryRequest` and performs the RPC calls locally. It then signs the results using the Devnet Guardian key.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:55:57'
// {
//   signatures: ['...'],
//   bytes: '...'
// }
```

## Parse the Mock Response

The returned mock response can be parsed using the SDK’s `QueryResponse.from()` method to make the results readable via the client. You can also extract and print the individual result for inspection.

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx:58:64'
// Mock Query Result: 0x000000000000000000000000000000000000000000029fd09d4d81addb3ccfee (3172556167631284394053614)
```

The mock result represents the total supply of WETH on Ethereum at the block you specified.

## Full Example

Here's how it all comes together in a single test script:

```jsx
--8<-- 'code/build/queries/use-queries/test-full.jsx'
```

This mock data is suitable for verifying your integration logic before working with real Guardians or submitting on-chain.

### Fork Testing

It is common to test against a local fork of Mainnet with something like

```jsx
anvil --fork-url https://ethereum.publicnode.com
```

In order for mock requests to verify against the Mainnet Core Contract, you need to replace the current Guardian set with the single Devnet key used by the mock.

Here's an example for Ethereum Mainnet, where the `-a` parameter is the [Core Contract address](/docs/build/reference/contract-addresses/#core-contracts){target=\_blank} on that chain.

```jsx
npx @wormhole-foundation/wormhole-cli evm hijack -a 0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B -g 0xbeFA429d57cD18b7F8A4d91A2da9AB4AF05d0FBe
```

If you are using `EthCallWithFinality`, you will need to mine additional blocks (32 if using [Anvil](https://book.getfoundry.sh/anvil/){target=\_blank}) after the latest transaction for it to become finalized. Anvil supports [auto-mining](https://book.getfoundry.sh/reference/anvil/#mining-modes){target=\_blank} with the `-b` flag if you want to test code that waits naturally for the chain to advance. For integration tests, you may want to simply `anvil_mine` with `0x20`.


