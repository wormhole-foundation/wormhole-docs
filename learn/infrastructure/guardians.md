---
title: Guardians
description: Explore Wormhole's Guardian Network, a decentralized system for secure, scalable cross-chain communication across various blockchain ecosystems.
---

## Guardian

Wormhole relies on a set of 19 distributed nodes that monitor the state on several blockchains. In Wormhole, these nodes are referred to as Guardians. The current Guardian set can be seen in the [Dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}.

Guardians fulfill their role in the messaging protocol as follows: 

1. Each Guardian observes messages and signs the corresponding payloads in isolation from the other Guardians
2. Guardians combine their indpendent signatures to form a multisig
3. This multisig represents proof that a majority of the Wormhole network has observed and agreed upon a state

Wormhole refers to these multisigs as [Verifiable Action Approvals](/docs/learn/infrastructure/vaas/){target=\_blank} (VAAs).

## Guardian Network

The Guardian Network functions as Wormhole's decentralized oracle, ensuring secure, cross-chain interoperability. Learning about this critical element of the Wormhole ecosystem will help you better understand the protocol. 

The Guardian Network is designed to help Wormhole deliver on five key principles:

- **Decentralization** - control of the network is distributed across many parties
- **Modularity** - independent components (e.g., oracle, relayer, applications) ensure flexibility and upgradeability
- **Chain agnosticism** - supports EVM, Solana, and other blockchains without relying on a single network
- **Scalability** - can handle large transaction volumes and high-value transfers
- **Upgradeable** - can change the implementation of its existing modules without breaking integrators to adapt to changes in decentralized computing

The following sections explore each principle in detail. 

### Decentralization

Decentralization remains the core concern for interoperability protocols. Earlier solutions were fully centralized, and even newer models often rely on a single entity or just one or two actors, creating low thresholds for collusion or failure.

Two common approaches to decentralization have notable limitations:

- **Proof-of-Stake (PoS)** - while PoS is often seen as a go-to model for decentralization, it's not well-suited for a network that verifies many blockchains and doesn't run its own smart contracts. Its security in this context is unproven, and it introduces complexities that make other design goals harder to achieve
- **Zero-Knowledge Proofs (ZKPs)** - ZKPs offer a trustless and decentralized approach, but the technology is still early-stage. On-chain verification is often too computationally expensive—especially on less capable chains—so a multisig-based fallback is still required for practical deployment

In the current De-Fi landscape, most major blockchains are secured by a small group of validator companies. Only a limited number of companies worldwide have the expertise and capital to run high-performance validators.

If a protocol could unite many of these top validator companies into a purpose-built consensus mechanism designed for interoperability, it would likely offer better performance and security than a token-incentivized network. The key question is: how many of them could Wormhole realistically involve?

To answer that, consider these key constraints and design decisions:

- **Threshold signatures allow flexibility, but** - with threshold signatures, in theory, any number of validators could participate. However, threshold signatures are not yet widely supported across blockchains. Verifying them is expensive and complex, especially in a chain-agnostic system
- **t-Schnorr multisig is more practical** - Wormhole uses [t-Schnorr multisig](https://en.wikipedia.org/wiki/Schnorr_signature){target=\_blank}, which is broadly supported and relatively inexpensive to verify. However, verification costs scale linearly with the number of signers, so the size of the validator set needs to be carefully chosen
- **19 validators is the optimal tradeoff** - a set of 19 participants presents a practical compromise between decentralization and efficiency. With a two-thirds consensus threshold, only 13 signatures must be verified on-chain—keeping gas costs reasonable while ensuring strong security
- **Security through reputation, not tokens** - Wormhole relies on a network of established validator companies instead of token-based incentives. These 19 Guardians are among the most trusted operators in the industry—real entities with a track record, not anonymous participants

This forms the foundation for a purpose-built Proof-of-Authority (PoA) consensus model, where each Guardian has an equal stake. As threshold signatures gain broader support, the set can expand. Once ZKPs become widely viable, the network can evolve into a fully trustless system.

### Modularity

Wormhole is designed with simple components that are very good at a single function. Separating security and consensus (Guardians) from message delivery ([relayers](/docs/learn/infrastructure/relayer/){target=\_blank}) allows for the flexibility to change or upgrade one component without disrupting the others.

### Chain Agnosticism

Today, Wormhole supports a broader range of ecosystems than any other interoperability protocol because it uses simple tech (t-schnorr signatures), an adaptable, heterogeneous relayer model, and a robust validator network. Wormhole can expand to new ecosystems as quickly as a [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} can be developed for the smart contract runtime.

### Scalability

Wormhole scales well, as demonstrated by its ability to handle substantial total value locked (TVL) and transaction volume even during tumultuous events.

Every Guardian must run a full node for every blockchain in the ecosystem. This requirement can be computationally heavy to set up; however, once all the full nodes are running, the Guardian Network's actual computation needs become lightweight. 

Performance is generally limited by the speed of the underlying blockchains, not the Guardian Network itself.

### Upgradeable

Wormhole is designed to adapt and evolve in the following ways:

- **Guardian Set expansion** – future updates may introduce threshold signatures to allow for more Guardians in the set
- **ZKP integration** - as Zero-Knowledge Proofs become more widely supported, the network can transition to a fully trustless model

These principles combine to create a clear pathway towards a fully trustless interoperability layer that spans decentralized computing.

## Next Steps

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
