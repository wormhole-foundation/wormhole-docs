---
title: Gateway
description: Explore Wormhole Gateway - a Cosmos-SDK chain for bridging assets into Cosmos, enhancing liquidity and cross-chain communication with IBC integration.
---

# Gateway 

## Introduction 

The _Wormhole Gateway_, a Cosmos-SDK chain, is a critical component of the Cosmos ecosystem, bridging non-native assets from several blockchain networks. This integration is essential for guaranteeing seamless interoperability and unifying liquidity across the Cosmos chains, enhancing the functionality and accessibility of decentralized applications (dApps). The Gateway efficiently addresses issues like liquidity fragmentation and complex asset management across chains by enabling digital assets' open and secure flow.

The primary function of the Gateway is to facilitate the movement of digital assets into the Cosmos network, which is crucial for maintaining a cohesive liquidity pool essential for the operation of dApps. Moreover, the Wormhole Gateway integrates with the [Global Accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank} to prevent discrepancies in asset tracking and balances, enhancing the integrity and trustworthiness of cross-chain transactions.

Leveraging the Inter-Blockchain Communication (IBC) protocol, the Gateway enables robust and secure interactions across a diverse range of blockchain platforms. The integration of IBC highlights the Gateway's role in building a cohesive environment where assets can flow freely and securely, with consistent liquidity and fewer obstacles typically associated with cross-chain transfers.

Through its core functionalities and strategic use of the IBC protocol, the Wormhole Gateway supports the Cosmos network's infrastructure and significantly contributes to a unified and efficient blockchain ecosystem.

<!--
Create a ## section that provides an overview of IBC (basically with the content you have here, plus just an introduction sentence or two to what IBC is)

IBC section: 
## Introduction
## IBC section (w/ better name haha)
## Scaling with IBC
-->

## Inter-Blockchain Communication (IBC)

### Overview 


### IBC

The Wormhole network utilizes the Inter-Blockchain Communication (IBC) protocol, a key component of the Cosmos ecosystem, to facilitate generic message passing. IBC is integral to the Cosmos SDK, enabling chains within this ecosystem to connect and interact seamlessly. The Wormhole Gateway, a Cosmos SDK-based blockchain specifically designed for Wormhole, exemplifies this integration by using IBC to minimize operational overhead and maximize efficiency.


<!-- 
This sort of section should go before the design decision-type content in the Scaling with IBC sections. But I would expand on this. It would be nice to add a diagram similar to the NTT architecture diagrams. And at the very least, some text that covers the exact flow until we can get a diagram made. Can you please start mocking something up in Miro to share with the Sp-ce team?
-->

The Wormhole Gateway incorporates several key components that support its operations:

- **[Wormhole Core Contracts](/learn/messaging/core-contracts/){target=\_blank}** - deployed on each participating Cosmos chain, these contracts are crucial for managing the cross-chain communication, including the emission of messages and the verification of signatures from the network’s Guardians
- **IBC Shim Contract** - a specialized CosmWasm contract that handles the bridging of assets by translating between the native Wormhole message formats and those used by IBC, effectively linking the Wormhole platform with the broader Cosmos ecosystem
- **[Token Factory Module](https://github.com/CosmosContracts/juno/tree/v14.1.1/x/tokenfactory){target=\_blank}** - this module, operational on the Wormhole Gateway, is instrumental in creating tokens that represent bridged assets, facilitating their circulation within the Cosmos network

<!-- -->

Utilizing the [Inter-Blockchain Communication (IBC) protocol](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html){target=\_blank}, the Wormhole Gateway ensures secure and reliable asset transfers. IBC allows the Gateway to interact smoothly with various blockchain protocols within the Cosmos network, providing a robust framework for:

- **Asset Bridging** - facilitating the conversion and transfer of assets between disparate blockchain systems, thereby broadening their usability and application
- **Security and Integrity** - conducting thorough consistency checks to validate transactions and ensure that asset transfers are executed without discrepancies

<!-- Before diving into these sections, I think it is more important to understand how Gateway works, what the architecture looks like, how messages flow, etc. -->

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

- **Source Chain Gas** - users must cover gas fees on the source chain, such as Ethereum, to initiate transfers
- **Relayer Fee (Source Chain to Gateway)** - there is currently no cost for processing Wormhole messages from the source chain to the Gateway, although this may change in the future
- **Destination Chain Gas (Non-Cosmos)** - for non-Cosmos destination chains, gas fees must be paid by the relayer or the user in cases of manual redemption

Optional Fees: 

- **Gateway Operations** - the Gateway itself does not require gas fees to be paid by users, nor does it have token-priced metering
- **Relayer Fee (Gateway to Cosmos)** - there are no relayer fees charged for transferring messages from the Gateway to Cosmos chains
- **Destination Chain (Cosmos)** - IBC relayers cover costs on the destination chain within the Cosmos network



