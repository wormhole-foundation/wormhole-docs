---
title: Compare Wormhole's Cross-Chain Solutions
description: Compare Wormhole’s cross-chain solutions for bridging, native transfers, data queries, and governance to enable seamless blockchain interoperability.
---

# Products 

Wormhole provides a comprehensive suite of cross-chain solutions, enabling seamless asset transfers, data retrieval, and governance across blockchain ecosystems.

Wormhole provides multiple options for asset transfers: Connect for a plug-and-play bridging UI, Native Token Transfers (NTT) for moving native assets without wrapped representations, and Token Bridge for a secure lock-and-mint mechanism.

Beyond transfers, Wormhole extends interoperability with tools for cross-chain data access, decentralized governance, and an intent-based protocol through Wormhole Settlement.

## Transfer Products

Wormhole offers different solutions for cross-chain asset transfer, each designed for various use cases and integration requirements.

- [**Connect**](/docs/build/transfers/connect/overview/){target=\_blank} - a pre-built bridging UI for cross-chain token transfers, requiring minimal setup. Best for projects seeking an easy-to-integrate UI for bridging without modifying contracts
- [**Native Token Transfers (NTT)**](/docs/learn/transfers/native-token-transfers/overview/){target=\_blank} - a mechanism to transfer native tokens cross-chain seamlessly without conversion to wrapped asset. Best for projects that require maintaining token fungibility and native chain functionality across multiple networks
- [**Token Bridge**](/docs/learn/transfers/token-bridge/){target=\_blank} - a bridging solution that uses a lock and mint mechanism. Best for projects that need cross-chain liquidity using wrapped assets and the ability to send messages
- [**Settlement**](/docs/learn/messaging/wormhole-settlement/overview/){target=\_blank} - intent-based protocols enabling fast multichain transfers, optimized liquidity flows, and interoperability without relying on traditional bridging methods

<div markdown class="full-width">

::spantable::

|                                | Criteria                              | Connect            | NTT                | Token Bridge       | Settlement         |
|--------------------------------|---------------------------------------|--------------------|--------------------|--------------------|--------------------|
| Supported Transfer Types @span | Token Transfers                       | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
|                                | Token Transfers with Payloads         | :x:                | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Supported Assets @span         | Wrapped Assets                        | :white_check_mark: | :x:                | :white_check_mark: | :white_check_mark: |
|                                | Native Assets                         | :white_check_mark: | :white_check_mark: | :x:                | :white_check_mark: |
|                                | ERC-721s (NFTs)                       | :white_check_mark: | :x:                | :white_check_mark: | :white_check_mark: |
| Features @span                 | Out-of-the-Box UI                     | :white_check_mark: | :x:                | :x:                | :white_check_mark: |
|                                | Event-Based Actions                   | :x:                | :white_check_mark: | :white_check_mark: | :x:                |
|                                | Intent-Based Execution                | :x:                | :x:                | :x:                | :white_check_mark: |
|                                | Fast Settlement                       | :x:                | :x:                | :x:                | :white_check_mark: |
|                                | Liquidity Optimization                | :x:                | :x:                | :x:                | :white_check_mark: |
| Integration Details @span      |                                       |                    |                    |                    |                    |
| Requirements @span             | Contract Deployment                   | :x:                | :white_check_mark: | :x:                |:white_check_mark:  |
|                                | User-Owned Contracts                  | :x:                | :white_check_mark: | :x:                |:x:                |
| Ecosystem Support              | Integrates with Other Products        | :white_check_mark: | :white_check_mark: | :white_check_mark: |:white_check_mark: |
| Ease of Integration            | Implementation Complexity             | :green_circle: :white_circle: :white_circle: <br> Low | :green_circle: :green_circle: :white_circle: <br> Moderate | :green_circle: :green_circle: :white_circle: <br> Moderate |:green_circle: :white_circle: :white_circle: <br> Low |
| Technology @span               | Supported Languages                   | JavaScript, TypeScript | Solidity, Rust | Solidity, Rust, TypeScript | TypeScript |

::end-spantable::

</div>

Beyond asset transfers, Wormhole provides additional tools for cross-chain data and governance.

## Real-time Data

[**Queries**](/docs/build/queries/overview/){target=\_blank} is a data retrieval service to fetch on-chain data from multiple networks. Best for applications that need multichain analytics, reporting, and data aggregation.

## Multichain Governance

[**MultiGov**](/docs/learn/governance/overview/){target=\_blank} is a unified governance framework that manages multichain protocol governance through a single mechanism. Best for projects managing multichain governance and protocol updates.