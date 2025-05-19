---
title: Wormhole Connect
description: With Wormhole Connect, you can seamlessly bridge digital assets and data across a wide range of supported blockchain networks.
categories: Connect, Transfer

---

# Wormhole Connect Overview 

With the Wormhole Connect React widget, you can enable your users to perform cross-chain asset transfers directly within your web application, powered by the Wormhole protocol's easy-to-use interface.

## Features

Wormhole Connect offers flexible customization to match your application. Tailor technical aspects like supported assets and custom RPCs, or use the full-featured default widget. Its UI is also highly adaptable, offering extensive styling options, including a no-code visual interface. Connect’s features include:

- Multiple ways to bridge assets (routes)
- Extensive ways to style the UI (including the no-code styling interface)
- Ways to configure what feature set to offer
- Configure any token for bridging via Wormhole
- Option to drop off some gas at the destination

Be sure to check the [features page](docs/build/transfers/connect/features/){target=\_blank} for more details about Wormhole Connect's features and a breakdown of supported features by chain.

## How It Works

Think of Wormhole Connect as a ready-made interface that simplifies the process of bridging assets across different blockchains. When a user initiates a transfer using the widget:

1.  **Initiation** - select the asset, the originating blockchain, and the target blockchain for the transfer
2.  **Connection** - establish a link between your wallet and the chosen source blockchain
3.  **Transaction Submission on Source Chain** - confirm the transfer details to trigger the asset lock or deposit on the initial blockchain
4.  **Wormhole Message Creation** - Wormhole's network observes the source transaction, and Guardians validate it to generate the cross-chain proof 
5.  **Message Relaying** -  the generated CCT or VAA is transmitted across the Wormhole network to the intended destination blockchain
6.  **Transaction on Destination Chain** - Wormhole's contracts on the target blockchain receive and verify the incoming CCT or VAA
7.  **Asset Release/Minting** - upon successful verification, the equivalent assets are either released as wrapped assets  or newly created on the destination blockchain and delivered to your wallet

## Use Cases

Here are key use cases that highlight the power and versatility of the Token Bridge.

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – handles user-friendly asset transfers
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – moves native assets across chains
    - [**Queries**](/docs/build/queries/overview/) – fetches real-time prices for optimal trade execution


- **Cross-Chain Payment Widgets**

    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/) – facilitates seamless payments in various tokens
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/) – ensures direct, native asset transfers

## Next Steps 

Ready to integrate Wormhole Connect into your application? Explore these tutorials to get started:

- [Integrate Connect into a React DApp Tutorial](/docs/tutorials/connect/react-dapp/){target=\_blank}—Follow this guide to learn how to embed the Wormhole Connect widget into your React application, including package installation and component integration.

- [Multichain Swap Tutorial](/docs/tutorials/connect/multichain-swap/){target=\_blank}—This step-by-step tutorial demonstrates how to integrate the Connect widget into your React dApp to enable cross-chain token transfers, using Sui to Avalanche Fuji as a practical example applicable to other networks.

[timeline(wormhole-docs/.snippets/text/products/messaging/overview/connect-timeline.json)]