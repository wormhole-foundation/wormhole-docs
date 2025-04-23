---
title: Native Token Transfers Architecture
description: Explore Wormhole's Native Token Transfers architecture, which covers components, message flow, rate limiting, and custom transceivers.
categories: NTT, Transfer
---

## Native Token Transfers Architecture

The Native Token Transfers (NTT) architecture enables secure and efficient native token transfers across blockchains. Designed for flexibility and composability, it coordinates minting, burning, and message verification through a set of on-chain contracts and cross-chain messaging.

This page outlines the core components, how they interact, and the underlying mechanisms that ensure consistent token behavior across supported chains.

## High-level Overview

There are a few core components involved in NTTs:

- NTT Manager - integrator owned contract on source chain
- Wormhole Transceiver on source chain- 
- Wormhole Core Contract on source chain - 
- Guardian Network
- Relayer
- Wormhole Transceiver on destination chain
- Wormhole core contract on destination chain 
- NTT manager - integrator owned contract on destination chain
