---
title: VAAs and Protocol Messages
description: 
---

# VAAs and Protocol Messages

## Introduction

Wormhole’s core functionality revolves around [Verifiable Action Approvals](/docs/learn/infrastructure/vaas/){target=\_blank} (VAAs), which are signed messages enabling secure and decentralized communication across chains. This guide focuses on their practical usage within the Wormhole ecosystem, specifically when working with protocol-specific messages in the TypeScript and Solidity SDKs.

This page will help you understand:

 - How VAAs encapsulate protocol-specific payloads, such as TokenBridge transfers, Wormhole Relayer delivery instructions, or CCTP messages
 - The role of serialization and deserialization for handling VAAs and their messages across both off-chain and on-chain environments
 - How to leverage Wormhole’s SDKs for integrating these protocols into your dApps and contracts

For deeper insights into serialization, deserialization, and protocol design, refer to:

 - [Data Layouts](/docs/build/applications/wormhole-sdk/sdk-layout/){target=\_blank} for serialization concepts
 - [Building Protocols and Payloads](/docs/build/applications/wormhole-sdk/protocols-payloads/){target=\_blank} for designing custom protocol messages

With this guide, you'll gain a practical understanding of handling VAAs and protocol messages in off-chain and on-chain scenarios.

