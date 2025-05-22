---
title: Queries Overview
description: Learn how Wormhole Queries enable smart contracts to fetch real-time, Guardian-verified data across multiple blockchains.
categories: Queries
---

# Queries Overview 

Queries provide on-demand access to Guardian-attested on-chain data. They allow smart contracts to fetch real-time, verifiable data from across the multichain ecosystem, such as prices, rates, and liquidity.

## Key Features

- **On-demand data access** – fetch price feeds, interest rates, and other data in real-time
- **Guardian attested** – all data is signed by [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} for trustless validation
- **Cross-chain ready** – request data on one chain, use it on another
- **Smart contract integration** – results are delivered as [Verified Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank}, readable by smart contracts
- **Chain agnostic** – works across supported EVM chains, Solana, Sui, and [more](/docs/products/queries/reference/supported-networks/){target=\_blank}

## How It Works

A query request follows a simple but robust lifecycle. The off-chain service responsible for handling requests is called the CCQ Server (Cross-Chain Query Server), also referred to as the Query Server throughout this documentation.

1. An off-chain app sends a query to the CCQ Server via HTTPS
2. The CCQ Server checks the request and shares it with [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank}
3. [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} independently fetch the data, verify it, and sign the result
4. Once enough Guardians (2/3 quorum) return matching results, the CCQ Server aggregates and sends the final response
5. The off-chain app submits this result to a smart contract, which verifies the Guardian signatures and uses the data

The CCQ Server is permissioned but trustless. Most queries resolve in under one second, and Guardians retry failed requests for up to one minute. Up to 255 queries can be batched together to optimize performance, supporting efficient multichain workflows.

![The architecture flow of a query](/docs/images/products/queries/overview/overview-1.webp)

## Use Cases

Queries enable a wide range of cross-chain applications. Below are common use cases and the Wormhole stack components you can use to build them.

- **Borrowing and Lending Across Chains (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch rates and prices in real-time
    - [**Messaging**](/docs/products/messaging/overview/){target=\_blank} – sync actions between chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – transfer collateral as native assets

- **Cross-Chain Swaps and Liquidity Aggregation (e.g., [StellaSwap](https://app.stellaswap.com/exchange/swap){target=\_blank})**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch live prices optimal trade execution
    - [**Connect**](/docs/products/connect/overview/){target=\_blank} – handle user-friendly asset transfers
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – moves native tokens

- **Real-Time Price Feeds and Trading Strategies (e.g., [Infinex](https://wormhole.com/case-studies/infinex){target=\_blank})**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch price feeds 
    - [**Messaging**](/docs/products/messaging/overview/){target=\_blank} – trigger trades

- **Multichain Prediction Markets**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch market data and odds
    - [**Settlement**](/docs/products/settlement/overview/){target=\_blank} – automates token execution

- **Oracle Networks (e.g., [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank})**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} –  source data from chains
    - [**Messaging**](/docs/products/messaging/overview/){target=\_blank} – ensures tamper-proof data relay across networks

## Next Steps

Follow these steps to get started with Queries:

[timeline(wormhole-docs/.snippets/text/products/queries/queries-timeline.json)]
