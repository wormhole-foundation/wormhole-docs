---
title: Solidity SDK
description: 
---

# Solidity SDK

## Introduction

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} is designed to simplify the process of integrating with Wormhole’s cross-chain messaging infrastructure on EVM-compatible chains. By offering essential Solidity interfaces, utility libraries, and testing tools, the SDK helps developers build secure and efficient cross-chain decentralized applications (dApps) without needing to manually interact with Wormhole's core contracts across multiple chains.

Initially developed to support interactions with the WormholeRelayer, the SDK has evolved to include tools that streamline integrations with other Wormhole components like the TokenBridge and CCTP (Circle Cross-Chain Transfer Protocol). The SDK also ensures compatibility with multiple EVM versions, addressing the challenges of deploying on chains with varying levels of EVM equivalence.

This documentation will guide you through the installation process, key concepts, and usage examples for building cross-chain applications with the Wormhole Solidity SDK. Whether you're working on token transfers, message passing, or more complex cross-chain interactions, this SDK provides the foundational tools to make development easier and more secure.

## Installation

To install the SDK, you can use [Foundry and Forge](https://book.getfoundry.sh/getting-started/installation){target=\_blank}. This pulls the necessary libraries into your project, allowing you to start building your cross-chain dApp immediately:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk@v0.1.0
```

### EVM Version Compatibility

When developing cross-chain applications, it's important to ensure that the chains you're targeting support the EVM version you're using. Some chains may not support newer opcodes introduced in recent Solidity versions. For example, the PUSH0 opcode (introduced in Solidity 0.8.20) may not be supported on all chains. If you're using a newer version of Solidity, you can specify the EVM version in your `foundry.toml` file to ensure compatibility:

```toml
evm_version = "paris"
```

This setting ensures that your smart contracts will run smoothly across all targeted chains, even if those chains do not yet support the latest EVM upgrades.

## Concepts and Components

The Wormhole Solidity SDK is built around several core components that simplify cross-chain communication. Here are the key components you’ll encounter while working with the SDK:

### WormholeRelayer

The WormholeRelayer is a core part of the SDK that handles the automatic delivery of messages between chains. With this relayer, developers don’t need to manage their own infrastructure or worry about acquiring gas tokens for the target chain. Instead, delivery providers handle the relaying process, making cross-chain communication more accessible and efficient. For more details, refer to the WormholeRelayer documentation.

## Base Contracts and Interfaces

### `Base.sol`: The Core Contract for Wormhole Messaging

`Base.sol` provides the fundamental contract for integrating with Wormhole's Relayer and `TokenBridge`. It includes helper functions and modifiers to ensure secure message passing.

 - **`onlyWormholeRelayer()`** - verifies that the caller is the Wormhole Relayer contract. This ensures that only authorized messages are processed

    ```solidity
    modifier onlyWormholeRelayer() {
        require(msg.sender == address(wormholeRelayer), "Msg.sender is not Wormhole Relayer");
        _;
    }
    ```

 - **`setRegisteredSender()`** - registers a sender from a specific chain. This is useful when you want to restrict message acceptance to a particular address from a particular chain

    ```solidity
    function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) public {
        require(msg.sender == registrationOwner, "Not allowed to set registered sender");
        registeredSenders[sourceChain] = sourceAddress;
    }
    ```

This contract should be used as the base for contracts that need to interact with the WormholeRelayer or handle cross-chain token transfers.

### `IWormholeReceiver.sol`: Interface for Receiving Wormhole Messages

The `IWormholeReceiver` interface defines the key function that your contract must implement to receive messages from other chains.

 - **`receiveWormholeMessages()`** - this is triggered by the WormholeRelayer on the target chain to deliver a message

    ```solidity
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable;
    ```

    This function must be secured by restricting it to be callable only by the WormholeRelayer. It is the entry point for all cross-chain messages.

### `IWormholeRelayer.sol`: Interface for Cross-Chain Message Delivery

The `IWormholeRelayer` interface includes methods for sending cross-chain messages and handling VAAs (Verifiable Action Approvals). This is crucial for dApps that want to send instructions or tokens across chains.

 - **sendPayloadToEvm()** - sends a payload to a specific EVM-compatible chain, along with a specified amount of gas and value

    ```solidity
    function sendPayloadToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 gasLimit
    ) external payable returns (uint64 sequence);
    ```

 - **sendVaasToEvm()** - sends both a payload and additional VAAs (such as token bridge attestations) to another chain

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

    This interface is the core of the WormholeRelayer and allows dApps to communicate with other chains without managing their own relaying infrastructure.

## Testing Environment

The SDK includes built-in support for Forge-based testing, which allows you to test your cross-chain applications locally before deploying them to production. Testing with the same Solidity compiler version and configuration that you plan to use in production is highly recommended to catch any potential issues early.

For a detailed testing example, check out the [HelloWormhole](){target=\_blank} repository.

## Usage

Getting started with the Wormhole Solidity SDK involves integrating the provided interfaces and base contracts into your smart contracts. Here’s a quick example to illustrate how to use the `WormholeRelayer` in your Solidity code.

### Example: Send a Cross-Chain Message

To send a cross-chain message, you would first inherit from the base contract provided by the SDK and use its helper methods to define your message and sender address. Here’s a basic example:

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

This contract extends the Base.sol contract and allows sending messages across chains using `WormholeRelayer`.

### Handle Token Transfers

To facilitate cross-chain token transfers, you can extend the `TokenSender` and `TokenReceiver` base contracts from the SDK. This allows you to send tokens between EVM-compatible chains seamlessly. The SDK ensures that messages and token transfers are handled correctly across different chains, even in the case of varying EVM versions.

#### Example: Send Tokens Across Chains

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

In this example, `TokenSender` is used to initiate a token transfer to a different chain. The SDK provides helper methods to ensure that tokens are transferred securely and the proper VAAs are generated.

#### Example: Receive Tokens Across Chains

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

In this example, `TokenReceiver` allows the contract to handle the tokens sent from the source chain. The `receiveWormholeMessages` function processes the incoming tokens once the cross-chain message is received.

!!! note
    Always verify the source of incoming messages and tokens to prevent unauthorized access to your contract. Please refer to the [Emitter Verification](){target=\_blank} section for more details.

## Key Considerations

Before deploying applications using the Wormhole Solidity SDK, keep in mind the following:

 - **Version compatibility** - the SDK is still evolving, and it's essential to use tagged releases for production deployments. The main branch is considered unstable and may introduce breaking changes
 - **IERC-20 remapping** - to avoid issues with multiple implementations of IERC20, the SDK provides a remapping mechanism that allows you to override the IERC20 interface, ensuring compatibility with other libraries

Testing all integrations thoroughly is critical, especially for cross-chain applications that depend on multiple components working together smoothly.

## Conclusion

The Wormhole Solidity SDK simplifies the process of building secure, cross-chain applications on EVM-compatible chains. With its suite of interfaces, base contracts, and testing utilities, developers can focus on their application logic rather than the complexities of cross-chain messaging and token transfers. By providing a standardized way to interact with the WormholeRelayer, TokenBridge, and other Wormhole services, the SDK ensures a smooth development experience.

For more advanced examples, refer to the official Wormhole SDK GitHub repository.