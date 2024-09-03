---
title: Glossary
description: Explore a comprehensive glossary of technical terms and key concepts used in the Wormhole network, covering Chain ID, Guardian, VAA, and more.
---

# Glossary

This glossary is an index of technical term definitions for words commonly used in Wormhole documentation.

## Chain ID

Wormhole assigns a unique `u16` integer chain ID to each supported blockchain. These chain IDs are specific to Wormhole and may differ from those used by blockchains to identify their networks.

You can find each chain ID documented on the [Wormhole Chain IDs](/build/reference/chain-ids/){target=\_blank} page.

## Consistency Level

The level of finality (consistency) a transaction should meet before being signed by a Guardian. See the [Consistency Levels](/build/reference/consistency-levels/){target=\_blank} reference page for details.

## Delivery Provider

A Delivery Provider monitors for Wormhole Relayer delivery requests and delivers those requests to the intended target chain as instructed.

## Emitter

The emitter contract makes the call to the Wormhole Core Contract. The published message includes the emitter contract address and, a sequence number for the message is tracked to provide a unique ID.

## Finality

The finality of a transaction depends on its blockchain properties. Once a transaction is considered final, you can assume the resulting state changes it caused won't be reverted.

## Gateway

The [Gateway](/learn/messaging/gateway/){target=\_blank}, previously referred to as Wormchain, is the Cosmos-SDK chain Wormhole uses to facilitate communication with the Cosmos ecosystem.

## Guardian

A [Guardian](/learn/infrastructure/guardians/){target=\_blank} is one of the 19 parties running validators in the Guardian Network contributing to the VAA multisig.

## Guardian Network

Validators in their own P2P network who serve as Wormhole's oracle by observing activity on-chain and generating signed messages attesting to that activity.

## Guardian Set

The Guardian Set is a set of guardians responsible for validating a message emitted from the core contracts. Occasionally, the members of the set will change through a governance action.

## Heartbeat

Each Guardian will issue a `heartbeat` on a 15-second interval to signal that it is still running and convey details about its identity, uptime, version, and the status of the connected nodes.

You can view the heartbeats on the [Wormhole dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}.

## Observation

An Observation is a data structure describing a message emitted by the Core Contract and noticed by the Guardian node.

## Relayer

A relayer is any process that delivers VAAs to a destination.

## Sequence

A nonce, strictly increasing, which is tracked by the Wormhole Core Contract and unique to the emitter chain and address.

## Spy

A Spy is a daemon that eavesdrops on the messages passed between Guardians, typically to track VAAs as they get signed.

## VAA

[Verifiable Action Approvals](/learn/infrastructure/vaas/){target=\_blank} (VAAs) are the base data structure in the Wormhole ecosystem. They contain the messages emitted by [xDapps](#xdapp) along with information such as what contract emitted the message.

## Validator

A daemon configured to monitor a blockchain node and observe messages emitted by the Wormhole contracts.

## xChain

A term that refers to the full range of cross-blockchain interoperability.

## xAssets

A chain-and-path agnostic token on a layer outside the blockchain ecosystem that can conduct transactions on any blockchain.

## xDapp

A decentralized application that enables users to create and/or use [xData](#xdata).

## xData

Data that exists in a layer outside of Layer 1 blockchains, which is accessible by all chains.
