---
title: Wormhole Connect
description: Integrate the Wormhole Connect React widget into your web application for easy cross-chain asset transfers via Wormhole.
categories: Connect, Widget, UI, Transfer
description: With Wormhole Connect, you can seamlessly bridge digital assets and data across a wide range of supported blockchain networks.
categories: Connect, Transfer

---


Native Token Transfers (NTT) for Cross-Chain Token Deployment

Considering deploying Native Token Transfers (NTT)? Here's what you need to know:

## Introduction

Wormhole's Native Token Transfers (NTT) provides an open-source, adaptable framework for transferring your tokens across different blockchains. Unlike traditional wrapped assets, NTT maintains the native properties of your token on every chain. This ensures you retain complete control over crucial aspects like metadata, ownership, upgradeability, and custom features.

NTT offers two operational modes for your existing tokens:

* **Locking Mode:** Preserves the original token supply on a single, designated chain
* **Burning Mode:** Enables the deployment of truly multichain tokens with the total supply distributed across various connected chains

## Key Features

* **Native Tokens:** Eliminate wrapped assets. Your token remains the original on every chain, ensuring consistent properties and avoiding complexities
* **Unified User Experience:** Users interact with the same native token on every chain, guaranteeing seamless fungibility and a consistent experience
* **No Liquidity Pools:** Transfer tokens directly without the need for liquidity pools, reducing fees, slippage, and MEV risks
* **Integrator Control:** Maintain full ownership, upgrade authority, and customization options for your token contracts on each chain
* **Advanced Rate Limiting:** Configure inbound and outbound transfer limits per chain and across custom timeframes to prevent abuse and manage deployments
* **Global Accountant:** Ensures cross-chain accounting integrity by verifying that outflows (burns and transfers) never exceed inflows (mints)
* **Flexible Access Control:** Assign specific administrative functions (e.g., Pauser role) to designated addresses for enhanced security
* **Maximum Composability:** The open-source and extensible design facilitates broad adoption and integration with other protocols
* **Custom Attestation (Optional):** Integrate external verifiers and customize message attestation thresholds for added security

## Integration Options

When deploying your token across chains, you have two primary options within the Wormhole ecosystem: Native Token Transfers (NTT) and the Token Bridge. Each offers a distinct integration path and feature set:

### Native Token Transfers Framework

* **Ideal Use Case:** DeFi governance tokens seeking fungible multichain liquidity and direct integration with governance processes across multiple chains
* **Mechanism:** Supports a pure burn-and-mint model or a hybrid hub-and-spoke approach
* **Security:** Highly configurable rate limiting, pausing, access controls, and threshold attestations. 
* **Contract Ownership:** You retain full ownership and upgrade authority of your native token contracts on each chain
* **Token Contracts:** Employs native token contracts owned by your protocol's governance
* **Integration:** Offers a streamlined and highly customizable framework for sophisticated deployments
* **Examples:** Explore the NTT framework in action through:

### Token Bridge

* **Ideal Use Case:** Applications like Web3 games aiming to make their token tradable across multiple chains with a simpler integration
* **Mechanism:** Exclusively uses a lock-and-mint model; Unlike NTT, it issues a *wrapped* asset on the destination chain
* **Security:** Features preconfigured rate limiting and integrated Global Accountant
* **Contract Ownership:** The wrapped asset contract is owned and upgradeable by Wormhole Governance (via a 13/19 Guardian process)
* **Token Contracts:** Utilizes wrapped asset contracts managed by the Wormhole Token Bridge
* **Integration:** Provides a straightforward and permissionless method for multichain deployment

**Note:** For a deeper understanding of the underlying technology, explore the core messaging primitives within the Wormhole network: [Core Messaging](docs/build/core-messaging/).

## Supported Token Standards

Wormhole NTT primarily supports **ERC-20** tokens, the standard for fungible tokens on Ethereum and other EVM-compatible chains. The `NttManager` contract leverages the `IERC20` interface and OpenZeppelin's `SafeERC20` for secure and efficient transfers. It also supports **ERC-20 Burnable** tokens. Currently, NTT does not natively support other standards like ERC-721 or ERC-1155.


## Next Steps:

Now that you've explored the power and flexibility of Wormhole's Native Token Transfers (NTT), it's time to harness its potential for your project. Whether you're a developer building cross-chain applications, a founder envisioning a multichain token, or a DeFi architect designing innovative protocols, NTT offers the tools for seamless native asset movement. Take the next step by looking at these resources:

**- Asset Movement Between Bitcoin and Other Chains**
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – specifically designed to handle the transfer of native assets like BTC across chains

**- Cross-Chain Payment Widgets**
    - [**Wormhole Connect**](docs/build/transfers/connect/overview/){target=\_blank} – facilitates seamless payments in various tokens
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – ensures direct, native asset transfers

**- Cross-Chain Staking**
    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – moves staking rewards and governance signals across chains
    - [**Native Token Transfer**](docs/build/transfers/native-token-transfers/){target=\_blank} – transfers staked assets natively between networks

Experiment, build, and expand your reach across the multichain landscape with native tokens. The framework is ready—it's time to build with NTT.


[timeline(wormhole-docs/.snippets/text/products/multigov/multigov-timeline.json)]