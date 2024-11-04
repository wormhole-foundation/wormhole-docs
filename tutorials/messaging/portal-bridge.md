---
title: Portal Bridge
description: 
---

# Portal Bridge

## Introduction

This tutorial guides you through building a cross-chain token transfer application using the [Wormhole Typescript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} and its Portal Bridge method. The Portal Bridge method enables secure and efficient cross-chain asset transfers across different blockchain networks, allowing users to move tokens seamlessly, including native tokens and USDC.

By leveraging Wormhole’s Portal Bridge, this guide shows you how to build an application that supports multiple transfer types:

 - EVM to EVM (e.g., Ethereum to Avalanche)
 - EVM to non-EVM chains (e.g., Ethereum to Solana)
 - Non-EVM to EVM chains (e.g., Sui to Avalanche)
 - Non-EVM to non-EVM chains (e.g., Solana to Sui)

Existing solutions for cross-chain transfers can be complex and inefficient, requiring multiple steps and transaction fees. However, the Portal Bridge method from Wormhole simplifies the process by handling the underlying attestation, transaction validation, and message passing across blockchains.

At the end of this guide, you’ll have a fully functional setup for transferring assets across chains using Wormhole’s Portal Bridge method.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally
 - Native tokens (Testnet or Mainnet) in Solana and Sui wallets
 - A wallet with a private key, funded with native tokens (Testnet or Mainnet) for gas fees

## Supported Chains

The Wormhole SDK supports a wide range of EVM and non-EVM chains, allowing you to facilitate cross-chain transfers efficiently. You can find a complete list of supported chains in the Wormhole SDK [GitHub repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants/circle.ts#L14-L30){target=_blank}, which covers both Testnet and Mainnet environments.

## Project Setup

In this section, you'll set up your project for transferring native tokens across chains using Wormhole's SDK and Portal Bridge. We’ll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project** - start by creating a new directory for your project and initializing it with `npm`, which will create the `package.json` file for your project

    ```bash
    mkdir native-transfers
    cd native-transfers
    npm init -y
    ```

2. **Install dependencies** - install the required dependencies, including the Wormhole SDK and helper libraries

    ```bash
    npm install @wormhole-foundation/sdk dotenv
    ```

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private key

    ```env
    ETH_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SOL_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SUI_PRIVATE_KEY="INSERT_SUI_MNEMONIC"
    ```

    !!! note
        Ensure your private key contains native tokens for gas on both the source and destination chains. For Sui, you must provide a mnemonic instead of a private key.

4. **Create a `helpers.ts` file** - to simplify the interaction between chains, create a file to store utility functions for fetching your private key, setting up signers for different chains, and managing transaction relays

    1. Create the helpers file

        ```bash
        mkdir helpers
        touch helpers/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code

        ```typescript
        --8<-- "code/tutorials/messaging/portal-bridge/portal-bridge-1.ts"
        ```

        - **`getEnv`** - this function fetches environment variables like your private key from the `.env` file
        - **`getSigner`** - based on the chain you're working with (EVM, Solana, Sui, etc.), this function retrieves a signer for that specific platform. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the private key stored in your `.env` file

5. **Create the main script** - create a new file named `native-transfer.ts` to hold your script for transferring USDC across chains

    1. Create the `native-transfer.ts` file in the `src` directory

        ```bash
        touch src/native-transfer.ts
        ```

    2. Open the `native-transfer.ts` file and begin by importing the necessary modules from the SDK and helper files

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-2.ts:1:4"
        ```

        - **`evm`** - this import is for working with EVM-compatible chains, like Avalanche, Ethereum, Base Sepolia, and more
        - **`solana`** - this adds support for Solana, a non-EVM chain
        - **`getSigner`** - utility function from the helper file that retrieves the signer to sign transactions