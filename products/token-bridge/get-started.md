---
title: Get Started with Token Bridge
description: Perform token transfers using Wormhole’s Token Bridge with the TypeScript SDK, including manual (Solana–Sepolia) and automatic (Fuji–Alfajores).
categories: Token-Bridge, Transfers
---

# Get Started with Token Bridge

## Introduction

Wormhole's [Token Bridge](/docs/products/token-bridge/overview){target=\_blank} enables seamless multichain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform two types of transfers. If you're new to transfer modes, see the [Transfer Modes page](TODO){target=\_blank} for a detailed explanation.

 - **Manual transfer** – where you control each step
 - **Automatic transfer** – where a relayer finalizes the transfer for you

These examples will help you understand how the Token Bridge works across EVM and non-EVM chains.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
 - Wallets funded with tokens on two [supported chains](/docs/products/reference/supported-networks/#token-bridge){target=\_blank}

This guide uses a Solana wallet with [devnet SOL](https://faucet.solana.com/){target=\_blank} and an EVM wallet with [Sepolia ETH](https://www.alchemy.com/faucets/ethereum-sepolia){target=\_blank} for the manual transfer example, and [Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank} and [Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank} wallets funded with testnet tokens for the automatic transfer. You can adapt the examples to match your preferred chains.

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

3. Create a `transfer.ts` file to handle the multichain transfer logic, and a `helper.ts` file to manage wallet signers and token utilities:

    ```bash
    touch transfer.ts helper.ts
    ```

4. Set up secure access to your wallets. This guide assumes you are loading your `SOL_PRIVATE_KEY` and `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Token Transfer

This section shows how to run manual and automatic token transfers using a shared project structure. You will define helper utilities once and reuse them across both flows.

In the manual transfer, you initiate a transfer on Solana, wait for Guardian signatures, and redeem the tokens on Sepolia, giving you complete control over each step. In the automatic transfer, the relayer handles attestation and redemption, simplifying the process between EVM chains.

1. Open `helper.ts` and define utility functions to load private keys, instantiate signers for Solana and EVM chains, and retrieve token decimals as needed:

    ```ts title="helper.ts"
    --8<-- "code/products/token-bridge/get-started/snippet-1.ts"
    ```

2. In `transfer.ts`, add the script for your preferred transfer mode. The `automatic` flag controls transfer behavior passed to `tokenTransfer()`; set it to `false` for manual transfers and `true` for automatic transfers

    === "Manual Transfer"

        ```ts title="transfer.ts"
        --8<-- "code/products/token-bridge/get-started/snippet-2.ts"
        ```
    
    === "Automatic Transfer"

        ```ts title="transfer.ts"
        --8<-- "code/products/token-bridge/get-started/snippet-3.ts"
        ```


3. Execute the script to initiate and complete the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    If successful, the expected output should be similar to this:

    --8<-- "code/products/token-bridge/get-started/snippet-4.html"

To verify the transaction and view its details, copy the transaction hash from the output and paste it into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a manual multichain token transfer, explore these guides to continue building:

 - [Complete Token Transfer Workflow](/docs/products/token-bridge/tutorials/transfer-workflow){target=\_blank} – build a reusable application that supports multiple chain combinations and transfer modes (manual and automatic)
 - [Create Multichain Tokens](/docs/products/token-bridge/tutorials/multichain-token){target=\_blank} – learn how to issue tokens that work across chains