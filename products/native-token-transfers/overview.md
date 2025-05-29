---
title: Native Token Transfers Overview
description: With Native Token Transfers, you can directly transfer a blockchain's native assets across various connected networks.
categories: NTT, Transfer
---

## Native Token Transfers Overview

Native Token Transfers (NTT) provides an adaptable framework for transferring your native tokens across different blockchains. Unlike traditional wrapped assets, NTT maintains your token's native properties on every chain. This ensures you retain complete control over crucial aspects like metadata, ownership, upgradeability, and custom features.

## Key Features

- **Control and customizatoin** - ensure ownership and configurable access controls, permissions, and thresholds, preventing unauthorized calls
- **Advanced rate limiting** - set rate limits per chain and period to prevent abuse, manage network congestion, and control deployments
- **Global accountant** - ensures the amount burned and transferred on chains never exceeds the amount of tokens minted
- **No wrapped tokens** - tokens are used directly within their native ecosystem, eliminating intermediary transfer steps


## Deployment Models

NTT offers two operational modes for your existing tokens: 

- **Hub-and-spoke** - locks tokens on a central "hub" chain and mints equivalents on "spoke" chains, maintaining the total supply on the hub. It's ideal for integrating existing tokens onto new blockchains without altering their original contracts
- **Burn-and-mint** - burns tokens on the source chain and mints new ones on the destination, distributing the total supply across multiple chains. It's best suited for new token deployments or projects willing to upgrade existing contracts for a truly native multichain token

## Supported Token Models

NTT supports ERC-20 tokens—the standard for fungible assets on Ethereum and other EVM-compatible chains—including ERC-20 Burnable tokens, which can be burned on the source chain during cross-chain transfers when required. It also supports fungible SPL tokens on Solana for secure cross-chain transfers.

The NTT Manager is a contract that oversees the secure and reliable transfer of native tokens across supported blockchains. It leverages the standard IERC20 interface and OpenZeppelin’s SafeERC20 library to interact with these tokens securely across chains.

However, NTT does not natively support non-fungible token standards at this time, whether they are SPL-based like Metaplex NFTs or ERC-based such as ERC-721 and ERC-1155.

## Deployment Process

Here's a breakdown of the key steps involved when deploying NTT:

- **Prepare tokens** - ensure your ERC-20 or SPL tokens are ready
- **Choose deployment model** - choose your cross-chain token model: either burn-and-mint or hub-and-spoke
- **Choose deployment tool** - use the [NTT Launchpad](https://ntt.wormhole.com/){target=\_blank} (for EVM chains only) or the [NTT CLI](/docs/products/native-token-transfers/reference/cli-commands/){target=\_blank}
- **Initialization** - specify target chains, token details, and set up your CLI environment if using it
- **Deploy contracts** - deploy NTT Manager contracts to all selected chains, confirming transactions and covering gas fees
- **Finalize configurations** - grant minting authority, configure rate limits, establish peer manager connections, and assign administrative roles
- **Monitor and maintain** - verify deployment, monitor total supply with the [Global Accountant](/docs/products/native-token-transfers/concepts/security/#global-accountant){target=\_blank}, and adjust configurations as needed

## Use Cases 

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/) – transmits native assets across chains
    - [**Connect**](/docs/products/connect/overview/) – manages user-friendly asset transfers
    - [**Queries**](/docs/products/queries/overview/) – acquires real-time prices for optimal trade execution

- **Borrowing and Lending Across Chains**

    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/) – moves collateral as native assets
    - [**Messaging**](/docs/products/messaging/overview/) – propagates loan requests and liquidations across chains
    - [**Queries**](/docs/products/queries/overview/) – retrieves  interest rates and asset prices in real-time

- **Gas Abstraction**

    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/) – facilitates native token conversion for gas payments
    - [**Messaging**](/docs/products/messaging/overview/) – sends gas fee payments across chains

- **Cross-Chain Payment Widgets**

    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/) – ensures direct, native asset transfers
    - [**Connect**](/docs/products/connect/overview/) – facilitates seamless payments in various tokens

- **Cross-Chain Staking**

    - [**Native Token Transfers**](/docs/products/native-token-transfers/get-started/) – transfers staked assets natively between networks
    - [**Messaging**](/docs/products/messaging/overview/) – moves staking rewards and governance signals across chains

## Next Steps

Follow these steps to get started with NTT:

[timeline(wormhole-docs/.snippets/text/products/reference/ntt/overview/ntt-timeline.json)]