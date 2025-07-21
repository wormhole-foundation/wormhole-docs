---
title: Fetch a Signed VAA
description: Learn how to fetch a signed VAA, a key step in the Token Bridge manual transfer flow.
categories: Token-Bridge, Transfer
---

# Fetch a Signed VAA

This guide demonstrates how to fetch a signed [Verified Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}, first programmatically using the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}, then manually using the [Wormholescan](https://wormholescan.io/){target=\_blank} explorer. VAA retrieval is a key step in manual messaging and transfer flows. Knowing how to locate a relevant VAA can also help with debugging and monitoring transactions while building out your integration.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=_blank}
- [TypeScript](https://www.typescriptlang.org/download/){target=_blank} (installed globally)

## Set Up Your Developer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment:

1. Create a new directory and initialize a Node.js project using the following commands:

    ```bash
    mkdir fetch-vaa
    cd fetch-vaa
    npm init -y
    ```

2. Install dependencies, including the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}:

   ```bash
   npm install @wormhole-foundation/sdk -D tsx typescript
   ```

## Fetch VAA via TypeScript SDK

Follow these steps to search for and retrieve a VAA using the TypeScript SDK:

1. Create a new file called `fetch-vaa.ts` using the following command:

    ```bash
    touch fetch-vaa.ts
    ```

2. Open your `fetch-vaa.ts` file and add the following code:

    ```typescript title="fetch-vaa.ts"
    --8<-- 'code/products/token-bridge/guides/fetch-signed-vaa/fetch-vaa.ts'
    ```

    This code does the following:

    - Initializes a Wormhole instance with the same `network` and `platform` as the source chain transfer transaction.
    - Accepts the transaction ID from the source chain transfer transaction.
    - Prints the associated `chain`, `emitter`, `sequence`, and VAA bytes to the terminal.
    - Returns the `vaa` object for any further processing.

3. Run the script with the following command:

    ```bash
    npx tsx fetch-vaa.ts
    ```

4. You will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/fetch-signed-vaa/terminal-1.html'

## Fetch VAA via Wormholescan

You can also use [Wormholescan's](https://wormholescan.io/){target=\_blank} UI to manually search for a VAA using the source transaction ID, VAA ID, or a wallet address. This type of quick search is helpful during debugging or testing of your integration. Follow these steps to fetch a VAA using Wormholescan:

1. On [Wormholescan](https://wormholescan.io/){target=\_blank}, use the dropdown menu in the top right corner to select either **Mainnet** or **Testnet**.

2. Enter your transaction ID in the search bar and select "return" or "enter" to submit your search request. Alternatively, you can enter the wallet address of the transaction signer and return any transactions under that account.

    ![](/docs/images/products/token-bridge/guides/fetch-vaa/fetch-vaa-1.webp)

3. Inspect the returned search results. Note that the source transaction ID, current status, transaction details, and the VAA ID are included.

    ![](/docs/images/products/token-bridge/guides/fetch-vaa/fetch-vaa-2.webp)

Congratulations! You've now fetched a signed VAA using both the TypeScript SDK and Wormholescan UI. These skills are valuable when developing manual transfer or messaging processes, as well as debugging and testing an integration build. 

<!-- ## Next Steps

- [**Redeem Signed VAA to Complete Transfer**](/docs/products/token-bridge/guides/fetch-signed-vaa/): Follow this guide to submit a signed VAA that verifies a source chain transfer transaction to the destination chain, completing a manual transfer flow and releasing the tokens to the intended recipient.
- [**Transfer Assets with TypeScript**](/docs/products/token-bridge/guides/transfer-wrapped-assets/): This guide takes you through the Token Bridge transfer flow end-to-end for moving wrapped assets across blockchains, including both automatic and manual transfers. -->