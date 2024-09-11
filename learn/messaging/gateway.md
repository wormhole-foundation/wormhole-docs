---
title: Cosmos Gateway
description: Explore Cosmos Gateway - a Cosmos-SDK chain for bridging assets into Cosmos, enhancing liquidity, and cross-chain communication with IBC integration.
---

# Cosmos Gateway 

## Introduction 

The _Cosmos Gateway_, a Cosmos-SDK chain, plays a critical role in the Cosmos ecosystem by bridging non-native assets from several blockchain networks. This integration enhances the interoperability and liquidity of the Cosmos chains, thereby improving the functionality and accessibility of decentralized applications (dApps). By leveraging the Inter-Blockchain Communication (IBC) protocol, the Gateway facilitates secure and efficient cross-chain communication and asset transfers. 

The Gateway's primary function is to unify liquidity within the Cosmos network, which is essential for the seamless operation of dApps. Additionally, its integration with the [Global Accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank} ensures accurate asset tracking and balances, reinforcing the integrity of cross-chain transactions.

This guide details the core components of the Gateway, outlines the message flow within the Gateway, and explains how the IBC protocol is integrated throughout these processes.

## Cross-Chain Transaction Flow

The following flow outlines the key steps involved in a cross-chain transaction within the Wormhole network, emphasizing the critical role of the Cosmos Gateway in facilitating secure and seamless communication between non-Cosmos chains and the Cosmos ecosystem.

1. **Message emission on source chain** - a transaction triggers a message on the source chain, captured by the Wormhole Core Contract
2. **Guardian Network validation** - the Guardian Network validates the message and creates a Verifiable Action Approval (VAA)
3. **VAA relayed to IBC relayer** - if the target is a Cosmos chain, the VAA is relayed to an IBC relayer, which is responsible for securely transmitting the VAA to the Cosmos Gateway
4. **Gateway processes the VAA** - the Gateway receives the VAA from the IBC relayer and processes it using the IBC Shim Contract, ensuring the VAA is correctly formatted to an IBC-compatible message and securely transmitted to the target Cosmos chain, ensuring interoperability and consistent asset handling within the Cosmos network
5. **Finalization on target Cosmos chain** - the VAA is verified on the target Cosmos chain, enabling the execution of the corresponding transaction or operation
6. **Global Accountant integration** - throughout the process, the Gateway works with the Global Accountant to maintain accurate asset tracking, ensuring the integrity of cross-chain transactions

<!-- add diagram here -->

## Inter-Blockchain Communication (IBC)

The Cosmos Gateway employs the [Inter-Blockchain Communication (IBC) protocol](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html){target=\_blank} to ensure secure and uninterrupted asset transfers across different blockchains. IBC is essential for maintaining consistent liquidity and removing the typical barriers associated with cross-chain transfers.

IBC is central to the Cosmos Gateway's functionality, enabling seamless data and message transfers across blockchain networks. It reduces operational complexity and costs, ensuring the Gateway operates efficiently within the Cosmos ecosystem. By allowing the Gateway to interact smoothly with various blockchain protocols, IBC provides a robust framework for:

- **Asset bridging** - facilitating the conversion and transfer of assets between disparate blockchain systems, thereby broadening their usability and application
- **Security and integrity** - conducting thorough consistency checks to validate transactions and ensure that asset transfers are executed without discrepancies

Several key components support the Cosmos Gateway's operations:

- **[Wormhole Core Contracts](/learn/infrastructure/core-contracts/){target=\_blank}** - deployed on each participating Cosmos chain, these contracts are crucial for managing the cross-chain communication, including the emission of messages and the verification of signatures from the network’s Guardians
- **IBC Shim Contract** - a specialized CosmWasm contract that handles the bridging of assets by translating between the native Wormhole message formats and those used by IBC, effectively linking the Wormhole platform with the broader Cosmos ecosystem
- **[Token Factory Module](https://github.com/CosmosContracts/juno/tree/v14.1.1/x/tokenfactory){target=\_blank}** - this module, operational on the Cosmos Gateway, is instrumental in creating tokens that represent bridged assets, facilitating their circulation within the Cosmos network
- **[Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank}** - if an IBC-enabled chain already has a Wormhole Core Contract, the existing contract can be migrated to the new `wormhole-ibc` bytecode, eliminating the need to redeploy and re-instantiate Token Bridge contracts. This streamlines the integration process and ensures compatibility with the IBC framework
- **IBC Composability Middleware** - built on top of the [Packet Forwarding Module (PFM)](https://github.com/strangelove-ventures/packet-forward-middleware){target=\_blank} and IBC Hooks middleware, it integrates their functionalities seamlessly. This middleware enables integrators on Cosmos chains to support both inter-Cosmos and Cosmos-to-external flows using a unified payload structure

## Scaling with IBC

### Operational Challenges

Traditionally, Wormhole [Guardians](/learn/infrastructure/guardians/){target=\_blank} have had to operate full nodes for each blockchain connected to Wormhole. This requirement ensures the highest levels of security and decentralization by allowing each Guardian to verify messages independently. However, this approach introduces significant operational costs and complexities, presenting a challenge to Wormhole's scalability as more chains are added to the network.

To address these challenges, Wormhole has adopted IBC to facilitate message verification through [Tendermint light clients](https://docs.tendermint.com/v0.34/tendermint-core/light-client.html){target=\_blank}. This method significantly reduces the burden on Guardians, as IBC enables the trustless verification of messages across chains.

### Optimizing Guardian Operations

With the implementation of IBC, Guardians now primarily need to run a full node only for the Gateway. This adaptation allows Wormhole messages from any IBC-enabled chain to be passed to the Gateway via IBC. Once received, the Gateway then emits these messages to the Guardians. This streamlined approach reduces the necessity for Guardians to run multiple full nodes, instead relying on the light client functionality of IBC to verify the authenticity of cross-chain messages efficiently.

### Benefits and Impact

This strategic use of IBC lowers the operational cost and complexity of adding new chains and enhances the Wormhole network's scalability. Guardians can now support an expanded number of IBC-enabled chains without the proportional increase in resource allocation typically required. This adjustment allows Wormhole to maintain its commitment to security and decentralization while embracing the growth and dynamic nature of the blockchain ecosystem.

By leveraging IBC, Wormhole significantly optimizes its infrastructure, facilitating easier scaling and reducing the operational demands on its Guardians. This adaptation ensures that Wormhole remains a robust and versatile bridge within the Cosmos ecosystem, capable of supporting a wide range of blockchains with enhanced efficiency and reduced overhead.

## Fee Model

Fees to use the Cosmos Gateway are minimal and are designed to be as low as possible to facilitate easy and efficient cross-chain transactions.

Required fees: 

- **Source chain gas** - users must cover gas fees on the source chain, such as Ethereum, to initiate transfers
- **Relayer fee (source chain to Gateway)** - there is currently no cost for processing Wormhole messages from the source chain to the Gateway, although this may change in the future
- **Destination chain gas (non-Cosmos)** - for non-Cosmos destination chains, gas fees must be paid by the relayer or the user in cases of manual redemption

Optional fees: 

- **Gateway operations** - the Gateway itself doesn't require gas fees to be paid by users, nor does it have token-priced metering
- **Relayer fee (Gateway to Cosmos)** - there are no relayer fees charged for transferring messages from the Gateway to Cosmos chains
- **Destination chain (Cosmos)** - IBC relayers cover costs on the destination chain within the Cosmos network



