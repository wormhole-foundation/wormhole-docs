---
title: Get Started
description: Perform a cross-chain token swap using Wormhole Settlement and the Mayan Swift route with the TypeScript SDK on mainnet.
categories: Settlement, Transfer
---

# Get Started with Settlement

[Settlement](/docs/products/settlement/overview/){target=\_blank} is Wormhole’s intent-based execution layer, enabling fast, multichain token transfers. It coordinates routing logic, relayers, and on-chain infrastructure to let users express what they want to be done, not how.

This guide walks you through performing a real token swap using the [Mayan Swift route](https://mayan.finance){target=\_blank} with the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}.

By the end, you'll have a working script that:

- Resolves token transfer routes using Mayan Swift.
- Quotes and validates the best route.
- Initiates a swap on a source chain and completes the transfer on a destination chain (no destination signer required for Mayan Swift).

For a coding walkthrough, watch the [Intent-Based Swap demo](https://youtu.be/dxA1tsa-8iA?si=5ywoTjjzbsysCRPE){target=\_blank}.

!!! note
    Mayan Swift currently supports **mainnet only**. Attempting to run this demo on a testnet will fail.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- One source-chain wallet funded with native gas on a [Swift-supported chain](/docs/products/reference/supported-networks/#settlement){target=\_blank}.
- A destination wallet address on the target chain (no destination signer or gas required).

This example utilizes Ethereum as the source chain and Solana as the destination chain. You’ll need ETH for gas on Ethereum only. You do not need SOL or a Solana signer; you’ll provide a Solana recipient address, and Mayan Swift’s relayer handles the destination leg. You can adapt the example to match your preferred chains.

## Set Up a Project

Start by scaffolding a basic Node.js project and installing the required SDKs.

1. Create a new project folder:

    ```bash
    mkdir settlement-swap
    cd settlement-swap
    npm init -y
    ```

2. Install the required dependencies. This example uses the Mayan Swift route version `{{repositories.settlement.version}}` and Wormhole SDK version `{{repositories.wormhole_sdk.version}}`:

    ```bash
    npm install @wormhole-foundation/sdk-connect@{{repositories.wormhole_sdk.version}} \
        @wormhole-foundation/sdk-evm@{{repositories.wormhole_sdk.version}} \
        @wormhole-foundation/sdk-solana@{{repositories.wormhole_sdk.version}} \
        @mayanfinance/wormhole-sdk-route@{{repositories.settlement.version}} \
        dotenv
    npm install -D typescript tsx
    ```

3. Create the file structure:

    ```bash
    mkdir src
    touch src/helpers.ts src/swap.ts .gitignore
    ```

4. Set up secure access to your wallets. This guide assumes you are loading a source private key and an Ethereum mainnet RPC URL from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [cast wallet](https://www.getfoundry.sh/reference/cast/wallet){target=\_blank}. The RPC is required so the SDK can sign and send the source-chain transaction reliably.

    !!! note
        Some auto-selected public RPCs may require API keys or rate-limit intermittently. Providing your own mainnet RPC URL avoids 401/500 errors and timeouts during `initiate` and status polling.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Token Swap

This section shows you how to perform a token swap using the Mayan Swift route. You will define a helper function to configure the source chain signer.

Then, you'll create a script that initiates a transfer on Ethereum, uses the Mayan Swift resolver to find valid routes, sends the transaction, and lets the route complete the transfer on Solana.

1. Open `helper.ts` and define the `getSigner` utility function to load private key, instantiate signer for your source chain, and return the signer along with the Wormhole-formatted address:

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

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Mayan Swift Demo**

    ---

    Check out the repository for the full code example.

    [:custom-arrow: See the Demo Repository](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/){target=\_blank}

</div>

<!-- - [**Use Mayan Swift with the SDK**](TODO){target=\_blank} – plug into Settlement using the [TypeScript SDK](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank} for rapid integration -->

