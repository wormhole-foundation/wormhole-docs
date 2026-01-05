---
title: Messaging Overview
description: With Wormhole Messaging, you can enable secure, multichain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Basics
url: https://wormhole.com/docs/products/messaging/overview/
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
3. **Relayers (Executor)**: Off-chain or on-chain relayers transport the VAA to the destination chain. In Wormhole’s architecture, this role is fulfilled by the [**Executor**](/docs/products/messaging/concepts/executor-overview/){target=\_blank}, a permissionless, shared framework that standardizes message delivery across all supported chains.
4. **Target chain (recipient contract)**: The [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the destination chain verifies the VAA and triggers the specified application logic.

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

## Use Cases

Wormhole Messaging enables a wide range of multichain applications. Below are common use cases and the Wormhole stack components you can use to build them.

- **Borrowing and Lending Across Chains (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Coordinate actions across chains.
    - **[Native Token Transfers](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank}**: Transfer collateral as native assets.
    - **[Queries](/docs/products/queries/overview/){target=\_blank}**: Fetch rates and prices in real-time.

- **Oracle Networks (e.g., [Pyth](https://wormhole.com/case-studies/pyth){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Relay verified data.
    - **[Queries](/docs/products/queries/overview/){target=\_blank}**: Aggregate multi-chain sources.

- **Gas Abstraction**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Coordinate gas logic.
    - **[Native Token Transfers](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank}**: Handle native token swaps.

- **Bridging Intent Library**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Dispatch and execute intents.
    - **[Settlement](/docs/products/settlement/overview/){target=\_blank}**: Execute user-defined bridging intents.

- **Decentralized Social Platforms (e.g., [Chingari](https://chingari.io/){target=\_blank})**

    - **[Messaging](/docs/products/messaging/get-started/){target=\_blank}**: Facilitate decentralized interactions.
    - **[Wrapped Token Transfers](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank}**: Enable tokenized rewards.

## Next Steps

Follow these steps to work with Wormhole Messaging:

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Get Started with Messaging**

    ---

    Use the core protocol to publish a multichain message and return transaction info with VAA identifiers.

    [:custom-arrow: Get Started](/docs/products/messaging/get-started/)

-   :octicons-book-16:{ .lg .middle } **Executor Overview**

    ---

    Learn how to use Executors to automate message handling and application logic across chains.

    [:custom-arrow: Learn about Executors](/docs/protocol/infrastructure/relayers/executor-framework/)

-   :octicons-tools-16:{ .lg .middle } **Solana Shim Programs**

    ---

    For lower-cost, efficient integration with Core Bridge on Solana, consider using shim programs:

    [:custom-arrow: Learn about Solana Shims](/docs/products/messaging/concepts/solana-shim/)

    [:custom-arrow: Emit Messages with the Emission Shim](/docs/products/messaging/guides/solana-shims/sol-emission/)

    [:custom-arrow: Verify VAAs with the Verification Shim](/docs/products/messaging/guides/solana-shims/sol-verification/)

</div>
