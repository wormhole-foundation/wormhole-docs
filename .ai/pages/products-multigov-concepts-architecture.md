---
title: MultiGov Architecture
description: Discover MultiGov's hub-and-spoke architecture, enabling secure cross-chain governance with Wormhole’s interoperability and decentralized coordination.
categories: MultiGov
url: https://wormhole.com/docs/products/multigov/concepts/architecture/
---

# MultiGov Architecture

MultiGov uses a hub-and-spoke architecture to coordinate governance across multiple blockchains. The hub chain is the central controller that handles proposal creation, vote aggregation, and execution. Spoke chains allow token holders to vote locally and can also execute proposal outcomes specific to their network.

Wormhole’s multichain messaging infrastructure connects the hub and spokes, enabling secure and efficient chain communication. This design allows DAOs to operate seamlessly across ecosystems while maintaining a unified governance process.

The diagram below illustrates this high-level architecture.

![High-level architecture diagram illustrating the hub-and-spoke structure of the MultiGov system. The diagram shows three key components: Hub Chain and two Spoke Chains, interconnected via Wormhole for cross-chain governance.](/docs/images/products/multigov/concepts/architecture/architecture-1.webp)

## Key Components

### Hub Chain Contracts

The hub chain is the central point for managing proposals, tallying votes, executing decisions, and coordinating governance across connected chains.

   - **`HubGovernor`**: Central governance contract managing proposals and vote tallying.
   - **`HubVotePool`**: Receives aggregated votes from spokes and submits them to `HubGovernor`.
   - **`HubMessageDispatcher`**: Relays approved proposal executions to spoke chains.
   - **`HubProposalExtender`**: Allows trusted actors to extend voting periods if needed.
   - **`HubProposalMetadata`**: Helper contract returning `proposalId` and vote start for `HubGovernor` proposals.
   - **`HubEvmSpokeAggregateProposer`**: Aggregates cross-chain voting weight for an address and proposes via the `HubGovernor` if eligible.

### Spoke Chains Contracts

Spoke chains handle local voting, forward votes to the hub, and execute approved proposals from the hub for decentralized governance.

   - **`SpokeVoteAggregator`**: Collects votes on the spoke chain and forwards them to the hub.
   - **`SpokeMessageExecutor`**: Receives and executes approved proposals from the hub.
   - **`SpokeMetadataCollector`**: Fetches proposal metadata from the hub for spoke chain voters.
   - **`SpokeAirlock`**: Acts as governance's "admin" on the spoke, has permissions, and its treasury.

### Spoke Solana Staking Program

The Spoke Solana Staking Program handles local voting from users who have staked W tokens or are vested in the program, forwards votes to the hub, and executes approved proposals from the hub for decentralized governance.

The program implements its functionality through instructions, using specialized PDA accounts where data is stored. Below are the key accounts in the program:

 - **`GlobalConfig`**: Global program configuration.
 - **`StakeAccountMetadata`**: Stores user's staking information.
 - **`CustodyAuthority`**: PDA account managing custody and overseeing token operations related to stake accounts.
 - **`StakeAccountCustody`**: Token account associated with a stake account for securely storing staked tokens.
 - **`CheckpointData`**: Tracks delegation history.
 - **`SpokeMetadataCollector`**: Collects and updates proposal metadata from the hub chain.
 - **`GuardianSignatures`**: Stores guardian signatures for message verification.
 - **`ProposalData`**: Stores data about a specific proposal, including votes and start time.
 - **`ProposalVotersWeightCast`**: Tracks individual voter's weight for a proposal.
 - **`SpokeMessageExecutor`**: Processes messages from a spoke chain via the Wormhole protocol.
 - **`SpokeAirlock`**: Manages PDA signing and seed validation for secure instruction execution.
 - **`VestingBalance`**: Stores total vesting balance and related staking information of a vester.
 - **`VestingConfig`**: Defines vesting configuration, including mint and admin details.
 - **`Vesting`**: Represents individual vesting allocations with maturation data.
 - **`VoteWeightWindowLengths`**: Tracks lengths of vote weight windows.

Each account is implemented as a Solana PDA (Program Derived Address) and utilizes Anchor's account framework for serialization and management.

## Key Components in Action

This architecture ensures that MultiGov can operate securely and efficiently across multiple chains, allowing for truly decentralized and cross-chain governance while maintaining a unified decision-making process.

![detailed multigov architecture diagram](/docs/images/products/multigov/concepts/architecture/architecture-2.webp)

## Multichain Communication

MultiGov relies on Wormhole's infrastructure for all multichain messaging, ensuring secure and reliable communication between chains. Wormhole's cross-chain state read system, known as Queries, is used for vote aggregation and proposal metadata. Additionally, cross-chain proposal execution messages are transmitted through Wormhole's custom relaying system, enabling seamless coordination across multiple blockchain networks.

## Security Measures

- **Vote weight window**: Implements a moving window for vote weight checkpoints to mitigate cross-chain double voting.
    - **Proposal extension**: `HubProposalExtender` allows for extending voting periods by a trusted actor in the case of network issues or high-stakes decisions.
- **Timelock**: A timelock period between proposal approval and execution allows for additional security checks and community review.
- **Wormhole verification**: All multichain messages are verified using Wormhole's secure messaging protocol.

## Conclusion

MultiGov’s hub-and-spoke architecture centralizes proposal authority on the hub while distributing participation and execution to spokes. [Wormhole Messaging](/docs/products/messaging/overview/){target=\_blank} carries authenticated multichain actions, and [Wormhole Queries](/docs/products/queries/overview/){target=\_blank} provide reliable state reads for metadata and vote proofs. With clear trust boundaries, timelocks, Guardian verification, and checkpointing, the system remains coherent across heterogeneous chains.

For the end-to-end lifecycle—from proposal creation to multichain execution, see the [Flow of a Proposal](/docs/products/multigov/concepts/proposal-flow/) page.
