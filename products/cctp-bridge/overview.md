---
title: CCTP Bridge with Wormhole
description: Learn how the integration of Circle's CCTP with Wormhole enables secure and efficient native USDC transfers and complex cross-chain interactions.
categories: CCTP, Wormhole, Transfer
---

# CCTP with Wormhole Overview 

The integration of Circle's Cross-Chain Transfer Protocol (CCTP) with the Wormhole messaging protocol creates a robust system for securely and efficiently transferring native USDC across different blockchain networks while enabling more complex cross-chain interactions. This combination streamlines the movement of stablecoins, reduces risk, and unlocks new possibilities for decentralized applications.

## Key Features

**Secure Native USDC Transfers (CCTP)** - At its core, CCTP provides a "burn-and-mint" mechanism for transferring native USDC. This eliminates the need for wrapped assets and the associated risks of intermediary bridges.

**Generic Cross-Chain Messaging (Wormhole)** - Wormhole acts as a powerful communication layer, allowing for the transmission of arbitrary data between blockchains.

**Atomic Execution** - By combining CCTP and Wormhole, the transfer of USDC and the execution of accompanying instructions on the destination chain can occur as a single, atomic transaction.

**Enhanced Composability** - Developers can build more sophisticated cross-chain applications by sending additional data alongside the USDC transfer.

## How It Works

Imagine a user wants to move USDC from Ethereum to Polygon and simultaneously trigger a swap on a DEX.

1.  **Initiation on Source Chain:** The user initiates the transfer of native USDC on Ethereum through a dApp integrated with both CCTP and Wormhole. The application also defines the swap action to be executed on Polygon.
2.  **CCTP Burn and Wormhole Message:** The specified amount of native USDC is burned on Ethereum via CCTP. Simultaneously, Wormhole packages the details of the CCTP burn event along with the instructions for the swap on Polygon into a cross-chain message.
3.  **Circle Attestation:** Circle's attestation service confirms the USDC burn on Ethereum and issues a cryptographic signature.
4.  **Wormhole Relayer Network:** Wormhole guardians observe the burn event and Circle's attestation. They then sign and relay the message containing the attestation and the swap instructions to the target chain (Polygon).
5.  **Message Delivery and CCTP Mint:** On Polygon, the Wormhole message is received and verified by the Wormhole core contract. The CCTP integration on Polygon uses Circle's attestation within the Wormhole message to mint the equivalent amount of native USDC.
6.  **Automated Action (Optional):** If included in the Wormhole message, the swap instruction is then executed on the designated DEX on Polygon, potentially utilizing the newly arrived USDC.

This process highlights how CCTP ensures the secure transfer of native USDC, while Wormhole provides the messaging infrastructure to carry the attestation and enable more complex, automated cross-chain workflows.

## Use Cases

Integrating Wormhole's messaging with CCTP enables the secure transfer of native USDC across blockchains, unlocking key cross-chain use cases. which include:

- **Enhanced Cross-Chain DEX Aggregation**
    - [**Wormhole Connect**](/docs/products/connect/get-started/){target=\_blank} – provides a user-friendly interface for cross-chain native USDC transfers
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – allows the movement of native USDC across connected chains
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – can be used to fetch real-time pricing data for optimal native USDC swaps

- **Streamlined Cross-Chain Lending and Borrowing**
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – enables the transfer of native USDC as collateral between chains
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – coordinates loan requests, repayments, and liquidation events involving native USDC across chains
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – can fetch interest rates and native USDC collateral values from different chains

- **Simplified User Onboarding with Native USDC**
    - [**Wormhole Connect**](/docs/products/connect/get-started/){target=\_blank} – provides a user-friendly interface for onboarding users with native USDC from other chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – facilitates the direct transfer of native USDC to new users on different chains

- **Cross-Chain Payments and Settlement with Native USDC**
    - [**Wormhole Connect**](/docs/products/connect/get-started/){target=\_blank} – facilitates seamless payments in native USDC across various networks
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – ensures direct, native USDC transfers for payments and settlement

## Next Steps

Now that you're familiar with the enhanced cross-chain USDC transfers enabled by CCTP and Wormhole—it’s time to put it into action. Whether you're a developer or DeFi builder, you can integrate this powerful technology into your app in just a few steps. Dive into our hands-on tutorials and start building:

- [Transfer USDC via CCTP and Wormhole SDK](https://wormhole.com/docs/tutorials/typescript-sdk/usdc-via-cctp/){target=\_blank}—Follow our step-by-step guide to move native USDC across chains using the Wormhole SDK and CCTP
- [Interacting with CCTP Contracts](https://wormhole.com/docs/build/transfers/cctp/){target=\_blank} – Learn how to integrate with Wormhole's CCTP contracts in your smart contracts for advanced cross-chain USDC functionality

If you want to gain a deeper understanding of the underlying technology:

- [Messaging Infrastructure:](https://wormhole.com/docs/learn/messaging/){target=\_blank}Familiarize yourself with Wormhole's fundamental cross-chain communication protocol, which enables the transfer of arbitrary data between blockchains, a key component for CCTP integration
- [Multichain Transfers:](https://wormhole.com/docs/learn/transfers/){target=\_blank} Review the "Learn" section on "Multichain Transfers" to grasp the broader concepts of how Wormhole facilitates asset movement across different networks, providing context for how CCTP for USDC fits into the larger ecosystem

Test it, build it, and unlock seamless native USDC transfers across chains. The infrastructure is ready—now it’s your move.