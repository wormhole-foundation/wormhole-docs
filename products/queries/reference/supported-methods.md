---
title: Supported Methods
description: Retrieve multichain data with Wormhole queries through various supported methods like eth_call, By Timestamp, With Finality, sol_account and sol_pda.
categories: Queries
---

## Wormhole Queries: Supported Methods

Wormhole Queries provides on-demand access to Guardian-attested on-chain data. Wormhole Queries offers a faster and more cost-effective way to retrieve data than traditional transaction-based methods, eliminating gas payments and transaction finality wait times. The system uses a simple REST endpoint for off-chain requests, which Wormhole Guardians then process.

This page describes Wormhole Queries, their operational details, and available methods, aiming to assist new developers in utilizing the service.

## Supported Query Types

Wormhole currently supports five distinct query types, each designed for specific data retrieval tasks across various chains.

!!! note 
    For a more comprehensive technical description and further specifics on each query type, please consult the [white paper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0013_ccq.md).


### Eth_call

The [eth_call](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call) query type allows you to perform read-only calls to a smart contract on a specific block, identified by its number or hash.

Key features include:

- **Batching** - group multiple calls, even to different contracts, into a single query targeting the same block, which is processed as one batch RPC call to simplify on-chain verification
- **Capacity** - batch up to 255 individual in a single eth_call query 
- **Result Data** - provides the specified block's number, hash, timestamp, and the output from the contract call

### Eth_call by Timestamps

The `eth_call by timestamp` query is similar to a standard eth_call but targets a specific timestamp instead of a block ID. This is useful for retrieving on-chain data based on a precise point in time, especially for correlating information across different chains.

The query returns your target timestamp and the latest block details at or before your specified `target_time` immediately preceding the subsequent block. 

### Eth_call with Finality

The `eth_call with Finality` query type functions like a standard `eth_call`, but with an added critical assurance: it will only return the query results once the specified block has reached a designated level of finality on its chain.

You can specify one of two finality levels for your query:

- **Finalized** - indicates the highest level of assurance that a block is permanent and will not be altered or removed from the chain
- **Safe** - refers to a block considered highly unlikely to be reorganized, offering a substantial degree of confidence, though the network's consensus may not fully finalize it

!!! note
    If the target blockchain does not natively support or recognize the safe finality tag, requesting safe finality will be treated as a request for finalized finality instead.

### Sol_account

The `sol_account` query reads on-chain data for one or more specified accounts on the Solana blockchain. This functionality is similar to using Solana's native [`getMultipleAccounts`](https://solana.com/docs/rpc/http/getmultipleaccounts) RPC method, enabling you to retrieve information for multiple accounts simultaneously

### Sol_pda

The `sol_pda` query reads data for one or more Solana [Program Derived Addresses](https://www.anchor-lang.com/docs/pdas). It streamlines the standard process of deriving a PDA and fetching its account data.

This is particularly useful for accessing multiple PDAs owned by a specific program or for verifying Solana PDA derivations on another blockchain, such as how associated token accounts are all derived from the [Associated Token Account Program](https://spl.solana.com/associated-token-account).