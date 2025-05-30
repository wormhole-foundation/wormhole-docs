---
title: Integrate Connect via CDN
description:
categories: Connect, Transfer
---

# Integrate Connect via CDN

[Wormhole Connect](/docs/products/connect/overview/){target=\_blank} is a prebuilt UI component that makes it easy to transfer tokens across chains. You can integrate it into any website using either React or a hosted version served via [jsDelivr](https://www.jsdelivr.com/){target=\_blank}.

This guide focuses on using the hosted version—ideal for simpler setups or non-React environments. It includes everything you need to get started with just a few lines of code.

If you're using React, refer to the [Get Started with Connect](/docs/products/connect/get-started/){target=\_blank} guide.

## Install Connect

To install the [Connect npm package](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank}, run the following command:

```bash
npm i @wormhole-foundation/wormhole-connect
```

## Add Connect to Your Project Using the Hosted Version

The hosted version uses pre-built packages (including React) served via jsDelivr from npm. To integrate it without using React directly, add the following to your JavaScript project:

```js
--8<-- 'code/products/connect/guides/hosted-version/hosted-1.js'
```

You can provide config and theme parameters in a second function argument:

```js
--8<-- 'code/products/connect/guides/hosted-version/hosted-2.js'
```

## Next Steps

Use the following guides to configure your Connect instance:

- **[Data Configuration](/docs/products/connect/configuration/data/)**: Learn how to specify custom networks and RPC endpoints, integrate different bridging protocols, add new tokens, and more.
- **[Theme Configuration](/docs/products/connect/configuration/theme/)**: Learn how to customize Connect's look and feel to match your application's branding.
