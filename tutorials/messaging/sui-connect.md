---
title: Cross-Chain Token Transfers with Wormhole Connect
description: 
---

# Cross-Chain Token Transfers with Wormhole Connect

## Introduction

In this tutorial, we’ll explore how to integrate [Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank} to enable cross-chain token transfers and interactions. Wormhole Connect offers a simplified interface for developers to facilitate seamless token transfers between blockchains. Using Wormhole Connect, you can easily bridge assets across multiple ecosystems without diving into the complex mechanics of cross-chain communication.

While this tutorial will guide you through the process using a specific blockchain as an example, the principles and steps outlined here can be applied to any blockchain supported by Wormhole. In this example, we’ll work with Sui as our source blockchain and Avalanche Fuji as the destination blockchain.

## Prerequisites

To get started with Wormhole Connect, we'll first need to set up a basic environment that allows for cross-chain token transfers.
Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A [Sui wallet](https://suiwallet.com/){target=\_blank} set up and ready for use
- A compatible wallet for Avalanche Fuji, such as MetaMask 
- Testnet tokens for [Sui](https://github.com/MystenLabs/mysten-app-docs/blob/main/mysten-sui-wallet.md#get-sui-tokens-for-testing){target=\_blank} and [Fuji](https://faucets.chain.link/fuji){target=\_blank} to cover gas fees 

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
        networks: ['sui', 'fuji'],
    };

    function App() {
        return <WormholeConnect config={config} />;
    }

    export default App;
    ```

??? interface "Parameters"

    `env` 
    set to 'testnet': This ensures that Wormhole Connect uses the testnet environment, which is perfect for your demonstration.

    `networks` 
    set to ['suji', 'sui']: Configures the app to allow transfers between Sui and Avalanche Fuji, the testnet for Avalanche

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

### Select Networks

Open Your Browser and go to [http://localhost:3000/](http://localhost:3000/){target=\_blank}. You should see the Wormhole Connect component, which will include a UI for selecting networks and tokens for cross-chain transfers.

In the Wormhole Connect interface:

- Select Sui as the source network and connect your Sui wallet
- Choose Fuji as the destination network and connect your wallet with the Fuji network
- Enter the amount of SUI tokens you wish to transfer
- Ensure you have enough testnet SUI tokens to cover the gas fees for the transfer.

![img description](/docs/images/tutorials/connect/connect-1.webp)

### Select Route 

Choose the **Manual Bridge** option, which will require two transactions: one on the source chain (Sui) and one on the destination chain (Fuji)

![img description](/docs/images/tutorials/connect/connect-2.webp)

### Approve and Proceed with Transaction

- Confirm the transfer on Sui. This will lock your tokens on the Sui chain
- Follow the on-screen prompts to approve the transaction. You will be asked to approve with your Sui wallet
- You can track the process on your transaction on [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}

![img description](/docs/images/tutorials/connect/connect-3.webp)

Wormhole Connect will display the progress of the transfer. Monitor the status until you’re prompted to complete the transaction on the destination chain.

### Claim Tokens on Fuji

After the Sui transaction is complete, confirm the final transaction on Fuji by claiming the wrapped tokens. You will be asked to confirm the transaction with your Fuji wallet.

![img description](/docs/images/tutorials/connect/connect-4.webp)

### Transaction Complete

Once confirmed, check your Fuji wallet to verify that the wrapped SUI tokens have been successfully received.

![img description](/docs/images/tutorials/connect/connect-5.webp)