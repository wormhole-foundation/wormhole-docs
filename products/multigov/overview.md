---
title: Multigov Overview
description: Enable multichain governance with MultiGov. Create, vote, and execute DAO proposals securely across Wormhole supported networks.
categories: Multigov
---

# Multigov Overview 

MultiGov is a multichain governance system that enables decentralized decision-making across multiple blockchain networks. Built on Wormhole messaging, it allows DAOs to manage proposals, voting, and execution from any connected chain without relying on a single hub or bridging assets. It empowers true multichain governance by aggregating voting power across chains and coordinating secure proposal execution.

## Key Features

MultiGov expands DAO governance across blockchains, increasing participation, improving security with Wormhole messaging, and enabling unified decision-making at scale. Key features include:

- **Hub-and-spoke model** - proposals are created on a central hub chain and voted on from spoke chains, where governance tokens live
- **Multichain governance** – token holders can vote and execute proposals from any supported chain
- **Secure vote aggregation** - vote weights are checkpointed and verified to prevent double voting
- **Cross-chain proposal execution** - approved proposals can be executed across multiple chains
- **Flexible architecture** - can integrate with any Wormhole-supported blockchain
- **Upgradeable and extensible** – supports upgrades across components while preserving vote history and system continuity
- **Backed by Tally** – proposal creation, voting, and execution are coordinated via  [Tally](https://www.tally.xyz/get-started){target=\_blank}

## How It Works

- **Hub chain** – manages proposal creation, vote aggregation, and execution
- **Spoke chains** – handle local voting and checkpoints, enable token holders to vote and execute proposals on their native chain
- **Secure messaging via Wormhole** – uses Wormhole VAAs to send and verify votes and execution data between chains
- **Decentralized execution** – proposals can include actions on one or multiple spoke chains after hub-level approval
- **Consistent governance state** – ensures synchronized proposal data and vote weights across all chains involved

![High-level architecture diagram illustrating the hub-and-spoke structure of the MultiGov system. The diagram shows three key components: Hub Chain and two Spoke Chains, interconnected via Wormhole for cross-chain governance.](/docs/images/products/multigov/concepts/architecture/multigov-high-level.webp)

## Use Cases

- **Cross-Chain Treasury Management**

    - [**MultiGov**](/docs/products/multigov/get-started/){target=\_blank} – vote on treasury actions from any supported chain  
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – transmit proposal execution to target chains
    - [**Token Bridge**](/docs/products/token-bridge/get-started/){target=\_blank} – optionally move assets 

- **Coordinated Protocol Upgrades Across Chains**

    - [**MultiGov**](/docs/products/multigov/get-started/){target=\_blank} – create a unified proposal to upgrade contracts across networks  
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – send upgrade instructions as VAAs and deliver execution payloads to target chains 
    
- **Progressive Decentralization for Multichain DAOs**

    - [**MultiGov**](/docs/products/multigov/get-started/){target=\_blank} – extend governance to new chains while preserving coordination  
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – fetch on-chain vote weights from remote spokes  
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – aggregate results and execute actions via the hub 

For a hands-on example, see the [Treasury Proposal Tutorial](/docs/products/multigov/tutorials/treasury-proposal/){target=\_blank}.

## Next Steps

Here’s how to get started with MultiGov:

- Submit an integration request with Tally
- Set up your local environment and clone the repo
- Follow the appropriate deployment guide:
    - Deploy on EVM
    - Deploy on Solana