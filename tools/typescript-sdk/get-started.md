---
title: Get Started
description: Install the Wormhole TypeScript SDK, initialize a basic project, and connect to supported chains using a minimal cross-chain script.
categories: Typescript-SDK
---

# Get Started

## Introduction

The Wormhole TypeScript SDK provides a unified, type-safe interface for building cross-chain applications. It is a foundational toolkit that supports interaction with core Wormhole protocols—including Token Bridge, CCTP, and Settlement—giving developers a consistent API across multiple chains.

This guide helps you install the SDK, initialize a basic project, and run a minimal script to connect to a supported chain and retrieve its Wormhole chain ID.

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

### Log a Chain ID

The Wormhole TypeScript SDK provides a unified way to access metadata for supported chains. One of the simplest ways to verify everything is working is to fetch and print a Wormhole chain ID.

1. Create a new file named `hello.ts`:

    ```bash
    touch hello.ts
    ```

2. Import the SDK, initialize it in `Testnet`, retrieve the context for Ethereum, and log its Wormhole chain ID:

    ```ts
    import { Wormhole } from "@wormhole-foundation/sdk";

    const wh = await Wormhole.init("Testnet");
    const chain = wh.getChain("Ethereum");

    console.log("Wormhole chain ID for Ethereum:", chain.chainId);
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

The SDK provides access to contract instances for Wormhole protocols like the Token Bridge. With just a few lines, you can inspect contract addresses and available functions.

1. Create a new file named `token-bridge.ts`:

    ```bash
    touch token-bridge.ts
    ```

2. Initialize the SDK on Testnet, get the Ethereum chain context, and fetch the deployed Token Bridge contract to inspect its address and available functions:

    ```ts
    import { Wormhole } from "@wormhole-foundation/sdk";

    const wh = await Wormhole.init("Testnet");
    const eth = wh.getChain("Ethereum");
    const tokenBridge = await eth.getTokenBridge();

    console.log("Token Bridge address:", tokenBridge.address);
    console.log("Contract functions:", Object.keys(tokenBridge.contract.methods));
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