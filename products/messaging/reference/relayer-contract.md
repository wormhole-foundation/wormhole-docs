---
title: Relayer Contract
description: Reference for the Wormhole Relayer contract on EVM chains. Covers the proxy structure, components, state variables, functions, events, and errors.
categories: Basics
---

# Relayer Contract

The [Wormhole Core Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank} chains is a proxy-based contract responsible for receiving and verifying Wormhole messages (VAAs). It implements the messaging interface and delegates logic to upgradeable implementation contracts.