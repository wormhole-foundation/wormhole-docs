---
title: Wormhole Connect
description: With Wormhole Connect, you can seamlessly bridge digital assets and data across a wide range of supported blockchain networks.
categories: Connect, Transfer
---

# Connect Overview 

With the Wormhole Connect widget, you can enable users to perform multichain asset transfers directly within your application. Connect simplifies the complexity of bridging, offering a single, intuitive point of interaction for moving assets across diverse blockchains. This empowers you to access liquidity and opportunities across any connected network seamlessly.

## Key Features

Wormhole connect's notable features include:

- **In-app multichain transfers** – bridge assets without leaving your app
- **Flexible bridging routes** – supports multiple transfer pathways
- **Customizable features** – specify chains and custom RPCs, manage tokens, and select bridging [routes](/docs/products/connect/concepts/routes/){target=\_blank} such as Token Bridge, CCTP, or NTT
- **Customizable UI** – style the bridge interface to match your brand
- **Optional destination gas** – provide gas for initial transactions on the target chain

Be sure to check the [Feature Support Matrix](/docs/products/connect/reference/support-matrix/#feature-support-matrix){target=\_blank} to find out which routes and features are supported for each chain.

## How It Works

When a user initiates a multichain transfer, Connect walks them through key steps and automates the transfer process behind the scenes, including:

1. **Initiating the transfer** - selects the asset, the source chain, and the target chain for the transfer
2. **Connection** - connect your chosen wallet to the source chain
3. **Finalize transfer setup** - connect the destination wallet and select a bridging route  
4. **Transaction submission on source chain** - confirms the transfer details to trigger the asset lock or deposit on the initial blockchain
5. **Wormhole message creation** - Wormhole's network observes the source transaction, and [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} validate it to generate the [VAA](/docs/protocol/infrastructure/vaas/){target=\_blank}
6. **Message relaying** - automates relays of the generated CCTP or VAA across the Wormhole network to the intended destination blockchain
7. **Transaction on destination chain** - contracts on the target blockchain receive and verify the incoming VAA
8. **Asset release/minting** - upon successful verification, the equivalent assets are either released as wrapped assets or newly created on the destination blockchain and delivered to your wallet

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
