---
title: Configure Your Connect Widget
description: Configure Wormhole Connect for React or HTML, set themes, define tokens, networks, and customize RPC endpoints for enhanced blockchain interactions. 
---

## Introduction {: #introduction }

Configure the Wormhole Connect React component by passing a `WormholeConnectConfig` object as the `config` prop.

=== "React integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/configure-react.tsx'
    ```

=== "Hosted integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/configure-hosted.tsx'
    ```

!!! note
    The full type definition of WormholeConnectConfig is available [here](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts).

    Below we show a variety of common config examples.


## Examples {: #examples }

### Configuring Chains and RPC Endpoints {: #chains-and-rpc-endpoints }

Connect allows you to narrow down which chains it offers, to focus on the ones your project needs. It's also good to provide your own RPC endpoints, because
the public ones that Connect defaults to often don't support critical functions like fetching balances.

=== "Mainnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple.jsx'
    ```

=== "Testnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple-testnet.jsx'
    ```

!!! note
    For a complete list of available chain names, see the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank}. 

### Configuring Routes

By default, Connect offers two bridging protocols: Token Bridge (for Wormhole wrapped tokens) and Circle's CCTP (for native USDC). 

For most use cases, integrators require more than these default routes. The `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including both default and third-party routes.

#### Available `route` Plugins

The `@wormhole-foundation/wormhole-connect` package offers a variety of `route` plugins to give you flexibility in handling different protocols. You can choose from the following `route` exports for your integration:

???- tip "`route` Plugins"
    - **`TokenBridgeRoute`** - manually redeemed Wormhole Token Bridge route
    - **`AutomaticTokenBridgeRoute`** - automatically redeemed (relayed) Token Bridge route
    - **`CCTPRoute`** - manually redeemed CCTP route
    - **`AutomaticCCTPRoute`** - automatically redeemed (relayed) CCTP route
    - **`DEFAULT_ROUTES`** - array containing the four preceding routes (TokenBridgeRoute, AutomaticTokenBridgeRoute, CCTPRoute, AutomaticCCTPRoute)
    - **`nttAutomaticRoute(nttConfig)`** - function that returns the automatically-redeemed (relayed) Native Token Transfer (NTT) route
    - **`nttManualRoute(nttConfig)`** - function that returns the manually-redeemed NTT route
    - **`nttRoutes(nttConfig)`** - function that returns both NTT routes as an array
    - **`MayanRoute`** - route that offers multiple Mayan protocols
    - **`MayanRouteSWIFT`** - route for Mayan’s Swift protocol only
    - **`MayanRouteMCTP`** - route for Mayan’s MCTP protocol only
    - **`MayanRouteWH`** - route for Mayan’s original Wormhole transfer protocol

In addition to these routes, developers can create custom routes for their own Wormhole-based protocols. For examples, refer to the [NTT](https://github.com/wormhole-foundation/example-native-token-transfers/tree/main/sdk/route){target=\_blank} and the [Mayan](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} example GitHub repositories.

For further details on available route plugins, refer to the [Wormhole TypeScript SDK route code](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/route.ts){target=\_blank}.


#### Example: Offer Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
import {
  AutomaticCCTPRoute,
  WormholeConnectConfig,
  WormholeConnect,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  routes: [AutomaticCCTPRoute],
};

<WormholeConnect config={config} />;
```

#### Example: Offer All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (Token Bridge & CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/build/contract-integrations/native-token-transfers/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
import {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  WormholeConnectConfig,
  WormholeConnect,
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

This example configuration adds an the BONK token to Connect. Note the `wrappedTokens` property, which is required for use with the Token Bridge.

See [src/config/types.ts](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank} for the type definition of `TokensConfig`.


```typescript
--8<-- 'code/build/applications/connect/configuration/add-token.tsx'
```

### Whitelisting Tokens {: #whitelisting-tokens }

Connect has a list of built-in tokens that it offers by default. You can see it here:

- [Mainnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/mainnet/tokens.ts)
- [Testnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/testnet/tokens.ts)

You can limit which tokens are offered in the UI by providing the `tokens` property. This example builds on the previous one; we are adding a custom token, and limiting Connect to just that, as well as the native gas tokens ETH and SOL.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-tokens-whitelist.jsx'
```

## More Configuration Options {: #more-configuration-options }

### Wallet Connect Project ID  {: #wallet-connect-project-id }

If you would like to offer WalletConnect as a supported wallet option, you'll need to obtain a project ID on the [WalletConnect cloud dashboard](https://cloud.walletconnect.com/){target=\_blank}.

### Toggle Hamburger Menu {: #toggle-hamburger-menu }

By setting the `showHamburgerMenu` option to **false**, you can deactivate the hamburger menu, causing the links to be positioned at the bottom.

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
