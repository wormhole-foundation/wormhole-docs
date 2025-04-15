---
title: Settlement with Mayan Swift
description: Learn how to integrate Wormhole Settlement Routes using the SDK to simplify cross-chain swaps, manage fees, and execute seamless transactions.
categories: Settlement, Transfer
---

# Integrate Mayan Swift Routes using the SDK

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank}

## Introduction

This tutorial explains how to integrate the Wormhole Mayan Swift Route from the Wormhole SDK into your application. This Route abstracts the complexity of multichain token swaps, handling route discovery, fee estimation, and transaction construction.

[Mayan Swift](https://mayan.finance/){target=\_blank} is a cross-chain swap auction protocol that simplifies bridging and swapping tokens across blockchains to offer the best swap rates using an auction mechanism.

!!!note
    Mayan Swift currently supports **mainnet** only. Attempting to run the demo on testnet will result in failure.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A wallet with a private key, funded with native tokens on mainnet for gas fees

## Project Setup

To get started, you’ll first clone the repository, install dependencies, and configure environment variables. Once set up, you can initiate a multichain token swap using the Mayan Swift Route.

1. **Initialize the project** - start by creating a new directory for your project and initializing it with `npm`, which will create the `package.json` file for your project

    ```bash
    mkdir demo-mayanswift
    cd demo-mayanswift
    npm init -y
    ```

1. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private keys.

    ```env
    ETH_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SOL_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    ```

    !!!note

        Ensure your private key contains native tokens for gas on both the source and destination chains. For Sui, you must provide a mnemonic instead of a private key.

4. **Create a `helpers.ts` file** - retrieves the correct signer (for Solana or an EVM chain) from environment variables based on the provided chain context, and returns that signer and its associated chain address

    1. Create the helpers file

        ```bash
        mkdir -p src
        touch src/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code

        ```typescript
        --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/helper.ts"
        ```

        - `getEnv` - reads environment variables from your local `.env` file
        - `getSigner` - main utility function to get a correct signer based on the chain you’re targeting. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the private key stored in your `.env` file

## Create Swap Script

This section shows how to initiate and complete a cross-chain token swap using the Mayan Swift route from the Wormhole SDK. You’ll fetch token details, calculate a quote, and sign the transaction—all with a few lines of code.

### Overview and Setup

1. **Create the `swap.ts` file** - from your project’s root directory, create a new file in the src folder. This file will handle the entire end-to-end swap process

    ```bash
    touch src/swap.ts
    ```

2. **Add your import statements** - in `swap.ts`, import the necessary libraries:
 
    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:1:14"
    ```

### Implement the Swap Logic

1. **Define the Wormhole environment** - initialize your Wormhole client for Mainnet and load the desired platforms (EVM, Solana, etc.). Also define your source and destination chains. 

    !!!note
        We’ll start by creating an immediately invoked asynchronous function ((async function() { ... })()) so we can use the await keyword inside our script. This structure makes the code self-contained and allows you to call asynchronous SDK methods without extra boilerplate.

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:16:25"

    // ... in later steps, you’ll add more code here ...

    })();
    ```
2. **Inspect supported tokens** - checking the tokens that each route can handle helps confirm your chain selections are valid. This step is optional but is often useful for debugging or logging

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:31:40"
    ```

3. **Retrieve signers** - fetch the appropriate signers for both the source and destination chains using the `getSigner`helper. You’ll need these to sign transactions on each chain

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:42:44"
    ```

4. **Create a transfer request** - construct a `RouteTransferRequest` object that tells the Wormhole SDK what you want to transfer (source token) and what you want to receive (destination token). The `tr` object will be reused in subsequent steps to identify which tokens you’re transferring and to which networks

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:46:51"
    ```

5. **Find and select a route** - use the resolver to identify all routes capable of bridging your chosen tokens. Then pick one—commonly the “best” route

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:53:55"
    ```

    The Wormhole `resolver.findRoutes()` function returns an array of potential routes, each with different properties. Mayan Swift typically appears if your chosen tokens and chains are supported

6. **Prepare transfer parameters** - determine how many tokens you want to swap and any route options (such as slippage tolerance). Most routes can set default values for these options

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:57:61"
    ```

    The `amount` field indicates how much of the source token to swap. You can override `getDefaultOptions()` with your own if needed

7. **Validate the route** - check to ensure all details (token, amount, chain combination) are acceptable to this route. This step helps catch errors before you attempt to fetch a quote or execute a transaction

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:63:69"
    ```

8. **Fetch a quote** - obtain pricing data—fees, net amounts, and so on—before initiating the swap. If successful, you’ll receive a `quote` object

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:71:76"
    ```

9. **Initiate the transfer** - with the quote in hand, trigger the swap on the source chain. This step involves sending a transaction that the user’s signer (`sender`) must pay for in gas

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:78:85"
    ```

    The `initiate()` call will usually return a transaction receipt or identifier. You can log it or store it for reference

10. **Complete the transfer (wait for finality)** - finally, wait for the transaction to finalize on the source chain and complete the process on the destination chain. The `checkAndCompleteTransfer()` method polls the network until the cross-chain transaction is confirmed, delivering tokens to the destination address

    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts:87"
    ```

??? code "Complete script"
    ```typescript
    --8<-- "code/tutorials/by-product/settlement/demo-mayanswift/swap.ts"
    ```

## Configuration

You can customize the following options within the scripts:

- **Source and destination chains** - modify `sendChain` and `destChain` in `swap.ts`
- **Amount and transfer settings** - adjust `amount` to suit your needs

## Execute the Swap

To initiate a token transfer across chains, using the Mayan Swift Route run:

```bash
npm run swap
```

## Troubleshooting

- **Missing environment variables** - ensure `.env` is correctly set up and keys are valid
- **Unsupported platform error** - verify that the chains are compatible and supported by the Wormhole SDK

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in [Wormhole's demo GitHub repository](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank}. 

## Conclusion 

With these steps, you’ve successfully integrated the Mayan Swift route into your Wormhole setup, allowing you to initiate, validate, and finalize cross-chain token swaps—simplifying what would otherwise be a complex, multi-step process. You can now customize routes, tailor swap parameters (like gas or slippage), and expand support for additional tokens or chains as your application grows.