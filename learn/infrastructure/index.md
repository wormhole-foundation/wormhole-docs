---
title: Infrastructure Components
description: Explore Wormhole's infrastructure, including the key components that enable secure cross-chain communication and asset transfers across blockchain networks.
---

# Infrastructure Components

## Get Started

This section provides a closer look at the core components that power Wormhole's infrastructure, including Guardians, relayers, VAAs, and the Spy.

<div class="grid cards" markdown>

-   :octicons-question-16:{ .lg .middle } **How Do Wormhole’s Infrastructure Components Work Together?**

    ---

    A simplified flow of a cross-chain message from a source-chain contract to a target-chain contract can be summarized as follows:

    1. Messages are sent from a source contract to the Wormhole Core Contract on the source chain, which publishes them on-chain
    2. Guardians then validate these messages before forwarding them to the target chain
    3. The validated message is encapsulated in a VAA (Verifiable Action Approval), combining the message with Guardian signatures to create a proof
    4. A relayer relays the VAA to the target chain, which is then verified by the Wormhole Core Contract on the target chain

    You can find more information about the infrastructure components and how they work together on the [Architecture Overview](/learn/fundamentals/architecture/) page.

</div>

### Components

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Wormhole Core Contracts**

    ---

    The Core Contracts are responsible for publishing and verifying all cross-chain messages.

    [:octicons-arrow-right-24: Learn more about Core Contracts](/learn/infrastructure/core-contracts/)

-   :octicons-book-16:{ .lg .middle } **Verifiable Action Approvals (VAAs)**

    ---

    VAAs are Wormhole's core messaging primitive, consisting of cross-chain data packets.

    [:octicons-arrow-right-24: Learn more about VAAs](/learn/infrastructure/vaas/)

-   :octicons-book-16:{ .lg .middle } **Guardians**

    ---

    Guardians are nodes responsible for observing messages and signing the corresponding payloads.

    [:octicons-arrow-right-24: Learn more about Guardians](/learn/infrastructure/guardians/)

-   :octicons-book-16:{ .lg .middle } **Relayers**

    ---

    Relayers are processes that handle the delivery of VAAs to their intended destination.

    [:octicons-arrow-right-24: Learn more about relayers](/learn/infrastructure/relayers/)

-   :octicons-book-16:{ .lg .middle } **Spy**

    ---

    A Spy watches the messages published by the Guardian Network and can forward network traffic.

    [:octicons-arrow-right-24: Learn more about the Spy](/learn/infrastructure/spy/)

</div>
