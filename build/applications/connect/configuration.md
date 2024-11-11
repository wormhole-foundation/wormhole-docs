---
title: Configure Your Connect Widget
description: Configure Wormhole Connect v1 (latest) with custom chains, tokens, routes, and more for enhanced blockchain interoperability.
---

## Introduction {: #introduction }

Wormhole Connect is a flexible React widget that streamlines cross-chain asset transfers and enables seamless interoperability by leveraging Wormhole's powerful infrastructure. Designed for easy integration into decentralized applications (dApps), Wormhole Connect abstracts the complexities of cross-chain communication, providing a user-friendly experience for both developers and end users.

This guide provides detailed instructions on configuring Wormhole Connect and highlights the many ways it can be customized to fit your specific needs, from integrating supported blockchains and tokens to tailoring the user interface.

!!! note
    To upgrade from Wormhole Connect v0 to v1, please refer to the [migration guide](/docs/build/applications/connect/upgrade/){target=\_blank} for instructions.

    If you're using an older version of Wormhole Connect (v0.x), please refer to the [v0.x configuration documentation](/docs/build/applications/connect/configuration-v0/){target=\_blank}.

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

Connect lets you customize the available chains to match your project's needs. It is recommended that you provide your own RPC endpoints, as the default public ones may not support essential functions like balance fetching.

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

By default, Connect offers two bridging protocols: Token Bridge (for Wormhole wrapped tokens) and Circle's CCTP (for native USDC). For most use cases, integrators require more than these default routes. The `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including default and third-party routes.

#### Available Route Plugins

The `@wormhole-foundation/wormhole-connect` package offers a variety of `route` plugins to give you flexibility in handling different protocols. You can choose from the following `route` exports for your integration:

- **`TokenBridgeRoute`** - manually redeemed Wormhole Token Bridge route
- **`AutomaticTokenBridgeRoute`** - automatically redeemed (relayed) Token Bridge route
- **`CCTPRoute`** - manually redeemed CCTP route
- **`AutomaticCCTPRoute`** - automatically redeemed (relayed) CCTP route
- **`DEFAULT_ROUTES`** - array containing the four preceding routes (`TokenBridgeRoute`, `AutomaticTokenBridgeRoute`, `CCTPRoute`, `AutomaticCCTPRoute`)
- **`nttAutomaticRoute(nttConfig)`** - function that returns the automatically-redeemed (relayed) Native Token Transfer (NTT) route
- **`nttManualRoute(nttConfig)`** - function that returns the manually-redeemed NTT route
- **`nttRoutes(nttConfig)`** - function that returns both NTT routes as an array
- **`MayanRoute`** - route that offers multiple Mayan protocols
- **`MayanRouteSWIFT`** - route for Mayan’s Swift protocol only
- **`MayanRouteMCTP`** - route for Mayan’s MCTP protocol only
- **`MayanRouteWH`** - route for Mayan’s original Wormhole transfer protocol

In addition to these routes, developers can create custom routes for their Wormhole-based protocols. For examples, refer to the [NTT](https://github.com/wormhole-foundation/example-native-token-transfers/tree/main/sdk/route){target=\_blank} and the [Mayan](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} example GitHub repositories.

For further details on the `route` plugin interface, refer to the [Wormhole TypeScript SDK route code](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/route.ts){target=\_blank}.

#### Example: Offer Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
import WormholeConnect, {
  AutomaticCCTPRoute,
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  routes: [AutomaticCCTPRoute],
};

<WormholeConnect config={config} />;
```

#### Example: Offer All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (Token Bridge and CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/build/contract-integrations/native-token-transfers/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
import WormholeConnect, {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  WormholeConnectConfig,
} from '@wormhole-foundation/wormhole-connect';

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: WormholeConnectConfig = {
  routes: [...DEFAULT_ROUTES, ...nttRoutes(myNttConfig), MayanRouteSWIFT],
};

<WormholeConnect config={config} />;
```

This flexible plugin allows you to combine default routes (such as Token Bridge and CCTP) with third-party protocols, offering complete control over which routes are available in your application.

### Adding Custom Tokens {: #custom-tokens }

The following section shows how to add an arbitrary token to your deployment of Connect.

!!! note
    You will need to [register](https://portalbridge.com/advanced-tools/#/register){target=\_blank} your token with the Token Bridge to get the contract addresses necessary for it to work with that protocol.

This example configuration adds the BONK token to Connect. Note the `wrappedTokens` property, which is required for use with the Token Bridge.

See [src/config/types.ts](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank} for the type definition of `TokensConfig`.

```typescript
--8<-- 'code/build/applications/connect/configuration/add-token.tsx'
```

### Whitelisting Tokens {: #whitelisting-tokens }

Connect offers a list of built-in tokens by default. You can see it below:

- [Mainnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/mainnet/tokens.ts){target=\_blank}
- [Testnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/testnet/tokens.ts){target=\_blank}

Using the `tokens` property, you can customize the tokens shown in the UI. In the following example, we add a custom token and restrict Connect from displaying only that token, along with the native gas tokens ETH and SOL.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-tokens-whitelist.jsx'
```

### Changing the Color Scheme

You can customize Connect's color scheme by providing a `theme` prop.

=== "React integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/custom-colors.tsx'
    ```

=== "Hosted integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/custom-colors-hosted.tsx'
    ```

The `WormholeConnectTheme` type supports the following properties:

| <div style="width:10em">Property</div> |                              Description                              |        Example        |
|:--------------------------------------:|:---------------------------------------------------------------------:|:---------------------:|
|                 `mode`                 |                 Dark mode or light mode. **Required**                 | `"dark"` or `"light"` |
|                `input`                 |                Color used for input fields, dropdowns                 |      `"#AABBCC"`      |
|               `primary`                |                    Primary color used for buttons                     |      `"#AABBCC"`      |
|              `secondary`               |               Secondary color used for some UI elements               |      `"#AABBCC"`      |
|                 `text`                 |                      Primary color used for text                      |      `"#AABBCC"`      |
|            `textSecondary`             |                 Secondary color used for dimmer text                  |      `"#AABBCC"`      |
|                `error`                 |         Color to display errors in, usually some shade of red         |      `"#AABBCC"`      |
|               `success`                |                 Color to display success messages in                  |      `"#AABBCC"`      |
|                `badge`                 |                 Background color used for chain logos                 |      `"#AABBCC"`      |
|                 `font`                 | Font used in the UI, can be custom font available in your application | `"Arial; sans-serif"` |

## More Configuration Options {: #more-configuration-options }

### Wallet Set Up  {: #wallet-connect-project-id }

Your selected blockchain network determines the available wallet options when using Wormhole Connect.

 - For EVM chains, wallets like MetaMask and WalletConnect are supported
 - For Solana, you'll see options such as Phantom, Torus, and Coin98

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

If you would like to offer WalletConnect as a supported wallet option, you'll need to obtain a project ID on the [WalletConnect cloud dashboard](https://cloud.walletconnect.com/){target=\_blank}.

### Toggle Hamburger Menu {: #toggle-hamburger-menu }

By setting the `showHamburgerMenu` option to **false**, you can deactivate the hamburger menu, which will position the links at the bottom.

#### Add Extra Menu Entry {: #add-extra-menu-entry }

By setting the `showHamburgerMenu` option to `false,` you can add extra links. The following properties are accessed through the `menu[]` property (e.g., `menu[].label`):

| Property |                 Description                 |
|:--------:|:-------------------------------------------:|
| `label`  |            Link name to show up             |
|  `href`  |              Target URL or URN              |
| `target` | Anchor standard target, by default `_blank` |
| `order`  | Order where the new item should be injected |

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-menu.jsx'
```

### CoinGecko API Key {: #coingecko-api-key }

The CoinGecko API can be used to fetch token price data. If you have a [CoinGecko API Plan](https://apiguide.coingecko.com/getting-started/getting-started){target=\_blank}, you can include the API key in the configuration.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-coingecko-key.jsx'
```
