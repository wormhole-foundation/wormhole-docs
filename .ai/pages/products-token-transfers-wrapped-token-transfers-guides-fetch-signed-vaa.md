---
title: Fetch a Signed VAA
description: Learn how to fetch a signed VAA, a key step in the manual Wrapped Token Transfer (WTT) flow.
categories: WTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/guides/fetch-signed-vaa/
---

# Fetch a Signed VAA

This guide demonstrates how to fetch a signed [Verified Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}, first programmatically using the [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank}, then manually using the [Wormholescan](https://wormholescan.io/){target=\_blank} explorer. VAA retrieval is a key step in manual messaging and transfer flows. Knowing how to locate a relevant VAA can also help with debugging and monitoring transactions while building out your integration.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=_blank}
- [TypeScript](https://www.typescriptlang.org/download/){target=_blank} (installed globally)

## Set Up Your Developer Environment

Follow these steps to initialize your project, install dependencies, and prepare your developer environment:

1. Create a new directory and initialize a Node.js project using the following commands:

    ```bash
    mkdir fetch-vaa
    cd fetch-vaa
    npm init -y
    ```

2. Install dependencies, including the [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}. This example uses the SDK version `4.1.0`:

    ```bash
   npm install @wormhole-foundation/sdk@4.1.0 -D tsx typescript
   ```

## Fetch VAA via TypeScript SDK

Follow these steps to search for and retrieve a VAA using the TypeScript SDK:

1. Create a new file called `fetch-vaa.ts` using the following command:

    ```bash
    touch fetch-vaa.ts
    ```

2. Open your `fetch-vaa.ts` file and add the following code:

    ```typescript title="fetch-vaa.ts"
    import { wormhole } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import { serialize } from '@wormhole-foundation/sdk-definitions';
    import { toChainId } from '@wormhole-foundation/sdk-base';

    async function main() {
      // Initialize the Wormhole SDK with the network and platform
      // to match the source chain for the transaction ID
      const wh = await wormhole('Testnet', [evm]);
      // Source chain transaction ID for the VAA you want to fetch
      const txid =
        'INSERT_TRANSACTION_ID';
      // Call getVaa to fetch the VAA associated with the transaction ID
      // and decode returned data into a human-readable format
      const vaa = await wh.getVaa(txid, 'Uint8Array', 60000);
      if (!vaa) {
        console.error('❌ VAA not found');
        process.exit(1);
      }
      const { emitterChain, emitterAddress, sequence } = vaa;
      const chainId = toChainId(emitterChain);
      const emitterHex = emitterAddress.toString();

      const vaaBytes = serialize(vaa);
      const vaaHex = Buffer.from(vaaBytes).toString('hex');

      console.log('✅ VAA Info');
      console.log(`Chain: ${chainId}`);
      console.log(`Emitter: ${emitterHex}`);
      console.log(`Sequence: ${sequence}`);
      console.log('---');
      console.log(`VAA Bytes (hex):\n${vaaHex}`);
      // Return the VAA object for further processing if needed
      return vaa;
    }

    main().catch(console.error);

    ```

    This code does the following:

    - Initializes a Wormhole instance with the same `network` and `platform` as the source chain transfer transaction.
    - Accepts the transaction ID from the source chain transfer transaction.
    - Prints the associated `chain`, `emitter`, `sequence`, and VAA bytes to the terminal.
    - Returns the `vaa` object for any further processing.

3. Run the script with the following command:

    ```bash
    npx tsx fetch-vaa.ts
    ```

4. You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx fetch-vaa.ts</span>
    	<span data-ty>✅ VAA Info</span>
    	<span data-ty>Chain: 16</span>
    	<span data-ty>Emitter: 0x000000000000000000000000bc976d4b9d57e57c3ca52e1fd136c45ff7955a96</span>
        <span data-ty>Sequence: 1512</span>
    	<span data-ty>---</span>
        <span data-ty>VAA Bytes (hex):</span>
        <span data-ty>010000000001004d34d189b894acf4c16b9f456f908ca8b60aa9b2fa77cfa6ebc18f864818c21a7e18b6c4f72415f441be4d2b666c5b897d354cec0e950b935b15806d002d39670168557fb6000000000010000000000000000000000000bc976d4b9d57e57c3ca52e1fd136c45ff7955a9600000000000005e8010100000000000000000000000000000000000000000000000000000000009896800000000000000000000000009b2ff7b2b5a459853224a3317b786d8e85026660001084b1e2f8a26ddff1a55eed46add73a9b556256f2afda1072f6cfdab1dcb2d53000010000000000000000000000000000000000000000000000000000000000000000</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>
## Fetch VAA via Wormholescan

You can also use [Wormholescan's](https://wormholescan.io/){target=\_blank} UI to manually search for a VAA using the source transaction ID, VAA ID, or a wallet address. This type of quick search is helpful during debugging or testing of your integration. Follow these steps to fetch a VAA using Wormholescan:

1. On [Wormholescan](https://wormholescan.io/){target=\_blank}, use the dropdown menu in the top right corner to select either **Mainnet** or **Testnet**.

2. Enter your transaction ID in the search bar and select "return" or "enter" to submit your search request. Alternatively, you can enter the wallet address of the transaction signer and return any transactions under that account.

    ![](/docs/images/products/wrapped-token-transfers/guides/fetch-vaa/fetch-vaa-1.webp)

3. Inspect the returned search results. Note that the source transaction ID, current status, transaction details, and the VAA ID are included.

    ![](/docs/images/products/wrapped-token-transfers/guides/fetch-vaa/fetch-vaa-2.webp)

Congratulations! You've now fetched a signed VAA using both the TypeScript SDK and Wormholescan UI. These skills are valuable when developing manual transfer or messaging processes, as well as debugging and testing an integration build.
