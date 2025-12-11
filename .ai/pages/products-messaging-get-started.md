---
title: Get Started with Messaging
description: Follow this guide to use Wormhole's core protocol to publish a multichain message and return transaction information with VAA identifiers.
categories: Basics, Typescript SDK
url: https://wormhole.com/docs/products/messaging/get-started/
---

# Get Started with Messaging

Wormhole's core functionality allows you to send any data packet from one supported chain to another. This guide demonstrates how to publish your first simple, arbitrary data message from an EVM environment source chain using the Wormhole TypeScript SDK's core messaging capabilities. 

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed.
- [Ethers.js](https://docs.ethers.org/v6/getting-started/){target=\_blank} installed (this example uses version 6).
- A small amount of testnet tokens for gas fees. This example uses [Sepolia ETH](https://sepolia-faucet.pk910.de/){target=\_blank} but can be adapted for any supported network.
- A private key for signing blockchain transactions.

## Configure Your Messaging Environment

1. Create a directory and initialize a Node.js project:

    ```bash
    mkdir core-message
    cd core-message
    npm init -y
    ```

2. Install TypeScript, tsx, Node.js type definitions, and Ethers.js:

    ```bash
    npm install --save-dev tsx typescript @types/node ethers
    ```

3. Create a `tsconfig.json` file if you don't have one. You can generate a basic one using the following command:

    ```bash
    npx tsc --init
    ```

    Make sure your `tsconfig.json` includes the following settings:

    ```json 
    {
        "compilerOptions": {
            // es2020 or newer
            "target": "es2020",
            // Use esnext if you configured your package.json with type: "module"
            "module": "commonjs",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true,
            "resolveJsonModule": true
            }
    }
    ```

4. Install the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}. This example uses the SDK version `4.1.0`:

    ```bash
    npm install @wormhole-foundation/sdk@4.1.0
    ```

5. Create a new file named `main.ts`:

    ```bash
    touch main.ts
    ```

## Construct and Publish Your Message

1. Open `main.ts` and update the code there as follows:

    ```ts title="main.ts"
    import {
      wormhole,
      signSendWait,
      toNative,
      encoding,
      type Chain,
      type Network,
      type NativeAddress,
      type WormholeMessageId,
      type UnsignedTransaction,
      type TransactionId,
      type WormholeCore,
      type Signer as WormholeSdkSigner,
      type ChainContext,
    } from '@wormhole-foundation/sdk';
    // Platform-specific modules
    import EvmPlatformLoader from '@wormhole-foundation/sdk/evm';
    import { getEvmSigner } from '@wormhole-foundation/sdk-evm';
    import { Wallet, JsonRpcProvider, Signer as EthersSigner } from 'ethers';

    /**
     * The required value (SEPOLIA_PRIVATE_KEY) must
     * be loaded securely beforehand, for example via a keystore, secrets
     * manager, or environment variables (not recommended).
     */

    const SEPOLIA_PRIVATE_KEY = SEPOLIA_PRIVATE_KEY!;
    // Provide a private endpoint RPC URL for Sepolia, defaults to a public node
    // if not set
    const RPC_URL =
      process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

    async function main() {
      // Initialize Wormhole SDK
      const network = 'Testnet';
      const wh = await wormhole(network, [EvmPlatformLoader]);
      console.log('Wormhole SDK Initialized.');

      // Get the EVM signer and provider
      let ethersJsSigner: EthersSigner;
      let ethersJsProvider: JsonRpcProvider;

      try {
        if (!SEPOLIA_PRIVATE_KEY) {
          console.error('Please set the SEPOLIA_PRIVATE_KEY environment variable.');
          process.exit(1);
        }

        ethersJsProvider = new JsonRpcProvider(RPC_URL);
        const wallet = new Wallet(SEPOLIA_PRIVATE_KEY);
        ethersJsSigner = wallet.connect(ethersJsProvider);
        console.log(
          `Ethers.js Signer obtained for address: ${await ethersJsSigner.getAddress()}`
        );
      } catch (error) {
        console.error('Failed to get Ethers.js signer and provider:', error);
        process.exit(1);
      }

      // Define the source chain context
      const sourceChainName: Chain = 'Sepolia';
      const sourceChainContext = wh.getChain(sourceChainName) as ChainContext<
        'Testnet',
        'Sepolia',
        'Evm'
      >;
      console.log(`Source chain context obtained for: ${sourceChainContext.chain}`);

      // Get the Wormhole SDK signer, which is a wrapper around the Ethers.js
      // signer using the Wormhole SDK's signing and transaction handling
      // capabilities
      let sdkSigner: WormholeSdkSigner<Network, Chain>;
      try {
        sdkSigner = await getEvmSigner(ethersJsProvider, ethersJsSigner);
        console.log(
          `Wormhole SDK Signer obtained for address: ${sdkSigner.address()}`
        );
      } catch (error) {
        console.error('Failed to get Wormhole SDK Signer:', error);
        process.exit(1);
      }

      // Construct your message payload
      const messageText = `HelloWormholeSDK-${Date.now()}`;
      const payload: Uint8Array = encoding.bytes.encode(messageText);
      console.log(`Message to send: "${messageText}"`);

      // Define message parameters
      const messageNonce = Math.floor(Math.random() * 1_000_000_000);
      const consistencyLevel = 1;

      try {
        // Get the core protocol client
        const coreProtocolClient: WormholeCore<Network> =
          await sourceChainContext.getWormholeCore();

        // Generate the unsigned transactions
        const whSignerAddress: NativeAddress<Chain> = toNative(
          sdkSigner.chain(),
          sdkSigner.address()
        );
        console.log(
          `Preparing to publish message from ${whSignerAddress.toString()} on ${
            sourceChainContext.chain
          }...`
        );

        const unsignedTxs: AsyncGenerator<UnsignedTransaction<Network, Chain>> =
          coreProtocolClient.publishMessage(
            whSignerAddress,
            payload,
            messageNonce,
            consistencyLevel
          );

        // Sign and send the transactions
        console.log(
          'Signing and sending the message publication transaction(s)...'
        );
        const txIds: TransactionId[] = await signSendWait(
          sourceChainContext,
          unsignedTxs,
          sdkSigner
        );

        if (!txIds || txIds.length === 0) {
          throw new Error('No transaction IDs were returned from signSendWait.');
        }
        const primaryTxIdObject = txIds[txIds.length - 1];
        const primaryTxid = primaryTxIdObject.txid;

        console.log(`Primary transaction ID for parsing: ${primaryTxid}`);
        console.log(
          `View on Sepolia Etherscan: https://sepolia.etherscan.io/tx/${primaryTxid}`
        );

        console.log(
          '\nWaiting a few seconds for transaction to propagate before parsing...'
        );
        await new Promise((resolve) => setTimeout(resolve, 8000));

        // Retrieve VAA identifiers
        console.log(
          `Attempting to parse VAA identifiers from transaction: ${primaryTxid}...`
        );
        const messageIds: WormholeMessageId[] =
          await sourceChainContext.parseTransaction(primaryTxid);

        if (messageIds && messageIds.length > 0) {
          const wormholeMessageId = messageIds[0];
          console.log('--- VAA Identifiers (WormholeMessageId) ---');
          console.log('  Emitter Chain:', wormholeMessageId.chain);
          console.log('  Emitter Address:', wormholeMessageId.emitter.toString());
          console.log('  Sequence:', wormholeMessageId.sequence.toString());
          console.log('-----------------------------------------');
        } else {
          console.error(
            `Could not parse Wormhole message IDs from transaction ${primaryTxid}.`
          );
        }
      } catch (error) {
        console.error(
          'Error during message publishing or VAA identifier retrieval:',
          error
        );
        if (error instanceof Error && error.stack) {
          console.error('Stack Trace:', error.stack);
        }
      }
    }

    main().catch((e) => {
      console.error('Critical error in main function (outer catch):', e);
      if (e instanceof Error && e.stack) {
        console.error('Stack Trace:', e.stack);
      }
      process.exit(1);
    });

    ```

    This script initializes the SDK, defines values for the source chain, creates an EVM signer, constructs the message, uses the core protocol to generate, sign, and send the transaction, and returns the VAA identifiers upon successful publication of the message.

2. Run the script using the following command:

    ```bash
    npx tsx main.ts
    ```

    You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
      <span data-ty="input"><span class="file-path"></span>npx tsx main.ts</span>
      <span data-ty>Wormhole SDK Initialized.</span>
      <span data-ty>Ethers.js Signer obtained for address: 0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12</span>
      <span data-ty>Source chain context obtained for: Sepolia</span>
      <span data-ty>Wormhole SDK Signer obtained for address: 0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12</span>
      <span data-ty>Message to send: "HelloWormholeSDK-1748362375390"</span>
      <span data-ty>Preparing to publish message from 0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12 on Sepolia...</span>
      <span data-ty>Signing and sending the message publication transaction(s)...</span>
      <span data-ty>Primary Transaction ID for parsing: 0xeb34f35f91c72e4e5198509071d24fd25d8a979aa93e2f168de075e3568e1508</span>
      <span data-ty>View on Sepolia Etherscan: https://sepolia.etherscan.io/tx/0xeb34f35f91c72e4e5198509071d24fd25d8a979aa93e2f168de075e3568e1508</span>
      <span data-ty>Waiting a few seconds for transaction to propagate before parsing...</span>
      <span data-ty>Attempting to parse VAA identifiers from transaction:
        0xeb34f35f91c72e4e5198509071d24fd25d8a979aa93e2f168de075e3568e1508...</span>
      <span data-ty>--- VAA Identifiers (WormholeMessageId) ---</span>
      <span data-ty> Emitter Chain: Sepolia</span>
      <span data-ty> Emitter Address: 0x000000000000000000000000cd8bcd9a793a7381b3c66c763c3f463f70de4e12</span>
      <span data-ty> Sequence: 1</span>
      <span data-ty>-----------------------------------------</span>
      <span data-ty="input"><span class="file-path"></span></span>
    </div>
3. Make a note of the transaction ID and VAA identifier values. You can use the transaction ID to [view the transaction on Wormholescan](https://wormholescan.io/#/tx/0xeb34f35f91c72e4e5198509071d24fd25d8a979aa93e2f168de075e3568e1508?network=Testnet){target=\_blank}. The emitter chain, emitter address, and sequence values are used to retrieve and decode signed messages.

Congratulations! You've published your first multichain message using Wormhole's TypeScript SDK and core protocol functionality. Consider the following options to build upon what you've accomplished. 

## Next Steps

- **[Get Started with WTT](/docs/products/token-transfers/wrapped-token-transfers/get-started/){target=\_blank}**: Follow this guide to start working with multichain token transfers using Wormhole Wrapped Token Transfers' lock and mint mechanism to send tokens across chains.
- **[Explore the Wormhole Dev Arena](https://arena.wormhole.com/){target=\_blank}**: A structured learning hub with hands-on tutorials across the Wormhole ecosystem.
