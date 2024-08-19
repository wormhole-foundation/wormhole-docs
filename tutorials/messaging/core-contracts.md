---
title: How to Use Core Contracts
description: Detailed explanaiton on how to use the core contracts in the Wormhole practice repository.
---

# Create Cross-Chain Contracts

## Introduction

Let’s dive into the `HelloWormhole` contract and break down how it works _step-by-step_. We’ll start by creating a basic single-chain Solidity contract called `HelloWorld`, and then explore how to extend it cross-chain using Wormhole.

## Single-Chain HelloWorld Solidity Contract

Our initial `HelloWorld` smart contract focuses on a simple functionality: allowing users to send greetings. When someone sends a greeting, the contract emits an event called `GreetingReceived`, recording their message. The greetings are also stored in a list for later retrieval.

Here’s the Solidity code for the `HelloWorld` contract:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-1.sol'
```

####Key Functions:

 - `quoteGreeting()`: Returns the cost of sending a greeting, set to `0` in this simple example
 - `sendGreeting()`: Allows users to send a greeting, emits the `GreetingReceived` event, and stores the message in the `greetings` list

This contract serves as the foundation for more advanced cross-chain functionality, which we’ll cover next.

## Taking HelloWorld cross-chain using Wormhole Automatic Relayers

Now, let's extend our simple HelloWorld contract to support cross-chain functionality using Wormhole Automatic Relayers. Our goal is to allow users to send a greeting from one chain, like Ethereum, to another, like Avalanche, and vice versa—all triggered from their Ethereum wallet.

To achieve this, we’ll write a contract that can be deployed on Ethereum, Avalanche, or any other supported chain, enabling seamless communication between instances of the contract regardless of which chain they’re on.

To accomplish this, we’ll implement the following function:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-2.sol'
```

To send greetings across chains, we can use the Wormhole Relayer, which handles cross-chain communication for us. The relayer network allows us to relay messages (or "payloads") from one chain to another through a network of Delivery Providers.

If you’d like a more detailed understanding of how the Wormhole Relayer and Delivery Providers work, check out the [Learning section on Relayers](/learn/infrastructure/relayer/){target=\_blank}.

Now, let’s dive into the Wormhole Relayer interface that enables this functionality:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-3.sol'
```

To perform this cross-chain delivery, **Delivery Providers** charge a fee based on the target network’s conditions. You can calculate this fee using:

```
(deliveryPrice,) = quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)
```

This fee must be included as `msg.value` when calling `sendPayloadToEvm`.

So, using the `sendPayloadToEvm` interface, we can implement `sendCrossChainGreeting` by sending a payload that contains the greeting message and the sender’s address. The relayer handles the cross-chain delivery, ensuring the message is received on the target chain.

Here’s the code:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-4.sol'
```

For this cross-chain interaction to work, the contract at the targetAddress on the targetChain must implement the `IWormholeReceiver` interface. This interface ensures that the contract can correctly receive and process the incoming message from the relayer.

## Implementing the IWormholeReceiver Interface

To enable both sending and receiving messages within the `HelloWormhole` contract, we need to implement the `IWormholeReceiver` interface. This interface defines the function that will be called by the Wormhole Relayer on the target chain when a cross-chain message is received.

Here is the interface:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-5.sol'
```

Once `sendPayloadToEvm` is called on the source chain, the off-chain Delivery Provider picks up the VAA corresponding to the message and relays it to the target chain. The provider will then invoke the `receiveWormholeMessages` function on the contract specified by `targetAddress` on the `targetChain`.

In the `receiveWormholeMessages` function, we want to:
 - Update the latest greeting
 - Emit a `GreetingReceived` event with the greeting message and the sender

### Key Security Considerations:
 - **Restricting Access**: It is crucial to ensure that only the Wormhole Relayer contract can call `receiveWormholeMessages` to prevent unauthorized access
 - **Verification of Source**: It’s important to verify that the message is from the expected `sourceChain` and `sourceAddress` to avoid malicious calls

 And voilà, we now have a fully functional contract that can be deployed across multiple EVM chains, forming a complete cross-chain application powered by Wormhole! Users can interact with the contract from any supported chain and send greetings that will be emitted on other chains within the system.

This setup allows users with any wallet to request greetings to be emitted on any participating chain, creating a seamless cross-chain experience.

## How does it work?

Curious about the underlying mechanisms? In [Part 2](/tutorials/messaging/use-contracts/){target=\_blank}, we’ll dive deeper into how the Wormhole Relayer facilitates cross-chain communication, allowing contracts on different blockchains to be called with the correct inputs.

## Full Cross-Chain HelloWormhole Solidity Contract

For the complete implementation of the [HelloWormhole.sol contract](https://github.com/wormhole-foundation/hello-wormhole/blob/main/src/HelloWormhole.sol){target=\_blank}, along with testing infrastructure, check out the full [GitHub repository](https://github.com/wormhole-foundation/hello-wormhole/){target=\_blank}.

!!! note
    ####Wormhole integration complete?
    Let us know so we can list your project in our ecosystem directory and introduce you to our global, multichain community!

    [Reach out now!](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}