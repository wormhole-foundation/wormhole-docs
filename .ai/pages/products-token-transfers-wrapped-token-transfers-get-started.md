---
title: Get Started with Wrapped Token Transfers (WTT)
description: Perform token transfers using Wormhole’s WTT with the TypeScript SDK, including manual (Solana–Sepolia) and automatic (Fuji–Alfajores).
categories: WTT, Transfers
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/get-started/
---

# Get Started with WTT

## Introduction

Wormhole's [Wrapped Token Transfers (WTT)](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} enables seamless multichain token transfers by locking tokens on a source chain and minting equivalent wrapped tokens on a destination chain. This mechanism preserves token properties such as name, symbol, and decimal precision across chains.

In this guide, you will use the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} to perform two types of transfers. 

 - **Manual transfer**: Where you control each step.
 - **Automatic transfer**: Where a relayer finalizes the transfer for you.

These examples will help you understand how WTT works across EVM and non-EVM chains.

!!! note "Terminology" 
    The SDK and smart contracts use the name Token Bridge. In documentation, this product is referred to as Wrapped Token Transfers (WTT). Both terms describe the same protocol.

## Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
 - Wallets funded with tokens on two [supported chains](/docs/products/reference/supported-networks/#wtt){target=\_blank}.

This guide uses a Solana wallet with [devnet SOL](https://faucet.solana.com/){target=\_blank} and an EVM wallet with [Sepolia ETH](https://www.alchemy.com/faucets/ethereum-sepolia){target=\_blank} for the manual transfer example, and [Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank} and [Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank} wallets funded with testnet tokens for the automatic transfer. You can adapt the examples to match your preferred chains.

## Configure Your Token Transfer Environment

1. Create a new directory and initialize a Node.js project:

    ```bash
    mkdir wh-wtt
    cd wh-wtt
    npm init -y
    ```

2. Install the required dependencies. This example uses the SDK version `4.1.0`:

    ```bash
    npm install @wormhole-foundation/sdk@4.1.0
    npm install -D tsx typescript
    ```

3. Create a `transfer.ts` file to handle the multichain transfer logic, and a `helper.ts` file to manage wallet signers and token utilities:

    ```bash
    touch transfer.ts helper.ts
    ```

4. Set up secure access to your wallets. This guide assumes you are loading your `SOL_PRIVATE_KEY` and `EVM_PRIVATE_KEY` from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Token Transfer

This section shows how to run manual and automatic token transfers using a shared project structure. You will define helper utilities once and reuse them across both flows.

In the manual transfer, you initiate a transfer on Solana, wait for Guardian signatures, and redeem the tokens on Sepolia, giving you complete control over each step. In the automatic transfer, the relayer handles attestation and redemption, simplifying the process between EVM chains.

1. Open `helper.ts` and define utility functions to load private keys, instantiate signers for Solana and EVM chains, and retrieve token decimals as needed:

    ```ts title="helper.ts"
    import {
      ChainAddress,
      ChainContext,
      Network,
      Signer,
      Wormhole,
      Chain,
      isTokenId,
      TokenId,
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

2. In `transfer.ts`, choose your transfer mode by selecting the [route](/docs/products/connect/concepts/routes/#wtt-routes){target=\_blank} you pass to the `tokenTransfer()` object: 
    - `TokenBridge` for manual transfers.
    - `AutomaticTokenBridge` for automatic transfers.

    === "Manual Transfer"

        ```ts title="transfer.ts"
        import { wormhole, amount, Wormhole } from '@wormhole-foundation/sdk';
        import solana from '@wormhole-foundation/sdk/solana';
        import sui from '@wormhole-foundation/sdk/sui';
        import evm from '@wormhole-foundation/sdk/evm';
        import { getSigner, getTokenDecimals } from './helper';

        (async function () {
          // Initialize Wormhole SDK for Solana and Sepolia on Testnet
          const wh = await wormhole('Testnet', [solana, sui, evm]);

          // Define the source and destination chains
          const sendChain = wh.getChain('Solana');
          const rcvChain = wh.getChain('Sepolia');

          // Load signers and addresses from helpers
          const source = await getSigner(sendChain);
          const destination = await getSigner(rcvChain);

          // Define the token and amount to transfer
          const tokenId = Wormhole.tokenId('Solana', 'native');
          const amt = '0.1';

          // Convert to raw units based on token decimals
          const decimals = await getTokenDecimals(wh, tokenId, sendChain);
          const transferAmount = amount.units(amount.parse(amt, decimals));

          // Construct the transfer object
          const xfer = await wh.tokenTransfer(
            tokenId,
            transferAmount,
            source.address,
            destination.address,
            'TokenBridge',
            undefined
          );

          // Initiate the transfer from Solana
          console.log('Starting Transfer');
          const srcTxids = await xfer.initiateTransfer(source.signer);
          console.log(`Started Transfer: `, srcTxids);

          // Wait for the signed attestation from the Guardian network
          console.log('Fetching Attestation');
          const timeout = 5 * 60 * 1000; // 5 minutes
          await xfer.fetchAttestation(timeout);

          // Redeem the tokens on Sepolia
          console.log('Completing Transfer');
          const destTxids = await xfer.completeTransfer(destination.signer);
          console.log(`Completed Transfer: `, destTxids);

          process.exit(0);
        })();

        ```
    
    === "Automatic Transfer"

        ```ts title="transfer.ts"
        import { wormhole, amount, Wormhole } from '@wormhole-foundation/sdk';
        import solana from '@wormhole-foundation/sdk/solana';
        import sui from '@wormhole-foundation/sdk/sui';
        import evm from '@wormhole-foundation/sdk/evm';
        import { getSigner, getTokenDecimals } from './helper';

        (async function () {
          // Initialize Wormhole SDK for Avalanche and Celo on Testnet
          const wh = await wormhole('Testnet', [solana, sui, evm]);

          // Define the source and destination chains
          const sendChain = wh.getChain('Avalanche');
          const rcvChain = wh.getChain('Celo');

          // Load signers and addresses from helpers
          const source = await getSigner(sendChain);
          const destination = await getSigner(rcvChain);

          // Define the token and amount to transfer
          const tokenId = Wormhole.tokenId('Avalanche', 'native');
          const amt = '0.2';

          // Convert to raw units based on token decimals
          const decimals = await getTokenDecimals(wh, tokenId, sendChain);
          const transferAmount = amount.units(amount.parse(amt, decimals));

          // Set to false to require manual approval steps
          const nativeGas = amount.units(amount.parse('0.0', 6));

          // Construct the transfer object
          const xfer = await wh.tokenTransfer(
            tokenId,
            transferAmount,
            source.address,
            destination.address,
            'AutomaticTokenBridge',
            nativeGas
          );

          // Initiate the transfer from Avalanche Fuji
          console.log('Starting Transfer');
          const srcTxids = await xfer.initiateTransfer(source.signer);
          console.log(`Started Transfer: `, srcTxids);

          process.exit(0);
        })();

        ```


3. Execute the script to initiate and complete the transfer:

    ```bash
    npx tsx transfer.ts
    ```

    If successful, the expected output should be similar to this:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx transfer.ts</span>
    	<span data-ty>Starting Transfer</span>
    	<span data-ty>Started Transfer:  ['36UwBBh6HH6wt3VBbNNawMd1ijCk28YgFePrBWfE3vGQFHtbMjY5626nqHubmyQWGNh2ZrN1vHKRrSQDNC3gkZgB']</span>
    	<span data-ty> </span>
        <span data-ty>Getting Attestation</span>
    	<span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 0/900</span>
        <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 1/900</span>
        <span data-ty>Retrying Wormholescan:GetVaaBytes, attempt 2/900 </span>
        <span data-ty> </span>
        <span data-ty>Completing Transfer</span>
        <span data-ty>Completed Transfer:  [ '53Nt4mp2KRTk2HFyvUcmP9b6cRXjVAN3wCksoBey9WmT' ]</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>
To verify the transaction and view its details, copy the transaction hash from the output and paste it into [Wormholescan](https://wormholescan.io/#/?network=Testnet){target=\_blank}.

## Next Steps

Now that you've completed a manual multichain token transfer, explore these guides to continue building:

 - **[Complete Token Transfer Workflow](/docs/products/token-transfers/wrapped-token-transfers/tutorials/transfer-workflow/){target=\_blank}**: Build a reusable application that supports multiple chain combinations and transfer modes (manual and automatic).
 - **[Create Multichain Tokens](/docs/products/token-transfers/wrapped-token-transfers/tutorials/multichain-token/){target=\_blank}**: Learn how to issue tokens that work across chains.
 - **[Explore the Wormhole Dev Arena](https://arena.wormhole.com/){target=\_blank}**: A structured learning hub with hands-on tutorials across the Wormhole ecosystem.
