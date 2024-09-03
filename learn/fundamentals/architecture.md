---
title: Architecture
description: Overview of Wormhole's architecture, detailing key on-chain and off-chain components like the Core Contract, Guardian Network, and relayers.
---

# Architecture Overview

## Architecture

Wormhole has several noteworthy components. Before discussing each component in depth, this page will provide an overview of how the major pieces fit together.

![Wormhole architecture detailed diagram: source to target chain communication.](/images/learn/architecture/architecture-1.webp)

## On-Chain Components

- **Emitter** - a contract that calls the publish message method on the Core Contract. The Core Contract will write an event to the transaction logs with details about the emitter and sequence number to identify the message. This may be your [xDapp](/learn/glossary/#xdapp){target=\_blank} or an existing ecosystem protocol
- **[Wormhole Core Contract](/learn/infrastructure/core-contracts/){target=\_blank}** - primary contract, this is the contract which the Guardians observe and which fundamentally allows for cross-chain communication
- **Transaction logs** - blockchain-specific logs that allow the Guardians to observe messages emitted by the Core Contract

## Off-Chain Components

- **Guardian Network** - validators that exist in their own P2P network. Guardians observe and validate the messages emitted by the Core Contract on each supported chain to produce VAAs (signed messages)
- **[Guardian](/learn/infrastructure/guardians/){target=\_blank}** - one of 19 validators in the Guardian Network that contributes to the VAA multisig
- **[Spy](/learn/infrastructure/spy/){target=\_blank}** - a daemon that subscribes to messages published within the Guardian Network. A Spy can observe and forward network traffic, which helps scale up VAA distribution
- **[API](https://docs.wormholescan.io/){target=\_blank}** - a REST server to retrieve details for a VAA or the Guardian Network 
- **[VAAs](/learn/infrastructure/vaas/){target=\_blank}** - Verifiable Action Approvals (VAAs) are the signed attestation of an observed message from the Wormhole Core Contract
- **[Relayer](/learn/infrastructure/relayer/){target=\_blank}** - any off-chain process that relays a VAA to the target chain
    - **Wormhole relayers** - a decentralized relayer network that delivers messages that are requested on-chain via the Wormhole Relayer Contract
    - **Custom relayers** - relayers that only handle VAAs for a specific protocol or cross-chain application. They can execute custom logic off-chain, reducing gas costs and increasing cross-chain compatibility. Currently, cross-chain application developers are responsible for developing and hosting specialized relayers
