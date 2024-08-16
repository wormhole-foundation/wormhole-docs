---
title: How to Use Core Contracts
description: Detailed explanaiton on how to use the core contracts in the Wormhole practice repository.
---

<!--
comments go here
-->

# Understanding the Cross-Chain Contract

## Introduction

Let’s dive into the `HelloWormhole` contract and break down how it works _step-by-step_. We’ll start by creating a basic single-chain Solidity contract called `HelloWorld`, and then explore how to extend it cross-chain using Wormhole.

### Single-Chain HelloWorld Solidity Contract

Our initial `HelloWorld` smart contract focuses on a simple functionality: allowing users to send greetings. When someone sends a greeting, the contract emits an event called `GreetingReceived`, recording their message. The greetings are also stored in a list for later retrieval.

Here’s the Solidity code for the `HelloWorld` contract:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-1.sol'
```

Key Functions:

 - `quoteGreeting()`: Returns the cost of sending a greeting, set to `0` in this simple example.
 - `sendGreeting()`: Allows users to send a greeting, emits the `GreetingReceived` event, and stores the message.

This contract serves as the foundation for more advanced cross-chain functionality, which we’ll cover next.

### Taking HelloWorld cross-chain using Wormhole Automatic Relayers

Now, let's extend our simple HelloWorld contract to support cross-chain functionality using Wormhole Automatic Relayers. Our goal is to allow users to send a greeting from one chain, like Ethereum, to another, like Avalanche, and vice versa—all triggered from their Ethereum wallet.

To achieve this, we’ll write a contract that can be deployed on Ethereum, Avalanche, or any other supported chain, enabling seamless communication between instances of the contract regardless of which chain they’re on.

To accomplish this, we’ll implement the following function:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-2.sol'
```

To send greetings across chains, we can use the Wormhole Relayer, which handles cross-chain communication for us. The relayer network allows us to relay messages (or "payloads") from one chain to another through a network of Delivery Providers.

If you’d like a more detailed understanding of how the Wormhole Relayer and Delivery Providers work, check out the [Learning section on Relayers]().

Now, let’s dive into the Wormhole Relayer interface that enables this functionality:

```solidity
--8<-- 'code/tutorials/cross-chain-contracts/core-contracts/snippet-3.sol'
```

To perform this cross-chain delivery, **Delivery Providers** charge a fee based on the target network’s conditions. You can calculate this fee using:

```
(deliveryPrice,) = quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)
```

This fee must be included as `msg.value` when calling `sendPayloadToEvm`.