---
title: Transfer USDC via CCTP and Wormhole SDK
description: Learn how to perform USDC cross-chain transfers using Wormhole SDK and Circle's CCTP. Supports manual, automatic, and partial transfer recovery.
---

# Transfer USDC via CCTP and Wormhole SDK

## Introduction

In this guide, you'll learn how to bridge native USDC across different chains using [Circle's Cross-Chain Transfer Protocol](/learn/messaging/cctp/){target=\_blank} (CCTP) via the Wormhole Protocol. We'll explore the underlying theory of CCTP and provide a hands-on tutorial for integrating it using [Wormhole’s Connect SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main){target=\_blank}.

Wormhole builds upon Circle's CCTP to enhance cross-chain transfers, making the process more straightforward and user-friendly. With Wormhole, users benefit from automated transfer relaying, gas payments on the destination chain, and the option to drop off native gas tokens, eliminating many common pain points.

### Core Concepts

1. **Manual Transfers** - manual transfers involve three key steps: initiating the transfer on the source chain, fetching the Circle attestation to verify the transfer, and completing the transfer on the destination chain

2. **Automated Transfers** - automatic transfers simplify the process by handling Circle attestations and finalization for you. With Wormhole's automated relaying, you only need to initiate the transfer, and the rest is managed for you

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [USDC tokens](https://faucet.circle.com/){target=\_blank} on supported chains
 - A wallet with a private key, funded with native tokens (TestNet or MainNet) for gas fees

## Supported Chains

The `circleTransfer` function is compatible with a variety of EVM and non-EVM chains across both TestNet and MainNet. The [CCTP GitHub repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants/circle.ts#L14-L30){target=\_blank} has a full list of supported chains.

## Project Setup

In this section, you'll set up your project for transferring USDC across chains using Wormhole's SDK and Circle's CCTP. We’ll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project** - start by creating a new directory for your project and initializing it with `npm`

    ```bash
    mkdir cctp-circle
    cd cctp-circle
    npm init -y
    ```

    This will create the necessary `package.json` file and set up the basic structure of your project.

2. **Install dependencies** - install the required dependencies, including the Wormhole SDK and helper libraries

    ```bash
    npm install @wormhole-foundation/sdk dotenv
    ```

    The SDK allows you to interact with supported chains through Wormhole.

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private key:

    ```env
    ETH_PRIVATE_KEY=INSERT_YOUR_PRIVATE_KEY
    SOL_PRIVATE_KEY=INSERT_YOUR_PRIVATE_KEY
    ```

    !!! note
        Make sure your private key is funded with USDC and native tokens for gas on both the source and destination chains.

4. **Create a `helpers.ts` file** - to simplify the interaction between chains, create a `helpers.ts` file with the necessary utility functions. This file handles fetching your private key, setting up signers for different chains, and managing transaction relays

    1. Create the helpers file:

        ```bash
        mkdir helpers
        touch helpers/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code:

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-2.ts"
        ```

        - **`getEnv`** - this function fetches environment variables like your private key from the `.env` file
        - **`getSigner`** - based on the chain you're working with (EVM, Solana, etc.), this function retrieves a signer for that specific platform. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the private key stored in your `.env` file

5. **Create the main script** - create a new file named `manual-transfer.ts` to hold your script for transferring USDC across chains

    ```bash
    touch manual-transfer.ts
    ```

    Open the file and begin by importing the necessary modules from the SDK and helper files:

    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:1:8"
    ```

    Relevant imports include:

    - **`evm`** - this import is for working with EVM-compatible chains, like Avalanche, Ethereum, Base Sepolia, and more
    - **`solana`** - this adds support for Solana, a non-EVM chain. While we won’t be using Solana in this specific example, you can experiment with Solana transfers if you choose to
    - **`getSigner`** - utility function from the helper file. `getSigner` retrieves the signer to sign transactions

## Manual Transfers

This section’ll guide you through performing a manual USDC transfer across chains using the Wormhole SDK and Circle’s CCTP.

### Set-Up

1. **Transfer details** - before you initiate a cross-chain transfer, you need to set up the chain context and signers for both the source and destination chains

    1. **Initialize the Wormhole SDK** - the wormhole function is initialized for the Testnet environment, and we specify the platforms (EVM and Solana) we want to support. This allows us to interact with both EVM-compatible chains like Avalanche and non-EVM chains like Solana if needed

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:10:11"
        ```
    
    !!! note
        You can replace `"Testnet"` with `"Mainnet"` if you want to perform transfers on MainNet.

    2. **Set up source and destination chains** - we specify the source chain (Avalanche) and the destination chain (Solana) using the `getChain` method. This allows us to define where to send the USDC and where to receive them

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:14:15"
        ```

    3. **Configure the signers** - the `getSigner` function retrieves the signers responsible for signing transactions on the respective chains. This ensures that transactions are correctly authorized on both the source and destination chains

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:18:19"
        ```

    4. **Define the transfer amount** - the amount of USDC to transfer is specified. In this case, we're transferring 0.1 USDC, which is parsed and converted into the base units expected by the Wormhole SDK

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:22:22"
        ```

    5. **Set transfer mode** - we specify that the transfer should be manual by setting `automatic = false`. This means you will need to handle the attestation and finalization steps yourself

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:24:24"
        ```

2. **Initiate the transfer** - to begin the manual transfer process, you first need to create the transfer object and then manually initiate the transfer on the source chain

    1. **Create the Circle transfer object** - the `wh.circleTransfer()` function creates an object with the  transfer details, such as the amount of USDC, source, destination addresses, and mode. However, this does not initiate the transfer itself

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:27:32"
        ```

    2. **Start the transfer** - the `initiateTransfer` function sends the transaction on the source chain. It involves signing and sending the transaction using the source signer. This will return a list of transaction IDs (srcTxids) that you can use to track the transfer

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:38:39"
        ```

3. **Fetch the Circle attestation (VAA)** - once you initialize the transfer on the source chain, you must fetch the VAA from Circle. The VAA serves as cryptographic proof that CCTP has successfully recognized the transfer. The transfer cannot be completed on the destination chain until this attestation is fetched


    1. **Set a timeout** - fetching the attestation can take some time, so setting a timeout is common. In this example, we set the timeout to 60 seconds

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:42:42"
        ```

    2. **Fetch the attestation** - after initiating the transfer, you can use the `fetchAttestation()` function to retrieve the VAA. This function will wait until the attestation is available or you reach the specified timeout

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:44:45"
        ```

        - The `attestIds` will contain the details of the fetched attestation, which Wormhole uses to complete the transfer on the destination chain

4. **Complete the transfer on the destination chain** - once the VAA is fetched, the final step is to complete the transfer on the destination chain (Solana in this example). This involves redeeming the VAA, which moves the USDC from Circle's custody onto the destination chain

    1. **Complete the transfer** - after successfully fetching the VAA, use the `completeTransfer()` function to finalize the transfer on the destination chain. This requires the destination signer to sign and submit the transaction to the destination chain

        ```typescript
        --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts:49:55"
        ```

        - The `dstTxids` will hold the transaction IDs for the transfer on the destination chain, confirming that the transfer has been completed

You can find the full code for the manual USDC transfer script below:

???- tip "`manual-transfer.ts`"
    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-1.ts"
    ```

### Run Manual Transfer

To execute the manual transfer script, you can use `ts-node` to run the TypeScript file directly:

```bash
npx ts-node manual-transfer.ts
```

This will initiate the USDC transfer from the source chain (Avalanche) and complete it on the destination chain (Solana).

You can monitor the status of the transaction on the [Wromhole Explorer](https://wormholescan.io/){target=\_blank}.

### Complete Partial Transfer

In some cases, a manual transfer might start but not finish—perhaps the user terminates their session, or there's an issue before the transfer can be completed. The Wormhole SDK allows you to reconstitute the transfer object from the transaction hash on the source chain.

This feature is handy for recovering an incomplete transfer or when debugging.

Here’s how you can complete a partial transfer using just the source chain and transaction hash:

```typescript
--8<-- "code/tutorials/messaging/cctp/cctp-sdk-4.ts:23:33"
```

You will need to provide the below requirements to complete the partial transfer:

- **Transaction ID (txid)** - the transaction hash from the source chain where the transfer was initiated
- **Signer for the destination chain (destination.signer)** - the wallet or private key that can authorize and complete the transfer on the destination chain. This signer is the same as the `destination.signer` defined in the manual transfer setup

This allows you to resume the transfer process by rebuilding the transfer object and completing it on the destination chain. It's especially convenient when debugging or handling interrupted transfers.

You can find the full code for the manual USDC transfer script below:

???- tip "`partial-transfer.ts`"
    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-4.ts"
    ```

## Automatic Transfers

The Automatic Transfer process simplifies the steps by automating the attestation fetching and transfer completion. All you need to do is initiate the transfer.

### Set-Up

1. **Configure the transfer** - the setup for automatic transfers is similar to manual transfers, with the key difference being that the `automatic` flag is `true`. This indicates Wormhole to handle the attestation and finalization steps for you

    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-3.ts:25:25"
    ```

2. **Initiate the transfer** - the transfer process is the same as that for manual transfers. You create the transfer object and then start the transfer on the source chain

    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-3.ts:28:33"
    ```

    With automatic transfers, you don't need to fetch the attestation or complete the transfer manually. Wormhole will handle these steps for you

3. **Log the transfer details** - after initiating the transfer, you can log the transaction IDs for both the source and destination chains. This will help you track the progress of the transfer

    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-3.ts:39:43"
    ```

You can find the full code for the automatic USDC transfer script below:

???- tip "`automatic-transfer.ts`"
    ```typescript
    --8<-- "code/tutorials/messaging/cctp/cctp-sdk-3.ts"
    ```

### Run Automatic Transfer

To execute the automatic transfer script, you can use `ts-node` to run the TypeScript file directly:

```bash
npx ts-node automatic-transfer.ts
```

The automatic relayer will take care of fetching the attestation and completing the transfer for you.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in the [CCTP with Wormhole SDK GitHub repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/develop/examples/src/cctp.ts){target=\_blank}. The repository includes all the scripts and configurations needed to perform USDC cross-chain transfers, including manual, automatic, and partial transfers using the Wormhole SDK and Circle's CCTP.

## Conclusion

In this tutorial, you’ve gained hands-on experience with Circle’s Cross-Chain Transfer Protocol (CCTP) and the Wormhole SDK. You’ve learned how to perform manual and automatic USDC transfers across multiple chains and recover partial transfers if needed.

By following these steps, you've learned how to:

- Set up cross-chain transfers for native USDC between supported chains
- Handle both manual and automatic relaying of transactions
- Recover and complete incomplete transfers using the transaction hash and the destination chain’s signer