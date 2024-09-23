---
title: Token Bridge 
description: Learn about Wormhole's Token and NFT Bridge for cross-chain transfers using lock and mint mechanisms, ensuring secure and efficient asset movement.
---

# Token and NFT Bridge

## Token Bridge

The Token Bridge is a decentralized protocol that enables secure and efficient cross-chain token transfers using Wormhole's message-passing infrastructure. This system allows standards-compliant tokens, like ERC-20 on Ethereum or SPL on Solana, to be transferred between different blockchain networks while maintaining their properties and value.

### How Does It Work?

At the core of the Token Bridge lies the lock-and-mint mechanism, which uses the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} with a specific [payload](/docs/learn/infrastructure/vaas/#token-transfer){target=\_blank} to pass information about the transfer. Tokens on the source chain are locked and wrapped tokens are minted on the destination chain. This approach guarantees that token transfers are secure and consistent, ensuring that token properties such as name, symbol, and decimal precision are preserved across chains.

Before a token can be transferred to a new chain, the token’s metadata must be [attested](/docs/learn/infrastructure/vaas/#attestation){target=\_blank}. This process registers the token details (such as decimals and symbol) on the destination chain, enabling the creation of wrapped assets.

In addition to standard token transfers, the Token Bridge supports [Contract Controlled Transfer](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}. This functionality allows users to attach additional data to token transfers, enabling more complex interactions with smart contracts on the destination chain. For instance, a token transfer can include a payload that triggers certain actions, such as interacting with a decentralized exchange (DEX) or automated market maker (AMM).

While the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} has no specific receiver by default, transfers sent through the Token Bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient.

### Token Transfer Flow

The transfer process is simple yet secure, involving a few key steps:

1. **Attestation** - first, a token's metadata is attested on the source chain, ensuring that its properties are consistent across chains
2. **Locking** - on the source chain, the native token is locked in a custody account
3. **Message emission** - a message detailing the transfer is sent through Wormhole’s guardian network, which verifies the transfer and signs the message
4. **Verification and Minting** - on the destination chain, the transfer message is verified, and wrapped tokens are minted, or native tokens are released from custody

### Key Features of the Token Bridge

When tokens are transferred to a different chain, the Token Bridge creates wrapped versions of those tokens. These wrapped assets represent the locked tokens on the source chain and allow users to interact with them on the destination chain. This mechanism ensures seamless functionality without the need for liquidity pools or native token swaps.

The Token Bridge employs a universal token representation, compatible with various virtual machine (VM) data types. This allows the tokens to interact with decentralized applications (dApps) across different chains without issues related to differing token standards.

### Message and Payload Structure

To facilitate cross-chain communication, the Token Bridge uses specialized payloads that carry the necessary information for token transfers and attestations. These payloads ensure that the correct tokens are minted or unlocked on the destination chain.

- `Transfer` - this payload initiates the transfer of tokens, either by minting wrapped tokens or releasing locked tokens
- `TransferWithPayload` - in addition to transferring tokens, this payload carries additional data, allowing integration with smart contracts or dApps on the target chain
- `AssetMeta` - before a token can be transferred for the first time, this payload is used to attest to the token’s metadata, including decimals, symbol, and name
- `RegisterChain` - register the token bridge contract (emitter address) for a foreign chain
- `UpgradeContract` - upgrade the contract

Each payload type is designed to serve a specific function in the token transfer process, ensuring that the bridge operates efficiently and securely.

One of the key challenges in cross-chain token transfers is maintaining the correct token precision. The Token Bridge addresses this by using the `AssetMeta` payload to store token metadata. Before transferring a token to a new chain, its metadata—such as its decimal precision, name, and symbol—must be attested. The bridge ensures that token amounts are truncated to a maximum of 8 decimals, ensuring compatibility with chains that may not support higher decimal precision. For example, an 18-decimal token on Ethereum will be represented with only 8 decimals on the destination chain, simplifying integration with various decentralized applications.

### Security and Authorization

The Token Bridge uses an emitter chain and address authorization system to verify the validity of messages. Each token bridge endpoint is registered on its respective chain, ensuring that only trusted contracts can send or receive transfer messages.

The Wormhole guardian network plays a critical role in this process by verifying each transfer and ensuring that the message is signed and relayed securely between chains.

### Portal Bridge

A real-world example of Wormhole's Token Bridge in action is the [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides users with a simple interface to transfer tokens across multiple blockchains. By using the Wormhole infrastructure, Portal Bridge guarantees secure and seamless cross-chain transfers, making it easier for users to move assets between different blockchain ecosystems.


## NFT Bridge

The NFT Bridge functions similarly to the Token Bridge but with special rules for what may be transferred and how the wrapped version is created on the destination chain.
