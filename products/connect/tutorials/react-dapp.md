---
title: Integrate Connect into a React DApp Tutorial
description: Learn how to use Wormhole Connect to transfers tokens cross-chain seamlessly between Sui and Avalanche Fuji with this step-by-step guide.
categories: Connect, Transfer
---

# Integrate Connect into a React DApp

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}

## Introduction

In this tutorial, we’ll explore how to integrate [Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect){target=\_blank} to enable cross-chain token transfers and interactions. Wormhole Connect offers a simplified interface for developers to facilitate seamless token transfers between blockchains. Using Wormhole Connect, you can easily bridge assets across multiple ecosystems without diving into the complex mechanics of cross-chain communication.

While this tutorial will guide you through the process using a specific blockchain as an example, the principles and steps outlined here can be applied to any blockchain supported by Wormhole. In this example, we’ll work with Sui as our source blockchain and Avalanche Fuji as the destination blockchain.

## Prerequisites

To get started with Wormhole Connect, we'll first need to set up a basic environment that allows for cross-chain token transfers.
Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A [Sui wallet](https://suiwallet.com/){target=\_blank} set up and ready for use
- A [compatible wallet](https://support.avax.network/en/articles/5520938-what-are-the-official-avalanche-wallets){target=\_blank} for Avalanche Fuji, such as [MetaMask](https://metamask.io/){target=\_blank} 
- Testnet tokens for [Sui](https://docs.sui.io/guides/developer/getting-started/get-coins){target=\_blank} and [Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank} to cover gas fees 

## Set Up Connect for Sui Transfers

### Create a React Project

Start by setting up your React app:

1. Open your terminal and run the following command to create a new React app:

    ```bash
    npx create-react-app connect-tutorial
    ```

2. Navigate into the project directory:

    ```bash
    cd connect-tutorial
    ```

### Install Wormhole Connect

Next, install the Wormhole Connect package as a dependency by running the following command inside your project directory:

```bash
npm install @wormhole-foundation/wormhole-connect
```

### Integrate Connect into the Application

Now, we need to modify the default `App.js` file to integrate Wormhole Connect. We are going to use [version V1.0](/docs/products/connect/guides/upgrade/){target=\_blank}, make sure to check which version of connect you are using. Open `src/App.js` and replace the content with the following code:

=== "JavaScript"

    ```js
    import logo from './logo.svg';
    import './App.css';
    import WormholeConnect from '@wormhole-foundation/wormhole-connect';

    const config = {
        network: 'Testnet',
        chains: ['Sui', 'Avalanche'],
    };

    function App() {
        return <WormholeConnect config={config}/>;
    }

    export default App;
    ``` 

=== "TypeScript"

    ```ts
    import './App.css';
    import WormholeConnect, {
        WormholeConnectConfig,
        WormholeConnectTheme,
    } from '@wormhole-foundation/wormhole-connect';

    function App() {
        const config: WormholeConnectConfig = {
            network: 'Testnet',
            chains: ['Sui', 'Avalanche'],

            ui: {
                title: 'SUI Connect TS Demo',
            },
        };

        const theme: WormholeConnectTheme = {
            mode: 'dark',
            primary: '#78c4b6',
        };

        return <WormholeConnect config={config} theme={theme} />;
    }

    export default App;
    ```

- Set `network` to `testnet` - this ensures that Wormhole Connect uses the testnet environment
- Set `chains` to `['Sui', 'Avalanche']` - configures the app to allow transfers between Sui and Avalanche Fuji, the testnet for Avalanche

### Customize Wormhole Connect

To further customize Wormhole Connect for your application, such as adjusting the UI, adding custom tokens, or configuring specific chain settings, you can refer to the [Wormhole Connect Configuration guide](/docs/products/connect/configuration/data/){target=\_blank}. 

### Run the Application

Make sure you’re in the root directory of your React app, and run the following command to start the application:

```bash
npm start
```

Now your React app should be up and running, and Wormhole Connect should be visible on `http://localhost:3000/`. You should see the Wormhole Connect component, which will include a UI for selecting networks and tokens for cross-chain transfers.

## Transfer Tokens from Sui to Fuji

Before transferring token ensure you have enough testnet SUI and Fuji tokens to cover the gas fees for the transfer. 

To transfer tokens from Sui to Fuji in the Wormhole Connect interface:

1. Select **Sui** as the source network, connect your Sui wallet, and choose **SUI** as the asset you wish to transfer
2. Choose **Fuji** as the destination network and connect your wallet with the Fuji network
3. Enter the amount of SUI tokens you wish to transfer

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-1.webp)

4. Choose to view other routes 
    
    ![](/docs/images/products/connect/tutorials/react-dapp/connect-2.webp)

5. Select the manual bridge option, which will require two transactions: one on the source chain (Sui) and one on the destination chain (Fuji)

    !!! note
        It is recommended to use the manual bridge option for this tutorial. The automatic bridge feature is currently undergoing improvements, while the manual bridge ensures that transfers complete successfully.

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-3.webp)

6. Review and confirm the transfer on Sui. This will lock your tokens on the Sui chain

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-4.webp)

7. Follow the on-screen prompts to approve the transaction. You will be asked to sign with your Sui wallet

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-5.webp)

Once the transaction has been submitted, Wormhole Connect will display the progress of the transfer. Monitor the status until you’re prompted to complete the transaction on the destination chain. You can also track your transactions on [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Claim Tokens on Fuji

After the Sui transaction is complete, confirm the final transaction on Fuji by claiming the wrapped tokens. You will be asked to confirm the transaction with your Fuji wallet.

![](/docs/images/products/connect/tutorials/react-dapp/connect-6.webp)

Once confirmed, check your Fuji wallet to verify that the wrapped SUI tokens have been successfully received.

![](/docs/images/products/connect/tutorials/react-dapp/connect-7.webp)

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the entire codebase in the [Sui-Connect GitHub repository](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}. The repository includes an integration of Wormhole Connect in a React app for bridging tokens between the Sui and Fuji (Avalanche Testnet) networks.

## Conclusion

In this tutorial, you’ve gained hands-on experience with integrating Wormhole Connect to enable cross-chain token transfers. You’ve learned to configure a React app for seamless interactions between Sui and Avalanche Fuji, providing users with the ability to bridge assets across chains with ease.

By following these steps, you've learned how to:

- Set up a React project tailored for cross-chain transfers
- Install and configure Wormhole Connect to support multiple blockchains
- Implement a streamlined UI for selecting source and destination chains, connecting wallets, and initiating transfers
- Execute a token transfer from Sui to Avalanche Fuji, monitoring each step and confirming the transaction on both networks

With these tools and knowledge, you’re now equipped to build powerful cross-chain applications using Wormhole Connect, opening up possibilities for users to move assets across ecosystems securely and efficiently.