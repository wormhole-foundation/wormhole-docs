---
title: MultiGov FAQs
description: Find answers to common questions about MultiGov, covering cross-chain governance, technical setup, security, proposal creation, and more.
categories: MultiGov
---

# FAQs

## What is MultiGov?

MultiGov is a cross-chain governance system that extends traditional DAO governance across multiple blockchain networks. It leverages Wormhole's interoperability infrastructure for seamless voting and proposal mechanisms across various chains.

## How does MultiGov ensure security in cross-chain communication?

MultiGov leverages Wormhole's robust cross-chain communication protocol. It implements several security measures:

- Message origin verification to prevent unauthorized governance actions
- Timely and consistent data checks to ensure vote aggregation is based on recent and synchronized chain states
- Authorized participant validation to maintain the integrity of the governance process
- Replay attack prevention by tracking executed messages

## Can MultiGov integrate with any blockchain?

MultiGov can potentially integrate with any blockchain supported by Wormhole. However, specific implementations may vary depending on the chain's compatibility with the Ethereum Virtual Machine (EVM) and its smart contract capabilities. [See the full list of supported networks](/docs/products/reference/supported-networks/#multigov). The current implementation of MultiGov supports an EVM hub and both the EVM and SVM for spokes.

## How are votes aggregated across different chains?

Votes are collected on each spoke chain using each chain's `SpokeVoteAggregator`. These votes are then transmitted to the HubVotePool on the hub chain for aggregation and tabulation. The `HubEvmSpokeVoteDecoder` standardizes votes from different EVM chains to ensure consistent processing.

## Can governance upgrade from a single chain to MultiGov?

Yes! MultiGov can support progressively upgrading from a single-chain governance to MultiGov. Moving to MultiGov requires upgrading the token to NTT and adding Flexible Voting to the original Governor.

## How can I create a proposal in MultiGov?

Proposals are created on the hub chain using the `HubEvmSpokeAggregateProposer` contract or by calling `propose` on the `HubGovernor`. You need to prepare the proposal details, including targets, values, and calldatas. The proposer's voting weight is aggregated across chains using Wormhole queries to determine eligibility.

## How do I vote on a proposal if I hold tokens on a spoke chain?

You can vote on proposals via the `SpokeVoteAggregator` contract on the respective spoke chain where you hold your tokens. The votes are then automatically forwarded to the hub chain for aggregation.

## How are approved proposals executed across multiple chains?

When a proposal is approved and the timelock period elapses, it's first executed on the hub chain. A proposal can include a cross-chain message by including a call to `dispatch` on the `HubMessageDispatcher`, which sends a message to the relevant spoke chains. On each spoke chain, the `SpokeMessageExecutor` receives, verifies, and automatically executes the instructions using the `SpokeAirlock` as the `msg.sender`.

## What are the requirements for using MultiGov?

To use MultiGov, your DAO must meet the following requirements:

- **ERC20Votes token** - your DAO's token must implement the `ERC20Votes` standard and support `CLOCK_MODE` timestamps for compatibility with cross-chain governance
- **Flexible voting support** - your DAO's Governor must support Flexible Voting to function as the Hub Governor. If your existing Governor does not support Flexible Voting, you can upgrade it to enable this feature

## What do I need to set up MultiGov for my project?

Get started by filling out the form below:

https://www.tally.xyz/get-started

Tally will reach out to help get your DAO set up with MultiGov.

To set up testing MultiGov for your DAO, you'll need:

- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} and [Git](https://git-scm.com/downloads){target=\_blank} installed
- Test ETH on the testnets you plan to use (e.g., Sepolia for hub, Optimism Sepolia for spoke)
- Modify and deploy the hub and spoke contracts using the provided scripts
- Set up the necessary environment variables and configurations

## Can MultiGov be used with non-EVM chains?

The current implementation is designed for EVM-compatible chains. However, Solana (non-EVM) voting is currently in development and expected to go live after the EVM contracts.

## How can I customize voting parameters in MultiGov?

Voting parameters such as voting delay, voting period, proposal threshold, and quorum (and others) can be customized in the deployment scripts (`DeployHubContractsSepolia.s.sol` and `DeploySpokeContractsOptimismSepolia.s.sol` as examples for their respective chains). Make sure to adjust these parameters according to your DAO's specific needs before deployment.

Remember to thoroughly test your MultiGov implementation on testnets before deploying to Mainnet, and have your contracts audited for additional security.

## How does MultiGov handle potential network issues or temporary chain unavailability?

MultiGov includes several mechanisms to handle network issues or temporary chain unavailability:

1. **Asynchronous vote aggregation** - votes are aggregated periodically, allowing the system to continue functioning even if one chain is temporarily unavailable
2. **Proposal extension** - the `HubGovernorProposalExtender` allows trusted actors to extend voting periods if needed, which can help mitigate issues caused by temporary network problems
3. **Wormhole retry mechanism** - Wormhole's infrastructure includes retry mechanisms for failed message deliveries, helping ensure cross-chain messages eventually get through
4. **Decentralized relayer network** - Wormhole's decentralized network of relayers helps maintain system availability even if some relayers are offline

However, prolonged outages on the hub chain or critical spoke chains could potentially disrupt governance activities. Projects should have contingency plans for such scenarios.

## How does MultiGov differ from traditional DAO governance?

Unlike traditional DAO governance, which typically operates on a single blockchain, MultiGov allows for coordinated decision-making and proposal execution across multiple chains. This enables more inclusive participation from token holders on different networks and more complex, cross-chain governance actions.

## What are the main components of MultiGov?

The main components of MultiGov include:

- **Hub chain** - central coordination point for governance activities
- **Spoke chains** - additional chains where token holders can participate in governance
- **Wormhole integration** - enables secure cross-chain message passing
- **Governance token** - allows holders to participate in governance across all integrated chains
