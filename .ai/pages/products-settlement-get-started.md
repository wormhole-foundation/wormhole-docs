---
title: Get Started
description: Perform a cross-chain token swap using Wormhole Settlement and the Mayan Swift route with the TypeScript SDK on mainnet.
categories: Settlement, Transfer
url: https://wormhole.com/docs/products/settlement/get-started/
---

# Get Started with Settlement

[Settlement](/docs/products/settlement/overview/){target=\_blank} is Wormhole’s intent-based execution layer, enabling fast, multichain token transfers. It coordinates routing logic, relayers, and on-chain infrastructure to let users express what they want to be done, not how.

This guide walks you through performing a real token swap using the [Mayan Swift route](https://mayan.finance){target=\_blank} with the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}.

By the end, you'll have a working script that:

- Resolves token transfer routes using Mayan Swift.
- Quotes and validates the best route.
- Initiates a swap on a source chain and completes the transfer on a destination chain (no destination signer required for Mayan Swift).

For a coding walkthrough, watch the [Intent-Based Swap demo](https://youtu.be/dxA1tsa-8iA?si=5ywoTjjzbsysCRPE){target=\_blank}.

!!! note
    Mayan Swift currently supports **mainnet only**. Attempting to run this demo on a testnet will fail.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- One source-chain wallet funded with native gas on a [Swift-supported chain](/docs/products/reference/supported-networks/#settlement){target=\_blank}.
- A destination wallet address on the target chain (no destination signer or gas required).

This example utilizes Ethereum as the source chain and Solana as the destination chain. You’ll need ETH for gas on Ethereum only. You do not need SOL or a Solana signer; you’ll provide a Solana recipient address, and Mayan Swift’s relayer handles the destination leg. You can adapt the example to match your preferred chains.

## Set Up a Project

Start by scaffolding a basic Node.js project and installing the required SDKs.

1. Create a new project folder:

    ```bash
    mkdir settlement-swap
    cd settlement-swap
    npm init -y
    ```

2. Install the required dependencies. This example uses the Mayan Swift route version `1.26.0` and Wormhole SDK version `3.11.0`:

    ```bash
    npm install @wormhole-foundation/sdk-connect@3.11.0 \
        @wormhole-foundation/sdk-evm@3.11.0 \
        @wormhole-foundation/sdk-solana@3.11.0 \
        @mayanfinance/wormhole-sdk-route@1.26.0 \
        dotenv
    npm install -D typescript tsx
    ```

3. Create the file structure:

    ```bash
    mkdir src
    touch src/helpers.ts src/swap.ts .gitignore
    ```

4. Set up secure access to your wallets. This guide assumes you are loading a source private key and an Ethereum mainnet RPC URL from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [cast wallet](https://getfoundry.sh/cast/reference/wallet/new){target=\_blank}. The RPC is required so the SDK can sign and send the source-chain transaction reliably.

    !!! note
        Some auto-selected public RPCs may require API keys or rate-limit intermittently. Providing your own mainnet RPC URL avoids 401/500 errors and timeouts during `initiate` and status polling.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

## Perform a Token Swap

This section shows you how to perform a token swap using the Mayan Swift route. You will define a helper function to configure the source chain signer.

Then, you'll create a script that initiates a transfer on Ethereum, uses the Mayan Swift resolver to find valid routes, sends the transaction, and lets the route complete the transfer on Solana.

1. Open `helper.ts` and define the `getSigner` utility function to load private key, instantiate signer for your source chain, and return the signer along with the Wormhole-formatted address:

    ```ts title="src/helpers.ts"
    import {
      Chain,
      ChainAddress,
      ChainContext,
      Network,
      Signer,
      Wormhole,
    } from '@wormhole-foundation/sdk-connect';
    import { getEvmSignerForKey } from '@wormhole-foundation/sdk-evm';
    import { getSolanaSigner } from '@wormhole-foundation/sdk-solana';
    import { JsonRpcProvider } from "ethers";

    /**
     * Create a helper function that returns a signer for the given chain using locally scoped credentials.
     * The required values (MAINNET_ETH_PRIVATE_KEY, ETHEREUM_MAINNET_RPC)
     * must be loaded securely beforehand, for example via a keystore,
     * secrets manager, or environment variables (not recommended).
     */

    // Define transfer interface.
    export interface SignerContext<N extends Network, C extends Chain> {
      signer: Signer<N, C>;
      address: ChainAddress<C>;
    }

    export async function getSigner<N extends Network, C extends Chain>(
      chain: ChainContext<N, C>
    ): Promise<SignerContext<N, C>> {
      let signer: Signer;
      const platform = chain.platform.utils()._platform;
      switch (platform) {
        case "Solana":
          signer = await getSolanaSigner(
            await chain.getRpc(),
            "MAINNET_SOL_PRIVATE_KEY"
          );
          break;
        case 'Evm':
          signer = await getEvmSignerForKey(
            await chain.getRpc(),
            'MAINNET_ETH_PRIVATE_KEY'
          );
          break;
        default:
          throw new Error('Unrecognized platform: ' + platform);
      }

      return {
        signer: signer as Signer<N, C>,
        address: Wormhole.chainAddress(chain.chain, signer.address()),
      };
    }

    ```

2. In `swap.ts`, add the following script, which will handle all of the logic required to perform the token swap: 

    ```ts title="src/swap.ts"
    import { Wormhole, routes } from '@wormhole-foundation/sdk-connect';
    import { EvmPlatform } from '@wormhole-foundation/sdk-evm';
    import { SolanaPlatform } from '@wormhole-foundation/sdk-solana';
    import { MayanRouteSWIFT } from '@mayanfinance/wormhole-sdk-route';
    import { getSigner } from './helpers';

    (async function () {
      const wh = new Wormhole("Mainnet", [EvmPlatform, SolanaPlatform]);

      const sendChain = wh.getChain('Ethereum');
      const destChain = wh.getChain('Solana');
      const destAddress = Wormhole.chainAddress(destChain.chain, "INSERT_DESTINATION_ADDRESS");

      //  To transfer native ETH on Ethereum to native SOL on Solana.
      const source = Wormhole.tokenId(sendChain.chain, 'native');
      const destination = Wormhole.tokenId(destChain.chain, 'native');

      // Create a new Wormhole route resolver, adding the Mayan route to the default list
      // @ts-ignore: Suppressing TypeScript error because the resolver method expects a specific type,
      // but MayanRouteSWIFT is compatible and works as intended in this context.
      const resolver = wh.resolver([MayanRouteSWIFT]);

      // Show supported tokens
      const dstTokens = await resolver.supportedDestinationTokens(
        source,
        sendChain,
        destChain
      );
      console.log(dstTokens.slice(0, 5));

      // Load signers and addresses from helpers.
      const sender = await getSigner(sendChain);

      // Creating a transfer request fetches token details
      // since all routes will need to know about the tokens.
      const tr = await routes.RouteTransferRequest.create(wh, {
        source,
        destination,
      });

      // Resolve the transfer request to a set of routes that can perform it
      const foundRoutes = await resolver.findRoutes(tr);
      const bestRoute = foundRoutes[0]!;

      // Specify the amount as a decimal string.
      const transferParams = {
        amount: '0.001',
        options: bestRoute.getDefaultOptions(),
      };

      // Validate the queries route
      let validated = await bestRoute.validate(tr, transferParams);
      if (!validated.valid) {
        console.error(validated.error);
        return;
      }
      console.log('Validated: ', validated);

      const quote = await bestRoute.quote(tr, validated.params);
      if (!quote.success) {
        console.error(`Error fetching a quote: ${quote.error.message}`);
        return;
      }
      console.log('Quote: ', quote);

      // Initiate the transfer
      const receipt = await bestRoute.initiate(
        tr,
        sender.signer,
        quote,
        destAddress
      );
      console.log('Initiated transfer with receipt: ', receipt);

      const timeout = 15 * 60 * 1000;
      await routes.checkAndCompleteTransfer(
        bestRoute,
        receipt,
        undefined,
        timeout
      );
    })();

    ```

3. Execute the script to initiate and complete the transfer:

    ```bash
    npx tsx src/swap.ts
    ```

    If successful, you’ll see terminal output like this:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx src/swap.ts</span>
    	<span data-ty>Validated: { valid: true, ... }</span>
        <span data-ty>Quote: { success: true, ... }</span>
        <span data-ty>Initiated transfer with receipt: ...</span>
        <span data-ty>Checking transfer state...</span>
        <span data-ty>Current Transfer State: SourceInitiated</span>
        <span data-ty>Current Transfer State: SourceInitiated</span>
        <span data-ty>Current Transfer State: SourceInitiated</span>
        <span data-ty>Current Transfer State: DestinationFinalized</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>


Congratulations! You've just completed a cross-chain token swap from Ethereum to Solana using Settlement.

## Customize the Integration

You can tailor the example to your use case by adjusting:

- **Tokens and chains**: Use `getSupportedTokens()` to explore what's available.
- **Source and destination chains**: Modify `sendChain` and `destChain` in `swap.ts`.
- **Transfer settings**: Update the amount or route parameters.
- **Signer management**: Modify `src/helpers.ts` to integrate with your preferred wallet setup.

## Next Steps

Once you've chosen a path, follow the corresponding guide to start building:

- [**`demo-mayanswift`**](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank}: Check out the repository for the full code example.
- **[Explore the Wormhole Dev Arena](https://arena.wormhole.com/){target=\_blank}**: A structured learning hub with hands-on tutorials across the Wormhole ecosystem.
