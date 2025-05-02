---
title: Get Started with Token Bridge
description: 
categories: Token-Bridge, Transfers
---

# Get Started with Token Bridge

## Introduction

Wormhole’s Token Bridge enables seamless cross-chain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

In this guide, you will use the Wormhole TypeScript SDK to perform a manual token transfer from Solana to Sui. You will initiate the transfer on Solana, fetch the attestation signed by the Guardian network, and redeem the tokens on Sui.

To understand how the protocol works, see the [Token Bridge overview](/docs/products/token-bridge/overview){target=/_blank}.



