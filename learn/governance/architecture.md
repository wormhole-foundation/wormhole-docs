---
title: MultiGov Architecture
description: Discover MultiGov's hub-and-spoke architecture, enabling secure cross-chain governance with Wormhole’s interoperability and decentralized coordination.
---

# MultiGov Architecture

MultiGov employs a hub-and-spoke model to enable cross-chain governance, utilizing Wormhole's interoperability infrastructure for secure cross-chain communication. This architecture allows coordinated decision-making across multiple blockchain networks while maintaining a central coordination point.

## Key Components

### Hub Chain

The hub chain is the central point for managing proposals, tallying votes, executing decisions, and coordinating governance across connected chains.

   - **`HubGovernor`** - central governance contract managing proposals and vote tallying
   - **`HubVotePool`** - receives aggregated votes from spokes and submits them to `HubGovernor`
   - **`HubMessageDispatcher`** - relays approved proposal executions to spoke chains
   - **`HubProposalExtender`** - allows trusted actors to extend voting periods if needed
   - **`HubProposalMetadata`** - helper contract returning `proposalId` and vote start for `HubGovernor` proposals
   - **`HubEvmSpokeAggregateProposer`** - aggregates cross-chain voting weight for an address and proposes via the `HubGovernor` if eligible

### Spoke Chains

Spoke chains handle local voting, forward votes to the hub, and execute approved proposals from the hub for decentralized governance.

   - **`SpokeVoteAggregator`** - collects votes on the spoke chain and forwards them to the hub
   - **`SpokeMessageExecutor`** - receives and executes approved proposals from the hub
   - **`SpokeMetadataCollector`** - fetches proposal metadata from the hub for spoke chain voters
   - **`SpokeAirlock`** - acts as governance's "admin" on the spoke, has permissions and its treasury

## System Workflow

The MultiGov system workflow details the step-by-step process for creating, voting on and executing governance proposals across connected chains, from proposal creation to final cross-chain execution.

1. **Proposal creation**:
    - A user creates a proposal through the `HubEvmSpokeAggregateProposer`, which checks eligibility across chains, or directly on the `HubGovernor` via the `propose` method
    - The proposal is submitted to the `HubGovernor` if the user meets the proposal threshold
1. **Proposal metadata distribution**:
    - `HubProposalMetadata` creates a custom view method to be queried for use in the `SpokeMetadataCollector`
    - `SpokeMetadataCollector` on each spoke chain queries `HubProposalMetadata` for proposal details
1. **Voting process**:
    - Users on spoke chains vote through their respective `SpokeVoteAggregators`
    - `SpokeVoteAggregators` send aggregated votes to the `HubVotePool` via Wormhole
    - `HubVotePool` submits the aggregated votes to the `HubGovernor`
1. **Vote tallying and proposal execution**:
    - `HubGovernor` tallies votes from all chains
    - If a quorum is reached and there are more for votes than against votes, the vote passes and is queued for execution
    - After the timelock delay, the proposal can be executed on the hub chain
    - For cross-chain actions, a proposal should call the `dispatch` method in the `HubMessageDispatcher`, which sends execution messages to the relevant spoke chains
    - `SpokeMessageExecutors` on each spoke chain receive and execute the approved actions through their respective `SpokeAirlocks`

## Cross-Chain Communication

MultiGov relies on Wormhole's infrastructure for all cross-chain messaging, ensuring secure and reliable communication between chains. Wormhole's cross-chain state read system, known as Queries, is used for vote aggregation and proposal metadata. Additionally, cross-chain proposal execution messages are transmitted through Wormhole's custom relaying system, enabling seamless coordination across multiple blockchain networks.

## Security Measures

- **Vote Weight Window** - implements a moving window for vote weight checkpoints to mitigate cross-chain double voting
    - **Proposal Extension** - `HubProposalExtender` allows for extending voting periods by a trusted actor in the case of network issues or high-stakes decisions
- **Timelock** - a timelock period between proposal approval and execution allows for additional security checks and community review
- **Wormhole Verification** - all cross-chain messages are verified using Wormhole's secure messaging protocol

## Detailed Architecture Diagram

This architecture ensures that MultiGov can operate securely and efficiently across multiple chains, allowing for truly decentralized and cross-chain governance while maintaining a unified decision-making process.

<!-- add diagram broken down in sections -->
![detailed multigov architecture diagram](/docs/images/learn/governance/multigov-detailed.webp)
