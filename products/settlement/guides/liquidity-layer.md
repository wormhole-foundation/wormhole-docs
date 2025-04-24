---
title: Wormhole Settlement Liquidity Layer
description: Learn how to build on the Wormhole Liquidity Layer, the underlying chain abstraction infrastructure layer for protocols across Wormhole-connected ecosystems.
categories: Settlement, Transfer
---

# Build on the Wormhole Liquidity Layer

## Introduction

The Wormhole Liquidity Layer is the underlying chain abstraction infrastructure layer for protocols across Wormhole-connected ecosystems. It allows these protocols to bundle call data containing arbitrary actions that can be executed atomically alongside each transfer. This feature enables developers to create fully chain-abstracted user experiences, including constructing natively cross-chain decentralized exchanges (DEXs), borrow-lend protocols, payment protocols, and other applications atop this layer. The following section describes the key smart contract components for teams seeking to build atop Wormhole Settlement.

## EVM Functions

The EVM Token Router is a simple interface against which to integrate. For an integrator, the contracts have two main entry points: `placeMarketOrder` and `placeFastMarketOrder`.

See the complete list of [Token Router contract addresses](/docs/build/reference/contract-addresses/#settlement-token-router){target=\_blank} for supported networks.

### Fast Market Order

The `placeFastMarketOrder` function allows the caller to elect for a _faster-than-finality_ transfer of USDC (with an arbitrary message payload) to the destination chain by setting the `maxFee` and `deadline` parameters. Using this interface does not guarantee that the caller's transfer will be delivered faster than finality; however, any willing market participants can compete for the specified `maxFee` by participating in an auction on the Solana `MatchingEngine`

```solidity title="`placeFastMarketOrder` Interface"
--8<-- 'code/products/settlement/guides/liquidity-layer/placeFastMarketOrder.sol'
```

??? interface "Parameters `placeFastMarketOrder()`"

    `amountIn` ++"uint128"++

    The amount to transfer.

    ---

    `targetChain` ++"uint16"++

    Target chain ID.

    ---

    `redeemer` ++"bytes32"++

    Redeemer contract address.

    ---

    `redeemerMessage` ++"bytes"++

    An arbitrary payload for the redeemer.

    ---

    `maxFee` ++"uint128"++

    The maximum fee the user wants to pay to execute a fast transfer.

    ---

    `deadline` ++"uint32"++

    The deadline for the fast transfer auction to start. Note: This timestamp should be for the `MatchingEngine` chain (such as Solana) to avoid any clock drift issues between different blockchains. Integrators can set this value to `0` if they don't want to use a deadline.

The `placeFastMarketOrder` function returns a sequence number for the Wormhole Fill message. This function requires the caller to provide a `msg.value` equal to the amount returned by the `messageFee()` function on the `IWormhole.sol` interface.

### Market Order

The `placeMarketOrder` function is a _wait-for-full-finality_ USDC transfer with an arbitrary message payload. The Swap Layer, built on top of the Wormhole Settlement, uses this function if the auction on the matching engine for `placeFastMarketOrder` doesn't start within a specific deadline.

```solidity title="`placeMarketOrder` Interface"
--8<-- 'code/products/settlement/guides/liquidity-layer/placeMarketOrder.sol'
```

??? interface "Parameters `placeMarketOrder()`"

    `amountIn` ++"uint128"++

    The amount to transfer.

    ---

    `targetChain` ++"uint16"++

    Target chain ID.

    ---

    `redeemer` ++"bytes32"++

    Redeemer contract address.

    ---

    `redeemerMessage` ++"bytes"++

    An arbitrary payload for the redeemer.

The `placeMarketOrder` function returns a sequence number for the Wormhole Fill message. This function requires the caller to provide a `msg.value` equal to the amount returned by the `messageFee()` function on the `IWormhole.sol` interface.
