---
title: Ecosystem
description: Explore Wormhole's modular ecosystem of cross-chain tools for messaging, bridging, governance, and developer integration.
categories: Basics
---

# The Wormhole Ecosystem

[Wormhole](/docs/protocol/introduction/){target=\_blank} is a cross-chain messaging protocol connecting decentralized applications across multiple blockchains. It offers a suite of interoperability tools, each addressing different multichain challenges, and allows developers to mix and match these products as needed.

Whether you’re looking for a simple UI-based bridging experience, a native token transfer flow without wrapped assets, real-time cross-chain data queries, or an advanced settlement layer for complex asset movements, Wormhole has a product designed for that purpose. Every solution integrates with Wormhole’s core messaging network, ensuring each module can operate independently or in combination with others.

This page will guide you through the structural layout of these tools—how they fit together, can be used independently, and can be layered to build robust, multichain applications.

## Ecosystem Overview

The diagram shows a high-level view of Wormhole’s modular stack, illustrating how different tools are grouped into four layers:

- **Application and user-facing products**: The top layer includes user-centric solutions such as [Connect](/docs/products/connect/overview/){target=\_blank} (a simple bridging interface) and the [NTT Launchpad](https://ntt.wormhole.com/){target=\_blank} (for streamlined native asset deployments).
- **Asset and data transfer layer**: Below it sits the core bridging and data solutions—[NTT](/docs/products/native-token-transfers/overview/){target=\_blank}, [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank}, [Queries](/docs/products/queries/overview/){target=\_blank}, [Settlement](/docs/products/settlement/overview/){target=\_blank}, and [MultiGov](/docs/products/multigov/overview/){target=\_blank}—that handle the movement of tokens, real-time data fetching, advanced cross-chain settlements, and cross-chain governance.
- **Integration layer**: The [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}, [Solidity SDK](/docs/tools/solidity-sdk/get-started/){target=\_blank}, and [WormholeScan API](https://wormholescan.io/#/){target=\_blank} provide developer-friendly libraries and APIs to integrate cross-chain capabilities into applications.
- **Foundation layer**: At the base, the [Wormhole messaging](/docs/products/messaging/overview/){target=\_blank} system and the [core contracts](/docs/protocol/infrastructure/core-contracts/){target=\_blank} secure the entire network, providing essential verification and cross-chain message delivery.

![Wormhole ecosystem diagram](/docs/images/protocol/ecosystem/ecosystem-1.webp)

## Bringing It All Together: Interoperability in Action

Wormhole’s modularity makes it easy to adopt just the pieces you need. If you want to quickly add bridging to a dApp, use Connect at the top layer while relying on the Foundation Layer behind the scenes. Or if your app needs to send raw messages between chains, integrate the Messaging layer directly via the Integration Layer (TypeScript or Solidity SDK). You can even layer on additional features—like real-time data calls from Queries or more flexible bridging flows with Native Token Transfers.

Ultimately, these components aren’t siloed but designed to be combined. You could, for instance, fetch a balance from one chain using Queries and then perform an on-chain swap on another chain using Settlement. Regardless of your approach, each Wormhole product is powered by the same Guardian-secured messaging backbone, ensuring all cross-chain interactions remain reliable and secure.

## Next Steps

Unsure which bridging solution you need? Visit the [Product Comparison](/docs/products/products/){target=\_blank} page to quickly match your requirements with the right Wormhole tool.
