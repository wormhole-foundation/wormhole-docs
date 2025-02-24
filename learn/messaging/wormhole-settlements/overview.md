---
title: Wormhole Settlements Overview
description: Discover Wormhole Settlements, enabling fast, intent-based asset transfers across Ethereum, Solana, Sui, and more for institutions and builders.
---

# Wormhole Settlements Overview

## Introduction

Wormhole Settlements is a fast, institutional-scale digital asset settlement — a new way to transfer assets across chains.

With Wormhole Settlement, an intent-based asset transfer for individual users and institutions, you can swap, bridge, and build across multiple chains. You can implement cross-chain functionality within your dApps extremely simply and without compromising user experience, widening the horizons of your product offerings and the number and type of users you can cater to.

The Settlement supports Ethereum, Ton, Optimism, Arbitrum, Base, Avalanche, Unichain, Polygon, Solana, and Sui, with many more on the horizon. It is powered by Wormhole Messaging, Wormhole Native Token Transfer (NTT), and Circle's CCTP and built in collaboration with the intent experts at Mayan Finance.

Settlement represents Wormhole's first step towards optimizing the bridging experience and building a product that users and institutions use daily. Use it to send assets between chains, rebalance institutional inventories on-chain cheaply and quickly, or allow your application to be accessible by any user no matter what assets they hold or what chain they call home.

## Key Features

- **Integrator flexibility** - apps leveraging the SDK can select any one of three potential routes surfaced, each with its tradeoffs concerning time vs cost; they may extend this to users as well
- **Scalable liquidity** - taking into account the sometimes idiosyncratic yet sharp inflows into the Solana ecosystem, the hub-spoke model of the Wormhole Liquidity Layer and the flexible design of Swift are designed for capital efficiency
- **Arbitrary payload support** - integrators can bundle `callData` containing arbitrary protocol actions to enable seamless one-click user experiences, such as swap plus stake

## Integrator Paths

### SDK Integrators

Wormhole provides an SDK that enables apps to abstract away the complexity of cross-chain token swaps. The SDK handles route discovery, fee estimation, and transaction construction. Apps can embed this feature in their backend or create an interface for users to bridge into their respective ecosystems quickly.

### NTT Integrators

NTT partners, current and future, can leverage Wormhole Settlement for near-instant NTT transfers from any chain, including Ethereum mainnet and its L2s. This eliminates waiting for slow source chain confirmation times (sometimes 15 minutes or more). If interested, please [fill out this interest form](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}.

### Chain Integrators

Due to the hub-spoke model of liquidity, new chains without proven traction can access the same level of liquidity for cross-chain intent fulfillment from day one of mainnet launch as established ecosystems with clear evidence of adoption.

!!!tip
    Looking to integrate Wormhole Settlement? If you're ready, check out how to [integrate Wormhole Settlement Routes using the SDK](/docs/tutorials/by-product/settlements/settlement-routes/){target=\_blank}.

## Related Resources

- To learn more about the architecture of Wormhole-native swap protocols, see the [Settlement Protocol Architectures](/docs/learn/messaging/wormhole-settlements/architecture/){target=\_blank} page