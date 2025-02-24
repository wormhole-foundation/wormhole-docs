---
title: Protocol Architectures in Wormhole Settlement
description: description
---

# Protocol Architectures

This page describes the high-level mechanics of the underlying native swap protocols in the Wormhole SDK. While built on Wormhole messaging, each protocol uses a novel architecture with unique price discovery, scalability, and latency tradeoffs. These designs enable redundancy to handle highly asymmetric flows and sharp volume changes.

## Wormhole Liquidity Layer

The Wormhole Liquidity Layer is a cross-chain transfer protocol that utilizes Solana as the central orchestration layer for cross-chain intents. This enables solvers to deploy liquidity from a single hub (Solana) rather than distributing it across each supported chain.

The hub-spoke model leverages interoperable token standards like Circle's CCTP (and Wormhole's NTT), allowing the solver to natively mint and burn assets between chains for intent fulfillment. 

### Overview

Wormhole Liquidity Layer is a cross-chain transfer protocol designed to enable faster-than-finality transfers across the Wormhole ecosystem through a novel hub-and-spoke architecture centered on Solana. This architecture allows solvers to facilitate cross-chain transfers by fronting assets on the destination chain and assuming the finality risk of the originating source chain transaction. Solvers concentrate their liquidity entirely on Solana, where they participate in permissionless on-chain English auctions (open ascending-price auctions where bidders publicly raise bids until only one bidder remains) to fulfill each cross-chain transfer. Upon the conclusion of each auction, the winning solver initiates a transfer from Solana to the specified destination chain. The solver rebalances inventory once the originating source chain transaction reaches finality and arrives at Solana.

![Wormhole Settlments Liquidity layer architecture diagram: source chain to hub to destination chain](/docs/images/learn/messaging/wormhole-settlements/settlements-overview.webp)
