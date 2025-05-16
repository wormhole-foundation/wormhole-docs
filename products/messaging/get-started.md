---
title: Get Started with Messaging
description: Follow this guide to use Wormhole SDK's core protocol to publish a multichain message and return transaction information with VAA identifiers.
categories: Basics, Typescript-SDK
---

# Get Started with Messaging

Wormhole's core functionality allows you to send any data packet from one supported chain to another. This guide will demonstrate publishing your first simple, arbitrary data message from an EVM environment source chain using the Wormhole TypeScript SDK's core messaging capabilities. 

## Prerequisites

Before you begin, ensure you have the following:

- Completed the [Get Started with the TypeScript SDK](/docs/tools/typescript-sdk/get-started){target=\_blank} guide. You should have a working project, the SDK installed, and an initialized `Wormhole` instance
- [`ethers.js`](https://docs.ethers.org/v6/getting-started/){target=\_blank} installed (this example uses version 6)
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for encrypting your private key
- A small amount of Sepolia ETH for gas fees. You can use the [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/){target=\_blank} if you need tokens

## Encrypt Your Private Key

Foundry supports multiple options for [creating a keystore](https://book.getfoundry.sh/reference/cast/cast-wallet-import){target=\_blank}. This example uses the `--privatekey` option. As long as you have a decryption password to enter when prompted, you can use your preferred options when creating your Foundry keystore.

1. Create a Foundry keystore to encrypt your wallet private key using the following command:

    ```bash
    cast wallet import INSERT_ACCOUNT_NAME --privatekey INSERT_PRIVATE_KEY
    ```

    The account name helps you differentiate between your saved keystores, so make it descriptive. You can use `cast wallet list` to see your saved accounts.


2. Enter the password you wish to use to decrypt your private key at the prompt. You will not see the password in the terminal as you type:

    ```bash
    Enter password: INSERT_DECRYPTION_PASSWORD
    ```

3. Select return to save your password, and you will see a success message confirming that the keystore was saved successfully. Keep this password. You will be prompted to enter it in the terminal when a wallet signature is required

## Sign Messages with Your Encrypted Key

1. Create a new file inside the `src` directory named `signMessage.ts`:

    ```bash
    touch signMessage.ts
    ```

2. Open `signMessage.ts` and add the following code:

    ```ts title="signMessage.ts"
    --8<-- "code/products/messaging/get-started/signMessage.ts"
    ```

## Construct and Publish Your Message

Now you can update `main.ts` to use your EVM signer, construct a message, and publish it to Sepolia. 

1. Open `main.ts` and update the code there as follows:

    ```ts title="main.ts"
    --8<-- "code/products/messaging/get-started/main.ts"
    ```

2. Run the script using the following command:

    ```bash
    npx tsx src/main.ts
    ```

    You will see terminal output similar to the following:

    --8<-- "code/products/messaging/get-started/terminal01.html"

3. Make a note of the transaction ID and VAA identifiers values. You can use the transaction ID to [view the transaction on Wormholescan](https://wormholescan.io/#/tx/0x98698539762d93d0c152b893b521688c61ec0b48b16559c6f5e2a09b975b09ca?network=Testnet){target=\_blank}. The emitter chain, emitter address, and sequence values are used to retrieve and decode signed messages.

Congratulations! You've published your first multichain message using Wormhole's TypeScript SDK and core protocol functionality. Consider the following options to build upon what you've accomplished. 

## Next Steps

- [Get Started with the Solidity SDK](/docs/tools/solidity-sdk/get-started/){target=\_blank} - follow this guide to create basic message sender and receiver contracts using the Wormhole Solidity SDK, deploy the contracts, and use them to send a message across blockchains

- [Fetch the Signed VAA](TODO WIP){target=\_blank} - whether your message is sent using core protocol or custom smart contracts, follow this guide to use your transaction information to fetch a signed VAA and decode the payload

