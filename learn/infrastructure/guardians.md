---
title: Guardians
description: Explore Wormhole's Guardian Network, a decentralized system for secure, scalable cross-chain communication across various blockchain ecosystems.
---

## Guardian

Wormhole relies on a set of distributed nodes that monitor the state on several blockchains. In Wormhole, these nodes are referred to as Guardians. The current Guardian set can be seen in the [Dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet){target=\_blank}.

It is the Guardians' role to observe messages and sign the corresponding payloads. Each Guardian performs this step in isolation, combining the resulting signatures with other Guardians as a final step. The resulting collection of independent observations forms a multisig, representing proof that the majority of the Wormhole network has observed and agreed upon a state. These multisigs are referred to as VAAs in Wormhole.

## Guardian Network

The Guardian Network is designed to serve as Wormhole's oracle component, and the entire Wormhole ecosystem is founded on its technical underpinnings. It is the most critical element of the Wormhole ecosystem and represents the most crucial component to learn about if you want a deep understanding of it.

To understand not just _how_ the Guardian Network works but _why_ it works the way it does, it is important to review the key design considerations. To become the best-in-class interoperability platform, Wormhole needed to have five critical features:

- **Decentralization** - control of the network needs to be distributed amongst many parties
- **Modularity** - disparate parts of the ecosystem, such as the oracle, relayer, applications, and others, should be kept as separate and modular as possible so they can be designed, modified, and upgraded independently
- **Chain Agnosticism** - Wormhole should be able to support not only EVM but also chains like Solana, Algorand, Cosmos, and even platforms that still need to be created. It also shouldn't have any one chain as a single point of failure
- **Scalability** - Wormhole should be able to secure a large amount of value immediately and be able to handle the large transaction volume
- **Upgradeable** - as the decentralized computing ecosystem evolves, Wormhole will need to be able to change the implementation of its existing modules without breaking integrators

Next, the ways by which Wormhole achieves this will be examined individually.

### Decentralization

Decentralization is the biggest concern. Previous interoperability solutions have largely been entirely centralized, and even newer solutions utilizing things like adversarial relayers still tend to have single points of failure or collusion thresholds as low as one or two.

When designing a decentralized oracle network, the first option to consider is likely a Proof-of-Stake (PoS) system however, this is a suboptimal solution. PoS is designed for blockchain consensus in smart contract-enabled environments, so it's less suitable when the network verifies the output of many blockchains and doesn't support its own smart contracts. While it looks appealing from a decentralization perspective, network security remains to be seen, and it can make some of the other outlined goals more challenging to achieve. Different options need to be explored.

Another option is to use Zero-Knowledge Proofs (ZKP) to secure the network. This would be a good solution from a decentralization perspective, as it's trustless. However, ZKPs are still a nascent technology, and verifying them on-chain isn't feasible, especially on chains with limited computational environments. That means a form of multisig will be needed to secure the network.

In the current De-Fi landscape, most of the top blockchains are secured by the same handful of validator companies. Currently, only a limited number of companies in the world have the skills and capital to run top-notch validator companies.

If a protocol could unite a large number of those validator companies into a purpose-built consensus mechanism optimized for chain interoperability, that design would likely be more performant and secure than a network bootstrapped by a tokenomics model. Assuming the validators would be on board, how many could Wormhole realistically utilize?

If Wormhole used threshold signatures, the answer would be "as many as are willing to participate." However, threshold signatures need more support across the blockchain world, meaning verifying the signatures would be difficult and expensive, ultimately limiting scalability and chain agnosticism. Thus, a t-schnorr multisig presents itself as the best option: cheap and well-supported, even though its verification costs increase linearly with the number of signatures included.

All these things considered, 19 seems to be the maximum number and a good tradeoff. If two-thirds of the signatures are needed for consensus, then 13 signatures must be verified on-chain, which remains reasonable from a gas-cost perspective.

Rather than securing the network with tokenomics, it is better to initially secure the network by involving robust companies that are heavily invested in De-Fi's success. The 19 Guardians aren't anonymous or small, they are many of the largest and most widely known validator companies in cryptocurrency. 

This led to a network of 19 Guardians, each with an equal stake, and joined in a purpose-built Proof-of-Authority consensus mechanism. As threshold signatures become better supported, the Guardian Set can expand, and once ZKPs are ubiquitous, the Guardian Network will become fully trustless.

With the perspective on Decentralization laid out, the remaining elements fall into place.

### Modularity

The Guardian Network is robust and trustworthy by itself, so there's no need for components like the relayer to contribute to the security model. That makes Wormhole able to have simple components that are very good at their one thing. Guardians only need to verify on-chain activity and produce VAAs, while relayers only need to interact with blockchains and deliver messages.

The VAAs' signing scheme can be changed without affecting downstream users, and multiple relay mechanisms can exist independently. xAssets can be implemented purely at the application layer, and cross-chain applications can use whatever components suit them.

### Chain Agnosticism

Today, Wormhole supports a broader range of ecosystems than any other interoperability protocol because it uses simple tech (t-schnorr signatures), an adaptable, heterogeneous relayer model, and a robust validator network.

Wormhole can expand to new ecosystems as quickly as a Core Contract can be developed for the smart contract runtime. Relayers don't need to be factored into the security model; they just need to be able to upload messages to the blockchain. The Guardians are able to observe every transaction on every chain without taking shortcuts.

### Scalability

Wormhole scales well, as demonstrated by its ability to handle huge total value locked (TVL) and transaction volume even during tumultuous events.

The requirements for running a Guardian are relatively heavy, as they must run a full node for every single blockchain in the ecosystem. This is another reason why a limited number of robust validator companies are beneficial for this design.

However, once all the full nodes are running, the Guardian Network's actual computation and network overheads become lightweight. The blockchains' performance tends to be the bottleneck in Wormhole rather than anything happening inside the Guardian Network.

### Upgradeable

Over time, the Guardian Set can be expanded beyond 19 using threshold signatures. Various relaying models will emerge, each with their own strengths and weaknesses. ZKPs can be used on chains where they are well-supported. The cross-chain application ecosystem will grow, and cross-chain applications will become increasingly intermingled. There are very few APIs in Wormhole, and most items are implementation details from the integrator perspective. This creates a clear pathway towards a fully trustless interoperability layer that spans decentralized computing.
