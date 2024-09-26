---
title: MultiGov Overview
description: Explore MultiGov, a cross-chain governance system using Wormhole for seamless voting and proposal execution across multiple blockchain networks.
---

# MultiGov: Cross-Chain Governance with Wormhole

Welcome to the MultiGov docs! This first section provides an overview of MultiGov. Feel free to jump to any of the other sections in the table of contents below:

## Table of Contents
1. [Overview](/docs/learn/governance/multigov-overview/){target=\_blank}
2. [Getting Started](/docs/learn/governance/getting-started/){target=\_blank}
3. [Deployment](/docs/build/multigov/deployment/){target=\_blank}
4. [Upgrading](/docs/build/multigov/upgrading/){target=\_blank}
5. [Architecture](/docs/learn/governance/multigov-architecture/){target=\_blank}
6. [Guides](/docs/build/multigov/guides/){target=\_blank}
7. [FAQs](/docs/build/multigov/faq/){target=\_blank}

## Overview

### What is MultiGov and why is it important?

MultiGov is a cross-chain governance system that extends traditional DAO governance across multiple blockchain networks. By leveraging Wormhole's interoperability infrastructure, MultiGov enables seamless voting and proposal mechanisms across various chains.

MultiGov is important because it:

- **Increases participation** by allowing token holders from multiple chains to engage in governance
- **Enhances security** by leveraging Wormhole's robust cross-chain communication
- **Improves scalability** by integrating any chain supported by Wormhole
- **Enables unified governance** and coordinated decision-making across multiple networks

### Key Features

- **Hub and Spoke model** - Central coordination on a hub chain with participation from multiple spoke chains. A hub chain is the chain where governance state lives while the spoke chains can be thought of as extensions of governance that allow for participation by token holders on other chains.
- **Cross-Chain voting** - token holders on any integrated chain can cast votes
- **Vote aggregation** - votes from all chains are collected and tallied on the hub
- **Cross-Chain proposal execution** - approved proposals can be executed across multiple chains
- **Wormhole integration** - secure and reliable cross-chain communication
- **Flexible architecture** - can integrate with any Wormhole-supported blockchain

### High-Level Architecture Diagram

![high level multigov architecture diagram](/docs/images/learn/governance/multigov-high-level.webp)

