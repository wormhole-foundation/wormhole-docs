---
title: MultiGov Overview
description: Explore MultiGov, a cross-chain governance system using Wormhole for seamless voting and proposal execution across multiple blockchain networks.
categories: MultiGov
---

# MultiGov: Cross-Chain Governance with Wormhole

## Overview

### What Is MultiGov and Why Is It Important?

MultiGov is a cross-chain governance system that extends traditional DAO governance across multiple blockchain networks. By leveraging Wormhole's interoperability infrastructure, MultiGov enables seamless voting and proposal mechanisms across various chains.

MultiGov is important because it:

- **Increases participation** by allowing token holders from multiple chains to engage in governance
- **Enhances security** by leveraging Wormhole's robust cross-chain communication
- **Improves scalability** by integrating any chain supported by Wormhole
- **Enables unified governance** and coordinated decision-making across multiple networks

### Key Features

- **Hub and spoke model** - central coordination on a hub chain with participation from multiple spoke chains. A hub chain is where the governance state lives, while the spoke chains can be considered extensions of governance that allow for participation by token holders on other chains
- **Cross-chain voting** - token holders on any integrated chain can cast votes
- **Vote aggregation** - votes from all chains are collected and tallied on the hub
- **Cross-chain proposal execution** - approved proposals can be executed across multiple chains
- **Wormhole integration** - secure and reliable cross-chain communication
- **Flexible architecture** - can integrate with any Wormhole-supported blockchain

### High-Level Architecture Diagram

The diagram below represents MultiGov's high-level architecture, focusing on its hub-and-spoke model for decentralized governance across multiple chains. The hub chain acts as the central governance controller, managing proposal creation, vote tallying, and execution, while the spoke chains handle local voting and proposal execution on individual chains. The hub and spoke chains communicate via Wormhole's cross-chain messaging infrastructure, ensuring secure and efficient governance across multiple blockchain networks.

For a deeper understanding of the system's structure and how the components interact, refer to the [MultiGov Architecture](/docs/products/multigov/concepts/architecture/){target=\_blank} page.

<!-- simplify diagram -->
![High-level architecture diagram illustrating the hub-and-spoke structure of the MultiGov system. The diagram shows three key components: Hub Chain and two Spoke Chains, interconnected via Wormhole for cross-chain governance.](/docs/images/products/multigov/concepts/architecture/multigov-high-level.webp)
