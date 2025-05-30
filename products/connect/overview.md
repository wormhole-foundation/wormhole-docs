---
title: Wormhole Connect
description: With Wormhole Connect, you can seamlessly bridge digital assets and data across a wide range of supported blockchain networks.
categories: Connect, Transfer
---

# Connect Overview 

With the Wormhole Connect widget, you can enable users to perform multichain asset transfers directly within your application. Connect simplifies the complexity of bridging, offering a single, intuitive point of interaction for moving assets across diverse blockchains. This empowers you to access liquidity and opportunities across any connected network seamlessly.

## Key Features

Connect's notable features include:

- **In-app multichain transfers**: Bridge assets without leaving your app.
- **Customizable features**: Specify chains and custom RPCs, manage tokens, and select bridging [routes](/docs/products/connect/concepts/routes/){target=\_blank} such as Token Bridge, CCTP, or NTT.
- **Customizable UI**: Style the bridge interface to match your brand.
- **Optional destination gas**: Provide gas for initial transactions on the target chain.
- **Wrapped and native assets support**: Supports both wrapped and native tokens and integrates with Settlement.

Be sure to check the [Feature Support Matrix](/docs/products/connect/reference/support-matrix/#feature-support-matrix){target=\_blank} to find out which routes and features are supported for each chain.

## How It Works

When a user initiates a multichain transfer, Connect walks them through key steps and automates the transfer process behind the scenes, including:

1. **Initiating the transfer**: Connect your chosen wallet to the source chain, select asset and source chain for the transfer.
2. **Finalize transfer setup**: Connect the destination wallet, select the target chain and select a bridging route (manual or automatic).
3. **Transaction submission on source chain**: Confirms the transfer details to trigger the asset lock or deposit on the initial blockchain. Connect will guide you through the transaction process.
4. **VAA or attestation creation**: Wormhole [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} observe the source transaction and produce a [Verifiable Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}.
5. **Relaying to destination**: The VAA or attestation is automatically relayed to the destination chain.
6. **Verification on destination**: Contracts on the target chain receive and verify the incoming VAA.
7. **Asset release/minting**: Upon successful verification, the equivalent assets are either released or minted on the target chain and delivered to your wallet.

!!! tip
    If you want more hands on experience with Connect, checkout [Portal Bridge](https://portalbridge.com/){target=\_blank}.

## Use Cases

Here are some key use cases that highlight the power and versatility of Connect:

- **Cross-Chain Swaps and Liquidity Aggregation**

    - [**Connect**](/docs/products/connect/get-started/): handles user-friendly asset transfers
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
