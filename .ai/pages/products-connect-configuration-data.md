---
title: Connect Data Configuration
description: Configure Wormhole Connect v1 (latest) with custom chains, tokens, routes, and more for enhanced blockchain interoperability.
categories: Connect, Transfer
url: https://wormhole.com/docs/products/connect/configuration/data/
---

## Data Configuration

This page explains how to configure Wormhole Connect's core functionality, from choosing supported chains and tokens to bridging routes to setting up wallets and enabling price lookups. By the end, you'll know how to specify custom networks and RPC endpoints, integrate different bridging protocols, add new tokens, and more.

## Get Started

Configure Wormhole Connect by passing a `WormholeConnectConfig` object as the `config` prop.

=== "React integration"

    ```ts
    import WormholeConnect, {
      type config,
    } from '@wormhole-foundation/wormhole-connect';

    const config: config.WormholeConnectConfig = {
      chains: ['Ethereum', 'Polygon', 'Solana'],
      tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
      rpcs: {
        Ethereum: 'https://rpc.ankr.com/eth',
        Solana: 'https://rpc.ankr.com/solana',
      }
    }

    <WormholeConnect config={config} />

    ```

=== "Hosted integration"

    ```ts
    import WormholeConnect, { wormholeConnectHosted, type config } from '@wormhole-foundation/wormhole-connect';

    const config: config.WormholeConnectConfig = {
      chains: ['Ethereum', 'Polygon', 'Solana'],
      tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
      rpcs: {
        Ethereum: 'https://rpc.ankr.com/eth',
        Solana: 'https://rpc.ankr.com/solana',
      },
    };

    const container = document.getElementById('bridge-container');

    wormholeConnectHosted(container, {
      config,
    });

    ```

!!! note
    The complete type definition of `WormholeConnectConfig` is available in the [Wormhole Connect repository](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/types.ts#L96){target=\_blank}.

## Examples {: #examples }

### Configuring Chains and RPC Endpoints {: #chains-and-rpc-endpoints }

Connect lets you customize the available chains to match your project's needs. You should provide your own RPC endpoints, as the default public ones may not support essential functions like balance fetching.

=== "Mainnet"

    ```js
    import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

    const config: config.WormholeConnectConfig = {
      chains: ['Ethereum', 'Polygon', 'Solana'],
      rpcs: {
        Ethereum: 'https://rpc.ankr.com/eth',
        Solana: 'https://rpc.ankr.com/solana',
      },
    };

    function App() {
      return <WormholeConnect config={config} />;
    }

    ```

=== "Testnet"

    ```js
    import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

    const config: config.WormholeConnectConfig = {
      // You can use Connect with testnet chains by specifying "network":
      network: 'Testnet',
      chains: ['Sepolia', 'ArbitrumSepolia', 'BaseSepolia', 'Avalanche'],
      rpcs: {
        Avalanche: 'https://rpc.ankr.com/avalanche_fuji',
        BaseSepolia: 'https://base-sepolia-rpc.publicnode.com',
      },
    };

    function App() {
      return <WormholeConnect config={config} />;
    }

    ```

!!! note
    For a complete list of available chain names, see the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank}.

### Configuring Routes

By default, Connect offers two bridging protocols: Wrapped Token Transfers (WTT) and Circle's CCTP (for native USDC). For most use cases, integrators require more than these default routes. The `routes` property allows you to specify which protocols to include and exclude any routes unnecessary for your application, including default and third-party routes.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

#### Available Route Plugins

The `@wormhole-foundation/wormhole-connect` package offers a variety of `route` plugins to give you flexibility in handling different protocols. You can choose from the following `route` exports for your integration:

- **[`TokenBridgeRoute`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/manual.ts){target=\_blank}**: Manually redeemed Wormhole WTT route.
- **[`AutomaticTokenBridgeRoute`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/tokenBridge/automatic.ts){target=\_blank}**: Automatically redeemed (relayed) WTT route.
- **[`CCTPRoute`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/manual.ts){target=\_blank}**: Manually redeemed CCTP route.
- **[`AutomaticCCTPRoute`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/cctp/automatic.ts){target=\_blank}**: Automatically redeemed (relayed) CCTP route.
- **`DEFAULT_ROUTES`**: Array containing the four preceding routes (`TokenBridgeRoute`, `AutomaticTokenBridgeRoute`, `CCTPRoute`, `AutomaticCCTPRoute`).
- **[`nttAutomaticRoute(nttConfig)`](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/automatic.ts){target=\_blank}**: Function that returns the automatically-redeemed (relayed) Native Token Transfer (NTT) route.
- **[`nttManualRoute(nttConfig)`](https://github.com/wormhole-foundation/native-token-transfers/blob/main/sdk/route/src/manual.ts){target=\_blank}**: Function that returns the manually-redeemed NTT route.
- **`nttRoutes(nttConfig)`**: Function that returns both NTT routes as an array.
- **[`MayanRoute`](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L57){target=\_blank}**: Route that offers multiple Mayan protocols.
- **[`MayanRouteSWIFT`](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L528){target=\_blank}**: Route for Mayan's Swift protocol only.
- **[`MayanRouteMCTP`](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L539){target=\_blank}**: Route for Mayan's MCTP protocol only.
- **[`MayanRouteWH`](https://github.com/mayan-finance/wormhole-sdk-route/blob/main/src/index.ts#L550){target=\_blank}**: Route for Mayan's original Wormhole transfer protocol.

In addition to these routes, developers can create custom routes for their Wormhole-based protocols. For examples, refer to the [NTT](https://github.com/wormhole-foundation/native-token-transfers/tree/main/sdk/route){target=\_blank} and the [Mayan](https://github.com/mayan-finance/wormhole-sdk-route){target=\_blank} example GitHub repositories.

For further details on the `route` plugin interface, refer to the [Wormhole TypeScript SDK route code](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/connect/src/routes/route.ts){target=\_blank}.

#### Example: Offer Only CCTP Transfers

To configure Wormhole Connect to offer only USDC transfers via the CCTP route, use the following configuration:

```typescript
import WormholeConnect, {
  AutomaticCCTPRoute,
  type config,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  routes: [AutomaticCCTPRoute],
};

<WormholeConnect config={config} />;

```

#### Example: Offer All Default Routes and Third-Party Plugins

In this example, Wormhole Connect is configured with routes for both default protocols (WTT and CCTP), as well as third-party protocols like [Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank} and [Mayan Swap](https://swap.mayan.finance/){target=\_blank}.

```typescript
import WormholeConnect, {
  DEFAULT_ROUTES,
  nttRoutes,
  MayanRouteSWIFT,
  type config,
} from '@wormhole-foundation/wormhole-connect';

import { myNttConfig } from './consts'; // Custom NTT configuration

const config: config.WormholeConnectConfig = {
  routes: [...DEFAULT_ROUTES, ...nttRoutes(myNttConfig), MayanRouteSWIFT],
};

<WormholeConnect config={config} />;

```

This flexible plugin allows you to combine default routes (such as WTT and CCTP) with third-party protocols, offering complete control over which routes are available in your application.

### Adding Custom Tokens {: #custom-tokens }

The following section shows how to add an arbitrary token to your deployment of Connect.

!!! note
    You will need to [register](https://portalbridge.com/legacy-tools/#/register){target=\_blank} your token with WTT to get the contract addresses necessary for it to work with that protocol.

This example configuration adds the BONK token to Connect. Note the `wrappedTokens` property, which is required for use with WTT.

See the [Connect source code](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/types.ts#L182){target=\_blank} for the type definition of `TokensConfig`.

```typescript
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  tokensConfig: {
    BONK: {
      key: 'BONK',
      symbol: 'BONK',
      nativeChain: 'Ethereum',
      icon: Icon.ETH,
      tokenId: {
        chain: 'Ethereum',
        address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6',
      },
      coinGeckoId: 'bonk',
      decimals: 18,
    },
  },
  wrappedTokens: {
    BONK: {
      Solana: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    },
  },
};

```

### Configuring Native Token Transfers (NTT)

Connect supports [NTT](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank}, which allows native tokens to move between supported chains using NTT-deployed contracts, such as managers and transceivers.

To enable NTT in your app, follow these steps:

 1. Add NTT routes to the `routes` array by calling `nttRoutes(...)` with your token deployment config using the spread operator. This sets up the route logic for native token transfers.
 2. Provide token metadata for each of the tokens listed in `nttRoutes` in the [`tokensConfig`](#custom-tokens) object. These entries must include `symbol`, `decimals`, and the `tokenId`.

```typescript
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';
import { nttRoutes } from '@wormhole-foundation/wormhole-connect/ntt';

const wormholeConfig: config.WormholeConnectConfig = {
  network: 'Testnet',
  chains: ['Solana', 'BaseSepolia'],
  tokens: ['WSV'],
  ui: {
    title: 'Wormhole NTT UI',
    defaultInputs: {
      fromChain: 'Solana',
      toChain: 'BaseSepolia',
    },
  },
  routes: [
    ...nttRoutes({
      tokens: {
        WSV_NTT: [
          {
            chain: 'Solana',
            manager: 'nMxHx1o8GUg2pv99y8JAQb5RyWNqDWixbxWCaBcurQx',
            token: '2vLDzr7hUpLFHQotmR8EPcMTWczZUwCK31aefAzumkmv',
            transceiver: [
              {
                address: 'AjL3f9FMHJ8VkNUHZqLYxa5aFy3aTN6LUWMv4qmdf5PN',
                type: 'wormhole',
              },
            ],
          },
          {
            chain: 'BaseSepolia',
            manager: '0xaE02Ff9C3781C5BA295c522fB469B87Dc5EE9205',
            token: '0xb8dccDA8C166172159F029eb003d5479687452bD',
            transceiver: [
              {
                address: '0xF4Af1Eac8995766b54210b179A837E3D59a9F146',
                type: 'wormhole',
              },
            ],
          },
        ],
      },
    }),
  ],
  tokensConfig: {
    WSVsol: {
      symbol: 'WSV',
      tokenId: {
        chain: 'Solana',
        address: '2vLDzr7hUpLFHQotmR8EPcMTWczZUwCK31aefAzumkmv',
      },
      icon: 'https://wormhole.com/token.png',
      decimals: 9,
    },
    WSVbase: {
      symbol: 'WSV',
      tokenId: {
        chain: 'BaseSepolia',
        address: '0xb8dccDA8C166172159F029eb003d5479687452bD',
      },
      icon: 'https://wormhole.com/token.png',
      decimals: 9,
    },
  },
};

```

For a complete working example of NTT configuration in Wormhole Connect, see the [ntt-connect demo repository](https://github.com/wormhole-foundation/demo-ntt-connect){target=\_blank}.

### Whitelisting Tokens {: #whitelisting-tokens }

Connect offers a list of built-in tokens by default. You can see it below:

- [Mainnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/mainnet/tokens.ts){target=\_blank}
- [Testnet tokens](https://github.com/wormhole-foundation/wormhole-connect/blob/production%403.0.0/wormhole-connect/src/config/testnet/tokens.ts){target=\_blank}

You can customize the tokens shown in the UI using the `tokens` property. The following example adds a custom token and limits Connect to showing only that token, along with the native gas tokens ETH and SOL.

```jsx
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  chains: ['Ethereum', 'Solana'],
  tokens: ['ETH', 'SOL', 'BONK'],
  rpcs: {
    Ethereum: 'https://rpc.ankr.com/eth',
    Solana: 'https://rpc.ankr.com/solana',
  },
  tokensConfig: {
    BONK: {
      key: 'BONK',
      symbol: 'BONK',
      icon: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587',
      tokenId: {
        chain: 'Ethereum',
        address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6',
      },
      decimals: 18,
    },
  },
  wrappedTokens: {
    BONK: {
      Solana: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    },
  },
};

function App() {
  return <WormholeConnect config={config} />;
}

```

You can whitelist tokens by symbol or by specifying tuples of [chain, address]. For example, this would show only BONK token (on all chains you've whitelisted) as well as [`EPjFW...TDt1v`](https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v){target=\_blank} on Solana, which is USDC.

```jsx
import WormholeConnect, {
  type config,
} from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  chains: ['Ethereum', 'Solana'],
  tokens: [
    // Whitelist BONK on every whitelisted chain
    'BONK',
    // Also whitelist USDC, specifically on Solana
    ['Solana', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
  ],
  ...
};

function App() {
  return <WormholeConnect config={config} />;
}

```

### User-Inputted Tokens {: #user-inputted-tokens }

As of version 2.0, Connect allows users to paste token addresses to bridge any token they want. As an integrator, you may want to disable this feature if you are deploying Connect for use only with a specific token(s).

If you provide a token whitelist (see above), this is turned off automatically. However, you can also disable it explicitly like this:

```jsx
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  ui: {
    disableUserInputtedTokens: true,
  },
};

function App() {
  return <WormholeConnect config={config} />;
}

```

Setting `ui.disableUserInputtedTokens` to `true` will disable the ability to paste in token addresses.

### Transaction Settings {: #transaction-settings }

Landing transactions on Solana can require finely tuned priority fees when there is congestion. You can tweak how Connect determines these with `transactionSettings`. All of the parameters in this configuration are optional; you can provide any combination of them.

```jsx
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const config: config.WormholeConnectConfig = {
  transactionSettings: {
    Solana: {
      priorityFee: {
        // Number between 0-1, defaults to 0.9. Higher percentile yields higher fees.
        // For example, you can set percentile to 0.95 to make Connect compute the
        // 95th percentile priority fee amount based on recent transactions
        percentile: 0.95,

        // Any number, defaults to 1.0. The fee amount is multiplied by this number.
        // This can be used to further raise or lower the fees Connect is using.
        // For example, percentile=0.95 and percentileMultiple=1.1 would use
        // the 95th percentile fee, with a 10% increase
        percentileMultiple: 1.1,

        // Minimum fee you want to use in microlamports, regardless of recent transactions
        // Defaults to 1
        min: 200_000,

        // Maximum fee you want to use in microlamports, regardless of recent transactions
        // Defaults to 100,000,000
        max: 5_000_000,
      },
    },
  },
};

function App() {
  return <WormholeConnect config={config} />;
}

```

!!! note
    Connect can calculate fees more accurately if you are using a [Triton](https://triton.one){target=\_blank} RPC endpoint.

### Wallet Set Up  {: #reown-cloud-project-id }

Your selected blockchain network determines the available wallet options when using Wormhole Connect.

 - For EVM chains, wallets like [MetaMask](https://metamask.io/){target=\_blank} and [Reown Cloud](https://reown.com/home){target=\_blank} (formerly WalletConnect) are supported.
 - For Solana, you'll see options such as [Phantom](https://phantom.com/){target=\_blank}, [Web3Auth](https://wallet.web3auth.io/){target=\_blank}, and [Coin98](https://coin98.com/){target=\_blank}.

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

To add Reown Cloud (formerly known as WalletConnect) as a supported wallet option, you need to obtain a project ID from the [Reown Cloud dashboard](https://dashboard.reown.com/){target=\_blank}. Once you have the project ID, set it in your `WormholeConnectConfig` under the `walletConnectProjectId` property.

```typescript
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';

const wormholeConfig: config.WormholeConnectConfig = {
  ...
  walletConnectProjectId: 'INSERT_PROJECT_ID',
};

```

!!! note
    If the `walletConnectProjectId` is not set, Reown Cloud (WalletConnect) will be disabled from the available wallet list in the Connect UI.
