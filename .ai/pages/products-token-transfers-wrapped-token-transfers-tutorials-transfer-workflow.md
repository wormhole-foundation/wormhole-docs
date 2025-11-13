---
title: Transfer Tokens via Wrapped Token Transfers (WTT) Tutorial
description: Learn to build a cross-chain native token transfer app using Wormhole’s TypeScript SDK, supporting native token transfers across EVM and non-EVM chains
categories: WTT, Transfers
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/tutorials/transfer-workflow/
---

# Complete Token Transfer Workflow

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-basic-ts-sdk/){target=\_blank}

This tutorial guides you through building a cross-chain token transfer application using the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} and its [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} protocol. The WTT protocol enables secure and efficient cross-chain asset transfers across different blockchain networks, allowing users to move tokens seamlessly.

By leveraging Wormhole’s WTT, this guide shows you how to build an application that supports multiple transfer types:

 - EVM to EVM (e.g., Ethereum to Avalanche)
 - EVM to non-EVM chains (e.g., Ethereum to Solana)
 - Non-EVM to EVM chains (e.g., Sui to Avalanche)
 - Non-EVM to non-EVM chains (e.g., Solana to Sui)

Existing solutions for cross-chain transfers can be complex and inefficient, requiring multiple steps and transaction fees. However, the WTT protocol from Wormhole simplifies the process by handling the underlying attestation, transaction validation, and message passing across blockchains.

At the end of this guide, you’ll have a fully functional setup for transferring assets across chains using Wormhole’s WTT protocol.

If your goal is to transfer native USDC between chains that support CCTP, we recommend using the [CCTP protocol](/docs/products/cctp-bridge/overview/){target=\_blank}. WTT is intended for other assets or for USDC on chains where CCTP is not available.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

![Manual WTT transfer flow and architecture](/docs/images/products/wrapped-token-transfers/tutorials/transfer-workflow/manual-wtt.webp#only-dark)
![Manual WTT transfer flow and architecture](/docs/images/products/wrapped-token-transfers/tutorials/transfer-workflow/manual-wtt-light.webp#only-light)

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
 - Native tokens (testnet or mainnet) in Solana and Sui wallets.
 - A wallet with a private key, funded with native tokens (testnet or mainnet) for gas fees.
 - **Sui token compatibility**: If you're working with custom Sui tokens, ensure they are created with the legacy `CoinMetadata` type for WTT. Once created, the token can be migrated to the `Currency` standard, but the legacy `CoinMetadata` type must exist initially.

## Supported Chains

The Wormhole SDK supports a wide range of EVM and non-EVM chains, allowing you to facilitate cross-chain transfers efficiently. You can find a complete list of supported chains on the [Supported Networks](/docs/products/reference/supported-networks/#wtt){target=\_blank} page, which includes every network where WTT is supported, across both mainnet and testnet.

## Project Setup

In this section, we’ll guide you through initializing the project, installing dependencies, and preparing your environment for cross-chain transfers.

1. **Initialize the project**: Start by creating a new directory for your project and initializing it with `npm`, which will create the `package.json` file for your project.

    ```bash
    mkdir native-transfers
    cd native-transfers
    npm init -y
    ```

2. **Install dependencies**: Install the required dependencies. This tutorial uses the SDK version `3.11.0`:

    ```bash
    npm install @wormhole-foundation/sdk@3.11.0 tsx
    ```

3. **Set up secure access to your wallets**: This guide assumes you are loading your `SOL_PRIVATE_KEY`, `EVM_PRIVATE_KEY` and `SUI_MNEMONIC` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. **Create a `helpers.ts` file**: To simplify the interaction between chains, create a file to store utility functions for fetching your private key, setting up signers for different chains, and managing transaction relays.

    1. Create the helpers file.

        ```bash
        mkdir -p src/helpers
        touch src/helpers/helpers.ts
        ```

    2. Open the `helpers.ts` file and add the following code.

        ```typescript
        import {
          ChainAddress,
          ChainContext,
          Network,
          Signer,
          Wormhole,
          Chain,
          TokenId,
          isTokenId,
        } from '@wormhole-foundation/sdk';
        import evm from '@wormhole-foundation/sdk/evm';
        import solana from '@wormhole-foundation/sdk/solana';
        import sui from '@wormhole-foundation/sdk/sui';
        import aptos from '@wormhole-foundation/sdk/aptos';
        import { config } from 'dotenv';
        config();

        export interface SignerStuff<N extends Network, C extends Chain> {
          chain: ChainContext<N, C>;
          signer: Signer<N, C>;
          address: ChainAddress<C>;
        }

        // Signer setup function for different blockchain platforms
        export async function getSigner<N extends Network, C extends Chain>(
          chain: ChainContext<N, C>,
          gasLimit?: bigint
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
              const evmSignerOptions = gasLimit ? { gasLimit } : {};
              signer = await (
                await evm()
              ).getSigner(await chain.getRpc(), 'ETH_PRIVATE_KEY', evmSignerOptions);
              break;
            case 'Sui':
              signer = await (
                await sui()
              ).getSigner(await chain.getRpc(), 'SUI_MNEMONIC');
              break;
            case 'Aptos':
              signer = await (
                await aptos()
              ).getSigner(await chain.getRpc(), 'APTOS_PRIVATE_KEY');
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

        export async function getTokenDecimals<
          N extends 'Mainnet' | 'Testnet' | 'Devnet'
        >(
          wh: Wormhole<N>,
          token: TokenId,
          sendChain: ChainContext<N, any>
        ): Promise<number> {
          return isTokenId(token)
            ? Number(await wh.getDecimals(token.chain, token.address))
            : sendChain.config.nativeTokenDecimals;
        }

        ```

        - **`getSigner`**: Based on the chain you're working with (EVM, Solana, Sui, etc.), this function retrieves a signer for that specific platform. The signer is responsible for signing transactions and interacting with the blockchain. It securely uses the private key stored in your `.env` file.
        - **`getTokenDecimals`**: Fetches the number of decimals for a token on a specific chain. It helps handle token amounts accurately during transfers.

## Check and Create Wrapped Tokens

Before tokens are transferred across chains, it should be checked whether a wrapped version exists on the destination chain. If not, an attestation must be generated to wrap it so it can be sent and received on that chain.

In this section, you'll create a script that automates this process by checking whether Arbitrum Sepolia has a wrapped version on Base Sepolia and registering it if needed.

### Configure the Wrapped Token Script

1. **Create the `create-wrapped.ts` file**: Set up the script file that will handle checking and wrapping tokens in the `src` directory.

    ```bash
    mkdir -p src/scripts
    touch src/scripts/create-wrapped.ts
    ```

2. **Open `create-wrapped.ts` and import the required modules**: Import the necessary SDK modules to interact with Wormhole, EVM, Solana, and Sui chains, as well as helper functions for signing and sending transactions.

    ```typescript
    import { Wormhole, signSendWait, wormhole } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import { inspect } from 'util';
    import { getSigner } from '../helpers/helpers';
    ```

3. **Initialize the Wormhole SDK**: Initialize the `wormhole` function for the `Testnet` environment and specify the platforms (EVM, Solana, and Sui) to support.

    ```typescript
    (async function () {
      const wh = await wormhole('Testnet', [evm, solana, sui]);
    ```

    !!! note
        You can replace `'Testnet'` with `'Mainnet'` if you want to perform transfers on mainnet.

4. **Configure transfer parameters**: Specify Arbitrum Sepolia as the source chain and Base Sepolia as the destination, retrieve the token ID from the source chain for transfer, and set the gas limit (optional).

    ```typescript
      const srcChain = wh.getChain('ArbitrumSepolia');
      const destChain = wh.getChain('BaseSepolia');
      const token = await srcChain.getNativeWrappedTokenId();
      const gasLimit = BigInt(2_500_000);
    ```

5. **Set up the destination chain signer**: The signer authorizes transactions, such as submitting the attestation.

    ```typescript
      const { signer: destSigner } = await getSigner(destChain, gasLimit);
    ```

6. **Check if the token is wrapped on the destination chain**: Verify if the token already exists as a wrapped asset before creating an attestation.

    ```typescript
      const tbDest = await destChain.getTokenBridge();

      try {
        const wrapped = await tbDest.getWrappedAsset(token);
        console.log(
          `Token already wrapped on ${destChain.chain}. Skipping attestation.`
        );
        return { chain: destChain.chain, address: wrapped };
      } catch (e) {
        console.log(
          `No wrapped token found on ${destChain.chain}. Proceeding with attestation.`
        );
      }
    ```

    If the token is already wrapped, the script exits, and you may proceed to the [next section](/docs/products/token-transfers/wrapped-token-transfers/tutorials/transfer-workflow/#token-transfers). Otherwise, an attestation must be generated.

7. **Set up the source chain signer**: The signer creates and submits the attestation transaction.

    ```typescript
      const { signer: origSigner } = await getSigner(srcChain);
    ```

8. **Create an attestation transaction**: Generate and send an attestation for the token on the source chain to register it on the destination chain, then save the transaction ID to verify the attestation in the next step.

    ```typescript
      const tbOrig = await srcChain.getTokenBridge();
      const attestTxns = tbOrig.createAttestation(
        token.address,
        Wormhole.parseAddress(origSigner.chain(), origSigner.address())
      );

      const txids = await signSendWait(srcChain, attestTxns, origSigner);
      console.log('txids: ', inspect(txids, { depth: null }));
      const txid = txids[0]!.txid;
      console.log('Created attestation (save this): ', txid);
    ```

9. **Retrieve the signed VAA**: Once the attestation transaction is confirmed, use `parseTransaction(txid)` to extract Wormhole messages, then retrieve the signed VAA from the messages. The timeout defines how long to wait for the VAA before failure.

    ```typescript
      const msgs = await srcChain.parseTransaction(txid);
      console.log('Parsed Messages:', msgs);

      const timeout = 25 * 60 * 1000;
      const vaa = await wh.getVaa(msgs[0]!, 'TokenBridge:AttestMeta', timeout);
      if (!vaa) {
        throw new Error(
          'VAA not found after retries exhausted. Try extending the timeout.'
        );
      }
    ```

10. **Submit the attestation on the destination chain**: Submit the signed VAA using `submitAttestation(vaa, recipient)` to create the wrapped token on the destination chain, then send the transaction and await confirmation.

    ```typescript
      const subAttestation = tbDest.submitAttestation(
        vaa,
        Wormhole.parseAddress(destSigner.chain(), destSigner.address())
      );

      const tsx = await signSendWait(destChain, subAttestation, destSigner);
    ```

11. **Wait for the wrapped asset to be available**: Poll until the wrapped token is available on the destination chain.

    ```typescript
      async function waitForIt() {
        do {
          try {
            const wrapped = await tbDest.getWrappedAsset(token);
            return { chain: destChain.chain, address: wrapped };
          } catch (e) {
            console.error('Wrapped asset not found yet. Retrying...');
          }
          console.log('Waiting before checking again...');
          await new Promise((r) => setTimeout(r, 2000));
        } while (true);
      }

      console.log('Wrapped Asset: ', await waitForIt());
    })().catch((e) => console.error(e));
    ```

    If the token is not found, it logs a message and retries after a short delay. Once the wrapped asset is detected, its address is returned.

??? code "Complete script"
    ```typescript
    import { Wormhole, signSendWait, wormhole } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import { inspect } from 'util';
    import { getSigner } from '../helpers/helpers';

    (async function () {
      const wh = await wormhole('Testnet', [evm, solana, sui]);

      // Define the source and destination chains
      const srcChain = wh.getChain('ArbitrumSepolia');
      const destChain = wh.getChain('BaseSepolia');
      const token = await srcChain.getNativeWrappedTokenId();
      const gasLimit = BigInt(2_500_000);

      // Destination chain signer setup
      const { signer: destSigner } = await getSigner(destChain, gasLimit);
      const tbDest = await destChain.getTokenBridge();

      try {
        const wrapped = await tbDest.getWrappedAsset(token);
        console.log(
          `Token already wrapped on ${destChain.chain}. Skipping attestation.`
        );
        return { chain: destChain.chain, address: wrapped };
      } catch (e) {
        console.log(
          `No wrapped token found on ${destChain.chain}. Proceeding with attestation.`
        );
      }

      // Source chain signer setup
      const { signer: origSigner } = await getSigner(srcChain);

      // Create an attestation transaction on the source chain
      const tbOrig = await srcChain.getTokenBridge();
      const attestTxns = tbOrig.createAttestation(
        token.address,
        Wormhole.parseAddress(origSigner.chain(), origSigner.address())
      );

      const txids = await signSendWait(srcChain, attestTxns, origSigner);
      console.log('txids: ', inspect(txids, { depth: null }));
      const txid = txids[0]!.txid;
      console.log('Created attestation (save this): ', txid);

      // Retrieve the Wormhole message ID from the attestation transaction
      const msgs = await srcChain.parseTransaction(txid);
      console.log('Parsed Messages:', msgs);

      const timeout = 25 * 60 * 1000;
      const vaa = await wh.getVaa(msgs[0]!, 'TokenBridge:AttestMeta', timeout);
      if (!vaa) {
        throw new Error(
          'VAA not found after retries exhausted. Try extending the timeout.'
        );
      }

      console.log('Token Address: ', vaa.payload.token.address);

      // Submit the attestation on the destination chain
      console.log('Attesting asset on destination chain...');

      const subAttestation = tbDest.submitAttestation(
        vaa,
        Wormhole.parseAddress(destSigner.chain(), destSigner.address())
      );

      const tsx = await signSendWait(destChain, subAttestation, destSigner);
      console.log('Transaction hash: ', tsx);

      // Poll for the wrapped asset until it's available
      async function waitForIt() {
        do {
          try {
            const wrapped = await tbDest.getWrappedAsset(token);
            return { chain: destChain.chain, address: wrapped };
          } catch (e) {
            console.error('Wrapped asset not found yet. Retrying...');
          }
          console.log('Waiting before checking again...');
          await new Promise((r) => setTimeout(r, 2000));
        } while (true);
      }

      console.log('Wrapped Asset: ', await waitForIt());
    })().catch((e) => console.error(e));

    ```

### Run the Wrapped Token Creation

Once the script is ready, execute it with:

```bash
npx tsx src/scripts/create-wrapped.ts
```

If the token is already wrapped, the script exits. Otherwise, it generates an attestation and submits it. Once complete, you’re ready to transfer tokens across chains.

## Token Transfers

In this section, you'll create a script to transfer native tokens across chains using Wormhole's WTT protocol. The script will handle the transfer of Sui native tokens to Solana, demonstrating the seamless cross-chain transfer capabilities of the Wormhole SDK. Since both chains are non-EVM compatible, you'll need to manually handle the attestation and finalization steps.

### Configure Transfer Details

Before initiating a cross-chain transfer, you must set up the chain context and signers for both the source and destination chains.

1. Create the `native-transfer.ts` file in the `src` directory to hold your script for transferring native tokens across chains.

    ```bash
    touch src/scripts/native-transfer.ts
    ```

2. Open the `native-transfer.ts` file and begin by importing the necessary modules from the SDK and helper files.

    ```typescript
    import {
      Chain,
      Network,
      Wormhole,
      amount,
      wormhole,
      TokenId,
      TokenTransfer,
    } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import { SignerStuff, getSigner, getTokenDecimals } from '../helpers/helpers';

    ```

3. **Initialize the Wormhole SDK**: Initialize the `wormhole` function for the `Testnet` environment and specify the platforms (EVM, Solana, and Sui) to support.

    ```typescript
    (async function () {
      const wh = await wormhole('Testnet', [evm, solana, sui]);
    ```

4. **Set up source and destination chains**: Specify the source chain (Sui) and the destination chain (Solana) using the `getChain` method. This allows us to define where to send the native tokens and where to receive them.

    ```typescript
      const sendChain = wh.getChain('Sui');
      const rcvChain = wh.getChain('Solana');
    ```

5. **Configure the signers**: Use the `getSigner` function to retrieve the signers responsible for signing transactions on the respective chains. This ensures that transactions are correctly authorized on both the source and destination chains.

    ```typescript
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);
    ```

6. **Define the token to transfer**: Specify the native token on the source chain (Sui in this example) by creating a `TokenId` object.

    ```typescript
      const token = Wormhole.tokenId(sendChain.chain, 'native');
    ```

7. **Define the transfer amount**: The amount of native tokens to transfer is specified. In this case, we're transferring 1 unit.

    ```typescript
      const amt = '1';
    ```

8. **Set transfer mode**: Specify manual or automatic transfer using `route`. Set `route  = 'TokenBridge'` for manual transfers, where you will handle the attestation and finalization steps yourself. To use automatic relaying on EVM chains, set `route = 'AutomaticTokenBridge'`.

    ```typescript
      const route = 'TokenBridge';
    ```

    !!! note
        Automatic transfers are only supported for EVM chains. For non-EVM chains, such as Solana and Sui, you must manually handle the attestation and finalization steps.
    
9. **Define decimals**: Fetch the number of decimals for the token on the source chain (Sui) using the `getTokenDecimals` function.

    ```typescript
      const decimals = await getTokenDecimals(wh, token, sendChain);
    ```

10. **Perform the token transfer and exit the process**: Initiate the transfer by calling the `tokenTransfer` function, which we’ll define in the next step. This function takes an object containing all required details for executing the transfer, including the `source` and `destination` chains, `token`, `mode`, and transfer `amount`.

    ```typescript
      const xfer = await tokenTransfer(wh, {
        token,
        amount: amount.units(amount.parse(amt, decimals)),
        source,
        destination,
        route,
      });
    ```

    Finally, we use `process.exit(0);` to close the script once the transfer completes.

    ```typescript
      process.exit(0);
    })();
    ```

### Token Transfer Logic

This section defines the `tokenTransfer` function, which manages the core steps for executing cross-chain transfers. This function will handle initiating the transfer on the source chain, retrieving the attestation, and completing the transfer on the destination chain.

#### Defining the Token Transfer Function

The `tokenTransfer` function initiates and manages the transfer process, handling all necessary steps to move tokens across chains with the Wormhole SDK. This function uses types from the SDK and our `helpers.ts` file to ensure chain compatibility.

```typescript
async function tokenTransfer<N extends Network>(
  wh: Wormhole<N>,
  route: {
    token: TokenId;
    amount: bigint;
    source: SignerStuff<N, Chain>;
    destination: SignerStuff<N, Chain>;
    route: string;
    payload?: Uint8Array;
  }
) {
  // Token Transfer Logic
}

```

#### Steps to Transfer Tokens

The `tokenTransfer` function comprises several key steps to facilitate cross-chain transfers. Let’s break down each step:

1. **Initialize the transfer object**: The `tokenTransfer` function begins by creating a `TokenTransfer` object, `xfer`, which tracks the state of the transfer process and provides access to relevant methods for each transfer step.

    ```typescript
      const xfer = await wh.tokenTransfer(
        route.token,
        route.amount,
        route.source.address,
        route.destination.address,
        route.route,
        route.payload
      );
    ```

2. **Estimate transfer fees and validate amount**: We obtain a fee quote for the transfer before proceeding. This step is significant in automatic mode (`automatic = true`), where the quote will include additional fees for relaying.

    ```typescript
      const quote = await TokenTransfer.quoteTransfer(
        wh,
        route.source.chain,
        route.destination.chain,
        xfer.transfer
      );

      if (xfer.transfer.route === 'AutomaticTokenBridge' && quote.destinationToken.amount < 0)
        throw 'The amount requested is too low to cover the fee and any native gas requested.';
    ```

3. **Submit the transaction to the source chain**: Initiate the transfer on the source chain by submitting the transaction using `route.source.signer`, starting the token transfer process.

    ```typescript
      const srcTxids = await xfer.initiateTransfer(route.source.signer);
      console.log(`Source Trasaction ID: ${srcTxids[0]}`);
    ```

     - **`srcTxids`**: The resulting transaction IDs are printed to the console. These IDs can be used to track the transfer’s progress on the source chain and [Wormhole network](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

    ???- note "How Cross-Chain Transfers Work in the Background"
        When `xfer.initiateTransfer(route.source.signer)` is called, it initiates the transfer on the source chain. Here’s what happens in the background:

         - **Token lock or burn**: Tokens are either locked in a smart contract or burned on the source chain, representing the transfer amount.
         - **VAA creation**: Wormhole’s network of Guardians generates a Verifiable Action Approval (VAA)—a signed proof of the transaction, which ensures it’s recognized across chains.
         - **Tracking the transfer**: The returned transaction IDs allow you to track the transfer's progress both on the source chain and within Wormhole’s network.
         - **Redemption on destination**: Once detected, the VAA is used to release or mint the corresponding token amount on the destination chain, completing the transfer.

        This process ensures a secure and verifiable transfer across chains, from locking tokens on the source chain to redeeming them on the destination chain.

4. **Wait for the attestation**: Retrieve the Wormhole attestation (VAA), which serves as cryptographic proof of the transfer. In manual mode, you must wait for the VAA before redeeming the transfer on the destination chain.

    ```typescript
      await xfer.fetchAttestation(60_000);
    ```

5. **Complete the transfer on the destination chain**: Redeem the VAA on the destination chain to finalize the transfer.

    ```typescript
      const destTxids = await xfer.completeTransfer(route.destination.signer);
      console.log(`Completed Transfer: `, destTxids);
    ```

??? code "Complete script"
    ```typescript
    import {
      Chain,
      Network,
      Wormhole,
      amount,
      wormhole,
      TokenId,
      TokenTransfer,
    } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import { SignerStuff, getSigner, getTokenDecimals } from '../helpers/helpers';

    (async function () {
      const wh = await wormhole('Testnet', [evm, solana, sui]);

      // Set up source and destination chains
      const sendChain = wh.getChain('Sui');
      const rcvChain = wh.getChain('Solana');

      // Get signer from local key but anything that implements
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Shortcut to allow transferring native gas token
      const token = Wormhole.tokenId(sendChain.chain, 'native');

      // Define the amount of tokens to transfer
      const amt = '1';

      // Set route for manual transfers
      const route = 'TokenBridge';

      // Used to normalize the amount to account for the tokens decimals
      const decimals = await getTokenDecimals(wh, token, sendChain);

      // Perform the token transfer if no recovery transaction ID is provided
      const xfer = await tokenTransfer(wh, {
        token,
        amount: amount.units(amount.parse(amt, decimals)),
        source,
        destination,
        route,
      });

      process.exit(0);
    })();

    async function tokenTransfer<N extends Network>(
      wh: Wormhole<N>,
      route: {
        token: TokenId;
        amount: bigint;
        source: SignerStuff<N, Chain>;
        destination: SignerStuff<N, Chain>;
        route: string;
        payload?: Uint8Array;
      }
    ) {
      // Token Transfer Logic
      // Create a TokenTransfer object to track the state of the transfer over time
      const xfer = await wh.tokenTransfer(
        route.token,
        route.amount,
        route.source.address,
        route.destination.address,
        route.route,
        route.payload
      );

      const quote = await TokenTransfer.quoteTransfer(
        wh,
        route.source.chain,
        route.destination.chain,
        xfer.transfer
      );

      if (xfer.transfer.route === 'AutomaticTokenBridge' && quote.destinationToken.amount < 0)
        throw 'The amount requested is too low to cover the fee and any native gas requested.';

      // Submit the transactions to the source chain, passing a signer to sign any txns
      console.log('Starting transfer');
      const srcTxids = await xfer.initiateTransfer(route.source.signer);
      console.log(`Source Trasaction ID: ${srcTxids[0]}`);
      console.log(`Wormhole Trasaction ID: ${srcTxids[1] ?? srcTxids[0]}`);

      // Wait for the VAA to be signed and ready (not required for auto transfer)
      console.log('Getting Attestation');
      await xfer.fetchAttestation(60_000);

      // Redeem the VAA on the dest chain
      console.log('Completing Transfer');
      const destTxids = await xfer.completeTransfer(route.destination.signer);
      console.log(`Completed Transfer: `, destTxids);
    }

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

You've successfully built a cross-chain token transfer application using Wormhole's TypeScript SDK and the WTT protocol. This guide walks you through the setup, configuration, and transfer logic required to move native tokens across non-EVM chains, such as Sui and Solana.

The same transfer logic will apply if you’d like to extend this application to different chain combinations, including EVM-compatible chains.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
