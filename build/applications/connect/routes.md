---
title: Routes
description: Explore Wormhole Connect's routing capabilities for asset transfers, featuring Token Bridge, CCTP, NTT, and various blockchain-specific routes for optimal UX. 
---

## Routes Overview {: #routes-overview}

This page explains the concept of routes in Wormhole Connect. To configure routes for your widget, check the [Wormhole Connect Configuration](/docs/build/applications/connect/configuration).

Routes are methods by which the widget will transfer the assets. Wormhole Connect supports Token Bridge transfers for any arbitrary token, and for specific tokens, it also supports more advanced transfer methods that provide superior UX.

When you select the source chain, source token, and destination chain, Wormhole Connect will display the best routes available for that particular combination. In practice, if routes other than the Token Bridge are available, only those will be displayed. Check the [feature matrix](/docs/build/applications/connect/features) to see under which exact conditions the routes appear.

## Token Bridge Routes {: #token-bridge-routes}

The Token Bridge is Wormhole's best-known transfer method. It locks assets on the source chain and mints Wormhole-wrapped "IOU" tokens on the destination chain. To transfer the assets back, the Wormhole-wrapped tokens are burned, unlocking the tokens on their original chain.

#### Manual Route {: #manual-route}

The manual route transfer method requires two transactions: one on the origin chain to lock the tokens (or burn the Wormhole-wrapped tokens) and one on the destination chain to mint the Wormhole-wrapped tokens (or unlock the original tokens). To offer this option, enable the `bridge` route in the configuration.

#### Automatic Route {: #automatic-route}

Trustless relayers can execute the second transaction on the user's behalf, so the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically - for a small fee. Wormhole Connect automatically detects whether the relayer supports a token and will display the option if the `relay` route is enabled in the configuration.

## CCTP Routes (USDC) {: #cctp-routes-usdc}
 
[Circle](https://www.circle.com/en/){target=\_blank}, the issuer of USDC, provides a native way for native USDC to be transferred between [CCTP-enabled](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank} chains. Wormhole Connect can facilitate such transfers.

Note that if native USDC is transferred from the CCTP-enabled chains to any other outside of this list, the transfer will be routed through the Token Bridge, and the resulting asset will be a Wormhole-wrapped token instead of native USDC.

#### Manual Route {: #manual-route-cctp}

This transfer method requires two transactions: one on the origin chain to burn the USDC and one on the destination chain to mint the USDC. The manual CCTP route relies on CCTP only and doesn't use Wormhole messaging in the background. Enable the `cctpManual` route in the configuration to offer this option.

#### Automatic Route {: #automatic-route-cctp}

Trustless relayers can execute the second transaction on the user's behalf. Therefore, the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically—for a small fee. To offer this option, enable the `cctpRelay` route in the configuration.

## Native Token Transfers (NTT) Routes {: #native-token-transfers-ntt-routes}

[Wormhole's Native Token Transfer (NTT) framework](https://github.com/wormhole-foundation/example-native-token-transfers){target=\_blank} enables token issuers to retain full ownership of their tokens across any number of chains, unlike the Token Bridge. The token issuer must deploy NTT contracts, and Wormhole Connect needs to be [configured](/docs/build/applications/connect/configuration) with the appropriate `nttGroups` before such tokens are recognized as transferrable via NTT. Refer to the [documentation in the NTT repository](https://github.com/wormhole-foundation/example-native-token-transfers?tab=readme-ov-file#overview){target=\_blank} for more information about the contracts needed and the framework in general.

#### Manual Route {: #manual-route-ntt}

This transfer method requires two transactions: one on the origin chain to burn or lock the tokens and one on the destination chain to mint them. To offer this option, enable the `nttManual` route in the configuration.

#### Automatic Route  {: #automatic-route-ntt}

Trustless relayers can execute the second transaction on the user's behalf, so the user only needs to perform one transaction on the origin chain to have the tokens delivered to the destination automatically—for a small fee. Wormhole Connect automatically detects whether the relayer supports a token and will display the option if the `nttRelay` route is enabled in the configuration.

## ETH Bridge Route for Native ETH and wstETH {: #eth-bridge-route-for-native-eth-and-wsteth}

[Powered by Uniswap liquidity pools](https://github.com/wormhole-foundation/example-uniswap-liquidity-layer){target=\_blank}, this route can transfer native ETH or wstETH between certain EVMs without going through the native bridges. For example, you can transfer native ETH from Arbitrum to Optimism and end up with Optimism ETH all in one go. Supported chains are Ethereum, Arbitrum, Optimism, Base, Polygon (canonical wETH), BSC (canonical wETH), and Avalanche (canonical wETH).

#### Automatic Route {: #automatic-route-eth}

Only the relayed route is available due to the complexity of the transaction that needs to be executed at the destination. To offer this option, enable the `ethBridge` and/or `wstETHBridge` route in the configuration to provide this option.

## USDT Bridge Route {: #usdt-bridge-route}

Operating on the same technology as the ETH Bridge, this route can transfer USDT between certain EVMs without going through the native bridges. The resulting token will be the canonical USDT token on the destination instead of the Wormhole-wrapped variant. Supported chains are Ethereum, Polygon, Avalanche, Arbitrum, Optimism, BSC, and Base.

#### Automatic Route {: #automatic-route-usdt}

Only the relayed route is available due to the complexity of the transaction that needs to be executed on the destination. Enable the `usdtBridge` route in the configuration to offer this option.

## Cosmos Gateway Route {: #cosmos-gateway-route}

[Wormhole Gateway](https://docs.wormhole.com/wormhole/explore-wormhole/gateway){target=\_blank} is a Cosmos-SDK chain that bridges non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains. This transfer method is offered when the destination is an [IBC-compatible](https://cosmos.network/ibc/){target=\_blank} Cosmos chain (e.g., Osmosis, CosmosHub, Evmos, Kujira, or Injective).

#### Automatic Route {: #automatic-route-cosmos}

The Wormhole Guardian Network automatically delivers messages to Wormhole Gateway if the tokens are destined for IBC-compatible Cosmos chains, requiring no input or extra "Gateway gas" from the user. When the Wormhole-wrapped tokens are minted on Gateway, they are automatically transferred to their intended destination via a network of IBC relayers. Enable the `cosmosGateway` route in the configuration to offer this option.

## tBTC Route {: #tbtc-route}

You can bridge [Threshold's Bitcoin](https://threshold.network/){target=\_blank} via this hybrid solution that combines the Token Bridge and Threshold's contracts. Native tBTC is first locked in the Wormhole Token Bridge, transferred to the destination in the form of Wormhole-wrapped tBTC, which is then immediately locked in Threshold's contract that mints native tBTC for it. The net result is that the user ends up with native tBTC on chains where this Threshold contract is deployed (e.g., Solana, Polygon, Arbitrum, Optimism, or Base).

Note that if native tBTC is transferred out of these chains to any other outside of this list, the transfer will be routed through the Token Bridge, and the resulting asset will be a Wormhole-wrapped token instead of native tBTC.

#### Manual Route {: #manual-route-tbtc}

This transfer method requires two transactions: one on the origin chain to burn or lock the tokens and one on the destination chain to mint them. To provide this option, enable the `tbtc` route in the configuration.