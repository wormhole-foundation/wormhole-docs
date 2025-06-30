---
title: Redeem Signed VAA to Complete Transfer
description: TODO
categories: Transfer, Token-Bridge
---

# Redeem Signed VAA to Complete Transfer

This guide demonstrates submitting a signed VAA to the destination chain to complete a manual transfer or messaging flow. The manual transfer process allows complete control by allowing you to add custom logic at each of the following key points:

- Initiation on the source chain and resulting message publication.
- Signed VAA retrieval.
- Redemption of the VAA with the destination chain where the source chain transaction is verified and the transfer completed.

This example will use a known, signed VAA from a Token Bridge transfer using Moonbeam as the source chain and Solana as the destination but can be adapted for any supported chains.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
- A wallet setup with a private key and small amount of gas tokens for your destination chain.

## Set Up Your Developer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment:

1. Create a new directory and initialize a Node.js project using the following commands:
    ```bash
    mkdir redeem-vaa
    cd redeem-vaa
    npm init -y
    ```

2. Install dependencies, including the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}:
   ```bash
   npm install @wormhole-foundation/sdk -D tsx typescript
   ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create a new file called `helper.ts` to hold signer logic using the following command:
    ```bash
    touch helper.ts
    ```

5. Open `helper.ts` and add the following code:
    ```typescript title="helper.ts"
    --8<-- 'code/products/token-bridge/guides/token-bridge-contracts/redeem-vaa/helper.ts'
    ```

## Redeem Signed VAA

1. Create a new file called `completeTransfer.ts` which will hold the logic to redeem the VAA with the destination chain and complete the transfer:
    ```bash 
    touch completeTransfer.ts
    ```

2. Open the new file and add the following code:
    ```typescript title="completeTransfer.ts"
    
    ```


