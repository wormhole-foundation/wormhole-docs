---
title: Token Attestation
description: Create and submit a token attestation to register a token for transfer with Token Bridge using the TypeScript SDK. Required before first-time transfers.
categories: Token-Bridge, Transfer
---

# Token Attestation

This guide demonstrates token attestation for registering a token for transfer using the [Token Bridge](/docs/products/token-bridge/overview) protocol. An attestation of the token's metadata (e.g., symbol, name, decimals) ensures consistent handling by the destination chain for ease of multichain interoperability. These steps are only required the first time a token is sent to a particular destination chain.

Completing this guide will help you to accomplish the following:

- Verify if a wrapped version of a token exists on a destination chain.
- Create and submit token attestation to register a wrapped version of a token on a destination chain.
- Check for the wrapped version to become available on the destination chain and return the wrapped token address.

The example will register an arbitrary ERC-20 token deployed to Moonbase Alpha for transfer to Solana but can be adapted for any supported chains.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
- The contract address for the token you wish to register.
- A wallet setup with the following:
    - Private keys for your source and destination chains.
    - A small amount of gas tokens on your source and destination chains.

## Set Up Your Developer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment for token attestation.

1. Create a new directory and initialize a Node.js project using the following commands:
   ```bash
   mkdir attest-token
   cd attest-token
   npm init -y
   ```

2. Install dependencies, including the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}:
   ```bash
   npm install @wormhole-foundation/sdk -D tsx typescript
   ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create a new file named `helper.ts` to hold signer functions:
   ```bash
   touch helper.ts
   ```

5. Open `helper.ts` and add the following code:
    ```typescript title="helper.ts"
    --8<-- 'code/products/token-bridge/guides/attest-tokens/helper.ts'
    ```

    You can view the [constants for platform names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/3eae2e91fc3a6fec859eb87cfa85a4c92c65466f/core/base/src/constants/platforms.ts#L6){target=\_blank} in the GitHub repo for a list of supported platforms

## Check for Wrapped Version

If you are working with a newly created token that you know has never been transferred to the destination chain, you can continue to the [Create Attestation on the Source Chain](#create-attestation-on-the-source-chain) section.

Since attestation is a one-time process, it is good practice when working with existing tokens to incorporate a check for wrapped versions into your Token Bridge transfer flow. Follow these steps to check for a wrapped version of a token:

1. Create a new file called `attest.ts` to hold the wrapped version check and attestation logic:
    ```bash
    touch attest.ts
    ```

2. Open `attest.ts` and add the following code:
    ```typescript title="attest.ts"
    --8<-- 'code/products/token-bridge/guides/attest-tokens/attest.ts:1:37'
    --8<-- 'code/products/token-bridge/guides/attest-tokens/attest.ts:120:126'
    ```

    After initializing a Wormhole instance and defining the source and destination chains, this code does the following:

    - **Defines the token to check**: use the contract address on the source chain for this value.
    - **Calls `getWrappedAsset`**: part of the [`Wormhole` class](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/connect/src/wormhole.ts#L47){target=\_blank}, the [`getWrappedAsset`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/connect/src/wormhole.ts#L205){target=\_blank} method:
        - Accepts a [`TokenId`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/platforms/aptos/protocols/tokenBridge/src/types.ts#L12){target=\_blank} representing a token on the source chain.
        - Checks for a corresponding wrapped version of the destination chain's Token Bridge contract.
        - Returns the `TokenId` for the wrapped token on the destination chain if a wrapped version exists.

3. Run the script using the following command:
    ```bash
    npx tsx attest.ts
    ```

4. If the token has a wrapped version registered with the destination chain Token Bridge contract, you will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/attest-tokens/terminal01.html'

    You can safely use Token Bridge to transfer this token to the destination chain.

    If a wrapped version isn't found on the destination chain, your terminal output will be similar to the following and you must attest the token before transfer:

    --8<-- 'code/products/token-bridge/guides/attest-tokens/terminal02.html'

## Create Attestation on the Source Chain

To create the attestation transaction on the source chain, open `attest.ts` and replace the "// Attestation flow code" comment with the following code:
```typescript title="attest.ts"
--8<-- 'code/products/token-bridge/guides/attest-tokens/attest.ts:39:57'
```

This code does the following:

- **Gets the source chain Token Bridge context**: this is where the transaction is sent to create the attestation.
- Defines the token to attest and the payer.
- **Calls `createAttestation`**: defined in the [`TokenBridge` interface](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L123){target=\_blank}, the [`createAttestation`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L188){target=\_blank} method does the following:
    - Accepts a `TokenAddress` representing the token on its native chain.
    - Accepts an optional `payer` address to cover the transaction fees for the attestation transaction.
    - Prepares an attestation for the token including metadata such as address, symbol, and decimals.
    - Returns an `AsyncGenerator` that yields unsigned transactions, which are then signed and sent to initiate the attestation process on the source chain.

## Submit Attestation on Destination Chain

The attestation flow finishes with the following: 

- Using the transaction ID returned from the `createAttestation` transaction on the source chain to retrieve the associated signed `TokenBridge:AttestMeta` VAA.
- Submitting the signed VAA to the destination chain to provide Guardian-backed verification of the attestation transaction on the source chain. 
- The destination chain uses the attested metadata to create the wrapped version of the token and register it with its Token Bridge contract.

Follow these steps to complete your attestation flow logic:

1. Add the following code to `attest.ts`:
    ```typescript title="attest.ts"
    --8<-- 'code/products/token-bridge/guides/attest-tokens/attest.ts:58:122'
    ```

2. Run the script using the following command:
    ```bash
    npx tsx attest.ts
    ```

3. You will see terminal output similar to the following:

    --8<-- 'code/products/token-bridge/guides/attest-tokens/terminal03.html'

    ??? example "View complete script"
        ```typescript title="attest.ts"
        --8<-- 'code/products/token-bridge/guides/attest-tokens/attest.ts'
        ```

Congratulations! You've successfully created and submitted an attestation to register a token for transfer via Token Bridge. Consider the following options to build upon what you've achieved.

## Next Steps

- [**Transfer Wrapped Assets**](/docs/products/token-bridge/guides/attest-tokens): follow this guide to incorporate token attestation and registration into an end-to-end Token Bridge transfer flow.