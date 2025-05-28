---
title: Get Started with CCTP
description: Transfer USDC across chains using Wormhole's CCTP integration with the TypeScript SDK, including setup, attestation, and redemption steps.
categories: Transfer
---

# Get Started with CCTP

## Introduction

[Wormhole CCTP](/docs/products/cctp-bridge/overview/){target=\_blank} enables native USDC transfers between supported chains by burning tokens on the source chain and minting them on the destination. This provides native, canonical USDC movement without the need for wrapped tokens.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform a manual cross-chain USDC transfer from Avalanche to Sepolia using Circle's CCTP protocol.

You will initiate the transfer on Avalanche, wait for Circle's attestation, and redeem the USDC on Sepolia.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
 - Wallets funded with native tokens and USDC on two [supported CCTP chains](/docs/products/reference/supported-networks/#cctp){target=\_blank}

This example uses an Avalanche Fuji wallet with [USDC](https://faucet.circle.com/){target=\_blank} and [AVAX](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}, as well as a Sepolia wallet with testnet [ETH](https://www.alchemy.com/faucets/ethereum-sepolia){target=\_blank}, to pay the transaction fees. You can adapt the steps to work with any supported EVM chains that support CCTP.

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir cctp-bridge
    cd cctp-bridge
    npm init -y
    ```

2. Install the required dependencies:

    ```bash
    npm install @wormhole-foundation/sdk
    npm install -D tsx typescript
    ```

3. Create a `transfer.ts` file to handle the multichain transfer logic and a `helper.ts` file to manage wallet signers:

    ```bash
    touch transfer.ts helper.ts
    ```

4. Set up secure access to your wallets. This guide assumes you are loading your `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a CCTP Transfer

This section walks you through a complete manual USDC transfer using Wormhole's CCTP integration. You will initiate the transfer on Avalanche Fuji, wait for the Circle attestation, and complete the redemption on Sepolia.

Start by defining utility functions for signer and token setup:

1. In `helper.ts`, define functions to load private keys and instantiate EVM signers:

    ```ts title="helper.ts"
    --8<-- "code/products/cctp-bridge/get-started/snippet-1.ts"
    ```

2. In `transfer.ts`, add the script to perform the manual transfer using CCTP:

    ```ts title="transfer.ts"
    --8<-- "code/products/cctp-bridge/get-started/snippet-2.ts"
    ```

3. Run the script to execute the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/products/cctp-bridge/get-started/snippet-3.html"

To verify the transaction and view its details, paste the transaction hash into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a CCTP USDC transfer using the Wormhole SDK, you're ready to explore more advanced features and expand your integration:

 - [**Circle CCTP Documentation**](https://developers.circle.com/stablecoins/cctp-getting-started){target=\_blank} – learn how USDC cross-chain transfers work and explore advanced CCTP features