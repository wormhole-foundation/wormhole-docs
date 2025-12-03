---
title: Transfer Wrapped Assets
description: Follow this guide to use Wrapped Token Transfers (WTT). Includes automatic and manual flows, token attestation, VAA fetching, and manual redemption.
categories: WTT, Transfer, Typescript SDK
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/guides/transfer-wrapped-assets/
---

# Transfer Wrapped Assets

This guide demonstrates how to implement [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} protocol via the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}. This example will transfer an arbitrary ERC-20 token from Moonbase Alpha to Solana, but can be adapted for any [supported chains](/docs/products/reference/supported-networks/#wtt){target=\_blank}.

Completing this guide will help you accomplish the following:

- Verify if a wrapped version of a token exists on a destination chain.
- Create a token attestation to register a wrapped version of a token on a destination chain.
- Transfer wrapped assets using WTT's automatic or manual transfers.
- Fetch a signed [Verified Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}.
- Manually redeem a signed VAA to claim tokens on a destination chain.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.
- The Wormhole TypeScript SDK version 3.0 or above.
- The contract address for the ERC-20 token you wish to transfer.
- A wallet setup with the following:
    - Private keys for your source and destination chains.
    - A small amount of gas tokens on your source and destination chains.
    - A balance on your source chain of the ERC-20 token you want to transfer.

## Set Up Your Token Transfer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment for multichain token transfers.

1. Create a new directory and initialize a Node.js project using the following commands:
   ```bash
   mkdir wtt-demo
   cd wtt-demo
   npm init -y
   ```

2. Install dependencies, including the Wormhole TypeScript SDK. This example uses the SDK version `4.1.0`:

   ```bash
   npm install @wormhole-foundation/sdk@4.1.0 -D tsx typescript
   ```

3. Set up secure access to your wallets. This guide assumes you are loading your private key values from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

4. Create a new file named `helpers.ts` to hold signer and decimal functions:
   ```bash
   touch helpers.ts
   ```

5. Open `helpers.ts` and add the following code:
    ```typescript title="helpers.ts"
    import {
      Chain,
      ChainAddress,
      ChainContext,
      isTokenId,
      Wormhole,
      Network,
      Signer,
      TokenId,
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
      chain: ChainContext<N, C>,
      gasLimit?: bigint
    ): Promise<{
      chain: ChainContext<N, C>;
      signer: SignAndSendSigner<N, C>;
      address: ChainAddress<C>;
    }> {
      let signer: Signer<any, any>;
      const platform = chain.platform.utils()._platform;

      // Customize the signer by adding or removing platforms as needed
      // Be sure to import the necessary packages for the platforms you want to support
      switch (platform) {
        case 'Evm':
          const evmSignerOptions = gasLimit ? { gasLimit } : {};
          (signer = await (
            await evm()
          ).getSigner(await chain.getRpc(), EVM_PRIVATE_KEY!)),
            evmSignerOptions;
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

    /**
     * Get the number of decimals for the token on the source chain.
     * This helps convert a user-friendly amount (e.g., '1') into raw units.
     */
    export async function getTokenDecimals<N extends Network>(
      wh: Wormhole<N>,
      token: TokenId,
      chain: ChainContext<N, any>
    ): Promise<number> {
      return isTokenId(token)
        ? Number(await wh.getDecimals(token.chain, token.address))
        : chain.config.nativeTokenDecimals;
    }

    ```

    You can view the [constants for platform names](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/3eae2e91fc3a6fec859eb87cfa85a4c92c65466f/core/base/src/constants/platforms.ts#L6){target=\_blank} in the GitHub repo for a list of supported platforms

## Verify Token Registration (Attestation)

Tokens must be registered on the destination chain before they can be bridged. This process involves submitting an attestation with the native token metadata to the destination chain, which enables the destination chain's WTT contract to create a corresponding wrapped version with the same attributes as the native token.

Registration via attestation is only required the first time a given token is sent to that specific destination chain. Follow these steps to check the registration status of a token:

1. Create a new file named `transfer.ts`:
   ```bash
   touch transfer.ts
   ```

2. Open your `transfer.ts` file and add the following code:
    ```typescript title="transfer.ts"
    import { wormhole, Wormhole, TokenId } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import { getSigner, getTokenDecimals } from './helpers';

    async function transferTokens() {
      // Initialize wh instance
      const wh = await wormhole('Testnet', [evm, solana]);
      // Define sourceChain and destinationChain, get chain contexts
      const sourceChain = wh.getChain('Moonbeam');
      const destinationChain = wh.getChain('Solana');
      // Load signers for both chains
      const sourceSigner = await getSigner(sourceChain);
      const destinationSigner = await getSigner(destinationChain);

      // Define token and amount to transfer
      const tokenId: TokenId = Wormhole.tokenId(
        sourceChain.chain,
        'INSERT_TOKEN_CONTRACT_ADDRESS'
      );
      // Replace with amount you want to transfer
      // This is a human-readable number, e.g., 0.2 for 0.2 tokens
      const amount = INSERT_AMOUNT;
      // Convert to raw units based on token decimals
      const decimals = await getTokenDecimals(wh, tokenId, sourceChain);
      const transferAmount = BigInt(Math.floor(amount * 10 ** decimals));

      // Check if the token is registered with destinationChain WTT (Token Bridge) contract
      // Registered = returns the wrapped token ID, continues with transfer
      // Not registered = runs the attestation flow to register the token
      let wrappedToken: TokenId;
      try {
        wrappedToken = await wh.getWrappedAsset(destinationChain.chain, tokenId);
        console.log(
          '✅ Token already registered on destination:',
          wrappedToken.address
        );
      } catch (e) {
        console.log(
          '⚠️ Token is NOT registered on destination. Attestation required before transfer can proceed...'
        );
      }
      // Insert Initiate Transfer on Source Chain code
    }

    transferTokens().catch((e) => {
      console.error('❌ Error in transferTokens', e);
      process.exit(1);
    });
    ```

    This code does the following:

    - Initializes a `wormhole` instance and defines the source and destination chains.
    - Imports the signer and decimal functions from `helpers.ts`.
    - Identifies the token and amount to transfer.
    - Checks to see if a wrapped version of the ERC-20 token to transfer exists on the destination chain.

3. Run the script using the following command:

    ```bash
    npx tsx transfer.ts
    ```

    If the token is registered on the destination chain, the address of the existing wrapped asset is returned, and you can continue to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain. If the token is not registered, you will see a message similar to the following advising the attestation flow will run:

    <div id="termynal" data-termynal>
      <span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
      <span data-ty>⚠️ Token is NOT registered on destination. Running attestation flow...</span>
      <span data-ty="input"><span class="file-path"></span></span>
    </div>
    If you see this message, follow the steps under "Need to register a token?" before continuing with the rest of the transfer flow code.

    ??? example "Need to register a token?"
        Token attestation is a one-time process to register a token on a destination chain. You should only follow these steps if your token registration check indicates a wrapped version does not exist on the destination chain.

        1. Create a new file called `attestToken.ts`:
            ```bash
            touch attestToken.ts
            ```

        2. Open `attestToken.ts` and add the following code to create the attestation for token registration:
            ```typescript title="attestToken.ts"
            import {
              wormhole,
              Wormhole,
              TokenId,
              TokenAddress,
            } from '@wormhole-foundation/sdk';
            import evm from '@wormhole-foundation/sdk/evm';
            import solana from '@wormhole-foundation/sdk/solana';
            import { signSendWait, toNative } from '@wormhole-foundation/sdk-connect';
            import { getSigner } from './helpers';

            async function attestToken() {
              // Initialize wh instance
              const wh = await wormhole('Testnet', [evm, solana]);
              // Define sourceChain and destinationChain, get chain contexts
              const sourceChain = wh.getChain('Moonbeam');
              const destinationChain = wh.getChain('Solana');

              // Define gas limit for EVM chains (optional)
              const gasLimit = BigInt(2_500_000);

              // Load signers for both chains
              const sourceSigner = await getSigner(sourceChain);
              const destinationSigner = await getSigner(destinationChain, gasLimit);

              // Retrieve the WTT (Token Bridge) context for the source chain
              // This is where you will send the transaction to attest the token
              const tb = await sourceChain.getTokenBridge();
              // Define the token to attest
              const tokenId: TokenId = Wormhole.tokenId(
                sourceChain.chain,
                'INSERT_TOKEN_CONTRACT_ADDRESS'
              );
              // Define the token to attest and a payer address
              const token: TokenAddress<typeof sourceChain.chain> = toNative(
                sourceChain.chain,
                tokenId.address.toString()
              );
              const payer = toNative(sourceChain.chain, sourceSigner.signer.address());
              // Call the `createAttestation` method to create a new attestation
              // and sign and send the transaction
              for await (const tx of tb.createAttestation(token, payer)) {
                const txids = await signSendWait(
                  sourceChain,
                  tb.createAttestation(token),
                  sourceSigner.signer
                );
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
                // Get the WTT (Token Bridge) context for the source chaindestination chain
                // and submit the attestation VAA
                const destTb = await destinationChain.getTokenBridge();
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
              // before proceeding with the transfer
              const maxAttempts = 50; // ~5 minutes with 6s interval
              const interval = 6000;
              let attempt = 0;
              let registered = false;

              while (attempt < maxAttempts && !registered) {
                attempt++;
                try {
                  const wrapped = await wh.getWrappedAsset(destinationChain.chain, tokenId);
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
              console.log('🚀 Token attestation complete! Proceed with transfer...');
            }

            ```

            This code does the following:
        
            - Gets the WTT protocol for the source chain.
            - Defines the token to attest for registration on the destination chain and the payer to sign for the transaction.
            - Calls `createAttestation`, signs, and then sends the transaction.
            - Waits for the signed VAA confirming the attestation creation.
            - Sends the VAA to the destination chain to complete registration.
            - Polls for the wrapped token to be available on the destination chain before continuing the transfer process.

        3. Run the script with the following command:
            
            ```bash
            npx tsx attestToken.ts
            ```

            When the attestation and registration are complete, you will see terminal output similar to the following:

            <div id="termynal" data-termynal>
              <span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
              <span data-ty>⚠️ Token is NOT registered on destination. Running attestation flow...</span>
              <span data-ty>✅ Attestation transaction sent: [
              {
                chain: 'Moonbeam',
                txid: '0x2b9878e6d8e92d8ecc96d663904312c18a827ccf0b02380074fdbc0fba7e6b68'
              }
            ]</span>
              <span data-ty>✅ Attestation messages: [
              {
                chain: 'Moonbeam',
                emitter: UniversalAddress { address: [Uint8Array] },
                sequence: 1505n
              }
            ]
            </span>
              <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 0/750</span>
              <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 1/750</span>
              <span data-ty>....</span>
              <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 10/750</span>
              <span data-ty>✅ Attestation submitted on destination: [
              {
                chain: 'Solana',
                txid: '3R4oF5P85jK3wKgkRs5jmE8BBLoM4wo2hWSgXXL6kA8efbj2Vj9vfuFSb53xALqYZuv3FnXDwJNuJfiKKDwpDH1r'
              }
            ]</span>
              <span data-ty>✅ Wrapped token is now available on Solana: SolanaAddress {
              type: 'Native',
              address: PublicKey [PublicKey(2qjSAGrpT2eTb673KuGAR5s6AJfQ1X5Sg177Qzuqt7yB)] {
                _bn: <BN: 1b578bb9b7a04a1aab3b5b64b550d8fc4f73ab343c9cf8532d2976b77ec4a8ca>
              }
            }</span>
              <span data-ty>🚀 Token attestation complete! Proceeding with transfer...</span>
              <span data-ty="input"><span class="file-path"></span></span>
            </div>
        You can now go on to [initiate the transfer](#initiate-transfer-on-source-chain) on the source chain.

## Initiate Transfer on Source Chain

Before initializing the token transfer, decide whether to use an automatic or manual transaction. Refer to the [Automatic vs. Manual Transfers](/docs/products/token-transfers/wrapped-token-transfers/concepts/transfer-flow/#automatic-vs-manual-transfers){target=_blank} section for a comparison of both options.

Follow these steps to add the remaining logic to initiate the token transfer on the source chain. Add the below code where the comment says `// Insert Initiate Transfer on Source Chain code` in your `transfer.ts` file:

1. Open your `transfer.ts` file and add the following code:

    === "Manual Transfer"

        ```typescript title="transfer.ts"
          // Build the token transfer object
          const xfer = await wh.tokenTransfer(
            tokenId,
            transferAmount,
            sourceSigner.address,
            destinationSigner.address,
            'TokenBridge',
            undefined // no payload
          );
          console.log('🚀 Built transfer object:', xfer.transfer);

          // Initiate, sign, and send the token transfer
          const srcTxs = await xfer.initiateTransfer(sourceSigner.signer);
          console.log('🔗 Source chain tx sent:', srcTxs);

          // For manual transfers, wait for VAA
          console.log('⏳ Waiting for attestation (VAA) for manual transfer...');
          const timeout = 10 * 60 * 1000; // 10 minutes timeout
          const attIds = await xfer.fetchAttestation(timeout);
          console.log('✅ Got attestation ID(s):', attIds);

          // Complete the manual transfer on the destination chain
          console.log('↪️ Redeeming transfer on destination...');
          const destTxs = await xfer.completeTransfer(destinationSigner.signer);
          console.log('🎉 Destination tx(s) submitted:', destTxs);
        ```
                
    === "Automatic Transfer"

        ```ts title="transfer.ts"
          // Optional native gas amount for automatic transfers only
          const nativeGasAmount = '0.001'; // 0.001 of native gas in human-readable format
          // Get the decimals for the source chain
          const nativeGasDecimals = destinationChain.config.nativeTokenDecimals;
          // Convert to raw units, otherwise set to 0n
          const nativeGas = BigInt(Number(nativeGasAmount) * 10 ** nativeGasDecimals);

          // Build the token transfer object
          const xfer = await wh.tokenTransfer(
            tokenId,
            transferAmount,
            sourceSigner.address,
            destinationSigner.address,
            'AutomaticTokenBridge',
            nativeGas
          );
          console.log('🚀 Built transfer object:', xfer.transfer);

          // Initiate, sign, and send the token transfer
          const srcTxs = await xfer.initiateTransfer(sourceSigner.signer);
          console.log('🔗 Source chain tx sent:', srcTxs);

          // If automatic, no further action is required. The relayer completes the transfer.
          console.log('✅ Automatic transfer: relayer is handling redemption.');

          process.exit(0);
        ```

    This code does the following:

    - Defines the transfer as automatic or manual. For automatic transfers, both the source and destination chain must have an existing `TokenBridgeRelayer` contract, which listens for and completes transfers on your behalf. You can check the list of [deployed `TokenBridgeRelayer` contracts](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/a48c9132015279ca6a2d3e9c238a54502b16fc7e/core/base/src/constants/contracts/tokenBridgeRelayer.ts){target=\_blank} in the Wormhole SDK repo to see if your desired chains are supported.
    - Sets an optional amount for [native gas drop-off](/docs/products/token-transfers/wrapped-token-transfers/concepts/transfer-flow/#flow-of-an-automatic-transfer-via-tbr){target=\_blank}. This option allows you to send a small amount of the destination chain's native token to cover gas fees. Native gas drop-off is currently only supported for automatic transfers.
    - Builds the transfer object, initiates the transfer, signs the transaction, and sends it.
    - If the transfer is automatic, the flow ends. Otherwise, the script waits for the signed VAA confirming the transaction on the source chain. The signed VAA is then submitted to the destination chain to claim the tokens and complete the manual transfer.

2. Run the script with the following command:
    ```bash
    npx tsx transfer.ts
    ```

3. You will see terminal output similar to the following:

    === "Manual Transfer"

        <div id="termynal" data-termynal>
          <span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
          <span data-ty>✅ Token already registered on destination: SolanaAddress {
          type: 'Native',
          address: PublicKey [PublicKey(2qjSAGrpT2eTb673KuGAR5s6AJfQ1X5Sg177Qzuqt7yB)] {
            _bn: <BN: 1b578bb9b7a04a1aab3b5b64b550d8fc4f73ab343c9cf8532d2976b77ec4a8ca>
          }
        }</span>
          <span data-ty>🚀 Built transfer object: {
          token: {
            chain: 'Moonbeam',
            address: EvmAddress {
              type: 'Native',
              address: '0x39F2f26f247CcC223393396755bfde5ecaeb0648'
            }
          },
          amount: 200000000000000000n,
          from: {
            chain: 'Moonbeam',
            address: EvmAddress {
              type: 'Native',
              address: '0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12'
            }
          },
          to: {
            chain: 'Solana',
            address: SolanaAddress {
              type: 'Native',
              address: [PublicKey [PublicKey(21dmEFTFGBEVoUNjmrxumN6A2xFxNBQXTkK7AmMqNmqD)]]
            }
          },
          protocol: 'TokenBridge',
          payload: undefined
        }</span>
          <span data-ty>🔗 Source chain tx sent: [
          '0xf318a1098a81063ac8acc9ca117eeb41ae9abfd9cb550a976721d2fa978f313a'
        ]</span>
          <span data-ty>⏳ Waiting for attestation (VAA) for manual transfer...</span>
          <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 0/30</span>
          <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 1/30</span>
          <span data-ty>.....</span>
          <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 15/30</span>
          <span data-ty>✅ Got attestation ID(s): [
          {
            chain: 'Moonbeam',
            emitter: UniversalAddress { address: [Uint8Array] },
            sequence: 1506n
          }
        ]</span>
          <span data-ty>↪️ Redeeming transfer on destination...</span>
          <span data-ty>🎉 Destination tx(s) submitted: [
          '23NRfFZyKJTDLppJF4GovdegxYAuW2HeXTEFSKKNeA7V82aqTVYTkKeM8sCHCDWe7gWooLAPHARjbAheXoxbbwPk'
        ]</span>
          <span data-ty="input"><span class="file-path"></span></span>
        </div>
    === "Automatic Transfer"

        <div id="termynal" data-termynal>
          <span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
          <span data-ty>✅ Token already registered on destination: SolanaAddress {
          type: 'Native',
          address: PublicKey [PublicKey(2qjSAGrpT2eTb673KuGAR5s6AJfQ1X5Sg177Qzuqt7yB)] {
            _bn: <BN: 1b578bb9b7a04a1aab3b5b64b550d8fc4f73ab343c9cf8532d2976b77ec4a8ca>
          }
        }</span>
          <span data-ty>🚀 Built transfer object: {
          token: {
            chain: 'Moonbeam',
            address: EvmAddress {
              type: 'Native',
              address: '0x39F2f26f247CcC223393396755bfde5ecaeb0648'
            }
          },
          amount: 200000000000000000n,
          from: {
            chain: 'Moonbeam',
            address: EvmAddress {
              type: 'Native',
              address: '0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12'
            }
          },
          to: {
            chain: 'Solana',
            address: SolanaAddress {
              type: 'Native',
              address: [PublicKey [PublicKey(21dmEFTFGBEVoUNjmrxumN6A2xFxNBQXTkK7AmMqNmqD)]]
            }
          },
          protocol: 'AutomaticTokenBridge',
          nativeGas: 10000000000000000n
        }</span>
          <span data-ty>🔗 Source chain tx sent: [
          '0xf318a1098a81063ac8acc9ca117eeb41ae9abfd9cb550a976721d2fa978f313a'
        ]</span>
          <span data-ty>✅ Automatic transfer: relayer is handling redemption.</span>
          <span data-ty="input"><span class="file-path"></span></span>
        </div>
Congratulations! You've now used WTT to transfer wrapped assets using the Wormhole TypeScript SDK. Consider the following options to build upon what you've achieved. 

## Next Steps

- [**Portal Bridge**](https://portalbridge.com/){target=\_blank}: Visit this site to interact with Wormhole's Portal Bridge, featuring a working WTT integration.
- [**Interact with WTT Contracts**](/docs/products/token-transfers/wrapped-token-transfers/guides/wtt-contracts/): This guide explores the Solidity functions used in WTT contracts.
- [**`TokenBridge` and `AutomaticTokenBridge` interfaces**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}: View the source code defining these key interfaces and their associated namespaces.
