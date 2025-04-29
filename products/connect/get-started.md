---
title: Get Started with Connect
description: TODO 
categories: Connect, Transfer
---

# Get Started with Connect

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}

## Introduction

Connect helps you to easily add an intuitive, multichain asset transfer UI to your web applications. The guide demonstrates how-to configure the Connect widget, add it to a React application, and view the application locally.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}

- **Optional** - if you would like to send a testnet transfer using your demo application, you will also need the following:

    - **Developer wallet with Sui testnet tokens** - you can use the [Sui Testnet Faucet](https://faucet.sui.io/){target=\_blank} to obtain tokens
    - **Developer wallet with Avalanche Fuji address** - to use as the recipient address; no tokens required

## Install and Setup Project

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

- **Define the network** - options include `Mainnet`, `Testnet`, or `Devnet`
- **Define chains to include** - this example uses Sui and Avalanche. See the complete list of [Connect-supported chain names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/constants/chains.ts){target=\_blank} if you would like to use different chains
- **Add a title to UI** - optional. If defined, it will render above the widget in the UI
- **Define the theme** - this example sets mode to `dark` and adds a primary color

For more `config` options, see the [Connect Data Configuration](/docs/products/connect/configuration/data/){target=\_blank} guide.

For more `theme` options, see the [Connect Theme Configuration](/docs/products/connect/configuration/theme/){target=\_blank} guide.

## Interact with Connect

Congratulations! You've successfully used Connect to create a simple multichain token transfer application. You can now follow the prompts in the UI to connect your developer wallets and send a test transfer.

## Next Steps

<!--TODO: links to other guides and tutorials. Definitely want to feature using Connect to interact with your NTT deployment-->





