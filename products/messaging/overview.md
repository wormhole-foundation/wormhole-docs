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

Wormhole Messaging enables a wide range of cross-chain applications. Below are common use cases and the core Wormhole stack components you can use to build them.

### Finance and Trading

- **Borrowing and Lending Across Chains** - **used by:** [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank}

    - [**Messaging**](#){target=\_blank} – coordinate actions across chains
    - [**Native Token Transfer**](#){target=\_blank} – transfer collateral as native assets
    - [**Queries**](#){target=\_blank} – fetch rates and prices in real-time

- **Real-Time Price Feeds and Trading Strategies** - **used by:** [Infinex](https://wormhole.com/case-studies/infinex){target=\_blank}

    - [**Messaging**](#){target=\_blank} – trigger trade execution
    - [**Queries**](#){target=\_blank} – access real-time price feeds

- **Oracle Networks** - **used by:** [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank}

    - [**Messaging**](#){target=\_blank} – relay verified data
    - [**Queries**](#){target=\_blank} – aggregate multi-chain sources

### Protocol Infrastructure

- **Gas Abstraction**

    - [**Messaging**](#){target=\_blank} – coordinate gas logic
    - [**Native Token Transfer**](#){target=\_blank} – handle native token swaps

- **Bridging Intent Library**

    - [**Messaging**](#){target=\_blank} – dispatch and execute intents
    - [**Wormhole Settlement**](#){target=\_blank} - execute user-defined bridging intents

### Application-Level Integrations

- **Decentralized Social Platforms** - **Used by:** [Chingari](https://chingari.io/){target=\_blank}

    - [**Messaging**](#){target=\_blank} – facilitate decentralized interactions
    - [**Token Bridge**](#){target=\_blank} – enable tokenized rewards

- **Memecoin Launchpads** 

    - [**Messaging**](#){target=\_blank} – manage token distribution and claim processes
    - [**Native Token Transfer**](#){target=\_blank} – move funds between chains

- **Cross-Chain Staking** - **Used by:** [Lido](https://lido.fi/){target=\_blank}

    - [**Messaging**](#){target=\_blank} – send governance and reward signals
    - [**Native Token Transfer**](#){target=\_blank} – move staked assets

## Next Steps

[timeline(wormhole-docs/.snippets/text/build/core-messaging/core-messaging-timeline.json)]
