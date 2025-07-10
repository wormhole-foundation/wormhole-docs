---
title: Connect Data Configuration
description: Configure Wormhole Connect v1 (latest) with custom chains, tokens, routes, and more for enhanced blockchain interoperability.
categories: Connect, Transfer
---

## Data Configuration

This page explains how to configure Wormhole Connect's core functionality, from choosing supported chains and tokens to bridging routes to setting up wallets and enabling price lookups. By the end, you'll know how to specify custom networks and RPC endpoints, integrate different bridging protocols, add new tokens, and more.

## Get Started

Configure Wormhole Connect by passing a `WormholeConnectConfig` object as the `config` prop.

=== "React integration"

    ```ts
    --8<-- 'code/products/connect/configuration/data/configure-react-v1.tsx'
    ```

=== "Hosted integration"

    ```ts
    --8<-- 'code/products/connect/configuration/data/configure-hosted.tsx'
    ```

!!! note
    The complete type definition of `WormholeConnectConfig` is available in the [Wormhole Connect repository](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/types.ts#L96){target=\_blank}.

## Examples {: #examples }

### Configuring Chains and RPC Endpoints {: #chains-and-rpc-endpoints }

Connect lets you customize the available chains to match your project's needs. You should provide your own RPC endpoints, as the default public ones may not support essential functions like balance fetching.

=== "Mainnet"

    ```js
    --8<-- 'code/products/connect/configuration/data/custom-simple-v1.jsx'
    ```

=== "Testnet"

    ```js
    --8<-- 'code/products/connect/configuration/data/custom-simple-testnet-v1.jsx'
    ```

!!! note
    For a complete list of available chain names, see the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank}.

### Configuring Routes

By default, Connect offers two bridging protocols: Token Bridge (for Wormhole-wrapped tokens) and Circle's CCTP (for native USDC). For most use cases, integrators require more than these default routes. The `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including default and third-party routes.

#### Available Route Plugins

The `@wormhole-foundation/wormhole-connect` package offers a variety of `route` plugins to give you flexibility in handling different protocols. You can choose from the following `route` exports for your integration:

- [**`TokenBridgeRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/manual.ts){target=\_blank}: Manually redeemed Wormhole Token Bridge route.
- [**`AutomaticTokenBridgeRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/automatic.ts){target=\_blank}: Automatically redeemed (relayed) Token Bridge route. 
- [**`CCTPRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/manual.ts){target=\_blank}: Manually redeemed CCTP route.
- [**`AutomaticCCTPRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/automatic.ts){target=\_blank}: Automatically redeemed (relayed) CCTP route.
- **`DEFAULT_ROUTES`**: Array containing the four preceding routes (`TokenBridgeRoute`, `AutomaticTokenBridgeRoute`, `CCTPRoute`, `AutomaticCCTPRoute`).
- [**`nttAutomaticRoute(nttConfig)`**](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/automatic.ts){target=\_blank}: Function that returns the automatically-redeemed (relayed) Native Token Transfer (NTT) route.
- [**`nttManualRoute(nttConfig)`**](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/manual.ts){target=\_blank}: Function that returns the manually-redeemed NTT route.
- **`nttRoutes(nttConfig)`**: Function that returns both NTT routes as an array.
- [**`MayanRoute`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L57){target=\_blank}: Route that offers multiple Mayan protocols.
- [**`MayanRouteSWIFT`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L528){target=\_blank}: Route for Mayan's Swift protocol only.
- [**`MayanRouteMCTP`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L539){target=\_blank}: Route for Mayan's MCTP protocol only.
- [**`MayanRouteWH`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L550){target=\_blank}: Route for Mayan's original Wormhole transfer protocol.

In addition to these routes, developers can create custom routes for their Wormhole-based protocols. For examples, refer to the [NTT](https://github.com/wormhole-foundation/native-token-transfers/tree/main/sdk/route){target=\_blank} and the [Mayan](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} example GitHub repositories.

For further details on the `route` plugin interface, refer to the [Wormhole TypeScript SDK route code](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/route.ts){target=\_blank}.

#### Example: Offer Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
--8<-- 'code/products/connect/configuration/data/example-cctp.ts'
```

#### Example: Offer All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (Token Bridge and CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
--8<-- 'code/products/connect/configuration/data/example-all-routes.ts'
```

This flexible plugin allows you to combine default routes (such as Token Bridge and CCTP) with third-party protocols, offering complete control over which routes are available in your application.

### Adding Custom Tokens {: #custom-tokens }

The following section shows how to add an arbitrary token to your deployment of Connect.

!!! note
    You will need to [register](https://portalbridge.com/advanced-tools/#/register){target=\_blank} your token with the Token Bridge to get the contract addresses necessary for it to work with that protocol.

This example configuration adds the BONK token to Connect. Note the `wrappedTokens` property, which is required for use with the Token Bridge.

See the [Connect source code](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/types.ts#L182){target=\_blank} for the type definition of `TokensConfig`.

```typescript
--8<-- 'code/products/connect/configuration/data/add-token.tsx'
```

### Configuring Native Token Transfers (NTT)

Connect supports [NTT](/docs/products/native-token-transfers/overview/){target=\_blank}, which allows native tokens to move between supported chains using NTT-deployed contracts, such as managers and transceivers.

To enable NTT in your app, follow these steps:

 1. Add NTT routes to the `routes` array by calling `nttRoutes(...)` with your token deployment config using the spread operator. This sets up the route logic for native token transfers.
 2. Provide token metadata for each of the tokens listed in `nttRoutes` in the [`tokensConfig`](#custom-tokens) object. These entries must include `symbol`, `decimals`, and the `tokenId`.

```typescript
--8<-- 'code/products/connect/configuration/data/configure-ntt.tsx'
```

For a complete working example of NTT configuration in Wormhole Connect, see the [ntt-connect demo repository](https://github.com/wormhole-foundation/demo-ntt-connect){target=\_blank}.

### Whitelisting Tokens {: #whitelisting-tokens }

Connect offers a list of built-in tokens by default. You can see it below:

- [Mainnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/mainnet/tokens.ts){target=\_blank}
- [Testnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/testnet/tokens.ts){target=\_blank}

You can customize the tokens shown in the UI using the `tokens` property. The following example adds a custom token and limits Connect to showing only that token, along with the native gas tokens ETH and SOL.

```jsx
--8<-- 'code/products/connect/configuration/data/custom-tokens-whitelist.jsx'
```

You can whitelist tokens by symbol or by specifying tuples of [chain, address]. For example, this would show only BONK token (on all chains you've whitelisted) as well as [`EPjFW...TDt1v`](https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v){target=\_blank} on Solana, which is USDC.

```jsx
--8<-- 'code/products/connect/configuration/data/custom-tokens-whitelist-advanced.jsx'
```

### User-Inputted Tokens {: #user-inputted-tokens }

As of version 2.0, Connect allows users to paste token addresses to bridge any token they want. As an integrator, you may want to disable this feature if you are deploying Connect for use only with a specific token(s).

If you provide a token whitelist (see above), this is turned off automatically. However, you can also disable it explicitly like this:

```jsx
--8<-- 'code/products/connect/configuration/data/custom-disable-arbitrary-tokens.jsx'
```

Setting `ui.disableUserInputtedTokens` to `true` will disable the ability to paste in token addresses.

### Transaction Settings {: #transaction-settings }

Landing transactions on Solana can require finely tuned priority fees when there is congestion. You can tweak how Connect determines these with `transactionSettings`. All of the parameters in this configuration are optional; you can provide any combination of them.

```jsx
--8<-- 'code/products/connect/configuration/data/custom-tx-settings-solana.jsx'
```

!!! note
    Connect can calculate fees more accurately if you are using a [Triton](https://triton.one){target=\_blank} RPC endpoint.

### Wallet Set Up  {: #reown-cloud-project-id }

Your selected blockchain network determines the available wallet options when using Wormhole Connect.

 - For EVM chains, wallets like MetaMask and Reown Cloud (formerly WalletConnect) are supported
 - For Solana, you'll see options such as Phantom, Torus, and Coin98

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

If you would like to offer Reown Cloud (formerly WalletConnect) as a supported wallet option, you'll need to obtain a project ID on the [Reown Cloud dashboard](https://cloud.reown.com/){target=\_blank}.