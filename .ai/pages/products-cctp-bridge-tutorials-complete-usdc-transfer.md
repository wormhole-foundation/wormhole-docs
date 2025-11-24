---
title: Complete USDC Transfer Flow
description: Learn how to perform USDC cross-chain transfers using Wormhole SDK and Circle's CCTP. Supports manual, automatic, and partial transfer recovery.
categories: Transfer, CCTP
url: https://wormhole.com/docs/products/cctp-bridge/tutorials/complete-usdc-transfer/
---

# Complete USDC Transfer Flow

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-cctp-transfer){target=\_blank}

In this guide, we will show you how to bridge native USDC across different blockchain networks using [Circle's Cross-Chain Transfer Protocol](/docs/products/cctp-bridge/overview/){target=\_blank} (CCTP) and [Wormhole's TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main){target=\_blank}.

Traditionally, cross-chain transfers using CCTP involve multiple manual steps, such as initiating the transfer on the source chain, relaying messages between chains, and covering gas fees on both the source and destination chains. Without the TypeScript SDK, developers must handle these operations independently, adding complexity and increasing the chance for errors, mainly when dealing with gas payments on the destination chain and native gas token management.

Wormhole's TypeScript SDK simplifies this process by offering automated transfer relaying and handling gas payments on the destination chain. It also offers an option to include native gas tokens for seamless execution. This reduces developer overhead, makes transfers faster and more reliable, and enhances the user experience.

In this guide, we'll first explore the theory behind CCTP and then provide a step-by-step tutorial for integrating Wormhole's TypeScript SDK into your application to streamline USDC transfers across multiple chains.

## Core Concepts

When bridging assets across chains, there are two primary approaches to handling the transfer process: manual and automated. Below, you may find the differences between these approaches and how they impact the user experience:

 - **Manual transfers**: Manual transfers involve three key steps: initiating the transfer on the source chain, fetching the Circle attestation to verify the transfer, and completing the transfer on the destination chain.

 - **Automated transfers**: Automatic transfers simplify the process by handling Circle attestations and finalization for you. With Wormhole's automated relaying, you only need to initiate the transfer, and the rest is managed for you.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
 - [USDC tokens](https://faucet.circle.com/){target=\_blank} on supported chains. This tutorial uses Avalanche and Sepolia as examples.
 - A wallet with a private key, funded with native tokens (testnet or mainnet) for gas fees.

## Supported Chains

The Wormhole SDK supports a wide range of EVM and non-EVM chains, allowing you to facilitate cross-chain transfers efficiently. You can find a complete list of supported chains in the [supported networks page](/docs/products/reference/supported-networks/#cctp){target=\_blank}, which covers both Testnet and Mainnet environments.

## Project Setup

In this section, you'll set up your project for transferring USDC across chains using Wormhole's SDK and Circle's CCTP. We'll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project**: Start by creating a new directory for your project and initializing it with `npm`, which will create the `package.json` file for your project.

    ```bash
    mkdir cctp-circle
    cd cctp-circle
    npm init -y
    ```

2. **Install dependencies**: Install the Wormhole SDK. This tutorial uses the SDK version `3.11.0`.

    ```bash
    npm install @wormhole-foundation/sdk@3.11.0
    ```

3. **Set up secure access to your wallets**: This guide assumes you are loading your `SOL_PRIVATE_KEY` and `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

5. **Create a `helpers.ts` file**: To simplify the interaction between chains, create a file to store utility functions, setting up signers for different chains, and managing transaction relays.

    1. Create the helpers file:

        ```bash
        mkdir helpers
        touch helpers/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code:

        ```typescript
        import {
          ChainAddress,
          ChainContext,
          Network,
          Signer,
          Wormhole,
          Chain,
        } from '@wormhole-foundation/sdk';
        import evm from '@wormhole-foundation/sdk/evm';
        import solana from '@wormhole-foundation/sdk/solana';

        export interface SignerStuff<N extends Network, C extends Chain> {
          chain: ChainContext<N, C>;
          signer: Signer<N, C>;
          address: ChainAddress<C>;
        }

        // Signer setup function for different blockchain platforms
        export async function getSigner<N extends Network, C extends Chain>(
          chain: ChainContext<N, C>
        ): Promise<{
          chain: ChainContext<N, C>;
          signer: Signer<N, C>;
          address: ChainAddress<C>;
        }> {
          let signer: Signer;
          const platform = chain.platform.utils()._platform;

          switch (platform) {
            case 'Solana':
              signer = await (
                await solana()
              ).getSigner(await chain.getRpc(), 'SOL_PRIVATE_KEY');
              break;
            case 'Evm':
              signer = await (
                await evm()
              ).getSigner(await chain.getRpc(), 'ETH_PRIVATE_KEY');
              break;
            default:
              throw new Error('Unsupported platform: ' + platform);
          }

          return {
            chain,
            signer: signer as Signer<N, C>,
            address: Wormhole.chainAddress(chain.chain, signer.address()),
          };
        }

        ```

        - **`getSigner`**: Based on the chain you're working with (EVM, Solana, etc.), this function retrieves a signer for that specific platform. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the provided private key.

6. **Create the main script**: Create a new file named `manual-transfer.ts` to hold your script for transferring USDC across chains.

    1. Create the `manual-transfer.ts` file in the `src` directory:

        ```bash
        mkdir src
        touch src/manual-transfer.ts
        ```

    2. Open the `manual-transfer.ts` file and begin by importing the necessary modules from the SDK and helper files:

        ```typescript
        import { wormhole, amount } from '@wormhole-foundation/sdk';
        import evm from '@wormhole-foundation/sdk/evm';
        import solana from '@wormhole-foundation/sdk/solana';
        import { getSigner } from './helpers/helpers';
        ```

        - **`evm`**: This import is for working with EVM-compatible chains, like Avalanche, Ethereum, Base Sepolia, and more.
        - **`solana`**: This adds support for Solana, a non-EVM chain.
        - **`getSigner`**: Utility function from the helper file that retrieves the signer to sign transactions.

## Manual Transfers

In a manual USDC transfer, you perform each step of the cross-chain transfer process individually. This approach allows for greater control and flexibility over how the transfer is executed, which can be helpful in scenarios where you need to customize certain aspects of the transfer, such as gas management, specific chain selection, or signing transactions manually.

This section will guide you through performing a manual USDC transfer across chains using the Wormhole SDK and Circle's CCTP.

### Set Up the Transfer Environment

#### Configure Transfer Details

Before initiating a cross-chain transfer, you must set up the chain context and signers for both the source and destination chains.

1. **Initialize the Wormhole SDK**: Initialize the `wormhole` function for the `Testnet` environment and specify the platforms (EVM and Solana) to support. This allows us to interact with both EVM-compatible chains like Avalanche and non-EVM chains like Solana if needed.

    ```typescript
    (async function () {
      const wh = await wormhole('Testnet', [evm, solana]);
    ```
    
    !!! note
        You can replace `'Testnet'` with `'Mainnet'` if you want to perform transfers on Mainnet.

2. **Set up source and destination chains**: Specify the source chain (Avalanche) and the destination chain (Sepolia) using the `getChain` method. This allows us to define where to send the USDC and where to receive them.

    ```typescript
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Sepolia');
    ```

3. **Configure the signers**: Use the `getSigner` function to retrieve the signers responsible for signing transactions on the respective chains. This ensures that transactions are correctly authorized on both the source and destination chains.

    ```typescript
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);
    ```

4. **Define the transfer amount**: The amount of USDC to transfer is specified. In this case, we're transferring 0.1 USDC, which is parsed and converted into the base units expected by the Wormhole SDK.

    ```typescript
      const amt = 100_000n;
    ```

5. **Set transfer mode**: We specify that the transfer should be manual by setting `automatic = false`. This means you will need to handle the attestation and finalization steps yourself.

    ```typescript
      const automatic = false;
    ```

#### Initiate the Transfer

To begin the manual transfer process, you first need to create the transfer object and then manually initiate the transfer on the source chain.

1. **Create the Circle transfer object**: The `wh.circleTransfer()` function creates an object with the  transfer details, such as the amount of USDC, the source and destination addresses, and the mode. However, this does not initiate the transfer itself.

    ```typescript
      const xfer = await wh.circleTransfer(
        amt,
        source.address,
        destination.address,
        automatic
      );
    ```

2. **Start the transfer**: The `initiateTransfer` function sends the transaction on the source chain. It involves signing and sending the transaction using the source signer. This will return a list of transaction IDs (`srcTxIds`) that you can use to track the transfer.

    ```typescript
      const srcTxids = await xfer.initiateTransfer(source.signer);
      console.log(`Started Transfer: `, srcTxids);
    ```

#### Fetch the Circle Attestation (VAA)

Once you initialize the transfer on the source chain, you must fetch the VAA from Circle. The VAA serves as cryptographic proof that CCTP has successfully recognized the transfer. The transfer cannot be completed on the destination chain until this attestation is fetched.


1. **Set a timeout**: Fetching the attestation can take some time, so setting a timeout is common. In this example, we set the timeout to 60 seconds.

    ```typescript
      const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)
    ```

2. **Fetch the attestation**: After initiating the transfer, you can use the `fetchAttestation()` function to retrieve the VAA. This function will wait until the attestation is available or you reach the specified timeout.

    ```typescript
      const attestIds = await xfer.fetchAttestation(timeout);
      console.log(`Got Attestation: `, attestIds);
    ```

    The `attestIds` will contain the details of the fetched attestation, which Wormhole uses to complete the transfer on the destination chain.

#### Complete the Transfer on the Destination Chain

Once you fetch the VAA correctly, the final step is to complete the transfer on the destination chain (Sepolia in this example). This involves redeeming the VAA, which moves the USDC from Circle's custody onto the destination chain.

Use the `completeTransfer()` function to finalize the transfer on the destination chain. This requires the destination signer to sign and submit the transaction to the destination chain.

```typescript
  const dstTxids = await xfer.completeTransfer(destination.signer);
  console.log(`Completed Transfer: `, dstTxids);

  console.log('Circle Transfer status: ', xfer);

  process.exit(0);
```

The `dstTxIds` will hold the transaction IDs for the transfer on the destination chain, confirming that the transfer has been completed.

You can find the full code for the manual USDC transfer script below:

???- code "`manual-transfer.ts`"
    ```typescript
    import { wormhole, amount } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner } from './helpers/helpers';

    (async function () {
      const wh = await wormhole('Testnet', [evm, solana]);

      // Set up source and destination chains
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Sepolia');

      // Configure the signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Define the transfer amount (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
      const amt = 100_000n;

      const automatic = false;

      // Create the Circle transfer object
      const xfer = await wh.circleTransfer(
        amt,
        source.address,
        destination.address,
        automatic
      );

      console.log('Circle Transfer object created:', xfer);

      // Initiate the transfer on the source chain (Avalanche)
      console.log('Starting Transfer');
      const srcTxids = await xfer.initiateTransfer(source.signer);
      console.log(`Started Transfer: `, srcTxids);

      // Wait for Circle Attestation (VAA)
      const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)
      console.log('Waiting for Attestation');
      const attestIds = await xfer.fetchAttestation(timeout);
      console.log(`Got Attestation: `, attestIds);

      // Complete the transfer on the destination chain (Sepolia)
      console.log('Completing Transfer');
      const dstTxids = await xfer.completeTransfer(destination.signer);
      console.log(`Completed Transfer: `, dstTxids);

      console.log('Circle Transfer status: ', xfer);

      process.exit(0);
    })();

    ```

### Run Manual Transfer

To execute the manual transfer script, you can use `ts-node` to run the TypeScript file directly

```bash
npx ts-node src/manual-transfer.ts
```

This will initiate the USDC transfer from the source chain (Avalanche) and complete it on the destination chain (Sepolia).

You can monitor the status of the transaction on the [Wormhole explorer](https://wormholescan.io/){target=\_blank}.

### Complete Partial Transfer

In some cases, a manual transfer may start but not finish, possibly because the user terminates their session or an issue arises before the transfer can be completed. The Wormhole SDK allows you to reconstitute the transfer object from the transaction hash on the source chain.

This feature is handy for recovering an incomplete transfer or when debugging.

Here's how you can complete a partial transfer using just the source chain and transaction hash:

```typescript
  const xfer = await CircleTransfer.from(
    wh,
    {
      chain: 'Avalanche',
      txid: '0x6b6d5f101a32aa6d2f7bf0bf14d72bfbf76a640e1b2fdbbeeac5b82069cda4dd',
    },
    timeout
  );

  const dstTxIds = await xfer.completeTransfer(destination.signer);
  console.log('Completed transfer: ', dstTxIds);
```

You will need to provide the below requirements to complete the partial transfer:
 - **Transaction ID (`txId`)**: The transaction hash from the source chain where the transfer was initiated.
 - **Signer for the destination chain (`destination.signer`)**: The wallet or private key that can authorize and complete the transfer on the destination chain. This signer is the same as the `destination.signer` defined in the manual transfer setup.

This allows you to resume the transfer process by rebuilding the transfer object and completing it on the destination chain. It's especially convenient when debugging or handling interrupted transfers.

You can find the full code for the manual USDC transfer script below:

??? code "`partial-transfer.ts`"
    ```typescript
    import { CircleTransfer, wormhole } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner } from '../helpers/helpers';

    (async function () {
      // Initialize the Wormhole object for the Testnet environment and add supported chains (evm and solana)
      const wh = await wormhole('Testnet', [evm, solana]);

      // Grab chain Contexts -- these hold a reference to a cached rpc client
      const rcvChain = wh.getChain('Sepolia');

      // Get signer from local key
      const destination = await getSigner(rcvChain);

      const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)

      // Rebuild the transfer from the source txid
      const xfer = await CircleTransfer.from(
        wh,
        {
          chain: 'Avalanche',
          txid: '0x6b6d5f101a32aa6d2f7bf0bf14d72bfbf76a640e1b2fdbbeeac5b82069cda4dd',
        },
        timeout
      );

      const dstTxIds = await xfer.completeTransfer(destination.signer);
      console.log('Completed transfer: ', dstTxIds);

      console.log('Circle Transfer status: ', xfer);

      process.exit(0);
    })();

    ```

## Automatic Transfers

In an automatic CCTP transfer, you submit one transaction on the source chain, and Wormhole's relayer does the rest: it observes the Wormhole message and Circle burn, obtains the required attestations, and submits them on the destination chain to mint native USDC. You don't fetch a VAA or Circle attestation or call redeem, the relayer finalizes (and can handle destination gas). 

This section will guide you through performing an automatic USDC transfer across chains using the Wormhole SDK and Circle's CCTP.

![Automatic CCTP transfer flow and architecture](/docs/images/products/cctp/tutorials/automatic-cctp.webp#only-dark)
![Automatic CCTP transfer flow and architecture](/docs/images/products/cctp/tutorials/automatic-cctp-light.webp#only-light)

### Set Up the Transfer Environment

#### Configure Transfer Details

The setup for automatic transfers is similar to manual transfers, with the key difference being that the `automatic` flag is `true`. This indicates that Wormhole will handle the attestation and finalization steps for you.

```typescript
  const automatic = true;
```

#### Set Native Gas Amount

Optionally include a native gas drop for the destination, allowing your receiver to execute without pre-funding. Specify the amount in the destination chain's native token (wei); use 0 to skip.

```typescript
  const nativeGas = amount.units(amount.parse('0.1', 6));
```

#### Initiate the Transfer

The transfer process is the same as that for manual transfers. You create the transfer object and then start the transfer on the source chain.

```typescript
  const xfer = await wh.circleTransfer(
    amt,
    source.address,
    destination.address,
    automatic,
    undefined,
    nativeGas
  );
```

#### Log Transfer Details

After initiating the transfer, you can log the transaction IDs for both the source and destination chains. This will help you track the progress of the transfer.

```typescript
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  process.exit(0);
```

You can find the full code for the automatic USDC transfer script below:

??? code "`automatic-transfer.ts`"
    ```typescript
    import { wormhole, amount } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner } from '../helpers/helpers';

    (async function () {
      // Initialize the Wormhole object for the Testnet environment and add supported chains (evm and solana)
      const wh = await wormhole('Testnet', [evm, solana]);

      // Set up source and destination chains
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Sepolia');

      // Configure the signers
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Define the transfer amount (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
      const amt = 100_000_001n;

      // Set the automatic transfer
      const automatic = true;

      // Set the native gas amount
      const nativeGas = amount.units(amount.parse('0.1', 6));

      // Create the Circle transfer object (USDC-only)
      const xfer = await wh.circleTransfer(
        amt,
        source.address,
        destination.address,
        automatic,
        undefined,
        nativeGas
      );

      console.log('Circle Transfer object created:', xfer);

      // Initiate the transfer on the source chain (Avalanche)
      console.log('Starting Transfer');
      const srcTxids = await xfer.initiateTransfer(source.signer);
      console.log(`Started Transfer: `, srcTxids);

      process.exit(0);
    })();

    ```

### Run Automatic Transfer

Assuming you have created a new `automatic-transfer.ts` file for automatic transfers under the `src` directory, use the following command to run it with `ts-node`:

```bash
npx ts-node src/automatic-transfer.ts
```

The automatic relayer will take care of fetching the attestation and completing the transfer for you.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in [Wormhole's demo GitHub repository](https://github.com/wormhole-foundation/demo-cctp-transfer){target=\_blank}. The repository includes all the example scripts and configurations needed to perform USDC cross-chain transfers, including manual, automatic, and partial transfers using the Wormhole SDK and Circle's CCTP.

## Conclusion

In this tutorial, you've gained hands-on experience with Circle's CCTP and the Wormhole SDK. You've learned to perform manual and automatic USDC transfers across multiple chains and recover partial transfers if needed.

By following these steps, you've learned how to:

- Set up cross-chain transfers for native USDC between supported chains.
- Handle both manual and automatic relaying of transactions.
- Recover and complete incomplete transfers using the transaction hash and the destination chain's signer.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
