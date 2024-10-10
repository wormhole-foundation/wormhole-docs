---
title: Configure Your Connect Widget
description: Configure Wormhole Connect v0 for React or HTML, set themes, define tokens, networks, and customize RPC endpoints for optimized blockchain interactions.
---

## Introduction {: #introduction }

Configure the Wormhole Connect React component by passing a `WormholeConnectConfig` object as the `config` attribute. If using the hosted version, provide `config` and `theme` as JSON-serialized strings on the mount point.

!!! note
    If you are looking to upgrade from Wormhole Connect v0 to v1, please refer to the [migration guide](/docs/build/applications/connect/upgrade/){target=\_blank} for detailed instructions.

    For the latest version of Wormhole Connect, please refer to the current [configuration documentation](/docs/build/applications/connect/configuration/){target=\_blank}

=== "React"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/configure-react-v0.tsx'
    ```

=== "HTML Tags"

    ```html
    --8<-- 'code/build/applications/connect/configuration/configure-html.html'
    ```

## Examples {: #examples }

Below are some examples of different ways you can configure Connect. See `WormholeConnectConfig` in the below file for a full view of the supported configuration parameters.

??? code "View `WormholeConnectConfig`"
    ```ts
    --8<-- 'code/build/applications/connect/configuration/index.ts'
    ```

### Custom Networks and RPC Endpoints {: #custom-networks-and-rpc-endpoints }

Specify supported networks, tokens, and custom RPC endpoints. Your users may encounter rate limits using public RPC endpoints if you don't provide your own.

=== "Mainnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple-v0.jsx'
    ```

=== "Testnet"

    ```js
    --8<-- 'code/build/applications/connect/configuration/custom-simple-testnet-v0.tsx'
    ```

!!! note
    For a complete list of Testnet chain names that can be manually added, see the [Testnet Chains List](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/fa4ba4bc349a7caada809f209090d79a3c5962fe/tokenRegistry/src/scripts/importConnect.ts#L44-L55){target=\_blank}. 

### Fully Customized Theme {: #fully-customized-theme }

Wormhole Connect offers a high level of customizability that suits and integrates with your application's design, including various options for buttons, backgrounds, popovers, fonts, and more. The following example demonstrates a variety of appearance customizations. Remember, if you prefer a visual to aid in designing your widget, you can use the [no code style interface](https://connect-in-style.wormhole.com/){target=\_blank}.

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-full.jsx'
```

### Environment {: #environment }

You can configure Connect to be used in Testnet environments, too. You can toggle between Mainnet and Testnet environments by defining the `WormholeConnectConfig` as follows:

=== "Mainnet"

    ```ts
    const config: WormholeConnectConfig = {
      "env": "mainnet"
    }
    ```

=== "Testnet"

    ```ts
    const config: WormholeConnectConfig = {
      "env": "testnet"
    }
    ```
### Custom RPC Endpoint {: #custom-rpc-endpoint }

You can define a custom RPC provider for your Connect widget to use. This can be especially helpful if you'd like to replace public endpoints with dedicated or private endpoints.

```ts
const config: WormholeConnectConfig = {
  "rpcs": {
    "solana": "https://rpc.ankr.com/solana/ee827255553bb0fa9e0aaeab27e988707e60ea06ae36be0658b778072e94979e"
  }
}
```

### Arbitrary Token {: #arbitrary-token }

The following section shows how to add an arbitrary token to your deployment of Connect. 

!!! note
    You will need to [register](https://portalbridge.com/advanced-tools/#/register){target=\_blank} your token with the Token Bridge to get the contract addresses necessary for it to work with Connect.

This example configuration limits Connect to the Solana and Ethereum networks and a handful of tokens, including `BSKT`, which isn't built in by default and provided under the `tokensConfig` key.

See [src/config/types.ts](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank} for the type definition of `TokensConfig`.

```json
--8<-- 'code/build/applications/connect/configuration/arbitrary-token.json'
```

## More Configuration Options {: #more-configuration-options }

### Whitelisting Tokens {: #whitelisting-tokens }

By default, Connect will offer its complete built-in list of assets, but you can restrict the displayed assets by defining a subset of tokens under `tokens`. The default full list is as follows:

|    Mainnet     |              Testnet               |
|:--------------:|:----------------------------------:|
|      ETH       |          ETH, ETHsepolia           |
|      WETH      |         WETH, WETHsepolia          |
|    USDCeth     |              USDCeth               |
|      WBTC      |                 -                  |
|      USDT      |                 -                  |
|      DAI       |                 -                  |
|      BUSD      |                 -                  |
|     MATIC      |               MATIC                |
|     WMATIC     |               WMATIC               |
|  USDCpolygon   |                 -                  |
|      BNB       |                BNB                 |
|      WBNB      |                WBNB                |
|    USDCbnb     |                 -                  |
|      AVAX      |                AVAX                |
|     WAVAX      |               WAVAX                |
|    USDCavax    |              USDCavax              |
|      FTM       |                FTM                 |
|      WFTM      |                WFTM                |
|      CELO      |                CELO                |
|      GLMR      |                GLMR                |
|     WGLMR      |               WGLMR                |
|      SOL       |                WSOL                |
|      PYTH      |                 -                  |
|      SUI       |                SUI                 |
|    USDCsol     |                 -                  |
|      APT       |                APT                 |
|  ETHarbitrum   |  ETHarbitrum, ETHarbitrum_sepolia  |
|  WETHarbitrum  | WETHarbitrum, WETHarbitrum_sepolia |
|  USDCarbitrum  |            USDCarbitrum            |
|  ETHoptimism   |  ETHoptimism, ETHoptimism_sepolia  |
|  WETHoptimism  | WETHoptimism, WETHoptimism_sepolia |
|  USDCoptimism  |            USDCoptimism            |
|    ETHbase     |      ETHbase, ETHbase_sepolia      |
|    WETHbase    |     WETHbase, WETHbase_sepolia     |
|      tBTC      |                tBTC                |
|  tBTCpolygon   |            tBTCpolygon             |
|  tBTCoptimism  |            tBTCoptimism            |
|  tBTCarbitrum  |            tBTCarbitrum            |
|    tBTCbase    |              tBTCbase              |
|    tBTCsol     |              tBTCsol               |
|  WETHpolygon   |                 -                  |
|    WETHbsc     |                 -                  |
|     wstETH     |               wstETH               |
| wstETHarbitrum |                 -                  |
| wstETHoptimism |                 -                  |
| wstETHpolygon  |                 -                  |
|   wstETHbase   |                 -                  |

### Routes {: #routes }

By default, Connect will offer its complete built-in list of routes, but you can restrict the possible route assets by defining a subset under `routes.` By default, Connect will offer its complete built-in list:

|    Mainnet    |    Testnet    |
|:-------------:|:-------------:|
|    bridge     |    bridge     |
|     relay     |     relay     |
|  cctpManual   |  cctpManual   |
|   cctpRelay   |   cctpRelay   |
|   nttManual   |   nttManual   |
|   nttRelay    |   nttRelay    |
|   ethBridge   |       -       |
| wstETHBridge  |       -       |
|  usdtBridge   |       -       |
| cosmosGateway | cosmosGateway |
|     tBTC      |     tBTC      |

### Wallet Set Up  {: #wallet-connect-project-id }

When using Wormhole Connect, your selected blockchain network determines the available wallet options.

 - For EVM chains, wallets like MetaMask and WalletConnect are supported
 - For Solana, you'll see options such as Phantom, Torus, and Coin98

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

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

#### Sample Configuration {: #sample-configuration }

```json
--8<-- 'code/build/applications/connect/configuration/sample-configuration.json'
```

### CoinGecko API Key {: #coingecko-api-key }

The CoinGecko API can be used to fetch token price data. If you have a [CoinGecko API Plan](https://apiguide.coingecko.com/getting-started/getting-started){target=\_blank}, you can include the API key in the configuration. Remember to always take steps to protect your sensitive API keys, such as defining them in `.env` files and including such files in your `.gitignore`.

### More Networks {: #more-networks }

Specify a set of extra networks to be displayed on the network selection modal, each linking to a different page, dApp, or mobile app the user will be redirected to. The following properties are accessed through the `moreNetworks` property (e.g., `moreNetworks.href`):

| <div style="width:15em">Property</div> |                                                                       Description                                                                       |
|:--------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                 `href`                 |                                                  **Required**. Default value for missing network hrefs                                                  |
|                `target`                |                                           Default value for missing network link targets. Defaults to `_self`                                           |
|             `description`              | Brief description that should be displayed as a tooltip when the user hovers over a more network icon. Used as default for missing network descriptions |
|           `networks[].icon`            |                                                     **Required**. URL data encoded icon to display                                                      |
|           `networks[].href`            | Network href to redirect to. If present, the values `sourceChain` and `targetChain` are replaced with the currently selected chains before redirecting  |
|           `networks[].label`           |                                                               **Required**. Display text                                                                |
|           `networks[].name`            |                                            Unique network key. Defaults to a snake_case version of the label                                            |
|        `networks[].description`        |                                                Description value. Defaults to `moreNetworks.description`                                                |
|          `networks[].target`           |                                                  href target value. Defaults to `moreNetworks.target`                                                   |
|     `networks[].showOpenInNewIcon`     |                    Disable top right open in new icon. Defaults to **true** if target is `_blank` or **false** if target is `_self`                     |

??? code "View full configuration"
    ```json
    --8<-- 'code/build/applications/connect/configuration/advanced-configuration.json'
    ```

### More Tokens {: #more-tokens }

Show a particular entry on the select tokens modal, redirecting the user to a different page, dApp, or mobile app. The following properties are accessed through the `moreTokens` property (e.g., `moreTokens.label`):

| Property |                                                                         Description                                                                         |
|:--------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `label`  |                                                                 **Required**. Display text                                                                  |
|  `href`  | **Required**. URL to redirect to. If present, the values `sourceChain` and `targetChain` are replaced with the currently selected chains before redirecting |
| `target` |                                                              href target. Defaults to `_self`                                                               |

### Explorer {: #explorer }

Enable the explorer button to allow users to search for their transactions on a given explorer, filtering by their wallet address. The following properties are accessed through the `explorer` property (e.g., `explorer.label`):

| Property |                                                                                             Description                                                                                             |
|:--------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `label`  |                                                                              Display text. Defaults to `Transactions`                                                                               |
|  `href`  | **Required**. URL of the explorer, for instance [https://wormholescan.io/](https://wormholescan.io/){target=\_blank}. If present, the value `address` is replaced with the connected wallet address |
| `target` |                                                                                 `href` target. Defaults to `_blank`                                                                                 |