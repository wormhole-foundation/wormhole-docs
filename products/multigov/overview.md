---
title: MultiGov Overview
description: Enable multichain governance with MultiGov. Create, vote, and execute DAO proposals securely across Wormhole supported networks.
categories: Multigov
---

# MultiGov Overview 

MultiGov is a multichain governance system that enables decentralized decision-making across multiple blockchain networks. Built on Wormhole messaging, it allows DAOs to manage proposals, voting, and execution from any connected chain without relying on a single hub or bridging assets. It empowers true multichain governance by aggregating voting power across chains and coordinating secure proposal execution.

## Key Features

MultiGov expands DAO governance across blockchains, increasing participation, improving security with Wormhole messaging, and enabling unified decision-making at scale. Key features include:

- **Multichain governance** – token holders can vote and execute proposals from any supported chain
- **Hub-and-spoke model** - proposals are created on a central hub chain and voted on from spoke chains, where governance tokens live
- **Secure vote aggregation** - vote weights are checkpointed and verified to prevent double voting
- **Cross-chain proposal execution** - approved proposals can be executed across multiple chains
- **Flexible architecture** - can integrate with any Wormhole-supported blockchain
- **Upgradeable and extensible** – supports upgrades across components while preserving vote history and system continuity
- **Backed by Tally** – proposal creation, voting, and execution are coordinated via  [Tally](https://www.tally.xyz/get-started){target=\_blank}

## How It Works

1. **Create proposal on hub chain** - proposals are created on the hub chain, which manages the core governance logic, including vote aggregation and execution scheduling
2. **Vote from spoke chains** - token holders on spoke chains vote locally using `SpokeVoteAggregators`, with checkpoints tracking their voting power
3. **Transmit votes via Wormhole** - votes are securely sent to the hub using [VAAs](/docs/protocol/infrastructure/vaas/){target=\_blank}, ensuring message integrity and cross-chain verification
4. **Aggregate and finalize on hub** - the hub chain receives votes from all spokes, tallies results, and finalizes the outcome once the voting period ends
5. **Execute actions across chains** - upon approval, proposals can trigger execution on one or more chains, again using [Wormhole messaging](/docs/products/messaging/overview/){target=\_blank} to deliver commands

<!-- PUT SIMPLE DIAGRAM HERE -->

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

## Next Steps

Follow these steps to get started with MultiGov:

[timeline(wormhole-docs/.snippets/text/products/multigov/multigov-timeline.json)]
