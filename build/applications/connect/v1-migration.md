---
title: Wormhole Connect v1.0 Migration Guide
description: Learn how to migrate to Wormhole Connect v1.0, with step-by-step guidance on updating your package and configuration.
---

# Wormhole Connect v1.0 Migration Guide

## Overview

The Wormhole Connect feature has been updated to **version 1.0**, introducing a modernized design and improved routing for faster native-to-native token transfers. This stable release comes with several breaking changes in how to configure the application, requiring minor updates to your integration.

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

In version 1.0, the `WormholeConnectConfig` object underwent several breaking changes. Most of these changes are minor and can be applied quickly. Below is a summary of the key changes, followed by detailed examples.

### Summary of Breaking Changes

- Chain names are now capitalized: `solana` → `Solana`
- `env` renamed to `network`: `mainnet` → `Mainnet`
- `networks` renamed to `chains`, with capitalized names
- `routes` updated to use route plugins
- `nttGroups` removed in favor of route plugin configuration
- `tokensConfig` updated, with a new key `wrappedTokens` added
- Many UI-related properties consolidated under a top-level `ui` key
- `customTheme` and `mode` were removed, replaced by a top-level `theme` property

These changes are explained in more detail below, with examples for easy reference.

### Chain Names are Capitalized

In version 1.0, chain names are now consistent with the `Chain` type from the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, and must be capitalized. This affects all config properties where a chain is referenced, including `rpcs`, `rest`, `graphql`, and `chains`.

```typescript
// Before
const config: WormholeConnectConfig = {
  rpcs: {
    ethereum: '<rpcUrl>',
    solana: '<rpcUrl>',
  },
};

// Now (v1.0)
const config: WormholeConnectConfig = {
  rpcs: {
    Ethereum: '<rpcUrl>',
    Solana: '<rpcUrl>',
  },
};
```

You can find the complete list of supported chain names in the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/fa4ba4bc349a7caada809f209090d79a3c5962fe/core/base/src/constants/chains.ts#L12-L66){target=\_blank}.

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

The `networks` property, which allowed whitelisting chains, is now renamed `chains`, and the chain names are capitalized.

```typescript
// Before
const config: WormholeConnectConfig = {
  networks: ['solana', 'ethereum'],
};

// Now (v1.0)
const config: WormholeConnectConfig = {
  chains: ['Solana', 'Ethereum'],
};
```

### `routes` Updated to Use Route Plugins

The `routes` property in Wormhole Connect version 1.0 has significantly improved. Previously, `routes` was a simple array of strings. The latest version has been transformed into a flexible plugin system, allowing you to include specific routes for various protocols.

By default, if no `routes` property is set, Wormhole Connect will provide routes for two core protocols:

 - [Wormhole Token Bridge](/docs/learn/messaging/token-nft-bridge/){target=\_blank}
 - [CCTP](/docs/learn/messaging/cctp/){target=\_blank}

For most use cases, integrators require more than the default routes. The new `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including both default and third-party routes.

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

Now that you know the available `route` plugins, let's explore some examples of configuring them.

#### Example: Offering Only CCTP Transfers

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

#### Example: Offering All Default Routes and Third-Party Plugins

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

## `tokensConfig` Updated with New Structure

In Wormhole Connect version 1.0, the `tokensConfig` property has been updated to simplify the structure and improve flexibility for token handling across chains. The previous configuration has been streamlined, and a new key, `wrappedTokens,` has been introduced to handle foreign assets more effectively.

Key Changes to `tokensConfig`:

 - **Capitalized chain names** - all chain names, like "`ethereum`", must now be capitalized, such as "`Ethereum`", to maintain consistency with the rest of the Wormhole SDK
 - **`wrappedTokens`** - this new key replaces `foreignAssets` and defines the token addresses on foreign chains, making it easier to manage cross-chain transfers. It consolidates the wrapped token addresses into a cleaner structure
 - **Simplified decimals** - instead of using a map of decimal values for different chains, you now only need to provide a single decimals value for the token's native chain

### Example: Old `tokensConfig`

In the old structure, the `foreignAssets` field defined the token’s presence on other chains, and `decimals` were mapped across multiple chains.

```typescript
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
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
          address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
          decimals: 8,
        },
      },
    },
  },
};
```

### Example: Updated `tokensConfig` in v1.0

In v1.0, `foreignAssets` has been replaced with `wrappedTokens`, simplifying token transfers across chains by directly mapping wrapped token addresses. The `decimals` value is now a simple number representing the token’s decimals on its native chain.

```typescript
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  tokensConfig: {
    WETH: {
      key: 'WETH',
      symbol: 'WETH',
      nativeChain: 'Ethereum', // Chain name now capitalized
      icon: Icon.ETH,
      tokenId: {
        chain: 'Ethereum',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      },
      coinGeckoId: 'ethereum',
      color: '#62688F',
      decimals: 18, // Simplified decimals field
    },
  },
  wrappedTokens: {
    WETH: {
      Solana: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
      /* additional chains */
    },
  },
};
```

## NTT Configuration Updates

In Wormhole Connect version 1.0, the `nttGroups` property, which was used to configure Native Token Transfers (NTT), has been removed. Instead, the NTT configuration is passed directly to the NTT route constructor. This update simplifies the setup and provides more flexibility for defining NTT routes.

Key Changes:

 - **Removed `nttGroups`** - the `nttGroups` property has been removed from the configuration and is now passed as an argument to the `nttRoutes` function
 - **Direct NTT route configuration** - NTT routes are now defined more explicitly, allowing for a more organized structure when specifying tokens, chains, and managers

This change simplifies the configuration process by providing a cleaner, more flexible way to handle NTT routes across different chains.

### Example: Old NTT Configuration

In the previous version, `nttGroups` defined the NTT managers and transceivers for different tokens across multiple chains.

```typescript
import WormholeConnect, {
  nttRoutes,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  nttGroups: {
    Lido_wstETH: {
      nttManagers: [
        {
          chainName: 'ethereum',
          address: '0xb948a93827d68a82F6513Ad178964Da487fe2BD9',
          tokenKey: 'wstETH',
          transceivers: [
            {
              address: '0xA1ACC1e6edaB281Febd91E3515093F1DE81F25c0',
              type: 'wormhole',
            },
          ],
        },
        {
          chainName: 'bsc',
          address: '0x6981F5621691CBfE3DdD524dE71076b79F0A0278',
          tokenKey: 'wstETH',
          transceivers: [
            {
              address: '0xbe3F7e06872E0dF6CD7FF35B7aa4Bb1446DC9986',
              type: 'wormhole',
            },
          ],
        },
      ],
    },
  },
};
```

### Example: NTT Configuration in v1.0

In v1.0, `nttGroups` has been removed, and the configuration is passed to the NTT route constructor as an argument. The tokens and corresponding transceivers are now clearly defined within the `nttRoutes` configuration.

```typescript
import WormholeConnect, {
  nttRoutes,
} from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  routes: [
    ...nttRoutes({
      tokens: {
        Lido_wstETH: [
          {
            chain: 'Ethereum',
            manager: '0xb948a93827d68a82F6513Ad178964Da487fe2BD9',
            token: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
            transceiver: [
              {
                address: '0xA1ACC1e6edaB281Febd91E3515093F1DE81F25c0',
                type: 'wormhole',
              },
            ],
          },
          {
            chain: 'Bsc',
            manager: '0x6981F5621691CBfE3DdD524dE71076b79F0A0278',
            token: '0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C',
            transceiver: [
              {
                address: '0xbe3F7e06872E0dF6CD7FF35B7aa4Bb1446DC9986',
                type: 'wormhole',
              },
            ],
          },
        ],
      },
    }),
    /* other routes */
  ],
};
```

In this new structure, NTT routes are passed directly through the `nttRoutes` function, with `tokens`, `chains`, and `transceivers` clearly defined for each supported asset.

## UI Configuration Updates

In Wormhole Connect version 1.0, the user interface configuration has been significantly updated. Several previously scattered UI properties have now been consolidated under a new `ui` key, making the UI configuration cleaner and easier to manage.

Key UI Changes:

 - **Consolidated UI properties** - many UI-related properties moved under a new top-level ui key for better organization
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
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = {
  ui: {
    title: 'DonkeyCoin Bridge',
    getHelpUrl: 'https://discord.gg/DonkeyCoinCommunity',
    menu: [
      {
        label: 'Support',
        href: 'https://donkeycoin.io/about',
        target: '_blank',
        order: 1, // Order of appearance in the menu
      },
      {
        label: 'About',
        href: 'https://donkeycoin.io/about',
        target: '_blank',
        order: 2,
      },
    ],
    showHamburgerMenu: false,
  },
};
```

### UI Configuration Updates

In the old structure, UI-related settings like `explorer` and `bridgeDefaults` were defined at the root level of the configuration. In version 1.0, these properties are now organized under the `ui` key, improving the configuration's readability and manageability.

```typescript
// Before
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
      fromChain: 'Solana', // Chain names now capitalized
      toChain: 'Ethereum',
      tokenKey: 'USDC',
      requiredChain: 'Solana',
    },
    showHamburgerMenu: true,
  },
};
```

### `customTheme` and `mode` Removed

In version 1.0, the `customTheme` and `mode` properties, which were previously used to set themes, have been removed. They have been replaced by a new top-level prop called `theme`, which allows for more flexibility and dynamic updates to themes.

Important Details:

 - The `theme` prop is not part of the `config` object and is passed separately to Wormhole Connect
 - `config` cannot be modified after Connect has mounted, but the `theme` can be updated dynamically to support changes such as switching between light and dark modes or updating color schemes

```typescript
// Before
const config: WormholeConnectConfig = {
  customTheme: {
    primaryColor: '#4266f5',
    secondaryColor: '#ff5733',
  },
  mode: 'dark',
};

// Now (v1.0)
const theme: WormholeConnectTheme = {
  mode: 'dark', // Can be dynamically changed
  font: 'Arial',
  button: {
    primary: '#4266f5',
  },
};

<WormholeConnect config={config} theme={theme} />;
```

## Removed Properties

Several configuration properties have been removed in Wormhole Connect version 1.0. These keys no longer have any effect, and providing values for them in the configuration will not result in any changes.

Removed Config Keys:

 - `cta`
 - `cctpWarning`
 - `pageSubHeader`
 - `moreTokens`
 - `moreChains`
 - `ethBridgeMaxAmount`
 - `wstETHBridgeMaxAmount`
 - `customTheme`
 - `mode`

If your current setup includes any of these properties, you can safely remove them, as they are no longer supported in v1.0.

## CDN-Hosted Version of Wormhole Connect

For those using the CDN-hosted version of Wormhole Connect, the package's installation and integration have been updated. You must install the Connect package from npm and use the new `wormholeConnectHosted` utility function.

### Steps to Install and Integrate

1. Install the Connect package via npm:

    ```bash
    npm install @wormhole-foundation/wormhole-connect@^0.1
    ```

2. After installing the package, you can embed Wormhole Connect into your page by adding the following code:

    ```typescript
    import { wormholeConnectHosted } from '@wormhole-foundation/wormhole-connect';

    const container = document.getElementById('connect')!;

    wormholeConnectHosted(container);
    ```

### Custom Configuration for Hosted Version

The `wormholeConnectHosted` function accepts two parameters: `config` and `theme`. This allows you to customize the routes and apply a theme directly within the hosted version. Here’s an example of how you can pass a custom configuration:

```typescript
import {
  wormholeConnectHosted,
  MayanRoute,
} from '@wormhole-foundation/wormhole-connect';

const container = document.getElementById('connect')!;

wormholeConnectHosted(container, {
  config: {
    routes: [MayanRoute],
    eventHandler: (e) => {
      console.log('Connect event', e);
    },
  },
  theme: {
    background: {
      default: '#004547',
    },
  },
});
```

In this example, the `config` object defines the routes (in this case, using the Mayan route), while the `theme` object allows customization of the Connect interface (e.g., background color).