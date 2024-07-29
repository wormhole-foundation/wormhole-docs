---
title: Architecture
description: 
---
<!--
before PR link this page in the introduction one
need to add links
-->
# Architecture Overview

## Architecture

Wormhole is comprised of several noteworthy components. Before we go into each component in depth, let's talk about the names of the major pieces and how they fit together.

![Detailed Flow](/wormhole-mkdocs/images/learn/architecture/overview.webp)

## On-Chain Components

- **Emitter** - a contract that calls the publish message method on the Core Contract. The core contract will write an event to the Transaction Logs with details about the emitter and sequence number to identify the message. This may be your xDapp or an existing ecosystem protocol
- **Wormhole Core Contract** - primary contract, this is the contract which the Guardians observe and which fundamentally allow for cross-chain communication
- **Transaction Log** - blockchain specific logs that allow the Guardians to observe messages emitted by the core contract

## Off-Chain Components

- **Guardian Network** - validators that exist in their own P2P network. Guardians observe and validate the messages emitted by the Core Contract on each supported chain to produce VAAs (signed messages)
- **Guardian** - one of 19 validators in the Guardian Network that contributes to the VAA multisig
- **Spy** - a daemon that subscribes to messages published within the Guardian Network. A Spy can observe and forward network traffic, which helps scale up VAA distribution
- **API** - a REST server to retrieve details for a VAA or the guardian network
- **VAAs** - verifiable Action Approvals (VAAs) are the signed attestation of an observed message from the wormhole core contract.
- **Relayer** - any off chain process that relays a VAA to the target chain
    - **Standard Relayers** - a decentralized relayer network which delivers messages that are requested on-chain via the Wormhole Relay Contract. Also referred to as Generic Relayers
    - **Specialized Relayers** - relayers that only handle VAAs for a specific protocol or cross chain application. They can execute custom logic off-chain, which can reduce gas costs and increase cross-chain compatibility. Currently, cross chain application developers are responsible for developing and hosting specialized relayers

