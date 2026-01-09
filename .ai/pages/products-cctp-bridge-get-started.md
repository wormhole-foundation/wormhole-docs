---
title: Get Started with CCTP
description: Transfer USDC across chains using Wormhole's CCTP integration with the TypeScript SDK, including setup, attestation, and redemption steps.
categories: Transfer, CCTP
url: https://wormhole.com/docs/products/cctp-bridge/get-started/
---

# Get Started with CCTP

[Wormhole CCTP](/docs/products/cctp-bridge/overview/){target=\_blank} enables native USDC transfers between supported chains by burning tokens on the source chain and minting them on the destination. This provides native, canonical USDC movement without the need for wrapped tokens.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform an automatic cross-chain USDC transfer using Circle's CCTP protocol.

You will initiate the transfer on the source chain, and Wormhole's relayer will automatically handle Circle's attestation and redemption steps to complete the transfer on the destination chain.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
 - Wallets funded with native tokens and USDC on two [supported CCTP chains](/docs/products/reference/supported-networks/#cctp){target=\_blank}.

This example uses a Solana Devnet wallet with [USDC](https://faucet.circle.com/){target=\_blank} and [SOL](https://faucet.solana.com/){target=\_blank}, as well as a Base Sepolia wallet with testnet [ETH](https://www.alchemy.com/faucets/base-sepolia){target=\_blank}, to pay the transaction fees. You can adapt the steps to work with any [supported EVM chains](/docs/products/reference/supported-networks/#cctp){target=\_blank} that support CCTP.

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir cctp-bridge
    cd cctp-bridge
    npm init -y
    ```

2. Pin the SDK to specific dependency versions to ensure compatibility with the [CCTP executor routes](https://www.npmjs.com/package/@wormhole-labs/cctp-executor-route){target=\_blank}:

    ```bash
    npm pkg set overrides.@wormhole-foundation/sdk-aptos=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-base=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-connect=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-definitions=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-evm=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-solana=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-solana-cctp=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-sui=4.0.2
    npm pkg set overrides.@wormhole-foundation/sdk-sui-cctp=4.0.2
    npm pkg set overrides.axios=1.11.0
    npm pkg set overrides.ethers=6.15.0
    ```

3. Install the required dependencies. This example uses the SDK version `4.7.3`:

    ```bash
    npm install @wormhole-foundation/sdk@4.7.3 @wormhole-labs/cctp-executor-route
    npm install -D tsx typescript
    ```

4. Create a `transfer.ts` file to handle the multichain transfer logic and a `helper.ts` file to manage wallet signers:

    ```bash
    touch transfer.ts helper.ts
    ```

5. Set up secure access to your wallets. This guide assumes you are loading your `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a CCTP Transfer

This section walks you through a complete automatic USDC transfer using Wormhole's CCTP integration. You will initiate the transfer on Solana Devnet, and Wormhole's relayer will automatically handle the Circle attestation and finalize the redemption on Base Sepolia.

Start by defining utility functions for signer and token setup:

1. In `helper.ts`, define functions to load private keys and instantiate EVM signers:

    ```ts title="helper.ts"
    import {
      ChainAddress,
      ChainContext,
      Network,
      Signer,
      Wormhole,
      Chain,
    } from '@wormhole-foundation/sdk';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import evm from '@wormhole-foundation/sdk/evm';

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
      signer: Signer<N, C>;
      address: ChainAddress<C>;
    }> {
      let signer: Signer;
      const platform = chain.platform.utils()._platform;

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

      return {
        chain,
        signer: signer as Signer<N, C>,
        address: Wormhole.chainAddress(chain.chain, signer.address()),
      };
    }

    ```

2. In `transfer.ts`, add the script to perform the automatic transfer using CCTP. Wormhole supports both CCTP v1 and [CCTP v2](https://www.circle.com/blog/cctp-v2-the-future-of-cross-chain){target=\_blank}, and the SDK provides executors for each version. See the [CCTP-supported executors](/docs/products/reference/executor-addresses/#cctp-with-executor){target=\_blank} to determine which version applies to your case:

    === "CCTP v1"

        ```ts title="transfer.ts"
        import { Wormhole, circle, routes } from '@wormhole-foundation/sdk';
        import evm from '@wormhole-foundation/sdk/platforms/evm';
        import solana from '@wormhole-foundation/sdk/platforms/solana';
        import sui from '@wormhole-foundation/sdk/platforms/sui';
        import '@wormhole-labs/cctp-executor-route';
        import { cctpExecutorRoute } from '@wormhole-labs/cctp-executor-route';
        import type { CCTPExecutorRoute } from '@wormhole-labs/cctp-executor-route/dist/esm/routes/cctpV1';
        import { getSigner } from './helper';

        (async function () {
          // Initialize Wormhole for the Testnet environment and add supported chains (evm, solana and sui)
          const network = 'Testnet';
          const wh = new Wormhole(network, [
            evm.Platform,
            solana.Platform,
            sui.Platform,
          ]);

          // Grab chain contexts (cached RPC clients under the hood)
          const src = wh.getChain('Solana');
          const dst = wh.getChain('BaseSepolia');

          // Get signers from local keys
          const srcSigner = await getSigner(src);
          const dstSigner = await getSigner(dst);

          // Fetch the USDC contract addresses for these chains
          const srcUsdc = circle.usdcContract.get(network, src.chain);
          const dstUsdc = circle.usdcContract.get(network, dst.chain);

          if (!srcUsdc || !dstUsdc) {
            throw new Error(
              'USDC is not configured on the selected source/destination'
            );
          }

          // Build the transfer request for the CCTP v1 executor
          const tr = await routes.RouteTransferRequest.create(wh, {
            source: Wormhole.tokenId(src.chain, srcUsdc),
            destination: Wormhole.tokenId(dst.chain, dstUsdc),
            sourceDecimals: 6,
            destinationDecimals: 6,
            sender: srcSigner.address,
            recipient: dstSigner.address,
          });

          // Configure the executor route (referrer fee off)
          const ExecutorRoute = cctpExecutorRoute({ referrerFeeDbps: 0n });
          const route = new ExecutorRoute(wh);

          // Define the amount of USDC to transfer (in the smallest unit, so 1.000001 USDC = 1,000,001 units assuming 6 decimals)
          const transferAmount = '1.000001';

          // Set the native gas drop-off (0 <= nativeGas <= 1)
          const nativeGasPercent = 0.1;

          const validated = await route.validate(tr, {
            amount: transferAmount,
            options: { nativeGas: nativeGasPercent },
          });

          // Validate inputs and exit early on failure
          if (!validated.valid) {
            const { error } = validated as Extract<typeof validated, { valid: false }>;
            throw new Error(`Validation failed: ${error.message}`);
          }

          // Quote expects the normalized params produced by validate(); cast to that shape
          const validatedParams = validated.params as CCTPExecutorRoute.ValidatedParams;
          const quote = await route.quote(tr, validatedParams);
          if (!quote.success) {
            const { error } = quote as Extract<typeof quote, { success: false }>;
            throw new Error(`Quote failed: ${error.message}`);
          }

          // Start the transfer on the source chain via the executor
          const receipt = await route.initiate(
            tr,
            srcSigner.signer,
            quote,
            dstSigner.address
          );
          if ('originTxs' in receipt && Array.isArray(receipt.originTxs)) {
            console.log('Source transactions:', receipt.originTxs);

            const lastTx = receipt.originTxs[receipt.originTxs.length - 1];
            if (lastTx) {
              const txid =
                typeof lastTx === 'string' ? lastTx : lastTx.txid ?? String(lastTx);
              const wormholeScanUrl = `https://wormholescan.io/#/tx/${txid}?network=${network}`;
              console.log('WormholeScan URL:', wormholeScanUrl);
            }
          } else {
            console.log('Receipt returned without origin transactions:', receipt);
          }
        })();

        ```

    === "CCTP v2"

        ```ts title="transfer.ts"
        import { Wormhole, circle, routes } from '@wormhole-foundation/sdk';
        import evm from '@wormhole-foundation/sdk/platforms/evm';
        import solana from '@wormhole-foundation/sdk/platforms/solana';
        import sui from '@wormhole-foundation/sdk/platforms/sui';
        import '@wormhole-labs/cctp-executor-route';
        import { cctpV2StandardExecutorRoute } from '@wormhole-labs/cctp-executor-route';
        import type { CCTPv2ExecutorRoute } from '@wormhole-labs/cctp-executor-route/dist/esm/routes/cctpV2Base';
        import { getSigner } from './helper';

        (async function () {
          // Initialize Wormhole for the Testnet environment and add supported chains (evm, solana and sui)
          const network = 'Testnet';
          const wh = new Wormhole(network, [
            evm.Platform,
            solana.Platform,
            sui.Platform,
          ]);

          // Grab chain contexts (cached RPC clients under the hood)
          const src = wh.getChain('Solana');
          const dst = wh.getChain('BaseSepolia');

          // Get signers from local keys
          const srcSigner = await getSigner(src);
          const dstSigner = await getSigner(dst);

          // Fetch the USDC contract addresses for these chains
          const srcUsdc = circle.usdcContract.get(network, src.chain);
          const dstUsdc = circle.usdcContract.get(network, dst.chain);

          if (!srcUsdc || !dstUsdc) {
            throw new Error(
              'USDC is not configured on the selected source/destination'
            );
          }

          // Build the transfer request for the CCTP v2 executor
          const tr = await routes.RouteTransferRequest.create(wh, {
            source: Wormhole.tokenId(src.chain, srcUsdc),
            destination: Wormhole.tokenId(dst.chain, dstUsdc),
            sourceDecimals: 6,
            destinationDecimals: 6,
            sender: srcSigner.address,
            recipient: dstSigner.address,
          });

          // Configure the executor route (referrer fee off)
          const ExecutorRoute = cctpV2StandardExecutorRoute({ referrerFeeDbps: 0n });
          const route = new ExecutorRoute(wh);

          // Define the amount of USDC to transfer (in the smallest unit, so 1.000001 USDC = 1,000,001 units assuming 6 decimals)
          const transferAmount = '1.000001';

          // Set the native gas drop-off (0 <= nativeGas <= 1)
          const nativeGasPercent = 0.1;

          const validated = await route.validate(tr, {
            amount: transferAmount,
            options: { nativeGas: nativeGasPercent },
          });

          // Validate inputs and exit early on failure
          if (!validated.valid) {
            const { error } = validated as Extract<typeof validated, { valid: false }>;
            throw new Error(`Validation failed: ${error.message}`);
          }

          // Quote expects the normalized params produced by validate(); cast to that shape
          const validatedParams =
            validated.params as CCTPv2ExecutorRoute.ValidatedParams;
          const quote = await route.quote(tr, validatedParams);
          if (!quote.success) {
            const { error } = quote as Extract<typeof quote, { success: false }>;
            throw new Error(`Quote failed: ${error.message}`);
          }

          // Start the transfer on the source chain via the executor
          const receipt = await route.initiate(
            tr,
            srcSigner.signer,
            quote,
            dstSigner.address
          );
          if ('originTxs' in receipt && Array.isArray(receipt.originTxs)) {
            console.log('Source transactions:', receipt.originTxs);

            const lastTx = receipt.originTxs[receipt.originTxs.length - 1];
            if (lastTx) {
              const txid =
                typeof lastTx === 'string' ? lastTx : lastTx.txid ?? String(lastTx);
              const wormholeScanUrl = `https://wormholescan.io/#/tx/${txid}?network=${network}`;
              console.log('WormholeScan URL:', wormholeScanUrl);
            }
          } else {
            console.log('Receipt returned without origin transactions:', receipt);
          }
        })();

        ```

3. Run the script to execute the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
    	<span data-ty>Source transactions: [ </span>
    	<span data-ty
    		>{
    			chain: 'Solana',
    			txid: 's1gCiQi1aCJVuGGyjMZZcad3bZS3h4mJKvaNBNctrWLq7ooEpdvs3ehjuGx6esK7wGR1y4sEjQJcBbUfqLp8h3H'
    		}]
    	</span>
    	<span data-ty> </span>
    	<span data-ty
    		>WormholeScan URL: https://wormholescan.io/#/tx/s1gCiQi1aCJVuGGyjMZZcad3bZS3h4mJKvaNBNctrWLq7ooEpdvs3ehjuGx6esK7wGR1y4sEjQJcBbUfqLp8h3H?network=Testnet</span
    	>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>

To verify the transaction and view its details, paste the transaction hash into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a CCTP USDC transfer using the Wormhole SDK, you're ready to explore more advanced features and expand your integration.

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Circle CCTP Documentation**

    ---

    Learn how USDC cross-chain transfers work and explore advanced CCTP features.

    [:custom-arrow: See the Circle Docs](https://developers.circle.com/cctp){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/){target=\_blank}

</div>
