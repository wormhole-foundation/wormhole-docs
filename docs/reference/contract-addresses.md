---
title: Contract Addresses
description: This page documents the deployed contract addresses of the Wormhole contracts on each chain, including Core Contracts, WTT, and more.
categories: Reference
---

# Contract Addresses

## Core Contracts

!!! note
    The Core Contract is the on-chain contract deployed on each supported chain that verifies and publishes Wormhole messages. See [Core Contracts](/docs/protocol/infrastructure/core-contracts/){target=\_blank} for more details.

    A Core Contract being present in this list is not necessarily a guarantee that the chain is currently connected to Wormhole. Please check the [Supported Networks](/docs/reference/supported-networks/#live-connections){target=\_blank} section for details.

--8<-- 'text/reference/contract-addresses/core-contracts.md'

## Wrapped Token Transfers (WTT)

!!! note
    Wrapped Token Transfers (WTT) contracts lock tokens on the source chain and mint a wrapped representation on the destination chain. See [Wrapped Token Transfers](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} for more details.

--8<-- 'text/reference/contract-addresses/wtt.md'

## Guardian Governance

!!! note
    Guardian-governed ownership contracts are used where an owner is required, without adding new trust assumptions. They only accept instructions signed by a quorum of Wormhole Guardians, validated on-chain by the Wormhole Core contracts. Implementations: [EVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/wormhole/Governance.sol){target=\_blank}, [SVM](https://github.com/wormhole-foundation/native-token-transfers/blob/main/solana/programs/wormhole-governance/src/instructions/governance.rs){target=\_blank}, [Sui](https://github.com/wormhole-foundation/native-token-transfers/tree/main/sui/packages/ntt_governance){target=\_blank}.

    On SVM chains (Solana, Fogo), deployments set the admin to a [governance PDA](https://solana.com/docs/core/pda){target=\_blank} derived from the Guardian governance program. The admin address may differ from the program ID when inspecting deployments on-chain.

    The following governance PDAs are used as the admin for deployments on SVM chains:

    - **Solana:** `4iUtozoQLdJ2FV7vXe9q215ETSw1Mnt8WKP4NyqNgAxz`.
    - **Fogo:** `nWfGbhWvREnvF1zCvhrXiKidzDJ8DzCdHb13YYZeVkV`.

    On Sui, separate instances of the Move governance contract need to be deployed for each individual token due to technical reasons. The NTT CLI is able to perform such deployments for your token via "ntt sui deploy-governance --transfer".

--8<-- 'text/reference/contract-addresses/governance.md'

## Delegated Guardians

!!! note
    Delegated Guardians are a configurable subset of the full Guardian set that observe events on specific chains on the network's behalf. See [Delegated Guardian Set](/docs/reference/delegated-guardian-set/){target=\_blank} for more details.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x1462800febd49232798132e8c8b721aa86c4c209</code></td></tr></tbody></table>

## IBC

!!! note
    This configuration is for the `ibc` feature for guardians.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Wormchain</td><td><code>wormhole1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5ws2y050r</code></td></tr></tbody></table>

## Gateway

!!! note
    This configuration is for the `gatewayContract` guardian configuration.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Wormchain</td><td><code>wormhole1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqqaqfk2j</code></td></tr></tbody></table>

## Read-Only Deployments

!!! note
    Read-only deployments allow Wormhole messages to be received on chains not fully integrated with Wormhole Guardians. These deployments support cross-chain data verification but cannot originate messages. For example, a governance message can be sent from a fully integrated chain and processed on a read-only chain, but the read-only chain cannot send messages back.

--8<-- 'text/reference/contract-addresses/read-only.md'
