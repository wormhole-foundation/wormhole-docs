---
title: Get Started with Token Bridge
description: 
---

<!--
- Minimal requirements to build a multichain solution with Token Bridge - requirements needed to deploy contracts that directly interact with the Token Bridge
- An overview of the Token Bridge interface – what functions can be called, what events are emitted, etc.
-->

# Token Bridge

## Introduction

Building a multichain decentralized application presents the challenge of transferring tokens seamlessly between different blockchain networks. The lack of interoperability between chains requires a reliable and efficient mechanism to transfer assets while maintaining security, token properties, and functionality. Traditional solutions often need more flexibility, can be slow, and involve high transaction fees.

Wormhole's Token Bridge offers a solution that enables token transfers across blockchain networks using a lock-and-mint mechanism. Leveraging Wormhole's [generic message-passing protocol](/learn/fundamentals/introduction/){target=\_blank}, the Token Bridge allows assets to move across supported blockchains without native token swaps. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain, making the transfer process efficient and chain-agnostic. This approach is highly scalable and doesn't require each blockchain to understand the token transfer logic of other chains, making it a robust and flexible solution for multichain dApps. Additionally, the Token Bridge supports [Contract Controlled Transfers](/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions.

This page will walk you through the essential methods and events of the Token Bridge contracts, providing you with the knowledge needed to integrate them into your cross-chain applications. For more details on how the Token Bridge works, refer to the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} or [Native Token Transfers](/learn/messaging/native-token-transfers/overview/#token-bridge){target=\_blank} pages in the Learn section.

## Prerequisites

To successfully transfer tokens using the Wormhole Token Bridge, some prerequisites must be met.

- **Token compatibility** - the token you wish to transfer must be compatible with the destination chain as a wrapped asset. For tokens that do not already exist on the target chain, you must attest their details, which includes metadata like `name`, `symbol`, `decimals`, and `payload_id` which must be set to `2` for an attestation. This ensures that the wrapped token on the destination chain preserves the original token’s properties. The attestation process creates a record of the token's metadata on the target chain to ensure its consistency across chains. See the [Attestation section](/learn/infrastructure/vaas/#attestation){target=\_blank} for more details and all the required metadata fields
- **Chain compatibility** - ensure that your desired chains are supported by Wormhole and have the necessary bridge contracts deployed. Check the list of [supported networks](/build/start-building/supported-networks/){target=\_blank}

To interact with the Wormhole Token Bridge, you'll need the following:

- [The address of the Token Bridge Core Contract](/build/reference/contract-addresses#core-contracts) on the chains you're working with
- [The Wormhole chain ID](/build/reference/chain-ids/) of the chains you're you're targeting for token transfers
- The token must be attested on the target chain before it can be transferred

## How to Interact with the Token Bridge Contracts

Before writing your own contracts, it’s important to understand the key functions and events provided by the Wormhole Token Bridge. The primary functionality revolves around:

- **Locking and Minting tokens** – locking tokens on the source chain and minting wrapped tokens on the destination chain
- **Sending tokens with additional data** – attaching arbitrary payloads to token transfers for Contract Controlled Transfers

Token transfers using the Token Bridge follow the lock-and-mint mechanism. Tokens are locked on the source chain, and wrapped tokens are minted on the destination chain after the transfer message is verified.

### EVM

### Solana

### Sui

## Interface



