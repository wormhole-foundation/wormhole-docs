---
title: Contract Addresses
description: This page documents the deployed contract addresses of the Wormhole contracts on each chain, including Core Contracts, TokenBridge, and more.
categories: Reference
---

# Contract Addresses

## Core Contracts

--8<-- 'text/build/reference/contract-addresses/core-contracts.md'

## Token Bridge

--8<-- 'text/build/reference/contract-addresses/token-bridge.md'

## Wormhole Relayer

--8<-- 'text/build/reference/contract-addresses/relayer.md'

## CCTP

--8<-- 'text/build/reference/contract-addresses/cctp.md'

## Settlement Token Router

=== "Mainnet"

    | Chain Name           | Contract Address                                |
    |----------------------|-------------------------------------------------|
    | Ethereum             |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |
    | Solana               |  `28topqjtJzMnPaGFmmZk68tzGmj9W9aMntaEK3QkgtRe` |
    | Arbitrum             |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |
    | Avalanche            |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |
    | Base                 |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |
    | Optimism             |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |
    | Polygon              |  `0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47`   |

=== "Testnet"

    | Chain Name           | Contract Address                                |
    |----------------------|-------------------------------------------------|
    | Solana               |  `tD8RmtdcV7bzBeuFgyrFc8wvayj988ChccEzRQzo6md`  |
    | Arbitrum Sepolia     |  `0xe0418C44F06B0b0D7D1706E01706316DBB0B210E`   |
    | Optimism Sepolia     |  `0x6BAa7397c18abe6221b4f6C3Ac91C88a9faE00D8`   |
    

## Read-Only Deployments

--8<-- 'text/build/reference/contract-addresses/read-only.md'

!!!note  
    Read-only deployments allow Wormhole messages to be received on chains not fully integrated with Wormhole Guardians. These deployments support cross-chain data verification but cannot originate messages. For example, a governance message can be sent from a fully integrated chain and processed on a read-only chain, but the read-only chain cannot send messages back.

