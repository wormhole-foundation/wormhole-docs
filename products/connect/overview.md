---
title: Wormhole Connect
description: With Wormhole Connect, you can seamlessly bridge digital assets and data across a wide range of supported blockchain networks.
categories: Connect, Transfer
---

# Connect Overview 

With the Wormhole Connect widget, you can enable users to perform multichain asset transfers directly within your application. Connect simplifies the complexity of bridging, offering a single, intuitive point of interaction for moving assets across diverse blockchains. This empowers you to access liquidity and opportunities across any connected network seamlessly.


## Key Features

Wormhole Connect offers flexible customization to match your application. Tailor technical aspects, such as supported assets and custom RPCs, or use the full-featured default widget. Its UI is also highly adaptable, offering extensive styling options, which can be modified using a [no-code visual interface](https://connect-in-style.wormhole.com/){target=\_blank}. Connect’s features include:

- **In-app multichain transfers** – bridge assets without leaving your app
- **Flexible bridging routes** – supports multiple transfer pathways
- **Customizable UI** – style the bridge interface to match your brand 
- **Customizable features** – select bridging options 
- **Wormhole token bridging** – secure cross-chain transfers via Wormhole
- **Optional destination gas** – provide gas for initial transactions on the target chain

Be sure to check the [Feature Support Matrix](/docs/products/connect/reference/support-matrix/#feature-support-matrix){target=\_blank} to find out which routes and features are supported for each chain.

## How It Works

Think of Connect as a ready-made interface that simplifies the process of bridging assets across different blockchains. As you begin a multichain transfer, Connect simplifies the steps by:

1.  **Initiating the transfer** - selecting the asset, source chain, and destination chain
2.  **Connection** - connect your chosen wallet to the source chain
3.  **Transaction submission on source chain** - confirms the transfer details to trigger the asset lock or deposit on the initial blockchain
4.  **Wormhole message creation** - Wormhole's network observes the source transaction, and Guardians validate it to generate the VAA
5.  **Message relaying** -  autmomates relays of the generated CCT or VAA across the Wormhole network to the intended destination blockchain
6.  **Transaction on destination chain** - contracts on the target blockchain receive and verify the incoming CCT or VAA
7.  **Asset release/minting** - upon successful verification, the equivalent assets are either released as wrapped assets or newly created on the destination blockchain and delivered to your wallet

!!! tip
    If you want more hands on experience with Connect, checkout [Portal Bridge](https://portalbridge.com/){target=\_blank}.

## Use Cases

Here are some key use cases that highlight the power and versatility of Connect:

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Connect**](/docs/products/connect/get-started/) – handles user-friendly asset transfers
    - [**Native Token Transfers**](/docs/products/native-token-transfers/overview/) – moves native assets across chains
    - [**Queries**](/docs/products/queries/overview/) – fetches real-time prices for optimal trade execution

- **Cross-Chain Payment Widgets**

    - [**Connect**](/docs/products/connect/get-started/) – facilitates seamless payments in various tokens
    - [**Native Token Transfers**](/docs/products/native-token-transfers/overview/) – ensures direct, native asset transfers

- **Web3 Game Asset Transfers**

    - [**Connect**](/docs/products/connect/get-started/) – provide a user-friendly way to move game tokens across chains
    - [**Token Bridge**](/docs/products/token-bridge/overview/) – handle the underlying lock-and-mint logic securely

## Next Steps 

Add Connect to your app with these key setup steps:

[timeline(wormhole-docs/.snippets/text/products/reference/connect/overview/connect-timeline.json)]
