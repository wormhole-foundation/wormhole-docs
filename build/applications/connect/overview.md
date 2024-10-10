---
title: Overview
description: Explore Wormhole Connect, the React widget that allows you to offer an easy-to-use UI for cross-chain asset transfers via Wormhole in a web application. 
---

# Wormhole Connect

## Introduction {: #introduction }

Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole directly in a web application. Check out the [Wormhole Connect GitHub repository](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}.

The [Wormhole TypeScript SDK](https://docs.wormhole.com/wormhole/reference/sdk-docs){target=\_blank} allows you to implement the same functionality as the Connect widget but in your own UI. Check out the docs for more information on using the SDK instead of Connect.

## Features {: #features }

Wormhole Connect is easy to customize to suit your application's needs. You can specify technical details like supported assets and custom RPCs or forgo customization and have a full-featured widget. The widget UI is highly customizable, with extensive styling options available, including a user-friendly no code styling interface for those who prefer a more visual approach to design. The features of Wormhole Connect include:

- Multiple ways to bridge assets ([routes](/docs/build/applications/connect/routes/){target=\_blank})
- Extensive ways to style the UI (including the [no code styling interface](https://connect-in-style.wormhole.com/){target=\_blank})
- Ways to [configure](/docs/build/applications/connect/configuration/){target=\_blank} what feature set to offer
- Ability to configure any token to bridge via Wormhole
- [Ability to drop off some gas](/docs/build/applications/connect/features/){target=\_blank} at the destination

For more details about the features of Wormhole Connect and a breakdown of supported features by chain, be sure to check [the features page](/docs/build/applications/connect/features/){target=\_blank}.

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
--8<-- 'code/build/applications/connect/overview/import-v1.js'
```

### Use Hosted Version via CDN {: #use-hosted-version-via-cdn}

If you're not using React, you can still embed Connect on your website by using the hosted version. This uses pre-built packages (which include React) served from NPM by jsdelivr.net.

```ts
--8<-- 'code/build/applications/connect/overview/hosted.js'
```

!!! note 
    It is important to periodically update your Wormhole Connect instance to the latest version, as there are frequent functionality and security releases.

## Configuration {: #configuration}

This is just an overview of what's possible. Check the [Configuration docs](/docs/build/applications/connect/configuration/){target=\_blank} for details about all the configuration options.

The default configuration of Wormhole Connect may not be exactly what you're looking for. You may want to:

- Use custom styles 
- Restrict the chains that you allow in your app
- Add support for your project's token, and eliminate tokens you don't want to reduce noise
- Configuring custom RPC URLs (This is highly recommended as default public RPCs are heavily throttled)
- Restrict the [routes](/docs/build/applications/connect/routes/){target=\_blank} that are available

For additional information on the preceding options, check the [configuration options](/docs/build/applications/connect/configuration/){target=\_blank} and customize your widget however you like.
