---
title: Token Bridge Overview
description: With Wormhole Token Bridge, you can enable secure, cross-chain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Token Bridge, Transfer, Core Concepts
---


# Token Bridge Overview

The Wormhole Token Bridge is a decentralized protocol for transferring tokens across Ethereum, Solana, BNB Chain, and more blockchains. It enables secure, efficient, and composable cross-chain token movement without relying on centralized exchanges, wrapped token custodians, or liquidity pools.

Using a lock-and-mint architecture, the Token Bridge preserves token properties across chains, such as symbol, name, and precision. It also supports advanced features like Token Transfers with Messages, enabling smart contract interactions on the destination chain.

This overview introduces Wormhole's Token Bridge's core design, flow, and functionality and guides you through implementation.

## Key Features

The Token Bridge is built to solve common problems in cross-chain token movement—loss of precision, fragmented liquidity, and slow settlement—by offering a trust-minimized and scalable alternative. It includes:

**Universal Interoperability** - Transfer standards-compliant tokens (e.g., ERC-20, SPL) across 30 supported chains
**Wrapped Asset Model** - Mint-wrapped tokens backed 1:1 by locked or burned assets on the source chain
**Preserved Metadata** - Ensure that attributes like name, symbol, and decimals persist across chains
**Transfer With Payload** - Attach arbitrary data to token transfers, enabling downstream smart contract calls
**Decentralized Security** - Verified by the Wormhole Guardian network, ensuring cross-chain consistency and message authenticity

## How It Works

By handling token movement in a decentralized, permissionless, and metadata-aware way, the Wormhole Token Bridge provides a reliable foundation for cross-chain interoperability at scale.

In short, the Token Bridge transfer process follows these key steps:

1.  **Attestation** - The token’s metadata (e.g., symbol, name, decimals) is registered on the destination chain. This step is only required once per token
2.  **Lock or Burn** - To ensure one-to-one backing, the original token is either locked (on EVM chains) or burned (on chains like Solana)
3.  **Message Emission** - The decentralized Guardian network generates and cryptographically signs a transfer message
4.  **Verification** - The signed message is submitted and verified on the destination chain to confirm authenticity
5.  **Mint or Release** - A wrapped version of the token is minted (or the native token is released) to the recipient on the destination chain

## Use Cases

The Wormhole Token Bridge enables seamless and efficient transfer of digital assets across different blockchains. Here are key use cases that highlight the power and versatility of the Token Bridge.

- **Cross-Chain Swaps and Liquidity Aggregation**
    - [**Wormhole Connect**](/docs/products/connect/get-started/){target=\_blank} – provides a user-friendly interface for cross-chain asset transfers
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – allows the movement of native tokens across connected chains
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – can be used to fetch real-time pricing data to optimize swap execution

- **Borrowing and Lending Across Chains** (e.g., [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank})
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – coordinates loan requests, repayments, and liquidation events across chains
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – enables the transfer of collateral assets between chains
    - [**Queries**](/docs/products/queries/get-started/){target=\_blank} – can fetch interest rates and collateral asset prices from different chains

- **Native Bitcoin (BTC) Transfers to Other Chains**
    - [**Native Token Transfer**](/docs/products/native-token-transfers/get-started/){target=\_blank} – specifically designed to handle the transfer of native assets like BTC across chains

- **Cross-Chain Rewards and Token Utility in Decentralized Platforms** (e.g., [Chingari](https://chingari.io/){target=\_blank})
    - [**Token Bridge**](/docs/products/token-bridge/get-started/){target=\_blank} – the core mechanism for transferring tokens (including reward tokens) between chains
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – can facilitate the distribution and claiming processes of these rewards

## Next Steps

Now that you're familiar with the core of the Wormhole Token Bridge—it’s time to put it into action.
Whether you're a developer, founder, or DeFi builder, you can integrate seamless cross-chain token transfers into your app in just a few steps. Dive into our hands-on tutorials and start shipping:

- [Build a Token Transfer App](docs/tutorials/typescript-sdk/tokens-via-token-bridge/){target=\_blank}—Follow our step-by-step guide to create a cross-chain token transfer app using the Wormhole SDK
- [Launch Cross-Chain Smart Contracts](docs/tutorials/solidity-sdk/cross-chain-token-contracts/){target=\_blank} – Use the Hello Token tutorial to deploy contracts that send tokens and trigger logic on the destination chain

Test it, launch it, and scale it across chains. The infrastructure is ready—now it’s your move.

