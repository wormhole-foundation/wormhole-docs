---
title: Messaging Overview
description: With Wormhole Messaging, you can enable secure, multichain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Basics
---

# Messaging Overview 

Wormhole Messaging is the core protocol of the Wormhole ecosystem—a generic, multichain message-passing layer that enables secure, fast communication between blockchains. It solves the critical problem of blockchain isolation by allowing data and assets to move freely across networks, empowering developers to build true multichain applications.

## Key Features

- **Multichain messaging** - send arbitrary data between blockchains, enabling xDapps, governance actions, or coordination across ecosystems
- **Decentralized validation** - a network of independent [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observes and signs multichain messages, producing [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} that ensure integrity
- **Composable architecture** - works with smart contracts, token bridges, or decentralized applications, providing a flexible foundation for multichain use cases

## How It Works

The messaging flow consists of several core components:

1. **Source chain (emitter contract)** - a contract emits a message by calling the Wormhole [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the source chain
2. **Guardian Network** - [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observe the message, validate it, and generate a signed [VAA](/docs/protocol/infrastructure/vaas/){target=\_blank}
3. **Relayers** - off-chain or on-chain [relayers](/docs/protocol/infrastructure/relayer/){target=\_blank} transport the VAA to the destination chain
4. **Target chain (recipient contract)** - the Core Contract on the destination chain verifies the VAA and triggers the specified application logic

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

## Use Cases

Wormhole Messaging enables a wide range of cross-chain applications. Below are common use cases and the Wormhole stack components you can use to build them.

- **Borrowing and Lending Across Chains (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})**

    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – coordinate actions across chains
    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/){target=\_blank} – transfer collateral as native assets
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch rates and prices in real-time

- **Oracle Networks (e.g., [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank})**

    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – relay verified data
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – aggregate multi-chain sources

- **Gas Abstraction**

    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – coordinate gas logic
    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/){target=\_blank} – handle native token swaps

- **Bridging Intent Library**

    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – dispatch and execute intents
    - [**Settlement**](/docs/products/settlement/get-started/){target=\_blank} - execute user-defined bridging intents

- **Decentralized Social Platforms (e.g., [Chingari](https://chingari.io/){target=\_blank})**

    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – facilitate decentralized interactions
    - [**Token Bridge**](/docs/products/token-bridge/get-started/){target=\_blank} – enable tokenized rewards

## Next Steps

[timeline(wormhole-docs/.snippets/text/products/messaging/overview/messaging-timeline.json)]
