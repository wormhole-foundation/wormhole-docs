---
title: Native Token Transfers Post Deployment
description: Learn post-deployment guidelines for optimizing Wormhole NTT, which include testing, security, frontend integration, ecosystem coordination, and monitoring.
---

# Native Token Transfers (NTT) Post Deployment

## Post Deployment Recommendations

To offer the best user experience and ensure the most robust deployment, Wormhole contributors recommend the following after you have deployed NTT:

- Implement a robust testing plan for your multichain token before launching
- Ensure comprehensive, documented security measures are followed regarding custody of contract ownership, control of keys, and access control roles
- Consider a streamlined, customizable frontend such as [Wormhole Connect](https://docs.wormhole.com/wormhole/wormhole-connect/overview){target=\_blank} for an optimized user experience
- Alternatively the [Wormhole SDK](https://docs.wormhole.com/wormhole/reference/sdk-docs){target=\_blank} allows for a direct integration into your infrastructure
- Ensure ecosystem actors such as block explorers, automated security tools (such as BlockAid and Blowfish), wallets (such as MetaMask, Backpack, and Phantom) are aware of your multichain deployment and that it is labeled appropriately
- Monitor and maintain your multichain deployment

## Post Deployment Integration Demos

<div class="grid cards" markdown>

-   :octicons-code-16:{ .lg .middle } **Wormhole NTT Connect Demo**

    ---

    Check out an example project that uses a Vite-React TypeScript application and integrates it with Wormhole Connect, a customizable widget for cross-chain asset transfers.

    [:octicons-arrow-right-16: Explore the NTT Connect demo](https://github.com/wormhole-foundation/demo-ntt-connect)

-   :octicons-code-16:{ .lg .middle } **Wormhole NTT TypeScript SDK Demo**

    ---

    Reference an example project that uses the Wormhole TypeScript SDK to facilitate token transfers between different blockchain networks after deploying the NTT framework.

    [:octicons-arrow-right-16: Explore the NTT TypeScript SDK demo](https://github.com/wormhole-foundation/demo-ntt-ts-sdk)

</div>
