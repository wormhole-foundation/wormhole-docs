---
title: Query NTT Data and Transfers with Wormholescan
description: Learn how to use the Wormholescan API and Wormhole SDK to fetch NTT tokens and transfer data step by step using reusable TypeScript helpers.
---

# Query NTT Data and Transfers with Wormholescan

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}

The [Wormholescan API](https://wormholescan.io/#/developers/api-doc){target=\_blank} provides a public interface for exploring cross-chain activity powered by Wormhole. You can use it to fetch token transfer operations, [Native Token Transfer (NTT)](/docs/products/native-token-transfers/overview/) metadata, [VAA details](/docs/protocol/infrastructure/vaas/){target=\_blank}, and more.

In this guide, you will learn how to build a simple TypeScript project that:

 - Lists NTT tokens available on Wormhole.
 - Fetches metadata for a selected token across chains.
 - Retrieves recent transfer operations using an emitter address.

This guide is helpful if you are building a dashboard, writing monitoring tools, or want to explore how data flows across Wormhole-connected chains.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.

## Project Setup

In this section, you will create the directory, initialize a Node.js project, install dependencies, and configure TypeScript.

1. **Create the project**: set up the directory and navigate into it.

    ```bash
    mkdir wormholescan-api-demo
    cd wormholescan-api-demo
    ```

2. **Initialize a Node.js project**: generate a `package.json` file.

    ```bash
    npm init -y
    ```

3. **Set up TypeScript**: create a `tsconfig.json` file.

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json title="tsconfig.json"
    --8<-- "code/products/messaging/guides/wormholescan-api/whscan-1.json"
    ```

4. **Install dependencies**: add the required packages.

    ```bash
    npm install @wormhole-foundation/sdk axios
    npm install -D tsx typescript @types/node
    ```

     - `@wormhole-foundation/sdk`: utility methods (e.g., chain ID helpers).
     - `axios`: HTTP client for calling the Wormholescan API.
     - `tsx`: runs TypeScript files without compiling them.
     - `typescript`: adds TypeScript support.
     - `@types/node`: provides Node.js type definitions.

5. **Create the project structure**: set up the required directories and files.

    ```bash
    mkdir -p src/helpers src/scripts

    touch \
        src/helpers/api-client.ts \
        src/helpers/utils.ts \
        src/helpers/types.ts \
        src/scripts/fetch-ntt-tokens.ts \
        src/scripts/fetch-operations.ts
    ```

     - `src/helpers/`: contains shared API logic, utilities, and type definitions.
     - `src/scripts/`: contains runnable scripts for fetching token and transfer data.

## Create Helper Functions

Before writing scripts that interact with Wormholescan, we will define a few reusable helper modules. These will handle API calls, extract token and chain data, and provide consistent TypeScript types for working with NTT tokens and transfers.

These helpers will make it easier to write clean, focused scripts later on.

### Create a Wormholescan API Client

In this step, you will create a lightweight API client to interact with Wormholescan. This helper will enable you to easily fetch NTT tokens and perform token transfer operations using a reusable `get()` method with built-in error handling. The client supports both mainnet and testnet endpoints.

It exposes two core methods:

 - `getNTTTokens()`: fetches the complete list of NTT-enabled tokens.
 - `getTokenTransfers()`: fetches token transfer operations with optional filters (chain, address, pagination, etc.).

Under the hood, both methods use a generic `get(endpoint, params)` wrapper that handles URL construction and error reporting.

Add the following code to `src/helpers/api-client.ts`:

```typescript title="src/helpers/api-client.ts"
--8<-- "code/products/messaging/guides/wormholescan-api/whscan-2.ts"
```

### Add Utility Functions

Next, you will define two utility functions that help interpret NTT tokens and operations from Wormholescan:

 - `getRandomPlatform(token)`: selects a random platform for a given NTT token and returns its address and chain ID.
 - `getOperationStatus(operation)`: interprets the status of a token transfer operation (e.g., In Progress, Emitted, Completed).

These utilities will be used in later scripts to randomly select a chain/token combo and display the transfer status more clearly.

Add the following code to `src/helpers/utils.ts`:

```typescript title="src/helpers/utils.ts"
--8<-- "code/products/messaging/guides/wormholescan-api/whscan-3.ts"
```

### Define Types for NTT Tokens and Transfers

Before proceeding, let's define the TypeScript interfaces required for type-safe API responses from Wormholescan. These types will be used throughout the project to validate and work with token metadata and transfer operations.

Add the following content inside `src/helpers/types.ts`:

```typescript title="src/helpers/types.ts"
--8<-- "code/products/messaging/guides/wormholescan-api/whscan-4.ts"
```

## Fetch and Inspect NTT Tokens

In this step, you will create a script that fetches a list of NTT tokens from Wormholescan and inspects their detailed metadata.

The script does the following:

 - Retrieves all available NTT tokens via the API client.
 - Picks the first 5 with platform data.
 - Selects a random platform for each token (e.g., Ethereum, Arbitrum).
 - Fetches and logs metadata for that token on that platform.

You can control how many tokens are processed by modifying the `TOKENS_TO_PROCESS` constant near the top of the script.

Add the following code to `src/scripts/fetch-ntt-tokens.ts`:

```typescript title="src/scripts/fetch-ntt-tokens.ts"
--8<-- "code/products/messaging/guides/wormholescan-api/whscan-5.ts"
```

Run it with:

```bash
npx tsx src/scripts/fetch-ntt-tokens.ts
```

If successful, the output will be:

--8<-- "code/products/messaging/guides/wormholescan-api/whscan-6.html"

## Fetch Transfer Operations

Now, you will create a script to fetch NTT transfer operations using the Wormholescan API. These operations contain key details such as:

 - Source and target chains.
 - Wallet addresses.
 - Token amount and metadata.
 - VAA and execution status.

You will log the first few operations in a readable format to better understand how transfers are structured.

The script will use a specific emitter address to query transfers. You can easily change which token or manager you are tracking by modifying the `EMITTER_ADDRESS` constant near the top of the file.

Add the following code to `src/scripts/fetch-operations.ts`:

```typescript title="src/scripts/fetch-operations.ts"
--8<-- "code/products/messaging/guides/wormholescan-api/whscan-7.ts"
```

Run it with:

```bash
npx tsx src/scripts/fetch-operations.ts
```

If successful, the output will look like this:

--8<-- "code/products/messaging/guides/wormholescan-api/whscan-8.html"

## Resources

You can explore the complete project and find all necessary scripts and configurations in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}.

The repository includes everything covered in this guide, which is helpful for dashboards, bots, or alerting systems built on top of Wormholescan.