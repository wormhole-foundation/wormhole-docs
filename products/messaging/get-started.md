---
title: Get Started with Messaging
description: Follow this guide to use Wormhole's core protocol to publish a multichain message and return transaction information with VAA identifiers.
categories: Basics, Typescript-SDK
---

# Get Started with Messaging

Wormhole's core functionality allows you to send any data packet from one supported chain to another. This guide will demonstrate publishing your first simple, arbitrary data message from an EVM environment source chain using the Wormhole TypeScript SDK's core messaging capabilities. 

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed
- [`ethers.js`](https://docs.ethers.org/v6/getting-started/){target=\_blank} installed (this example uses version 6)
- A small amount of [Sepolia ETH](https://sepolia-faucet.pk910.de/){target=\_blank} for gas fees
- An private key for signing transactions

## Setup Your Project

If you already completed the [Get Started with the TypeScript SDK](/docs/tools/typescript-sdk/get-started){target=\_blank} guide, proceed to [Prepare to Sign Messages with Your Encrypted Key](#prepare-to-sign-messages-with-your-encrypted-key). 

??? example "Project setup instructions"

    Use the following commands to create a TypeScript project:

    1. Create a directory and initialize a Node.js project:

        ```bash
        mkdir wh-core-message-demo
        cd wh-core-message-demo
        npm init -y
        ```

    2. Install TypeScript along with `tsx` (for running TypeScript files) and Node.js type definitions:

        ```bash
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
                // es2020 or newer
                "target": "es2020",
                // Use esnext if you configured your package.json with type: "module"
                "module": "commonjs",
                "esModuleInterop": true,
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "skipLibCheck": true,
                "resolveJsonModule": true
            }
        }
        ```
    
    4. Use the following command to install the Wormhole TypeScript SDK:

        ```bash
        npm install @wormhole-foundation/sdk
        ```

## Prepare to Sign Messages with Your Encrypted Key

First, write a script for an EVM-compatible signer using the following steps:

1. Create a new file inside the `src` directory named `signMessage.ts`:

    ```bash
    touch signMessage.ts
    ```

2. Open `signMessage.ts` and add the following code:

    ```ts title="signMessage.ts"
    --8<-- "code/products/messaging/get-started/signMessage.ts"
    ```

     The `signMessage.ts` script creates an `ethers.js` provider, decrypts the Foundry keystore, connects to a wallet, and creates an full signer for the EVM environment. It returns the `signer` and `provider` for use in your messaging script.

## Construct and Publish Your Message

Now you can update `main.ts` to use your EVM signer, construct a message, and publish it to Sepolia. 

1. Open `main.ts` and update the code there as follows:

    ```ts title="main.ts"
    --8<-- "code/products/messaging/get-started/main.ts"
    ```

2. Run the script using the following command:

    ```bash
    npx tsx src/main.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/products/messaging/get-started/terminal01.html"

3. Make a note of the transaction ID and VAA identifiers values. You can use the transaction ID to [view the transaction on Wormholescan](https://wormholescan.io/#/tx/0x98698539762d93d0c152b893b521688c61ec0b48b16559c6f5e2a09b975b09ca?network=Testnet){target=\_blank}. The emitter chain, emitter address, and sequence values are used to retrieve and decode signed messages

Congratulations! You've published your first multichain message using Wormhole's TypeScript SDK and core protocol functionality. Consider the following options to build upon what you've accomplished. 

## Next Steps

- [**Get Started with Token Bridge**](/docs/products/token-bridge/get-started/){target=\_blank} - follow this guide to start working with multichain token transfers using Wormhole Token Bridge's lock and mint mechanism to send tokens across chains

- [**Get Started with the Solidity SDK**](/docs/tools/solidity-sdk/get-started/){target=\_blank} - smart contract developers can follow this on-chain integration guide to deploy Wormhole Solidity SDK-based sender and receiver smart contracts and use them to send testnet USDC across chains


