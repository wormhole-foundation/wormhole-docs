---
title: Relayers Overview
description: Discover the role of relayers in the Wormhole network, including client-side, custom, and Wormhole-deployed types, for secure cross-chain communication.
categories: Basics, Relayers, Executor
url: https://wormhole.com/docs/protocol/infrastructure/relayers/relayer/
---

# Overview

!!!warning 
    The Wormhole Standard Relayer is being deprecated. Developers are strongly encouraged to [migrate to the Executor framework](/docs/protocol/infrastructure/relayers/executor-vs-sr/){target=\_blank}.

This page introduces relayers in the Wormhole network and explains their role, available approaches, and the trade-offs involved in delivering cross-chain messages.

Relayers are the entities responsible for submitting signed [Verified Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} to destination chains, providing message delivery and automation. At the same time, Guardian signatures and on-chain verification ensure that relayers cannot tamper with message contents and only influence when a VAA is delivered.

Wormhole supports both manual (client-side) and automated relaying. Automated relaying can be implemented either by running a custom relayer or by using Wormhole’s primary relayer infrastructure: the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}.

## Fundamentals

Relayers act as delivery mechanisms for cross-chain messages. Their responsibility is to observe signed VAAs and submit them to destination chain contracts for on-chain verification and execution. Guardian signatures and on-chain verification logic define what is executed, while relayers provide availability and automation by ensuring messages reach their destination.

- **Anyone can relay a message**: The Guardian Network broadcasts signed VAAs publicly, allowing any entity to submit them to destination chain contracts. Guardian signatures provide universal verifiability, ensuring relaying is permissionless. If one relayer is unavailable, another party can submit the same VAA to complete delivery.
- **Security is in the VAA**: Guardian signatures authenticate message contents and execution parameters. Contracts should rely only on signed VAAs and on-chain state, not on off-chain data supplied by relayers. As a result, relayers can affect delivery timing, but not message correctness or security, making relaying trustless.
- **User experience vs. infrastructure**: Relayers automate cross-chain delivery to improve user experience, but introduce considerations around fees and operational complexity. Developers can choose between client-side relaying, Wormhole-provided relayer infrastructure, or custom relayers depending on cost, control, and infrastructure requirements.

## Manual vs. Automated Relaying

When integrating Wormhole messaging, applications can use either manual (client-side) relaying or automated relaying. The difference lies in who is responsible for delivering the VAA to the destination chain.

- **Manual relaying (client-side)**: The user or client application (e.g., a dApp or wallet) is responsible for carrying out all cross-chain steps. After an action on the source chain produces a VAA, the user must fetch the VAA (e.g., via a Wormhole API or explorer) and submit it in a transaction on the destination chain. No backend infrastructure is required, and costs are limited to destination-chain transaction fees. However, this approach requires multiple user interactions and funds on each chain involved, making it best suited for testing, demos, and MVPs rather than production applications.
- **Automated relaying**: Cross-chain delivery is handled automatically by a relayer service or network instead of the end user. From the user’s perspective, the message is delivered to the destination chain without manual intervention, enabling a smoother, one-step experience. Automated relaying can be implemented in two ways:

    - **Build a relayer service (custom backend)**: Run an off-chain service that listens for VAAs and forwards them to destination chains. This approach provides full control over delivery logic (e.g., batching, retries, or gas optimization) but requires building and operating backend infrastructure.
    - **Use a relayer network provided by Wormhole**: Leverage Wormhole’s decentralized relayer infrastructure to request automated delivery through on-chain calls, without running a backend service. This reduces operational complexity at the cost of service fees, while significantly improving user experience.

Choosing between manual and automated relaying depends on the application's requirements. If the integrator prioritizes convenience, automated relaying (via either a Wormhole service or a custom service) provides a superior experience.

## Types of Relayers

Automated relaying can be implemented using Wormhole-provided infrastructure or by running a custom relayer service. Wormhole’s primary relayer solution is the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}, which provides permissionless, automated message delivery across supported chains. For advanced use cases or custom logic, applications can also run [custom relayers](#custom-relayer){target=\_blank} using Wormhole’s tooling.

| Aspect          | Executor                                         | Custom Relayer               |
|-----------------|--------------------------------------------------|------------------------------|
| Who Runs It     | Permissionless network of providers              | Application team             |
| Chain Support   | Out of the box on all Wormhole-supported chains  | Any Wormhole-supported chain (manual setup required) |
| Integration     | Executor contracts with request–quote model      | Custom backend service       |
| Infrastructure  | None (on-chain only)                             | Full backend required, 24/7 availability |
| User Experience | Seamless, broader chain support                  | App-specific optimizations possible |
| Trade-offs      | Early rollout, limited initial availability      | High DevOps cost, must stay secure | 

### Executor

The Executor is a permissionless, next-generation relaying framework that enables anyone to act as a relayer through a request-and-quote model, with support for multichain delivery and flexible pricing.

At a high level, the Executor consists of:

- A lightweight, stateless [Executor contract](/docs/protocol/infrastructure/relayers/executor-framework/#executor-contract){target=\_blank} deployed by Wormhole on supported chains
- A permissionless network of off-chain [relay providers](/docs/protocol/infrastructure/relayers/executor-framework/#relay-provider){target=\_blank} that fulfill delivery requests

Applications request automated delivery by submitting an execution request to the Executor contract, along with a signed fee quote obtained off-chain from a relay provider. Relay providers monitor these requests and deliver the corresponding VAAs to destination chains for on-chain execution, extending relaying functionality beyond EVM-only environments.

The Executor does not change Wormhole’s security model. Guardian signatures and on-chain verification enforce message integrity and execution correctness, while relay providers compete on pricing and availability. This creates a decentralized marketplace for relaying rather than a single relayer service.

### Custom Relayer

For projects with special requirements or the need for complete control, custom relaying is an option. This involves building and running a relayer service tailored to the application. A custom relayer typically runs as a backend service that listens for specific VAAs from the Wormhole network (often via a [Spy](/docs/protocol/infrastructure/spy/){target=\_blank}) and then submits transactions to the destination chain when relevant messages are observed. Because Wormhole VAAs are public and trustless, anyone can run a relayer — an integrator could even operate a private relayer that only handles their own protocol’s messages.

The primary motivation for choosing this route is flexibility and optimization; another reason may be specific chains where an Executor is still not available. With an off-chain component, developers can:  

- Apply conditional logic like aggregating multiple messages and relaying them in a single transaction (batching).  
- Trigger delivery logic (e.g., timing, price feeds, external signals) before delivery.  
- Perform computations off-chain to reduce on-chain gas costs.  
- Design custom incentive structures (e.g., funded by a protocol treasury or user-paid fees).  
- Enhance the user experience with optimizations specific to an app.

Running a custom relayer requires operating dedicated infrastructure with continuous availability and monitoring. Integrators are responsible for secure message handling, including verifying VAAs and managing delivery logic, as well as handling cross-chain fee payments where applicable. While this approach provides maximum flexibility and application-specific optimization, it comes with higher development, operational, and DevOps overhead than using the Wormhole-provided relayer infrastructure.

To simplify development, Wormhole provides the [Relayer Engine](https://github.com/wormhole-foundation/relayer-engine){target=\_blank}, a tool that abstracts boilerplate tasks such as listening to Guardians, parsing messages, and handling retries. Developers can then focus on application-specific logic, such as filtering relevant VAAs, forwarding to multiple chains, or applying off-chain checks.

## Next Steps

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Migrate to Executor**

    ---

    Understand the key differences between the Executor framework and the Standard Relayer, and find guidance for migrating existing integrations.

    [:custom-arrow: Migrate to Executor](/docs/protocol/infrastructure/relayers/executor-vs-sr/)

-   :octicons-book-16:{ .lg .middle } **Run a Custom Relayer**

    ---

    Learn how to build and configure your own off-chain custom relaying solution to relay Wormhole messages for your applications using the Relayer Engine.

    [:custom-arrow: Get Started with Custom Relayers](/docs/protocol/infrastructure-guides/run-relayer/)

</div>
