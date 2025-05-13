---
title: Sign EVM Transactions
description: Follow this guide to create a blockchain signer to approve EVM environment blockchain transactions for your Wormhole integration.
categories: Typescript-SDK
---

This guide demonstrates how to create a `Signer` object compatible with the Wormhole TypeScript SDK for authorizing transactions on EVM environment blockchains. 

The Wormhole TypeScript SDK uses a [`Signer` interface](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/cdd396dce34ab5e1862f31cafe11b6be5c5ca715/core/definitions/src/signer.ts){target=\_blank} to interact consistently across different chains and wallet types. Functions that initiate on-chain actions will require a configured signer object. 

The interface includes the following main types of signers:

- **`SignOnlySigner`** - can sign transaction data but doesn't broadcast. This signer is useful for offline signing or when another service handles transaction submission
- **`SignAndSendSigner`** - can both sign and broadcast the transaction to the network 

## Prerequisites

Before you begin, make sure you have the following:

- Completed the [Get Started with the Typescript SDK](tools/typescript-sdk/get-started){target=\_blank} guide. This guide assumes you have already started a project, installed the Wormhole SDK, added supported platforms, and initialized Wormhole
- An RPC endpoint URL for each EVM environment chain you want to support. Default public RPCs are built in for some read operations; however, you will want to provide an RPC URL for submitting transactions via backend signers
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} installed to encrypt your private key for use in the backend signer

## Encrypt Your Private Key

1. If you haven't already done so, run Foundryup from the root of your project to install the `cast` binary:

    ```bash
    foundryup
    ```

2. Create a Foundry keystore to encrypt your wallet private key using the following command. The account name helps differentiate between multiple encrypted keystores, so make it descriptive such as the name of the environment ("EVM"), chain ("SEPOLIA"), or role ("EVM_SIGNER"):

    ```bash
    cast wallet import INSERT_ACCOUNT_NAME --privatekey INSERT_PRIVATE_KEY
    ```

3. Enter the password you wish to use to decrypt your private key at the prompt. You will not see the password in the terminal as you type:
    
    ```bash
    Enter password: INSERT_DECRYPTION_PASSWORD
    ```

4. Select return to save your password, and you will see a success message confirming that the keystore was saved successfully. Keep this password. You will be prompted to enter it in the terminal when a wallet signature from this account is required

Foundry supports multiple options for [creating a keystore](https://book.getfoundry.sh/reference/cast/cast-wallet-import){target=\_blank}. This example uses the `--privatekey` option. As long as you have a decryption password to enter when prompted, you can use your preferred options when creating your Foundry keystore.

## Create EVM Signer Using Encrypted Keystore






