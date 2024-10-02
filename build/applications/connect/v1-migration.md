---
title: Wormhole Connect v1.0 Migration Guide
description: Learn how to migrate to Wormhole Connect v1.0, with step-by-step guidance on updating your package and configuration.
---

# Wormhole Connect v1.0 Migration Guide

## Overview

The Wormhole Connect feature has been updated to **version 1.0**, introducing a modernized design and improved routing for faster native-to-native token transfers. This stable release comes with several breaking changes in how the application is configured, requiring minor updates to your integration.

This guide will help you migrate to the new version in just a few simple steps. By following this migration guide, you'll learn how to:

 - Update to the latest Connect package
 - Apply configuration changes to the **`WormholeConnectConfig`** object
 - Understand new routing capabilities and plugin options

These updates ensure better performance and a smoother integration experience.

For complete documentation on the previous version of Wormhole Connect, please refer to the [Wormhole Connect guide](/docs/build/applications/connect/){target=\_blank}.

## Update the Connect Package

To begin the migration process, update the Wormhole Connect [**npm package**](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/1.0.0-beta.6-development?activeTab=readme){target=\_blank} to the latest version 1.0. Updating to the latest version provides access to the newest features and improvements, including the modernized design and enhanced routing capabilities.

Run the following command in your terminal:

```bash
npm install @wormhole-foundation/wormhole-connect@^1.0
```

This command installs the latest stable version of Wormhole Connect and prepares your environment for the new configuration changes.

## Update Your `WormholeConnectConfig`

Several breaking changes were introduced to the `WormholeConnectConfig` object in version 1.0. Most of these changes are minor and can be applied quickly. Below is a summary of the key changes, followed by detailed examples.

### Summary of Breaking Changes

- Chain names are now capitalized: `solana` → `Solana`
- `env` renamed to `network`: `mainnet` → `Mainnet`
- `networks` renamed to `chains`, with capitalized names
- `routes` updated to use route plugins
- `nttGroups` removed in favor of route plugin configuration
- `tokensConfig` updated, with a new key `wrappedTokens` added
- Many UI-related properties consolidated under a top-level `ui` key
- `customTheme` and `mode` removed, replaced by a top-level `theme` property

Each of these changes is explained in more detail below, with examples for easy reference.

### Chain Names are Capitalized

In version 1.0, chain names are now consistent with the `Chain` type from the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, and must be capitalized. This affects all config properties where a chain is referenced, including `rpcs`, `rest`, `graphql`, and `chains`.

```diff
rpcs: {
-  "ethereum": "<rpcUrl>",
-  "solana": "<rpcUrl>"
+  "Ethereum": "<rpcUrl>",
+  "Solana": "<rpcUrl>"
}
```

You can find the full list of supported chain names in the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/fa4ba4bc349a7caada809f209090d79a3c5962fe/core/base/src/constants/chains.ts#L12-L66){target=\_blank}.

### `env` is Renamed to `network`

The `env` property has been renamed to `network`, with capitalized values. This change affects how you configure TestNet and MainNet environments.

```typescript
// Before
const config: WormholeConnectConfig = {
  env: 'testnet',
};

// Now (v1.0)
const config: WormholeConnectConfig = {
  network: 'Testnet',
};
```

If you don’t explicitly set the `network` value, Connect will default to `Mainnet`.

```typescript
// Defaults to Mainnet
const config: WormholeConnectConfig = {};
```

For more information, refer to the [network constants list](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/networks.ts){target=\_blank}.

### `networks` is Renamed to `chains`

The `networks` property, which allowed whitelisting chains, is now renamed to `chains`, and the chain names are capitalized.

```typescript
// Before
const config: WormholeConnectConfig = {
  networks: [
    'solana',
    'ethereum',
  ],
};

// Now (v1.0)
const config: WormholeConnectConfig = {
  chains: [
    'Solana',
    'Ethereum',
  ],
};
```

### `routes` Updated to Use Route Plugins

The `routes` property in Wormhole Connect version 1.0 has undergone a significant update. Previously, `routes` was a simple array of strings. In the latest version, it has been transformed into a flexible plugin system, allowing you to include specific routes for various protocols.

By default, if no `routes` property is set, Wormhole Connect will provide routes for two core protocols:

 - [Wormhole Token Bridge](/docs/learn/messaging/token-nft-bridge/){target=\_blank}
 - [CCTP](/docs/learn/messaging/cctp/){target=\_blank}

For most use cases, integrators require more than the default routes. The new `routes` property allows you to specify which protocols to include, as well as exclude any routes unnecessary for your application. This includes both default and third-party routes.

#### Available Route Plugins

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

Now that you know the available `route` plugins, let's explore some examples on how to configure them.

#### Example: Offering Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
import {
  AutomaticCCTPRoute,
  WormholeConnectConfig,
  WormholeConnect,
} from "@wormhole-foundation/wormhole-connect";

const config: WormholeConnectConfig = {
  routes: [
    AutomaticCCTPRoute,
  ],
};

<WormholeConnect config={config} />;
```

#### Example: Offering All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (Token Bridge & CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/build/contract-integrations/native-token-transfers/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
import {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  WormholeConnectConfig,
  WormholeConnect,
} from "@wormhole-foundation/wormhole-connect";

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: WormholeConnectConfig = {
  routes: [
    ...DEFAULT_ROUTES,
    ...nttRoutes(myNttConfig),
    MayanRouteSWIFT,
  ],
};

<WormholeConnect config={config} />;
```

This flexible plugin system allows you to combine default routes (such as Token Bridge and CCTP) with third-party protocols, offering full control over which routes are available in your application.

## `tokensConfig` Updated with New Structure

In version 1.0 of Wormhole Connect, the `tokensConfig` property has been updated to simplify the structure and improve flexibility for token handling across chains. The previous configuration has been streamlined, and a new key, `wrappedTokens`, has been introduced to handle foreign assets more effectively.

Key Changes to `tokensConfig`:

 - **Capitalized chain names** - all chain names, like "`ethereum`", must now be capitalized, such as "`Ethereum`", to maintain consistency with the rest of the Wormhole SDK
 - **`wrappedTokens`** - this new key replaces foreignAssets and defines the token addresses on foreign chains, making it easier to manage cross-chain transfers. It consolidates the wrapped token addresses into a cleaner structure
 - **Simplified decimals** - instead of using a map of decimal values for different chains, you now only need to provide a single decimals value for the token's native chain

### Example: Old `tokensConfig`

In the old structure, the `foreignAssets` field was used to define the token’s presence on other chains, and `decimals` were mapped across multiple chains.

```typescript
tokensConfig: {
  WETH: {
    key: 'WETH',
    symbol: 'WETH',
    nativeChain: 'ethereum',
    icon: Icon.ETH,
    tokenId: {
      chain: 'ethereum',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    coinGeckoId: 'ethereum',
    color: '#62688F',
    decimals: { Ethereum: 18, default: 8 },
    foreignAssets: {
      Solana: {
        address: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
        decimals: 8,
      },
    },
  }
}
```

### Example: Updated `tokensConfig` in v1.0

In v1.0, `foreignAssets` has been replaced with `wrappedTokens`, simplifying token transfers across chains by directly mapping wrapped token addresses. The `decimals` value is now a simple number representing the token’s decimals on its native chain.

```typescript
tokensConfig: {
  WETH: {
    key: "WETH",
    symbol: "WETH",
    nativeChain: "Ethereum", // Chain name now capitalized
    icon: Icon.ETH,
    tokenId: {
      chain: "Ethereum",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    coinGeckoId: "ethereum",
    color: "#62688F",
    decimals: 18, // Simplified decimals field
  }
},
wrappedTokens: {
  WETH: {
    Solana: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", // Now under wrappedTokens
    /* additional chains */
  }
}
```

## UI Configuration Updates

In version 1.0 of Wormhole Connect, the configuration related to the user interface has been significantly updated. Several UI properties that were previously scattered have now been consolidated under a new `ui` key, making the UI configuration cleaner and easier to manage.

Key UI Changes:

 - **Consolidated UI properties** - many UI-related properties have been moved under a new top-level ui key for better organization
 - **Removed `customTheme` and `mode`** - these properties have been removed in favor of a new top-level prop called `theme`, which simplifies theming and allows dynamic switching between themes

### UI Properties

The following properties that were previously defined at the root level of the configuration are now part of the `ui` key:

???- tip "UI Properties"
    - `explorer` → `ui.explorer` - specifies the explorer to use for viewing transactions
    - `bridgeDefaults` → `ui.defaultInputs` - sets default input values for the bridge, such as the source and destination chains and token
    - `pageHeader` → `ui.pageHeader` - sets the title and header for the page
    - `menu` → `ui.menu` - defines the menu items displayed in the interface
    - `searchTx` → `ui.searchTx` - configures the transaction search functionality
    - `partnerLogo` → `ui.partnerLogo` - displays a partner's logo on the interface
    - `walletConnectProjectId` → `ui.walletConnectProjectId` - integrates WalletConnect into the UI
    - `showHamburgerMenu` → `ui.showHamburgerMenu` - enables or disables the hamburger menu for navigation

Additionally, there are two new properties under `ui`:

 - **`ui.title`** - sets the title rendered in the top left corner of the UI. The default is "Wormhole Connect"
 - **`ui.getHelpUrl`** - URL that Connect will render when an unknown error occurs, allowing users to seek help. This can link to a Discord server or any other support channel

```typescript
const config: WormholeConnectConfig = {
  ui: {
    title: 'DonkeyCoin Bridge',
    getHelpUrl: 'https://discord.gg/DonkeyCoinCommunity',
  },
};
```

### UI Configuration Updates

In the old structure, UI-related settings like `explorer` and `bridgeDefaults` were defined at the root level of the configuration. In version 1.0, these properties are now organized under the `ui` key, improving the readability and manageability of the configuration.

```typescript
// Before (v0.x)
const config: WormholeConnectConfig = {
  bridgeDefaults: {
    fromNetwork: 'solana',
    toNetwork: 'ethereum',
    tokenKey: 'USDC',
    requiredNetwork: 'solana',
  },
  showHamburgerMenu: true,
};

// Now (v1.0)
const config: WormholeConnectConfig = {
  ui: {
    defaultInputs: {
      fromChain: 'Solana',  // Chain names now capitalized
      toChain: 'Ethereum',
      tokenKey: 'USDC',
      requiredChain: 'Solana',
    },
    showHamburgerMenu: true,
  },
};
```

### `customTheme` and `mode` Removed

In version 1.0, the `customTheme` and `mode` properties, which were previously used for setting themes, have been removed. These have been replaced by a new top-level prop called `theme`, which allows for more flexibility and dynamic updates to themes.

Important Details:

 - The `theme` prop is not part of the `config` object and is passed separately to Wormhole Connect
 - `config` cannot be modified after Connect has mounted, but the `theme` can be updated dynamically to support changes such as switching between light and dark modes or updating color schemes

```typescript
// Before (v0.x)
const config: WormholeConnectConfig = {
  customTheme: {
    primaryColor: "#4266f5",
    secondaryColor: "#ff5733",
  },
  mode: 'dark',
};

// Now (v1.0)
const theme: WormholeConnectTheme = {
  mode: 'dark',  // Can be dynamically changed
  font: 'Arial',
  button: {
    primary: '#4266f5',
  }
};

<WormholeConnect config={config} theme={theme} />;
```

