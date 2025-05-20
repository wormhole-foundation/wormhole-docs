---
title: Wormhole NTT
description: With Wormhole NTT, you can directly transfer a blockchain's native assets across various connected networks.
categories: NTT, Transfer
---

## Introduction

Wormhole's Native Token Transfers (NTT) provides an open-source, adaptable framework for transferring your tokens across different blockchains. Unlike traditional wrapped assets, NTT maintains the native properties of your token on every chain. This ensures you retain complete control over crucial aspects like metadata, ownership, upgradeability, and custom features.

## Key Features

- **No wrapped assets** – tokens retain their native format on each chain
- **Canonical deployments** – one unified token identity across chain
- **Supply control** – enforced mint-and-burn model maintains global supply integrity
- **Composable** – open-source and extensible for widespread adoption and integration with other protocols
- **Customizable controls** – configure rate limits, access control, and attestation thresholds

## Deployment Models

NTT offers two operational modes for your existing tokens: 

- **[Locking Mode](todo)** - preserves the original token supply on a single, designated chain
- **[Burning Mode](todo)** - enables the deployment of truly multichain tokens with the total supply distributed across various connected chains

## Supported Token Models

Wormhole's NTT primarily supports `ERC-20` tokens. These are the most common type of tokens that are identical and interchangeable. `ERC-20`s are found on Ethereum and other EVM-compatible chains.

The NTT system's `NttManager` contract is a special program that securely handles these tokens. It uses standard tools like the `IERC20` interface, which acts as a blueprint for ERC-20 tokens and OpenZeppelin's `SafeERC-20` library (for added security) to manage transfers. NTT also supports `ERC-20` Burnable tokens, which can be permanently removed from circulation, crucial for NTT's token burning process.

Currently, NTT doesn't natively support `ERC-721`, which are unique, non-fungible tokens, or `ERC-1155`, a standard for managing multiple token types. In short, NTT is designed for seamless, secure transfers of interchangeable digital assets across compatible blockchains.

## How it Works

Here's a breakdown of the key steps involved when a native token is transferred across blockchains using NTT:

1. **Initiate transfer** - a user triggers a request to move their native token from a source blockchain to a desired destination blockchain.
2. **Source chain action** - the token is either burned on the source chain (for distributed supply) or locked (for single-chain supply)
3. **Wormhole attestation** - Wormhole's Guardians observe and cryptographically attest to this token action on the source chain, generating a signed message (VAA)
4. **Message relaying** - the signed message containing the transfer details is relayed across the Wormhole network to the destination chain
5. **Destination chain action** - verified Wormhole message on the destination chain mints (if burned) or unlocks (if locked) the native token 
6. **Accounting integrity** - the Global Accountant continuously validates total supply across chains

### Native Token Transfer Framework

- **Mechanism** supports a pure burn-and-mint model or a hybrid hub-and-spoke approach
- **Security** highly configurable rate limiting, pausing, access controls, and threshold attestations
- **Contract ownership** retain full ownership and upgrade authority of your native token contracts on each chain
- **Token contracts** employs native token contracts owned by your protocol's governance
- **Integration** offers a streamlined and highly customizable framework for sophisticated deployments

_Note:_ For a deeper understanding of the underlying technology, explore the core messaging primitives within the Wormhole network: [Core Messaging](docs/build/core-messaging/).

## Use Cases 

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – transmits native assets across chains
    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – manages user-friendly asset transfers
    - [**Queries**](/docs/build/queries/overview/) – acquires real-time prices for optimal trade execution

- **Borrowing and Lending Across Chains**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – moves collateral as native assets
    - [**Messaging**](/docs/products/messaging/overview.md) – propagates loan requests and liquidations across chains
    - [**Queries**](/docs/build/queries/overview/) – retrieves  interest rates and asset prices in real-time

- **Gas Abstraction**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – facilitates native token conversion for gas payments
    - [**Messaging**](/docs/products/messaging/overview.md) – sends gas fee payments across chains

- **Cross-Chain Payment Widgets**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – ensures direct, native asset transfers
    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – facilitates seamless payments in various tokens

- **Cross-Chain Staking**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – transfers staked assets natively between networks
    - [**Messaging**](/docs/products/messaging/overview.md) – moves staking rewards and governance signals across chains

## Next Steps

Follow these steps to get started with NTT:

[timeline(wormhole-docs/.snippets/text/products/reference/ntt/overview/ntt-timeline.json)]