---
title: Get Started with Messaging
description: Follow this guide to use Wormhole's core protocol to publish a multichain message and return transaction information with VAA identifiers.
categories: Basics, Typescript SDK
---

# Get Started with Messaging

Wormhole's core functionality allows you to send any data packet from one supported chain to another. This guide demonstrates how to publish your first simple, arbitrary data message from an EVM environment source chain using the Wormhole TypeScript SDK's core messaging capabilities. 

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed.
- [Ethers.js](https://docs.ethers.org/v6/getting-started/){target=\_blank} installed (this example uses version 6).
- A small amount of testnet tokens for gas fees. This example uses [Sepolia ETH](https://sepolia-faucet.pk910.de/){target=\_blank} but can be adapted for any supported network.
- A private key for signing blockchain transactions.

## Configure Your Messaging Environment

1. Create a directory and initialize a Node.js project:

    ```bash
    mkdir core-message
    cd core-message
    npm init -y
    ```

2. Install TypeScript, tsx, Node.js type definitions, and Ethers.js:

    ```bash
    npm install --save-dev tsx typescript @types/node ethers
    ```

3. Create a `tsconfig.json` file if you don't have one. You can generate a basic one using the following command:

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

4. Install the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}:

    ```bash
    npm install @wormhole-foundation/sdk
    ```

5. Create a new file named `main.ts`:

    ```bash
    touch main.ts
    ```

## Construct and Publish Your Message

1. Open `main.ts` and update the code there as follows:

    ```ts title="main.ts"
    --8<-- "code/products/messaging/get-started/main.ts"
    ```

    This script initializes the SDK, defines values for the source chain, creates an EVM signer, constructs the message, uses the core protocol to generate, sign, and send the transaction, and returns the VAA identifiers upon successful publication of the message.

2. Run the script using the following command:

    ```bash
    npx tsx main.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/products/messaging/get-started/terminal01.html"

3. Make a note of the transaction ID and VAA identifier values. You can use the transaction ID to [view the transaction on Wormholescan](https://wormholescan.io/#/tx/0xeb34f35f91c72e4e5198509071d24fd25d8a979aa93e2f168de075e3568e1508?network=Testnet){target=\_blank}. The emitter chain, emitter address, and sequence values are used to retrieve and decode signed messages.

Congratulations! You've published your first multichain message using Wormhole's TypeScript SDK and core protocol functionality. Consider the following options to build upon what you've accomplished. 

## Next Steps

- **[Get Started with Token Bridge](/docs/products/token-bridge/get-started/){target=\_blank}**: Follow this guide to start working with multichain token transfers using Wormhole Token Bridge's lock and mint mechanism to send tokens across chains.
<!-- - [**Get Started with the Solidity SDK**](/docs/tools/solidity-sdk/get-started/){target=\_blank}: Smart contract developers can follow this on-chain integration guide to use Wormhole Solidity SDK-based sender and receiver contracts to send testnet USDC across chains.
-->