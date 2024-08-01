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

This model is ideal for existing token deployments that do not want to alter existing token contracts, maintaining the canonical balance on a hub chain whilst allowing for secure native deployment to new blockchains.

The hub and spoke model involves locking tokens on a central hub chain and minting them on destination spoke chains. This model maintains the total supply on the hub chain and is backward-compatible with any existing token deployment.

- **Hub chain** - tokens are locked when initiating a transfer
- **Spoke chains** - Equivalent tokens are minted on the destination chain

When transferring back to the original hub chain, tokens are burned on the source spoke chain and unlocked on the hub chain. When transferring between spoke chains, tokens are burned on the source spoke chain and minted on the destination spoke chain.

### Burn and Mint

This model is best suited for new token deployments or projects willing to upgrade existing contracts.

The burn and mint model involves burning tokens on the source chain and minting them on the destination chain. This results in a simplified multichain transfer process, distributes the total supply across multiple chains, and results in a natively multichain token.

- **Source chain** - tokens are burned when initiating a transfer
- **Destination chain** - equivalent tokens are minted on the destination chain

## Security

**Global Accountant**

Global Accountant is a defense-in-depth security feature that performs integrity checks on every token transfer. This feature essentially isolates chain balances, ensuring that there cannot be more tokens burned and transferred out of a chain than were ever minted.

This CosmWasm-based module acts as a smart contract on Wormhole Gateway and ensures that fungibility of native assets remain in 1:1 parity. At no time will assets coming from a spoke chain exceed the number of native assets sent to that spoke chain. Accounting is enforced transparently by Wormhole guardians, who will not attest to an NTT transfer if it violates checks.

Contact Wormhole contributors if you are interested in having Global Accountant configured for your multichain deployment.

**Governance and Upgradeability**

Integrators should implement governance mechanisms to manage the addition and removal of transceivers and to `upgrade` contracts using proxy patterns as demonstrated in the upgrade functions in the `NttManager` contracts. These processes can also set thresholds and rules for attestation and message approval.

The registry component of the NTT system is crucial for maintaining a trusted list of transceivers and managing their status. Governance processes for the following actions can be submitted directly to the corresponding contract on-chain, whether it is one or multiple of the bridging contracts, or one of the token contracts:

- Registering or deregistering a transceiver address
- Setting the token contract address on a bridging contract
- Setting the Wormhole core bridge contract address on a bridging contract
- Setting the registered bridging contract address on the token contract

This governance model ensures that the system remains secure while adaptable in response to new requirements in any environment it is deployed.

## Custom Transceivers

NTT has the flexibility to support custom message verification in addition to Wormhole Guardian message verification. Custom verifiers are implemented as Transceiver contracts and can be protocol-specific or provided by other third-party attesters. Protocols can also configure the threshold of attestations required to mark a token transfer as valid — for example 2/2, 2/3, 3/5, etc.

![Custom Attestation with NTT diagram](/images/learn/messaging/messaging-2.webp)

The verifier performs checks based on predefined criteria and issues approval for transactions that meet these requirements. This approval is incorporated into the Wormhole message, ensuring that only transactions verified by both the Wormhole Guardian network and the additional verifier are processed. model incorporates an extra verifier(s) into the bridging process, enhancing security and providing an added assurance of transaction integrity.

For more details, to collaborate or see examples of custom transceivers, contact Wormhole contributors.

