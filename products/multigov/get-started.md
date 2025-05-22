---
title: Get Started with Multigov
description: Follow this guide to set up your environment and request access to deploy MultiGov contracts for multichain DAO governance using Wormhole messaging.
categories: MultiGov
---

# Get Started with Multigov

## Introduction

[MultiGov](/docs/products/multigov/overview/){target=\_blank} enables multichain governance using Wormhole messaging. With MultiGov, token holders can create proposals, vote, and execute decisions from any supported chain, eliminating the need to bridge assets or rely on a single governance hub.

This page walks you through the MultiGov deployment flow—from requesting access with Tally to choosing a network and following the appropriate deployment guide.

## Prerequisites

Before deploying MultiGov, you need a governance token deployed on multiple chains (ERC-20 or SPL):

- **EVM chains**:
     - Your token must implement the [`ERC20Votes`](https://docs.openzeppelin.com/contracts/4.x/governance#erc20votes){target=\_blank} standard
     - It must support `CLOCK_MODE` timestamps for compatibility with cross-chain voting

- **Solana**:
     - Use an SPL token
     - Voting eligibility and weight are managed by the [MultiGov staking program](/docs/products/multigov/concepts/architecture/#spoke-solana-staking-program){target=\_blank}

## Request Tally Access

MultiGov integrations are coordinated through [Tally](https://www.tally.xyz/explore){target=\_blank}, a multichain governance platform that powers proposal creation, voting, and execution.

To get started, fill out the integration [intake form](https://www.tally.xyz/get-started){target=\_blank}. The Tally team will review your application and contact you to discuss deployment and setup requirements.

Once approved, review the deployment flow below to understand the integration process. Then, follow the appropriate deployment guide to integrate MultiGov with your governance token on EVM chains, Solana, or other supported networks.

## Deployment Flow

MultiGov deployments follow a similar structure on both EVM and Solana. This section provides a high-level overview of the end-to-end flow. Each step is explained in more detail in the platform-specific deployment guides linked [below](#next-steps).

[timeline(wormhole-docs/.snippets/text/products/multigov/deployment-flow-timeline.json)]

## Next Steps

You've now completed the initial setup and requested access through Tally. Continue to the deployment guide that matches your governance architecture:

 - [**Deploy on EVM Chains**](/docs/products/multigov/guides/deploy-to-evm){target=\_blank} – configure and deploy MultiGov smart contracts to EVM-compatible chains
 - [**Deploy on Solana**](/docs/products/multigov/guides/deploy-to-solana){target=\_blank} – launch the Solana staking program and configure spoke chain participation
