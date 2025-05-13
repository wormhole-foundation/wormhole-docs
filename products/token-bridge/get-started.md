---
title: Get Started with Token Bridge
description: Perform a manual token transfer from Solana to Sui using Wormhole’s Token Bridge with TypeScript SDK, including setup, attestation, and redemption.
categories: Token-Bridge, Transfers
---

# Get Started with Token Bridge

## Introduction

Wormhole’s Token Bridge enables seamless multichain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform a manual token transfer from Solana to Sui. You will initiate the transfer on Solana, fetch the attestation signed by the Guardian network, and redeem the tokens on Sui.

To understand how the protocol works, see the [Token Bridge overview](/docs/products/token-bridge/overview){target=\_blank}.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
 - A Solana wallet with [SOL on Testnet](https://faucet.solana.com/){target=\_blank}
 - A Sui wallet with [SUI on Testnet](https://faucet.sui.io/){target=\_blank}

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir token-bridge
    cd token-bridge
    npm init -y
    ```

2. Install the required dependencies:

    ```bash
    npm install @wormhole-foundation/sdk dotenv
    npm install -D tsx typescript
    ```

3. Create a `.env` file to store your private keys:

    ```bash
    touch .env
    ```

    Add the following variables to your `.env` file:

    ```env
    SOL_PRIVATE_KEY=INSERT_SOLANA_PRIVATE_KEY
    SUI_MNEMONIC=INSERT_SUI_MNEMONIC_PHRASE
    ```

4. Create your script files:

    ```bash
    touch transfer.ts helper.ts
    ```

## Perform a Manual Token Transfer from Solana to Sui

This example demonstrates a complete manual token transfer using the Wormhole SDK. You'll initiate a transfer on Solana, wait for Guardian signatures, and redeem the tokens on Sui. This flow gives you full control over each step.

Let’s start by defining the helper functions for signer and token setup.

### Configure Signers and Utilities

Create a `helper.ts` file to load private keys from environment variables, instantiate signers for Solana and Sui, and retrieve token decimals as needed.

```ts
--8<-- "code/products/token-bridge/get-started/snippet-1.ts"
```

### Define the Token Transfer Logic

In `transfer.ts`, write the script that initiates the transfer on Solana, fetches the signed attestation, and completes the transfer on Sui.

```ts
--8<-- "code/products/token-bridge/get-started/snippet-2.ts"
```

### Execute the Token Transfer

Once your script is ready and your `.env` file is configured, run the script to initiate and complete the transfer.

```bash
npx tsx transfer.ts
```

If successful, the expected output should be similar to this:

--8<-- "code/products/token-bridge/get-started/snippet-3.html"

To verify the transaction and view its details, copy the transaction hash from the output and paste it into [WormholeScan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a manual multichain token transfer, explore these guides to continue building:

 - [Complete Token Transfer Workflow](/docs/products/token-bridge/tutorials/transfer-workflow){target=\_blank} – step through a full end-to-end transfer scenario
 - [Create Multichain Tokens](/docs/products/token-bridge/tutorials/multichain-token){target=\_blank} – learn how to issue tokens that work across chains
 - [Flow of a Transfer](/docs/products/token-bridge/concepts/transfer-flow){target=\_blank} – understand how messages move through the protocol