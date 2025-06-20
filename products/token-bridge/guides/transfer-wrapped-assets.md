---
title: Transfer Wrapped Assets
description: Follow this guide to use Token Bridge to transfer wrapped assets. Includes automatic and manual flows, token attestation, VAA fetching, and manual redemption.
categories: Token-Bridge, Transfers, Typescript-SDK
---

# Transfer Wrapped Assets

## Introduction

This guide demonstrates the transfer of wrapped assets using the Token Bridge protocol via the [TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}. This example will transfer an arbitrary ERC-20 token from Moonbase Alpha to Solana but can be adapted for any supported chains. View this list of chains with [deployed Token Bridge contracts](/docs/products/reference/contract-addresses/#token-bridge){target=\_blank} to verify if your desired source and destination chains are supported.

Completing this guide will help you to accomplish the following:

- Verify if a wrapped version of a token exists on a destination chain
- Create a token attestation to register a wrapped version of a token on a destination chain
- Transfer wrapped assets using Token Bridge automatic or manual transfers
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
   npm install @wormhole-foundation/sdk -D tsx typescript
   ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create a new file named `helpers.ts` to hold signer and decimal functions:
   ```bash
   touch helpers.ts
   ```

5. Open `helpers.ts` and add the following code:
    ```typescript title="helpers.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/helpers.ts'
    ```

    You can view the [constants for platform names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/3eae2e91fc3a6fec859eb87cfa85a4c92c65466f/core/base/src/constants/platforms.ts#L6){target=\_blank} in the GitHub repo for a list of supported platforms

## Verify Token Registration (Attestation)

Tokens must be registered on the destination chain before they can be bridged. This process involves submitting an attestation with the native token metadata to the destination chain, which enables the destination chain's Token Bridge contract to create a corresponding wrapped version with the same attributes as the native token.

Registration via attestation is only required the first time a given token is sent to that specific destination chain. Follow these steps to check the registration status of a token:

1. Create a new file named `transfer.ts`:
   ```bash
   touch transfer.ts
   ```

2. Open your `transfer.ts` file and add the following code:
    ```typescript title="transfer.ts"
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:1:47'
    // Token attestation and registration flow here if needed
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:127:127'
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:169:174'
    ```

    This code does the following:

    - Initializes a `wormhole` instance and defines the source and destination chains
    - Imports the signer and decimal functions from `helpers.ts`
    - Identifies the token and amount to transfer
    - Checks to see if a wrapped version of the ERC-20 token to transfer exists on the destination chain

3. Run the script using the following command:

    ```bash
    npx tsx transfer.ts
    ```

    If the token is registered on the destination chain, the address of the existing wrapped asset is returned, and you can continue to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain. If the token is not registered, you will see a message similar to the following advising the attestation flow will run:

    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal01.html'

    If you see this message, follow the steps under "Need to register a token?" before continuing with the rest of the transfer flow code.

    ??? example "Need to register a token?"
        Token attestation is a one-time process to register a token on a destination chain. You should only follow these steps if your token registration check indicates a wrapped version does not exist on the destination chain.

        1. Add the following code to `transfer.ts` to create the attestation for token registration:
            ```typescript title="transfer.ts"
            // Token attestation and registration flow here if needed
            --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:48:127'
            // Remainder of transfer code 
            --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:171:174'
            ```

            This code does the following:
        
            - Gets the Token Bridge protocol for the source chain
            - Defines the token to attest for registration on the destination chain and the payer to sign for the transaction
            - Calls `createAttestation`, signs, and then sends the transaction
            - Waits for the signed VAA confirming the attestation creation
            - Sends the VAA to the destination chain to complete registration
            - Polls for the wrapped token to be available on the destination chain before continuing the transfer process

        3. Run the script with the following command:
            
            ```bash
            npx tsx transfer.ts
            ```

            When the attestation and registration are complete, you will see terminal output similar to the following:

            --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal02.html'

        You can now go on to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain.

## Initiate Transfer on Source Chain

Follow these steps to add the rest of the logic to initiate the token transfer on the source chain:

1. Open your `transfer.ts` file and add the following code:

    ```typescript title="transfer.ts"
    // Remainder of transfer code 
    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/transfer01.ts:129:174'
         
    ```

    This code does the following:

    - Defines the transfer as automatic or manual. To use automatic transfer, both the source and destination chain must have an existing `tokenBridgeRelayer` contract. You can check the list of [deployed `tokenBridgeRelayer` contracts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/core/base/src/constants/contracts/tokenBridgeRelayer.ts){target=\_blank} in the Wormhole SDK repo to see if your desired chains are supported
    - Sets an optional amount for native gas drop-off. This option allows you to send a small amount of the destination chain's native token for gas fees. Native gas drop-off is currently only supported for automatic transfers
    - Builds the transfer object, initiates the transfer, signs and sends the transaction
    - If the transfer is automatic, the flow ends. Otherwise, the script waits for the signed VAA confirming the transaction on the source chain. The signed VAA is then submitted to the destination chain to claim the tokens and complete the manual transfer

2. Run the script with the following command:
    ```bash
    npx tsx transfer.ts
    ```

3. You will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/transfer-wrapped-assets/terminal03.html'

Congratulations! You've now used Token Bridge to transfer wrapped assets using the Wormhole TypeScript SDK. Consider the following options to build upon what you've achieved. 

## Next Steps

- [**Portal Bridge**](https://portalbridge.com/){target=\_blank}: visit this site to interact with Wormhole's Portal Bridge featuring a working Token Bridge integration.
- [**Interact with Token Bridge Contracts**](/docs/products/token-bridge/guides/token-bridge-contracts/): this guide explores the Solidity functions used in Token Bridge contracts.
- [**`TokenBridge` and `AutomaticTokenBridge` interfaces**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}: view the source code defining these key interfaces and their associated namespaces.