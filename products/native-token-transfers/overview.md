---
title: Wormhole NTT
description: With Wormhole NTT, you can directly transfer a blockchain's native assets across various connected networks.
categories: NTT, Transfer
---

list todo:
section on deployment models  : Make links for deployment section
Use cases reformat

## Introduction

Wormhole's Native Token Transfers (NTT) provides an open-source, adaptable framework for transferring your tokens across different blockchains. Unlike traditional wrapped assets, NTT maintains the native properties of your token on every chain. This ensures you retain complete control over crucial aspects like metadata, ownership, upgradeability, and custom features.

## Key Features

- **No wrapped assets** – tokens retain their native format on each chain
- **Canonical deployments** – one unified token identity across chain
- **Supply control** – enforced mint-and-burn model maintains global supply integrity
- **Composable** – open-source and extensible for widespread adoption and integration with other protocols
- **Customizable controls** – configure rate limits, access control, and attestation thresholds

## Deployment Models

NTT offers two operational modes for your existing tokens: (add links)

- **Locking Mode:** - preserves the original token supply on a single, designated chain
- **Burning Mode:** - enables the deployment of truly multichain tokens with the total supply distributed across various connected chains

## How it Works


## Integration Options

When deploying your token across chains, you have two primary options within the Wormhole ecosystem: Native Token Transfers (NTT) and the Token Bridge. Each offers a distinct integration path and feature set:

### Native Token Transfers Framework

* **Ideal Use Case:** DeFi governance tokens seeking fungible multichain liquidity and direct integration with governance processes across multiple chains
* **Mechanism:** supports a pure burn-and-mint model or a hybrid hub-and-spoke approach
* **Security:** highly configurable rate limiting, pausing, access controls, and threshold attestations
* **Contract Ownership:** retain full ownership and upgrade authority of your native token contracts on each chain
* **Token Contracts:** employs native token contracts owned by your protocol's governance
* **Integration:** offers a streamlined and highly customizable framework for sophisticated deployments

**Note:** For a deeper understanding of the underlying technology, explore the core messaging primitives within the Wormhole network: [Core Messaging](docs/build/core-messaging/).

## Use Cases 

**Cross-Chain Swaps and Liquidity Aggregation**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – moves native assets across chains
    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – handles user-friendly asset transfers
    - [**Queries**](/docs/build/queries/overview/) – fetches real-time prices for optimal trade execution

**Borrowing and Lending Across Chains**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – transfers collateral as native assets
    - [**Messaging**](/docs/learn/infrastructure/) – moves loan requests and liquidations across chains
    - [**Queries**](/docs/build/queries/overview/) – fetches interest rates and asset prices in real-time

**Asset Movement Between Bitcoin and Other Chains**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – transfers BTC across chains

**Memecoin Launchpad**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – enables native asset transfers for seamless fundraising
    - [**Messaging**](/docs/learn/infrastructure/) – facilitates cross-chain token distribution and claim processes

**Gas Abstraction**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – facilitates native token conversion for gas payments
    - [**Messaging**](/docs/learn/infrastructure/) – routes gas fee payments across chains

**Cross-Chain Payment Widgets**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – ensures direct, native asset transfers
    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – facilitates seamless payments in various tokens

**Cross-Chain Staking**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – transfers staked assets natively between networks
    - [**Messaging**](/docs/learn/infrastructure/) – moves staking rewards and governance signals across chains

## Next Steps

Follow these steps to get started with NTT:

**- Asset Movement Between Bitcoin and Other Chains**
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – specifically designed to handle the transfer of native assets like BTC across chains

**- Cross-Chain Payment Widgets**
    - [**Wormhole Connect**](docs/build/transfers/connect/overview/){target=\_blank} – facilitates seamless payments in various tokens
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – ensures direct, native asset transfers

**- Cross-Chain Staking**
    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – moves staking rewards and governance signals across chains
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – transfers staked assets natively between networks


[timeline(wormhole-docs/.snippets/text/products/ntt/overview/ntt-timeline.json)]