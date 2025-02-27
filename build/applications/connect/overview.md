---
title: Integrate Connect
description: Explore Wormhole Connect, the React widget that allows you to offer an easy-to-use UI for cross-chain asset transfers via Wormhole in a web application. 
---

# Integrate Connect

## Introduction

Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole directly in a web application. Check out the [Wormhole Connect GitHub repository](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank}. The following sections guide you through integrating Connect using either the React component or hosted CDN. 

## Import into a React App  {: #import-directly-into-a-react-app}

First, install the Wormhole Connect npm package. Select the following button to view package details: [![npm version](https://img.shields.io/npm/v/@wormhole-foundation/wormhole-connect.svg)](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank} 

```bash
npm i @wormhole-foundation/wormhole-connect
```

Now you can import the React component:

```ts
--8<-- 'code/build/applications/connect/overview/import-v1.js'
```

### Use Hosted Version via CDN {: #use-hosted-version-via-cdn}

If you're not using React, you can still embed Connect on your website by using the hosted version. This uses pre-built packages (which include React) served from NPM by jsdelivr.net.

```ts title="v1.x"
--8<-- 'code/build/applications/connect/overview/hosted.js'
```

???- code "v0.x"
    Simply copy and paste the following into your HTML body, and replace the ```INSERT_WORMHOLE_CONNECT_VERSION``` in the links with the most recent production version of Wormhole Connect. You can check what the most recent version is on [NPM](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/latest){target=\_blank}.

    ```html
    --8<-- 'code/build/applications/connect/overview/cdn.html'
    ```

    For example, for [0.3.13](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect/v/0.3.13){target=\_blank}:

    ```html
    --8<-- 'code/build/applications/connect/overview/cdn-with-version.html'
    ```

For help migrating from Connect v0.x to Connect v1.x, see the [Wormhole Connect v1.0 Migration Guide](/docs/build/applications/connect/upgrade/){target=\_blank}
 
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

The [Wormhole TypeScript SDK](/docs/build/applications/wormhole-sdk/){target=\_blank} allows you to implement the same functionality as the Connect widget but in your own UI. Check out the docs for more information on using the SDK instead of Connect.
