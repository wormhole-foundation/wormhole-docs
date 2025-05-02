---
title: Get Started with Token Bridge
description: 
categories: Token-Bridge, Transfers
---

# Get Started with Token Bridge

## Introduction

Wormhole’s Token Bridge enables seamless cross-chain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

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

