---
title: Get Started with Token Bridge
description: Perform a manual token transfer from Solana to Sui using Wormhole’s Token Bridge with TypeScript SDK, including setup, attestation, and redemption.
categories: Token-Bridge, Transfers
---

# Get Started with Token Bridge

## Introduction

Wormhole’s [Token Bridge](/docs/products/token-bridge/overview){target=\_blank} enables seamless multichain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform a manual token transfer from Solana to Sui. You will initiate the transfer on Solana, fetch the attestation signed by the Guardian network, and redeem the tokens on Sui.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
 - A Solana wallet with [testnet SOL](https://faucet.solana.com/){target=\_blank}
 - A Sui wallet with [testnet SUI](https://faucet.sui.io/){target=\_blank}

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir token-bridge
    cd token-bridge
    npm init -y
    ```

2. Install the required dependencies:

    ```bash
    npm install @wormhole-foundation/sdk
    npm install -D tsx typescript
    ```

3. Create your script files:

    ```bash
    touch transfer.ts helper.ts
    ```

4. Set up secure access to your wallets:

    This guide assumes you are loading your `SOL_PRIVATE_KEY` and `SUI_MNEMONIC` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Manual Token Transfer

This example demonstrates a complete manual token transfer using the Token Bridge and the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}. You'll initiate a transfer on Solana, wait for Guardian signatures, and redeem the tokens on Sui. This flow gives you full control over each step.

Start by defining helper functions for signer and token setup:

1. Create a `helper.ts` file to load private keys from environment variables, instantiate signers for Solana and Sui, and retrieve token decimals as needed:

    ```ts title="helper.ts"
    --8<-- "code/products/token-bridge/get-started/snippet-1.ts"
    ```

2. In `transfer.ts`, write the script that initiates the transfer on Solana, fetches the signed attestation, and completes the transfer on Sui:

    ```ts title="transfer.ts"
    --8<-- "code/products/token-bridge/get-started/snippet-2.ts"
    ```

3. Execute the script to initiate and complete the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    If successful, the expected output should be similar to this:

    --8<-- "code/products/token-bridge/get-started/snippet-3.html"

To verify the transaction and view its details, copy the transaction hash from the output and paste it into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a manual multichain token transfer, explore these guides to continue building:

 - [Complete Token Transfer Workflow](/docs/products/token-bridge/tutorials/transfer-workflow){target=\_blank} – build a reusable application that supports multiple chain combinations and transfer modes (manual and automatic)
 - [Create Multichain Tokens](/docs/products/token-bridge/tutorials/multichain-token){target=\_blank} – learn how to issue tokens that work across chains
 - [Flow of a Transfer](TODO){target=\_blank} – understand how messages move through the protocol