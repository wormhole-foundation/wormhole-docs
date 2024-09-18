---
title: Contract Addresses
description: This page documents the deployed contract addresses of the Wormhole contracts on each chain, including Core Contracts, NFTBridge, TokenBridge, and more.
---

# Contract Addresses

## Core Contracts

--8<-- 'text/build/reference/contract-addresses/core-contracts.md'

## Token Bridge

--8<-- 'text/build/reference/contract-addresses/token-bridge.md'

## NFT Bridge

--8<-- 'text/build/reference/contract-addresses/nft-bridge.md'

## Wormhole Relayer

--8<-- 'text/build/reference/contract-addresses/relayer.md'

## CCTP

--8<-- 'text/build/reference/contract-addresses/cctp.md'

## Gateway

=== "MainNet"

    | Contract              | Address                                                               |
    |-----------------------|-----------------------------------------------------------------------|
    | Wormhole Core Bridge  | `wormhole1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqqaqfk2j` |
    | Wormhole Token Bridge | `wormhole1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjq4lyjmh` |
    | IBC Translator        | `wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx` |

=== "TestNet"

    | Contract              | Address                                                               |
    |-----------------------|-----------------------------------------------------------------------|
    | Wormhole Core Bridge  | `wormhole16jzpxp0e8550c9aht6q9svcux30vtyyyyxv5w2l2djjra46580wsazcjwp` |
    | Wormhole Token Bridge | `wormhole1aaf9r6s7nxhysuegqrxv0wpm27ypyv4886medd3mrkrw6t4yfcnst3qpex` |
    | IBC Translator        | `wormhole1ctnjk7an90lz5wjfvr3cf6x984a8cjnv8dpmztmlpcq4xteaa2xs9pwmzk` |


## Fast Transfers

This section provides the MainNet contract addresses for various components of the Fast Transfers protocol, including the Matching Engine, Token Router, and Upgrade Manager. Each contract is listed with its associated chain name and address, for the associated `chainId` refer to the [Chain IDs](/docs/build/reference/chain-ids/){target=\_blank} page.

=== "MatchingEngineProxy"

    | Chain Name | Address                                      |
    |------------|----------------------------------------------|
    | Solana     | HtkeCDdYY4i9ncAxXKjYTx8Uu3WM8JbtiLRYjtHwaVXb |

=== "UpgradeManager"

    | Chain Name | Address                                      |
    |------------|----------------------------------------------|
    | Solana     | 4jyJ7EEsYa72REdD8ZMBvHFTXZ4VYGQPUHaJTajsK8SN | 


### Token Router


=== "TokenRouterProxy"

    | Chain Name | Address                                      | Constructor Arguments            |
    |------------|----------------------------------------------|----------------------------------|
    | Solana     | 28topqjtJzMnPaGFmmZk68tzGmj9W9aMntaEK3QkgtRe |                                  |
    | Base       | 0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47   | 0xE33C682aA6F7F6E31F0E861aAcCd7dB9C002B965, 0x439fab9100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014420e8aa32c31626f7f31d6fcc154eeccd6e6e9cb000000000000000000000000 |
    | Arbitrum   | 0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47   | 0xE33C682aA6F7F6E31F0E861aAcCd7dB9C002B965, 0x439fab9100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014420e8aa32c31626f7f31d6fcc154eeccd6e6e9cb000000000000000000000000 |

=== "TokenRouterImplementation"

    | Chain Name | Address                                      | Constructor Arguments            |
    |------------|----------------------------------------------|----------------------------------|
    | Base       | 0xB2BCa2A79f7C99aA684A14303d368ffDbc4307e9   | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6, 0x1682Ae6375C4E4A97e4B583BC394c861A46D8962, 1, 0x74e70ed52464f997369bbefd141d8a2d9dd3cd15e1f21b37bce18f45e0e923b2, 0xf4c8473a0e8fb093ca12970ed615db09f7ebbbb3d00f40b3e285e12f40e5c9a6, 5|
    | Arbitrum   | 0xB2BCa2A79f7C99aA684A14303d368ffDbc4307e9   | 0xaf88d065e77c8cC2239327C5EDb3A432268e5831, 0xa5f208e072434bC67592E4C49C1B991BA79BCA46, 0x19330d10D9Cc8751218eaf51E8885D058642E08A, 1, 0x74e70ed52464f997369bbefd141d8a2d9dd3cd15e1f21b37bce18f45e0e923b2, 0xf4c8473a0e8fb093ca12970ed615db09f7ebbbb3d00f40b3e285e12f40e5c9a6, 5|