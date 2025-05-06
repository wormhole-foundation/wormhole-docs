---
title: Messaging Overview
description: 
categories: Messaging, Transfer
---

# Messaging Overview 

Wormhole Messaging is the core protocol of the Wormhole ecosystem—a generic, cross-chain message-passing layer that enables secure, fast communication between blockchains. It solves the critical problem of blockchain isolation by allowing data and assets to move freely across networks, empowering developers to build true multichain applications.

## Key Features

- **Cross-chain messaging** - send arbitrary data between blockchains, enabling xDapps, governance actions, or coordination across ecosystems
- **Decentralized validation** - a network of independent [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observes and signs cross-chain messages, producing [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} that ensure integrity
- **Composable architecture** - works with smart contracts, token bridges, or decentralized applications, providing a flexible foundation for multichain use cases

## How It Works

The messaging flow consists of several core components:

1. **Source chain (emitter contract)** - a contract emits a message by calling the Wormhole [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the source chain
2. **Guardian Network** - Guardians observe the message, validate it, and generate a signed VAA (Verifiable Action Approval)
3. **Relayers** - off-chain or on-chain [relayers](/docs/protocol/infrastructure/relayer/){target=\_blank} transport the VAA to the destination chain
4. **Target Chain (recipient contract)** - the Core Contract on the destination chain verifies the VAA and triggers the specified application logic

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

## Use Cases

- **Borrowing and Lending Across Chains** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – moves loan requests and liquidations across chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – transfers collateral as native assets
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetches interest rates and asset prices in real-time

    🏗️ **Used by:** [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank}

- **Real-Time Price Feeds and Trading Strategies** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – sends signals to execute trades
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetches price feeds from oracles and trading platforms

    🏗️ **Used by:** [Infinex](https://wormhole.com/case-studies/infinex){target=\_blank}

- **Decentralized Social Platforms** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – facilitates decentralized interactions
    - [**Token Bridge**](/docs/build/transfers/token-bridge/){target=\_blank} – enables cross-chain tokenized rewards

    🏗️ **Used by:** [Chingari](https://chingari.io/){target=\_blank}

- **Memecoin Launchpads** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – facilitates cross-chain token distribution and claim processes
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – enables native asset transfers for seamless fundraising

- **Gas Abstraction** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – routes gas fee payments across chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – facilitates native token conversion for gas payments

- **Bridging Intent Library** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – enables predefined cross-chain actions and triggers.
    - [**Wormhole Settlement**](/docs/learn/transfers/settlement/overview/){target=\_blank} - provides a framework for executing user-defined bridging intents

- **Oracle Networks** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – ensures tamper-proof data relay across networks
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetches data from multiple chains and Oracle providers

    🏗️ **Used by:** [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank}

- **Cross-Chain Staking** - Build with the following stack: 

    - [**Messaging**](/docs/protocol/infrastructure/){target=\_blank} – moves staking rewards and governance signals across chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/overview/){target=\_blank} – transfers staked assets natively between networks

    🏗️ **Used by:** [Lido](https://lido.fi/){target=\_blank}



## Next Steps

[timeline(wormhole-docs/.snippets/text/build/core-messaging/core-messaging-timeline.json)]
