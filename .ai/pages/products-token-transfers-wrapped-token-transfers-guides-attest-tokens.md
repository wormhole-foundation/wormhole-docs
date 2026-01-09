---
title: Token Attestation
description: Register a token with the Wrapped Token Transfers (WTT) protocol by creating and submitting a token attestation. Required before first-time transfers.
categories: WTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/guides/attest-tokens/
---

# Token Attestation

This guide demonstrates token attestation for registering a token for transfer using the [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} protocol. An attestation of the token's metadata (e.g., symbol, name, decimals) ensures consistent handling by the destination chain for ease of multichain interoperability. These steps are only required the first time a token is sent to a particular destination chain.

Completing this guide will help you accomplish the following:

- Verify if a wrapped version of a token exists on a destination chain.
- Create and submit a token attestation to register a wrapped version of a token on a destination chain.
- Check for the wrapped version to become available on the destination chain and return the wrapped token address.

The example will register an arbitrary ERC-20 token deployed to Moonbase Alpha for transfer to Solana, but can be adapted for any [supported chains](/docs/products/reference/contract-addresses/#wrapped-token-transfers-wtt){target=\_blank}.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
- The contract address for the token you wish to register.
- A wallet setup with the following:
    - Private keys for your source and destination chains.
    - A small amount of gas tokens on your source and destination chains.

## Set Up Your Development Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment for token attestation.

1. Create a new directory and initialize a Node.js project using the following commands:

    ```bash
    mkdir attest-token
    cd attest-token
    npm init -y
    ```

2. Install dependencies, including the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}. This example uses the SDK version `4.7.3`:

    ```bash
    npm install @wormhole-foundation/sdk@4.7.3 -D tsx typescript
    ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create a new file named `helper.ts` to hold signer functions:

    ```bash
    touch helper.ts
    ```

5. Open `helper.ts` and add the following code:

    ```typescript title="helper.ts"
    import {
      Chain,
      ChainAddress,
      ChainContext,
      Wormhole,
      Network,
      Signer,
    } from '@wormhole-foundation/sdk';
    import type { SignAndSendSigner } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';

    /**
     * Returns a signer for the given chain using locally scoped credentials.
     * The required values (EVM_PRIVATE_KEY, SOL_PRIVATE_KEY, SUI_MNEMONIC) must
     * be loaded securely beforehand, for example via a keystore, secrets
     * manager, or environment variables (not recommended).
     */
    export async function getSigner<N extends Network, C extends Chain>(
      chain: ChainContext<N, C>
    ): Promise<{
      chain: ChainContext<N, C>;
      signer: SignAndSendSigner<N, C>;
      address: ChainAddress<C>;
    }> {
      let signer: Signer<any, any>;
      const platform = chain.platform.utils()._platform;

      // Customize the signer by adding or removing platforms as needed. Be sure
      // to import the necessary packages for the platforms you want to support
      switch (platform) {
        case 'Evm':
          signer = await (
            await evm()
          ).getSigner(await chain.getRpc(), EVM_PRIVATE_KEY!);
          break;
        case 'Solana':
          signer = await (
            await solana()
          ).getSigner(await chain.getRpc(), SOL_PRIVATE_KEY!);
          break;
        case 'Sui':
          signer = await (
            await sui()
          ).getSigner(await chain.getRpc(), SUI_MNEMONIC!);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      const typedSigner = signer as SignAndSendSigner<N, C>;

      return {
        chain,
        signer: typedSigner,
        address: Wormhole.chainAddress(chain.chain, signer.address()),
      };
    }

    ```

    You can view the list of [supported platform constants](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/4.7.3/core/base/src/constants/platforms.ts#L6){target=_blank} in the Wormhole SDK GitHub repo.

## Check for a Wrapped Version of a Token

If you are working with a newly created token that you know has never been transferred to the destination chain, you can continue to the [Create Attestation on the Source Chain](#create-attestation-on-the-source-chain) section.

Since attestation is a one-time process, it is good practice when working with existing tokens to incorporate a check for wrapped versions into your WTT flow. Follow these steps to check for a wrapped version of a token:

1. Create a new file called `attest.ts` to hold the wrapped version check and attestation logic:

    ```bash
    touch attest.ts
    ```

2. Open `attest.ts` and add the following code:

    ```typescript title="attest.ts"
    import {
      wormhole,
      Wormhole,
      TokenId,
      TokenAddress,
    } from '@wormhole-foundation/sdk';
    import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner } from './helper';

    async function attestToken() {
      // Initialize wormhole instance, define the network, platforms, and chains
      const wh = await wormhole('Testnet', [evm, solana]);
      const sourceChain = wh.getChain('Moonbeam');
      const destinationChain = wh.getChain('Solana');

      // Define the token to check for a wrapped version
      const tokenId: TokenId = Wormhole.tokenId(
        sourceChain.chain,
        'INSERT_TOKEN_CONTRACT_ADDRESS'
      );
      // Check if the token is registered with the destination chain WTT (Token Bridge) contract
      // Registered = returns the wrapped token ID
      // Not registered = runs the attestation flow to register the token
      let wrappedToken: TokenId;
      try {
        wrappedToken = await wh.getWrappedAsset(destinationChain.chain, tokenId);
        console.log(
          '✅ Token already registered on destination:',
          wrappedToken.address
        );
      } catch (e) {
        // Attestation on the source chain flow code
        console.log(
          '⚠️ Token is NOT registered on destination. Running attestation flow...'
        );
      }
    }

    attestToken().catch((e) => {
      console.error('❌ Error in attestToken', e);
      process.exit(1);
    });

    ```

    After initializing a Wormhole instance and defining the source and destination chains, this code does the following:

    - **Defines the token to check**: Use the contract address on the source chain for this value.
    - **Calls [`getWrappedAsset`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/4.7.3/connect/src/wormhole.ts#L277){target=\_blank}**: Part of the `Wormhole` class, the method does the following:
        - Accepts a [`TokenId`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/4.7.3/platforms/aptos/protocols/tokenBridge/src/types.ts#L12){target=\_blank} representing a token on the source chain.
        - Checks for a corresponding wrapped version of the destination chain's WTT contract.
        - Returns the `TokenId` for the wrapped token on the destination chain if a wrapped version exists.

3. Run the script using the following command:

    ```bash
    npx tsx attest.ts
    ```

4. If the token has a wrapped version registered with the destination chain WTT contract, you will see terminal output similar to the following:

    <div id="termynal" data-termynal>
      <span data-ty="input"><span class="file-path"></span>npx tsx attest.ts</span>
      <span data-ty>✅ Token already registered on destination: SolanaAddress {
        type: 'Native',
        address: PublicKey [PublicKey(2qjSAGrpT2eTb673KuGAR5s6AJfQ1X5Sg177Qzuqt7yB)] {
        _bn: BN: 1b578bb9b7a04a1aab3b5b64b550d8fc4f73ab343c9cf8532d2976b77ec4a8ca
        }
        }</span>
      <span data-ty="input"><span class="file-path"></span></span>
    </div>
    You can safely use WTT to transfer this token to the destination chain.

    If a wrapped version isn't found on the destination chain, your terminal output will be similar to the following, and you must attest the token before transfer:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx attest.ts</span>
    	<span data-ty>⚠️ Token is NOT registered on destination. Running attestation flow...</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>
## Create Attestation on the Source Chain

To create the attestation transaction on the source chain, open `attest.ts` and replace the `// Attestation flow code` comment with the following code:

```typescript title="attest.ts"
    // Retrieve the WTT (Token Bridge) contract text for the source chain
    const tb = await sourceChain.getTokenBridge();
    // Get the signer for the source chain
    const sourceSigner = await getSigner(sourceChain);
    // Define the token to attest and a payer address
    const token: TokenAddress<typeof sourceChain.chain> = toNative(
      sourceChain.chain,
      tokenId.address.toString()
    );
    const payer = toNative(sourceChain.chain, sourceSigner.signer.address());
    // Create a new attestation and sign and send the transaction
    for await (const tx of tb.createAttestation(token, payer)) {
      const txids = await signSendWait(
        sourceChain,
        tb.createAttestation(token),
        sourceSigner.signer
      );
      // Attestation on the destination chain flow code
      console.log('✅ Attestation transaction sent:', txids);
      
```

This code does the following:

- **Gets the source chain WTT context**: This is where the transaction is sent to create the attestation.
- Defines the token to attest and the payer.
- **Calls `createAttestation`**: Defined in the `TokenBridge` interface, the [`createAttestation`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/4.7.3/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L237){target=\_blank} method does the following:
    - Accepts a `TokenAddress` representing the token on its native chain.
    - Accepts an optional `payer` address to cover the transaction fees for the attestation transaction.
    - Prepares an attestation for the token, including metadata such as address, symbol, and decimals.
    - Returns an `AsyncGenerator` that yields unsigned transactions, which are then signed and sent to initiate the attestation process on the source chain.

## Submit Attestation on Destination Chain

The attestation flow finishes with the following: 

- Using the transaction ID returned from the `createAttestation` transaction on the source chain to retrieve the associated signed `TokenBridge:AttestMeta` VAA.
- Submitting the signed VAA to the destination chain to provide Guardian-backed verification of the attestation transaction on the source chain. 
- The destination chain uses the attested metadata to create the wrapped version of the token and register it with its WTT contract.

Follow these steps to complete your attestation flow logic:

1. Add the following code to `attest.ts`:

    ```typescript title="attest.ts"
          // Parse the transaction to get Wormhole message ID
          const messages = await sourceChain.parseTransaction(txids[0].txid);
          console.log('✅ Attestation messages:', messages);
          // Set a timeout for fetching the VAA, this can take several minutes
          // depending on the source chain network and finality
          const timeout = 25 * 60 * 1000;
          // Fetch the VAA for the attestation message
          const vaa = await wh.getVaa(
            messages[0]!,
            'TokenBridge:AttestMeta',
            timeout
          );
          if (!vaa) throw new Error('❌ VAA not found before timeout.');
          // Get the WTT (Token Bridge) contract text for the destination chain
          // and submit the attestation VAA
          const destTb = await destinationChain.getTokenBridge();
          // Get the signer for the destination chain
          const destinationSigner = await getSigner(destinationChain);
          const payer = toNative(
            destinationChain.chain,
            destinationSigner.signer.address()
          );
          const destTxids = await signSendWait(
            destinationChain,
            destTb.submitAttestation(vaa, payer),
            destinationSigner.signer
          );
          console.log('✅ Attestation submitted on destination:', destTxids);
        }
        // Poll for the wrapped token to appear on the destination chain
        const maxAttempts = 50; // ~5 minutes with 6s interval
        const interval = 6000;
        let attempt = 0;
        let registered = false;

        while (attempt < maxAttempts && !registered) {
          attempt++;
          try {
            const wrapped = await wh.getWrappedAsset(
              destinationChain.chain,
              tokenId
            );
            console.log(
              `✅ Wrapped token is now available on ${destinationChain.chain}:`,
              wrapped.address
            );
            registered = true;
          } catch {
            console.log(
              `⏳ Waiting for wrapped token to register on ${destinationChain.chain}...`
            );
            await new Promise((res) => setTimeout(res, interval));
          }
        }
        if (!registered) {
          throw new Error(
            `❌ Token attestation did not complete in time on ${destinationChain.chain}`
          );
        }
        console.log(
          `🚀 Token attestation complete! Token registered with ${destinationChain.chain}.`
        );
    ```

2. Run the script using the following command:

    ```bash
    npx tsx attest.ts
    ```

3. You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
      <span data-ty="input"><span class="file-path"></span>npx tsx attest.ts</span>
      <span data-ty>⚠️ Token is NOT registered on destination. Running attestation
        flow...</span>
      <span data-ty>✅ Attestation transaction sent: [ { chain: 'Moonbeam', txid:
        '0xbaf7429e1099cac6f39ef7e3c30e38776cfb5b6be837dcd8793374c8ee491799' }
        ]</span>
      <span data-ty>✅ Attestation messages: [ { chain: 'Moonbeam', emitter: UniversalAddress {
        address: [Uint8Array] }, sequence: 1507n } ]</span>
      <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 0/750</span>
      <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 1/750</span>
      <span data-ty>.....</span>
      <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 10/750</span>
      <span data-ty>📨 Submitting attestation VAA to Solana...</span>
      <span data-ty>✅ Attestation submitted on destination: [ { chain: 'Solana', txid:
        '3R4oF5P85jK3wKgkRs5jmE8BBLoM4wo2hWSgXXL6kA8efbj2Vj9vfuFSb53xALqYZuv3FnXDwJNuJfiKKDwpDH1r'
        } ]</span>
      <span data-ty>✅ Wrapped token is now available on Solana: SolanaAddress { type:
        'Native', address: PublicKey
        [PublicKey(2qjSAGrpT2eTb673KuGAR5s6AJfQ1X5Sg177Qzuqt7yB)] { _bn: BN:
        1b578bb9b7a04a1aab3b5b64b550d8fc4f73ab343c9cf8532d2976b77ec4a8ca } }</span>
      <span data-ty>🚀 Token attestation complete!</span>
      <span data-ty="input"><span class="file-path"></span></span>
    </div>
    ??? example "View complete script"
        ```typescript title="attest.ts"
        import {
          wormhole,
          Wormhole,
          TokenId,
          TokenAddress,
        } from '@wormhole-foundation/sdk';
        import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
        import evm from '@wormhole-foundation/sdk/evm';
        import solana from '@wormhole-foundation/sdk/solana';
        import { getSigner } from './helper';

        async function attestToken() {
          // Initialize wormhole instance, define the network, platforms, and chains
          const wh = await wormhole('Testnet', [evm, solana]);
          const sourceChain = wh.getChain('Moonbeam');
          const destinationChain = wh.getChain('Solana');

          // Define the token to check for a wrapped version
          const tokenId: TokenId = Wormhole.tokenId(
            sourceChain.chain,
            'INSERT_TOKEN_CONTRACT_ADDRESS'
          );
          // Check if the token is registered with the destination chain WTT (Token Bridge) contract
          // Registered = returns the wrapped token ID
          // Not registered = runs the attestation flow to register the token
          let wrappedToken: TokenId;
          try {
            wrappedToken = await wh.getWrappedAsset(destinationChain.chain, tokenId);
            console.log(
              '✅ Token already registered on destination:',
              wrappedToken.address
            );
          } catch (e) {
            // Attestation on the source chain flow code
            console.log(
              '⚠️ Token is NOT registered on destination. Running attestation flow...'
            );

            // Retrieve the WTT (Token Bridge) contract text for the source chain
            const tb = await sourceChain.getTokenBridge();
            // Get the signer for the source chain
            const sourceSigner = await getSigner(sourceChain);
            // Define the token to attest and a payer address
            const token: TokenAddress<typeof sourceChain.chain> = toNative(
              sourceChain.chain,
              tokenId.address.toString()
            );
            const payer = toNative(sourceChain.chain, sourceSigner.signer.address());
            // Create a new attestation and sign and send the transaction
            for await (const tx of tb.createAttestation(token, payer)) {
              const txids = await signSendWait(
                sourceChain,
                tb.createAttestation(token),
                sourceSigner.signer
              );
              // Attestation on the destination chain flow code
              console.log('✅ Attestation transaction sent:', txids);
              
              // Parse the transaction to get Wormhole message ID
              const messages = await sourceChain.parseTransaction(txids[0].txid);
              console.log('✅ Attestation messages:', messages);
              // Set a timeout for fetching the VAA, this can take several minutes
              // depending on the source chain network and finality
              const timeout = 25 * 60 * 1000;
              // Fetch the VAA for the attestation message
              const vaa = await wh.getVaa(
                messages[0]!,
                'TokenBridge:AttestMeta',
                timeout
              );
              if (!vaa) throw new Error('❌ VAA not found before timeout.');
              // Get the WTT (Token Bridge) contract text for the destination chain
              // and submit the attestation VAA
              const destTb = await destinationChain.getTokenBridge();
              // Get the signer for the destination chain
              const destinationSigner = await getSigner(destinationChain);
              const payer = toNative(
                destinationChain.chain,
                destinationSigner.signer.address()
              );
              const destTxids = await signSendWait(
                destinationChain,
                destTb.submitAttestation(vaa, payer),
                destinationSigner.signer
              );
              console.log('✅ Attestation submitted on destination:', destTxids);
            }
            // Poll for the wrapped token to appear on the destination chain
            const maxAttempts = 50; // ~5 minutes with 6s interval
            const interval = 6000;
            let attempt = 0;
            let registered = false;

            while (attempt < maxAttempts && !registered) {
              attempt++;
              try {
                const wrapped = await wh.getWrappedAsset(
                  destinationChain.chain,
                  tokenId
                );
                console.log(
                  `✅ Wrapped token is now available on ${destinationChain.chain}:`,
                  wrapped.address
                );
                registered = true;
              } catch {
                console.log(
                  `⏳ Waiting for wrapped token to register on ${destinationChain.chain}...`
                );
                await new Promise((res) => setTimeout(res, interval));
              }
            }
            if (!registered) {
              throw new Error(
                `❌ Token attestation did not complete in time on ${destinationChain.chain}`
              );
            }
            console.log(
              `🚀 Token attestation complete! Token registered with ${destinationChain.chain}.`
            );
          }
        }

        attestToken().catch((e) => {
          console.error('❌ Error in attestToken', e);
          process.exit(1);
        });

        ```

Congratulations! You've successfully created and submitted an attestation to register a token for transfer via WTT.

## Next Steps

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Transfer Wrapped Assets**

    ---

    Follow this guide to incorporate token attestation and registration into an end-to-end WTT flow.

    [:custom-arrow: Get Started](/docs/products/token-transfers/wrapped-token-transfers/guides/attest-tokens/)

</div>
