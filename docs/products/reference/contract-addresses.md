---
title: Contract Addresses
description: This page documents the deployed contract addresses of the Wormhole contracts on each chain, including Core Contracts, TokenBridge, and more.
categories: Reference
---

# Contract Addresses

## Core Contracts

--8<-- 'text/products/reference/contract-addresses/core-contracts.md'

## Wrapped Token Transfers (WTT)

--8<-- 'text/products/reference/contract-addresses/wtt.md'

## CCTP

--8<-- 'text/products/reference/contract-addresses/cctp.md'

## Settlement Token Router

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Solana</td><td><code>28topqjtJzMnPaGFmmZk68tzGmj9W9aMntaEK3QkgtRe</code></td></tr><tr><td>Arbitrum</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Avalanche</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Base</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Optimism</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr><tr><td>Polygon</td><td><code>0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Solana</td><td><code>tD8RmtdcV7bzBeuFgyrFc8wvayj988ChccEzRQzo6md</code></td></tr><tr><td>Arbitrum Sepolia</td><td><code>0xe0418C44F06B0b0D7D1706E01706316DBB0B210E</code></td></tr><tr><td>Optimism Sepolia</td><td><code>0x6BAa7397c18abe6221b4f6C3Ac91C88a9faE00D8</code></td></tr></tbody></table>

## Executor

--8<-- 'text/products/reference/contract-addresses/executor.md'

## Quoter Router

--8<-- 'text/products/reference/contract-addresses/quoter-router.md'

--8<-- 'text/products/reference/contract-addresses/quoter-public-keys.md'

## Wormhole Labs Quoter Implementation

--8<-- 'text/products/reference/contract-addresses/wh-quoter-implementation.md'

--8<-- 'text/products/reference/contract-addresses/quoter-public-keys.md'

## Guardian Governance

--8<-- 'text/products/reference/contract-addresses/governance.md'

!!! note
    Guardian-governed ownership contracts are used where an owner is required, without adding new trust assumptions. They only accept instructions signed by a quorum of Wormhole Guardians, validated on-chain by the Wormhole Core contracts. Implementations: [EVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/wormhole/Governance.sol){target=\_blank} and [SVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/programs/wormhole-governance/src/instructions/governance.rs){target=\_blank}.

    On SVM chains (Solana, Fogo), deployments set the admin to a [governance PDA](https://solana.com/docs/core/pda){target=\_blank} derived from the Guardian governance program. The admin address may differ from the program ID when inspecting deployments on-chain.

    The following governance PDAs are used as the admin for deployments on SVM chains:

    - **Solana:** `4iUtozoQLdJ2FV7vXe9q215ETSw1Mnt8WKP4NyqNgAxz`.
    - **Fogo:** `nWfGbhWvREnvF1zCvhrXiKidzDJ8DzCdHb13YYZeVkV`.

    On Sui, separate instances for the Move governance contract need to be deployed for each individual token due to technical reasons. The NTT CLI is able to perform such deployments for your token via "ntt sui deploy-governance --transfer".


## Delegated Guardians

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x1462800febd49232798132e8c8b721aa86c4c209</code></td></tr></tbody></table>

## IBC

This configuration is for the `ibc` feature for guardians.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Wormchain</td><td><code>wormhole1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5ws2y050r</code></td></tr></tbody></table>

## Gateway

This configuration is for the `gatewayContract` guardian configuration.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Wormchain</td><td><code>wormhole1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqqaqfk2j</code></td></tr></tbody></table>

## Read-Only Deployments

--8<-- 'text/products/reference/contract-addresses/read-only.md'

!!! note
    Read-only deployments allow Wormhole messages to be received on chains not fully integrated with Wormhole Guardians. These deployments support cross-chain data verification but cannot originate messages. For example, a governance message can be sent from a fully integrated chain and processed on a read-only chain, but the read-only chain cannot send messages back.
