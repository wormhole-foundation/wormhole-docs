---
title: Cross-Chain Token Transfers with Wormhole Connect
description: 
---

# Cross-Chain Token Transfers with Wormhole Connect

## Introduction

In this tutorial, we’ll explore how to integrate [Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank} to enable cross-chain token transfers and interactions. Wormhole Connect offers a simplified interface for developers to facilitate seamless token transfers between blockchains. Using Wormhole Connect, you can easily bridge assets across multiple ecosystems without diving into the complex mechanics of cross-chain communication.

While this tutorial will guide you through the process using a specific blockchain as an example, the principles and steps outlined here can be applied to any blockchain supported by Wormhole. In this example, we’ll work with Sui as our target blockchain.

## Prerequisites

To get started with Wormhole Connect, we'll first need to set up a basic environment that allows for cross-chain token transfers.

Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A [Sui wallet](https://suiwallet.com/){target=\_blank} set up and ready for use <!-- private key? -->
- Testnet tokens for [Sui](https://github.com/MystenLabs/mysten-app-docs/blob/main/mysten-sui-wallet.md#get-sui-tokens-for-testing){target=\_blank} <!-- and ??? --> to cover gas fees <!-- review -->

## Setting Up Connect for SUI Transfers

### Creat a react projecy

Start by setting up your React app. 

1. Open your terminal and run the following command to create a new React app:

    ```bash
    npx create-react-app connect-tutorial
    ```

2. Navigate into the project directory:

    ```bash
    cd connect-tutorial
    ```

### Install Wormhole Connect

Next, install the Wormhole Connect package as a dependency.

- Run the following command inside your project directory:

    ```bash
    npm install @wormhole-foundation/wormhole-connect
    ```

### Update the App Component

Now, we need to modify the default `App.js` to integrate Wormhole Connect.

1. Open `src/App.js` and replace the content with the following code:

    ```js
    import logo from './logo.svg';
    import './App.css';
    import WormholeConnect from '@wormhole-foundation/wormhole-connect';

    const config = {
        env: 'testnet',
        networks: ['sepolia', 'sui'],
    };

    function App() {
        return <WormholeConnect config={config} />;
    }

    export default App;
    ```

<!-- fix this -->
- env: 'testnet': This ensures that Wormhole Connect uses the testnet environment, which is perfect for your demonstration.
- networks: ['sepolia', 'sui']: You are setting up Ethereum Sepolia and Sui as the two networks for token transfer. This config is passed directly to the WormholeConnect component

### Customizing Wormhole Connect

To further customize Wormhole Connect for your application, such as adjusting the UI, adding custom tokens, or configuring specific chain settings, you can refer to the [Wormhole Connect Customization Guide](/docs/build/applications/connect/configuration/#introduction){target=\_blank}. 

### Run the App

Make sure you’re in the root directory of your React app, and run the following command to start the application:

```bash
npm start
```

Your app will start on [http://localhost:3000/](http://localhost:3000/){target=\_blank}

## Transfer Tokens

After running `npm start`, your React app should be up and running, and Wormhole Connect should be visible on [http://localhost:3000/](http://localhost:3000/){target=\_blank}. 

### Access the App

Open Your Browser and go to [http://localhost:3000/](http://localhost:3000/){target=\_blank}. You should see the Wormhole Connect component, which will include a UI for selecting networks and tokens for cross-chain transfers.

### Select Source and Destination Networks

In the Wormhole Connect interface:

- Select Sui as the source network and connect your Sui wallet
- Choose Sepolia as the destination network and connect your wallet with the Sepolia network

### Initiate a Test Transfer

- Enter the amount of SUI tokens you wish to transfer. Since you're on testnet, ensure you have some testnet SUI tokens to cover gas fees
- Enter the destination address on Sepolia where the wrapped SUI tokens should be sent
- Submit the Transfer by following the prompts in the UI.

### Monitor the Transfer Status

Once initiated, Wormhole Connect will display the transfer’s status. You can:

- Check the progress and wait for confirmation that the tokens have successfully bridged from Sui to Sepolia
- Explore any transaction details provided by Wormhole Connect

### Verify the Tokens on Sepolia

Once confirmed, you can check the Sepolia wallet to verify that the wrapped tokens arrived.
