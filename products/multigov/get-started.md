---
title: Get Started with Multigov
description: Follow this guide to set up your environment and request access to deploy MultiGov contracts for multichain DAO governance using Wormhole messaging.
categories: Multigov
---

# Get Started with Multigov

## Introduction

[MultiGov](/docs/products/multigov/overview/){target=\_blank} enables multichain governance using Wormhole messaging. With MultiGov, token holders can create proposals, vote, and execute decisions from any supported chain, eliminating the need to bridge assets or rely on a single governance hub.

This guide prepares you to deploy MultiGov contracts by installing the required dependencies and setting up your local environment. Once ready, you can follow any of the supported chain-specific deployment guides to integrate MultiGov with your governance token.

## Prerequisites

Before deployment, ensure you have a governance token deployed on multiple chains (ERC-20 or SPL).

!!! note
     - On EVM chains, your governance token must implement the [`ERC20Votes`](https://docs.openzeppelin.com/contracts/4.x/governance#erc20votes){target=\_blank} standard and support `CLOCK_MODE` timestamps for compatibility with cross-chain voting
     - On Solana, SPL tokens are supported and work with the [MultiGov staking program](/docs/products/multigov/concepts/architecture/#spoke-solana-staking-program){target=\_blank}, which handles vote weight and eligibility on-chain

## Request Tally Access for MultiGov

MultiGov integrations are coordinated through [Tally](https://www.tally.xyz/explore){target=\_blank}, a multichain governance platform that powers proposal creation, voting, and execution.

To get started, fill out the integration [intake form](https://www.tally.xyz/get-started){target=\_blank}. The Tally team will review your application and reach out to align on deployment and setup requirements.

Once approved, continue to the deployment guides to integrate MultiGov with your governance token on EVM chains, Solana, or other supported networks.

## Next Steps

You've now completed the initial setup and requested access through Tally. Continue to the deployment guide that matches your governance architecture:

 - [**Deploy on EVM Chains**](/docs/products/multigov/guides/deploy-to-evm){target=\_blank} – configure and deploy MultiGov smart contracts to EVM-compatible chains
 - [**Deploy on Solana**](/docs/products/multigov/guides/deploy-to-solana){target=\_blank} – launch the Solana staking program and configure spoke chain participation
