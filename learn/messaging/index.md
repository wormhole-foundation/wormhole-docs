---
title: Messaging Protocols
description: This section introduces the core messaging protocols that powers seamless cross-chain communication and asset transfer within the Wormhole ecosystem.
---

# Messaging Protocols

The Messaging section covers various aspects and services related to communication protocols and systems within our platform. Each subsection provides detailed information on specific components, contracts, and bridges for messaging and data transfer. Below is a brief overview of each subsection:

## Core Contracts

The [Core Contracts](/learn/messaging/core-contracts/){target=\_blank} form the backbone of Wormhole's cross-chain communication system, allowing for the emission and receipt of messages across different blockchains. Each blockchain in the ecosystem has its own Core Contract, which Guardians observe to ensure the integrity and synchronization of data. These contracts handle message sending, receiving, and multicast, providing a seamless mechanism for inter-chain communication without additional costs.

## Native Token Transfers

Wormhole's [Native Token Transfers](/learn/messaging/ntt/ntt-overview/){target=\_blank} (NTT) offer an open-source and flexible framework for cross-chain token transfers, providing full control over token behavior on each blockchain. This system supports two operation modes: locking mode for preserving the original token supply on a single chain and burning mode for distributing multichain tokens across various chains. Key features include integrator flexibility, advanced rate limiting, no need for liquidity pools, and custom attestation options. This ensures a consistent user experience, robust security, and easy integration for complex multichain deployments.

## Token Bridge

The [Token and NFT Bridges](/learn/messaging/token-nft-bridge/){target=\_blank} facilitate cross-chain transfers of fungible and non-fungible tokens (NFTs). Utilizing a lock and mint mechanism, the bridge ensures secure and efficient asset movement between blockchains. The Token Bridge allows for token transfers with specific receiver details, while the NFT Bridge handles the transfer of unique digital assets with specialized rules for creating wrapped versions on the destination chain.

## Circle's CCTP Bridge

The [CCTP Bridge](/learn/messaging/cctp/){target=\_blank} supports fast and cost-effective native USDC transfers across blockchains using Circle's Cross Chain Transfer Protocol (CCTP). While distinct from Wormhole, this protocol is enhanced by Wormhole's features, such as automated relaying, gas payment on the destination chain, and native gas dropoff, making it more user-friendly. The integration can be achieved through the Wormhole Connect Widget or the Connect SDK, providing a seamless experience for developers and users.

## Gateway

Wormhole [Gateway](/learn/messaging/gateway/){target=\_blank} is a Cosmos-SDK chain designed to bridge non-native assets into the Cosmos ecosystem, offering unified liquidity across Cosmos chains. By utilizing IBC (Inter-Blockchain Communication), Wormhole Gateway prevents liquidity fragmentation and ensures that foreign assets bridged via Wormhole have unified liquidity across the Cosmos ecosystem. In addition to facilitating asset transfers, Wormhole Gateway includes features like the IBC Shim contract, Token Factory module, and IBC composability middleware, allowing seamless integration with other Cosmos chains and external blockchains. This setup supports various transfer models, including external-to-cosmos, Cosmos-to-external, and inter-cosmos transfers, ensuring flexibility and security in multichain asset movement.
