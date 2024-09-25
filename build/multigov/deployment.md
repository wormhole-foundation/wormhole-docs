---
title: 
description:
---

# Deployment 

## Development Setup

For developers looking to set up a local MultiGov environment:

1. Install prerequisites:
    - [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank}
    - [Git](https://git-scm.com/downloads){target=\_blank}
   
2. Clone the repository:
   ```bash
   git clone [MultiGov Repository URL]
   cd evm # for evm testing/deploying
   ```

3. Install dependencies:
   ```bash
   forge install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your specific [configuration](/docs/build/multigov/deployment/#configuration){target=\_blank}

5. Compile contracts:
   ```bash
   forge build
   ```

6. Deploy contracts (example for Sepolia testnet):
   ```bash
   forge script script/DeployHubContractsSepolia.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
   ```

   For spoke chains (e.g., Optimism Sepolia):
   ```bash
   forge script script/DeploySpokeContractsOptimismSepolia.s.sol --rpc-url $OPTIMISM_SEPOLIA_RPC_URL --broadcast
   ```

## Configuration

When deploying MultiGov, several key parameters need to be set. Here are the most important configuration points:

### `HubGovernor` Key Parameters

1. `initialVotingDelay` - the delay before voting on a proposal begins
    - Type: `uint256`
    - Measured in: Seconds
    - Example: `86400` (1 day)

2. `initialProposalThreshold` - the number of tokens needed to create a proposal
    - Type: `uint256`
    - Measured in: Tokens

3. `initialQuorum` - the number minimum number of votes needed for a proposal to be successful
    - Type: `uint256`
    - Measured in: Votes

4. `initialVoteWeightWindow` - a window where the minimum checkpointed voting weight is taken for a given address. The window ends at the vote start for a proposal and begins at the vote start minus the vote weight window
    - Type: `uint256`
    - Measured in: Seconds
    - Example: `86400` (1 day)
    !!! note
        This helps mitigate cross-chain double voting.

### `HubProposalExtender` Key Parameters

1. `extensionDuration` - amount of time for which target proposals will be extended
    - Type: `uint256`
    - Measured in: Seconds
    - Example: `10800` (3 hours)

2. `minimumExtensionDuration` - lower limit for extension duration
    - Type: `uint256`
    - Measured in: Seconds
    - Example: `3600` (1 hour)

#### `SpokeVoteAggregator` Key Parameters

1. `initialVoteWindow` - the moving window for vote weight checkpoints. These checkpoints are taken whenever an address that is delegting sends or receives tokens
    - Type: `uint256`
    - Measured in: Seconds
    - Example: `86400` (1 day)
    !!! note
        This is crucial for mitigating cross-chain double voting

### `HubEvmSpokeVoteAggregator` Key Parameters
1. `maxQueryTimestampOffset` - the max timestamp difference between the requested target time in the query and the current block time on the hub
    - Type: `uint256`
    - Measure in: Seconds
    - Example: `1800` (30 minutes)

### Updateable Governance Parameters

The following key parameters can be updated through governance proposals:

1. `votingDelay` - delay before voting starts (in seconds)
2. `votingPeriod` - duration of the voting period (in seconds)
3. `proposalThreshold` - threshold for creating proposals (in tokens)
4. `quorum` - number of votes required for quorum
5. `extensionDuration` - the amount of time for which target proposals will be extended (in seconds)
6. `voteWeightWindow` - window for vote weight checkpoints (in seconds)
7. `maxQueryTimestampOffset` - max timestamp difference allowed between a query's target time and the hub's block time

These parameters can be queried using their respective getter functions on the applicable contract.

To update these parameters, a governance proposal must be created, voted on, and executed through the standard MultiGov process.

