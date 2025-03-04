---
title: Products
description: Compare Wormhole products by features, asset support, integration complexity, and use cases. Explore additional tools for data, governance, and execution.
---

# Products 

Wormhole provides a comprehensive suite of cross-chain solutions, enabling seamless asset transfers, data retrieval, and governance across blockchain ecosystems.

Wormhole provides multiple options for asset transfers: Connect for a plug-and-play bridging UI, Native Token Transfers (NTT) for moving native assets without wrapped representations, and Token Bridge for a secure lock-and-mint mechanism.

Beyond transfers, Wormhole extends interoperability with tools for cross-chain data access, decentralized governance, and an intent-based protocol through Wormhole Settlement.

## Transfer Products

Wormhole offers different solutions for cross-chain asset transfer, each designed for various use cases and integration requirements.

- [**Connect**](/docs/build/applications/connect/overview/){target=\_blank} - a pre-built bridging UI for cross-chain token transfers, requiring minimal setup. Best for projects seeking an easy-to-integrate UI for bridging without modifying contracts
- [**Native Token Transfers (NTT)**](/docs/learn/messaging/native-token-transfers/overview/){target=\_blank} - a mechanism to transfer native tokens cross-chain seamlessly without wrappers. Best for teams prioritizing native token movement without wrappers
- [**Token Bridge**](/docs/learn/messaging/token-bridge/){target=\_blank} - a bridging solution that uses a lock and mint mechanism. Best for projects that need cross-chain liquidity using wrapped assets and the ability to send messages 


<div markdown class="full-width">

::spantable::

|                                | Criteria                              | Connect            | NTT                | Token Bridge         |
|--------------------------------|---------------------------------------|--------------------|--------------------|----------------------|
| Supported Transfer Types @span | Token Transfers                       | :white_check_mark: | :white_check_mark: | :white_check_mark:   |
|                                | Token Transfers with Message Payloads | :x:                | :x:                | :white_check_mark:   |
| Supported Assets @span         | Wrapped Assets                        | :white_check_mark: | :x:                | :white_check_mark:   |
|                                | Native Assets                         | :white_check_mark: | :white_check_mark: | :x:                  |
|                                | ERC-721s (NFTs)                       | :white_check_mark: | :x:                | :white_check_mark:   |
| Features @span                 | Out-of-the-Box UI                     | :white_check_mark: | :x:                | :x:                  |
|                                | Event-Based Actions                   | :x:                | :white_check_mark: | :white_check_mark:   |
| Integration Details @span      |                                       |                    |                    |                      |
| Requirements @span             | Contract Deployment                   | :x:                | :white_check_mark: | :x:                  |
|                                | User-Owned Contracts                  | :x:                | :white_check_mark: | :x:                  |
| Ecosystem Support              | Integrates with Other Products        | :white_check_mark: | :white_check_mark: | :white_check_mark:   |
| Ease of Integration            | Implementation Complexity             | :green_circle: :white_circle: :white_circle: <br> Low | :green_circle: :green_circle: :white_circle: <br> Moderate | :green_circle: :green_circle: :white_circle: <br> Moderate |
| Technology @span               | Supported Languages                   | JavaScript, TypeScript | Solidity (Ethereum), Rust (Solana) | Solidity (Ethereum), Rust (Solana), TypeScript |

::end-spantable::

</div>

## Other Products

Beyond asset transfers, Wormhole provides additional tools for cross-chain data, governance, and advanced messaging.

- [**Queries**](/docs/build/applications/queries/overview/){target=\_blank} - a data retrieval service to fetch on-chain data from multiple networks, powering analytics and dashboards. Best for applications that need to simplify multi-chain analytics, reporting, and data aggregation 
- [**MultiGov**](/docs/learn/governance/overview/){target=\_blank} - a unified governance framework that manages multichain protocol governance through a single mechanism. Best for projects managing multichain governance and protocol updates
- [**Wormhole Settlement**](/docs/learn/messaging/wormhole-settlement/overview/){target=\_blank} - a next-generation suite of intent protocols enabling fast multi-chain transfers, optimizing liquidity flows and interoperability without relying on traditional bridging methods. Best for institutional-scale volume and chain abstraction for application developers 
