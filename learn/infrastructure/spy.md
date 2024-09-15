---
title: Spy
description: Discover Wormhole's Spy daemon, which subscribes to gossiped messages in the Guardian Network, including VAAs and Observations, with setup instructions.
---

# Spy

## Introduction

In the Wormhole context, a _Spy_ is a daemon that subscribes to the gossiped messages in the Guardian Network.

They don’t do any validation work. Instead, they watch the Guardian Network and act as an interface to allow users and applications to check on the Spy-accessible messages.

## Spy-Accessible Messages

The messages available over gossip are things like:

- [Verifiable Action Approvals (VAAs)](/learn/infrastructure/vaas/){target=\_blank} - packets of cross-chain data. A Spy can see whether a VAA has been approved by the Guardian Network
- [Observations](/learn/glossary/#observation){target=\_blank} - messages emitted by Core Contracts that the Guardians have picked up
- [Guardian heartbeats](/learn/glossary/#heartbeat){target=\_blank} - the liveness of a Guardian

## Source Code

The source code for the Spy is available on [GitHub](https://github.com/wormhole-foundation/wormhole/blob/main/node/cmd/spy/spy.go){target=\_blank}.
