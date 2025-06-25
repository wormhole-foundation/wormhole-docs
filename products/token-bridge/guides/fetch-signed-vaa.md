---
title: Fetch a Signed VAA
description: Learn how to fetch a signed VAA, a key step in the Token Bridge manual transfer flow.
categories: Token-Bridge, Transfer
---

# Fetch a Signed VAA

This guide demonstrates fetching a signed VAA, first programmatically using the TypeScript SDK, then manually using the [Wormholescan](https://wormholescan.io/){target=\_blank} explorer. VAA retrieval is a key step in manual messaging and transfer flows. Knowing how to locate a relevant VAA can also help with debugging and monitoring transactions while building out your integration.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.

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

This example fetches a singed VAA for a known token transfer transaction using its source chain transaction ID. It prints the `chain`, `emitter`, and `sequence` values from the VAA ID and the VAA bytes to the terminal and returns the `vaa` object for any further processing. 

