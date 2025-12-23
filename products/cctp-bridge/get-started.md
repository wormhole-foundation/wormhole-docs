---
title: Get Started with CCTP
description: Transfer USDC across chains using Wormhole's CCTP integration with the TypeScript SDK, including setup, attestation, and redemption steps.
categories: Transfer, CCTP
---

# Get Started with CCTP

[Wormhole CCTP](/docs/products/cctp-bridge/overview/){target=\_blank} enables native USDC transfers between supported chains by burning tokens on the source chain and minting them on the destination. This provides native, canonical USDC movement without the need for wrapped tokens.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform an automatic cross-chain USDC transfer using Circle's CCTP protocol.

You will initiate the transfer on the source chain, and Wormhole's relayer will automatically handle Circle's attestation and redemption steps to complete the transfer on the destination chain.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
 - Wallets funded with native tokens and USDC on two [supported CCTP chains](/docs/products/reference/supported-networks/#cctp){target=\_blank}.

This example uses a Solana Devnet wallet with [USDC](https://faucet.circle.com/){target=\_blank} and [SOL](https://faucet.solana.com/){target=\_blank}, as well as a Base Sepolia wallet with testnet [ETH](https://www.alchemy.com/faucets/base-sepolia){target=\_blank}, to pay the transaction fees. You can adapt the steps to work with any [supported EVM chains](/docs/products/reference/supported-networks/#cctp){target=\_blank} that support CCTP.

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir cctp-bridge
    cd cctp-bridge
    npm init -y
    ```

2. Pin the SDK to specific dependency versions to ensure compatibility with the [CCTP executor routes](https://www.npmjs.com/package/@wormhole-labs/cctp-executor-route){target=\_blank}:

    ```bash
    npm pkg set overrides.@wormhole-foundation/sdk-aptos=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-base=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-connect=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-definitions=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-evm=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-solana=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-solana-cctp=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-sui=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-sui-cctp=4.0.2
    npm pkg set overrides.axios=1.11.0
    npm pkg set overrides.ethers=6.15.0
    ```

3. Install the required dependencies. This example uses the SDK version `{{repositories.wormhole_sdk.version}}`:

    ```bash
    npm install @wormhole-foundation/sdk@{{repositories.wormhole_sdk.version}} @wormhole-labs/cctp-executor-route
    npm install -D tsx typescript
    ```

4. Create a `transfer.ts` file to handle the multichain transfer logic and a `helper.ts` file to manage wallet signers:

    ```bash
    touch transfer.ts helper.ts
    ```

5. Set up secure access to your wallets. This guide assumes you are loading your `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a CCTP Transfer

This section walks you through a complete automatic USDC transfer using Wormhole's CCTP integration. You will initiate the transfer on Solana Devnet, and Wormhole's relayer will automatically handle the Circle attestation and finalize the redemption on Base Sepolia.

Start by defining utility functions for signer and token setup:

1. In `helper.ts`, define functions to load private keys and instantiate EVM signers:

    ```ts title="helper.ts"
    --8<-- "code/products/cctp-bridge/get-started/snippet-1.ts"
    ```

2. In `transfer.ts`, add the script to perform the automatic transfer using CCTP. Wormhole supports both CCTP v1 and [CCTP v2](https://www.circle.com/blog/cctp-v2-the-future-of-cross-chain){target=\_blank}, and the SDK provides executors for each version. See the [CCTP-supported executors](/docs/products/reference/executor-addresses/#cctp-with-executor){target=\_blank} to determine which version applies to your case:

    === "CCTP v1"

        ```ts title="transfer.ts"
        --8<-- "code/products/cctp-bridge/get-started/snippet-2.ts"
        ```

    === "CCTP v2"

        ```ts title="transfer.ts"
        --8<-- "code/products/cctp-bridge/get-started/snippet-3.ts"
        ```

3. Run the script to execute the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/products/cctp-bridge/get-started/snippet-4.html"

To verify the transaction and view its details, paste the transaction hash into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a CCTP USDC transfer using the Wormhole SDK, you're ready to explore more advanced features and expand your integration.

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Circle CCTP Documentation**

    ---

    Learn how USDC cross-chain transfers work and explore advanced CCTP features.

    [:custom-arrow: See the Circle Docs](https://developers.circle.com/cctp){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/){target=\_blank}

</div>
