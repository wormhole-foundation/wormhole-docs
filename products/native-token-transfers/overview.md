---
title: Wormhole NTT
description: With Wormhole NTT, you can directly transfer a blockchain's native assets across various connected networks.
categories: NTT, Transfer
---

list todo:
Timeline
Key feature list
section on deployment models  : Maybe we should have a section on deployment models so we can easily link to it from other places if needed. Probably after the key features section
NNT vs token bridge comparison Remove

I don't know what the NttManager is

Wormhole NTT primarily supports ERC-20 tokens, the standard for fungible tokens on Ethereum and other EVM-compatible chains. The `NttManager` contract leverages the `IERC20` interface and OpenZeppelin's `SafeERC20` for secure and efficient transfers. It also supports **ERC-20 Burnable** tokens. Currently, NTT does not natively support other standards like ERC-721 or ERC-1155.

How it works section msissing 

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


## Integration Options

When deploying your token across chains, you have two primary options within the Wormhole ecosystem: Native Token Transfers (NTT) and the Token Bridge. Each offers a distinct integration path and feature set:

### Native Token Transfers Framework

* **Ideal Use Case:** DeFi governance tokens seeking fungible multichain liquidity and direct integration with governance processes across multiple chains
* **Mechanism:** supports a pure burn-and-mint model or a hybrid hub-and-spoke approach
* **Security:** highly configurable rate limiting, pausing, access controls, and threshold attestations
* **Contract Ownership:** retain full ownership and upgrade authority of your native token contracts on each chain
* **Token Contracts:** employs native token contracts owned by your protocol's governance
* **Integration:** offers a streamlined and highly customizable framework for sophisticated deployments
* **Examples:** explore the NTT framework in action through:

**Note:** For a deeper understanding of the underlying technology, explore the core messaging primitives within the Wormhole network: [Core Messaging](docs/build/core-messaging/).

## Supported Token Standards

Wormhole NTT primarily supports **ERC-20** tokens, the standard for fungible tokens on Ethereum and other EVM-compatible chains. The `NttManager` contract leverages the `IERC20` interface and OpenZeppelin's `SafeERC20` for secure and efficient transfers. It also supports **ERC-20 Burnable** tokens. Currently, NTT does not natively support other standards like ERC-721 or ERC-1155.

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


[timeline(wormhole-docs/.snippets/text/products/ntt/ntt-timeline.json)]