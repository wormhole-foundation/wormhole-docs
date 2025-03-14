---
title: Core Contracts
description: Discover Wormhole's Core Contracts, which enable multichain communication with message sending, receiving, and multicast features for efficient synchronization.
---

# Core Contracts

## Introduction

The Wormhole Core Contract is deployed across each supported blockchain network. This contract is a fundamental component of the Wormhole interoperability protocol and acts as the foundational layer enabling secure and efficient multichain messaging. All multichain applications either interact directly with the Core Contract or with another contract that does.

This page summarizes the key functions of the Core Contract and outlines how the Core Contract works.

## Key Functions 

Key functions of the Wormhole Core Contract include the following:

::spantable::

| Function                            | Description                                                                                                                                                                                                                      |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Multichain messaging @span          | Standardizes and secures the format of messages to facilitate consistent communication for message transfer between Wormhole-connected blockchain networks, allowing developers to leverage the unique features of each network. |
| Verification and validation @span   | Verifies and validates all VAAs received on the target chain by confirming the Guardian signature to ensure the message is legitimate and has not been manipulated or altered.                                                   |
| Guardian Network coordination @span | Coordinates with Wormhole's Guardian Network to facilitate secure, trustless communication across chains and ensure that only validated interactions are processed to enhance the protocol's overall security and reliability.   |
| Event emission for monitoring @span | Emits events for every multichain message processed, allowing for network activity monitoring like tracking message statuses, debugging, and applications that can react to multichain events in real time.                      |

::end-spantable::

## How the Core Contract Works

The Wormhole Core Contract is central in facilitating secure and efficient multichain transactions. It enables communication between different blockchain networks by packaging transaction data into standardized messages, verifying their authenticity, and ensuring they are executed correctly on the destination chain.

The following describes the role of the Wormhole Core Contract in message transfers:

1. **Message submission** - when a user initiates a multichain transaction, the Wormhole Core Contract on the source chain packages the transaction data into a standardized message payload and submits it to the Guardian Network for verification
2. **Guardian verification** - the Guardians independently observe and sign the message. Once enough Guardians have signed the message, the collection of signatures is combined with the message and metadata to produce a VAA
3. **Message reception and execution** - on the target chain, the Wormhole Core Contract receives the verified message, checks the Guardians' signatures, and executes the corresponding actions like minting tokens, updating states, or calling specific smart contract functions

See the [Architecture Overview](/docs/learn/infrastructure/architecture/) page for a closer look at how messages flow between chains and the components involved.

### Message Submission

You can send multichain messages by calling a function against the source chain Core Contract, which then publishes the message. Message publishing strategies can differ by chain, however; generally, the Core Contract posts the following items to the blockchain logs:

- `emitterAddress` - the contract which made the call to publish the message
- `sequenceNumber` - a unique number that increments for every message for a given emitter (and implicitly chain)
- `consistencyLevel`- the required level of finality to reach before the Guardians observe and attest the emitted event. See the options for finality for each chain in the [Consistency Levels](/docs/build/reference/consistency-levels/){target=\_blank} reference page

There are no fees to publish a message except when publishing on Solana, but this is subject to change in the future.

### Message Reception

When you receive a multichain message on the target chain Core Contract, you generally must parse and verify the [components of a VAA](/docs/learn/infrastructure/vaas#vaa-format). Receiving and verifying a VAA ensures that the Guardian Network properly attests to the message and maintains the integrity and authenticity of the data transmitted between chains.

## Multicast

Multicast refers to simultaneously broadcasting a single message or transaction across different blockchains with no destination address or chain for the sending and receiving functions. VAAs attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain where they are used.

This multicast-by-default model makes it easy to synchronize state across the entire ecosystem. A blockchain can make its data available to every chain in a single action with low latency, which reduces the complexity of the n^2 problems encountered by routing data to many blockchains.

This doesn't mean an application _cannot_ specify a destination address or chain. For example, the [Token Bridge](/docs/learn/transfers/token-bridge/) and [Wormhole relayer](/docs/learn/infrastructure/relayer/) contracts require that some destination details be passed and verified on the destination chain.

Because the VAA creation is separate from relaying, the multicast model does not incur an additional cost when a single chain is targeted. If the data isn't needed on a certain blockchain, don't relay it there, and it won't cost anything.

## Next Steps

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Verified Action Approvals(VAA)**

    ---

    Learn about Verified Action Approvals (VAAs) in Wormhole, their structure, validation, and their role in multichain communication.

    [:custom-arrow: Learn About VAAs](/docs/learn/infrastructure/vaas/)

- :octicons-tools-16:{ .lg .middle } **Get Started with Core Contracts**

    ---

    This guide walks through the key methods of the Core Contracts, providing you with the knowledge needed to integrate them into your multichain contracts.

    [:custom-arrow: Build with Core Contracts](/docs/build/core-messaging/core-contracts/)

</div>
