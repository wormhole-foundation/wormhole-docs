---
title: Native Token Transfers Overview
description: Explore Wormhole's Native Token Transfers for flexible cross-chain transfers with full control over token behavior, security, and integration features.
---

# Native Token Transfers

## Introduction

Wormhole's Native Token Transfers (NTT) is an open source, flexible, and composable framework for transferring tokens across blockchains. Integrators have complete control over how their tokens that use NTT behave on each chain, including the token standard, metadata, ownership, upgradeability, and custom features.

The framework offers two modes of operation for existing token deployments. In locking mode, the original token supply is preserved on a single chain. In contrast, the burning mode enables the deployment of multichain tokens, distributing the supply across various chains.

## Key Features

Wormhole's Native Token Transfers (NTT) framework offers a comprehensive and flexible solution for seamless token transfers across blockchains. Below are some of the key features that make this framework stand out:

- **Unified user experience** - tokens retain their properties on each chain, remaining completely fungible and ensuring a consistent user experience
- **No liquidity pools** - transfer tokens without the need for liquidity pools, avoiding fees, slippage, and MEV risk
- **Integrator flexibility** - retained ownership, upgrade authority, and complete customizability over token contracts
- **Advanced rate limiting** - inbound and outbound rate limits are configurable per chain and over arbitrary periods, preventing abuse while managing network congestion and allowing for controlled deployments to new chains
- **Global Accountant** - ensures accounting integrity across chains by checking that the number of tokens burned and transferred out of a chain never exceeds the number of tokens minted
- **Access control** - to prevent unauthorized calls to administrative functions, protocols can choose to assign specific functions, such as the Pauser role, to a separate address from the owner
- **Maximum composability** - open source and extensible for widespread adoption and integration with other protocols
- **Custom attestation** - optionally add external verifiers and configure custom message attestation thresholds

## Integration Paths

Integrators looking to deploy their token to connected chains can use the NTT framework or the Token Bridge. Both options carry a distinct integration path and feature set depending on your requirements, as outlined in the following sections.

### Native Token Transfers Framework

The Native Token Transfers Framework is highly customizable and ideal for applications such as a DeFi governance token deployed across multiple chains, which seeks to achieve fungible multichain liquidity and direct integration into governance processes.

- **Mechanism** - can entirely utilize a burn-and-mint mechanism or can be paired for a hub-and-spoke model
- **Security** - fully configurable rate limiting, pausing, access control, and threshold attestations. Integrated with the Global Accountant
- **Contract ownership** - retain ownership and upgrade authority of token contracts on each chain
- **Token contracts** - native contracts owned by your protocol governance
- **Integration** - streamlined, customizable framework allows for more sophisticated and bespoke deployments

The following example projects demonstrate the use of the Wormhole NTT framework through Wormhole Connect and the TypeScript SDK:

- [NTT Connect](https://github.com/wormhole-foundation/demo-ntt-connect){target=\_blank} 
- [NTT TS SDK](https://github.com/wormhole-foundation/demo-ntt-ts-sdk){target=\_blank} 

### Token Bridge

The Token Bridge offers a secure, low-effort integration suitable for applications like a Web3 game that wants to make its token tradable across multiple chains.

- **Mechanism** - solely utilizes a lock and mint model
- **Security** - preconfigured rate limiting and integrated Global Accountant
- **Contract ownership** - Token Bridge contracts are upgradeable via [Wormhole Governance](/learn/fundamentals/security/){target=\_blank}
- **Token contracts** - wrapped asset contract owned by the Wormhole Token Bridge contract, upgradeable via a 13/19 Guardian governance process
- **Integration** - straightforward and permissionless method to deploy on multiple chains

!!! note
    [Learn more](/learn/infrastructure/vaas/){target=\_blank} about the core messaging primitives in the Wormhole network. 