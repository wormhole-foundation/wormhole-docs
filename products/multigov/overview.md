---
title: MultiGov Overview
description: Enable multichain governance with MultiGov. Create, vote, and execute DAO proposals securely across Wormhole supported networks.
categories: Multigov
---

# MultiGov Overview 

MultiGov is a multichain governance system that enables decentralized decision-making across multiple blockchain networks. Built on Wormhole messaging, it allows DAOs to manage proposals, voting, and execution from any connected chain without relying on a single hub or bridging assets. It empowers true multichain governance by aggregating voting power across chains and coordinating secure proposal execution.

## Key Features

MultiGov expands DAO governance across blockchains, increasing participation, improving security with Wormhole messaging, and enabling unified decision-making at scale. Key features include:

- **Multichain governance**: Token holders can vote and execute proposals from any supported chain.
- **Hub-and-spoke model**: Proposals are created on a central hub chain and voted on from spoke chains, where governance tokens live.
- **Secure vote aggregation**: Vote weights are checkpointed and verified to prevent double voting.
- **Cross-chain proposal execution**: Approved proposals can be executed across multiple chains.
- **Flexible architecture**: Can integrate with any Wormhole-supported blockchain.
- **Upgradeable and extensible**: Supports upgrades across components while preserving vote history and system continuity.
- **Backed by Tally**: Proposal creation, voting, and execution are coordinated via  [Tally](https://www.tally.xyz/get-started){target=\_blank}.

## How It Works

1. **Create proposal on hub chain**: Proposals are created on the hub chain, which manages the core governance logic, including vote aggregation and execution scheduling.
2. **Vote from spoke chains**: Token holders on spoke chains vote locally using `SpokeVoteAggregators`, with checkpoints tracking their voting power.
3. **Transmit votes via Wormhole**: Votes are securely sent to the hub using [VAAs](/docs/protocol/infrastructure/vaas/){target=\_blank}, ensuring message integrity and cross-chain verification.
4. **Aggregate and finalize on hub**: The hub chain receives votes from all spokes, tallies results, and finalizes the outcome once the voting period ends.
5. **Execute actions across chains**: Upon approval, proposals can trigger execution on one or more chains, again using [Wormhole messaging](/docs/products/messaging/overview/){target=\_blank} to deliver commands.

<!-- PUT SIMPLE DIAGRAM HERE -->

## Use Cases

- **Cross-Chain Treasury Management**

    - **[MultiGov](/docs/products/multigov/get-started/){target=\_blank}**: Vote on treasury actions from any supported chain.
    - **[Messaging](/docs/products/messaging/overview/){target=\_blank}**: Transmit proposal execution to target chains.
    - **[Token Bridge](/docs/products/token-bridge/overview/){target=\_blank}**: Optionally move assets.

- **Coordinated Protocol Upgrades Across Chains**

    - **[MultiGov](/docs/products/multigov/get-started/){target=\_blank}**: Create a unified proposal to upgrade contracts across networks.
    - **[Messaging](/docs/products/messaging/overview/){target=\_blank}**: Send upgrade instructions as VAAs and deliver execution payloads to target chains.
    
- **Progressive Decentralization for Multichain DAOs**

    - **[MultiGov](/docs/products/multigov/get-started/){target=\_blank}**: Extend governance to new chains while preserving coordination.
    - **[Queries](/docs/products/queries/overview/){target=\_blank}**: Fetch on-chain vote weights from remote spokes.
    - **[Messaging](/docs/products/messaging/overview/){target=\_blank}**: Aggregate results and execute actions via the hub.

## Next Steps

Follow these steps to get started with MultiGov:

[timeline(wormhole-docs/.snippets/text/products/multigov/multigov-timeline.json)]
