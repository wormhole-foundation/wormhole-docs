---
title: Get Started with Multigov
description: Follow this guide to set up your environment and request access to deploy MultiGov contracts for multichain DAO governance using Wormhole messaging.
categories: Multigov
---

# Get Started with Multigov

## Introduction

MultiGov enables multichain governance using Wormhole messaging. With MultiGov, token holders can create proposals, vote, and execute decisions from any supported chain, eliminating the need to bridge assets or rely on a single governance hub.

This guide prepares you to deploy MultiGov contracts by installing the required dependencies and setting up your local environment. Once ready, you can follow any of the supported chain-specific deployment guides to integrate MultiGov with your governance token.

## Prerequisites

Before deployment, make sure you have the following:

 - A governance token deployed on multiple chains (ERC-20 or SPL)
 - Applied to and been approved by the Tally intake process

## Request Tally Access for MultiGov

MultiGov integrations are coordinated through [Tally](https://www.tally.xyz/explore){target=\_blank}, a multichain governance platform that powers proposal creation, voting, and execution.

To get started, fill out the integration [intake form](https://www.tally.xyz/get-started){target=\_blank}. The Tally team will review your application and reach out to align on deployment and setup requirements.

Once approved, proceed to the deployment guide for your preferred chain, EVM, or Solana.

## Clone the MultiGov Repository

To begin working with MultiGov contracts, clone the official repository and navigate into the project directory:

```bash
git clone https://github.com/wormhole-foundation/multigov.git
cd multigov
```

This repository contains the contracts and configuration needed for EVM and Solana-based deployments.

## Next Steps

You have now set up your environment and cloned the MultiGov repository. Continue to the deployment guide that matches your governance architecture:

 - [Deploy on EVM Chains](/docs/products/multigov/guides/deploy-to-evm){target=\_blank} – configure and deploy MultiGov smart contracts to EVM-compatible chains
 - [Deploy on Solana](/docs/products/multigov/guides/deploy-to-solana){target=\_blank} – launch the Solana staking program and configure spoke chain participation
