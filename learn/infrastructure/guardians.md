---
title: Guardians
description: Explore Wormhole's Guardian Network, a decentralized system for secure, scalable cross-chain communication across various blockchain ecosystems.
---

## Guardian

Wormhole relies on distributed nodes that monitor the state on several blockchains. In Wormhole, these nodes are referred to as Guardians. The current Guardian set can be seen in the [Dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}.

Guardians fulfill their role in the messaging protocol as follows: 

1. Each Guardian observes messages and signs the corresponding payloads in isolation from the other Guardians
2. Guardians combine the resulting collection of independent observations to form a multisig
3. This multisig represents proof that a majority of the Wormhole network has observed and agreed upon a state. 

Wormhole refers to these multisigs as [Verifiable Action Approvals](/docs/learn/infrastructure/vaas/){target=\_blank} (VAAs).

## Guardian Network

The Guardian Network functions as Wormhole's decentralized oracle, ensuring secure, cross-chain interoperability. Learning about this critical element of the Wormhole ecosystem will help you better understand the protocol. 

The Guardian Network is designed to help Wormhole deliver on five key principles:

- **Decentralization** - control of the network is distributed across many parties
- **Modularity** - independent components (e.g., oracle, relayer, applications) ensure flexibility and upgradeability
- **Chain Agnosticism** - supports EVM, Solana, Cosmos, and other blockchains without relying on a single network
- **Scalability** - can handle large transaction volumes and high-value transfers
- **Upgradeable** - can change the implementation of its existing modules without breaking integrators to adapt to changes in decentralized computing

The following sections explore each principle in detail. 

### Decentralization

Decentralization is the cornerstone of Wormhole's security model. Many interoperability solutions rely on centralized or weakly decentralized systems, leaving them vulnerable to single points of failure. 

Challenges with existing models include the following:

- **Proof-of-Stake (PoS)** – while PoS works well for blockchain consensus in smart contract-enabled environments, it's less effective for verifying transactions across multiple chains

- **Zero-Knowledge Proofs (ZKPs)** – while promising, ZKPs are computationally expensive and not yet widely supported on all blockchains

Wormhole's approach differs in the following ways:

Instead of relying on PoS or ZKPs alone, Wormhole employs a [t-Schnorr multisig](https://en.wikipedia.org/wiki/Schnorr_signature){target=\_blank} model to create a purpose-built Proof-of-Authority consensus mechanism. Proof-of-Authority strikes a balance between security, efficiency, and decentralization:

- **Guardian Set** – Wormhole currently has 19 trusted Guardians, each with equal authority. They are many of the largest and most widely known validator companies in cryptocurrency
- **Consensus Threshold** – to validate a transaction, at least 13 Guardians must sign off, ensuring robust security
- **Future Expansion** – as blockchain technology advances, the network can incorporate threshold signatures or ZKPs for even greater decentralization

Unlike token-based security, Wormhole relies on experienced, well-capitalized validator companies invested in DeFi's success. As threshold signatures become better supported, the Guardian Set can expand. Once ZKPs are ubiquitous, the Guardian Network will become fully trustless.

### Modularity

Wormhole is designed with simple components that are very good at a single function. Separating security and consensus (Guardians) from message delivery (Relayers) allows for the flexibility to change or upgrade one component without disrupting the others.

### Chain Agnosticism

Today, Wormhole supports a broader range of ecosystems than any other interoperability protocol because it uses simple tech (t-schnorr signatures), an adaptable, heterogeneous relayer model, and a robust validator network. Wormhole can expand to new ecosystems as quickly as a Core Contract can be developed for the smart contract runtime.

### Scalability

Wormhole scales well, as demonstrated by its ability to handle substantial total value locked (TVL) and transaction volume even during tumultuous events.

Every Guardian must run a full node for every blockchain in the ecosystem. This requirement can be computationally heavy to set up; however, once all the full nodes are running, the Guardian Network's actual computation needs become lightweight. 

Performance is generally limited by the speed of the underlying blockchains, not the Guardian Network itself.

### Upgradeable

Wormhole is designed to adapt and evolve in the following ways:

- **Guardian Set Expansion** – future updates may introduce threshold signatures to allow for more Guardians in the set
- **ZKP Integration** - as Zero-Knowledge Proofs become more widely supported, the network can transition to a fully trustless model

These principles combine to create a clear pathway towards a fully trustless interoperability layer that spans decentralized computing.

## Where to Go Next

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Relayers**

    ---

    Discover the role of relayers in the Wormhole network, including client-side, custom, and Wormhole-deployed types, for secure cross-chain communication.

    [:custom-arrow: Learn About Relayers](/docs/learn/infrastructure/relayer/)

- :octicons-tools-16:{ .lg .middle } **Query Guardian Data**

    ---

    Learn how to use Wormhole Queries to add real-time access to Guardian-attested on-chain data via a REST endpoint to your dApp, enabling secure cross-chain interactions and verifications.

    [:custom-arrow: Build with Queries](/docs/build/queries/overview/)

</div>
