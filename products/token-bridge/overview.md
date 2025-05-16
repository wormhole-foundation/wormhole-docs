---
title: Token Bridge Overview
description: With Wormhole Token Bridge, you can enable secure, multichain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Token Bridge, Transfer
---


# Token Bridge Overview

The Token Bridge is a decentralized protocol designed for transferring tokens across various blockchain networks. It facilitates secure, efficient, and composable multichain token movement without the need for centralized exchanges, wrapped token custodians, or liquidity pools.

Using a lock-and-mint architecture, the Token Bridge preserves token properties across chains, such as symbol, name, and precision. It also supports advanced features like Token Transfers with Messages, enabling smart contract interactions on the destination chain.

This overview introduces Wormhole's Token Bridge's core design, flow, and functionality, and guides you through implementation.

## Key Features

The Token Bridge is built to solve common problems in multichain token movement—loss of precision, fragmented liquidity, and slow settlement—by offering a trust-minimized and scalable alternative. It includes:

**Universal interoperability** - transfer standards-compliant tokens (e.g., ERC-20, SPL) across 30 supported chains
**Wrapped asset model** - mint-wrapped tokens backed 1:1 by locked or burned assets on the source chain
**Preserved metadata** - ensure that attributes like name, symbol, and decimals persist across chains
**Transfer with payload** - attach arbitrary data to token transfers, enabling downstream smart contract calls
**Decentralized security** - verified by the [Wormhole Guardian network](docs/learn/infrastructure/guardians/), ensuring cross-chain consistency and message authenticity

## How It Works

By handling token movement in a decentralized, permissionless, and metadata-aware way, the Token Bridge provides a reliable foundation for cross-chain interoperability at scale.


In short, the Token Bridge transfer process follows these key steps:

1.  **Attestation** - the token’s metadata (e.g., symbol, name, decimals) is registered on the destination chain. This step is only required once per token
2.  **Lock or burn** - to ensure one-to-one backing, the original token is either locked (on EVM chains) or burned (on chains like Solana)
3.  **Message emission** - the decentralized Guardian network generates and cryptographically signs a transfer message
4.  **Verification** - the signed message is submitted and verified on the destination chain to confirm authenticity
5.  **Mint or release** - a wrapped version of the token is minted (or the native token is released) to the recipient on the destination chain

![Token Bridge Steps Diagram](docs/images/learn/transfers/token-bridge/token-bridge-diagram.webp)

## Use Cases

Here are key use cases that highlight the power and versatility of the Token Bridge.

- **Multichain Rewards and Token Utility in Decentralized Platforms** (e.g., [Chingari](https://chingari.io/){target=\_blank})** 

    - [**Token Bridge**](/docs/products/token-bridge/get-started/){target=\_blank} – transfer tokens between chains
    - [**Messaging**](/docs/products/messaging/get-started/){target=\_blank} – facilitate the distribution and claiming processes of rewards

## Next Steps

[timeline(wormhole-docs/.snippets/text/products/token-bridge/token-bridge-timeline.json)]

If you are looking for guided practice, take a look at: 

- [Build a Token Transfer App](docs/tutorials/typescript-sdk/tokens-via-token-bridge/){target=\_blank}—Follow our step-by-step guide to create a cross-chain token transfer app using the Wormhole SDK

