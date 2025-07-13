---
title: Compare Wormhole's Cross-Chain Solutions
description: Compare Wormhole’s cross-chain solutions for bridging, native transfers, data queries, and governance to enable seamless blockchain interoperability.
categories: Transfer, Basics
---

# Products 

Wormhole provides a comprehensive suite of cross-chain solutions, enabling seamless asset transfers, data retrieval, and governance across blockchain ecosystems.

Wormhole provides multiple options for asset transfers: Connect for a plug-and-play bridging UI, Native Token Transfers (NTT) for moving native assets without wrapped representations, and Token Bridge for a secure lock-and-mint mechanism.

Beyond transfers, Wormhole extends interoperability with tools for cross-chain data access, decentralized governance, and an intent-based protocol through Wormhole Settlement.

## Transfer Products

Wormhole offers different solutions for cross-chain asset transfer, each designed for various use cases and integration requirements.

- [**Native Token Transfers (NTT)**](/docs/products/native-token-transfers/overview/){target=\_blank} - a mechanism to transfer native tokens cross-chain seamlessly without conversion to a wrapped asset. Best for projects that require maintaining token fungibility and native chain functionality across multiple networks
- [**Token Bridge**](/docs/products/token-bridge/overview/){target=\_blank} - a bridging solution that uses a lock and mint mechanism. Best for projects that need cross-chain liquidity using wrapped assets and the ability to send messages
- [**Settlement**](/docs/products/settlement/overview/){target=\_blank} - intent-based protocols enabling fast multichain transfers, optimized liquidity flows, and interoperability without relying on traditional bridging methods

<div markdown class="full-width">

::spantable::

|                                | Criteria                              | NTT                | Token Bridge       | Settlement         |
|--------------------------------|---------------------------------------|--------------------|--------------------|--------------------|
| Supported Transfer Types @span | Token Transfers                       | :white_check_mark: | :white_check_mark: | :white_check_mark: |
|                                | Token Transfers with Payloads         | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Supported Assets @span         | Wrapped Assets                        | :x:                | :white_check_mark: | :white_check_mark: |
|                                | Native Assets                         | :white_check_mark: | :x:                | :white_check_mark: |
|                                | ERC-721s (NFTs)                       | :x:                | :white_check_mark: | :white_check_mark: |
| Features @span                 | Out-of-the-Box UI                     | :x:                | :x:                | :white_check_mark: |
|                                | Event-Based Actions                   | :white_check_mark: | :white_check_mark: | :x:                |
|                                | Intent-Based Execution                | :x:                | :x:                | :white_check_mark: |
|                                | Fast Settlement                       | :x:                | :x:                | :white_check_mark: |
|                                | Liquidity Optimization                | :x:                | :x:                | :white_check_mark: |
| Integration Details @span      |                                       |                    |                    |                    |
| Requirements @span             | Contract Deployment                   | :white_check_mark: | :x:                |:x:                 |
| Ease of Integration            | Implementation Complexity             | :green_circle: :green_circle: :white_circle: <br> Moderate | :green_circle: :green_circle: :white_circle: <br> Moderate |:green_circle: :white_circle: :white_circle: <br> Low |
| Technology @span               | Supported Languages                   | Solidity, Rust | Solidity, Rust, TypeScript | TypeScript |

::end-spantable::

</div>

## Choose a Transfer Mechanism

Wormhole provides two distinct mechanisms for transferring assets cross-chain: [Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank} and [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank}. Both options carry a distinct integration path and feature set depending on your requirements, as outlined in the following sections.

| Feature                | Native Token Transfers                                                     | Token Bridge                                  |
|------------------------|----------------------------------------------------------------------------|-----------------------------------------------|
| **Best for**           | DeFi governance, native assets with multichain liquidity                   | Consumer apps, games, wrapped-token use cases |
| **Mechanism**          | Burn-and-mint or hub-and-spoke                                             | Lock-and-mint                                 |
| **Security**           | Configurable rate limiting, pausing, access control, threshold attestations. Integrated Global Accountant | Preconfigured rate limiting, and integrated Global Accountant |
| **Contract Ownership** | User retains ownership and upgrade authority on each chain                 | Managed via Wormhole Governance |
| **Token Contracts**    | Native contracts owned by your protocol governance       | Wrapped asset contract owned by the Wormhole Token Bridge contract, upgradeable via a 13/19 Guardian governance process. |
| **Integration**        | Customizable, flexible framework for advanced deployments                  | Straightforward, permissionless deployment    |
| **Examples**           | [NTT Connect](https://github.com/wormhole-foundation/demo-ntt-connect){target=\_blank}, [NTT TypeScript SDK](https://github.com/wormhole-foundation/demo-ntt-ts-sdk){target=\_blank}   | [Portal Bridge UI](https://portalbridge.com/){target=\_blank} |


In the following video, Wormhole Foundation DevRel Pauline Barnades walks you through the key differences between Wormhole’s Native Token Transfers (NTT) and Token Bridge and how to select the best option for your use case:

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/wKDf3dyH0OM?si=Gr_iMB1jSs_5Pokm' frameborder='0' allowfullscreen></iframe></div>

Beyond asset transfers, Wormhole provides additional tools for cross-chain data and governance.

## Bridging UI

[**Connect**](/docs/products/connect/overview/){target=\_blank} is a pre-built bridging UI for cross-chain token transfers, requiring minimal setup. Best for projects seeking an easy-to-integrate UI for bridging without modifying contracts.

## Real-time Data

[**Queries**](/docs/products/queries/overview/){target=\_blank} is a data retrieval service to fetch on-chain data from multiple networks. Best for applications that need multichain analytics, reporting, and data aggregation.

## Multichain Governance

[**MultiGov**](/docs/products/multigov/overview/){target=\_blank} is a unified governance framework that manages multichain protocol governance through a single mechanism. Best for projects managing multichain governance and protocol updates.