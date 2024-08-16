---
title: Gateway
description: TODO
---

<!--
[link](#){target=\_blank}
![img description](/images/learn/introduction/introduction-1.webp)
`
```ts
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```
=== "Testnet"
```sh
```
```text
```
- `variable` ++"type"++ - description
-->

# Gateway 

## Introduction 

The _Wormhole Gateway_ is a Cosmos-SDK chain designed to bridge non-native assets into the Cosmos ecosystem. It is pivotal in ensuring unified liquidity across Cosmos chains, facilitating seamless asset transfers and communication across different blockchain networks.

In addition to facilitating asset transfers, _Wormhole Gateway_ (FKA `wormchain`, AKA `Shai-Hulud`) allows Wormhole to ensure proper accounting with the [Global Accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank}. 


### Core Functionality and Purpose

The primary function of the Wormhole Gateway is to enable the movement of digital assets from various blockchains into the Cosmos network, enhancing interoperability and connectivity. This integration helps maintain a cohesive liquidity pool across the Cosmos ecosystem, essential for efficiently operating decentralized applications (DApps) and services.

### Integration with Inter-Blockchain Communication (IBC)

Utilizing the Inter-Blockchain Communication (IBC) protocol, the Wormhole Gateway ensures secure and reliable asset transfers. IBC allows the Gateway to interact fluidly with various blockchain protocols within the Cosmos network, providing a robust framework for:

- **Asset Bridging** - facilitating the conversion and transfer of assets between disparate blockchain systems, thereby broadening their usability and application
- **Security and Integrity** - conducting thorough consistency checks to validate transactions and ensure that asset transfers are executed without discrepancies

## Leveraging IBC for Enhanced Scalability and Efficiency

### Overview of IBC's Role in Wormhole

The Wormhole network utilizes the Inter-Blockchain Communication (IBC) protocol, a cornerstone of the Cosmos ecosystem, to facilitate generic message passing. IBC is integral to the Cosmos SDK, enabling chains within this ecosystem to connect and interact seamlessly. The Wormhole Gateway, a Cosmos SDK-based blockchain specifically designed for Wormhole, exemplifies this integration by using IBC to minimize operational overhead and maximize efficiency.

### Operational Challenges and IBC's Solution

Traditionally, Wormhole guardians (nodes responsible for maintaining network security and verifying cross-chain messages) have had to operate full nodes for each blockchain connected to Wormhole. This requirement ensures the highest levels of security and decentralization by allowing each guardian to verify messages independently. However, this approach introduces significant operational costs and complexities, especially as more chains are added to the network, thereby challenging Wormhole's scalability.

To address these challenges, Wormhole has adopted IBC to facilitate message verification through Tendermint light clients. This method significantly reduces the burden on guardians, as IBC enables the trustless verification of messages across chains.

### Streamlining Guardian Operations

With the implementation of IBC, guardians now primarily need to run a full node only for the Wormchain. This adaptation allows Wormhole messages from any IBC-enabled chain to be passed to Wormchain via IBC. Once received, Wormchain then emits these messages to the guardians. This streamlined approach reduces the necessity for guardians to run multiple full nodes, instead relying on the light client functionality of IBC to verify the authenticity of cross-chain messages efficiently.

### Benefits and Impact

This strategic use of IBC lowers the operational cost and complexity associated with adding new chains and enhances the Wormhole network's scalability. Guardians can now support an expanded number of IBC-enabled chains without the proportional increase in resource allocation typically required. This adjustment allows Wormhole to maintain its commitment to security and decentralization while embracing the growth and dynamic nature of the blockchain ecosystem.

By leveraging IBC, Wormhole significantly optimizes its infrastructure, facilitating easier scaling and reducing the operational demands on its guardians. This adaptation ensures that Wormhole remains a robust and versatile bridge within the Cosmos ecosystem, capable of supporting a wide range of blockchains with enhanced efficiency and reduced overhead.

## Fee Structure

Using the Wormhole Gateway costs minimal fees and is designed to be as low as possible to facilitate easy and efficient cross-chain transactions.

- **Source Chain Gas** - users must cover gas fees on the source chain, such as Ethereum, to initiate transfers
- **Relayer Fee [Source Chain to Gateway]** - there is currently no cost for processing Wormhole messages from the source chain to the Gateway, although this may change in the future
- **Destination Chain Gas (Non-Cosmos)** - for non-Cosmos destination chains, gas fees must be paid by the relayer or the user in cases of manual redemption
- **Gateway Operations** - the Gateway itself does not require gas fees to be paid by users, nor does it have token-priced metering
- **Relayer Fee [Gateway to Cosmos]** - there are no relayer fees charged for transferring messages from the Gateway to Cosmos chains
- **Destination Chain (Cosmos)** - costs on the destination chain within the Cosmos network are covered by IBC relayers

## Components and Features

The Wormhole Gateway incorporates several key components that support its operations:

- **Wormhole Core Contracts** - deployed on each participating Cosmos chain, these contracts are crucial for managing the cross-chain communication, including the emission of messages and the verification of signatures from the network’s Guardians
- **IBC Shim Contract** - a specialized CosmWasm contract that handles the bridging of assets by translating between the native Wormhole message formats and those used by IBC, effectively linking the Wormhole platform with the broader Cosmos ecosystem
- **Token Factory Module** - this module, operational on the Wormhole Gateway, is instrumental in creating tokens that represent bridged assets, facilitating their circulation within the Cosmos network

## Security

Security is critical in any bridging protocol due to the risks of cross-chain attacks and vulnerabilities. The Wormhole Gateway incorporates several layers of security:

- **Guardian Network** - a set of nodes that monitor and validate the cross-chain messages and transactions, maintaining network security and integrity
- **Automated Checks** - automated systems to monitor the health and performance of the network, ensuring that operations are running smoothly and securely
- **Consistency Checks** - the Gateway includes systems to ensure that the data being transferred between chains remains consistent and that transactions are finalized only once they are fully validated






