---
title: Messaging Overview
description: With Wormhole Messaging, you can enable secure, multichain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Basics
---

# Messaging Overview 

Wormhole Messaging is the core protocol of the Wormhole ecosystem—a generic, multichain message-passing layer that enables secure, fast communication between blockchains. It solves the critical problem of blockchain isolation by allowing data and assets to move freely across networks, empowering developers to build true multichain applications.

## Key Features

- **Multichain messaging**: Send arbitrary data between blockchains, enabling xDapps, governance actions, or coordination across ecosystems.
- **Decentralized validation**: A network of independent [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observes and signs multichain messages, producing [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} that ensure integrity.
- **Composable architecture**: Works with smart contracts, token bridges, or decentralized applications, providing a flexible foundation for multichain use cases.

## How It Works

The messaging flow consists of several core components:

1. **Source chain (emitter contract)**: A contract emits a message by calling the Wormhole [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the source chain.
2. **Guardian Network**: [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observe the message, validate it, and generate a signed [VAA](/docs/protocol/infrastructure/vaas/){target=\_blank}.
3. **Relayers**: Off-chain or on-chain [relayers](/docs/protocol/infrastructure/relayer/){target=\_blank} transport the VAA to the destination chain.
4. **Target chain (recipient contract)**: The [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the destination chain verifies the VAA and triggers the specified application logic.

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

## Use Cases

Wormhole Messaging enables a wide range of multichain applications. Below are common use cases and the Wormhole stack components you can use to build them.

- **Borrowing and Lending Across Chains (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Coordinate actions across chains.
    - **[Native Token Transfers](/docs/products/native-token-transfers/overview/){target=\_blank}**: Transfer collateral as native assets.
    - **[Queries](/docs/products/queries/overview/){target=\_blank}**: Fetch rates and prices in real-time.

- **Oracle Networks (e.g., [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Relay verified data.
    - **[Queries](/docs/products/queries/overview/){target=\_blank}**: Aggregate multi-chain sources.

- **Gas Abstraction**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Coordinate gas logic.
    - **[Native Token Transfers](/docs/products/native-token-transfers/overview/){target=\_blank}**: Handle native token swaps.

- **Bridging Intent Library**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Dispatch and execute intents.
    - **[Settlement](/docs/products/settlement/overview/){target=\_blank}**: Execute user-defined bridging intents.

- **Decentralized Social Platforms (e.g., [Chingari](https://chingari.io/){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Facilitate decentralized interactions.
    - **[Token Bridge](/docs/products/token-bridge/overview/){target=\_blank}**: Enable tokenized rewards.

## Next Steps

Follow these steps to work with Wormhole Messaging:

- **[Get Started with Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Use the core protocol to publish a multichain message and return transaction info with VAA identifiers.
- **[Use Wormhole Relayers](/docs/products/messaging/guides/wormhole-relayers/){target=\_blank}**: Send and receive messages without off-chain infrastructure.

