---
title: Get Started
description: Compare integration paths for Wormhole Settlement and choose the best option for your use case—app, router, or protocol-level.
categories: Settlement, Transfer
---

# Get Started

## Introduction

[Wormhole Settlement](/docs/products/settlement/overview/){target=\_blank} enables fast, intent-based multichain asset transfers across supported blockchains like Ethereum, Solana, Sui, and more. It provides multiple integration paths tailored to different application needs, whether you're building a dApp, stablecoin swap interface, or participating as a solver.

This page compares two supported integration options, [Liquidity Layer](/docs/products/settlement/concepts/architecture/#wormhole-liquidity-layer){target=\_blank} and [Mayan Swift](/docs/products/settlement/concepts/architecture/#mayan-swift){target=\_blank}, to help you choose the best fit for your use case.

## Choose Your Integration Path

Depending on your use case, you can choose between different settlement routes. Here's a quick comparison:

<div markdown class="full-width">

::spantable::

| Integration Path               | Best for                              | Chains             | Typescript SDK Compatible | Flexibility| 
|--------------------------------|---------------------------------------|--------------------|--------------------|--------------------|
| Liquidity Layer @span | dApps needing deeper control or protocol-level integration| Testnet + Mainnet | ❌ | :green_circle: :green_circle: :green_circle: <br> High | 
| Mayan Swift @span              | dApps that want fast integration with minimal setup | Mainnet           | ✅ | :green_circle: :white_circle: :white_circle: <br> Low | 

::end-spantable::

</div>

## Next Steps

Once you've chosen a path, follow the corresponding guide to start building:

- [**Integrate with Liquidity Layer**](/docs/products/settlement/guides/liquidity-layer/){target=\_blank} – interact directly with routers for flexible protocol-level control
- [**Use Mayan Swift with the SDK**](TODO){target=\_blank} – plug into Settlement using the TypeScript SDK for rapid integration