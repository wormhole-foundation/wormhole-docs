---
title: Native Token Transfers Post Deployment
description: Learn post-deployment guidelines for optimizing Wormhole NTT, which include testing, security, frontend integration, ecosystem coordination, and monitoring.
categories: NTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/native-token-transfers/guides/post-deployment/
---

# NTT Post-Deployment Steps

To offer the best user experience and ensure the most robust deployment, Wormhole contributors recommend the following after you have deployed Native Token Transfers (NTT):

- Implement a robust testing plan for your multichain token before launching.
- Ensure comprehensive, documented security measures are followed for custody of contract ownership, control of keys, and access control roles. Check the [NTT configuration](/docs/products/token-transfers/native-token-transfers/configuration/access-control/){target=\_blank} for more details on ownership and rate limits.
- Consider a streamlined, customizable frontend such as [Connect](/docs/products/connect/overview/){target=\_blank} for an optimized user experience.
- Alternatively, the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank} allows for a direct integration into your infrastructure.
- Ensure ecosystem actors such as block explorers, automated security tools (such as BlockAid and Blowfish), and wallets (such as MetaMask, Backpack, and Phantom) are aware of your multichain deployment and that it is labeled appropriately.
- Monitor and maintain your multichain deployment.

## Post-Deployment Settings

The following table outlines post-deployment settings available on the NTT Manager contract. These allow you to update roles, pause activity, and adjust transfer limits—useful for upgrades, incident response, or protocol tuning after initial deployment.

| Setting                 | Effect                                   |
|-------------------------|------------------------------------------|
| `pause`                 | Pauses the manager.                      |
| `unpause`               | Unpauses the manager.                    |
| `setOwner`              | Changes the manager owner.               |
| `setPauser`             | Changes the pauser role.                 |
| `setOutboundLimit`      | Sets outbound transfer limit.            |
| `setInboundLimit`       | Sets inbound transfer limit (per chain). |
| `setTransceiverPauser ` | Changes pauser for a transceiver.        |

## Where to Go Next

<div class="grid cards" markdown>

- :octicons-code-16:{ .lg .middle } **Transfer Ownership**

    ---

    Learn how to move ownership of your NTT deployment to a new owner address on EVM, Solana, and Sui with step-by-step instructions.

    [:custom-arrow: Follow the Transfer Ownership guide](/docs/products/token-transfers/native-token-transfers/guides/transfer-ownership/)

-   :octicons-code-16:{ .lg .middle } **Wormhole NTT Connect Demo**

    ---

    Check out an example project that uses a Next.js TypeScript application and integrates it with Connect, a customizable widget for cross-chain asset transfers.

    [:custom-arrow: Explore the NTT Connect demo](https://github.com/wormhole-foundation/demo-ntt-connect)

-   :octicons-code-16:{ .lg .middle } **Wormhole NTT TypeScript SDK Demo**

    ---

    Reference an example project that uses the Wormhole TypeScript SDK to facilitate token transfers between different blockchain networks after deploying the NTT framework.

    [:custom-arrow: Explore the NTT TypeScript SDK demo](https://github.com/wormhole-foundation/demo-ntt-ts-sdk)

-   :octicons-eye-16:{ .lg .middle } **Query NTT Token and Transfer Data**

    ---

    Learn how to explore NTT by querying token metadata and transfer activity using the Wormholescan API in a TypeScript project.

    [:custom-arrow: Try the NTT Token and Transfers Guide](/docs/products/messaging/guides/wormholescan-api)

</div>
