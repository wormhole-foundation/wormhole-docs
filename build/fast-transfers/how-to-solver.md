---
title: Fast Transfers
description: TODO
---

# Solver

## Overview

In Fast Transfers, solvers play a crucial role in ensuring efficient cross-chain transfers through a competitive auction process on the Matching Engine. The auction consists of four key steps: <!-- link to matching engine -->

1. **Starting an auction** - users initiate a transfer, and solvers begin bidding to fulfill it by offering the best rates
2. **Participating in an auction** - solvers compete in a reverse Dutch auction to provide the most cost-effective solution
3. **Execute fast order to complete auction** - the winning solver completes the transfer by sending assets to the destination chain within a set time frame
4. **Settling an auction** - once the transfer is finalized, the solver retrieves their funds and earns the fee for the completed transaction

## Starting an Auction

When users interact with Token Routers with the intent of transferring assets faster than finality to another chain, they are placing an order that the Matching Engine will process.

In order to initiate an auction with this message, the following needs to be done on Solana.

### Send transactions to verify signatures and post VAA

The fast VAA (verified message) is observed via Wormhole Spy or a process that listens to the Wormhole gossip network like the relayer-engine (https://github.com/wormhole-foundation/relayer-engine). This VAA acts as an IOU for the solver when the auction is settled.

In order to read VAAs on Solana, someone (anyone can do this) needs to verify signatures and post the VAA to a Solana account via Wormhole Core Bridge instructions. The typical way to do this is using the Wormhole JS SDK.

<!-- snippet -->

### Send transaction to place initial offer

<!-- snippet -->


## Participating in an Auction

This section details how to participate in an already initialized auction. To participate, the relayer must place an offer at a better price than the current auction price. The following needs to be done on Solana: 

<!-- snippet -->

## Execute Fast Order to Complete Auction

To complete the auction, the relayer must execute the fast order before the grace period ends. This step will release the intended funds to the user on the target chain. To execute the fast order, do the following on Solana: 

<!-- snippet -->

## Settle Auction with Finalized VAA

### Send transactions to verify signatures and post VAA

The finalized VAA is observed via Wormhole Spy or a process that listens to the Wormhole Spy network like the relayer engine.

In order to read VAAs on Solana, someone (anyone can do this) needs to verify signatures and post the VAA to a Solana account via Wormhole Core Bridge instructions. The typical way to do this is using the Wormhole JS SDK.

<!-- snippet -->

### Send transaction to settle complete auction

<!-- snippet -->


## Mainnet Contract Addresses 