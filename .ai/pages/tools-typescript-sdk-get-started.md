---
title: Get Started with the TypeScript SDK
description: Follow this guide to install the Wormhole TypeScript SDK, initialize a Wormhole instance, and add the platforms your integration supports.
categories: Typescript SDK
url: https://wormhole.com/docs/tools/typescript-sdk/get-started/
---

# Get Started with the TypeScript SDK

:simple-github: [Repository on GitHub](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}

The Wormhole TypeScript SDK provides a unified, type-safe interface for building cross-chain applications. It is a foundational toolkit that supports interaction with core Wormhole protocols, including Native Token Transfers (NTT), Wrapped Token Transfers (WTT), CCTP, and Settlement, giving developers a consistent API across multiple chains.

This guide helps you install the SDK, initialize a `Wormhole` instance to support your desired network and blockchain platforms, and return chain-specific information to verify successful initialization.

If you want to build more advanced integrations, such as token transfers using WTT or CCTP Bridge, skip ahead to [Next Steps](#next-steps).

## Install the SDK

To install the Wormhole TypeScript SDK, use the following command:

```bash
npm install @wormhole-foundation/sdk
```

This package combines all the individual packages to make setup easier.

You can choose to install a specific set of packages as needed. For example, to install EVM-specific utilities, you can run:

```bash
npm install @wormhole-foundation/sdk-evm
```

??? example "Complete list of individually published packages"

    Platform-Specific Packages

    - `@wormhole-foundation/sdk-evm`
    - `@wormhole-foundation/sdk-solana`
    - `@wormhole-foundation/sdk-algorand`
    - `@wormhole-foundation/sdk-aptos`
    - `@wormhole-foundation/sdk-cosmwasm`
    - `@wormhole-foundation/sdk-sui`

    ---

    Protocol-Specific Packages

    - Core Protocol
        - `@wormhole-foundation/sdk-evm-core`
        - `@wormhole-foundation/sdk-solana-core`
        - `@wormhole-foundation/sdk-algorand-core`
        - `@wormhole-foundation/sdk-aptos-core`
        - `@wormhole-foundation/sdk-cosmwasm-core`
        - `@wormhole-foundation/sdk-sui-core`

    - WTT
        - `@wormhole-foundation/sdk-evm-tokenbridge`
        - `@wormhole-foundation/sdk-solana-tokenbridge`
        - `@wormhole-foundation/sdk-algorand-tokenbridge`
        - `@wormhole-foundation/sdk-aptos-tokenbridge`
        - `@wormhole-foundation/sdk-cosmwasm-tokenbridge`
        - `@wormhole-foundation/sdk-sui-tokenbridge`

    - CCTP
        - `@wormhole-foundation/sdk-evm-cctp`
        - `@wormhole-foundation/sdk-solana-cctp`
        - `@wormhole-foundation/sdk-aptos-cctp`
        - `@wormhole-foundation/sdk-sui-cctp`

    - Other Protocols
        - `@wormhole-foundation/sdk-evm-portico`
        - `@wormhole-foundation/sdk-evm-tbtc`
        - `@wormhole-foundation/sdk-solana-tbtc`

    ---

    Utility Packages
    
    - `@wormhole-foundation/sdk-base`
    - `@wormhole-foundation/sdk-definitions`
    - `@wormhole-foundation/sdk-connect`


## Initialize the SDK

Getting your integration started is simple. First, import Wormhole:

```ts
import { wormhole } from '@wormhole-foundation/sdk';
```

Then, import each of the ecosystem [platforms](/docs/tools/typescript-sdk/sdk-reference/#platforms) that you wish to support:

```ts
import algorand from '@wormhole-foundation/sdk/algorand';
import aptos from '@wormhole-foundation/sdk/aptos';
import cosmwasm from '@wormhole-foundation/sdk/cosmwasm';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
```

To make the [platform](/docs/tools/typescript-sdk/sdk-reference/#platforms) modules available for use, pass them to the Wormhole constructor and specify the network (`Mainnet`, `Testnet`, or `Devnet`) you want to interact with:

```ts
  const wh = await wormhole('Testnet', [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
    sui,
  ]);
```

With a configured `Wormhole` object, you can begin to interact with these chains.

## Example Usage

Follow these steps to confirm that the SDK is initialized correctly and can fetch basic chain information for your target chains.

### Prerequisites

Before you begin, make sure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed.

??? example "Project setup instructions"
 
    Use the following commands to create a TypeScript project:

    1. Create a directory and initialize a Node.js project:

        ```bash
        mkdir wh-ts-demo
        cd wh-ts-demo
        npm init -y
        ```

    2. Install TypeScript, `tsx` (for running TypeScript files), Node.js type definitions, the base Wormhole SDK, and the platform-specific packages for the chains you want to interact with:

        ```bash
        npm install --save-dev tsx typescript @types/node @wormhole-foundation/sdk @wormhole-foundation/sdk-evm @wormhole-foundation/sdk-solana
        ```

    3. Create a `tsconfig.json` if you don't have one. You can generate a basic one using the following command:

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

    4. Initialize the main `Wormhole` class to use the SDK. Create a new TypeScript file named `src/main.ts` in your project directory:

        ```bash
        mkdir src
        touch src/main.ts
        ```

    5. Add the following code to initialize the SDK and use the `Wormhole` instance to return the chain ID and RPC for the chains this instance supports:

        ```ts title="src/main.ts"
        import { wormhole } from '@wormhole-foundation/sdk';
        // Import specific platform modules for the chains you intend to use
        import evm from '@wormhole-foundation/sdk/evm';
        import solana from '@wormhole-foundation/sdk/solana';

        async function main() {
          console.log('Initializing Wormhole SDK...');

          // Determine the network: "Mainnet", "Testnet", or "Devnet"
          const network = 'Testnet';

          // Initialize the SDK with the chosen network and platform contexts
          const wh = await wormhole(network, [evm, solana]);

          console.log('Wormhole SDK Initialized!');
        }

        main().catch((e) => {
          console.error('Error initializing Wormhole SDK', e);
          process.exit(1);
        });

        ```

### Fetch Chain Information

1. Update the `main` function as follows to retrieve the chain ID and RPC for the chains your project supports:

    ```ts title="src/main.ts"
    import { wormhole } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';
    import solana from '@wormhole-foundation/sdk/solana';

    async function main() {
      console.log('Initializing Wormhole SDK...');

      const network = 'Testnet';
      const wh = await wormhole(network, [evm, solana]);

      console.log('Wormhole SDK Initialized!');

      // Example: Get a chain ID and RPC for Solana
      const solanaDevnetChain = wh.getChain('Solana');
      console.log(
        `Chain ID for Solana Testnet: ${solanaDevnetChain.config.chainId}`
      );
      console.log(`RPC for Solana Testnet: ${solanaDevnetChain.config.rpc}`);

      // Example: Get a chain ID for Sepolia (EVM Testnet)
      const sepoliaChain = wh.getChain('Sepolia');
      console.log(`Chain ID for Sepolia: ${sepoliaChain.config.chainId}`);
      console.log(`RPC for Sepolia: ${sepoliaChain.config.rpc}`);
    }

    main().catch((e) => {
      console.error(
        'Error initializing Wormhole SDK or fetching chain information:',
        e
      );
      process.exit(1);
    });

    ```

2. Run the script with the following command, replacing `INSERT_FILE_NAME` with your file name:

    ```bash
    npx tsx INSERT_FILE_NAME
    ```

    You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
        <span data-ty="input"
          ><span class="file-path"></span>npx tsx src/main.ts</span
        >
        <span data-ty>Initializing Wormhole SDK...</span>
        <span data-ty>Wormhole SDK Initialized!</span>
        <span data-ty>Chain ID for Solana Testnet: 1</span>
        <span data-ty>RPC for Solana Testnet: https://api.devnet.solana.com</span>
        <span data-ty>Chain ID for Sepolia: 10002</span>
        <span data-ty>RPC for Sepolia: https://ethereum-sepolia.publicnode.com</span>
        <span data-ty="input"><span class="file-path"></span></span>
      </div>
Congratulations! You’ve successfully installed the Wormhole TypeScript SDK and initialized a `Wormhole` instance. Consider the following options to build on what you've accomplished.

## Next Steps

- [Get familiar with the SDK](/docs/tools/typescript-sdk/sdk-reference/)
- [Send a multichain message](/docs/products/messaging/get-started/)
- [Transfer assets via WTT](/docs/products/token-transfers/wrapped-token-transfers/tutorials/transfer-workflow/)
- [Transfer USDC via the CCTP Bridge](/docs/products/cctp-bridge/tutorials/complete-usdc-transfer/)
