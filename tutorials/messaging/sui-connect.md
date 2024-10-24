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

### Run the App

Make sure you’re in the root directory of your React app, and run the following command to start the application:

```bash
npm start
```

<!--
connect react app: https://github.com/martin0995/WH-connect 

connect configuration page - e.g. select only sui network to show 
-->