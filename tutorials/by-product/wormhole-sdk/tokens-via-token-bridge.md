---
title: Transfer Tokens via Token Bridge Tutorial
description: Learn to build a cross-chain native token transfer app using Wormhole’s TypeScript SDK, supporting native token transfers across EVM and non-EVM chains
---

# Transfer Tokens via the Token Bridge

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-ts-sdk/){target=\_blank}

## Introduction

This tutorial guides you through building a cross-chain token transfer application using the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} and its [Token Bridge](/docs/learn/messaging/token-bridge/){target=\_blank} method. The Token Bridge method enables secure and efficient cross-chain asset transfers across different blockchain networks, allowing users to move tokens seamlessly.

By leveraging Wormhole’s Token Bridge, this guide shows you how to build an application that supports multiple transfer types:

 - EVM to EVM (e.g., Ethereum to Avalanche)
 - EVM to non-EVM chains (e.g., Ethereum to Solana)
 - Non-EVM to EVM chains (e.g., Sui to Avalanche)
 - Non-EVM to non-EVM chains (e.g., Solana to Sui)

Existing solutions for cross-chain transfers can be complex and inefficient, requiring multiple steps and transaction fees. However, the Token Bridge method from Wormhole simplifies the process by handling the underlying attestation, transaction validation, and message passing across blockchains.

At the end of this guide, you’ll have a fully functional setup for transferring assets across chains using Wormhole’s Token Bridge method.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally
 - Native tokens (testnet or mainnet) in Solana and Sui wallets
 - A wallet with a private key, funded with native tokens (testnet or mainnet) for gas fees

## Supported Chains

The Wormhole SDK supports a wide range of EVM and non-EVM chains, allowing you to facilitate cross-chain transfers efficiently. You can find a complete list of supported chains in the Wormhole SDK [GitHub repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants/circle.ts#L14-L30){target=\_blank}, which covers both testnet and mainnet environments.

## Project Setup

In this section, we’ll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project** - start by creating a new directory for your project and initializing it with `npm`, which will create the `package.json` file for your project

    ```bash
    mkdir native-transfers
    cd native-transfers
    npm init -y
    ```

2. **Install dependencies** - install the required dependencies, including the Wormhole SDK and helper libraries

    ```bash
    npm install @wormhole-foundation/sdk dotenv tsx
    ```

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private keys.

    ```env
    ETH_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SOL_PRIVATE_KEY="INSERT_YOUR_PRIVATE_KEY"
    SUI_PRIVATE_KEY="INSERT_SUI_MNEMONIC"
    ```

    !!! note
        Ensure your private key contains native tokens for gas on both the source and destination chains. For Sui, you must provide a mnemonic instead of a private key.

4. **Create a `helpers.ts` file** - to simplify the interaction between chains, create a file to store utility functions for fetching your private key, set up signers for different chains, and manage transaction relays

    1. Create the helpers file

        ```bash
        mkdir -p src/helpers
        touch src/helpers/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code

        ```typescript
        --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-1.ts"
        ```

        - **`getEnv`** - this function fetches environment variables like your private key from the `.env` file
        - **`getSigner`** - based on the chain you're working with (EVM, Solana, Sui, etc.), this function retrieves a signer for that specific platform. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the private key stored in your `.env` file
        - **`getTokenDecimals`** - this function fetches the number of decimals for a token on a specific chain. It helps handle token amounts accurately during transfers

## Check and Create Wrapped Tokens

Before transferring tokens across chains, check if a wrapped version exists on the destination chain. If not, you need to generate an attestation to register and wrap the token so it can be sent and received on that chain.

In this section, you'll create a script to automate these steps. This example checks explicitly whether Arbitrum Sepolia has a wrapped version on Base Sepolia and, if not, registers it on the destination chain.

1. Create the `create-wrapped.ts` file in the `src` directory

    ```bash
    mkdir -p src/scripts
    touch src/scripts/create-wrapped.ts
    ```

2. Open `create-wrapped.ts` and import the required modules

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:1:6"
    ```

     - **`evm`** - this import is for working with EVM-compatible chains, like Avalanche, Ethereum, Base Sepolia, and more
     - **`solana`** - this adds support for Solana, a non-EVM chain
     - **`sui`** - support for Sui chain, another non-EVM chain
     - `helpers.ts` - methods defined in the previous section

3. **Initialize the Wormhole SDK** - initialize the `wormhole` function for the `Testnet` environment and specify the platforms (EVM, Solana and Sui) to support. This allows us to interact with both EVM-compatible chains like Ethereum and non-EVM chains like Solana

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:8:9"
    ```

    !!! note
        You can replace `'Testnet'` with `'Mainnet'` if you want to perform transfers on Mainnet.


4. **Define the source chain and retrieve the native token ID** - retrieve the source chain and obtain the native token ID. This token will be checked and, if necessary, wrapped on the destination chain

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:12:14"
    ```

     - `origChain` - specifies the source chain, in this case, Arbitrum Sepolia
     - `token` - retrieves the native token ID on the source chain
     - `origSigner` - fetches the signer for the source chain, allowing the script to authorize transactions

5. **Create an attestation transaction** - before wrapping a token, an attestation must be created. This step ensures that Wormhole recognizes the token and allows it to be wrapped on the destination chain

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:17:30"
    ```

     - `createAttestation` - generates an attestation for the token on the source chain
     - `signSendWait` - submits the attestation transaction and waits for confirmation
     - `txid` - stores the transaction ID, which can be used later to verify the attestation

6. **Retrieve the signed VAA** - once the attestation transaction is confirmed, retrieve the signed VAA. This serves as cryptographic proof that the Wormhole network recognizes the attestation

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:33:42"
    ```

     - `parseTransaction(txid)` - extracts Wormhole messages from the attestation transaction
     - `getVaa` - retrieves the signed VAA for the attestation
     - `timeout` - defines how long to wait for the VAA before failing

7. **Set up the destination chain** - specify the destination chain and configure the signer

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:47:50"
    ```

    `gasLimit` - defines an optional gas limit for EVM chains

8. **Check if the token is already wrapped on the destination chain** - if the token is wrapped on the destination chain, you  may proceed to the [next section](/docs/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/#native-token-transfers)

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:52:61"
    ```

     - `getTokenBridge()` - retrieves the Token Bridge instance for the destination chain
     - `getWrappedAsset(token)` - checks if the token already exists as a wrapped asset  

9. **Submit the attestation on the destination chain** - if the token is not already wrapped, submit the attestation to create the wrapped version on the destination chain

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:66:72"
    ```

     - `submitAttestation(vaa, recipient)` - submits the signed VAA to wrap the token
     - `signSendWait(destChain, subAttestation, signer)` - sends the attestation transaction and waits for confirmation


10. **Wait for the wrapped asset to be available** - after submitting the attestation, poll until the wrapped token is available on the destination chain

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts:77:91"
    ```

     If the token is not found, it logs a message and retries after a short delay. Once the wrapped asset is detected, its address is returned.

You can find the complete create-wrapped token script below:

??? code "`create-wrapped.ts`"
    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-2.ts"
    ```

### Run the Wrapped Token Creation

Once the script is ready, execute it with:

```bash
npx tsx src/scripts/create-wrapped.ts
```

## Token Transfers

In this section, you'll create a script to transfer native tokens across chains using Wormhole's Token Bridge method. The script will handle the transfer of Sui native tokens to Solana, demonstrating the seamless cross-chain transfer capabilities of the Wormhole SDK. Since both chains are non-EVM compatible, you'll need to manually handle the attestation and finalization steps.

### Configure Transfer Details

Before initiating a cross-chain transfer, you must set up the chain context and signers for both the source and destination chains.

1. Create the `native-transfer.ts` file in the `src` directory to hold your script for transferring native tokens across chains

    ```bash
    touch src/scripts/native-transfer.ts
    ```

2. Open the `native-transfer.ts` file and begin by importing the necessary modules from the SDK and helper files

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:1:14"
    ```

    The required imports are the same as in the [Wrapped Tokens section](/docs/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/#check-and-create-wrapped-tokens).

3. **Initialize the Wormhole SDK** - initialize the `wormhole` function for the `Testnet` environment and specify the platforms (EVM, Solana, and Sui) to support

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:15:16"
    ```

4. **Set up source and destination chains** - specify the source chain (Sui) and the destination chain (Solana) using the `getChain` method. This allows us to define where to send the native tokens and where to receive them

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:19:20"
    ```

5. **Configure the signers** - use the `getSigner` function to retrieve the signers responsible for signing transactions on the respective chains. This ensures that transactions are correctly authorized on both the source and destination chains

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:23:24"
    ```

6. **Define the token to transfer** - specify the native token on the source chain (Sui in this example) by creating a `TokenId` object

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:27:27"
    ```

7. **Define the transfer amount** - the amount of native tokens to transfer is specified. In this case, we're transferring 1 unit

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:30:30"
    ```

8. **Set transfer mode** - specify that the transfer should be manual by setting `automatic = false`. This means you will need to handle the attestation and finalization steps yourself

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:33:33"
    ```

    !!! note
        Automatic transfers are only supported for EVM chains. For non-EVM chains like Solana and Sui, you must manually handle the attestation and finalization steps.
    
9. **Define decimals** - fetch the number of decimals for the token on the source chain (Sui) using the `getTokenDecimals` function

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:36:36"
    ```

10. **Perform the token transfer and exit the process** - initiate the transfer by calling the `tokenTransfer` function, which we’ll define in the next step. This function takes an object containing all required details for executing the transfer, including the `source` and `destination` chains, `token`, `mode`, and transfer `amount`

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:39:45"
    ```

    Finally, we use `process.exit(0);` to close the script once the transfer completes

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:47:48"
    ```

### Token Transfer Logic

This section defines the `tokenTransfer` function, which manages the core steps for cross-chain transfer execution. This function will handle initiating the transfer on the source chain, retrieving the attestation, and completing the transfer on the destination chain.

#### Defining the Token Transfer Function

The `tokenTransfer` function initiates and manages the transfer process, handling all necessary steps to move tokens across chains with the Wormhole SDK. This function uses types from the SDK and our `helpers.ts` file to ensure chain compatibility.

```typescript
--8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:50:61"
--8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:96"
```

#### Steps to Transfer Tokens

The `tokenTransfer` function consists of several key steps to facilitate the cross-chain transfer. Let’s break down each step:

1. **Initialize the transfer object** - the `tokenTransfer` function begins by creating a `TokenTransfer` object, `xfer`, which tracks the state of the transfer process and provides access to relevant methods for each transfer step

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:63:70"
    ```

2. **Estimate transfer fees and validate amount** - we obtain a fee quote for the transfer before proceeding. This step is significant in automatic mode (`automatic = true`), where the quote will include additional fees for relaying

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:72:80"
    ```

3. **Submit the transaction to the source chain** - initiate the transfer on the source chain by submitting the transaction using `route.source.signer`, starting the token transfer process

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:84:85"
    ```

     - **`srcTxids`** - the resulting transaction IDs are printed to the console. These IDs can be used to track the transfer’s progress on the source chain and [Wormhole network](https://wormholescan.io/#/?network=Testnet){target=\_blank}

    ???- note "How Cross-Chain Transfers Work in the Background"
        When `xfer.initiateTransfer(route.source.signer)` is called, it initiates the transfer on the source chain. Here’s what happens in the background:

         - **Token lock or burn** - tokens are either locked in a smart contract or burned on the source chain, representing the transfer amount
         - **VAA creation** - Wormhole’s network of Guardians generates a Verifiable Action Approval (VAA)—a signed proof of the transaction, which ensures it’s recognized across chains
         - **Tracking the transfer** - the returned transaction IDs allow you to track the transfer's progress both on the source chain and within Wormhole’s network
         - **Redemption on destination** - once detected, the VAA is used to release or mint the corresponding token amount on the destination chain, completing the transfer

        This process ensures a secure and verifiable transfer across chains, from locking tokens on the source chain to redeeming them on the destination chain.

4. **Wait for the attestation** - retrieve the Wormhole attestation (VAA), which serves as cryptographic proof of the transfer. In manual mode, you must wait for the VAA before redeeming the transfer on the destination chain

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:90:90"
    ```

5. **Complete the transfer on the destination chain** - redeem the VAA on the destination chain to finalize the transfer

    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts:94:95"
    ```

You can find the complete native token transfer script below:

??? code "`native-transfer.ts`"
    ```typescript
    --8<-- "code/tutorials/by-product/wormhole-sdk/tokens-via-token-bridge/token-bridge-3.ts"
    ```

### Run the Native Token Transfer

Now that you’ve set up the project and defined the transfer logic, you can execute the script to transfer native tokens from the Sui chain to Solana. You can use `tsx` to run the TypeScript file directly:

```bash
npx tsx src/scripts/native-transfer.ts
```

This initiates the native token transfer from the source chain (Sui) and completes it on the destination chain (Solana).

You can monitor the status of the transaction on the [Wormhole explorer](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in [Wormhole's demo GitHub repository](https://github.com/wormhole-foundation/demo-basic-ts-sdk/){target=\_blank}. The repository includes all the example scripts and configurations needed to perform native token cross-chain transfers, including manual, automatic, and partial transfers using the Wormhole SDK.

## Conclusion

You've successfully built a cross-chain token transfer application using Wormhole's TypeScript SDK and the Token Bridge method. This guide took you through the setup, configuration, and transfer logic required to move native tokens across non-EVM chains like Sui and Solana.

The same transfer logic will apply if you’d like to extend this application to different chain combinations, including EVM-compatible chains.