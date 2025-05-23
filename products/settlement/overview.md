---
title: Settlement Overview
description: Discover how Settlement enables fast, intent-based token transfers across chains using a unified system of solver auctions and integrated execution routes.
categories: Settlement, Transfer
---

# Settlement Overview 

Wormhole Settlement is a multichain transfer system that lets users describe what they want, like sending or swapping tokens, without handling the execution themselves. Instead, off-chain agents called solvers compete to fulfill these user intents.

Settlement was built to address liquidity fragmentation across chains. Traditionally, solvers had to split their capital between multiple networks, which reduced efficiency and scalability. Settlement solves this by consolidating liquidity on Solana, enabling faster execution and minimal slippage, even as liquidity and supported chains scale.

It combines three complementary protocols into a single integration suite, letting developers pick the best execution route based on cost, speed, and asset requirements.

## Key Features

- **Intent-based architecture**: users express what they want to happen (e.g., swap X for Y on chain Z), and solvers execute it
- **Solver auctions**: solvers compete in on-chain auctions for the right to fulfill intents, improving execution quality
- **Unified liquidity**: liquidity is concentrated on Solana, reducing fragmentation and making scaling easier
- **Minimal slippage**: Settlement abstracts away complex balancing operations and uses shuttle assets like USDC and NTT
- **Three interchangeable routes**: each with distinct tradeoffs in speed, cost, and protocol requirements

## How It Works

At the core of Settlement are two components:

- **Intents**: these are signed transactions where a user defines what outcome they want (e.g., send USDC to another chain and receive ETH). It abstracts what the user wants, not how it should be executed
- **Solvers**: third-party agents that compete in auctions to fulfill these intents. They front capital, perform swaps or transfers, and receive fees in return

Settlement leverages three integrated protocols:

<!--
waiting with publishing until the Product team gives more information regarding the upcoming plans for Settlement

| Feature                | Mayan Swift               | Liquidity Layer          | Mayan MCTP                             |
|------------------------|---------------------------|--------------------------|----------------------------------------|
| Architecture           | Intent architecture       | Hub-and-spoke model      | CCTP wrapper                           |
| Speed                  | ~12 seconds               | ~15–25 seconds           | Slower, depends on chain finality      |
| Liquidity Location     | Distributed across chains | Consolidated on Solana   | Uses CCTP to move liquidity            |
| Liquidity Requirements | Inventory on all chains   | Liquidity on Solana only | None (relayer handles bridging + swap) |
| Rebalancing Required   | Yes                       | No                       | No                                     |
| Asset Support          | Primary assets            | USDC and NTT             | USDC only                              |

-->

### Mayan Swift

Mayan Swift implements a traditional intent-based architecture where solvers compete to fulfill user intents using their inventory distributed across chains. It offers the fastest execution in the Settlement suite, typically around 12 seconds. To participate, solvers must hold assets on multiple chains, which can lead to imbalances: some chains may get depleted while others accumulate excess. This requires occasional rebalancing and adds operational overhead. Despite that, Mayan Swift is ideal for high-speed transfers involving common assets and benefits from open, competitive auctions that can drive down execution prices.

```mermaid
flowchart LR

    subgraph A[User has ARB and wants WIF]
        direction LR
        ARB[ARB] ==> WIF[WIF]
    end

    ARB -.-> ETH[ETH]
    subgraph B[" "]
        direction LR
        ETH -.-> Escrow[Escrow Contract]
        Escrow -.-> ArbSolver[Solver Wallet on ETH]
        Escrow -. Emits VAA .-> SolSolver[Solver Wallet on Solana]
        SolSolver -.-> SOL
        SOL -.-> WIF
    end

    WIF -.-> UW[User Wallet]

```

### Liquidity Layer

The Liquidity Layer uses a hub-and-spoke architecture with Solana as the central liquidity hub. Solvers only need to provide liquidity on Solana, eliminating the need for cross-chain inventory management. This route relies on USDC and NTT as shuttle assets and executes transactions in roughly 15 to 25 seconds. Solvers participate in on-chain English auctions to win execution rights and front the necessary assets to fulfill user intents. The design removes the need for rebalancing, making it more scalable and capital-efficient, especially for high-volume or frequently used applications.

```mermaid
flowchart LR

    subgraph TOP [User has ARB and wants JOE]
        ARB[ARB] ==> JOE[JOE]
    end

    subgraph B[" "]
        direction LR
        ARB -.-> USDC1[USDC]
        USDC1 -.-> SOL
        SOL -.-> USDC2[USDC]
        USDC2 -.-> JOE
    end
```

### Mayan MCTP

Mayan MCTP is a fallback protocol that wraps Circle’s CCTP into the Settlement framework. It bundles USDC bridging and swaps into a single operation handled by protocol logic. This route is slower due to its reliance on chain finality. However, it provides broad compatibility and redundancy, making it useful when faster routes are unavailable or when targeting chains that aren’t supported by Swift or the Liquidity Layer. While typically more expensive due to protocol fees, it’s a reliable way to ensure settlement completion in edge cases.

### One Integration, Three Ways

Settlement isn't about choosing just one route; it’s a protocol suite in which all three architectures work together to maximize coverage, speed, and reliability.

By default, Settlement integrates all three:

- The SDK automatically resolves the best route for each transfer
- If a fast route like Mayan Swift is unavailable, it can fall back to Liquidity Layer or MCTP
- This redundancy ensures better uptime, pricing, and a smoother user experience without extra logic

Developers can customize route preferences, but for most applications, no configuration is needed to benefit from the full suite.

## Use Cases

- **Cross-Chain Perpetuals** 

    - [**Settlement**](#){target=\_blank} - fast token execution across chains
    - [**Queries**](#){target=\_blank} – fetch live prices and manage position state across chains

- **Bridging Intent Library**

    - [**Settlement**](#){target=\_blank} - handles user-defined bridge intents
    - [**Messaging**](#){target=\_blank} – triggers cross-chain function calls

- **Multichain Prediction Markets**

    - [**Settlement**](/docs/learn/transfers/settlement/overview/){target=\_blank} – executes token flows between chains
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – gets market data and tracks state

## Next Steps