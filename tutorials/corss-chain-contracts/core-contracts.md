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
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract HelloWorld {
    event GreetingReceived(string greeting, address sender);

    string[] public greetings;

    /**
     * @notice Returns the cost (in wei) of a greeting
     * @dev In this simple contract, the cost is always zero.
     */
    function quoteGreeting() public view returns (uint256 cost) {
        return 0;
    }

    /**
     * @notice Updates the list of 'greetings'
     * and emits a 'GreetingReceived' event with 'greeting'
     */
    function sendGreeting(
        string memory greeting
    ) public payable {
        uint256 cost = quoteGreeting();
        require(msg.value == cost);
        emit GreetingReceived(greeting, msg.sender);
        greetings.push(greeting);
    }
}
```

Key Functions:

 - `quoteGreeting()`: Returns the cost of sending a greeting, set to `0` in this simple example.
 - `sendGreeting()`: Allows users to send a greeting, emits the `GreetingReceived` event, and stores the message.

This contract serves as the foundation for more advanced cross-chain functionality, which we’ll cover next.

