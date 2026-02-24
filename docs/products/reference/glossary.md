---
title: Glossary
description: Explore a comprehensive glossary of technical terms and key concepts used in the Wormhole network, covering Chain ID, Guardian, VAA, and more.
categories: Basics
---

# Glossary

This glossary is an index of technical term definitions for words commonly used in Wormhole documentation.

## Chain ID

Wormhole assigns a unique `u16` integer chain ID to each supported blockchain. These chain IDs are specific to Wormhole and may differ from those used by blockchains to identify their networks.

You can find each chain ID documented on the [Wormhole Chain IDs](/docs/products/reference/chain-ids/){target=\_blank} page.

## Consistency Level

The level of finality (consistency) a transaction should meet before being signed by a Guardian. See the [Wormhole Finality](/docs/products/reference/consistency-levels/){target=\_blank} reference page for details.

## Delivery Provider

A Delivery Provider monitors for Executor delivery requests and delivers those requests to the intended target chain as instructed.

## Emitter

The emitter contract makes the call to the Wormhole Core Contract. The published message includes the emitter contract address, and a sequence number is tracked to provide a unique ID.

## Finality

The finality of a transaction depends on its blockchain properties. Once a transaction is considered final, you can assume the resulting state changes it caused will not be reverted.

## Guardian

A [Guardian](/docs/protocol/infrastructure/guardians/){target=\_blank} is one of the {{ guardian_count }} parties running validators in the Guardian Network contributing to the VAA multisig.

## Guardian Network

Validators operating in a dedicated P2P network that serve as Wormhole's oracle layer. Guardians monitor on-chain activity and generate signed messages (VAAs) attesting to it.

For full Guardian Set chains, all 19 Guardians perform direct on-chain observation. For delegated chains, a delegated subset monitors and broadcasts signed delegate observations to the rest of the network. Canonical Guardians wait for a delegate quorum before signing. Regardless of the observation path, VAAs are always finalized as standard 13-of-19 multisignature attestations.

## Guardian Set

The Guardian Set is the canonical set of 19 Guardians responsible for producing VAAs. A supermajority of 13 signatures is required to generate a valid VAA.

For certain chains, governance may configure a delegated subset of the Guardian Set to perform direct on-chain observation with a smaller per-chain quorum. Canonical Guardians wait for a delegate quorum before signing, ensuring that the effective security threshold for a chain cannot fall below its configured level.

The composition of the Guardian Set may change through governance actions.

## Delegated Guardian

A Guardian configured to perform direct on-chain observation for a delegated chain. Delegated Guardians broadcast `SignedDelegateObservation` messages to the Guardian gossip network.

In contrast, a Canonical Guardian does not observe that chain directly, it waits for enough `DelegateObservation` messages (the delegate quorum) before contributing its signature to the VAA.

The key distinction: on a delegated chain, Delegated Guardians run full nodes and watch the chain themselves, while Canonical Guardians trust the delegate quorum before signing. The final VAA is still a standard 13-of-19 multisig regardless.

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

[Verifiable Action Approvals](/docs/protocol/infrastructure/vaas/){target=\_blank} (VAAs) are the base data structure in the Wormhole ecosystem. They contain emitted messages along with information such as what contract emitted the message.

## Validator

A daemon configured to monitor a blockchain node and observe messages emitted by the Wormhole contracts.
