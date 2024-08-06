---
title: Overview
description: Explore Wormhole Connect, the React widget that allows you to offer an easy-to-use UI for cross-chain asset transfers via Wormhole in a web application. 
---

# Wormhole Connect

## Introduction {: #introduction }

Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole, directly in a web application.

Check out the [Github repository](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}

The Wormhole Typescript SDK allows you to implement the same functionality as the Connect widget, but in your own UI. For more information on using the SDK instead of Connect check out the docs.

## Features {: #features }

This is just an overview of what features are available. For details about each, check [here](../connect/features.md).

- multiple ways to bridge assets ("[routes](./routes.md)")
- extensive ways to style the UI (also try the [codeless styler interface](https://connect-in-style.wormhole.com/){target=\_blank}!)
- ways to [configure](./configuration.md) what feature set to offer
- ability to configure any token to bridge via Wormhole
- [drop off some gas](./features.md) at the destination

## Demo {: #demo }

Wormhole Connect is deployed live in several production apps. Here are a few:

- [Portal Bridge](https://portalbridge.com/){target=\_blank}
- [Jupiter](https://jup.ag/bridge/cctp){target=\_blank}
- [Pancake Swap](https://bridge.pancakeswap.finance/wormhole){target=\_blank}

## Integrate Connect {: #integrate-connect }

### Option 1: import directly into a React app  {: #option-1-import-directly-into-a-react-app}

First, install the npm package.

[![npm version](https://img.shields.io/npm/v/@wormhole-foundation/wormhole-connect.svg)](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect) 

```bash
npm i @wormhole-foundation/wormhole-connect
```

Now you can import the React component:

```ts
--8<-- 'code/build/build-multichain-applications/connect/overview/import.js'
```

### Option 2: hosted version via CDN (for any website) {: #option-2-hosted-version-via-cdn-for-any-website}

If you're not using React, you can still embed Connect on your website by using the hosted version. The sample code below uses the popular and free unpkg.com CDN from which your app will load the widget.

Simply copy and paste the following into your HTML body, and replace the ```{WORMHOLE_CONNECT_VERSION}``` in the links with the most recent production version of Wormhole Connect. You can check what the most recent version is on [NPM](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/latest).

```html
--8<-- 'code/build/build-multichain-applications/connect/overview/cdn.html'
```

For example, for [0.3.13](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/0.3.13):

```html
--8<-- 'code/build/build-multichain-applications/connect/overview/cdn-with-version.html'
```

!!! note 
    It is important to periodically update your Wormhole Connect instance to the latest version, as there are frequent functionality and security releases.

## Configuration {: #configuration}

This is just an overview of what's possible. For details about all the configuration options, check the [Configuration Docs](../connect/configuration.md).

The default configuration of Wormhole Connect may not be what you want to use.  You may want to:

- use custom styles 
- restrict the chains that you allow in your app
- add support for your project's token, and eliminate tokens you don't want to reduce "noise"
- configuring custom RPC URLs (do this - default public RPCs are heavily throttled)
- restrict the [routes](./routes.md) that are available

Check the [configuration options](./configuration.md) and customize your widget however you like!