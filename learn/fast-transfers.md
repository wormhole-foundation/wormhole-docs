---
title: Fast Transfers
description: TODO
---

# Fast Transfers

## Overview

Fast Transfers is an innovative protocol designed to facilitate rapid and efficient liquidity movement across different blockchain networks. At its core, Fast Transfers employs an auction mechanism where solvers and market makers compete to provide the best rates for cross-chain transactions. The protocol is built on Solana, leveraging its fast finality and low transaction costs to perform background token swaps seamlessly.

The primary goal of Fast Transfers is to eliminate the delays typically associated with cross-chain transfers. Traditional cross-chain transfers require waiting for finality on the source chain, which can be time-consuming, especially for networks like Ethereum, where finality can take up to 15 minutes. Fast Transfers bypasses this delay by using a hub-and-spoke model, where Solana acts as the central hub, concentrating liquidity and enabling quick transfers to the destination chain.

In the broader blockchain ecosystem, cross-chain liquidity movement is crucial as it enables assets and value to flow freely across different networks. However, existing solutions often face challenges such as fragmented liquidity and slow transfer times due to the need for finality on each chain. Fast Transfers addresses these challenges by providing a faster, more efficient solution that ensures liquidity is readily available where it’s needed, without the typical wait times. This makes Fast Transfers an essential tool for developers looking to build applications that require quick and reliable cross-chain asset transfers.

## Key Concepts
<!--
Solana as the chosen hub: Reasons and advantages
How It Works:
Process: When transferring assets, they move from the source chain to the hub chain. An auction occurs on the hub chain, and the assets are sent to the destination chain.
Background on CCTP and its relevance to Fast Transfers
Redirect to the detailed CCTP documentation
Explanation of the CCTP and NTT protocols
-->

### Requirements to Support Fast Transfers

To support Fast Transfers, a blockchain must meet several key requirements:

- **CCTP USDC (Cross-Chain Transfer Protocol USDC)** - the primary requirement is that the chain must support CCTP USDC. This allows for seamless asset transfers using USDC as the intermediary currency across different chains
- **NTT USDC (Native Token Transfers USDC)** - for chains that do not support CCTP or lack a canonical version of USDC, Fast Transfers relies on NTT. In this scenario, USDC is locked on the hub chain, and an NTT message is sent to the destination chain to initiate the transfer
- **Liquidity Through Wormhole Wrapped Assets** - in cases where CCTP USDC or NTT USDC are unavailable, the chain must have liquidity in Wormhole-wrapped assets. These wrapped assets can be used as an intermediate currency to facilitate transfers

### Hub and Spoke Model

Fast Transfers utilizes a hub-and-spoke model to manage liquidity and execute cross-chain transfers efficiently. In this model:

- **Hub Chain** - Solana is the central hub where all liquidity is concentrated. Solana is chosen due to its fast finality, low transaction costs, and robust support for CCTP. By concentrating liquidity on Solana, the protocol can facilitate quick and efficient transfers to various destination chains
- **Spoke Chains** - these are the destination chains to which assets are transferred. Tokens are routed through the hub chain (Solana) rather than being transferred directly between the source and destination chains. This approach allows for a more streamlined and efficient transfer process

### How It Works

Fast Transfers operates through a series of well-defined steps to ensure quick and reliable cross-chain transfers:

1. **Hub Chain** - the transfer process begins by moving assets from the source chain to the hub chain, Solana. Here, liquidity is concentrated, and the auction process takes place
2. **Auction Process** - once the assets reach Solana, an auction is initiated on the hub chain. Solvers, who are market participants, bid to provide the best possible rate for the transfer. The winning solver executes the swap and facilitates the transfer to the destination chain
3. **CCTP** - the protocol uses the Cross-Chain Transfer Protocol (CCTP) to manage the movement of assets from the hub chain. CCTP handles the burning of tokens on the source chain and the minting of equivalent tokens on the destination chain, ensuring the integrity of the transfer process
4. **NTT (Native Token Transfers)** - for chains that do not support CCTP, Fast Transfers employs NTT messages. In this case, USDC is locked on Solana, and an NTT message is sent to the destination chain, triggering the transfer of an equivalent value of tokens
5. **Final Transfer** - the final step involves the solvers executing the necessary swaps to provide the user with a useful token on the destination chain. This ensures that the user receives the desired asset promptly, completing the cross-chain transfer process

This structured approach allows Fast Transfers to overcome the limitations of direct chain-to-chain transfers by using Solana as a central hub and leveraging the strengths of CCTP and NTT protocols, ensuring efficient and reliable liquidity movement across multiple chains.

## Auction mechanism

### Overview of the Auction Mechanism

The auction mechanism is a core component of the Fast Transfers protocol, ensuring that users receive the most efficient and cost-effective cross-chain transfers. It operates on the Solana network, where solvers compete to fulfill transfer requests by bidding in a reverse Dutch auction. This competitive environment drives down costs and speeds up the transfer process, benefiting both users and solvers.

### Auction Process

The auction process is designed to be straightforward yet effective, enabling solvers to bid on transfer requests while managing risk through a security deposit system. Here’s a detailed step-by-step breakdown of how the auction mechanism works:

1. **Initiation** - users initiate a transfer through the Fast Transfers protocol, either via a user interface (UI) or directly on-chain. They can choose between a standard transfer, which waits for finality on the sending chain, or a fast transfer, which triggers the auction process. For fast transfers, users specify a maximum fee they are willing to pay and a deadline by which the auction must start. This ensures that the process is both cost-effective and timely
2. **Auction** - the auction begins on the Solana network when a user requests a fast transfer. Solvers monitor the network for these requests and initiate an auction by placing an offer to fulfill the transfer at or below the user’s specified maximum fee. To start the auction, the solver must transfer the amount of USDC requested by the user (X USDC) plus a small security deposit to the Fast Transfer hub on Solana. This deposit acts as a commitment to the process
3. **Competition** - once the auction is initiated, other solvers can participate by submitting lower bids in a reverse Dutch auction. The goal to provide end users with the best possible rate. If a new solver submits a better offer, the previous solver’s funds (X USDC and the security deposit) are returned, and the new offer takes precedence. This competitive process ensures that users receive the best possible transfer rate 
4. **Fulfillment** - the winning solver must complete the transfer within a predefined grace period to earn their fee and their security deposit back. If they fail to do so, their security deposit may be slashed, and the slashed amount is given to the user as compensation for any delays.  This mechanism incentivizes prompt execution.
Upon successful completion, the Fast Transfer hub sends the X USDC to the user’s destination wallet, and the solver receives their security deposit back along with the fee for the transfer
5. **Settle Auction** - after the user’s original transfer reaches finality on the source chain, the winning solver can use the finalized Wormhole message to settle the auction with the Fast Transfer hub. This allows the solver to retrieve the original transfer amount (X USDC) back into their wallet

In summary, the auction mechanism ensures competitive pricing and efficient execution by leveraging a marketplace of solvers. The user benefits from lower costs and faster transfers, while solvers can earn fees by participating in the auction and completing transfers promptly.

### Risk Management

## Solvers' Role and Benefits

[External] Wormhole Fast Transfer Solver Overview
Role of Solvers
Definition and importance of solvers

Solvers:
Role: Entities that facilitate and manage the liquidity necessary for transfers.
Function: Solvers provide liquidity and participate in the auctions on the hub chain. They handle transactions and ensure liquidity is available for efficient transfers. They deal primarily in USDC, simplifying liquidity management.

How solvers facilitate the transfer process
Solvers’ interaction with the auction mechanism
Benefits for Solvers
Capital Efficiency: Consolidation of liquidity on USDC
Simplified Risk and Reward Structure: Exclusive use of USDC and its benefits
New Revenue Streams: Opportunities for solvers in the evolving cross-chain transfer market

## Problem Addressed by Fast Transfers

Liquidity Fragmentation
Issues with Wormhole token bridge and liquidity fragmentation
Problems caused by multiple native tokens across different chains
Solution Provided by Fast Transfers
How Fast Transfers solve liquidity and finality challenges

Problem Addressed
Liquidity Fragmentation: The Wormhole token bridge causes significant liquidity fragmentation. Example: Transferring native USDC from Solana and Arbitrum to Sui results in two different tokens on Sui.
Multiple Native Tokens: Tokens like USDC are natively deployed on multiple chains. This creates fragmentation when the same token is transferred across different chains.

