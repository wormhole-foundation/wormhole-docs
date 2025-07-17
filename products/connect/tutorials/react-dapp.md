---
title: Integrate Connect into a React DApp Tutorial
description: Learn how to use Wormhole Connect to transfers tokens cross-chain seamlessly between Sui and Avalanche Fuji with this step-by-step guide.
categories: Connect, Transfer
---

# Integrate Connect into a React DApp

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}

In this tutorial, we'll explore how to integrate [Wormhole Connect](/docs/products/connect/overview/){target=\_blank} to enable cross-chain token transfers and interactions. Connect offers a simplified interface for developers to facilitate seamless token transfers between blockchains. Using Connect, you can easily bridge assets across multiple ecosystems without diving into the complex mechanics of cross-chain communication.

While this tutorial will guide you through the process using a specific blockchain as an example, the principles and steps outlined here can be applied to any [blockchain supported by Wormhole](/docs/products/connect/reference/support-matrix/){target=\_blank}. In this example, we'll work with Sui as our source blockchain and Avalanche Fuji as the destination blockchain.

## Prerequisites

To get started with Connect, we'll first need to set up a basic environment that allows for cross-chain token transfers.
Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A [Sui wallet](https://suiwallet.com/){target=\_blank} set up and ready for use
- A [compatible wallet](https://support.avax.network/en/articles/5520938-what-are-the-official-avalanche-wallets){target=\_blank} for Avalanche Fuji, such as [MetaMask](https://metamask.io/){target=\_blank} 
- Testnet tokens for [Sui](https://docs.sui.io/guides/developer/getting-started/get-coins){target=\_blank} and [Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank} to cover gas fees 

## Set Up Connect for Sui Transfers

### Create a React Project

In this tutorial, we'll use [Next.js](https://nextjs.org/docs/app/getting-started){target=\_blank}, a popular framework built on top of React, to set up your app:

1. Open your terminal and run the following command to create a new React app:

    ```bash
    npx create-next-app@latest connect-tutorial
    ```

    We recommend enabling TypeScript and creating a `src/` directory during setup. Other options can be configured based on your preferences.

2. Navigate into the project directory:

    ```bash
    cd connect-tutorial
    ```


### Install Connect

Next, install the Connect package as a dependency by running the following command inside your project directory:

```bash
npm install @wormhole-foundation/wormhole-connect
```

### Integrate Connect into the Application

Now, we need to modify the default `page.tsx` file to integrate Connect. We are going to use [version V1.0](/docs/products/connect/guides/upgrade/){target=\_blank} or later, make sure to check which version of Connect you are using. Open `src/app/page.tsx` and replace the content with the following code:

=== "JavaScript"

    ```js
    --8<-- "code/products/connect/tutorials/react-dapp/snippet-1.js"
    ```

=== "TypeScript"

    ```ts
    --8<-- "code/products/connect/tutorials/react-dapp/snippet-2.ts"
    ```

- Set `network` to `'Testnet'` - this ensures that Connect uses the testnet environment
- Set `chains` to `['Sui', 'Avalanche']` - configures the app to allow transfers between Sui and Avalanche Fuji, the testnet for Avalanche

### Customize Connect

To further customize Connect for your application, such as adjusting the UI, adding custom tokens, enabling Reown (formerly known as WalletConnect), or configuring specific chain settings, you can refer to the [Connect Configuration guide](/docs/products/connect/configuration/data/){target=\_blank}.

### Run the Application

Make sure you're in the root directory of your React app, and run the following command to start the application:

```bash
npm run dev
```

Now your React app should be up and running, and Connect should be visible on `http://localhost:3000/`. You should see the Connect component, which will include a UI for selecting networks and tokens for cross-chain transfers.

## Transfer Tokens from Sui to Fuji

Before transferring token ensure you have enough testnet SUI and Fuji tokens to cover the gas fees for the transfer. 

To transfer tokens from Sui to Fuji in the Connect interface:

1. Select **Sui** as the source network, connect your Sui wallet, and choose **SUI** as the asset you wish to transfer
2. Choose **Fuji** as the destination network and connect your wallet with the Fuji network
3. Enter the amount of SUI tokens you wish to transfer

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-1.webp){.half}

4. Choose to view other routes 
    
    ![](/docs/images/products/connect/tutorials/react-dapp/connect-2.webp){.half}

5. Select the manual bridge option, which will require two transactions: one on the source chain (Sui) and one on the destination chain (Fuji)

    !!! note
        It is recommended to use the manual bridge option for this tutorial. The automatic bridge feature is currently undergoing improvements, while the manual bridge ensures that transfers complete successfully.

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-3.webp){.half}

6. Review and confirm the transfer on Sui. This will lock your tokens on the Sui chain

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-4.webp){.half}

7. Follow the on-screen prompts to approve the transaction. You will be asked to sign with your Sui wallet

    ![](/docs/images/products/connect/tutorials/react-dapp/connect-5.webp){.half}

Once the transaction has been submitted, Connect will display the progress of the transfer. Monitor the status until you're prompted to complete the transaction on the destination chain. You can also track your transactions on [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Claim Tokens on Fuji

After the Sui transaction is complete, confirm the final transaction on Fuji by claiming the wrapped tokens. You will be asked to confirm the transaction with your Fuji wallet.

![](/docs/images/products/connect/tutorials/react-dapp/connect-6.webp){.half}

Once confirmed, check your Fuji wallet to verify that the wrapped SUI tokens have been successfully received.

![](/docs/images/products/connect/tutorials/react-dapp/connect-7.webp){.half}

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the entire codebase in the [Sui-Connect GitHub repository](https://github.com/wormhole-foundation/demo-basic-connect){target=\_blank}. The repository includes an integration of Connect in a React app for bridging tokens between the Sui and Fuji (Avalanche Testnet) networks.

## Conclusion

In this tutorial, you've gained hands-on experience with integrating Connect to enable cross-chain token transfers. You've learned to configure a React app for seamless interactions between Sui and Avalanche Fuji, providing users with the ability to bridge assets across chains with ease.

By following these steps, you've learned how to:

- Set up a React project tailored for cross-chain transfers
- Install and configure Connect to support multiple blockchains
- Implement a streamlined UI for selecting source and destination chains, connecting wallets, and initiating transfers
- Execute a token transfer from Sui to Avalanche Fuji, monitoring each step and confirming the transaction on both networks

With these tools and knowledge, you're now equipped to build powerful cross-chain applications using Connect, opening up possibilities for users to move assets across ecosystems securely and efficiently.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.