---
title: FAQs about Queries
description: Explore frequently asked questions about Wormhole Queries, which offer on-demand access to guardian-attested on-chain data via a REST API endpoint.
---

# FAQs about Queries

## What Libraries Are Available to Handle Queries?

- The [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} can be used to create query requests, mock query responses for testing, and parse query responses. The SDK also includes utilities for posting query responses

- The [Solidity `QueryResponse` abstract contract](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/QueryResponse.sol){target=\_blank} can be used to parse and verify query responses on EVM chains. See the [Solana Stake Pool](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank} repo as an example use case

- [`QueryTest.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/testing/helpers/QueryTest.sol){target=\_blank} can be used for mocking query requests and responses in Forge tests

- The [Go query package](https://github.com/wormhole-foundation/wormhole/tree/main/node/pkg/query){target=\_blank} can also be used to create query requests and parse query responses

!!! note
    A Rust SDK for Solana is being actively investigated by the Wormhole contributors. See the [Solana Queries Verification](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank} repo as a proof of concept.

## Are There Any Query Examples?

Certainly. You can find a complete walkthrough on the [Hands on with Queries page](/build/build-apps/queries/hands-on-with-queries). Additionally, you can find full code examples in available in the following repositories:

- [Basic Example Query Demo](https://github.com/wormholelabs-xyz/example-queries-demo/){target=\_blank}
- [Solana Stake Pool Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank}
- [Solana PDA / Token Account Balance Example Query](https://github.com/wormholelabs-xyz/example-queries-solana-pda){target=\_blank}
- [Solana Queries Verification Example](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank}

## What Is the Format of the Response Signature?

The guardian node calculates an ECDSA signature using [`Sign` function of the crypto package](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.10.21/crypto#Sign){target=\_blank} where the digest hash is:

`keccak256("query_response_0000000000000000000|"+keccak256(responseBytes))` 

See the [Guardian Key Usage](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md){target=\_blank} whitepaper for more background. Once this signature is created, the guardian's index in the guardian set is appended to the end.

!!! note
    If you are used to `ecrecover` you will notice that the `v` byte is `0` or `1` as opposed to `27` or `28`. The `signaturesToEvmStruct` method in the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} accounts for this as well as structuring the signatures into an `IWormhole.SignatureStruct[]`.

## Can Anyone Run a Query Proxy Server?

The Query Proxy is currently permissioned by the Guardians. The Guardian nodes are configured to only listen to a set of allow-listed proxies. However, it is possible that this restriction may be lifted in the future and/or more proxies could be added.

It is also important to note that the proxies do not impact the verifiability of the request or result, i.e., their role in the process is trustless.