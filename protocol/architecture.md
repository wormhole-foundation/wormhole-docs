---
title: Architecture
description: Overview of Wormhole's architecture, detailing key on-chain and off-chain components like the Core Contract, Guardian Network, and relayers.
categories: Basics
---

# Architecture

## Overview

Wormhole has several noteworthy components. Before discussing each component in depth, this page will provide an overview of how the major pieces fit together.

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

The preceding diagram outlines the end-to-end flow of multichain communication through Wormhole's architecture, which is described as follows:

1. **Source chain** - a source contract emits a message by interacting with the [Wormhole Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank} on the source chain, which publishes the message in the blockchain's transaction logs
2. **Guardian Network** - [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} validate these messages and sign them to produce [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank}
3. **Relayers** - off-chain relayers or applications fetch the VAA and relay it to the target chain
4. **Target chain** - on the target chain, the message is consumed by the appropriate contract. This contract interacts with the Wormhole Core Contract to verify the VAA and execute the intended multichain operation. 

    The flow from the relayer to the target chain involves an entry point contract, which could vary based on the use case:

    - In some applications, the target contract acts as the entry point and performs verification via the Core Contract
    - In products like the Token Bridge, the Token Bridge contract itself interacts with the Core Contract

## On-Chain Components

- **Emitter** - a contract that calls the publish message method on the Core Contract. To identify the message, the Core Contract will write an event to the transaction logs with details about the emitter and sequence number. This may be your cross-chain dApp or an existing ecosystem protocol
- **[Wormhole Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank}** - primary contract, this is the contract which the Guardians observe and which fundamentally allows for multichain communication
- **Transaction logs** - blockchain-specific logs that allow the Guardians to observe messages emitted by the Core Contract

## Off-Chain Components

- **Guardian Network** - validators that exist in their own P2P network. Guardians observe and validate the messages emitted by the Core Contract on each supported chain to produce VAAs (signed messages)
- **[Guardian](/docs/protocol/infrastructure/guardians/){target=\_blank}** - one of 19 validators in the Guardian Network that contributes to the VAA multisig
- **[Spy](/docs/protocol/infrastructure/spy/){target=\_blank}** - a daemon that subscribes to messages published within the Guardian Network. A Spy can observe and forward network traffic, which helps scale up VAA distribution
- **[API](https://docs.wormholescan.io/){target=\_blank}** - a REST server to retrieve details for a VAA or the Guardian Network
- **[VAAs](/docs/protocol/infrastructure/vaas/){target=\_blank}** - Verifiable Action Approvals (VAAs) are the signed attestation of an observed message from the Wormhole Core Contract
- **[Relayer](/docs/protocol/infrastructure/relayer/){target=\_blank}** - any off-chain process that relays a VAA to the target chain
    - **Wormhole relayers** - a decentralized relayer network that delivers messages that are requested on-chain via the Wormhole relayer contract
    - **Custom relayers** - relayers that only handle VAAs for a specific protocol or multichain application. They can execute custom logic off-chain, reducing gas costs and increasing multichain compatibility. Currently, multichain application developers are responsible for developing and hosting custom relayers

## Next Steps

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Core Contracts**

    ---

    Discover Wormhole's Core Contracts, enabling multichain communication with message sending, receiving, and multicast features for efficient synchronization.

    [:custom-arrow: Explore Core Contracts](/docs/protocol/infrastructure/core-contracts/)

-   :octicons-tools-16:{ .lg .middle } **Core Messaging**

    ---

    Follow the guides in this section to work directly with the building blocks of Wormhole messaging, Wormhole-deployed relayers and Core Contracts, to send, receive, validate, and track multichain messages.

    [:custom-arrow: Build with Core Messaging](/docs/products/messaging/guides/wormhole-relayers/)

</div>
