---
title: Query FAQs
description: Explore frequently asked questions about Wormhole Queries, which offer on-demand access to guardian-attested on-chain data via a REST API endpoint.
---

# Query FAQs

## What libraries are available to handle queries?

You can use the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} to create query requests, mock query responses for testing, and parse query responses. The SDK also includes utilities for posting query responses.

You can use the [Solidity QueryResponse Abstract Contract](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/QueryResponse.sol){target=\_blank} to parse and verify query responses on EVM chains. See the [Solana Stake Pool](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank} repo as an example use case. The SDK also contains [`QueryTest.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/testing/helpers/QueryTest.sol){target=\_blank} for mocking query requests and responses in forge tests.

The [Go query package](https://github.com/wormhole-foundation/wormhole/tree/main/node/pkg/query){target=\_blank} can also be used to create query requests and parse query responses.

!!! note
	A Rust SDK for Solana is being actively investigated by the Wormhole Contributors. See the [Solana Queries Verification](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank} repo as a proof of concept.

## Are there any examples?

Certainly. You can find a complete walkthrough on the [Getting Started page](./getting-started.md). Additionally, you can find full code examples in available in the following repositories:

- [Getting Started](./getting-started.md)
- [Basic Demo](https://github.com/wormholelabs-xyz/example-queries-demo/){target=\_blank}
- [Solana Stake Pool](https://github.com/wormholelabs-xyz/example-queries-solana-stake-pool){target=\_blank}
- [Solana PDA / Token Account Balance](https://github.com/wormholelabs-xyz/example-queries-solana-pda){target=\_blank}
- [Solana Queries Verification](https://github.com/wormholelabs-xyz/example-queries-solana-verify){target=\_blank}

## What is the format of the response signature?

The guardian node calculates an ECDSA signature using [crypto.Sign](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.10.21/crypto#Sign){target=\_blank} where the digest hash is `keccak256("query_response_0000000000000000000|"+keccak256(responseBytes))`. See the [Guardian Key Usage](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0009_guardian_key.md){target=\_blank} whitepaper for more background. This signature then has the guardian's index in the guardian set appended to the end.

💡 If you are used to `ecrecover` you will notice that the `v` byte is `0` or `1` as opposed to `27` or `28`. The `signaturesToEvmStruct` method in the [Query TypeScript SDK](https://npmjs.com/package/@wormhole-foundation/wormhole-query-sdk){target=\_blank} accounts for this as well as structuring the signatures into an `IWormhole.SignatureStruct[]`.

## Can anyone run a Query Proxy server?

The Query Proxy is currently permissioned by the Guardians. The guardian nodes are configured to only listen to a set of allow-listed proxies. However, it is possible that this restriction may be lifted in the future and/or more proxies could be added.

It is also important to note that the proxies do not impact the verifiability the request and result - i.e. their role in the process is trustless.