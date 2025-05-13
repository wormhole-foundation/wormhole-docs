---
title: Sign EVM Transactions
description: Follow this guide to create browser wallet and script-based blockchain signers to approve EVM environment transactions for your Wormhole integration.
categories: Typescript-SDK
---

This guide demonstrates how to create and configure `Signer` objects compatible with the Wormhole TypeScript SDK for authorizing transactions on EVM environment blockchains. 

The Wormhole TypeScript SDK uses a [`Signer` interface](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/cdd396dce34ab5e1862f31cafe11b6be5c5ca715/core/definitions/src/signer.ts){target=\_blank} to interact consistently across different chains and wallet types. Functions that initiate on-chain actions will require a configured signer object. 

The interface includes the following main types of signers:

- **`SignOnlySigner`** - can sign transaction data but doesn't broadcast. This signer is useful for offline signing or when another service handles transaction submission
- **`SignAndSendSigner`** - can both sign and broadcast the transaction to the network 

## Prerequisites

Before you begin, make sure you have the following:

- Completed the [Get Started with the Typescript SDK](tools/typescript-sdk/get-started){target=\_blank} guide including installation of Node.js, npm, and the Wormhole SDK
- An RPC endpoint URL for each chain you want to support
- Installed [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} to create a keystore to encrypt your private keys

## Sign with a Browser Wallet

The Wormhole SDK signer typically wraps or utilizes signer objects from the `ethers.js` library for EVM environment networks. Run the following command to install `ethers.js`:

```bash
npm install ethers
```

## Sign with an Encrypted Private Key


## Use Your Signer with the Wormhole TS SDK

