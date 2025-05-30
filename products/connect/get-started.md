---
title: Get Started with Connect
description: Follow this guide to configure and use the Connect UI widget to easily add an intuitive, multichain asset transfer UI to your web applications.  
categories: Connect, Transfer
---

# Get Started with Connect

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}

## Introduction

Connect helps you to easily add an intuitive, multichain asset transfer UI to your web applications. The guide demonstrates how to configure the Connect widget, add it to a React application, and view it locally.

## Install Connect

To install the [Wormhole Connect npm package](https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect){target=\_blank}, run the following command:

```bash
npm i @wormhole-foundation/wormhole-connect
```

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}

- (Optional) To test a transfer from your demo app, you'll need:

    - A wallet with [Sui testnet tokens](https://faucet.sui.io/){target=\_blank}
    - A wallet with an Avalanche Fuji address (to use as the recipient; no tokens required)

## Install and Set Up Project

1. Clone the demo repository and navigate to the project directory:

    ```bash
    git clone https://github.com/wormhole-foundation/demo-basic-connect.git
    cd demo-basic-connect
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the application:

    ```bash
    npm start
    ```

4. Open your browser to [localhost:3000](http://localhost:3000){target=\_blank} to view the application locally. It will look similar to the following:

    ![Deployed Connect Widget](/docs/images/products/connect/tutorials/react-dapp/get-started/connect-get-started-01.webp)

## Configure Connect

Open the `App.tsx` file in your code editor of choice. You will see code similar to the following:

```typescript title="App.tsx"
--8<-- 'code/products/connect/configuration/get-started/App.tsx'
```

The preceding sample code configures Connect by setting values inside `config` and `theme` as follows:

- **Defines the network** - options include `Mainnet`, `Testnet`, or `Devnet`
- **Defines chains to include** - this example uses Sui and Avalanche. See the complete list of [Connect-supported chain names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank} if you would like to use different chains
- **Adds a title to UI** - (optional) if defined, it will render above the widget in the UI
- **Defines the theme** - this example sets the mode to `dark` and adds a primary color

## Interact with Connect

Congratulations! You've successfully used Connect to create a simple multichain token transfer application. You can now follow the prompts in the UI to connect your developer wallets and send a test transfer.

## Next Steps

Use the following guides to configure your Connect instance:

- **[Data Configuration](/docs/products/connect/configuration/data/)**: Learn how to specify custom networks and RPC endpoints, integrate different bridging protocols, add new tokens, and more.
- **[Theme Configuration](/docs/products/connect/configuration/theme/)**: Learn how to customize Connect's look and feel to match your application's branding.

<!--TODO: links to other guides and tutorials. Definitely want to feature using Connect to interact with your NTT deployment-->
