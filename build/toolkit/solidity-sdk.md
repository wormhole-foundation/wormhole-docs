---
title: Solidity SDK
description: How to use the Wormhole Solidity SDK for cross-chain messaging, token transfers, and integrating decentralized applications on EVM-compatible blockchains.
---

# Solidity SDK

## Introduction 

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} simplifies cross-chain messaging on EVM-compatible chains by providing essential Solidity interfaces, utility libraries, and testing tools. It allows developers to build secure and efficient cross-chain decentralized applications (dApps) without manually interacting with Wormhole’s core contracts across multiple chains.

Initially designed for interactions with the Wormhole-deployed relayer contract, the SDK now includes tools for other components, such as the Token Bridge and CCTP (Circle Cross-Chain Transfer Protocol). It also ensures compatibility with various EVM versions, addressing challenges that arise from differences in EVM equivalence across chains.

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

### Cross-Chain Messaging with the Wormhole Relayer

The Wormhole Relayer simplifies cross-chain messaging by automating message delivery between chains. Developers no longer need to manage relayer infrastructure or handle gas on the target chain. Instead, delivery providers relay the message payload.

 - **Why it’s important?** - the relayer automates message delivery, removing manual intervention and ensuring secure, gas-efficient communication across chains
 - **Learn more** - refer to the [Wormhole Relayer documentation](/docs/build/contract-integrations/wormhole-relayers/){target=\_blank} for deeper details

### Core Contract for Wormhole Messaging

The `Base.sol` contract is a core part of the SDK, providing fundamental helper functions and modifiers to manage cross-chain messages securely. This contract integrates both the Wormhole Relayer and the `TokenBridge`.

 - **`onlyWormholeRelayer()`** - ensures only authorized messages from the Wormhole Relayer contract are processed

    ```solidity
    --8<-- "code/build/toolkit/solidity-sdk/base.sol:22:28"
    ```

 - **`setRegisteredSender()`** - restricts message acceptance to a registered sender from a specific chain, ensuring messages are only processed from trusted sources

    ```solidity
    --8<-- "code/build/toolkit/solidity-sdk/base.sol:45:54"
    ```

These security measures ensure messages come from the correct source and are processed securely. Please refer to the complete Base.sol contract below for further details.

???- code "`Base.sol`"
    ```solidity
    --8<-- "code/build/toolkit/solidity-sdk/base.sol"
    ```

### Interface for Sending Cross-Chain Messages

The `IWormholeRelayer` interface provides key methods for sending messages across chains. It is integral for developers who want to pass instructions, token transfers, or any custom payload between EVM-compatible chains without maintaining their relaying infrastructure.

 - **`sendPayloadToEvm()`** - sends a message to a specific chain along with gas and value. Valid for general cross-chain messaging

    ```solidity
    function sendPayloadToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 gasLimit
    ) external payable returns (uint64 sequence);
    ```

 - **`sendVaasToEvm()`** - sends both a payload and any associated VAAs, such as those required for cross-chain token transfers, to another chain

    ```solidity
    function sendVaasToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 gasLimit,
        VaaKey[] memory vaaKeys
    ) external payable returns (uint64 sequence);
    ```

These functions enable seamless communication across chains, reducing the complexity of multi-chain dApp development.

### Interface for Receiving Cross-Chain Messages

The `IWormholeReceiver` interface defines the function your contract must implement to receive messages sent from other chains. This entry point for cross-chain messaging must be secured to accept messages only from the Wormhole relayer.

 - **`receiveWormholeMessages()`** - handles the incoming message, allowing your contract to process cross-chain payloads

    ```solidity
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable;
    ```

    This function is the backbone of cross-chain message handling, ensuring payloads are processed correctly on the target chain.

### Advanced Concepts

For developers interested in exploring additional advanced topics, the following sections provide insights into key aspects of the SDK’s functionality.

???- note "Error Handling and Reverts"
    The SDK defines several custom errors to help developers handle common issues like incorrect gas fees, invalid senders, and more. For example, `InvalidMsgValue` is thrown when the message value for a relayed message is erroneous.

    ```solidity
    error InvalidMsgValue(uint256 msgValue, uint256 totalFee);
    ```

???- note "Gas Management"
    Gas is critical for cross-chain interactions. The SDK includes methods like `quoteEVMDeliveryPrice()` to calculate the required gas for a cross-chain delivery, helping developers avoid underfunded transactions.

    ```solidity
    function quoteEVMDeliveryPrice(
        uint16 targetChain,
        uint256 receiverValue,
        uint256 gasLimit
    ) external view returns (uint256 nativePriceQuote, uint256 targetChainRefundPerGasUnused);
    ```

???- note "Cross-Chain Token Transfers and CCTP"
    The SDK supports cross-chain token transfers through the TokenBridge and Circle CCTP. To transfer tokens and other data between chains, you can use the `sendToEvm()` function.
    
    ```solidity
    function sendToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 paymentForExtraReceiverValue,
        uint256 gasLimit,
        uint16 refundChain,
        address refundAddress,
        address deliveryProviderAddress,
        MessageKey[] memory messageKeys,
        uint8 consistencyLevel
    ) external payable returns (uint64 sequence);
    ```

## Usage

This section covers cross-chain messaging and token transfers and shows how to use the Wormhole Solidity SDK in real-world scenarios.

### Send a Cross-Chain Message

To send a cross-chain message, inherit from the base contract provided by the SDK and use its helper methods to define your message and sender address. Here’s a basic example:

```solidity
--8<-- "code/build/toolkit/solidity-sdk/Send-message.sol"
```

This contract extends `Base.sol` and allows sending cross-chain messages securely using the `WormholeRelayer`.

### Send Tokens Across Chains

The SDK enables seamless token transfers between EVM-compatible chains in addition to sending messages. To facilitate cross-chain token transfers, you can extend the SDK's `TokenSender` and `TokenReceiver` base contracts.

```solidity
--8<-- "code/build/toolkit/solidity-sdk/Send-tokens.sol"
```

In this example, `TokenSender` initiates a token transfer to another chain. The SDK’s built-in utilities securely handle token transfers, ensuring proper VAAs are generated and processed.

### Receive Tokens Across Chains

To receive tokens on the target chain, implement a contract that inherits from `TokenReceiver` and overrides the `receiveWormholeMessages` function.

```solidity
--8<-- "code/build/toolkit/solidity-sdk/Receive-tokens.sol"
```

In this example, `TokenReceiver` allows the contract to handle tokens sent from the source chain. Once the cross-chain message is received, the `receiveWormholeMessages` function processes the incoming tokens. Always validate the message's authenticity and source.

!!! note
    Always verify the source of incoming messages and tokens to prevent unauthorized access to your contract. Please refer to the [Emitter Verification](/docs/build/contract-integrations/core-contracts/#validating-the-emitter/){target=\_blank} section for more details.

## Testing Environment

The SDK includes built-in support for Forge-based testing, which allows you to test your cross-chain applications locally before deploying them to production. Testing with the same Solidity compiler version and configuration you plan to use in production is highly recommended to catch any potential issues early.

For a detailed testing example, check out the below repositories:

 - [Cross chain messaging](/docs/tutorials/messaging/cross-chain-contracts/){target=\_blank}
 - [Cross chain token transfer](/docs/tutorials/messaging/cross-chain-token-contracts/){target=\_blank}

## Conclusion

The Wormhole Solidity SDK simplifies building secure, cross-chain applications on EVM-compatible chains. With its suite of interfaces, base contracts, and testing utilities, developers can focus on their application logic rather than the complexities of cross-chain messaging and token transfers. By providing a standardized way to interact with the WormholeRelayer, TokenBridge, and other Wormhole services, the SDK ensures a smooth development experience.

For more advanced examples, refer to the official Wormhole SDK GitHub repository.