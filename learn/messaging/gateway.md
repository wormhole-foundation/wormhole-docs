---
title: Gateway
description: Explore Wormhole Gateway - a Cosmos-SDK chain for bridging assets into Cosmos, enhancing liquidity and cross-chain communication with IBC integration.
---

# Gateway 

## Introduction 

The _Wormhole Gateway_, a Cosmos-SDK chain, is a critical component of the Cosmos ecosystem, bridging non-native assets from several blockchain networks. This integration is essential for guaranteeing seamless interoperability and unifying liquidity across the Cosmos chains, enhancing the functionality and accessibility of decentralized applications (dApps). By enabling the secure and open flow of digital assets, the Gateway addresses issues like liquidity fragmentation and complex asset management across chains. Leveraging the Inter-Blockchain Communication (IBC) protocol, the Gateway enhances cross-chain communication and asset transfer within the Cosmos ecosystem.

The primary function of the Gateway is to facilitate the movement of digital assets into the Cosmos network, which is crucial for maintaining a cohesive liquidity pool essential for the operation of dApps. Moreover, the Wormhole Gateway integrates with the [Global Accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank} to prevent discrepancies in asset tracking and balances, enhancing the integrity and trustworthiness of cross-chain transactions.

Through its core functionalities and strategic use of the IBC protocol, the Wormhole Gateway supports the Cosmos network's infrastructure and significantly contributes to a unified and efficient blockchain ecosystem.

## Inter-Blockchain Communication (IBC)

### Overview 

The Wormhole Gateway employs the Inter-Blockchain Communication (IBC) protocol to ensure secure and uninterrupted asset transfers across different blockchains. IBC is essential for maintaining consistent liquidity and removing the typical barriers associated with cross-chain transfers.

### IBC's Functional Role

As a critical component of the Cosmos ecosystem, the Inter-Blockchain Communication (IBC) protocol plays a crucial role in the Wormhole Gateway. It enables seamless message and data transfer between blockchain networks, simplifying the process of sending and receiving transactions. By leveraging IBC, the Gateway minimizes operational complexity and cost, ensuring smooth and efficient cross-chain interactions within the broader blockchain ecosystem. This integration enhances the overall functionality of the Wormhole network.

The following flow outlines the key steps involved in a cross-chain transaction within the Wormhole network, emphasizing the critical role of the Wormhole Gateway in facilitating secure and seamless communication between non-Cosmos chains and the Cosmos ecosystem.

1. **Message emission on source chain** - a transaction triggers a message on the source chain, captured by the Wormhole Core Contract
2. **Guardian Network validation** - the Guardian Network validates the message and creates a Verifiable Action Approval (VAA)
3. **VAA relayed to Gateway** - if the target is a Cosmos chain, the VAA is relayed to the Wormhole Gateway
4. **Gateway's role in the Cosmos ecosystem** - the Gateway receives the VAA and processes it using the IBC protocol, it ensures the VAA is correctly formatted and securely transmitted to the target Cosmos chain
5. **IBC-Enabled transmission** - using IBC, the Gateway facilitates the smooth and secure transfer of the VAA within the Cosmos network, ensuring interoperability and consistent asset handling
6. **Finalization on target Cosmos chain** - the VAA is verified on the target Cosmos chain, enabling the execution of the corresponding transaction or operation
7. **Global Accountant integration** - throughout the process, the Gateway works with the Global Accountant to maintain accurate asset tracking, ensuring the integrity of cross-chain transactions

<!-- add diagram here -->

The Wormhole Gateway incorporates several key components that support its operations:

- **[Wormhole Core Contracts](/learn/messaging/core-contracts/){target=\_blank}** - deployed on each participating Cosmos chain, these contracts are crucial for managing the cross-chain communication, including the emission of messages and the verification of signatures from the network’s Guardians
- **IBC Shim Contract** - a specialized CosmWasm contract that handles the bridging of assets by translating between the native Wormhole message formats and those used by IBC, effectively linking the Wormhole platform with the broader Cosmos ecosystem
- **[Token Factory Module](https://github.com/CosmosContracts/juno/tree/v14.1.1/x/tokenfactory){target=\_blank}** - this module, operational on the Wormhole Gateway, is instrumental in creating tokens that represent bridged assets, facilitating their circulation within the Cosmos network

Utilizing the [Inter-Blockchain Communication (IBC) protocol](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html){target=\_blank}, the Wormhole Gateway ensures secure and reliable asset transfers. IBC allows the Gateway to interact smoothly with various blockchain protocols within the Cosmos network, providing a robust framework for:

- **Asset bridging** - facilitating the conversion and transfer of assets between disparate blockchain systems, thereby broadening their usability and application
- **Security and integrity** - conducting thorough consistency checks to validate transactions and ensure that asset transfers are executed without discrepancies

## Scaling with IBC

### Operational Challenges

Traditionally, Wormhole [Guardians](/learn/infrastructure/guardians/){target=\_blank} have had to operate full nodes for each blockchain connected to Wormhole. This requirement ensures the highest levels of security and decentralization by allowing each Guardian to verify messages independently. However, this approach introduces significant operational costs and complexities, especially as more chains are added to the network, thereby challenging Wormhole's scalability.

To address these challenges, Wormhole has adopted IBC to facilitate message verification through [Tendermint light clients](https://docs.tendermint.com/v0.34/tendermint-core/light-client.html){target=\_blank}. This method significantly reduces the burden on Guardians, as IBC enables the trustless verification of messages across chains.

### Optimizing Guardian Operations

With the implementation of IBC, Guardians now primarily need to run a full node only for the Gateway. This adaptation allows Wormhole messages from any IBC-enabled chain to be passed to the Gateway via IBC. Once received, the Gateway then emits these messages to the Guardians. This streamlined approach reduces the necessity for Guardians to run multiple full nodes, instead relying on the light client functionality of IBC to verify the authenticity of cross-chain messages efficiently.

### Benefits and Impact

This strategic use of IBC lowers the operational cost and complexity of adding new chains and enhances the Wormhole network's scalability. Guardians can now support an expanded number of IBC-enabled chains without the proportional increase in resource allocation typically required. This adjustment allows Wormhole to maintain its commitment to security and decentralization while embracing the growth and dynamic nature of the blockchain ecosystem.

By leveraging IBC, Wormhole significantly optimizes its infrastructure, facilitating easier scaling and reducing the operational demands on its Guardians. This adaptation ensures that Wormhole remains a robust and versatile bridge within the Cosmos ecosystem, capable of supporting a wide range of blockchains with enhanced efficiency and reduced overhead.

## Fee Model

Using the Wormhole Gateway costs minimal fees and is designed to be as low as possible to facilitate easy and efficient cross-chain transactions.

Required fees: 

- **Source chain gas** - users must cover gas fees on the source chain, such as Ethereum, to initiate transfers
- **Relayer fee (Source chain to Gateway)** - there is currently no cost for processing Wormhole messages from the source chain to the Gateway, although this may change in the future
- **Destination chain gas (Non-Cosmos)** - for non-Cosmos destination chains, gas fees must be paid by the relayer or the user in cases of manual redemption

Optional fees: 

- **Gateway operations** - the Gateway itself does not require gas fees to be paid by users, nor does it have token-priced metering
- **Relayer fee (Gateway to Cosmos)** - there are no relayer fees charged for transferring messages from the Gateway to Cosmos chains
- **Destination chain (Cosmos)** - IBC relayers cover costs on the destination chain within the Cosmos network



