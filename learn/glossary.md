---
title: Glossary
description: Explore a comprehensive glossary of technical terms and key concepts used in the Wormhole network.
---

# Glossary

An index of commonly used technical terms.

## Chain ID
The chain IDs in the Wormhole context are `u16` integers that map to chains. Note that these chain IDs are different from other chain IDs used for things like wallets.

Each chain ID is documented on the [Wormhole Chain IDs](#){target=\_blank} page. 
<!-- link to blockchain platforms page-->

## Consistency Level

The level of finality (consistency) a transaction should meet before being signed by a Guardian. See the [Consistency](#){target=\_blank} section of the constants page for details. <!-- Consistency Levels page -->

## Delivery Provider

A Delivery Provider monitors for Wormhole Relayer delivery requests and delivers to the intended target chain as instructed.

## Emitter

The contract that calls the Wormhole Core contract. Its address is included in the message published, and a sequence number for the message is tracked to provide a unique ID.

## Finality

The finality of a transaction depends on its blockchain properties. Once a transaction is considered final, it can be assumed that the state changes it caused won't be rolled back.

## Gateway

The [Gateway](/learn/messaging/gateway/){target=\_blank} is the Cosmos-SDK chain used by Wormhole to facilitate communication with the Cosmos ecosystem.

## Guardian
A [Guardian](/learn/infrastructure/guardians/){target=\_blank} is one of the 19 parties running validators in the Guardian Network that contributes to the VAA multisig.

## Guardian Network
Validators in their own P2P network that serve as Wormhole's oracle by observing activity on-chain and generating signed messages attesting to that activity.

## Guardian Set
The Guardian Set is a set of guardians responsible for validating a message emitted from the core contracts. Occasionally, the members of the set will change through a governance action.

## Heartbeat
Each Guardian will issue a `heartbeat` on a 15s interval to signal that it is still running and to convey details about its identity, uptime, version, and status of the connected nodes.

The heartbeats are shown on the [dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}.

## Observation
An Observation is a data structure that describes a message that the Core Contract emitted and that the Guardian node noticed.

## Relayer
A Relayer is any process that delivers VAAs to a destination.

## Sequence
A nonce, strictly increasing, tracked by the wormhole core contract and unique to the emitter chain and address.

## Spy
A Spy is a daemon that eavesdrops on the messages passed between Guardians, typically to track VAAs as they get signed.

## VAA
[Verifiable Action Approvals](/learn/infrastructure/vaas/){target=\_blank} (VAAs) are the base data structure in the Wormhole ecosystem, containing the messages emitted by xDapps along with information such as what contract emitted the message.

## Validator
A daemon that is configured to monitor a blockchain node and observe messages emitted by the wormhole contracts.

## Wormchain
The original name of the [Gateway](/learn/glossary/#gateway){target=\_blank}.

## xChain
A term that refers to the full range of cross-blockchain interoperability.

## xAssets
A chain-and-path agnostic token that exists on a layer outside the blockchain ecosystem, it can be used to conduct transactions on any blockchain.

## xDapp
A decentralized application that enables users to create and/or use xData.

## xData
Data that exists in a layer outside of Layer 1 blockchains, which is accessible by all chains.


