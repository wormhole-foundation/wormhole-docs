---
title: Get Started with the TypeScript SDK
description: Follow this guide to install the Wormhole TypeScript SDK, initialize a Wormhole instance, and add the platforms your integration supports. 
categories: Typescript-SDK
---

# Get Started with the TypeScript SDK

## Introduction

The Wormhole TypeScript SDK provides a unified, type-safe interface for building cross-chain applications. It is a foundational toolkit that supports interaction with core Wormhole protocols, including Token Bridge, CCTP, and Settlement, giving developers a consistent API across multiple chains.

This guide helps you install the SDK, initialize a `Wormhole` instance to support your desired network and blockchain platforms, and return chain-specific information to verify successful initialization.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed
 
## Set Up Your Project

Use the following commands to set up your project and install the Wormhole SDK:

1. Create a directory and initialize a Node.js project:

    ```bash
    mkdir wh-ts-demo
    cd wh-ts-demo
    npm init -y
    ```

2. Install the Wormhole TypeScript SDK and the `tsx` helper (for running TypeScript files):

    ```bash
    npm install @wormhole-foundation/sdk
    npm install --save-dev tsx typescript @types/node
    ```

3. (Optional) Create a `tsconfig.json` if you don't have one. You can generate a basic one using the following command:

    ```bash
    npx tsc --init
    ```

    Make sure your `tsconfig.json` includes the following settings:

    ```json
    {
        "compilerOptions": {
            "target": "es2020", // Or newer
            "module": "commonjs", // Or esnext if you configure package.json type: "module"
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true,
            "resolveJsonModule": true // Often useful
        }
    }
    ```

## Initialize the SDK & Add Supported Platforms

To use the SDK, you must first initialize the main `Wormhole` class. This involves specifying the network ("Mainnet," "Testnet," "Devnet," etc.) and the blockchain platforms your application will interact with.

1. Create a new TypeScript file named `src/main.ts` in your project directory:

    ```bash
    mkdir src
    touch src/main.ts
    ```

2. Add the following code to `src/main.ts` to initialize the SDK and use the `Wormhole` instance to return the chain ID and RPC for the chains this instance supports:

    ```ts
    --8<-- "code/tools/typescript-sdk/get-started/snippet-1.ts"
    ```

3. Save your changes to `src/main.ts` and run the script using the following command:

    ```bash
    npx tsx src/main.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/tools/typescript-sdk/get-started/terminal-01.html"
    
## Next Steps

Now that you’ve successfully installed the Wormhole TypeScript SDK and initialized a `Wormhole` instance, these guides will help you build on what you've accomplished:

### Build SDK Helpers

These guides demonstrate how to create items you can use across most or all Wormhole product integrations, such as transaction signers and encrypted key stores. You can create these helpers now; however, links to related helpers are included in the "Prerequisites" section for projects where they are used.

- [Encrypt Private Keys with Foundry](TODO: WIP){target=\_blank} - use Foundry keystore to encrypt the private keys for your blockchain transaction signers. Examples throughout this documentation use encrypted private keys in alignment with industry best practices
- [Sign EVM Transactions](TODO: WIP){target=\_blank} - create both front and backend signers for approving EVM environment blockchain transactions and add them to your Wormhole integration
- [Sign Solana Transactions](TODO: WIP){target=\_blank} - create both front and backend signers for approving Solana environment blockchain transactions and add them to your Wormhole integration

<!-- TODO What else should go here? -->

### Get Started Guides

These product-focused guides offer the TL;DR on using Wormhole products and include practical instructions and example code to get your integration off to the best start: 
<!--TODO: Do we want them all here or just some right now? Update with final list, verify titles, add links and descriptions-->
- [Get Started with Messaging](/docs/products/messaging/get-started/){target=\_blank} - follow this guide to deploy Wormhole-based message sender and receiver smart contracts and use them to send messages across chains
- [Get Started with Token Bridge](TODO){target=\_blank}
- [Get Started with Native Token Transfers (NTT)](TODO){target=\_blank}
- [Get Started with CCTP Bridge](TODO){target=\_blank}




