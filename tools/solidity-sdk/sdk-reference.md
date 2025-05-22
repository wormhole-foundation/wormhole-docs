---
title: Solidity SDK
description: How to use the Wormhole Solidity SDK for cross-chain messaging, token transfers, and integrating decentralized applications on EVM-compatible blockchains.
categories: Solidity-SDK
---

# Solidity SDK

## Introduction 

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} simplifies cross-chain messaging on EVM-compatible chains by providing essential Solidity interfaces, utility libraries, and testing tools. It allows developers to build secure and efficient cross-chain decentralized applications (dApps) without manually interacting with Wormhole’s core contracts across multiple chains.

By abstracting away complex interactions, the SDK drastically reduces the overhead associated with cross-chain development. It provides:

 - **Unified interfaces** - developers can use a standardized set of Solidity interfaces to handle cross-chain messaging, token transfers, and verifiable action approvals (VAAs) without needing to manage the underlying infrastructure
 - **Automated message delivery** - the SDK leverages Wormhole’s relayer infrastructure, automatically delivering messages across chains, reducing the need for manual intervention, and simplifying gas management on the target chain
 - **Seamless integration with Wormhole services** - the SDK integrates with Wormhole’s `TokenBridge` and Circle’s CCTP, providing built-in mechanisms for cross-chain asset transfers, making token bridges and cross-chain messaging easy to implement
 - **Testing and development tools** - it comes with comprehensive tools for local testing and simulation, allowing developers to validate their cross-chain logic before deployment, minimizing the risk of errors in production environments

These features significantly streamline the development workflow by reducing complexity and offering tools compatible with various EVM versions. This helps developers avoid issues that arise from differences in EVM equivalence across chains.

This guide covers installation, key concepts, and usage examples to help you build secure cross-chain applications using the SDK, from token transfers to advanced message passing.

## Installation

To install the SDK, use [Foundry and Forge](https://book.getfoundry.sh/getting-started/installation){target=\_blank}. This pulls the necessary libraries into your project:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk@v0.1.0
```

When developing cross-chain applications, ensure that the chains you target support the EVM version you’re using. For instance, the PUSH0 opcode (introduced in Solidity 0.8.20) may not be available on all chains. To avoid compatibility issues, you can set the EVM version in your `foundry.toml` file:

```toml
evm_version = "paris"
```

This ensures compatibility across all targeted chains, even if some do not yet support the latest EVM upgrades.

## Key Considerations

Before deploying applications using the Wormhole Solidity SDK, keep these considerations in mind:

 - **Version compatibility** - the SDK is evolving, and using tagged releases for production is crucial, as the main branch may introduce breaking changes
 - **IERC-20 remapping** - the SDK provides a remapping mechanism to handle potential conflicts between different implementations of IERC20, ensuring seamless integration with other libraries
 - **Testing** - given the cross-chain dependencies, testing all integrations is critical to avoid issues in production environments

## Concepts and Components

The Wormhole Solidity SDK consists of key components that streamline cross-chain communication, allowing developers to securely and efficiently interact with Wormhole’s infrastructure. Below are the critical concepts and contracts you'll encounter when working with the SDK.

### Cross-Chain Messaging with the Wormhole Relayer SDK

The [`WormholeRelayerSDK.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/WormholeRelayerSDK.sol){target=\_blank} contract simplifies cross-chain messaging and asset transfers by integrating several necessary modules, including the Wormhole relayer. By automating message delivery between chains, the Wormhole relayer removes the need for developers to manage relayer infrastructure or handle gas on the target chain. Delivery providers handle the message payload, ensuring secure and efficient communication.

You can refer to the [Wormhole relayer documentation](/docs/products/messaging/guides/wormhole-relayers/){target=\_blank} for more details.

Key modules in the SDK include:

 - **`Base.sol`** - the core module for cross-chain messaging. It provides utility functions like `onlyWormholeRelayer()` and `setRegisteredSender()`, ensuring that only messages from trusted relayers are processed

 - **`TokenBase.sol`** - this module extends the base messaging functionality to support cross-chain token transfers. It includes utilities for securely sending and receiving tokens between EVM-compatible chains

 - **`CCTPBase.sol`** - designed for Circle’s Cross-Chain Transfer Protocol, this module manages asset transfers such as USDC between chains. It includes functionalities for both sending and receiving CCTP-based assets

 - **`CCTPAndTokenBase.sol`** - a combined module that supports token and CCTP-based asset transfers in a single implementation. This module simplifies development for applications needing to handle both types of transfers

The Wormhole Solidity SDK offers a unified framework for cross-chain communication. Developers can select specific modules based on their application’s requirements, whether for messaging, token transfers, or CCTP. Each module includes built-in security measures, ensuring that only authorized senders or relayers are accepted, thereby protecting the application from unauthorized interactions.

Please refer to the complete `WormholeRelayerSDK.sol` file below for further details.

???- code "`WormholeRelayerSDK.sol`"
    ```solidity
    --8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-1.sol"
    ```

### Base Contract Overview

The [`Base.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/WormholeRelayer/Base.sol){target=\_blank} contract is a core part of the Wormhole Solidity SDK, providing essential helper functions and modifiers for managing cross-chain messages securely via the Wormhole Relayer. It handles sender registration and message validation, ensuring only authorized senders from specific chains can send messages.

 - **`onlyWormholeRelayer()`** - a modifier that ensures only authorized messages from the Wormhole relayer contract are processed, restricting access to certain functions

    ```solidity
    --8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-2.sol:22:28"
    ```

 - **`setRegisteredSender()`** - restricts message acceptance to a registered sender from a specific chain, ensuring messages are only processed from trusted sources

    ```solidity
    --8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-2.sol:45:54"
    ```

These security measures ensure messages come from the correct source and are processed securely. Please refer to the complete `Base.sol` contract below for further details.

???- code "`Base.sol`"
    ```solidity
    --8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-2.sol"
    ```

### Interface for Cross-Chain Messages

The Wormhole Solidity SDK interacts with the Wormhole relayer for sending and receiving messages across EVM-compatible chains. The [`IWormholeRelayer`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeRelayer.sol){target=\_blank} and [`IWormholeReceiver`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol){target=\_blank} interfaces are central to cross-chain communication, enabling secure and efficient message delivery.

For detailed information on how to implement these interfaces, refer to the [Wormhole Relayer Interfaces documentation](/docs/products/messaging/guides/wormhole-relayers/#wormhole-relayer-interfaces){target=\_blank}. This section covers:

 - **`IWormholeRelayer`** – methods for sending cross-chain messages, VAAs, and token transfers
 - **`IWormholeReceiver`** – the required implementation for receiving cross-chain messages
 - **`quoteEVMDeliveryPrice()`** – how to estimate gas and fees for cross-chain transactions

These interfaces reduce the complexity of cross-chain dApp development by abstracting away the details of relayer infrastructure, ensuring that message delivery is handled efficiently.

### Advanced Concepts

For developers interested in exploring additional advanced topics, the following sections provide insights into key aspects of the SDK’s functionality.

???- note "Error Handling and Reverts"
    The SDK defines several custom errors to help developers handle common issues like incorrect gas fees, invalid senders, and more. For example, `InvalidMsgValue` is thrown when the message value for a relayed message is erroneous.

    ```solidity
    error InvalidMsgValue(uint256 msgValue, uint256 totalFee);
    ```

## Usage

This section covers cross-chain messaging and token transfers and shows how to use the Wormhole Solidity SDK in real-world scenarios.

### Send a Cross-Chain Message

To send a cross-chain message, inherit from the base contract provided by the SDK and use its helper methods to define your message and sender address. Here’s a basic example:

```solidity
--8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-3.sol"
```

This contract extends `Base.sol` and allows sending cross-chain messages securely using the `WormholeRelayer`.

### Send Tokens Across Chains

The SDK enables seamless token transfers between EVM-compatible chains in addition to sending messages. To facilitate cross-chain token transfers, you can extend the SDK's `TokenSender` and `TokenReceiver` base contracts.

```solidity
--8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-4.sol"
```

In this example, `TokenSender` initiates a token transfer to another chain. The SDK’s built-in utilities securely handle token transfers, ensuring proper VAAs are generated and processed.

### Receive Tokens Across Chains

To receive tokens on the target chain, implement a contract that inherits from `TokenReceiver` and overrides the `receiveWormholeMessages` function.

```solidity
--8<-- "code/tools/solidity-sdk/sdk-reference/solidity-sdk-5.sol"
```

In this example, `TokenReceiver` allows the contract to handle tokens sent from the source chain. Once the cross-chain message is received, the `receiveWormholeMessages` function processes the incoming tokens. Always validate the message's authenticity and source.

!!! note
    Always verify the source of incoming messages and tokens to prevent unauthorized access to your contract. Please refer to the [Emitter Verification](/docs/products/messaging/guides/core-contracts/#validating-the-emitter/){target=\_blank} section for more details.

## Testing Environment

The SDK includes built-in support for Forge-based testing, which allows you to test your cross-chain applications locally before deploying them to production. Testing with the same Solidity compiler version and configuration you plan to use in production is highly recommended to catch any potential issues early.

For a detailed example, check out the below repositories:

 - [Cross chain messaging](/docs/products/messaging/tutorials/cross-chain-contracts/){target=\_blank}
 - [Cross chain token transfer](/docs/products/messaging/tutorials/cross-chain-token-contracts/){target=\_blank}