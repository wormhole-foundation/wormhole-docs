---
title: Queries Overview
description: 
categories: Queries
---

# Queries Overview 

Wormhole Queries offer on-demand access to Guardian-attested on-chain data. They allow smart contracts to fetch real-time, verifiable data, such as prices, rates, and liquidity, from across the multichain ecosystem.

## Key Features

- **On-demand data access** – fetch price feeds, interest rates, and other data in real-time
- **Guardian attested** – all data is signed by Wormhole Guardians for trustless validation
- **Cross-chain ready** – eequest data on one chain, use it on another
- **Smart contract integration** – results are delivered as VAAs, readable by smart contracts
- **Chain agnostic** – works across supported EVM chains, Solana, Sui, and more

## How It Works

1. An off-chain app sends a query to the Query Server via HTTPS
2. The Query Server checks the request and shares it with Wormhole Guardians
3. Guardians independently fetch the data, verify it, and sign the result
4. Once enough Guardians (2/3 quorum) return matching results, the Query Server aggregates and sends the final response
5. The off-chain app submits this result to a smart contract, which verifies the Guardian signatures and uses the data

The Query Server is a permissioned but trustless component. Most queries complete in under one second. If a query fails, Guardians retry for up to one minute. Requests can be batched to reduce on-chain overhead and support complex multi-chain operations.

## Use Cases

Queries enable a wide range of cross-chain applications. Below are common use cases and the Wormhole stack components you can use to build them.

- **Borrowing and Lending Across Chains (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})**

    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch rates and prices in real-time
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – sync actions between chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – transfer collateral as native assets

- **Cross-Chain Swaps and Liquidity Aggregation (e.g., [StellaSwap](https://app.stellaswap.com/exchange/swap){target=\_blank})**

    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetch live prices optimal trade execution
    - [**Wormhole Connect**](/docs/products/connect/overview/){target=\_blank} – handle user-friendly asset transfers
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – moves native tokens

- **Real-Time Price Feeds and Trading Strategies (e.g., [Infinex](https://wormhole.com/case-studies/infinex){target=\_blank})**

    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetch price feeds 
    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – trigger trades

- **Multichain Prediction Markets**

    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetch market data and odds
    - [**Wormhole Settlement**](/docs/learn/transfers/settlement/overview/){target=\_blank} – automates token execution

- **Oracle Networks (e.g., [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank})**

    - [**Queries**](/docs/build/queries/overview/){target=\_blank} –  source data from chains
    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – ensures tamper-proof data relay across networks

## Next Steps

[timeline(wormhole-docs/.snippets/text/build/core-messaging/core-messaging-timeline.json)]
