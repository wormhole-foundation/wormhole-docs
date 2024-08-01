---
title: Native Token Transfers
description: 
---

# Native Token Transfers

## Overview

Wormhole’s Native Token Transfers (NTT) is an open source, flexible, and composable framework for transferring tokens across blockchains. Integrators have full control over how their tokens that use NTT behave on each chain, including the token standard, metadata, ownership, upgradeability, and custom features.

For existing token deployments, the framework can be used in locking mode which preserves the original token supply on a single chain. Otherwise, the framework can be used in burning mode to deploy natively multichain tokens with the supply distributed among multiple chains.

### Key Features

- **Unified user experience** - tokens retain their properties on each chain, remaining completely fungible and ensuring a consistent user experience.
- **No liquidity pools** - transfer tokens without the need for liquidity pools, avoiding fees, slippage, and MEV risk
- **Integrator flexibility** - retained ownership, upgrade authority, and complete customizability over token contracts
- **Advanced rate limiting** - inbound and outbound rate limits are configurable per chain and over arbitrary time periods, preventing abuse while managing network congestion and allowing for controlled deployments to new chains
- **Global accountant** - ensures accounting integrity across chains by checking that the number of tokens burned and transferred out of a chain never exceeds the number of tokens minted
- **Access control** - to prevent unauthorized calls to administrative functions, protocols can choose to assign certain functions, such as the pauser role, to a separate address from the owner
- **Maximum composability** - open-source and extensible for widespread adoption and integration with other protocols
- **Custom attestation** - optionally add external verifiers and configure custom message attestation thresholds

Integrators looking to deploy their token to connected chains can use the NTT framework or the Token Bridge. Both options carry a distinct integration path and feature set depending on your requirements:

### Native Token Transfers

Highly customizable. For example, a DeFi governance token deployed on multiple chains that wants fungible multichain liquidity, and direct integration into governance processes.

- **Mechanism** - can entirely utilize a burn and mint mechanism or can be paired for a hub and spoke model
- **Security** - fully configurable rate limiting, pausing, access control and threshold attestations. Integrated with Global Accountant
- **Contract ownership** - retain ownership and upgrade authority of token contracts on each chain
- **Token contracts** - native contracts owned by your protocol governance
- **Integration** - streamlined, customizable framework allows for more sophisticated and bespoke deployments

### Token Bridge

A secure, low lift integration. For example, a web3 game that wants their token to be tradable across multiple chains.

- **Mechanism** - Solely utilizes a lock and mint model
- **Security** - Preconfigured rate limiting and integrated Global Accountant
- **Contract** ownership - Token Bridge contracts are upgradeable via [Wormhole Governance](/learn/security/){target=\_blank}
- **Token contracts** - Wrapped asset contract owned by the Wormhole Token Bridge contract, upgradeable via a 13/19 Guardian governance process
- **Integration** - Straightforward and permissionless method to deploy on multiple chains

!!! note
    [Learn more](#){target=\_blank} about the core messaging primitives in the Wormhole network. <!-- link to vaas -->


## System Components

There are two basic components to NTT.

### Managers

Manage the token and the transceivers, handle rate limiting, and message attestation. Each `NttManager` corresponds to a single token but can control multiple transceivers. Key functions include:

- `transfer` - initiates a token transfer process, involving token locking or burning on the source chain
- `quoteDeliveryPrice` - quotes the fee for delivering a message to a specific target chain by querying and aggregating quotes from the Transceiver contracts
- `setPeer` - establishes trust between different instances of NTT manager contracts across chains by cross-registering them as peers, ensuring secure communication

### Transceivers

Responsible for sending NTT transfers forwarded through the manager on the source chain and delivered to a corresponding peer manager on the recipient chain. These contracts are responsible for encoding, sending, receiving, and decoding messages across chains, ensuring the seamless transfer of tokens. Transceivers can be defined independently of Wormhole core and can be modified to support any verification backend. Key functions:

- `sendMessage` - this external function is used to send messages to a specified recipient chain. It encodes the token transfer details into a message format recognized by the system
- `quoteDeliveryPrice` - provides an estimation of the cost associated with delivering a message to a target chain, and gauges transaction fees

![NTT arcgitecture diagram](/images/learn/messaging/messaging-1.webp)

!!! note
    [Learn more](#){target=\_blank} about the architecture of Native Token Transfers message lifecycles.
<!-- this takes to https://docs.wormhole.com/wormhole/native-token-transfers/architecture -->

## Deployment Models

### Hub and Spoke

### Burn and Mint