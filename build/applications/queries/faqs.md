---
title: Queries FAQs
description: Wormhole Queries FAQ covering available libraries, query examples, response formats, and details about running query proxy servers.
---

# Wormhole Queries FAQs

## What libraries are available to handle queries?

 - The [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} can be used to create query requests, mock query responses for testing, and parse query responses. The SDK also includes utilities for posting query responses

- The [Solidity `QueryResponse` abstract contract](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/QueryResponse.sol){target=\_blank} can be used to parse and verify query responses on EVM chains. See the [Solana Stake Pool](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank} repository as an example use case

- [`QueryTest.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/testing/helpers/QueryTest.sol){target=\_blank} can be used for mocking query requests and responses in Forge tests

- The [Go query package](https://github.com/wormhole-foundation/wormhole/tree/main/node/pkg/query){target=\_blank} can also be used to create query requests and parse query responses

!!! note
    A Rust SDK for Solana is being actively investigated by the Wormhole contributors. See the [Solana Queries Verification](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank} repository as a proof of concept.

## Are there any query examples?

Certainly. You can find a complete guide on the [Use Queries page](/docs/build/applications/queries/use-queries/){target=\_blank}. Additionally, you can find full code examples in the following repositories:

- [Basic Example Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/){target=\_blank}
- [Solana Stake Pool Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank}
- [Solana Program Derived Address (PDA) / Token Account Balance Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-pda){target=\_blank}
- [Solana Queries Verification Example](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank}

## What is the format of the response signature?

The Guardian node calculates an ECDSA signature using [`Sign` function of the crypto package](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.10.21/crypto#Sign){target=\_blank} where the digest hash is:

```keccak256("query_response_0000000000000000000|"+keccak256(responseBytes))``` 

See the [Guardian Key Usage](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md){target=\_blank} white paper for more background. Once this signature is created, the Guardian's index in the Guardian set is appended to the end.

!!! note
    If you are used to `ecrecover` you will notice that the `v` byte is `0` or `1` as opposed to `27` or `28`. The `signaturesToEvmStruct` method in the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} accounts for this as well as structuring the signatures into an `IWormhole.SignatureStruct[]`.

## Can anyone run a query proxy server?

Permissions for Query Proxy are managed by the Guardians. The Guardian nodes are configured to only listen to a set of allow-listed proxies. However, it is possible that this restriction may be lifted in the future and/or more proxies could be added.

It is also important to note that the proxies don't impact the verifiability of the request or result, i.e., their role in the process is trustless.

## What Does Queries Offer over an RPC Service

Wormhole Queries provides on-demand, attested, on-chain, verifiable RPC results. Each Guardian independently executes the specified query and returns the result and their signature. The proxy handles aggregating the results and signatures, giving you a single result (all within one REST call) with a quorum of signatures suitable for on-chain submission, parsing, and verification using one of our examples or SDKs.
