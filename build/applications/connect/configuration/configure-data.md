---
title: Connect Data Configuration
description: Configure Wormhole Connect v1 (latest) with custom chains, tokens, routes, and more for enhanced blockchain interoperability.
---

## Data Configuration

This page explains how to configure Wormhole Connect's core functionality, from choosing supported chains and tokens to bridging routes to setting up wallets and enabling price lookups. By the end, you'll know how to specify custom networks and RPC endpoints, integrate different bridging protocols, add new tokens, and more.

## Get Started

Configure Wormhole Connect by passing a `WormholeConnectConfig` object as the `config` prop.

=== "React integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/configure-react-v1.tsx'
    ```

=== "Hosted integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/configure-hosted.tsx'
    ```

!!! note
    The complete type definition of `WormholeConnectConfig` is available in the [Wormhole Connect repository](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank}.

## Examples {: #examples }

### Configuring Chains and RPC Endpoints {: #chains-and-rpc-endpoints }

Connect lets you customize the available chains to match your project's needs. You should provide your own RPC endpoints, as the default public ones may not support essential functions like balance fetching.

=== "Mainnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple-v1.jsx'
    ```

=== "Testnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple-testnet-v1.jsx'
    ```

!!! note
    For a complete list of available chain names, see the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank}.

### Configuring Routes

By default, Connect offers two bridging protocols: Token Bridge (for Wormhole-wrapped tokens) and Circle's CCTP (for native USDC). For most use cases, integrators require more than these default routes. The `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including default and third-party routes.

#### Available Route Plugins

The `@wormhole-foundation/wormhole-connect` package offers a variety of `route` plugins to give you flexibility in handling different protocols. You can choose from the following `route` exports for your integration:

- [**`TokenBridgeRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/manual.ts){target=\_blank} - manually redeemed Wormhole Token Bridge route
- [**`AutomaticTokenBridgeRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/automatic.ts){target=\_blank} - automatically redeemed (relayed) Token Bridge route
- [**`CCTPRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/manual.ts){target=\_blank} - manually redeemed CCTP route
- [**`AutomaticCCTPRoute`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/automatic.ts){target=\_blank} - automatically redeemed (relayed) CCTP route
- **`DEFAULT_ROUTES`** - array containing the four preceding routes (`TokenBridgeRoute`, `AutomaticTokenBridgeRoute`, `CCTPRoute`, `AutomaticCCTPRoute`)
- [**`nttAutomaticRoute(nttConfig)`**](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/automatic.ts){target=\_blank} - function that returns the automatically-redeemed (relayed) Native Token Transfer (NTT) route
- [**`nttManualRoute(nttConfig)`**](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/manual.ts){target=\_blank}- function that returns the manually-redeemed NTT route
- **`nttRoutes(nttConfig)`** - function that returns both NTT routes as an array
- [**`MayanRoute`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L57){target=\_blank} - route that offers multiple Mayan protocols
- [**`MayanRouteSWIFT`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L528){target=\_blank} - route for Mayan's Swift protocol only
- [**`MayanRouteMCTP`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L539){target=\_blank} - route for Mayan's MCTP protocol only
- [**`MayanRouteWH`**](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L550){target=\_blank} - route for Mayan's original Wormhole transfer protocol

In addition to these routes, developers can create custom routes for their Wormhole-based protocols. For examples, refer to the [NTT](https://github.com/wormhole-foundation/native-token-transfers/tree/main/sdk/route){target=\_blank} and the [Mayan](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} example GitHub repositories.

For further details on the `route` plugin interface, refer to the [Wormhole TypeScript SDK route code](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/route.ts){target=\_blank}.

#### Example: Offer Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
--8<-- 'code/build/applications/connect/configuration/example-cctp.ts'
```

#### Example: Offer All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (Token Bridge and CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/build/contract-integrations/native-token-transfers/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
--8<-- 'code/build/applications/connect/configuration/example-all-routes.ts'
```

This flexible plugin allows you to combine default routes (such as Token Bridge and CCTP) with third-party protocols, offering complete control over which routes are available in your application.

### Adding Custom Tokens {: #custom-tokens }

The following section shows how to add an arbitrary token to your deployment of Connect.

!!! note
    You will need to [register](https://portalbridge.com/advanced-tools/#/register){target=\_blank} your token with the Token Bridge to get the contract addresses necessary for it to work with that protocol.

This example configuration adds the BONK token to Connect. Note the `wrappedTokens` property, which is required for use with the Token Bridge.

See the [Connect source code](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank} for the type definition of `TokensConfig`.

```typescript
--8<-- 'code/build/applications/connect/configuration/add-token.tsx'
```

### Whitelisting Tokens {: #whitelisting-tokens }

Connect offers a list of built-in tokens by default. You can see it below:

- [Mainnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/mainnet/tokens.ts){target=\_blank}
- [Testnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/testnet/tokens.ts){target=\_blank}

You can customize the tokens shown in the UI using the' tokens' property. In the following example, we add a custom token and restrict Connect to displaying only that token, along with the native gas tokens ETH and SOL.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-tokens-whitelist.jsx'
```

### Wallet Set Up  {: #reown-cloud-project-id }

Your selected blockchain network determines the available wallet options when using Wormhole Connect.

 - For EVM chains, wallets like MetaMask and Reown Cloud (formerly WalletConnect) are supported
 - For Solana, you'll see options such as Phantom, Torus, and Coin98

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

If you would like to offer Reown Cloud (formerly WalletConnect) as a supported wallet option, you'll need to obtain a project ID on the [Reown Cloud dashboard](https://cloud.reown.com/){target=\_blank}.

### CoinGecko API Key {: #coingecko-api-key }

The CoinGecko API can be used to fetch token price data. If you have a [CoinGecko API Plan](https://apiguide.coingecko.com/getting-started/getting-started){target=\_blank}, you can include the API key in the configuration.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-coingecko-key.jsx'
```
