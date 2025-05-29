---
title: Queries Supported Networks
description: Reference table of chains supported by Wormhole Queries, including method support, finality, and expected historical data availability.
categories: Queries
---

# Supported Networks

This page provides a quick reference for chains supported by Wormhole Queries, including each chain's Wormhole chain ID and the level of support for key methods: [`eth_call`](/docs/products/queries/reference/supported-methods/#eth_call){target=\_blank}, [`eth_call_by_timestamp`](/docs/products/queries/reference/supported-methods/#eth_call_by_timestamp){target=\_blank}, and [`eth_call_with_finality`](/docs/products/queries/reference/supported-methods/#eth_call_with_finality){target=\_blank}.

The **Expected History** column shows how much recent state data is typically available for querying, though this can vary depending on the chain and the configuration of each Guardian node.

The support shown in the table reflects what has been confirmed through testing. However, query success ultimately depends on whether the underlying call can be executed on each Guardian’s RPC node.

For example, many chains use a fork of [Geth](https://github.com/ethereum/go-ethereum){target=\_blank}, which by default retains 128 blocks of state in memory (unless archive mode is enabled). On Ethereum mainnet, this covers around 25 minutes of history—but on faster chains like Optimism, it may span only about three minutes. While Guardian nodes are expected to have access to recent state, there are currently no guarantees on how far back historical data is available.

## Mainnet

|     Chain     | Wormhole Chain ID | eth_call | eth_call_by_timestamp | eth_call_with_finality | Expected History |
|:-------------:|:-----------------:|:--------:|:---------------------:|:----------------------:|:----------------:|
|   Ethereum    |         2         |    ✅     |           ✅           |           ✅            |    128 blocks    |
|      BSC      |         4         |    ✅     |           ✅           |           ✅            |    128 blocks    |
|    Polygon    |         5         |    ✅     |           ✅           |           ✅            |    128 blocks    |
|   Avalanche   |         6         |    ✅     |           ✅           |           ✅            |    32 blocks     |
| Oasis Emerald |         7         |    ✅     |           ✅           |           ✅            |     archive      |
|    Fantom     |        10         |    ✅     |           ✅           |           ✅            |    16 blocks     |
|    Karura     |        11         |    ✅     |           ✅           |           ✅            |     archive      |
|     Acala     |        12         |    ✅     |           ✅           |           ✅            |     archive      |
|     Kaia      |        13         |    ✅     |           ✅           |           ✅            |    128 blocks    |
|     Celo      |        14         |    ✅     |           ℹ️           |           ✅            |    128 blocks    |
|   Moonbeam    |        16         |    ✅     |           ℹ️           |           ✅            |    256 blocks    |
| Arbitrum One  |        23         |    ✅     |           ✅           |           ✅            |   ~6742 blocks   |
|   Optimism    |        24         |    ✅     |           ✅           |           ❌            |    128 blocks    |
|     Base      |        30         |    ✅     |           ✅           |           ✅            |     archive      |

ℹ️`EthCallByTimestamp` arguments for `targetBlock` and `followingBlock` are currently required for requests to be successful on these chains.