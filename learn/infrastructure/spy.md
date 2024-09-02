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

## Example: Building a Simple Spy

To create a basic Spy that listens for a specific type of VAA, follow these steps:

1. **Set Up Spy**: Use the existing Spy daemon to subscribe to all messages on the Guardian Network.
2. **Filter Messages**: Implement filtering logic to listen only for VAAs from specific emitters or with specific payloads.
3. **Process VAAs**: Once a relevant VAA is detected, process it by either logging the information or triggering further actions.

For example, you could build a Spy that listens for token transfer VAAs and triggers a notification or an automated process when a transfer exceeds a certain value.

## Enhancements for Developer Experience

- **Detailed examples**: Provide more code examples of different Spy implementations, such as filtering based on specific VAA fields or integrating with external services like Slack for alerts.
- **Monitoring and logging best practices**: Include tips on how to efficiently log and monitor Spy activity, especially when dealing with a high volume of messages.
- **Security considerations**: Add a section on securing your Spy setup, such as using access controls and monitoring to ensure the integrity of the messages being processed.
