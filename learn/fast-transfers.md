---
title: Fast Transfers
description: TODO
---

# Fast Transfers

## Introduction

what is fast transfers - Fast Transfers Description

Description: An auction mechanism involving solvers and market makers.
Protocol: Utilizes a Solana protocol for background token swaps.

Overview of what Fast Transfers aim to achieve
Purpose: Fast Transfer aims to enable quick and efficient liquidity movement between chains without waiting for the typical finality times.

Context on cross-chain transfers and their challenges
Importance of Fast Transfers in the broader blockchain ecosystem

## Key Concepts and Requirements

What Does a Chain Need to Support Fast Transfers?
CCTP USDC and NTT USDC requirements
Liquidity through Wormhole wrapped assets as an alternative
Hub and Spoke Model
Solana as the chosen hub: Reasons and advantages

## How Fast Transfers Work

How It Works:
Hub Chain: Fast Transfer uses a central hub chain (e.g., Solana) where liquidity is concentrated.
Process: When transferring assets, they move from the source chain to the hub chain. An auction occurs on the hub chain, and the assets are sent to the destination chain.
CCTP: The protocol uses CCTP (Cross-Chain Transfer Protocol) to transfer assets from the hub chain and handle asset burning and sending. (USDC)
<!--
Circle CCTP Overview
Background on CCTP and its relevance to Fast Transfers
Integration with existing Wormhole docs
Redirect to the detailed CCTP documentation
Explanation of the CCTP and NTT protocols
-->
NTT: For chains that don't support CCTP or lack canonical USDC, Fast Transfer uses NTT messages.
This approach involves locking USDC on the hub chain and sending an NTT message to the new chain.

Process:
Instead of direct chain-to-chain transfers, tokens are routed through Solana.
Solvers execute swaps to provide users with a useful token on the destination chain.

## Auction mechanism

Overview of the auction mechanism
Auction Process
Detailed Process Breakdown
Step-by-step guide: Initiation, Auction, Competition, Fulfillment, Settle Auction
Detailed steps: Auction initiation, bidding process, and finalization

How the auction ensures competitive pricing and efficiency
Risk Management
How the security deposit works
Slashing conditions and their implications
Ensuring prompt execution and reliability

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

