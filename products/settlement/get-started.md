---
title: Get Started
description: Learn how to integrate Wormhole Settlement Routes using the SDK to simplify cross-chain swaps, manage fees, and execute seamless transactions.
categories: Settlement, Transfer
---

# Get Started

## Introduction

[Wormhole Settlement](/docs/products/settlement/overview/){target=\_blank} is Wormhole’s intent-based execution layer for fast, cross-chain asset movement. This guide walks you through using the [Mayan Swift route](https://mayan.finance){target=_blank}, one of three integrated Settlement protocols, to initiate a token swap between two chains.

We'll use the [demo-mayanswift](https://github.com/wormhole-foundation/demo-mayanswift){target=_blank} project to set up and execute a live swap using the Wormhole SDK.

!!! note
    Mayan Swift currently supports **mainnet only**. Attempting to run this demo on testnet will result in failure.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- A wallet with a private key, funded with native tokens on mainnet for gas fees

## Project Setup

1. **Clone the demo repository**

    ```bash
    git clone https://github.com/wormhole-foundation/demo-mayanswift
    cd demo-mayanswift
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**: set up secure access to your wallets. This guide assumes you are loading your `SOL_PRIVATE_KEY` and `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like cast wallet.

    !!! warning
        If you use a .env file during development, add it to your .gitignore to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Mayan Swift Swap

To initiate a token transfer across chains, using the Mayan Swift Route run:

```bash
npm run swap
```

## Customize the Integration

You can tailor the example to your use case by adjusting:

- **Tokens and chains** – use `getSupportedTokens()` to explore what's available
- **Transfer settings** – update the amount or route parameters
- **Signer management** – modify `src/helpers.ts` to integrate with your preferred wallet setup
- **Source and destination chains**: modify `sendChain` and `destChain` in `swap.ts`
- **Amount and transfer settings**: adjust amount to suit your needs

## Next Steps

Once you've chosen a path, follow the corresponding guide to start building:

- [**Integrate with Liquidity Layer**](/docs/products/settlement/guides/liquidity-layer/){target=\_blank} – interact directly with routers for flexible protocol-level control
- [**Use Mayan Swift with the SDK**](TODO){target=\_blank} – plug into Settlement using the [TypeScript SDK](https://www.npmjs.com/package/@wormhole-foundation/sdk){target=\_blank} for rapid integration