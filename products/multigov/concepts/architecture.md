---
title: MultiGov Architecture
description: Discover MultiGov's hub-and-spoke architecture, enabling secure cross-chain governance with Wormhole’s interoperability and decentralized coordination.
categories: MultiGov
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

## System Workflow

The MultiGov system workflow details the step-by-step process for creating, voting on, and executing governance proposals across connected chains, from proposal creation to final cross-chain execution.

### EVM Governance Workflow

The EVM-based MultiGov workflow follows these steps:

1. Proposal creation:
    1. A user creates a proposal through the `HubEvmSpokeAggregateProposer`, which checks eligibility across chains, or directly on the `HubGovernor` via the `propose` method.
    2. The proposal is submitted to the `HubGovernor` if the user meets the proposal threshold.
2. Proposal metadata distribution:
    1. `HubProposalMetadata` creates a custom view method to be queried for use in the `SpokeMetadataCollector`.
    2. `SpokeMetadataCollector` on each spoke chain queries `HubProposalMetadata` for proposal details.
3. Voting process:
    1. Users on spoke chains vote through their respective `SpokeVoteAggregators`.
    2. `SpokeVoteAggregators` send aggregated votes to the `HubVotePool` via Wormhole.
    3. `HubVotePool` submits the aggregated votes to the `HubGovernor`.
4. Vote tallying and proposal execution:
    1. `HubGovernor` tallies votes from all chains.
    2. If a quorum is reached and there are more for votes than against votes, the vote passes and is queued for execution.
    3. After the timelock delay, the proposal can be executed on the hub chain.
    4. For cross-chain actions, a proposal should call the `dispatch` method in the `HubMessageDispatcher`, which sends execution messages to the relevant spoke chains.
    5. `SpokeMessageExecutors` on each spoke chain receive and execute the approved actions through their respective `SpokeAirlocks`.

### Solana Governance Workflow

The Solana-based MultiGov workflow follows these steps:

1. Proposal creation:
    1. A user creates a proposal on `HubGovernor` by calling the `propose` method, provided they meet the proposal threshold.
    2. For the proposal to be executed on the Solana blockchain, a `SolanaPayload` must be generated and included in the `calldata` parameter of the `propose` function.
    3. The `SolanaPayload` contains encoded details specifying which instructions will be executed and which Solana program is responsible for execution.

2. Proposal metadata distribution:
    1. A user queries `getProposalMetadata` from `HubProposalMetadata` via the Wormhole query system to create a proposal on the **Spoke Solana Chain Staking Program**.
    2. The retrieved metadata is used in the `AddProposal` instruction in the Solana program.
    3. The proposal data is verified to ensure it matches the expected format.
    4. Guardian signatures are posted using the `PostSignatures` instruction.
    5. Once validated, the proposal is stored on-chain.

3. Voting process:
    1. Users vote on proposals stored in the `ProposalData` account on Solana.
    2. The `CastVote` instruction records their choice (`for_votes`, `against_votes`, or `abstain_votes`).
    3. Eligibility and vote weight are verified using historical voter checkpoint data.
    4. A **Query Wormhole** request retrieves vote data from a Solana PDA.
    5. The signed response from Wormhole guardians is submitted to the `HubVotePool` on Ethereum for verification.
    6. The `crossChainVote` function in `HubVotePool` processes the validated response and forwards the aggregated vote data to the `HubGovernor` to finalize the decision.

4. Vote tallying and proposal execution:
    1. `HubGovernor` tallies votes from all chains.
    2. If a quorum is reached with more **for votes** than **against votes**, the proposal passes and is queued for execution.
    3. After the timelock delay, the proposal can be executed either on the hub chain or another chain.
    4. For cross-chain execution involving Solana, the proposal calls the `dispatch` method in `HubSolanaMessageDispatcher`, which sends execution messages to Solana.
    5. On Solana, the `ReceiveMessage` instruction processes the approved message, and the `SpokeAirlock` executes the corresponding instructions.

## Cross-Chain Communication

MultiGov relies on Wormhole's infrastructure for all cross-chain messaging, ensuring secure and reliable communication between chains. Wormhole's cross-chain state read system, known as Queries, is used for vote aggregation and proposal metadata. Additionally, cross-chain proposal execution messages are transmitted through Wormhole's custom relaying system, enabling seamless coordination across multiple blockchain networks.

## Security Measures

- **Vote weight window**: Implements a moving window for vote weight checkpoints to mitigate cross-chain double voting.
    - **Proposal extension**: `HubProposalExtender` allows for extending voting periods by a trusted actor in the case of network issues or high-stakes decisions.
- **Timelock**: A timelock period between proposal approval and execution allows for additional security checks and community review.
- **Wormhole verification**: All cross-chain messages are verified using Wormhole's secure messaging protocol.

## Detailed Architecture Diagram

This architecture ensures that MultiGov can operate securely and efficiently across multiple chains, allowing for truly decentralized and cross-chain governance while maintaining a unified decision-making process.

<!-- add diagram broken down in sections -->
![detailed multigov architecture diagram](/docs/images/products/multigov/concepts/architecture/architecture-2.webp)
