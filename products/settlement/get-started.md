---
title: Get Started
description: Perform a cross-chain token swap using Wormhole Settlement and the Mayan Swift route with the TypeScript SDK on mainnet.
categories: Settlement, Transfer
---

# Get Started with Settlement

[Settlement](/docs/products/settlement/overview/){target=\_blank} is Wormhole’s intent-based execution layer, enabling fast, multichain token transfers. It coordinates routing logic, relayers, and on-chain infrastructure to let users express what they want to be done, not how.

This guide walks you through performing a real token swap using the [Mayan Swift route](https://mayan.finance){target=_blank}, one of the three integrated Settlement protocols, with the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=_blank}.

By the end, you'll have a working script that:

- Resolves token transfer routes using Mayan Swift
- Quotes and validates the best route
- Initiates a swap on a source chain and completes the transfer on a destination chain

!!! note
    Mayan Swift currently supports **mainnet only**. Attempting to run this demo on a testnet will fail.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- Wallets funded with tokens on two [supported chains](/docs/products/reference/supported-networks/#settlement){target=\_blank}

This example uses Ethereum as the source chain and Solana as the destination. As a result, you'll need an Ethereum wallet with ETH for gas and a Solana wallet with SOL for fees. You can adapt the example to match your preferred chains.

## Set Up a Project

Start by scaffolding a basic Node.js project and installing the required SDKs.

1. Create a new project folder:

    ```bash
    mkdir settlement-swap
    cd settlement-swap
    npm init -y
    ```

2. Install the required dependencies:

    ```bash
    npm install @wormhole-foundation/sdk-connect \
        @wormhole-foundation/sdk-evm \
        @wormhole-foundation/sdk-solana \
        @mayanfinance/wormhole-sdk-route \
        dotenv
    npm install -D typescript tsx
    ```

3. Create the file structure:

    ```bash
    mkdir src
    touch src/helpers.ts src/swap.ts .env .gitignore
    ```

4. Set up secure access to your wallets. This guide assumes you are loading your `MAINNET_ETH_PRIVATE_KEY` and `MAINNET_SOL_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [cast wallet](https://book.getfoundry.sh/reference/cast/cast-wallet/){target=_blank}.

    !!! warning
        If you use a .env file during development, add it to your .gitignore to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Token Swap

This section shows you how to perform a token swap using the Mayan Swift route. You will define a helper function to configure the source and destination chain signers.

Then, you'll create a script that initiates a transfer on Ethereum, uses the Mayan Swift resolver to find valid routes, sends the transaction, and completes the transfer on Solana.

1. Open `helper.ts` and define the `getSigner` utility function to load private keys, instantiate signers for Ethereum and Solana, and return the signers along with the Wormhole-formatted address:

    ```ts title="src/helpers.ts"
    --8<-- "code/products/settlement/get-started/snippet-1.ts"
    ```

2. In `swap.ts`, add the following script, which will handle all of the logic required to perform the token swap: 

    ```ts title="src/swap.ts"
    --8<-- "code/products/settlement/get-started/snippet-2.ts"
    ```

3. Execute the script to initiate and complete the transfer:

    ```bash
    npx tsx src/swap.ts
    ```

    If successful, you’ll see terminal output like this:

    --8<-- "code/products/settlement/get-started/snippet-3.html"

Congratulations! You've just completed a cross-chain token swap from Ethereum to Solana using Settlement.

## Customize the Integration

You can tailor the example to your use case by adjusting:

- **Tokens and chains**: Use `getSupportedTokens()` to explore what's available.
- **Source and destination chains**: Modify `sendChain` and `destChain` in `swap.ts`.
- **Transfer settings**: Update the amount or route parameters.
- **Signer management**: Modify `src/helpers.ts` to integrate with your preferred wallet setup.

## Next Steps

Once you've chosen a path, follow the corresponding guide to start building:

- [**`demo-mayanswift`**](https://github.com/wormhole-foundation/demo-mayanswift){target=_blank}: Check out the repository for the full code example.
<!-- - [**Use Mayan Swift with the SDK**](TODO){target=\_blank} – plug into Settlement using the [TypeScript SDK](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank} for rapid integration -->
