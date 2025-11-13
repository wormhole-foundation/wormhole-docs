---
title: Configure Your Connect Widget v0
description: Configure Wormhole Connect v0 for React or HTML, set themes, define tokens, networks, and customize RPC endpoints for optimized blockchain interactions.
url: https://wormhole.com/docs/products/connect/configuration/configuration-v0/
---

# Configure Your Connect Widget

Wormhole Connect is a flexible React widget that streamlines cross-chain asset transfers and enables seamless interoperability by leveraging Wormhole's powerful infrastructure. Designed for easy integration into decentralized applications (dApps), Wormhole Connect abstracts the complexities of cross-chain communication, providing a user-friendly experience for both developers and end users.

This guide provides detailed instructions on configuring Wormhole Connect and highlights the many ways it can be customized to fit your specific needs, from integrating supported blockchains and tokens to tailoring the user interface.

!!! note
    For documentation on the latest version of Connect, please refer to the current [configuration documentation](/docs/products/connect/configuration/data/){target=\_blank}. If you are looking to upgrade from Wormhole Connect v0 to v1, please refer to the [migration guide](/docs/products/connect/guides/upgrade/){target=\_blank} for detailed instructions.

## Get Started

Configure the Wormhole Connect React component by passing a `WormholeConnectConfig` object as the `config` attribute. If using the hosted version, provide `config` and `theme` as JSON-serialized strings on the mount point.

=== "React"

    ```ts
    import WormholeConnect, {
      WormholeConnectConfig,
    } from '@wormhole-foundation/wormhole-connect';
      
    const config: WormholeConnectConfig = {
      networks: ['ethereum', 'polygon', 'solana'],
      tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
      rpcs: {
        ethereum: 'https://rpc.ankr.com/eth',
        solana: 'https://rpc.ankr.com/solana',
      }
    }
      
    <WormholeConnect config={config} />
    ```

=== "HTML Tags"

    ```html
    <div
      id="wormhole-connect"
      data-config='{"tokens":["ETH","WETH","WBTC","USDCeth"]}'
      data-theme='{"background":{"default": "#81c784"}}'
    />

    ```

## Examples {: #examples }

Below are some examples of different ways you can configure Connect. See `WormholeConnectConfig` in the below file for a full view of the supported configuration parameters.

??? code "View `WormholeConnectConfig`"
    ```ts
    import {
      ChainName,
      WormholeContext,
      WormholeConfig,
      ChainResourceMap,
    } from 'sdklegacy';
    import MAINNET from './mainnet';
    import TESTNET from './testnet';
    import DEVNET from './devnet';
    import type { WormholeConnectConfig } from './types';
    import {
      Network,
      InternalConfig,
      Route,
      WrappedTokenAddressCache,
    } from './types';
    import {
      mergeCustomTokensConfig,
      mergeNttGroups,
      validateDefaults,
    } from './utils';
    import { wrapEventHandler } from './events';

    import { SDKConverter } from './converter';

    import {
      wormhole as getWormholeV2,
      Wormhole as WormholeV2,
      Network as NetworkV2,
      Token as TokenV2,
      Chain as ChainV2,
      ChainTokens as ChainTokensV2,
      WormholeConfigOverrides as WormholeConfigOverridesV2,
    } from '@wormhole-foundation/sdk';

    import '@wormhole-foundation/sdk/addresses';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import aptos from '@wormhole-foundation/sdk/aptos';
    import sui from '@wormhole-foundation/sdk/sui';
    import cosmwasm from '@wormhole-foundation/sdk/cosmwasm';
    import algorand from '@wormhole-foundation/sdk/algorand';

    export function buildConfig(
      customConfig?: WormholeConnectConfig
    ): InternalConfig<NetworkV2> {
      const network = (
        customConfig?.network ||
        customConfig?.env || // TODO remove; deprecated
        import.meta.env.REACT_APP_CONNECT_ENV?.toLowerCase() ||
        'mainnet'
      ).toLowerCase() as Network;

      if (!['mainnet', 'testnet', 'devnet'].includes(network))
        throw new Error(`Invalid env "${network}"`);

      const networkData = { MAINNET, DEVNET, TESTNET }[network.toUpperCase()]!;

      const tokens = mergeCustomTokensConfig(
        networkData.tokens,
        customConfig?.tokensConfig
      );

      const sdkConfig = WormholeContext.getConfig(network);

      const rpcs = Object.assign(
        {},
        sdkConfig.rpcs,
        networkData.rpcs,
        customConfig?.rpcs
      );

      const wh = getWormholeContext(network, sdkConfig, rpcs);

      if (customConfig?.bridgeDefaults) {
        validateDefaults(customConfig.bridgeDefaults, networkData.chains, tokens);
      }

      const sdkConverter = new SDKConverter(wh);

      return {
        wh,
        sdkConfig,
        sdkConverter,

        v2Network: sdkConverter.toNetworkV2(network),

        network,
        isMainnet: network === 'mainnet',
        // External resources
        rpcs,
        rest: Object.assign(
          {},
          sdkConfig.rest,
          networkData.rest,
          customConfig?.rest
        ),
        graphql: Object.assign({}, networkData.graphql, customConfig?.graphql),
        wormholeApi: {
          mainnet: 'https://api.wormholescan.io/',
          testnet: 'https://api.testnet.wormholescan.io/',
          devnet: '',
        }[network],
        wormholeRpcHosts: {
          mainnet: [
            'https://wormhole-v2-mainnet-api.mcf.rocks',
            'https://wormhole-v2-mainnet-api.chainlayer.network',
            'https://wormhole-v2-mainnet-api.staking.fund',
          ],
          testnet: [
            'https://guardian.testnet.xlabs.xyz',
            'https://guardian-01.testnet.xlabs.xyz',
            'https://guardian-02.testnet.xlabs.xyz',
          ],
          devnet: ['http://localhost:7071'],
        }[network],
        coinGeckoApiKey: customConfig?.coinGeckoApiKey,

        // Callbacks
        triggerEvent: wrapEventHandler(customConfig?.eventHandler),
        validateTransfer: customConfig?.validateTransferHandler,

        // White lists
        chains: networkData.chains,
        chainsArr: Object.values(networkData.chains).filter((chain) => {
          return customConfig?.networks
            ? customConfig.networks!.includes(chain.key)
            : true;
        }),
        tokens,
        tokensArr: Object.values(tokens).filter((token) => {
          return customConfig?.tokens
            ? customConfig.tokens!.includes(token.key)
            : true;
        }),

        // For token bridge ^_^
        wrappedTokenAddressCache: new WrappedTokenAddressCache(
          tokens,
          sdkConverter
        ),

        gasEstimates: networkData.gasEstimates,
        // TODO: routes that aren't supported yet are disabled
        routes: (customConfig?.routes ?? Object.values(Route)).filter((r) =>
          [
            Route.Bridge,
            Route.Relay,
            Route.NttManual,
            Route.NttRelay,
            Route.CCTPManual,
            Route.CCTPRelay,
          ].includes(r as Route)
        ),

        // UI details
        cta: customConfig?.cta,
        explorer: customConfig?.explorer,
        attestUrl: {
          mainnet: 'https://portalbridge.com/legacy-tools/#/register',
          devnet: '',
          testnet:
            'https://wormhole-foundation.github.io/example-token-bridge-ui/#/register',
        }[network],
        bridgeDefaults: customConfig?.bridgeDefaults,
        cctpWarning: customConfig?.cctpWarning?.href || '',
        pageHeader: customConfig?.pageHeader,
        pageSubHeader: customConfig?.pageSubHeader,
        menu: customConfig?.menu ?? [],
        searchTx: customConfig?.searchTx,
        moreTokens: customConfig?.moreTokens,
        moreNetworks: customConfig?.moreNetworks,
        partnerLogo: customConfig?.partnerLogo,
        walletConnectProjectId:
          customConfig?.walletConnectProjectId ??
          import.meta.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
        showHamburgerMenu: customConfig?.showHamburgerMenu ?? false,
        previewMode: !!customConfig?.previewMode,

        // Route options
        ethBridgeMaxAmount: customConfig?.ethBridgeMaxAmount ?? 5,
        wstETHBridgeMaxAmount: customConfig?.wstETHBridgeMaxAmount ?? 5,

        // NTT config
        nttGroups: mergeNttGroups(
          tokens,
          networkData.nttGroups,
          customConfig?.nttGroups
        ),

        // Guardian set
        guardianSet: networkData.guardianSet,

        // Render redesign views
        useRedesign: customConfig?.useRedesign,
      };
    }

    // Running buildConfig with no argument generates the default configuration
    const config = buildConfig();
    export default config;

    // TODO SDKV2: REMOVE
    export function getWormholeContext(
      network: Network,
      sdkConfig: WormholeConfig,
      rpcs: ChainResourceMap
    ): WormholeContext {
      const wh: WormholeContext = new WormholeContext(network, {
        ...sdkConfig,
        ...{ rpcs },
      });

      return wh;
    }

    export function getDefaultWormholeContext(network: Network): WormholeContext {
      const sdkConfig = WormholeContext.getConfig(network);
      const networkData = { mainnet: MAINNET, devnet: DEVNET, testnet: TESTNET }[
        network
      ]!;

      const rpcs = Object.assign({}, sdkConfig.rpcs, networkData.rpcs);

      return getWormholeContext(network, sdkConfig, rpcs);
    }

    export async function getWormholeContextV2(): Promise<WormholeV2<NetworkV2>> {
      if (config.v2Wormhole) return config.v2Wormhole;
      config.v2Wormhole = await newWormholeContextV2();
      return config.v2Wormhole;
    }

    export async function newWormholeContextV2(): Promise<WormholeV2<NetworkV2>> {
      const v2Config: WormholeConfigOverridesV2<NetworkV2> = { chains: {} };

      for (const key in config.chains) {
        const chainV1 = key as ChainName;
        const chainConfigV1 = config.chains[chainV1]!;

        const chainContextV1 = chainConfigV1.context;

        const chainV2 = config.sdkConverter.toChainV2(
          chainV1 as ChainName
        ) as ChainV2;

        const rpc = config.rpcs[chainV1];
        const tokenMap: ChainTokensV2 = {};

        for (const token of config.tokensArr) {
          const nativeChainV2 = config.sdkConverter.toChainV2(token.nativeChain);

          const tokenV2: Partial<TokenV2> = {
            key: token.key,
            chain: chainV2,
            symbol: token.symbol,
          };

          if (nativeChainV2 == chainV2) {
            const decimals =
              token.decimals[chainContextV1] ?? token.decimals.default;
            if (!decimals) {
              continue;
            } else {
              tokenV2.decimals = decimals;
            }
            const address = config.sdkConverter.getNativeTokenAddressV2(token);
            if (!address) throw new Error('Token must have address');
            tokenV2.address = address;
          } else {
            tokenV2.original = nativeChainV2;
            if (token.foreignAssets) {
              const fa = token.foreignAssets[chainV1]!;

              if (!fa) {
                continue;
              } else {
                tokenV2.address = fa.address;
                tokenV2.decimals = fa.decimals;
              }
            } else {
              continue;
            }
          }

          tokenMap[token.key] = tokenV2 as TokenV2;
        }

        v2Config.chains![chainV2] = { rpc, tokenMap };
      }

      return await getWormholeV2(
        config.v2Network,
        [evm, solana, aptos, cosmwasm, sui, algorand],
        v2Config
      );
    }

    // setConfig can be called afterwards to override the default config with integrator-provided config
    export function setConfig(customConfig?: WormholeConnectConfig) {
      const newConfig: InternalConfig<NetworkV2> = buildConfig(customConfig);

      // We overwrite keys in the existing object so the references to the config
      // imported elsewhere point to the new values
      for (const key in newConfig) {
        /* @ts-ignore */
        config[key] = newConfig[key];
      }
    }

    // TODO: add config validation step to buildConfig
    //validateConfigs();

    ```

### Custom Networks and RPC Endpoints {: #custom-networks-and-rpc-endpoints }

Specify supported networks, tokens, and custom RPC endpoints. Your users may encounter rate limits using public RPC endpoints if you don't provide your own.

=== "Mainnet"

    ```js
    import WormholeConnect, {
      WormholeConnectConfig,
    } from '@wormhole-foundation/wormhole-connect';

    const config: WormholeConnectConfig = {
      env: 'mainnet',
      networks: ['ethereum', 'polygon', 'solana'],
      tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC'],
      rpcs: {
        ethereum: 'https://rpc.ankr.com/eth',
        solana: 'https://rpc.ankr.com/solana',
      },
    };

    function App() {
      return <WormholeConnect config={config} />;
    }

    ```

=== "Testnet"

    ```js
    import WormholeConnect, {
      WormholeConnectConfig,
    } from '@wormhole-foundation/wormhole-connect';

    const config: WormholeConnectConfig = {
      env: 'testnet',
      networks: ['sepolia', 'arbitrum_sepolia', 'base_sepolia', 'fuji'],

      rpcs: {
        fuji: 'https://rpc.ankr.com/avalanche_fuji',
        base_sepolia: 'https://base-sepolia-rpc.publicnode.com',
      },
    };

    function App() {
      return <WormholeConnect config={config} />;
    }

    ```

!!! note
    For a complete list of testnet chain names that can be manually added, see the [Testnet Chains List](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/fa4ba4bc349a7caada809f209090d79a3c5962fe/tokenRegistry/src/scripts/importConnect.ts#L44-L55){target=\_blank}.

### Fully Customized Theme {: #fully-customized-theme }

Wormhole Connect offers a high level of customizability that suits and integrates with your application's design, including various options for buttons, backgrounds, popovers, fonts, and more. The following example demonstrates a variety of appearance customizations. Remember, if you prefer a visual to aid in designing your widget, you can use the [no code style interface](https://connect-in-style.wormhole.com/){target=\_blank}.

```jsx
import WormholeConnect, {
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';
import red from '@mui/material/colors/red';
import lightblue from '@mui/material/colors/lightBlue';
import grey from '@mui/material/colors/grey';
import green from '@mui/material/colors/green';
import orange from '@mui/material/colors/orange';

const customTheme: WormholeConnectTheme = {
  mode: 'dark',
  primary: grey,
  secondary: grey,
  divider: 'rgba(255, 255, 255, 0.2)',
  background: {
    default: '#232323',
  },
  text: {
    primary: '#ffffff',
    secondary: grey[500],
  },
  error: red,
  info: lightblue,
  success: green,
  warning: orange,
  button: {
    primary: 'rgba(255, 255, 255, 0.2)',
    primaryText: '#ffffff',
    disabled: 'rgba(255, 255, 255, 0.1)',
    disabledText: 'rgba(255, 255, 255, 0.4)',
    action: orange[300],
    actionText: '#000000',
    hover: 'rgba(255, 255, 255, 0.7)',
  },
  options: {
    hover: '#474747',
    select: '#5b5b5b',
  },
  card: {
    background: '#333333',
    secondary: '#474747',
    elevation: 'none',
  },
  popover: {
    background: '#1b2033',
    secondary: 'rgba(255, 255, 255, 0.5)',
    elevation: 'none',
  },
  modal: {
    background: '#474747',
  },
  font: {
    primary: 'Impact',
    header: 'Impact',
  },
};

export default function App() {
  return <WormholeConnect theme={customTheme} />;
}

```

### Environment {: #environment }

You can configure Connect to be used in Testnet environments, too. You can toggle between Mainnet and Testnet environments by defining the `WormholeConnectConfig` as follows:

=== "Mainnet"

    ```ts
    const config: WormholeConnectConfig = {
      env: 'mainnet',
    };
    ```

=== "Testnet"

    ```ts
    const config: WormholeConnectConfig = {
      env: 'testnet',
    };
    ```
### Custom RPC Endpoint {: #custom-rpc-endpoint }

You can define a custom RPC provider for your Connect widget to use. This can be especially helpful if you'd like to replace public endpoints with dedicated or private endpoints.

```ts
const config: WormholeConnectConfig = {
  rpcs: {
    solana: 'https://rpc.ankr.com/solana/ee827255553bb0fa9e0aaeab27e988707e60ea06ae36be0658b778072e94979e',
  },
};
```

### Arbitrary Token {: #arbitrary-token }

The following section shows how to add an arbitrary token to your deployment of Connect.

!!! note
    You will need to [register](https://portalbridge.com/legacy-tools/#/register){target=\_blank} your token with Wrapped Token Transfers (WTT) to get the contract addresses necessary for it to work with Connect.

This example configuration limits Connect to the Solana and Ethereum networks and a handful of tokens, including `BSKT`, which isn't built in by default and provided under the `tokensConfig` key.

See [`src/config/types.ts`](https://github.com/wormhole-foundation/wormhole-connect/blob/production%400.3.21/wormhole-connect/src/config/types.ts){target=\_blank} for the type definition of `TokensConfig`.

```json
const config: WormholeConnectConfig = {
  networks: ['solana', 'ethereum'],
  tokens: ['ETH', 'WETH', 'MATIC', 'WMATIC', 'BSKT'],
  tokensConfig: {
    BSKT: {
      key: 'BSKT',
      symbol: 'BSKT',
      nativeChain: 'solana',
      tokenId: {
        chain: 'solana',
        address: '6gnCPhXtLnUD76HjQuSYPENLSZdG8RvDB1pTLM5aLSJA',
      },
      coinGeckoId: 'basket',
      icon: 'https://assets.coingecko.com/coins/images/34661/standard/BSKT_Logo.png?1705636891',
      color: '#2894EE',
      decimals: {
        default: 5,
      },
    },
  },
};

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

|   Mainnet    |  Testnet   |
|:------------:|:----------:|
|    bridge    |   bridge   |
|    relay     |   relay    |
|  cctpManual  | cctpManual |
|  cctpRelay   | cctpRelay  |
|  nttManual   | nttManual  |
|   nttRelay   |  nttRelay  |
|  ethBridge   |     -      |
| wstETHBridge |     -      |
|  usdtBridge  |     -      |
|     tBTC     |    tBTC    |

### Wallet Set Up  {: #wallet-connect-project-id }

When using Wormhole Connect, your selected blockchain network determines the available wallet options.

 - For EVM chains, wallets like MetaMask and WalletConnect are supported.
 - For Solana, you'll see options such as Phantom, Torus, and Coin98.

The wallet options automatically adjust based on the selected chain, providing a seamless user experience without additional configuration.

If you would like to offer WalletConnect as a supported wallet option, you'll need to obtain a project ID on the [WalletConnect cloud dashboard](https://cloud.walletconnect.com/){target=\_blank}.

### Toggle Hamburger Menu {: #toggle-hamburger-menu }

By setting the `showHamburgerMenu` option to **false**, you can deactivate the hamburger menu, causing the links to be positioned at the bottom.

#### Add Extra Menu Entry {: #add-extra-menu-entry }

By setting the `showHamburgerMenu` option to `false`, you can add extra links. The following properties are accessed through the `menu[]` property (e.g., `menu[].label`):

| Property |                 Description                 |
|:--------:|:-------------------------------------------:|
| `label`  |            Link name to show up             |
|  `href`  |              Target URL or URN              |
| `target` | Anchor standard target, by default `_blank` |
| `order`  | Order where the new item should be injected |

#### Sample Configuration {: #sample-configuration }

```json
{
    "showHamburgerMenu": false,
    "menu": [
        {
            "label": "Advance Tools",
            "href": "https://portalbridge.com",
            "target": "_self",
            "order": 1
        }
    ]
}

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
    {
        ...
        "moreNetworks": {
            "href": "https://example.com",
            "target": "_blank",
            "description": "brief description that should be displayed as tooltip when the user hovers over a more network icon",
            "networks": [
                {
                    "icon": "https://assets.coingecko.com/coins/images/34661/standard/BSKT_Logo.png?1705636891",
                    "name": "more",
                    "label": "More networks",
                    "href": "https://portalbridge.com/#/transfer",
                    "showOpenInNewIcon": false
                }
            ]
        }
        ...
    }
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
