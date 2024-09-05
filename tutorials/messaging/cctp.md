---
title: USDC Transfers with CCTP and the Wormhole Connect SDK
description: TODO
---

# USDC Transfers with CCTP and the Wormhole Connect SDK

## Introduction

In this guide, you'll learn how to bridge native USDC across different chains using Circle's Cross-Chain Transfer Protocol (CCTP) via the Wormhole Protocol. We'll explore both the underlying theory of how CCTP works and provide a hands-on tutorial for integrating it using Wormhole’s Connect SDK.

Wormhole builds upon Circle's CCTP to enhance cross-chain transfers, making the process simpler and more user-friendly. With Wormhole, users benefit from automated relaying of transfers, gas payments on the destination chain, and the option to drop off native gas tokens, eliminating many common pain points.

### Key Features

 - **Automated Relaying** - Wormhole automatically relays the USDC transfer across chains, so users don't have to manually relay the transfer.
 - **Native Gas Dropoff** - Wormhole pays for the gas fees on the destination chain, so users don't have to worry about having gas on the destination chain.
 - **Support for Multiple Chains** - Wormhole provides native gas drop-offs on the destination chain, so users don't have to worry about having gas on the destination chain.

### Core Concepts

1. **Manual Transfers** - manual transfers involve three key steps: initiating the transfer on the source chain, fetching the Circle attestation to verify the transfer, and completing the transfer on the destination chain

2. **Automated Transfers** - automatic transfers simplify the process by handling Circle attestations and finalization for you. With Wormhole's automated relaying, you only need to initiate the transfer, and the rest is managed for you

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [USDC tokens](https://faucet.circle.com/){target=\_blank} on supported chains
 - A wallet with a private key, funded with TestNet tokens for gas fees

## Project Setup

In this section, you'll set up your project for transferring USDC across chains using Wormhole's SDK and Circle's CCTP. We’ll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project** - start by creating a new directory for your project and initializing it with `npm`

    ```bash
    mkdir cctp-cross-chain-transfer
    cd cctp-cross-chain-transfer
    npm init -y
    ```

    This will create the necessary `package.json` file and set up the basic structure of your project.

2. **Install dependencies** - install the required dependencies, including the Wormhole SDK and helper libraries

    ```bash
    npm install @wormhole-foundation/sdk
    ```

    The SDK allows you to interact with supported chains through Wormhole.

3. **Set up environment variables** - to securely store your private key, create a `.env` file in the root of your project

    ```bash
    touch .env
    ```

    Inside the `.env` file, add your private key:

    ```env
    PRIVATE_KEY=INSERT_YOUR_PRIVATE_KEY
    ```

    !!! note
        Make sure your private key is funded with USDC and gas on both the source and destination chains.

4. **Create the main script** - create a new file named `transfer-usdc.ts` to hold your script for transferring USDC across chains

    ```bash
    touch transfer-usdc.ts
    ```

    Open the file and begin by importing the necessary modules from the SDK and helper files:

    ```typescript
    import {
    Chain,
    CircleTransfer,
    Network,
    Signer,
    Wormhole,
    amount,
    wormhole,
    } from "@wormhole-foundation/sdk";
    import evm from "@wormhole-foundation/sdk/evm";
    import solana from "@wormhole-foundation/sdk/solana";
    import { SignerStuff, getSigner, waitForRelay } from "./helpers/index.js";
    ```

    Relevant imports include:

    - **`evm`** - this import is for working with EVM-compatible chains, like Avalanche, Ethereum, Base Sepolia and more
    - **`solana`** - this adds support for Solana, a non-EVM chain. While we won’t be using Solana in this specific example, you can experiment with Solana transfers if you choose to
    - **`getSigner` and `waitForRelay`** - these are utility functions from the helper files. `getSigner` retrieves the signer to sign transactions, and `waitForRelay` handles the relay process when using automatic transfers

## Manual Transfers

In this section, we’ll guide you through the steps of performing a manual USDC transfer across chains using the Wormhole SDK and Circle’s CCTP.

1. **Initiate the Transfer** - before you initiate a cross-chain transfer, you need to set up the chain context and signers for both the source and destination chains. Here’s how you can configure them:

    1. **Initialize the Wormhole SDK** - the wormhole function is initialized for the Testnet environment, and we specify the platforms (EVM and Solana) we want to support. This allows us to interact with both EVM-compatible chains like Avalanche and non-EVM chains like Solana if needed

        ```typescript
        const wh = await wormhole("Testnet", [evm, solana]);
        ```

    2. **Set up source and destination chains** - we specify the source chain (Avalanche) and the destination chain (BaseSepolia) using the getChain method. This allows us to define where the USDC will be sent from and where it will be received.

        ```typescript
        const sendChain = wh.getChain("Avalanche");
        const rcvChain = wh.getChain("BaseSepolia");
        ```

    3. **Configure the signers** - the `getSigner` function retrieves the signers responsible for signing transactions on the respective chains. This ensures that transactions are properly authorized on both the source and destination chains.

        ```typescript
        const source = await getSigner(sendChain);
        const destination = await getSigner(rcvChain);
        ```

    4. **Define the transfer amount** - the amount of USDC to transfer is specified. In this case, we're transferring 0.2 USDC, which is parsed and converted into the base units expected by the Wormhole SDK.

        ```typescript
        const amt = amount.units(amount.parse("0.2", 6));
        ```

    5. **Set transfer mode** - we specify that the transfer should be manual by setting `automatic = false`. This means you will need to handle the attestation and finalization steps yourself.

        ```typescript
        const automatic = false;

        await cctpTransfer(wh, source, destination, {
            amount: amt,
            automatic,
        });
        })();
        ```

    This code initiates a transfer of 0.2 USDC from Avalanche to Base Sepolia.

    ???- tip "Complete function"
        ```typescript
        (async function () {
        // Initialize the Wormhole object for the Testnet
        const wh = await wormhole("Testnet", [evm, solana]);

        // Define the source and destination chains (e.g., Avalanche to Base Sepolia)
        const sendChain = wh.getChain("Avalanche");
        const rcvChain = wh.getChain("BaseSepolia");

        // Get signers for the source and destination chains
        const source = await getSigner(sendChain);
        const destination = await getSigner(rcvChain);

        // Define the amount of USDC to transfer (e.g., 0.2 USDC)
        const amt = amount.units(amount.parse("0.2", 6));

        // Choose manual transfer (automatic = false)
        const automatic = false;

        // Initiate the cross-chain transfer
        await cctpTransfer(wh, source, destination, {
            amount: amt,
            automatic,
        });
        })();
        ```

2. **Fetch the Circle Attestation** - after initiating the transfer, the next step is to fetch the Circle attestation, which confirms the transfer across chains. The attestation proves that the USDC transfer on the source chain is valid and can be redeemed on the destination chain.

    1. **Initiate the transfer** - the `circleTransfer` method is called with the necessary parameters, including the amount to transfer and whether the transfer is manual or automatic. The transfer object `xfer` will handle both the transfer initiation and attestation

        ```typescript
        const xfer = await wh.circleTransfer(amt, source.address, destination.address, automatic);
        ```

    2. **Start the transfer** - we start the transfer by calling `initiateTransfer`, which sends the transaction on the source chain. This will return a list of transaction IDs (srcTxids)

        ```typescript
        const srcTxids = await xfer.initiateTransfer(source.signer);
        ```

    3. **Wait for the attestation** - if the transfer is manual (automatic = false), the `fetchAttestation` function waits for the attestation to be available from Circle. 

        ```typescript
        const attestIds = await xfer.fetchAttestation(60_000); // 60-second timeout
        ```

        A `timeout` is set to avoid indefinite waiting (e.g., 60 seconds in this example). Once the attestation is retrieved, it will be used to finalize the transfer on the destination chain.

    4. **Complete the transfer** - after fetching the attestation, we call `completeTransfer` to finish the transfer on the destination chain using the destination signer. This completes the entire process

        ```typescript
        const dstTxids = await xfer.completeTransfer(destination.signer);
        ```
    
    The `fetchAttestation` function waits for the Circle attestation and then completes the transfer on the destination chain.

    ???- tip "`cctpTransfer` function"
        ```typescript
        async function cctpTransfer<N extends Network>(
        wh: Wormhole<N>,
        src: SignerStuff<N, Chain>,
        dst: SignerStuff<N, Chain>,
        req: {
            amount: bigint;
            automatic: boolean;
        },
        ) {
        const xfer = await wh.circleTransfer(req.amount, src.address, dst.address, req.automatic);

        // Start the transfer on the source chain
        console.log("Starting Transfer");
        const srcTxids = await xfer.initiateTransfer(src.signer);
        console.log(`Started Transfer: `, srcTxids);

        if (!req.automatic) {
            // Wait for the attestation from Circle
            console.log("Waiting for Attestation");
            const attestIds = await xfer.fetchAttestation(60_000); // 60-second timeout
            console.log(`Got Attestation: `, attestIds);

            // Complete the transfer on the destination chain
            console.log("Completing Transfer");
            const dstTxids = await xfer.completeTransfer(dst.signer);
            console.log(`Completed Transfer: `, dstTxids);
        }
        }
        ```

Here’s the complete script for performing a manual USDC transfer across chains:

???- tip "Manual CCTP script"
    ```typescript
    --8<-- "code/tutorials/messaging/cctp/snippet-1.ts"
    ```

3. **Run the Manual Transfer** - once your script is complete, run it using ts-node

    ```bash
    npx ts-node transfer-usdc.ts
    ```

    If everything is set up correctly, the transfer will be initiated, the attestation will be fetched, and the transfer will be completed on the destination chain.

    The expected output should look like this:

    ```bash
    ...
    ```

## Automatic Transfers

The Automatic Transfer process simplifies the steps by automating the attestation fetching and transfer completion. All you need to do is initiate the transfer.

Here’s how to perform an automatic transfer:

``` typescript
(async function () {
  // Initialize Wormhole for Testnet
  const wh = await wormhole("Testnet", [evm, solana]);

  // Define the source and destination chains (e.g., Avalanche to Base Sepolia)
  const sendChain = wh.getChain("Avalanche");
  const rcvChain = wh.getChain("BaseSepolia");

  // Get signers
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Set up the amount (0.2 USDC) and automatic transfer
  const amt = amount.units(amount.parse("0.2", 6));
  const automatic = true;

  // If automatic, you can also include native gas dropoff for the receiver
  const nativeGas = amount.units(amount.parse("0.0", 6));

  await cctpTransfer(wh, source, destination, {
    amount: amt,
    automatic,
    nativeGas,
  });
})();
```

**Run the Automatic Transfer** - execute the script using ts-node

```bash
npx ts-node transfer-usdc.ts
```

The automatic relayer will take care of fetching the attestation and completing the transfer for you.

The expected output should look like this:

```bash
...
```


