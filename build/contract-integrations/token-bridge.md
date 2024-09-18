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

Wormhole's Token Bridge offers a solution by enabling token transfers across blockchain networks using a lock-and-mint mechanism. Leveraging Wormhole's [generic message-passing protocol](/learn/fundamentals/introduction/){target=\_blank}, the Token Bridge allows assets to move across supported blockchains without native token swaps. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain, making the transfer process efficient and chain-agnostic. Additionally, the Token Bridge supports [Contract Controlled Transfers](/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions.

Wormhole's Token Bridge stands out for its flexibility and speed. It uses a generic message-passing infrastructure, allowing the system to be rapidly integrated with any network where Wormhole contracts are deployed. This approach is highly scalable and doesn't require each blockchain to understand the token transfer logic of other chains, making it a robust and flexible solution for multichain dApps.

This page will walk you through the essential methods and events of the Token Bridge contracts, providing you with the knowledge needed to integrate them into your cross-chain applications. For more details on how the Token Bridge works, refer to the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} or [Native Token Transfers](/learn/messaging/native-token-transfers/overview/#token-bridge){target=\_blank} pages in the Learn section.

## Prerequisites

To successfully deploy a multichain solution using the Wormhole Token Bridge, several core components and prerequisites must be met.

- **Token Compatibility** - the token you wish to transfer must be compatible with the destination chain as a wrapped asset. For tokens that do not already exist on the target chain, you must attest their details, which includes metadata like `name`, `symbol`, `decimals`, and `payload_id` which must be set to `2` for an attestation. This ensures that the wrapped token on the destination chain preserves the original token’s properties. See the [Attestation section](/learn/infrastructure/vaas/#attestation){target=\_blank} for more details and all the required metadata fields

## Interface

In this section, we will detail the main functions that the Wormhole Token Bridge exposes and the events that are emitted during the token transfer process. This is essential to understanding how to interact with the bridge and handle cross-chain token transfers.

