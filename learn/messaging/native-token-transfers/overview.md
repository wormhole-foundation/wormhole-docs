---
title: Native Token Transfers Overview
description: Explore Wormhole's Native Token Transfers for flexible cross-chain transfers with full control over token behavior, security, and integration features.
---

# Native Token Transfers

!!!tip "Looking to deploy NTT?"
    If you're ready to deploy NTT or access the CLI, follow the detailed [NTT Deployment Section](/docs/build/contract-integrations/native-token-transfers/deployment-process/){target=\_blank}.  

     - For deployment steps on EVM, visit the [Deploy to EVM page](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/){target=\_blank}  
     - For deployment steps on Solana, visit the [Deploy to Solana page](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/){target=\_blank}

## Introduction

Wormhole's Native Token Transfers (NTT) is an open source, flexible, and composable framework for transferring tokens across blockchains. By eliminating wrapped assets, NTT preserves each token’s native properties across chains, letting you maintain complete control over metadata, ownership, upgrade authority, and other custom features.

The framework offers two modes of operation for existing token deployments. In locking mode, the original token supply is preserved on a single chain. In contrast, the burning mode enables the deployment of multichain tokens, distributing the supply across various chains.

## Key Features

Wormhole's Native Token Transfers (NTT) framework offers a comprehensive and flexible solution for seamless token transfers across blockchains. Below are some of the key features that make this framework stand out:

- **No wrapped tokens** – tokens remain native on every chain where NTT is deployed. All token properties and metadata remain consistent, avoiding any confusion or overhead introduced by wrapped tokens
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

- **Mechanism** - solely utilizes a lock and mint model. Unlike NTT, the Token Bridge issues a wrapped asset on the destination chain, rather than preserving the original token contract
- **Security** - preconfigured rate limiting and integrated Global Accountant
- **Contract ownership** - Token Bridge contracts are upgradeable via [Wormhole Governance](/docs/learn/fundamentals/security/){target=\_blank}
- **Token contracts** - wrapped asset contract owned by the Wormhole Token Bridge contract, upgradeable via a 13/19 Guardian governance process
- **Integration** - straightforward and permissionless method to deploy on multiple chains

!!! note
    [Learn more](/docs/learn/infrastructure/vaas/){target=\_blank} about the core messaging primitives in the Wormhole network. 

## Supported Token Standards

Native Token Transfers (NTT) in Wormhole primarily support **ERC-20 tokens**, the most widely used standard for fungible tokens on the Ethereum network and other EVM-compatible blockchains. The NttManager contract leverages the IERC20 interface and SafeERC20 utility from OpenZeppelin to ensure secure and efficient token transfers. Additionally, it supports ERC-20 Burnable tokens, allowing tokens to be burned on the source chain when needed for cross-chain transfers. At this time, NTT focuses on ERC-20 tokens, and other token standards, such as ERC-721 (non-fungible tokens) or ERC-1155 (multi-token standard), are not natively supported.
