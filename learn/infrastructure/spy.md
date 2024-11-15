---
title: Spy
description: Discover Wormhole's Spy daemon, which subscribes to gossiped messages in the Guardian Network, including VAAs and Observations, with setup instructions.
---

# Spy

## Introduction

In Wormhole’s ecosystem, the _Spy_ is a daemon, a continuously running background process that monitors messages within the Guardian Network. Unlike Guardians, Spies don’t perform validation; instead, they serve as an interface for observing the network’s message traffic, enabling applications and users to access live data transmitted over Wormhole.

The primary purpose of a Spy is to subscribe to the gossiped messages across the Guardian Network, tracking key message types that allow integrators and applications to monitor real-time network activity without directly engaging in consensus operations.

## Key Features of the Spy

### Monitor Spy-Accessible Messages

Spies can access the following categories of messages shared over the gossip protocol::

- [Verifiable Action Approvals (VAAs)](/docs/learn/infrastructure/vaas/){target=\_blank} - packets of cross-chain data. The Spy can detect whether a VAA has been approved by the Guardian Network, making it a valuable tool for applications needing real-time cross-chain verification
- [Observations](/docs/learn/fundamentals/glossary/#observation){target=\_blank} - emitted by Wormhole’s core contracts, observations are picked up by the Guardians and relayed across the network. Spies allow users to monitor these messages, adding transparency and insight into blockchain events
- [Guardian heartbeats](/docs/learn/fundamentals/glossary/#heartbeat){target=\_blank} - heartbeat messages represent Guardian node statusn. By monitoring heartbeats, a Spy can signal the liveness and connectivity of Guardians in the network

### Integrator Use Case

The Spy provides a valuable mechanism for integrators to observe real-time network activity in the Guardian Network without directly engaging in validation or consensus. By running a Spy, integrators can track cross-chain events, and message flows — such as VAAs, observations, and Guardian heartbeats — to monitor network activity essential to their applications.

This monitoring capability is especially beneficial for applications that need immediate insights into cross-chain data events. Integrators can run a Spy to ensure their applications are promptly informed of message approvals, observations, or Guardian liveness signals, supporting timely and responsive app behavior without additional overhead on network resources.

## Source Code

The source code for the Go implementation of the Spy is available on [GitHub](https://github.com/wormhole-foundation/wormhole/blob/main/node/cmd/spy/spy.go){target=\_blank}.

Check out the infrastructure section to find out how to [start and run a Spy](/docs/infrastructure/spy/run-spy/){target=\_blank}.

This setup enables integrators to create a custom endpoint that applications can use to observe message flows in the Guardian Network, providing greater flexibility and control over cross-chain monitoring.