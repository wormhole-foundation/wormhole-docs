---
title: Core Contracts
description: Discover Wormhole's Core Contracts, enabling cross-chain communication with message sending, receiving, and multicast features for efficient synchronization.
---

# Core Contracts

## Introduction

The Wormhole Core Contract is a fundamental component of the Wormhole interoperability protocol deployed across each supported blockchain network. This contract acts as the foundational layer that enables secure and efficient cross-chain messaging, as all cross-chain applications either interact directly with the Core Contract or with another contract that does.

This guide summarizes the key functions of the Core Contract and outlines how the Core Contract works.

## Key Functions of the Wormhole Core Contract

- **Cross-chain messaging** - the Core Contract enables the transfer of messages between different blockchain networks connected via Wormhole. It standardizes and secures the message format, ensuring consistent communication across multiple chains. This capability allows developers to build cross-chain applications that leverage the unique features of each network

- **Verification and validation** - the Core Contract is responsible for verifying and validating all VAAs received on the target chain. When a message is transmitted from one blockchain, it is signed by the Wormhole Guardians (a decentralized set of validators). The Core Contract on the target chain checks this signature to confirm that the message is legitimate and has not been tampered with

- **Guardian Network coordination** - the Core Contract coordinates with Wormhole's Guardian Network to facilitate secure, trustless communication across chains. By relying on a quorum of Guardians to verify cross-chain messages and transactions, the contract ensures that only validated interactions are processed, enhancing the protocol's overall security and reliability

- **Event emission for monitoring** - the Core Contract emits events for every cross-chain message it processes, allowing dApps and developers to monitor activity on the network. These events are critical for tracking message statuses, debugging, and building responsive applications that can react to cross-chain events in real time

## How the Core Contract Works

The Wormhole Core Contract is central in facilitating secure and efficient cross-chain transactions. It enables communication between different blockchain networks by packaging transaction data into standardized messages, verifying their authenticity, and ensuring they are executed correctly on the destination chain. This process involves several steps, from the initial message submission to final execution, all while leveraging the Wormhole Guardian network to maintain trust and security.

Below is a simplified breakdown that focuses on the role of the Wormhole Core Contract in these operations:

1. **Message submission** - when a user initiates a cross-chain transaction, the Wormhole Core Contract on the source chain packages the transaction data into a standardized message payload and submits it to the Guardian Network for verification
2. **Guardian verification** - the Guardians observe and sign the message independently. Once enough Guardians have signed the message, the collection of signatures is combined with the message and metadata to produce a VAA
3. **Message reception and execution** - on the target chain, the Wormhole Core Contract receives the verified message, checks the Guardians' signatures, and executes the corresponding actions, such as minting tokens, updating states, or calling specific smart contract functions

For a closer look at how messages flow between chains and all of the components involved, you can refer to the [Architecture Overview](/docs/learn/infrastructure/architecture/) page.

### Message Submission

When sending a cross-chain message from the source chain Core Contract, you'll call a function that publishes the message. The implementation strategy for publishing messages differs by chain. However, the general strategy consists of the Core Contract posting the following items to the blockchain logs:

- `emitterAddress` - the contract which made the call to publish the message
- `sequenceNumber` - a unique number that increments for every message for a given emitter (and implicitly chain)
- `consistencyLevel`- the level of finality to reach before the Guardians will observe and attest the emitted event. This is a defense against reorgs and rollbacks since a transaction, once considered "final,"  is guaranteed not to have the state changes it caused rolled back. Since different chains use different consensus mechanisms, each one has different finality assumptions, so this value is treated differently on a chain-by-chain basis. See the options for finality for each chain in the [Consistency Levels](/docs/build/reference/consistency-levels/){target=\_blank} reference page

There are no fees to publish a message except when publishing on Solana, but this is subject to change in the future.

### Message Reception

When receiving a cross-chain message on the target chain Core Contract, the general approach involves parsing and verifying the [components of a VAA](/docs/learn/infrastructure/vaas#vaa-format).

The process of receiving and verifying a VAA ensures that the message was properly attested by the Guardian Network, maintaining the integrity and authenticity of the data transmitted between chains.

## Multicast

Multicast refers to simultaneously broadcasting a single message or transaction across different blockchains. This means there is no destination address or chain for the sending and receiving functions. This is possible because VAAs attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain where they are used.

This multicast-by-default model makes it easy to synchronize the state across the entire ecosystem because a single blockchain can make its data available to every chain in a single action with low latency. This reduces the complexity of the n^2 problems encountered by routing data to a large number of blockchains.

This doesn't mean an application _cannot_ specify a destination address or chain. For example, the Token Bridge and Wormhole relayer contracts require that some destination details be passed and verified on the destination chain.

Because the VAA creation is separate from relaying, the multicast model does not incur an additional cost when a single chain is targeted. If the data isn't needed on a certain blockchain, don't relay it there, and it won't cost anything.
