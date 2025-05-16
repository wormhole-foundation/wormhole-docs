---
title: Get Started with the TypeScript SDK
description: Follow this guide to install the Wormhole TypeScript SDK, initialize a Wormhole instance, and add the platforms your integration supports. 
categories: Typescript-SDK
---

# Get Started with the TypeScript SDK

## Introduction

The Wormhole TypeScript SDK provides a unified, type-safe interface for building cross-chain applications. It is a foundational toolkit that supports interaction with core Wormhole protocols, including Token Bridge, CCTP, and Settlement, giving developers a consistent API across multiple chains.

This guide helps you install the SDK, initialize a `Wormhole` instance to support your desired network and blockchain platforms, and return chain-specific information to verify successful initialization.

If you're looking to build more advanced integrations, such as token transfers with Token Bridge, CCTP, or Native Token Transfers, see the [Next Steps](#next-steps).

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

3. Create a `tsconfig.json` if you don't have one. You can generate a basic one using the following command:

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

## Initialize the SDK and Add Supported Platforms

To use the SDK, you must first initialize the main `Wormhole` class. This involves specifying the network (`Mainnet`, `Testnet`, or `Devnet`) and the blockchain platforms your application will interact with.

1. Create a new TypeScript file named `src/main.ts` in your project directory:

    ```bash
    mkdir src
    touch src/main.ts
    ```

2. Add the following code to `src/main.ts` to initialize the SDK and use the `Wormhole` instance to return the chain ID and RPC for the chains this instance supports:

    ```ts title="src/main.ts"
    --8<-- "code/tools/typescript-sdk/get-started/snippet-1.ts"
    ```

3. Run the script using the following command:

    ```bash
    npx tsx src/main.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/tools/typescript-sdk/get-started/terminal-01.html"

## Fetch Chain Information

Follow these steps to verify that the SDK is properly initialized for the chains you intend to support.

1. Update `src/main.ts` as follows to retrieve the chain ID and RPC for the chains your project supports:

    ```ts title="src/main.ts"
    --8<-- "code/tools/typescript-sdk/get-started/snippet-2.ts"
    ```

2. Run the updated script again and you will see terminal output similar to the following:

    --8<-- "code/tools/typescript-sdk/get-started/terminal-02.html"
    
Congratulations! You’ve successfully installed the Wormhole TypeScript SDK and initialized a `Wormhole` instance. Consider the following options to build on what you've accomplished.

## Next Steps

### Wormhole Basics

- [Get Started with Messaging](/docs/products/messaging/get-started/){target=\_blank} - follow this guide to use Wormhole's TypeScript SDK and core protocol to publish a multichain message and return transaction information with VAA identifiers

- [Get Started with the Solidity SDK](/docs/tools/solidity-sdk/get-started.md) - follow this guide to deploy Wormhole Solidity SDK-based message sender and receiver smart contracts, publish a multichain message and return transaction information with VAA identifiers

### Product Get Started Guides

When you're ready to move on to token transfers, these guides offer the TL;DR on using Wormhole products and include practical instructions and example code to get your integration off to the best start: 

- [Get Started with Token Bridge](TODO){target=\_blank} TODO: description
- [Get Started with CCTP Bridge](TODO){target=\_blank} TODO: description
- [Get Started with Native Token Transfers](TODO){target=\_blank} TODO: description




