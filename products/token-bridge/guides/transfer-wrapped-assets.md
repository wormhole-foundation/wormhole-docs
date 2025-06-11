---
title: Transfer Wrapped Assets
description: This guide covers Token Bridge's manual transfer flow to verify token registration, attest a custom token, fetch a VAA, and complete manual redemption.
categories: Token-Bridge, Transfers, Typescript-SDK
---

# Transfer Wrapped Assets

## Introduction

This guide demonstrates the transfer of wrapped assets using the core Token Bridge protocol via the TypeScript SDK. This example will transfer an arbitrary ERC-20 token from Moonbase Alpha to Ethereum Sepolia but can be adapted for any supported EVM chains. View this list of chains with [deployed Token Bridge contracts](/products/reference/contract-addresses/#token-bridge){target=\_blank} to verify if your desired source and destination chains are supported.

Completing this guide will help you to accomplish the following:

- Verify if a wrapped version of a token exists on a destination chain
- Create a token attestation to register a wrapped version of a token on a destination chain
- Transfer wrapped assets using Token Bridge manual transfer
- Fetch a signed Verified Action Approval (VAA)
- Manually redeem a signed VAA to claim tokens on a destination chain

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally
- The contract address for the ERC-20 token you wish to transfer
- A wallet setup with the following:
  - Private keys for your source and destination chains
  - A small amount of gas tokens on your source and destination chains
  - A balance on your source chain of the ERC-20 token you want to transfer

## Set Up Your Token Transfer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment for multichain token transfers.

1. Create a new directory and initialize a Node.js project using the following commands:
   ```bash
   mkdir token-bridge-demo
   cd token-bridge-demo
   npm init -y
   ```

2. Install dependencies, including the Wormhole TypeScript SDK:
   ```bash
   npm install @wormhole-foundation/sdk ethers -D tsx typescript
   ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create an `src` directory, navigate into it, then create a new file named `helpers.ts` to hold signer functions:
   ```bash
   mkdir src && cd src
   touch helpers.ts
   ```

5. Open `helpers.ts` and add the following code:
    ```typescript title="helpers.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/helpers.ts'
    ```

### Wormhole Signer versus Ethers Wallet

When working with the Wormhole SDK on EVM-compatible chains, developers often encounter two types of signers:

- [**`Signer`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a86f8f93953cdb67ba26c78435b9d539282065f2/core/definitions/src/signer.ts#L12){target=\_blank}: a Wormhole compatible signer designed to be compatible with the Wormhole SDK abstractions, particularly for transaction batching and message parsing. Use the Wormhole `Signer` when:
    - Passing a signer into Wormhole SDK helper methods, like `signSendWait()`
    - Creating or submitting transactions using `TokenBridge`, `CoreBridge`, or other Wormhole protocol modules
    - Calling methods that require Wormhole's internal `Signer` type, which can be a `SignOnlySigner` or `SignAndSendSigner`

- [**`ethers.Wallet`**](https://docs.ethers.org/v6/api/wallet/){target=\_blank} from Ethers.js: Wormhole's `Signer` often doesn't expose low-level methods like `sendTransaction()`, which you might need for manual control. Use the Ethers `Wallet` when:
    - You need to manually sign and send EVM transactions (`wallet.sendTransaction()`)
    - You're interacting directly with smart contracts using `ethers.Contract`
    - You want complete control over gas, nonce, or transaction composition

## Verify Token Registration (Attestation)

Tokens must be registered on the destination chain before they can be bridged. This process includes submitting an attestation with the native token metadata to the destination chain. This attestation allows the destination chain Token Bridge contract to create a corresponding wrapped version with the same attributes as the native token.

Registration via attestation is only required the first time a given token is sent to that specific destination chain. Your transfer script should include a check for an existing wrapped version of the token on your destination chain. Follow these steps to check the registration status of a token:

1. Inside your `src` directory, create a new file named `transfer.ts`:
   ```bash
   touch transfer.ts
   ```

2. Open your `transfer.ts` file and add the following code:
    ```typescript title="transfer.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:1:91'
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:139:142'
    ```

    This code does the following:

    - Initializes a `wormhole` instance and defines the source and destination chains
    - Imports the signer and wallet functions from `helpers.ts`
    - Identifies the token to transfer and verifies the token balance in the source wallet
    - Gets the `TokenBridge` protocol client for the source chain
    - Checks to see if a wrapped version of the ERC-20 token to transfer exists on the destination chain

3.  Run the script using the following command:

    ```bash
    npx tsx transfer.ts
    ```

    If the token is registered on the destination chain, the address of the existing wrapped asset is returned, and you can continue to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain. If the token is not registered, you will see a message similar to the following advising attestation is required:

    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal01.html'

    ??? example "Need to register a token?"
        Token attestation is a one-time process to register a token on a destination chain. You should only follow these steps if your token registration check indicates a wrapped version does not exist on the destination chain.

        1. Inside the `src` directory, create a new file named `attestToken.ts`:

            ```bash
            touch attestToken.ts
            ```

        2. Open the new file and add the following code:

            ```typescript title="attestToken.ts"
            --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/attestToken.ts'
            ```

            This code does the following:
        
            - Initializes a `wormhole` instance and defines the source and destination chains for the transfer 
            - Imports your signer and wallet functions from `helpers.ts`
            - Identifies the token to attest for registration on the destination chain
            - Gets the Token Bridge protocol for the source chain and sends the `createAttestation` transaction there
            - Waits for the signed VAA confirming the attestation creation
            - Sends the VAA to the destination chain to complete registration

        3. Run the script with the following command:
            
            ```bash
            npx tsx attestToken.ts
            ```

            When the attestation and registration are complete, you will see terminal output similar to the following:

            --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal02.html'

        You can now go on to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain.

## Initiate Transfer on Source Chain

Follow these steps to add the rest of the logic to initiate the token transfer on the source chain:

1. Open your `transfer.ts` file and replace the commented line "// Additional transfer code" with the following code:

    ```typescript title="transfer.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:92:138'
    ```

    This code does the following:

    - Uses the supplied [Token Bridge contract address](https://wormhole.com/docs/build/reference/contract-addresses/#token-bridge){target=\_blank} to approve spending the ERC-20 token in the amount you want to transfer
    - Calls the `transfer()` method to initiate the transfer on the source chain
    - Watches for the transaction, parses the transaction ID to read the Wormhole message, and waits for the Guardians to sign the VAA verifying the transaction
    - Fetches the VAA and writes it to a file named `vaa.bin`, which will be used to redeem the transfer and claim the tokens on the destination chain

2. Run the script with the following command:
    ```bash
    npx tsx transfer.ts
    ```

3. You will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal03.html'

## Redeem Transfer on Destination Chain

The final step to complete a manual transfer with Token Bridge is to submit the signed VAA from your transfer transaction to the destination chain. The signed VAA provides Guardian-backed confirmation of the tokens locked in the token bridge contract on the source chain, allowing a matching amount of tokens to be minted on the destination chain. 

Follow these steps to redeem your transfer on the destination chain:

1. Inside the `src` directory, create a file named `redeem.ts`:
    ```bash
    touch redeem.ts
    ```

2. Open the file and add the following code:
    ```typescript title="redeem.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/redeem.ts'
    ```

    This code does the following:

    - Fetches the raw VAA bytes from the `vaa.bin` file
    - Initializes a `wormhole` instance and gets the destination chain context
    - Parses the VAA, gets the signer and Token Bridge protocol for the destination chain
    - Calls `redeem()` and signs the transaction for the recipient to claim the tokens
    - Returns the destination chain transaction ID for the successful redemption

3. Run the script with the following command:
    ```bash
    npx tsx redeem.ts
    ```

4. You will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal04.html'

Congratulations! You've now completed a manual Token Bridge transfer using the Wormhole TypeScript SDK. Consider the following options to build upon what you've achieved. 

## Next Steps

TODO: link to Solana/Sui end-to-end guide(s) to see how manual transfer is different for those platforms

TODO: links to individual Token Bridge guides: Register/Attest, Fetch Signed VAA, Redeem Signed VAA