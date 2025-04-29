---
title: Get Started
description: Install the Wormhole TypeScript SDK, initialize a basic project, and connect to supported chains using a minimal cross-chain script.
categories: Typescript-SDK
---

# Get Started

## Introduction

The Wormhole TypeScript SDK provides a unified, type-safe interface for building cross-chain applications. It is a foundational toolkit that supports interaction with core Wormhole protocols—including Token Bridge, CCTP, and Settlement—giving developers a consistent API across multiple chains.

This guide helps you install the SDK, set up a minimal project, and explore key SDK capabilities by logging a Wormhole chain ID and inspecting a Token Bridge contract.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](){target=\_blank}
 - [TypeScript](){target=\_blank} 
 
## Set Up Your Project

1. **Initialize a new project directory** - create a directory and initialize a Node.js project

    ```bash
    mkdir wh-ts-demo
    cd wh-ts-demo
    npm init -y
    ```

2. **Install the Wormhole TypeScript SDK and helpers** - add the SDK and common utilities


    ```bash
    npm install @wormhole-foundation/sdk
    npm install dotenv tsx
    ```

## Try the SDK

Explore two minimal examples to validate your setup and familiarize yourself with the SDK: log a chain ID and inspect a deployed protocol contract.

### Log a Chain ID

The Wormhole TypeScript SDK provides a unified way to access metadata for supported chains. One of the simplest ways to verify everything is working is to fetch and print a Wormhole chain ID.

1. Create a new file named `hello.ts`:

    ```bash
    touch hello.ts
    ```

2. Import the SDK, initialize it in `Testnet`, retrieve the context for Ethereum, and log its Wormhole chain ID:

    ```ts
    --8<-- "code/tools/typescript-sdk/get-started/snippet-1.ts"
    ```

3. Run the script:

    ```bash
    npx tsx hello.ts
    ```

???- code "Expected output"
    ```bash
    Wormhole chain ID for Ethereum: 2
    ```

### Inspect a Token Bridge Contract

Access contract instances for Wormhole protocols like the Token Bridge. You can inspect contract addresses and available functions with just a few lines.

1. Create a new file named `token-bridge.ts`:

    ```bash
    touch token-bridge.ts
    ```

2. Initialize the SDK on Testnet, get the Ethereum chain context, and fetch the deployed Token Bridge contract to inspect its address and available functions:

    ```ts
    --8<-- "code/tools/typescript-sdk/get-started/snippet-2.ts"
    ```

3. Run the script:

    ```bash
    npx tsx token-bridge.ts
    ```

???- code "Expected output"
    ```bash
    Wormhole chain ID for Ethereum: 2
    ```

## Next Steps

Now that you’ve successfully used the SDK to interact with a supported chain and one of Wormhole’s core contracts, you’re ready to build more advanced functionality.

 - [Understand Wormhole Chains](){target=\_blank} – view the list of supported networks and their Wormhole chain IDs
 - [Use the SDK for Transfers](){target=\_blank} – move tokens cross-chain using the Token Bridge protocol
 - [SDK Reference](){target=\_blank} – dive into the full API surface of the Wormhole SDK