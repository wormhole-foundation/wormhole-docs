---
title: Configuration
description: Configure Wormhole Connect for React or HTML, set themes, define tokens, networks, and customize RPC endpoints for enhanced blockchain interactions. 
---

## Introduction {: #introduction }

Configure the Wormhole Connect React component by passing a `WormholeConnectConfig` object as the `config` attribute. If using the hosted version, provide `config` and `theme` as JSON-serialized strings on the mount point.

=== "React"

    ```tsx
    --8<-- 'code/build/build-multichain-applications/connect/configuration/configure-react.tsx'
    ```

=== "HTML Tags"

    ```tsx
    --8<-- 'code/build/build-multichain-applications/connect/configuration/configure-html.html'
    ```

## Examples {: #examples }

Below are some examples of different ways you can configure Connect. See `WormholeConnectConfig` in the below file for a full view of the supported config parameters.

??? code "View `WormholeConnectConfig`"
    ```ts
    --8<-- 'code/build/build-multichain-applications/connect/configuration/index.ts'
    ```

### Custom networks and RPC endpoints {: #custom-networks-and-rpc-endpoints }

Specify supported networks/tokens and custom RPC endpoints. Your users may encounter rate limits using public RPC endpoints if you do not provide your own

```jsx
--8<-- 'code/build/build-multichain-applications/connect/configuration/custom-simple.jsx'
```

### Fully customized theme {: #fully-customized-theme }

Wormhole Connect offers a high level of customizability to suit and integrate with your application's design, including a variety of options for button, background, popover, font and more.

```jsx
--8<-- 'code/build/build-multichain-applications/connect/configuration/custom-full.jsx'
```

### Environment {: #environment }

This shows how to run Connect on TestNet.

```json
const config: WormholeConnectConfig = {
  "env": "testnet"
}
```

### Custom RPC Endpoint {: #custom-rpc-endpoint }

This shows how to change which RPC provider Connect uses for a particular network.

```json
const config: WormholeConnectConfig = {
  "rpcs": {
    "solana": "https://rpc.ankr.com/solana/ee827255553bb0fa9e0aaeab27e988707e60ea06ae36be0658b778072e94979e"
  }
}
```

### Arbitrary Token {: #arbitrary-token }

This shows how to add an arbitrary token to your deployment of Connect.
Please note you will need to [register](https://portalbridge.com/advanced-tools/#/register){target=\_blank} your token with the Token Bridge to get the contract addresses necessary for it to work with Connect.

These example config limits Connect to the Solana and Ethereum networks,
and a handful of tokens including `BSKT` which is not built in by default
and provided under the `tokensConfig` key.

See [src/config/types.ts](https://github.com/wormhole-foundation/wormhole-connect/blob/development/wormhole-connect/src/config/types.ts){target=\_blank}
for the type definition of `TokensConfig`.

```json
--8<-- 'code/build/build-multichain-applications/connect/configuration/arbitrary-token.json'
```

## More Configuration Options {: #more-configuration-options }


### Whitelisting Tokens {: #whitelisting-tokens }

You can provide a whitelist of tokens under `tokens`. By default, Connect will offer its full built-in list:

| Mainnet        | TestNet                            |
|----------------|------------------------------------|
| ETH            | ETH, ETHsepolia                    |
| WETH           | WETH, WETHsepolia                  |
| USDCeth        | USDCeth                            |
| WBTC           |                                    |
| USDT           |                                    |
| DAI            |                                    |
| BUSD           |                                    |
| MATIC          | MATIC                              |
| WMATIC         | WMATIC                             |
| USDCpolygon    |                                    |
| BNB            | BNB                                |
| WBNB           | WBNB                               |
| USDCbnb        |                                    |
| AVAX           | AVAX                               |
| WAVAX          | WAVAX                              |
| USDCavax       | USDCavax                           |
| FTM            | FTM                                |
| WFTM           | WFTM                               |
| CELO           | CELO                               |
| GLMR           | GLMR                               |
| WGLMR          | WGLMR                              |
| SOL            | WSOL                               |
| PYTH           |                                    |
| SUI            | SUI                                |
| USDCsol        |                                    |
| APT            | APT                                |
| ETHarbitrum    | ETHarbitrum, ETHarbitrum_sepolia   |
| WETHarbitrum   | WETHarbitrum, WETHarbitrum_sepolia |
| USDCarbitrum   | USDCarbitrum                       |
| ETHoptimism    | ETHoptimism, ETHoptimism_sepolia   |
| WETHoptimism   | WETHoptimism, WETHoptimism_sepolia |
| USDCoptimism   | USDCoptimism                       |
| ETHbase        | ETHbase, ETHbase_sepolia           |
| WETHbase       | WETHbase, WETHbase_sepolia         |
| tBTC           | tBTC                               |
| tBTCpolygon    | tBTCpolygon                        |
| tBTCoptimism   | tBTCoptimism                       |
| tBTCarbitrum   | tBTCarbitrum                       |
| tBTCbase       | tBTCbase                           |
| tBTCsol        | tBTCsol                            |
| WETHpolygon    |                                    |
| WETHbsc        |                                    |
| wstETH         | wstETH                             |
| wstETHarbitrum |                                    |
| wstETHoptimism |                                    |
| wstETHpolygon  |                                    |
| wstETHbase     |                                    |

### Routes {: #routes }

You can provide a whietlist of routes under `routes`. By default, Connect will offer its full built-in list:

| Mainnet       | TestNet       |
|---------------|---------------|
| bridge        | bridge        |
| relay         | relay         |
| cctpManual    | cctpManual    |
| cctpRelay     | cctpRelay     |
| nttManual     | nttManual     |
| nttRelay      | nttRelay      |
| ethBridge     |               |
| wstETHBridge  |               |
| usdtBridge    |               |
| cosmosGateway | cosmosGateway |
| tbtc          | tbtc          |

### Wallet Connect Project ID  {: #wallet-connect-project-id }

Required in order to display Wallet Connect as a wallet option. You can get a project ID on https://cloud.walletconnect.com/.

### Toggle Hamburger Menu {: #toggle-hamburger-menu }

By setting the `showHamburgerMenu` option to **false**, you can deactivate the hamburger menu, causing the links to be positioned at the bottom.

#### Add extra menu entry {: #add-extra-menu-entry }

By setting the `showHamburgerMenu` option to **false**, you can use the `menu` array to add extra links.

| property        | description                                 |
|-----------------|---------------------------------------------|
| `menu[].label`  | link name to show up                        |
| `menu[].href`   | target url or urn                           |
| `menu[].target` | anchor standard target, by default `_blank` |
| `menu[].order`  | order where the new item should be injected |

#### Sample configuration {: #sample-configuration }

```json
--8<-- 'code/build/build-multichain-applications/connect/configuration/sample-configuration.json'
```

### CoinGecko API Key {: #coingecko-api-key }

If you have a CoinGecko API Plan, you can include the API key in the configuration. In case you do not have the API key, [follow these steps](https://apiguide.coingecko.com/getting-started/getting-started){target=\_blank}.

### More Networks {: #more-networks }

Specify a set of extra networks to be displayed on the network selection modal, each of them linking to a different page/dApp/mobile app the user will be redirected to.

| Property                                    | description                                                                                                                                                           |                                                                                        |
|:--------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------:|
| `moreNetworks.href`                         | Default value for missing network hrefs                                                                                                                               |                                       mandatory                                        |
| `moreNetworks.target`                       | Default value for missing network link targets                                                                                                                        |                             optional, defaults to `_self`                              |
| `moreNetworks.description`                  | Brief description that should be displayed as tooltip when the user hover an more network icon. Used as default for missing network descriptions                      |                                        optional                                        |
| `moreNetworks.networks[].icon`              | URL data encoded icon to display                                                                                                                                      |                                       mandatory                                        |
| `moreNetworks.networks[].href`              | Network href to redirect to. If present, the values `{:sourceChain}` and `{:targetChain}` are replaced with the selected currently selected chains before redirecting |                                        optional                                        |
| `moreNetworks.networks[].label`             | Display text                                                                                                                                                          |                                       mandatory                                        |
| `moreNetworks.networks[].name`              | Unique network key                                                                                                                                                    |                optional, defaults to a snake_case version of the label                 |
| `moreNetworks.networks[].description`       | Description value                                                                                                                                                     |                    optional, defaults to `moreNetworks.description`                    |
| `moreNetworks.networks[].target`            | href target value                                                                                                                                                     |                      optional, defaults to `moreNetworks.target`                       |
| `moreNetworks.networks[].showOpenInNewIcon` | Disable top right open in new icon                                                                                                                                    | optional, defaults to **true** if target is `_blank` or **false** if target is `_self` |

??? code "View full configuration"
    ```json
    --8<-- 'code/build/build-multichain-applications/connect/configuration/advanced-configuration.json'
    ```

### More Tokens {: #more-tokens }

Show a special entry on the select tokens modal which redirects the user to a different page/dApp/mobile app.

| Property            | Description                                                                                                                                                  |           Required            |
|:--------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------:|
| `moreTokens.label`  | Display text                                                                                                                                                 |           mandatory           |
| `moreTokens.href`   | URL to redirect to. If present, the values `{:sourceChain}` and `{:targetChain}` are replaced with the selected currently selected chains before redirecting |           mandatory           |
| `moreTokens.target` | href target                                                                                                                                                  | optional, defaults to `_self` |


### Explorer {: #explorer }

Enable explorer button to allow users to search for his transactions on a given explorer filtering by their wallet address.

| Property          | Description                                                                                                                                   |               Required               |
|:------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------:|
| `explorer.label`  | Display text                                                                                                                                  | optional, defaults to `Transactions` |
| `explorer.href`   | URL of the explorer, for instance [https://wormholescan.io/](https://wormholescan.io/){target=\_blank}. If present, the values `{:address}` is replaced with the connected wallet address |              mandatory               |
| `explorer.target` | href target                                                                                                                                   |    optional, defaults to `_blank`    |