---
title: Settlement with Mayan Swift
description: Learn how to integrate Wormhole Settlement Routes using the SDK to simplify cross-chain swaps, manage fees, and execute seamless transactions.
---

# Integrate Mayan Swift Routes using the SDK

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank}

## Introduction

This tutorial explains how to integrate the Wormhole Mayan Swift Route from the Wormhole SDK into your application. This Route abstracts the complexity of cross-chain token swaps, handling route discovery, fee estimation, and transaction construction.

[Mayan Swift](https://mayan.finance/){target=\_blank} s a cross-chain swap auction protocol that simplifies bridging and swapping tokens across blockchains to offer the best swap rates using an auction mechanism.

!!!note
    Mayan Swift currently supports **MainNet** only. Attempting to run the demo on testnet will result in failure.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A wallet with a private key, funded with native tokens on mainnet for gas fees

## Project Setup

To get started, you’ll first clone the repository, install dependencies, and configure environment variables. Once set up, you can initiate a cross-chain token swap using the Mayan Swift Route.

1. **Clone the repository**

    ```bash
    git clone https://github.com/wormhole-foundation/demo-mayanswift.git
    cd demo-mayanswift
    ```

1. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private keys.

    ```env
    ETH_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SOL_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    ```

## Configuration

You can customize the following options within the scripts:

- **Source and destination chains** - modify `sendChain` and `destChain` in `swap.ts`
- **Amount and transfer settings** - adjust `amount` to suit your needs

## Mayan Swift Swap

To initiate a token transfer across chains, using the Mayan Swift Route run:

```bash
npm run swap
```

## Troubleshooting

- **Missing environment variables** - ensure `.env` is correctly set up and keys are valid
- **Unsupported platform error** - verify that the chains are compatible and supported by the Wormhole SDK