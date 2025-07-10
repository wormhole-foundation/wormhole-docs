---
title: Explore NTT Tokens and Transfers with WormholeScan API
description: Learn how to query Native Token Transfer (NTT) tokens and transfer operations using the WormholeScan API.
---

# Query NTT Data and Transfers with WormholeScan

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}

The [WormholeScan API](https://wormholescan.io/#/developers/api-doc){target=\_blank} provides a public interface for exploring cross-chain activity powered by Wormhole. You can use it to fetch token transfer operations, [Native Token Transfer (NTT)](/docs/products/native-token-transfers/overview/) metadata, VAA details, and more.

In this tutorial, you'll learn how to build a simple TypeScript project that:

 - Lists NTT tokens available on Wormhole
 - Fetches metadata for a selected token across chains
 - Retrieves recent transfer operations using an emitter address

This guide is useful if you're building a dashboard, writing monitoring tools, or simply want to explore how data flows across Wormhole-connected chains.

We'll start from scratch and write everything step by step, no API keys or wallets required.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally

## Project Setup

In this section, you will create the directory, initialize a Node.js project, install dependencies, and configure TypeScript.

1. **Create the project** - set up the directory and navigate into it

    ```bash
    mkdir wormhole-scan-api-demo
    cd wormhole-scan-api-demo
    ```

2. **Initialize a Node.js project** - generate a `package.json` file

    ```bash
    npm init -y
    ```

3. **Set up TypeScript** - create a `tsconfig.json` file

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json title="tsconfig.json"
    --8<-- "code/products/messaging/tutorials/replace-signatures/replace-sigs-1.json"
    ```

4. **Install dependencies** - add the required packages

    ```bash
    npm install @wormhole-foundation/sdk axios
    npm install -D tsx typescript @types/node
    ```

     - `@wormhole-foundation/sdk` – utility methods (e.g., chain ID helpers)
     - `axios` – HTTP client for calling the WormholeScan API
     - `tsx` – runs TypeScript files without compiling them
     - `typescript` – adds TypeScript support
     - `@types/node` – provides Node.js type definitions

5. **Create the project structure** - set up the required directories and files

    ```bash
    mkdir -p src/helpers src/scripts

    touch \
    src/helpers/api-client.ts \
    src/helpers/utils.ts \
    src/helpers/types.ts \
    src/scripts/fetch-ntt-tokens.ts \
    src/scripts/fetch-operations.ts
    ```

     - `src/helpers/` – contains shared API logic, utilities, and type definitions
     - `src/scripts/` – contains runnable scripts for fetching token and transfer data

