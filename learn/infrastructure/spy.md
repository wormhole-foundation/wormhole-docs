---
title: Spy
description: Discover Wormhole's Spy daemon, which subscribes to gossiped messages in the Guardian Network, including VAAs and Observations, with setup instructions.
---

# Spy

In Wormhole’s ecosystem, the _Spy_ is a daemon, a continuously running background process that monitors messages within the Guardian Network. Unlike Guardians, Spies don’t perform validation; instead, they serve as an interface for observing the network’s message traffic, enabling applications and users to access live data transmitted over Wormhole.

The primary purpose of a Spy is to subscribe to the gossiped messages across the Guardian Network, tracking key message types that allow integrators and applications to monitor real-time network activity without directly engaging in consensus operations.

This page provides a comprehensive guide to Spies within the Wormhole network describing their key features and role in facilitating multichain processes.

## Key Features

### Message Categories

Spies can access the following categories of messages shared over the gossip protocol:

- [Verifiable Action Approvals (VAAs)](/docs/learn/infrastructure/vaas/){target=\_blank} - packets of multichain data

    - The Spy can detect whether a VAA has been approved by the Guardian Network, making it a valuable tool for applications needing real-time multichain verification

- [Observations](/docs/learn/glossary/#observation){target=\_blank} - emitted by Wormhole’s core contracts, observations are picked up by the Guardians and relayed across the network

    - Spies allow users to monitor these messages, adding transparency and insight into blockchain events

- [Guardian heartbeats](/docs/learn/glossary/#heartbeat){target=\_blank} - heartbeat messages represent Guardian node status 

    - By monitoring heartbeats, a Spy can signal the liveness and connectivity of Guardians in the network

### Integrator Use Case

The Spy provides a valuable mechanism for integrators to observe real-time network activity in the Guardian Network without directly engaging in validation or consensus. By running a Spy, integrators can track multichain events, and message flows — such as VAAs, observations, and Guardian heartbeats — to monitor network activity essential to their applications.

This monitoring capability is especially beneficial for applications that need immediate insights into multichain data events. Integrators can run a Spy to ensure their applications are promptly informed of message approvals, observations, or Guardian liveness signals, supporting timely and responsive app behavior without additional overhead on network resources.

## Additional Resources

<div class="grid cards" markdown>

-   :octicons-code-16:{ .lg .middle } **Spy Source Code**

    ---

    To see the source code for the Go implementation of the Spy, visit the `womrhole` repository on GitHub.

    [:custom-arrow: View the Source Code](https://github.com/wormhole-foundation/wormhole/blob/main/node/cmd/spy/spy.go){target=\_blank}

-   :octicons-code-16:{ .lg .middle } **Alternative Implementation**

    ---

    To learn more about Beacon, an alternative highly available, reduced latency version of the Wormhole Spy, visit the `beacon` repository on Github.

    [:custom-arrow: Get Started with Pyth Beacon](https://github.com/pyth-network/beacon)

-   :octicons-code-16:{ .lg .middle } **Discover Wormhole Queries**

    ---

    For an alternative option to on-demand access to Guardian-attested multichain data, see the Wormhole Queries page. Queries provide a simple, REST endpoint style developer experience. 

    [:custom-arrow: Explore Queries](/docs/build/queries/overview/)

</div>

## Next Steps

<div class="grid cards" markdown>

-   :octicons-code-16:{ .lg .middle } **Run a Spy**

    ---

    Learn how to run the needed infrastructure to spin up a Spy daemon locally and subscribe to a stream of Verifiable Action Approvals (VAAs).

    [:custom-arrow: Spin Up a Spy](/docs/infrastructure/spy/run-spy/){target=\_blank}

-   :octicons-code-16:{ .lg .middle } **Use Queries**

    ---

    For access to real-time network data without infrastructure overhead, follow this guide and use Wormhole Query to construct a query, make a request, and verify the response.

    [:custom-arrow: Get Started with Queries](/docs/build/queries/use-queries/)

</div>
