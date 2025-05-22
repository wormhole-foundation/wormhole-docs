---
title: Native Token Transfers Overview
description: With Native Token Transfers, you can directly transfer a blockchain's native assets across various connected networks.
categories: NTT, Transfer
---

## Native Token Transfers Overview

Native Token Transfers (NTT) provides an adaptable framework for transferring your native tokens across different blockchains. Unlike traditional wrapped assets, NTT maintains your token's native properties on every chain. This ensures you retain complete control over crucial aspects like metadata, ownership, upgradeability, and custom features.

## Key Features

- **Supply control** – enforced mint-and-burn model maintains global supply integrity
- **Customizable controls** – configure rate limits, access control, and attestation thresholds
- **No liquidity pools** - transfer tokens without the need for liquidity pools, avoiding fees, slippage, and MEV risk
- **Integrator flexibility** - retained ownership, upgrade authority, and complete customizability over token contracts
- **Advanced rate limiting** - inbound and outbound rate limits are configurable per chain and over arbitrary periods, preventing abuse while managing network congestion and allowing for controlled deployments 
- **Global accountant** - ensures accounting integrity across chains by checking that the number of tokens burned and transferred out of a chain never exceeds the number of tokens minted
- **Custom attestation** - optionally add external verifiers and configure custom message attestation thresholds
- **Access control** - to prevent unauthorized calls to administrative functions, protocols can choose to assign specific functions to a separate address from the owner


## Deployment Models

NTT offers two operational modes for your existing tokens: 

- **[Burn-and-mint](todo)** -  locks tokens on a central "hub" chain and mints equivalents on "spoke" chains, maintaining the total supply on the hub. It's ideal for integrating existing tokens onto new blockchains without altering their original contracts.

- **[Hub-and-spoke](todo)** - burns tokens on the source chain and mints new ones on the destination, distributing the total supply across multiple chains. It's best suited for new token deployments or projects willing to upgrade existing contracts for a truly native multichain token.

## Supported Token Models

Wormhole's NTT primarily supports ERC-20 tokens. These are the most common type of tokens that are identical and interchangeable and can be found on Ethereum and other EVM-compatible chains.

NTT Managers are crucial for Native Token Transfers (NTT) within Wormhole, overseeing the entire cross-chain token movement process. They manage rate limits and verify message attestations, preventing abuse and ensuring secure transfers. By locking or burning tokens on the source chain before minting or unlocking them on the destination, Managers guarantee consistent token supply and integrity across all connected blockchains

The NttManager uses standard tools like the IERC-20 interface, which acts as a blueprint for ERC-20 tokens and OpenZeppelin's SafeERC-20 library to manage transfers. NTT also supports ERC-20 Burnable tokens, which can be permanently removed from circulation, crucial for NTT's token burning process.

Currently, NTT doesn't natively support ERC-721, which are unique, non-fungible tokens, or ERC-1155, a standard for managing multiple token types. In short, NTT is designed for seamless, secure transfers of interchangeable digital assets across compatible blockchains.

## How it Works

Here's a breakdown of the key steps involved when a native token is transferred across blockchains using NTT:

1. **Prepare Token and Mode** - Ready your ERC-20 or SPL token, then decide on a "Burn-and-Mint" or "Hub-and-Spoke" deployment model to manage token minting
2. **Choose Method** - Select the NTT Launchpad for a UI-driven EVM-only experience, or the NTT CLI for command-line control supporting both EVM and Solana
3. **Configure Initial Settings** - Identify target blockchains, provide essential token details (name, symbol, initial supply if new), and set up your environment if using the CLI
4. **Execute Deployment** - Initiate the deployment of NTT Manager contracts (and your token if new) to all chosen blockchains, confirming transactions and covering gas fees
5. **Post-Deployment Configuration** - Grant minting authority to NTT Managers (if applicable), configure rate limits, define security thresholds for transceivers, establish peer relationships between Managers, and assign administrative roles
6. **Monitor & Maintain** - Verify deployment status, continuously monitor total token supply across chains with the Global Accountant, and adjust settings like limits and roles as needed

## Use Cases 

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/) – transmits native assets across chains
    - [**Wormhole Connect**](/docs/products/connect/overview/) – manages user-friendly asset transfers
    - [**Queries**](/docs/products/queries/overview/) – acquires real-time prices for optimal trade execution

- **Borrowing and Lending Across Chains**

    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/) – moves collateral as native assets
    - [**Messaging**](/docs/products/messaging/overview/) – propagates loan requests and liquidations across chains
    - [**Queries**](/docs/products/queries/overview/) – retrieves  interest rates and asset prices in real-time

- **Gas Abstraction**

    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/) – facilitates native token conversion for gas payments
    - [**Messaging**](/docs/products/messaging/overview/) – sends gas fee payments across chains

- **Cross-Chain Payment Widgets**

    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/) – ensures direct, native asset transfers
    - [**Wormhole Connect**](/docs/products/connect/overview/) – facilitates seamless payments in various tokens

- **Cross-Chain Staking**

    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/) – transfers staked assets natively between networks
    - [**Messaging**](/docs/products/messaging/overview/) – moves staking rewards and governance signals across chains

## Next Steps

Follow these steps to get started with NTT:

[timeline(wormhole-docs/.snippets/text/products/reference/ntt/overview/ntt-timeline.json)]