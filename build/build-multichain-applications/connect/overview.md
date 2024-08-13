---
title: Overview
description: Explore Wormhole Connect, the React widget that allows you to offer an easy-to-use UI for cross-chain asset transfers via Wormhole in a web application. 
---

# Wormhole Connect

## Introduction {: #introduction }

Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole directly in a web application. Check out the [Wormhole Connect Github repository](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}.

The [Wormhole Typescript SDK](https://docs.wormhole.com/wormhole/reference/sdk-docs){target=\_blank} allows you to implement the same functionality as the Connect widget but in your own UI. Check out the docs for more information on using the SDK instead of Connect.

## Features {: #features }

Wormhole Connect is easy to customize to suit your application's needs. You can specify technical details like supported assets and custom RPCs or forgo customization and have a full-featured widget. The widget's UI is highly customizable, with extensive styling options available, including a user-friendly codeless styling interface for those who prefer a more visual approach to design. The features of Wormhole Connect include:

- Multiple ways to bridge assets ([routes](/build/build-multichain-applications/connect/routes))
- Extensive ways to style the UI (including the [codeless styler interface](https://connect-in-style.wormhole.com/){target=\_blank})
- Ways to [configure](/build/build-multichain-applications/connect/configuration) what feature set to offer
- Ability to configure any token to bridge via Wormhole
- [Ability to drop off some gas](/build/build-multichain-applications/connect/features) at the destination

For more details about the features of Wormhole Connect and a breakdown of supported features by chain, be sure to check [the features page](/build/build-multichain-applications/connect/features).

## Production DApp Examples {: #production-dapp-examples }

Wormhole Connect is deployed live in several production apps. Here are a few:

- [Portal Bridge](https://portalbridge.com/){target=\_blank}
- [Jupiter](https://jup.ag/bridge/cctp){target=\_blank}
- [Pancake Swap](https://bridge.pancakeswap.finance/wormhole){target=\_blank}

## Integrate Connect {: #integrate-connect }

### Import Directly into a React App  {: #import-directly-into-a-react-app}

First, install the Wormhole Connect npm package. You can read more about the package by clicking on the following button: [![npm version](https://img.shields.io/npm/v/@wormhole-foundation/wormhole-connect.svg)](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank} 

```bash
npm i @wormhole-foundation/wormhole-connect
```

Now you can import the React component:

```ts
--8<-- 'code/build/build-multichain-applications/connect/overview/import.js'
```

### Use Hosted Version via CDN {: #use-hosted-version-via-cdn}

If you're not using React, you can still embed Connect on your website by using the hosted version. The sample code below uses the popular and free `unpkg.com` CDN from which your app will load the widget.

Simply copy and paste the following into your HTML body, and replace the ```INSERT_WORMHOLE_CONNECT_VERSION``` in the links with the most recent production version of Wormhole Connect. You can check what the most recent version is on [NPM](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/latest){target=\_blank}.

```html
--8<-- 'code/build/build-multichain-applications/connect/overview/cdn.html'
```

For example, for [0.3.13](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/0.3.13){target=\_blank}:

```html
--8<-- 'code/build/build-multichain-applications/connect/overview/cdn-with-version.html'
```

!!! note 
    It is important to periodically update your Wormhole Connect instance to the latest version, as there are frequent functionality and security releases.

## Configuration {: #configuration}

This is just an overview of what's possible. Check the [Configuration Docs](/build/build-multichain-applications/connect/configuration) for details about all the configuration options.

The default configuration of Wormhole Connect may not be exact;y what you're looking for. You may want to:

- Use custom styles 
- Restrict the chains that you allow in your app
- Add support for your project's token, and eliminate tokens you don't want to reduce noise
- Configuring custom RPC URLs (This is highly recommended as default public RPCs are heavily throttled)
- Restrict the [routes](/build/build-multichain-applications/connect/routes) that are available

For the above options and more, check the [configuration options](/build/build-multichain-applications/connect/configuration) and customize your widget however you like.