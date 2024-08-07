---
title: Routes
description: Explore Wormhole Connect's routing capabilities for asset transfers, featuring Token Bridge, CCTP, NTT, and various blockchain-specific routes for optimal UX. 
---

## Routes overview {: #routes-overview}

This page explains the concept of routes in Wormhole Connect. To configure routes for your widget, check [here](../connect/configuration.md).

Routes are methods by which the widget will transfer the assets. Wormhole Connect supports Token Bridge transfers for any arbitrary token, and for specific tokens, it also supports more advanced transfer methods that provide superior UX.

When you select the source chain, source token, and destination chain, Wormhole Connect will display the best routes available for that particular combination. In practice,  if routes other than the Token Bridge are available, only those will be displayed. Check the [feature matrix](./features.md) to see under which exact conditions the routes appear.

## Token bridge routes {: #token-bridge-routes}

This is the transfer method that Wormhole is best known for. It locks assets on the source chain, and mints wormhole-wrapped "IOU" tokens on the destination chain. To transfer the assets back, the wormhole-wrapped tokens are burned, which unlocks the tokens on their original chain.

#### Manual route {: #manual-route}

This transfer method requires two transactions: one on the origin chain to lock the tokens (or burn the wormhole-wrapped tokens) and one on the destination chain to mint the wormhole-wrapped tokens (or unlock the original tokens). Enable the `bridge` route in the configuration to offer this option.

#### Automatic route {: #automatic-route}

Trustless relayers can execute the second transaction on the user's behalf, so the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically - for a small fee. Wormhole Connect automatically detects whether the relayer supports a token and will display the option if the `relay` route is enabled in the configuration.

## CCTP routes (for USDC only) {: #cctp-routes-for-usdc-only}
 
[Circle](https://www.circle.com/en/){target=\_blank}, issuer of USDC, provides a native way by which native USDC can be transferred between [CCTP enabled](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank} chains. Wormhole Connect is capable of facilitating such transfers.

Note that if native USDC is transferred out of the CCTP-enabled chains to any other outside of this list, the transfer will be routed through the Token Bridge and the resulting asset will be a wormhole-wrapped token instead of native USDC.

#### Manual route {: #manual-route-cctp}
This transfer method needs two transactions: one on the origin chain to burn the USDC and one on the destination chain to mint the USDC. The manual CCTP route does not use Wormhole messaging in the background; it relies on CCTP only. Enable the `cctpManual` route in the configuration to offer this option.

#### Automatic route {: #automatic-route-cctp}
Trustless relayers can execute the second transaction on the user's behalf, so the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically - for a small fee. Enable the `cctpRelay` route in the configuration to offer this option.

## Native Token Transfers (NTT) routes {: #native-token-transfers-ntt-routes}

[A framework by Wormhole](https://github.com/wormhole-foundation/example-native-token-transfers), Native Token Transfers enables token issuers to retain full ownership of their tokens across any number of chains, unlike the Token Bridge. The token issuer must deploy NTT contracts, and Wormhole Connect needs to be [configured](./configuration.md) with the appropriate `nttGroups` before such tokens are recognized as transferrable via NTT. Refer to the documentation in the NTT repo for more information about the contracts needed and the framework in general.

#### Manual route {: #manual-route-ntt}
This transfer method needs two transactions: one on the origin chain to burn or lock the tokens, and one on the destination chain to mint the tokens. To offer this option, enable the `nttManual` route in the configuration.

#### Automatic route  {: #automatic-route-ntt}
Trustless relayers can execute the second transaction on behalf of the user, so the user only needs to execute one transaction on the origin chain and have the tokens delivered to the destination automatically—for a small fee. Wormhole Connect automatically detects whether a token is supported by the relayer and will display the option if the `nttRelay` route is enabled in the configuration.

## ETH Bridge route (for native ETH and wstETH) {: #eth-bridge-route-for-native-eth-and-wsteth}

[Powered by Uniswap liquidity pools](https://github.com/wormhole-foundation/example-uniswap-liquidity-layer){target=\_blank}, this route can transfer native ETH or wstETH between certain EVMs without going through the native bridges. For example, you can transfer native ETH from Arbitrum to Optimism and end up with Optimism ETH all in one go. Supported chains are: Ethereum, Arbitrum, Optimism, Base, Polygon (canonical wETH), BSC (canonical wETH), Avalanche (canonical wETH)

#### Automatic route {: #automatic-route-eth}
Due to the complexity of the transaction that needs to be executed on the destination, only the relayed route is available. Enable the `ethBridge` and/or `wstETHBridge` route in the configuration to offer this option.

## USDT Bridge route (for USDT only) {: #usdt-bridge-route-for-usdt-only}

Operating on the same technology as the ETH Bridge, this route can transfer USDT between certain EVMs without going through the native bridges. The resulting token will be the canonical USDT token on the destination, as opposed to the wormhole-wrapped variant. Supported chains are: Ethereum, Polygon, Avalanche, Arbitrum, Optimism, BSC, Base.

#### Automatic route {: #automatic-route-usdt}

Due to the complexity of the transaction that needs to be executed on the destination, only the relayed route is available. To offer this option, enable the `usdtBridge` route in the configuration.

## Cosmos Gateway route {: #cosmos-gateway-route}

[Wormhole Gateway](https://docs.wormhole.com/wormhole/explore-wormhole/gateway){target=\_blank}  is a Cosmos-SDK chain that bridges non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains. This transfer method is offered when the destination is an [IBC-compatible](https://cosmos.network/ibc/){target=\_blank}  Cosmos chain (Osmosis, CosmosHub, Evmos, Kujira, Injective).

#### Automatic route {: #automatic-route-cosmos}

The Wormhole Guardian network automatically delivers messages to Wormhole Gateway if the tokens are destined for IBC-compatible Cosmos chains, requiring no input or extra 'Gateway gas' from the user. When the wormhole-wrapped tokens are minted on Gateway, they are automatically transferred to their intended destination via a network of IBC relayers. Enable the `cosmosGateway` route in the configuration to offer this option.

## tBTC route (for tBTC only) {: #tbtc-route-for-tbtc-only}

Bridge [Threshold](https://threshold.network/){target=\_blank}'s Bitcoin via this hybrid solution that combines the Token Bridge and Threshold's own contracts. Native tBTC is first locked in the Wormhole Token Bridge, transferred to the destination in the form of wormhole-wrapped tBTC, which is then immediately locked in Threshold's contract that mints native tBTC for it. The net result is that the user ends up with native tBTC on chains where this Threshold contract is deployed (Solana, Polygon, Arbitrum, Optimism, Base).

Note that if native tBTC is transferred out of these chains to any other outside of this list, the transfer will be routed through the Token Bridge and the resulting asset will be a wormhole-wrapped token instead of native tBTC.

#### Manual route  {: #manual-route-tbtc}

This transfer method needs two transactions: one on the origin chain to burn or lock the tokens, and one on the destination chain to mint the tokens. To offer this option, enable the `tbtc` route in the configuration.