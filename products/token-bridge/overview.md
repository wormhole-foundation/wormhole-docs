---
title: Token Bridge Overview
description: With Wormhole Token Bridge, you can enable secure, multichain communication, build multichain apps, sync data, and coordinate actions across blockchains.
categories: Token-Bridge, Transfer
---


# Token Bridge Overview

The Token Bridge is a Wormhole module for bridging and wrapping tokens across various blockchain networks. Locking assets on one network and minting corresponding wrapped tokens on another facilitates secure, efficient, and composable multichain token movement.

This overview introduces Wormhole's Token Bridge's core design, flow, and functionality, and guides you through implementation.

## Key Features

The Token Bridge is built to solve interoperability problems in multichain token transfers. Key features include:

- **Universal interoperability** - transfer standards-compliant tokens (e.g., ERC-20, SPL) across over 30 supported chains
- **Wrapped asset model** - mint wrapped tokens backed 1:1 by locked or burned assets on the source chain
- **Preserved metadata** - ensure that attributes like name, symbol, and decimals persist across chains
- **Transfer with payload** - attach arbitrary data to token transfers, enabling downstream smart contract calls
- **Decentralized security** - verified by the [Wormhole Guardian network](/docs/protocol/infrastructure/guardians/), ensuring cross-chain consistency and message authenticity

## How It Works

By handling token movement in a decentralized, permissionless, and metadata-aware way, the Token Bridge provides a reliable foundation for cross-chain interoperability at scale.


In short, the Token Bridge transfer process follows these key steps:

1. **Attestation** - the token’s metadata (e.g., symbol, name, decimals) is registered on the destination chain. This step is only required once per token
2. **Locking* - on the source chain, the native token is locked in a custody account
3. **Message emission** - the decentralized Guardian network generates and cryptographically signs a transfer message
4. **Verification** - the signed message is submitted and verified on the destination chain to confirm authenticity
5. **Mint or release** - a wrapped version of the token is minted (or the native token is released) to the recipient on the destination chain

![Token Bridge Steps Diagram](/docs/images/products/token-bridge/overview/token-bridge-diagram.webp)

## Use Cases

Here are key use cases that highlight the power and versatility of the Token Bridge. (one other use case)

- **Multichain Rewards and Token Utility in Decentralized Platforms (e.g., [Chingari](https://chingari.io/){target=\_blank})** 

    - [**Token Bridge**](/docs/products/token-bridge/overview/){target=\_blank} – transfer tokens between chains
    - [**Messaging**](/docs/products/messaging/overview/){target=\_blank} – facilitate the distribution and claiming processes of rewards

- **Web3 Game Asset Transfers**

    - [**Token Bridge**](/docs/products/token-bridge/overview/) – handle the underlying lock-and-mint logic securely
    - [**Wormhole Connect**](/docs/products/connect/overview/) - provide a user-friendly way to move game tokens across chains
    

## Next Steps

If you are looking for guided practice, take a look at: 

[timeline(wormhole-docs/.snippets/text/products/token-bridge/overview/token-bridge-timeline.json)]
