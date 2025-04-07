---
title: Features
description: Explore a comprehensive Feature Support matrix and explain Wormhole's capabilities across networks for Token Bridge, CCTP, ETH Bridge, and more. 
categories: Connect, Transfer
---

## Feature Support Matrix {: #feature-support-matrix}

*Scroll down for details about each column.*

| **Network** | **Token Bridge** | **Token Bridge Relayer** | **Circle CCTP** | **ETH Bridge** | **Gas Drop Off** |
|:-----------:|:----------------:|:------------------------:|:---------------:|:--------------:|:----------------:|
|   Solana    |        ✅         |            ✅             |        ✅        |       ❌        |        ✅         |
|  Ethereum   |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|     BSC     |        ✅         |            ✅             |        ❌        |       ✅        |        ✅         |
|   Polygon   |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|  Avalanche  |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|   Fantom    |        ✅         |            ✅             |        ❌        |       ❌        |        ✅         |
|    Kaia     |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|    Celo     |        ✅         |            ✅             |        ❌        |       ❌        |        ✅         |
|  Moonbeam   |        ✅         |            ✅             |        ❌        |       ❌        |        ✅         |
|  Injective  |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|     Sui     |        ✅         |            ✅             |        ❌        |       ❌        |        ✅         |
|    Aptos    |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|  Arbitrum   |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|  Optimism   |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|    Base     |        ✅         |            ✅             |        ✅        |       ✅        |        ✅         |
|     Sei     |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|   Scroll    |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|    Blast    |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |
|   X Layer   |        ✅         |            ❌             |        ❌        |       ❌        |        ❌         |

## Feature Explanation {: #feature-explanation}

### Token Bridge {: #token-bridge}

Wormhole is best known for its Token Bridge transfer method. It locks assets on the source chain and mints Wormhole-wrapped "IOU" tokens on the destination chain. To transfer the assets back, the Wormhole-wrapped tokens are burned, unlocking the tokens on their original chain.

This route appears if both of the following conditions are satisfied:

 - Both the origin and destination chains support Token Bridge 
 - No non-Token Bridge routes are available for the selected token

### Token Bridge Relayer {: #token-bridge-relayer}

On the [routes](/docs/build/transfers/connect/routes/){target=\_blank} page, this is referred to as the automatic route in the Token Bridge section.

Trustless relayers can execute the second transaction on behalf of the user, so the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically—for a small fee.

This route appears if all of the following conditions are satisfied:

- Both the origin and destination chains support Token Bridge
- Both the origin and destination chains support Token Bridge relayer
- No non-Token Bridge routes are available for the selected token
- The relayer supports the selected token on the origin chain

### Circle CCTP {: #circle-cctp}

[Circle](https://www.circle.com/en/){target=\_blank}, the issuer of USDC, provides a native way for native USDC to be transferred between [CCTP-enabled](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank} chains.

This route appears if all of the following conditions are satisfied:

- Both the origin and destination chains support Circle CCTP
- The selected token is native Circle-issued USDC

### ETH Bridge {: #eth-bridge}

[Powered by Uniswap liquidity pools](https://github.com/wormhole-foundation/example-uniswap-liquidity-layer){target=\_blank}, this route can transfer native ETH or wstETH between certain EVMs without going through the native bridges.

This route appears if all of the following conditions are satisfied:

- Both the origin and destination chains support the ETH Bridge
- The selected token is native ETH, wstETH, or canonical wETH

### Gas Drop Off {: #gas-drop-off}

A relayer can drop off some gas tokens on the destination chain by swapping some of the assets transferred to the native gas token. This is useful if the user wishes to transfer assets to a chain where they don't already have gas. This way, they don't need to onboard into the ecosystem from a centralized exchange.

This route appears if all of the following conditions are satisfied:

- Both the origin and destination chains support gas drop off
- An automatic route is selected
- The relayer accepts the selected token to swap into the gas token