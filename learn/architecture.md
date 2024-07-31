---
title: Architecture
description: Overview of Wormhole's architecture, detailing key on-chain and off-chain components like the Core Contract, Guardian Network, and relayers.
---
<!--
need to link this page in the introduction page once its merged
need to add links
-->
# Architecture Overview

## Architecture

Wormhole has several noteworthy components. Before we discuss each component in depth, let's discuss the names of the major pieces and how they fit together.

![Wormhole architecture detailed diagram: source to target chain communication.](/images/learn/architecture/overview.webp)

## On-Chain Components

- **Emitter** - a contract that calls the publish message method on the Core Contract. The Core Contract will write an event to the transaction logs with details about the emitter and sequence number to identify the message. This may be your [xDapp](#){target=\_blank} or an existing ecosystem protocol <!-- link to glossary xDapp -->
- **[Wormhole Core Contract](#){target=\_blank}** - primary contract, this is the contract which the Guardians observe and which fundamentally allows for cross-chain communication <!-- link to core contracts page -->
- **Transaction Log** - blockchain-specific logs that allow the Guardians to observe messages emitted by the core contract

## Off-Chain Components

- **Guardian Network** - validators that exist in their own P2P network. Guardians observe and validate the messages emitted by the Core Contract on each supported chain to produce VAAs (signed messages)
- **[Guardian](#){target=\_blank}** - one of 19 validators in the Guardian Network that contributes to the VAA multisig
- **[Spy](#){target=\_blank}** - a daemon that subscribes to messages published within the Guardian Network. A Spy can observe and forward network traffic, which helps scale up VAA distribution
- **[API](#){target=\_blank}** - a REST server to retrieve details for a VAA or the Guardian Network
- **[VAAs](/learn/infrastructure/vaas/){target=\_blank}** - Verifiable Action Approvals (VAAs) are the signed attestation of an observed message from the Wormhole Core Contract
- **[Relayer](#){target=\_blank}** - any off-chain process that relays a VAA to the target chain
    - **Standard Relayers** - a decentralized relayer network that delivers messages that are requested on-chain via the Wormhole Relay Contract. Also referred to as Generic Relayers
    - **Specialized Relayers** - relayers that only handle VAAs for a specific protocol or cross-chain application. They can execute custom logic off-chain, reducing gas costs and increasing cross-chain compatibility. Currently, cross-chain application developers are responsible for developing and hosting specialized relayers

