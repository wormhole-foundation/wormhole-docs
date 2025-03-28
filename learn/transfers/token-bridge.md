---
title: Token Bridge 
description: Learn about Wormhole's Token Bridge for cross-chain transfers using lock and mint mechanisms, ensuring secure and efficient asset movement.
categories: Token-Bridge, Transfer
---

# Token Bridge

Transferring tokens across blockchain networks is challenging due to the lack of interoperability. Maintaining token properties such as value, name, and precision while ensuring security during transfers often requires complex and costly solutions like liquidity pools or native swaps, which can introduce inefficiencies and risks.

Wormhole’s Token Bridge addresses these challenges by providing a decentralized protocol for seamless cross-chain token transfers through a lock-and-mint mechanism. Using Wormhole’s message-passing protocol, the Token Bridge allows standards-compliant tokens, like ERC-20 on Ethereum or SPL on Solana, to be transferred between different blockchains while preserving their original attributes.

Offering a more efficient, scalable, and secure alternative to traditional solutions, the Token Bridge ensures that assets retain their properties across multiple blockchain ecosystems. Additionally, it supports flexible features like [Token Transfers with Messages](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, enabling custom interactions by allowing tokens to carry additional data for smart contract integration on the destination chain.

This page introduces the core concepts and functions of Wormhole’s Token Bridge, explaining how it operates, its key features, and how it enables secure and efficient cross-chain token transfers.

### How Does It Work?

At the core of the Token Bridge lies the lock-and-mint mechanism, which uses the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} with a specific [payload](/docs/learn/infrastructure/vaas/#token-transfer){target=\_blank} to pass information about the transfer. Tokens on the source chain are locked, and wrapped tokens are minted on the destination chain. This approach guarantees that token transfers are secure and consistent, ensuring that token properties such as name, symbol, and decimal precision are preserved across chains.

Before a token can be transferred to a new chain, the token’s metadata must be [attested](/docs/learn/infrastructure/vaas/#attestation){target=\_blank}. This process registers the token details (such as decimals and symbol) on the destination chain, enabling the creation of wrapped assets.

While the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} has no specific receiver by default, transfers sent through the Token Bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient.

In addition to standard token transfers, the Token Bridge supports [Token Transfers with Messages](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}. This functionality allows users to attach additional data to token transfers, enabling more complex interactions with smart contracts on the destination chain. For instance, a token transfer can include a payload that triggers specific actions, such as interacting with a decentralized exchange (DEX) or automated market maker (AMM).

### Token Transfer Flow

The transfer process is simple yet secure, involving a few key steps:

1. **Attestation** - first, a token's metadata is attested on the source chain, ensuring that its properties are consistent across chains
2. **Locking** - on the source chain, the native token is locked in a custody account
3. **Message emission** - a message detailing the transfer is sent through Wormhole’s Guardian Network, which verifies the transfer and signs the message
4. **Verification and minting** - on the destination chain, the transfer message is verified, and wrapped tokens are minted, or native tokens are released from custody

![Token Bridge detailed flow](/docs/images/learn/transfers/token-bridge/token-bridge-diagram.webp)

### Key Features of the Token Bridge

The Token Bridge creates wrapped versions when tokens are transferred to a different chain. These wrapped assets represent the locked tokens on the source chain and allow users to interact with them on the destination chain. This mechanism ensures seamless functionality without needing liquidity pools or native token swaps.

The Token Bridge employs a universal token representation that is compatible with various virtual machine (VM) data types. This allows the tokens to interact with decentralized applications (dApps) across different chains without issues related to differing token standards.

### Message and Payload Structure

To facilitate cross-chain communication, the Token Bridge uses specialized payloads that carry the necessary information for token transfers and attestations. These payloads ensure that the correct tokens are minted or unlocked on the destination chain.

- `Transfer` - this payload initiates the transfer of tokens, either by minting wrapped tokens or releasing locked tokens
- `TransferWithPayload` - in addition to transferring tokens, this payload carries additional data, allowing integration with smart contracts or dApps on the target chain
- `AssetMeta` - before a token can be transferred for the first time, this payload is used to attest to the token’s metadata, including decimals, symbol, and name
- `RegisterChain` - register the Token Bridge contract (emitter address) for a foreign chain
- `UpgradeContract` - upgrade the contract

Each payload type is designed to serve a specific function in the token transfer process, ensuring that the bridge operates efficiently and securely.

One of the key challenges in cross-chain token transfers is maintaining the correct token precision. The Token Bridge addresses this using the `AssetMeta` payload to store token metadata. Before transferring a token to a new chain, metadata such as its decimal precision, name, and symbol must be attested. The bridge ensures token amounts are truncated to a maximum of 8 decimals, guaranteeing compatibility with chains that may not support higher decimal precision. For example, an 18-decimal token on Ethereum will be represented with only eight decimals on the destination chain, simplifying integration with various decentralized applications.

### Security and Authorization

The Token Bridge uses an emitter chain and address authorization system to verify the validity of messages. Each Token Bridge endpoint is registered on its respective chain, ensuring only trusted contracts can send or receive transfer messages.

The [Wormhole Guardian Network](/docs/learn/infrastructure/guardians/#guardian-network){target=\_blank} plays a critical role in verifying each transfer and ensuring that the message is signed and relayed securely between chains.

### Portal Bridge

A real-world example of Wormhole's Token Bridge in action is the [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides users with a simple interface to transfer tokens across multiple blockchains. Using the Wormhole infrastructure, Portal Bridge guarantees secure and seamless cross-chain transfers, making it easier for users to move assets between different blockchain ecosystems.
