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

This example uses an Avalanche Fuji wallet with [USDC](https://faucet.circle.com/){target=\_blank} and [AVAX](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}, as well as a Sepolia wallet with testnet [ETH](https://www.alchemy.com/faucets/ethereum-sepolia){target=\_blank}, to pay the transaction fees. You can adapt the steps to work with any [supported EVM chains](/docs/products/reference/supported-networks/#cctp){target=\_blank} that support CCTP.

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir cctp-bridge
    cd cctp-bridge
    npm init -y
    ```

2. Install the required dependencies. This example uses the SDK version `3.11.0`:

    ```bash
    npm install @wormhole-foundation/sdk@3.11.0
    npm install -D tsx typescript
    ```

3. Create a `transfer.ts` file to handle the multichain transfer logic and a `helper.ts` file to manage wallet signers:

    ```bash
    touch transfer.ts helper.ts
    ```

4. Set up secure access to your wallets. This guide assumes you are loading your `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a CCTP Transfer

This section walks you through a complete automatic USDC transfer using Wormhole's CCTP integration. You will initiate the transfer on Avalanche Fuji, and Wormhole's relayer will automatically handle the Circle attestation and finalize the redemption on Sepolia.

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

2. In `transfer.ts`, add the script to perform the automatic transfer using CCTP:

    ```ts title="transfer.ts"
    import { wormhole, amount } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';
    import sui from '@wormhole-foundation/sdk/sui';
    import { getSigner } from './helper';

    (async function () {
      // Initialize the Wormhole object for the Testnet environment and add supported chains (evm, solana and sui)
      const wh = await wormhole('Testnet', [evm, solana, sui]);

      // Grab chain Contexts -- these hold a reference to a cached rpc client
      const sendChain = wh.getChain('Avalanche');
      const rcvChain = wh.getChain('Sepolia');

      // Get signer from local key
      const source = await getSigner(sendChain);
      const destination = await getSigner(rcvChain);

      // Define the amount of USDC to transfer (in the smallest unit, so 1.000001 USDC = 1,000,001 units assuming 6 decimals)
      const amt = 1_000_001n;

      // Whether to use automatic delivery
      const automatic = true;

      // The amount of native gas to send with the transfer
      const nativeGas = amount.units(amount.parse('0.1', 6));

      // Create the circleTransfer transaction (USDC-only)
      const xfer = await wh.circleTransfer(
        amt,
        source.address,
        destination.address,
        automatic,
        undefined,
        nativeGas
      );

      // Initiate the transfer on the source chain (Avalanche)
      console.log('Starting Transfer');
      const srcTxids = await xfer.initiateTransfer(source.signer);
      console.log(`Started Transfer: `, srcTxids);

      process.exit(0);
    })();

    ```

3. Run the script to execute the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
    	<span data-ty>Starting Transfer</span>
    	<span data-ty
    		>Started Transfer:
            [ '0xa3a545e65865c95f814132ac689c2ff5a20bfa3ca3d68bab48230708de342841']</span
    	>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>

To verify the transaction and view its details, paste the transaction hash into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a CCTP USDC transfer using the Wormhole SDK, you're ready to explore more advanced features and expand your integration:

 - **[Circle CCTP Documentation](https://developers.circle.com/cctp)**: Learn how USDC cross-chain transfers work and explore advanced CCTP features.
 - **[Explore the Wormhole Dev Arena](https://arena.wormhole.com/){target=\_blank}**: A structured learning hub with hands-on tutorials across the Wormhole ecosystem.
