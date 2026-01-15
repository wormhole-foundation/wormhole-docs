---
title: Relayers Overview
description: Discover the role of relayers in the Wormhole network, including client-side and automated relaying via the Executor framework, for secure cross-chain communication.
categories: Basics, Relayers, Executor
---

# Overview

!!!warning 
    The Wormhole Standard Relayer is being deprecated. Developers are strongly encouraged to [migrate to the Executor framework](/docs/protocol/infrastructure/relayers/executor-vs-sr/){target=\_blank}.

This page introduces relayers in the Wormhole network and explains their role, available approaches, and the trade-offs involved in delivering cross-chain messages.

Relayers are the entities responsible for submitting signed [Verified Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} to destination chains, providing message delivery and automation. At the same time, Guardian signatures and on-chain verification ensure that relayers cannot tamper with message contents and only influence when a VAA is delivered.

Wormhole supports both manual (client-side) and automated relaying. Automated relaying is implemented using the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}, Wormhole's decentralized relayer infrastructure.

## Fundamentals

Relayers act as delivery mechanisms for cross-chain messages. Their responsibility is to observe signed VAAs and submit them to destination chain contracts for on-chain verification and execution. Guardian signatures and on-chain verification logic define what is executed, while relayers provide availability and automation by ensuring messages reach their destination.

- **Anyone can relay a message**: The Guardian Network broadcasts signed VAAs publicly, allowing any entity to submit them to destination chain contracts. Guardian signatures provide universal verifiability, ensuring relaying is permissionless. If one relayer is unavailable, another party can submit the same VAA to complete delivery.
- **Security is in the VAA**: Guardian signatures authenticate message contents and execution parameters. Contracts should rely only on signed VAAs and on-chain state, not on off-chain data supplied by relayers. As a result, relayers can affect delivery timing, but not message correctness or security, making relaying trustless.
- **User experience vs. infrastructure**: Relayers automate cross-chain delivery to improve user experience, but introduce considerations around fees. Developers can choose between client-side relaying or the Executor framework depending on their needs.

## Manual vs. Automated Relaying

When integrating Wormhole messaging, applications can use either manual (client-side) relaying or automated relaying. The difference lies in who is responsible for delivering the VAA to the destination chain.

- **Manual relaying (client-side)**: The user or client application (e.g., a dApp or wallet) is responsible for carrying out all cross-chain steps. After an action on the source chain produces a VAA, the user must fetch the VAA (e.g., via a Wormhole API or explorer) and submit it in a transaction on the destination chain. No backend infrastructure is required, and costs are limited to destination-chain transaction fees. However, this approach requires multiple user interactions and funds on each chain involved, making it best suited for testing, demos, and MVPs rather than production applications.
- **Automated relaying**: Cross-chain delivery is handled automatically by a relayer service or network instead of the end user. From the user's perspective, the message is delivered to the destination chain without manual intervention, enabling a smoother, one-step experience. With the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}, applications can leverage Wormhole's decentralized relayer infrastructure to request automated delivery, without running a backend service. This reduces operational complexity at the cost of service fees, while significantly improving user experience.

Choosing between manual and automated relaying depends on the application's requirements. If the integrator prioritizes convenience, automated relaying provides a superior experience.


## Executor

The Executor is a permissionless, next-generation relaying framework that enables anyone to act as a relayer through a request-and-quote model, with support for multichain delivery and flexible pricing.

At a high level, the Executor consists of:

- A lightweight, stateless [Executor contract](/docs/protocol/infrastructure/relayers/executor-framework/#executor-contract){target=\_blank} deployed by Wormhole on supported chains
- A permissionless network of off-chain [relay providers](/docs/protocol/infrastructure/relayers/executor-framework/#relay-provider){target=\_blank} that fulfill delivery requests

Applications request automated delivery by submitting an execution request to the Executor contract, along with a signed fee quote obtained off-chain from a relay provider. Relay providers monitor these requests and deliver the corresponding VAAs to destination chains for on-chain execution, extending relaying functionality beyond EVM-only environments.

The Executor does not change Wormhole’s security model. Guardian signatures and on-chain verification enforce message integrity and execution correctness, while relay providers compete on pricing and availability. This creates a decentralized marketplace for relaying rather than a single relayer service.


## Next Steps

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Migrate to Executor**

    ---

    Understand the key differences between the Executor framework and the Standard Relayer, and find guidance for migrating existing integrations.

    [:custom-arrow: Migrate to Executor](/docs/protocol/infrastructure/relayers/executor-vs-sr/)

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/ecosystem){target=\_blank}

</div>


