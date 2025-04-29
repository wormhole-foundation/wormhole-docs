---
title: Get Started
description: Compare integration paths for Wormhole Settlement and choose the best option for your use case—app, router, or protocol-level.
categories: Settlement, Transfer
---

# Get Started

## Introduction

Wormhole Settlement enables fast, intent-based cross-chain asset transfers across multiple blockchains like Ethereum, Solana, Sui, and more. This page helps you choose the right integration path for your application and prepare your environment for development.

Settlement offers multiple integration routes, each designed for different use cases, levels of complexity, and supported ecosystems.

## Choose Your Integration Path

Depending on your use case, you can choose between several settlement routes. Here's a quick comparison:

<div markdown class="full-width">

::spantable::

| Integration Path               | Best for                              | Chains             | Technology         | Ease of Integration| 
|--------------------------------|---------------------------------------|--------------------|--------------------|--------------------|
| Liquidity Layer @span | DApps with flexible settlement and fast settlement finality| Testnet + Mainnet | Typescript | :green_circle: :white_circle: :white_circle: <br> Low | 
| Mayan Swift @span              | Stablecoin transfers                              | Mainnet           | Typescript | :green_circle: :white_circle: :white_circle: <br> Low | 
| MCTP @span        | Programmable cross-chain USDC payments using Circle CCTP | To be defined | Typescript | :green_circle: :green_circle: :white_circle: <br> Moderate | 
| Solver Infra @span             | Liquidity providers fulfilling intents via Solana Matching Engine | Solana Devnet | Typescript, Shell | :green_circle: :green_circle: :white_circle: <br> Moderate| 

::end-spantable::

</div>

## Next Steps

Once you choose your integration path, you can follow the specific guide that matches your needs:

 - [Build on the Wormhole Liquidity Layer](){target=\_blank} – integrate with Wormhole’s chain abstraction layer for fast cross-chain applications
 - [Run a Wormhole Settlement Solver](){target=\_blank} – set up and operate a Solver node to participate in fulfilling cross-chain intents
 - [Understand the Settlement Architecture](){target=\_blank} – learn about the different swap protocols (Liquidity Layer, Mayan Swift, MCTP)
 - [Review Settlement FAQs](){target=\_blank} – see common questions about auctions, fallback behavior, and settlement guarantees