---
title: Query NTT Data and Transfers with Wormholescan
description: Learn how to use the Wormholescan API and Wormhole SDK to fetch NTT tokens and transfer data step by step using reusable TypeScript helpers.
url: https://wormhole.com/docs/products/messaging/guides/wormholescan-api/
---

# Query NTT Data and Transfers with Wormholescan

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}

The [Wormholescan API](https://wormholescan.io/#/developers/api-doc){target=\_blank} provides a public interface for exploring cross-chain activity powered by Wormhole. You can use it to fetch token transfer operations, [Native Token Transfer (NTT)](/docs/products/token-transfers/native-token-transfers/overview/) metadata, [VAA details](/docs/protocol/infrastructure/vaas/){target=\_blank}, and more.

In this guide, you will learn how to build a simple TypeScript project that:

 - Lists NTT tokens available on Wormhole.
 - Fetches metadata for a selected token across chains.
 - Retrieves recent transfer operations using an emitter address.

This guide is helpful if you are building a dashboard, writing monitoring tools, or want to explore how data flows across Wormhole-connected chains.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.

## Project Setup

In this section, you will create the directory, initialize a Node.js project, install dependencies, and configure TypeScript.

1. **Create the project**: set up the directory and navigate into it.

    ```bash
    mkdir wormholescan-api-demo
    cd wormholescan-api-demo
    ```

2. **Initialize a Node.js project**: generate a `package.json` file.

    ```bash
    npm init -y
    ```

3. **Set up TypeScript**: create a `tsconfig.json` file.

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json title="tsconfig.json"
    {
        "compilerOptions": {
            "target": "ES2022",
            "module": "ESNext",
            "moduleResolution": "node",
            "strict": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "skipLibCheck": true,
            "outDir": "./dist",
            "declaration": true,
            "declarationMap": true,
            "sourceMap": true
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules", "dist"]
    }

    ```

4. **Install dependencies**: add the required packages. This guide uses the SDK version `3.x`.

    ```bash
    npm install @wormhole-foundation/sdk axios
    npm install -D tsx typescript @types/node
    ```

     - `@wormhole-foundation/sdk`: utility methods (e.g., chain ID helpers).
     - `axios`: HTTP client for calling the Wormholescan API.
     - `tsx`: runs TypeScript files without compiling them.
     - `typescript`: adds TypeScript support.
     - `@types/node`: provides Node.js type definitions.

5. **Create the project structure**: set up the required directories and files.

    ```bash
    mkdir -p src/helpers src/scripts

    touch \
        src/helpers/api-client.ts \
        src/helpers/utils.ts \
        src/helpers/types.ts \
        src/scripts/fetch-ntt-tokens.ts \
        src/scripts/fetch-operations.ts
    ```

     - `src/helpers/`: contains shared API logic, utilities, and type definitions.
     - `src/scripts/`: contains runnable scripts for fetching token and transfer data.

## Create Helper Functions

Before writing scripts that interact with Wormholescan, we will define a few reusable helper modules. These will handle API calls, extract token and chain data, and provide consistent TypeScript types for working with NTT tokens and transfers.

These helpers will make it easier to write clean, focused scripts later on.

### Create a Wormholescan API Client

In this step, you will create a lightweight API client to interact with Wormholescan. This helper will enable you to easily fetch NTT tokens and perform token transfer operations using a reusable `get()` method with built-in error handling. The client supports both mainnet and testnet endpoints.

It exposes two core methods:

 - `getNTTTokens()`: fetches the complete list of NTT-enabled tokens.
 - `getTokenTransfers()`: fetches token transfer operations with optional filters (chain, address, pagination, etc.).

Under the hood, both methods use a generic `get(endpoint, params)` wrapper that handles URL construction and error reporting.

Add the following code to `src/helpers/api-client.ts`:

```typescript title="src/helpers/api-client.ts"
import axios, { AxiosResponse } from 'axios';

// WormholeScan API Client -  simple wrapper for making requests to the WormholeScan API
export class WormholeScanAPI {
  private baseURL: string;

  constructor(isTestnet: boolean = false) {
    this.baseURL = isTestnet
      ? 'https://api.testnet.wormholescan.io/api/v1'
      : 'https://api.wormholescan.io/api/v1';
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseURL}${endpoint}`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API request failed: ${error.response?.status} - ${error.response?.statusText}`
        );
      }
      throw new Error(`Unexpected error: ${error}`);
    }
  }

  async getNTTTokens(withLinks: boolean = false) {
    return this.get('/native-token-transfer/token-list', { withLinks });
  }

  async getTokenTransfers(
    params: {
      tokenAddress?: string;
      fromChain?: number;
      toChain?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) {
    return this.get('/native-token-transfer', params);
  }
}

export const wormholeScanAPI = new WormholeScanAPI();
export const wormholeScanTestnetAPI = new WormholeScanAPI(true);

```

### Add Utility Functions

Next, you will define two utility functions that help interpret NTT tokens and operations from Wormholescan:

 - `getRandomPlatform(token)`: selects a random platform for a given NTT token and returns its address and chain ID.
 - `getOperationStatus(operation)`: interprets the status of a token transfer operation (e.g., In Progress, Emitted, Completed).

These utilities will be used in later scripts to randomly select a chain/token combo and display the transfer status more clearly.

Add the following code to `src/helpers/utils.ts`:

```typescript title="src/helpers/utils.ts"
import { toChainId } from '@wormhole-foundation/sdk';
import { NTTToken, Operation } from './types';

export function getRandomPlatform(
  token: NTTToken
): { platform: string; address: string; chainId: number } | null {
  const platforms = Object.entries(token.platforms);

  if (platforms.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * platforms.length);
  const [platform, address] = platforms[randomIndex];

  try {
    // SDK expects "Ethereum" not "ethereum"
    const capitalizedPlatform =
      platform.charAt(0).toUpperCase() + platform.slice(1);
    const chainId = toChainId(capitalizedPlatform);
    return { platform, address, chainId };
  } catch (error) {
    const platformMapping: Record<string, string> = {
      'arbitrum-one': 'Arbitrum',
      'binance-smart-chain': 'Bsc',
      'polygon-pos': 'Polygon',
      'optimistic-ethereum': 'Optimism',
    };

    const mappedPlatform = platformMapping[platform.toLowerCase()];
    if (mappedPlatform) {
      try {
        const chainId = toChainId(mappedPlatform);
        return { platform, address, chainId };
      } catch (mappedError) {
        console.warn(
          `Could not convert mapped platform ${mappedPlatform} to chain ID`
        );
        return null;
      }
    }

    console.warn(`Could not convert platform ${platform} to chain ID`);
    return null;
  }
}

export function getOperationStatus(operation: Operation): string {
  if (operation.targetChain) {
    return 'Completed';
  } else if (operation.vaa) {
    return 'Emitted';
  } else if (operation.sourceChain) {
    return 'In Progress';
  } else {
    return 'Unknown';
  }
}

```

### Define Types for NTT Tokens and Transfers

Before proceeding, let's define the TypeScript interfaces required for type-safe API responses from Wormholescan. These types will be used throughout the project to validate and work with token metadata and transfer operations.

Add the following content inside `src/helpers/types.ts`:

```typescript title="src/helpers/types.ts"
export interface NTTToken {
  symbol: string;
  coingecko_id: string;
  fully_diluted_valuation: string;
  price: string;
  price_change_percentage_24h: string;
  volume_24h: string;
  total_value_transferred: string;
  total_value_locked: string | null;
  market_cap: string;
  circulating_supply: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  platforms: Record<string, string>;
}

export interface NTTTokenDetail {
  home: {
    blockchain: string;
    externalSalt: string | null;
    isCanonical: boolean;
    lastIndexed: number;
    manager: {
      address: string;
      limits: Array<{
        amount: string;
        baseAmount: string;
        blockchain: string;
        type: string;
        wormholeChainId: number;
      }>;
      owner: {
        address: string | null;
        nttOwner: string | null;
      };
      transceivers: Array<{
        address: string;
        index: number;
        type: string;
      }>;
      version: string;
    };
    mode: string;
    token: {
      address: string;
      decimals: number;
      maxSupply: string;
      minter: string;
      name: string;
      owner: string;
      symbol: string;
      totalSupply: string;
    };
    wormholeChainId: number;
  };
  peers: any[];
}

export interface Operation {
  id: string;
  emitterChain: number;
  emitterAddress: {
    hex: string;
    native: string;
  };
  sequence: string;
  vaa?: {
    raw: string;
    guardianSetIndex: number;
    isDuplicated: boolean;
  };
  content: {
    payload: {
      nttManagerMessage: {
        id: string;
        sender: string;
      };
      nttMessage: {
        additionalPayload: string;
        sourceToken: string;
        to: string;
        toChain: number;
        trimmedAmount: {
          amount: string;
          decimals: number;
        };
      };
      transceiverMessage: {
        prefix: string;
        recipientNttManager: string;
        sourceNttManager: string;
        transceiverPayload: string;
      };
    };
    standarizedProperties: {
      appIds: string[];
      fromChain: number;
      fromAddress: string;
      toChain: number;
      toAddress: string;
      tokenChain: number;
      tokenAddress: string;
      amount: string;
      feeAddress: string;
      feeChain: number;
      fee: string;
      normalizedDecimals: number;
    };
  };
  sourceChain?: {
    chainId: number;
    timestamp: string;
    transaction: {
      txHash: string;
    };
    from: string;
    status: string;
    fee: string;
    gasTokenNotional: string;
    feeUSD: string;
  };
  targetChain?: {
    chainId: number;
    timestamp: string;
    transaction: {
      txHash: string;
    };
    status: string;
    from: string;
    to: string;
    fee: string;
    gasTokenNotional: string;
    feeUSD: string;
  };
}

export interface OperationsResponse {
  operations: Operation[];
}

```

## Fetch and Inspect NTT Tokens

In this step, you will create a script that fetches a list of NTT tokens from Wormholescan and inspects their detailed metadata.

The script does the following:

 - Retrieves all available NTT tokens via the API client.
 - Picks the first 5 with platform data.
 - Selects a random platform for each token (e.g., Ethereum, Arbitrum).
 - Fetches and logs metadata for that token on that platform.

You can control how many tokens are processed by modifying the `TOKENS_TO_PROCESS` constant near the top of the script.

Add the following code to `src/scripts/fetch-ntt-tokens.ts`:

```typescript title="src/scripts/fetch-ntt-tokens.ts"
#!/usr/bin/env tsx

import { wormholeScanAPI } from '../helpers/api-client';
import { NTTToken, NTTTokenDetail } from '../helpers/types';
import { getRandomPlatform } from '../helpers/utils';

// Configurable variable - easily adjust the number of tokens to process
const TOKENS_TO_PROCESS = INSERT_NUMBER_OF_TOKENS;

async function fetchNTTTokens() {
  console.log('🔍 Fetching NTT tokens from WormholeScan API...\n');

  try {
    const tokens = (await wormholeScanAPI.getNTTTokens(false)) as NTTToken[];

    // Get detailed information for tokens
    const tokensWithPlatforms = tokens.filter(
      (token) => Object.keys(token.platforms).length > 0
    );
    const tokensToProcess = tokensWithPlatforms.slice(0, TOKENS_TO_PROCESS);

    console.log(
      `🔍 Fetching detailed NTT information for first ${TOKENS_TO_PROCESS} tokens...\n`
    );

    for (const token of tokensToProcess) {
      console.log(`📋 ${token.symbol} (${token.coingecko_id})`);

      // Get a random platform from the token's available platforms
      const platformInfo = getRandomPlatform(token);

      if (!platformInfo) {
        console.error(
          `❌ Could not determine platform info for ${token.symbol}`
        );
        continue;
      }

      const { platform, address, chainId } = platformInfo;

      console.log(`Selected Platform: ${platform} (Chain ID: ${chainId})`);

      try {
        // Fetch detailed NTT information using the correct chain ID
        const detail = (await wormholeScanAPI.get(
          `/ntt/token/${chainId}/${address}`
        )) as NTTTokenDetail;

        console.log(`Token Name: ${detail.home.token.name}`);
        console.log(`Token Symbol: ${detail.home.token.symbol}`);
        console.log(`Mode: ${detail.home.mode}`);
        console.log(`Manager Address: ${detail.home.manager.address}`);
        console.log(`Version: ${detail.home.manager.version}`);
        console.log(
          `Transceiver Address: ${
            detail.home.manager.transceivers[0]?.address || 'N/A'
          }`
        );
      } catch (error) {
        console.log(
          `❌ No NTT configuration found for ${token.symbol} on ${platform}`
        );
      }

      console.log('\n' + '='.repeat(50) + '\n');
    }
  } catch (error) {
    console.error('❌ Error fetching NTT tokens:', error);
    process.exit(1);
  }
}

fetchNTTTokens();

```

Run it with:

```bash
npx tsx src/scripts/fetch-ntt-tokens.ts
```

If successful, the output will be:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>npm run ntt-tokens</span>
	<span data-ty> </span>
	<span data-ty>> demo-wormholescan-api@1.0.0 ntt-tokens</span>
	<span data-ty>> npx tsx src/scripts/fetch-ntt-tokens.ts</span>
	<span data-ty> </span>
	<span data-ty>🔍 Fetching NTT tokens from WormholeScan API...</span>
	<span data-ty> </span>
	<span data-ty>🔍 Fetching detailed NTT information for first 5 tokens... </span>
	<span data-ty> </span>
	<span data-ty>📋 LINGO (lingo) </span>
	<span data-ty>Selected Platform: solana (Chain ID: 1) </span>
	<span data-ty>Token Name: Lingo </span>
    <span data-ty>Token Symbol: Lingo </span>
    <span data-ty>Mode: burning </span>
    <span data-ty>Manager Address: nTTQspEC1JoEUJVFTcgZSatgcv4PNT8UYtCtyaUSKcX </span>
    <span data-ty>Version: 3.0.0 </span>
    <span data-ty>Transceiver Address: CnDQ53A3j2EcniJAm7UtuYKmQtovFAmumcuzC648moSE </span>
    <span data-ty>================================================== </span>
    <span data-ty>... </span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

## Fetch Transfer Operations

Now, you will create a script to fetch NTT transfer operations using the Wormholescan API. These operations contain key details such as:

 - Source and target chains.
 - Wallet addresses.
 - Token amount and metadata.
 - VAA and execution status.

You will log the first few operations in a readable format to better understand how transfers are structured.

The script will use a specific emitter address to query transfers. You can easily change which token or manager you are tracking by modifying the `EMITTER_ADDRESS` constant near the top of the file.

Add the following code to `src/scripts/fetch-operations.ts`:

```typescript title="src/scripts/fetch-operations.ts"
#!/usr/bin/env tsx

import { wormholeScanTestnetAPI } from '../helpers/api-client';
import { OperationsResponse } from '../helpers/types';
import { getOperationStatus } from '../helpers/utils';

const EMITTER_ADDRESS = 'INSERT_EMITTER_ADDRESS';
const PAGE_SIZE = 'INSERT_NUMBER_OF_TRANSFERS_TO_FETCH'; // e.g., 10, 20, etc.

async function fetchTokenTransfers() {
  console.log(
    '🔍 Fetching token transfer operations from WormholeScan API...\n'
  );

  try {
    const response = (await wormholeScanTestnetAPI.get(
      `/operations?address=${EMITTER_ADDRESS}&pageSize=${PAGE_SIZE}`
    )) as OperationsResponse;

    console.log(
      `✅ Found ${response.operations.length} operations for emitter ${EMITTER_ADDRESS}\n`
    );

    for (const operation of response.operations) {
      const overallStatus = getOperationStatus(operation);
      const { standarizedProperties } = operation.content;

      console.log(`📋 Status: ${overallStatus}`);
      console.log(
        `🔗 Transfer: Chain ${standarizedProperties.fromChain} → Chain ${standarizedProperties.toChain}`
      );
      console.log(`📍 From: ${standarizedProperties.fromAddress}`);
      console.log(`📍 To: ${standarizedProperties.toAddress}`);

      if (operation.sourceChain) {
        console.log(
          `🟢 Source: ${operation.sourceChain.transaction.txHash} (${operation.sourceChain.status})`
        );
      }

      if (operation.targetChain) {
        console.log(
          `🟢 Target: ${operation.targetChain.transaction.txHash} (${operation.targetChain.status})`
        );
      }

      if (operation.vaa && !operation.targetChain) {
        console.log(`⏳ VAA emitted, awaiting completion`);
      }

      console.log(''); // Empty line between operations
    }
  } catch (error) {
    console.error('❌ Error fetching token transfers:', error);
    process.exit(1);
  }
}

fetchTokenTransfers();

```

Run it with:

```bash
npx tsx src/scripts/fetch-operations.ts
```

If successful, the output will look like this:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>npm run operations</span>
	<span data-ty> </span>
	<span data-ty>> demo-wormholescan-api@1.0.0 operations</span>
	<span data-ty>> npx tsx src/scripts/fetch-operations.ts</span>
	<span data-ty> </span>
	<span data-ty>🔍 Fetching token transfer operations from WormholeScan API...</span>
	<span data-ty> </span>
	<span data-ty>✅ Found 5 operations for emitter 0xdF77F921a560F6882e4EC4bbDc2fF37a7A26D4Db</span>
	<span data-ty> </span>
	<span data-ty>📋 Status: Completed</span>
	<span data-ty>🔗 Transfer: Chain 1 → Chain 10002</span>
	<span data-ty>📍 From: wA8eCo4AR7pAgFsAPpU64wYouBY6CUVPLGuMMBu2eaB</span>
    <span data-ty>📍 To: 0xdF77F921a560F6882e4EC4bbDc2fF37a7A26D4Db</span>
    <span data-ty>🟢 Source: 5axKXqHHq8C4vWqKnrZ3vnmDRTu4D9XPMaJBDrMrxuEawhRS7xnwcAJ5UZ1k9eYgakzz4LXopJdJjyCEZDbH9CEH (confirmed)</span>
    <span data-ty>🟢 Target: 0x619da24b77289c20fbbd2564833b49522f2624db5e92194ddea65f18ebb116fc (completed)</span>
    <span data-ty> </span>
    <span data-ty>... </span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

## Resources

You can explore the complete project and find all necessary scripts and configurations in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}.

The repository includes everything covered in this guide, which is helpful for dashboards, bots, or alerting systems built on top of Wormholescan.
