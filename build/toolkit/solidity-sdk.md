---
title: Solidity SDK
description: 
---

# Solidity SDK

## Introduction 

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} simplifies cross-chain messaging on EVM-compatible chains by providing essential Solidity interfaces, utility libraries, and testing tools. It allows developers to build secure and efficient cross-chain decentralized applications (dApps) without needing to manually interact with Wormhole’s core contracts across multiple chains.

Originally designed for interactions with the WormholeRelayer, the SDK now includes tools for other components such as the TokenBridge and CCTP (Circle Cross-Chain Transfer Protocol). It also ensures compatibility with various EVM versions, addressing challenges that arise from differences in EVM-equivalence across chains.

This guide covers installation, key concepts, and usage examples to help you build secure cross-chain applications using the SDK, from token transfers to advanced message passing.

## Installation

To install the SDK, use [Foundry and Forge](https://book.getfoundry.sh/getting-started/installation){target=\_blank}. This pulls the necessary libraries into your project:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk@v0.1.0
```

When developing cross-chain applications, ensure that the chains you are targeting support the EVM version you’re using. For instance, the PUSH0 opcode (introduced in Solidity 0.8.20) may not be available on all chains. To avoid compatibility issues, you can set the EVM version in your `foundry.toml` file:

```toml
evm_version = "paris"
```

This ensures compatibility across all targeted chains, even if some do not yet support the latest EVM upgrades.

## Key Considerations

Before deploying applications using the Wormhole Solidity SDK, keep these considerations in mind:

 - **Version compatibility** - the SDK is evolving, and using tagged releases for production is crucial, as the main branch may introduce breaking changes
 - **IERC-20 remapping** - the SDK provides a remapping mechanism to handle potential conflicts between different implementations of IERC20, ensuring seamless integration with other libraries
 - **Thorough testing** - given the cross-chain dependencies, testing all integrations thoroughly is critical to avoid issues in production environments

## Concepts and Components

The Wormhole Solidity SDK consists of key components that streamline cross-chain communication, allowing developers to securely and efficiently interact with Wormhole’s infrastructure. Below are the critical concepts and contracts you'll encounter when working with the SDK.

### Cross-Chain Messaging with the Wormhole Relayer

The Wormhole Relayer simplifies the process of cross-chain messaging by automating the delivery of messages between chains. Developers no longer need to manage relayer infrastructure or handle gas on the target chain. Instead, delivery providers take care of relaying the message payload.

 - **Why it’s important?** - the relayer automates message delivery, removing manual intervention and ensuring secure, gas-efficient communication across chains
 - **Learn more** - refer to the [Wormhole Relayer documentation](/docs/build/contract-integrations/wormhole-relayers/){target=\_blank} for deeper details

### Core Contract for Wormhole Messaging

The `Base.sol` contract is a core part of the SDK, providing fundamental helper functions and modifiers to securely manage cross-chain messages. This contract integrates both the Wormhole Relayer and the `TokenBridge`.

 - **`onlyWormholeRelayer()`** - ensures only authorized messages from the Wormhole Relayer contract are processed

    ```solidity
    modifier onlyWormholeRelayer() {
        require(msg.sender == address(wormholeRelayer), "Msg.sender is not Wormhole Relayer");
        _;
    }
    ```

 - **`setRegisteredSender()`** - restricts message acceptance to a registered sender from a specific chain, ensuring messages are only processed from trusted sources

    ```solidity
    function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) public {
        require(msg.sender == registrationOwner, "Not allowed to set registered sender");
        registeredSenders[sourceChain] = sourceAddress;
    }
    ```

These security measures are vital for ensuring messages come from the correct source and are processed securely.

### Interface for Sending Cross-Chain Messages

The `IWormholeRelayer` interface provides key methods for sending messages across chains. It is integral for developers who want to pass instructions, token transfers, or any custom payload between EVM-compatible chains without maintaining their own relaying infrastructure.

 - **sendPayloadToEvm()** - sends a message to a specific chain along with gas and value. Useful for general cross-chain messaging

    ```solidity
    function sendPayloadToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 gasLimit
    ) external payable returns (uint64 sequence);
    ```

 - **sendVaasToEvm()** - sends both a payload and any associated VAAs, such as those required for cross-chain token transfers, to another chain

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

The `IWormholeReceiver` interface defines the function your contract must implement to receive messages sent from other chains. This is the entry point for cross-chain messaging and must be secured to accept messages only from the Wormhole Relayer.

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
    The SDK defines several custom errors to help developers handle common issues like incorrect gas fees, invalid senders, and more. For example, `InvalidMsgValue` is thrown when the message value is incorrect for a relayed message.

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
    The SDK supports cross-chain token transfers through the TokenBridge and Circle Cross-Chain Transfer Protocol (CCTP). You can use the `sendToEvm()` function to transfer tokens and other data between chains.
    
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

This section shows how to use the Wormhole Solidity SDK in real-world scenarios, covering cross-chain messaging and token transfers.

### Send a Cross-Chain Message

To send a cross-chain message, inherit from the base contract provided by the SDK and use its helper methods to define your message and sender address. Here’s a basic example:

```solidity
pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/Base.sol";

contract CrossChainSender is Base {
    constructor(address _wormholeRelayer, address _wormhole) Base(_wormholeRelayer, _wormhole) {}

    function sendMessage(
        bytes memory message,
        uint16 targetChain,
        bytes32 targetAddress
    ) external payable {
        // Register sender and send message through WormholeRelayer
        setRegisteredSender(targetChain, msg.sender);
        onlyWormholeRelayer().sendPayloadToEvm(targetChain, address(targetAddress), message, 0, 500_000);
    }
}
```

This contract extends `Base.sol` and allows sending cross-chain messages securely using the `WormholeRelayer`.

### Send Tokens Across Chains

In addition to sending messages, the SDK enables seamless token transfers between EVM-compatible chains. To facilitate cross-chain token transfers, you can extend the `TokenSender` and `TokenReceiver` base contracts from the SDK.

```solidity
pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/TokenBase.sol";

contract CrossChainTokenSender is TokenSender {
    constructor(address _wormholeRelayer, address _wormhole) TokenSender(_wormholeRelayer, _wormhole) {}

    function sendToken(
        address token,
        uint256 amount,
        uint16 targetChain,
        bytes32 targetAddress
    ) external payable {
        // Send tokens across chains
        transferTokenToTarget(token, amount, targetChain, targetAddress);
    }
}
```

In this example, `TokenSender` is used to initiate a token transfer to another chain. The SDK’s built-in utilities handle token transfers securely, ensuring that the proper VAAs are generated and processed.

### Receive Tokens Across Chains

To receive tokens on the target chain, implement a contract that inherits from `TokenReceiver` and overrides the `receiveWormholeMessages` function.

```solidity
pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/TokenBase.sol";

contract CrossChainTokenReceiver is TokenReceiver {
    constructor(address _wormholeRelayer, address _wormhole) TokenReceiver(_wormholeRelayer, _wormhole) {}

    // Function to handle received tokens from another chain
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable override {
        // Process the received tokens here
        receiveTokens(payload);
    }
}
```

In this example, `TokenReceiver` allows the contract to handle tokens sent from the source chain. The `receiveWormholeMessages` function processes the incoming tokens once the cross-chain message is received. Always validate the message's authenticity and source.

!!! note
    Always verify the source of incoming messages and tokens to prevent unauthorized access to your contract. Please refer to the [Emitter Verification](){target=\_blank} section for more details.

## Testing Environment

The SDK includes built-in support for Forge-based testing, which allows you to test your cross-chain applications locally before deploying them to production. Testing with the same Solidity compiler version and configuration that you plan to use in production is highly recommended to catch any potential issues early.

For a detailed testing example, check out the below repositories:

 - [Cross chain messaging](/docs/tutorials/messaging/cross-chain-contracts/){target=\_blank}
 - [Cross chain token transfer](/docs/tutorials/messaging/cross-chain-token-contracts/){target=\_blank}

## Conclusion

The Wormhole Solidity SDK simplifies the process of building secure, cross-chain applications on EVM-compatible chains. With its suite of interfaces, base contracts, and testing utilities, developers can focus on their application logic rather than the complexities of cross-chain messaging and token transfers. By providing a standardized way to interact with the WormholeRelayer, TokenBridge, and other Wormhole services, the SDK ensures a smooth development experience.

For more advanced examples, refer to the official Wormhole SDK GitHub repository.