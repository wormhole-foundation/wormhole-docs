---
title: Routes
description: Explore Wormhole Connect's routing capabilities for asset transfers, featuring Token Bridge, CCTP, NTT, and various blockchain-specific routes for optimal UX. 
---

## Routes overview {: #routes-overview}

This page explains the concept of routes in Wormhole Connect. To configure them in your widget, check [here](../connect/configuration.md).

Routes are methods by which the widget will transfer the assets. Wormhole Connect supports Token Bridge transfers for any arbitrary token, and for certain tokens it also supports more advanced transfer methods that provide superior UX.

When you select the source chain, source token and destination chain, Wormhole Connect will display the best routes that are available for that particular combination. In practice, this means that if routes other than the Token Bridge is available, only those will be displayed. Check the [feature matrix](./features.md) to see under which exact conditions the routes appear.

## Token bridge routes {: #token-bridge-routes}

This is the transfer method that Wormhole is best known for. It locks assets on the source chain, and mints wormhole-wrapped "IOU" tokens on the destination chain. To transfer the assets back, the wormhole-wrapped tokens are burned, which unlocks the tokens on their original chain.

#### Manual route {: #manual-route}

This transfer method requires 2 transactions: one on the origin chan to lock the tokens (or burn the wormhole-wrapped tokens), and one on the destination chain to mint the wormhole-wrapped tokens (or unlock the original tokens). To offer this option, enable the `bridge` route in the configuration.

#### Automatic route {: #automatic-route}

Trustless relayers are able to execute the second transaction on behalf of the user, so that the user only needs to execute 1 transaction on the origin chain to have the tokens delivered to the destination automatically - for a small fee. Wormhole Connect automatically detects whether a token is supported by the relayer, and will display the option if the `relay` route is enabled in the configuration.

## CCTP routes (for USDC only) {: #cctp-routes-for-usdc-only}
 
[Circle](https://www.circle.com/en/), issuer of USDC, provides a native way by which native USDC can be transferred between [CCTP enabled](https://www.circle.com/en/cross-chain-transfer-protocol) chains. Wormhole Connect is capable of facilitating such transfers.

Note that if native USDC is transferred out of the CCTP-enabled chains to any other outside of this list, the transfer will be routed through the Token Bridge and the resulting asset will be a wormhole-wrapped token instead of native USDC.

#### Manual route {: #manual-route-cctp}
This transfer method needs 2 transactions: one on the origin chain to burn the USDC, and one on the destination chain to mint the USDC. The manual CCTP route does not use Wormhole messaging in the background, relying on CCTP only. To offer this option, enable the `cctpManual` route in the configuration.

#### Automatic route {: #automatic-route-cctp}
Trustless relayers are able to execute the second transaction on behalf of the user, so that the user only needs to execute 1 transaction on the origin chain to have the tokens delivered to the destination automatically - for a small fee. To offer this option, enable the `cctpRelay` route in the configuration.

## Native Token Transfers (NTT) routes {: #native-token-transfers-ntt-routes}


[A framework by Wormhole](https://github.com/wormhole-foundation/example-native-token-transfers), Native Token Transfers enables token issuers to retain full ownership of their tokens across any number of chains, unlike the Token Bridge. NTT contracts must be deployed by the token issuer, and Wormhole Connect needs to be [configured](./configuration.md) with the appropriate `nttGroups` before such tokens are recognized as transferrable via NTT. Refer to the documentation in the NTT repo for more information about the contracts needed and about the framework in general.

#### Manual route {: #manual-route-ntt}
This transfer method needs 2 transactions: one on the origin chain to burn or lock the tokens, and one on the destination chain to mint the tokens. To offer this option, enable the `nttManual` route in the configuration.

#### Automatic route  {: #automatic-route-ntt}
Trustless relayers are able to execute the second transaction on behalf of the user, so that the user only needs to execute 1 transaction on the origin chain and have the tokens delivered to the destination automatically - for a small fee. Wormhole Connect automatically detects whether a token is supported by the relayer, and will display the option if the `nttRelay` route is enabled in the configuration.

## ETH Bridge route (for native ETH and wstETH) {: #eth-bridge-route-for-native-eth-and-wsteth}

[Powered by Uniswap liquidity pools](https://github.com/wormhole-foundation/example-uniswap-liquidity-layer), this route can transfer native ETH or wstETH between certain EVMs without going through the native bridges. For example, you can transfer native ETH from Arbitrum to Optimism and end up with Optimism ETH all in one go. Supported chains are: Ethereum, Arbitrum, Optimism, Base, Polygon (canonical wETH), BSC (canonical wETH), Avalanche (canonical wETH)

#### Automatic route {: #automatic-route-eth}
Due to the complexity of the transaction that needs to be executed on the destination, only the relayed route is available. To offer this option, enable the `ethBridge` and/or `wstETHBridge` route in the configuration.

## USDT Bridge route (for USDT only) {: #usdt-bridge-route-for-usdt-only}

Operating on the same technology as the ETH Bridge, this route can transfer USDT between certain EVMs without going through the native bridges. The resulting token will be the canonical USDT token on the destination, as opposed to the wormhole-wrapped variant. Supported chains are: Ethereum, Polygon, Avalanche, Arbitrum, Optimism, BSC, Base.

#### Automatic route {: #automatic-route-usdt}

Due to the complexity of the transaction that needs to be executed on the destination, only the relayed route is available. To offer this option, enable the `usdtBridge` route in the configuration.

## Cosmos Gateway route {: #cosmos-gateway-route}

[Wormhole Gateway](https://docs.wormhole.com/wormhole/explore-wormhole/gateway) is a Cosmos-SDK chain that provides a way to bridge non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains. This transfer method is offered when the destination is an [IBC-compatible](https://cosmos.network/ibc/) Cosmos chain (Osmosis, CosmosHub, Evmos, Kujira, Injective).

#### Automatic route {: #automatic-route-cosmos}

The Wormhole Guardian network automatically delivers messages to Wormhole Gateway if the tokens are destined for IBC-compatible Cosmos chains, requiring no input or extra 'Gateway gas' from the user. When the wormhole-wrapped tokens are minted on Gateway, they are then automatically transferred to their intended destination via a network of IBC relayers. To offer this option, enable the `cosmosGateway` route in the configuration.

## tBTC route (for tBTC only) {: #tbtc-route-for-tbtc-only}

Bridge [Threshold](https://threshold.network/)'s Bitcoin via this hybrid solution that uses a combination of the Token Bridge and Threshold's own contracts. Native tBTC is first locked in the Wormhole Token Bridge, transferred to the destination in the form of wormhole-wrapped tBTC, which is then immediately locked in Threshold's contract that mints native tBTC for it. The net result is that the user ends up with native tBTC on chains where this Threshold contract is deployed (Solana, Polygon, Arbitrum, Optimism, Base).

Note that if native tBTC is transferred out of these chains to any other outside of this list, the transfer will be routed through the Token Bridge and the resulting asset will be a wormhole-wrapped token instead of native tBTC.

#### Manual route  {: #manual-route-tbtc}

This transfer method needs 2 transactions: one on the origin chain to burn or lock the tokens, and one on the destination chain to mint the tokens. To offer this option, enable the `tbtc` route in the configuration.