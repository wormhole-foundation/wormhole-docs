---
title: Deploy MultiGov on EVM Chains
description: Set up and deploy MultiGov to EVM locally with step-by-step instructions for configuring, compiling, and deploying smart contracts across chains.
categories: MultiGov
---

# Deploy MultiGov on EVM Chains

This guide provodes instructions to set up and deploy the MultiGov governance system locally. Before diving into the technical deployment, ensure that MultiGov is the right fit for your project’s governance needs by following the steps for the [integration process](/docs/products/multigov/get-started/){target=\_blank}.

Once your project is approved through the intake process and you’ve collaborated with the Tally team to tailor MultiGov to your requirements, use this guide to configure, compile, and deploy the necessary smart contracts across your desired blockchain networks. This deployment will enable decentralized governance across your hub and spoke chains.

## Prerequisites 

To interact with MultiGov, you'll need the following:

- Install [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank}
- Install [Git](https://git-scm.com/downloads){target=\_blank}
- Clone the repository:
   ```bash
   git clone https://github.com/wormhole-foundation/multigov
   cd evm # for evm testing/deploying
   ```

## Development Setup

For developers looking to set up a local MultiGov environment:

1. Install dependencies:
   ```bash
   forge install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your specific [configuration](#configuration){target=\_blank}

3. Compile contracts:
   ```bash
   forge build
   ```

4. Deploy contracts (example for Sepolia testnet): <!-- would be nice to cover the contracts before the deployment step -->

    For hub chains:
    ```bash
    forge script script/DeployHubContractsSepolia.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
    ```

    For spoke chains (e.g., Optimism Sepolia):
    ```bash
    forge script script/DeploySpokeContractsOptimismSepolia.s.sol --rpc-url $OPTIMISM_SEPOLIA_RPC_URL --broadcast
    ```

## Configuration

When deploying MultiGov, several key parameters need to be set. Here are the most important configuration points:

### Hub Governor Key Parameters

- `initialVotingDelay` ++"uint256"++ - the delay measured in seconds before voting on a proposal begins. For example, `86400` is one day
- `initialProposalThreshold`  ++"uint256"++ - the number of tokens needed to create a proposal
- `initialQuorum` ++"uint256"++ - the minimum number of votes needed for a proposal to be successful
- `initialVoteWeightWindow` ++"uint256"++ - a window where the minimum checkpointed voting weight is taken for a given address. The window ends at the vote start for a proposal and begins at the vote start minus the vote weight window. The voting window is measured in seconds, e.g., `86400` is one day

    !!! note
        This helps mitigate cross-chain double voting.

### Hub Proposal Extender Key Parameters

- `extensionDuration` ++"uint256"++ - the amount of time, in seconds, for which target proposals will be extended. For example, `10800` is three hours
- `minimumExtensionDuration` ++"uint256"++ - lower time limit, in seconds, for extension duration. For example, `3600` is one hour

### Spoke Vote Aggregator Key Parameters

- `initialVoteWindow` ++"uint256"++ - the moving window in seconds for vote weight checkpoints. These checkpoints are taken whenever an address that is delegating sends or receives tokens. For example, `86400` is one day

    !!! note
        This is crucial for mitigating cross-chain double voting

### Hub Evm Spoke Vote Aggregator Key Parameters

- `maxQueryTimestampOffset` ++"uint256"++ - the max timestamp difference, in seconds, between the requested target time in the query and the current block time on the hub. For example, `1800` is 30 minutes

### Updateable Governance Parameters

The following key parameters can be updated through governance proposals:

- `votingDelay` - delay before voting starts (in seconds)
- `votingPeriod` - duration of the voting period (in seconds)
- `proposalThreshold` - threshold for creating proposals (in tokens)
- `quorum` - number of votes required for quorum
- `extensionDuration` - the amount of time for which target proposals will be extended (in seconds)
- `voteWeightWindow` - window for vote weight checkpoints (in seconds)
- `maxQueryTimestampOffset` - max timestamp difference allowed between a query's target time and the hub's block time

These parameters can be queried using their respective getter functions on the applicable contract.

To update these parameters, a governance proposal must be created, voted on, and executed through the standard MultiGov process.

