---
title: Replace Outdated Signatures in VAAs
description: Learn how to fetch, validate, and replace outdated signatures in Wormhole VAAs using Wormholescan and the Wormhole SDK to ensure seamless processing.
categories: Basics, Typescript SDK
url: https://wormhole.com/docs/products/messaging/tutorials/replace-signatures/
---

# Replace Outdated Signatures in VAAs

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}

Cross-chain transactions in Wormhole rely on [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank}, which contain signatures from a trusted set of validators called [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank}. These signatures prove that the network approved an action, such as a token transfer.

However, the set of Guardians changes over time. If a user generates a transaction and waits too long before redeeming it, the Guardian set may have already changed. This means the VAA will contain outdated signatures from Guardians, who are no longer part of the network, causing the transaction to fail.

Instead of discarding these VAAs, we can fetch updated signatures and replace the outdated ones to ensure smooth processing.

In this tutorial, you'll build a script from scratch to:

- Fetch a VAA from [Wormholescan](https://wormholescan.io/#/developers/api-doc){target=\_blank}.
- Validate its signatures against the latest Guardian set.
- Replace outdated signatures using the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}.
- Output a valid VAA ready for submission.

By the end, you'll have a script that ensures VAAs remain valid and processable, avoiding transaction failures.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally.

## Project Setup

In this section, you will create the directory, initialize a Node.js project, install dependencies, and configure TypeScript.

1. **Create the project**: Set up the directory and navigate into it.

    ```bash
    mkdir wormhole-scan-api-demo
    cd wormhole-scan-api-demo
    ```

2. **Initialize a Node.js project**: Generate a `package.json` file.

    ```bash
    npm init -y
    ```

3. **Set up TypeScript**: Create a `tsconfig.json` file.

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json title="tsconfig.json"
    {
        "compilerOptions": {
            "target": "es2016",
            "module": "commonjs",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true
        }
    }

    ```

4. **Install dependencies**: Add the required packages. This tutorial uses the SDK version `4.1.0`.

    ```bash
    npm install @wormhole-foundation/sdk@4.1.0 axios web3 tsx @types/node
    ```

     - **`@wormhole-foundation/sdk`**: Handles VAAs and cross-chain interactions.  
     - **`axios`**: Makes HTTP requests to the Wormholescan API.  
     - **`web3`**: Interacts with Ethereum transactions and contracts.  
     - **`tsx`**: Executes TypeScript files without compilation.  
     - **`@types/node`**: Provides Node.js type definitions. 

5. **Create the project structure**: Set up the required directories and files.

    ```bash
    mkdir -p src/config && touch src/config/constants.ts src/config/layouts.ts
    mkdir -p src/helpers && touch src/helpers/vaaHelper.ts
    mkdir -p src/scripts && touch scripts/replaceSignatures.ts
    ```

     - **`src/config/*`**: Stores public configuration variables and layouts for serializing and deserializing data structures.
     - **`src/helpers/*`**: Contains utility functions.
     - **`src/scripts/*`**: Contains scripts for fetching and replacing signatures.

6. **Set variables**: Define key constants in `src/config/constants.ts`.

    ```bash title="src/config/constants.ts"
    export const RPC = 'https://ethereum-rpc.publicnode.com';

    export const ETH_CORE =
      '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'.toLowerCase();

    export const WORMHOLESCAN_API = 'https://api.wormholescan.io/v1';

    export const LOG_MESSAGE_PUBLISHED_TOPIC =
      '0x6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b2';

    export const TXS = [
      '0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367',
      '0x3c989a6bb40dcd4719453fbe7bbac420f23962c900ae75793124fc9cc614368c',
    ];

    ```

     - **`RPC`**: Endpoint for interacting with an Ethereum RPC node.
     - **`ETH_CORE`**: [Wormhole's Core Contract address on Ethereum](/docs/products/reference/contract-addresses/#core-contracts){target=\_blank} responsible for verifying VAAs.
     - **`WORMHOLESCAN_API`**: Base URL for querying the Wormholescan API to fetch VAA data and Guardian sets.
     - **`LOG_MESSAGE_PUBLISHED_TOPIC`**: The event signature hash for `LogMessagePublished`, a Wormhole contract event that signals when a VAA has been emitted. This is used to identify relevant logs in transaction receipts.
     - **`TXS`**: List of example transaction hashes that will be used for testing.

7. **Define data structure for working with VAAs**: Specify the ABI for the Wormhole Core Contract's `parseAndVerifyVM` function, which parses and verifies VAAs. Defining the data structure, also referred to as a [layout](/docs/tools/typescript-sdk/guides/sdk-layout/){target=\_blank}, for this function ensures accurate decoding and validation of VAAs.

    ```typescript title="src/config/layouts.ts"
    export const PARSE_AND_VERIFY_VM_ABI = {
      inputs: [{ internalType: 'bytes', name: 'encodedVM', type: 'bytes' }],
      name: 'parseAndVerifyVM',
      outputs: [
        {
          components: [
            { internalType: 'uint8', name: 'version', type: 'uint8' },
            { internalType: 'uint32', name: 'timestamp', type: 'uint32' },
            { internalType: 'uint32', name: 'nonce', type: 'uint32' },
            { internalType: 'uint16', name: 'emitterChainId', type: 'uint16' },
            { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
            { internalType: 'uint64', name: 'sequence', type: 'uint64' },
            { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
            { internalType: 'bytes', name: 'payload', type: 'bytes' },
            { internalType: 'uint32', name: 'guardianSetIndex', type: 'uint32' },
            {
              components: [
                { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                { internalType: 'bytes32', name: 's', type: 'bytes32' },
                { internalType: 'uint8', name: 'v', type: 'uint8' },
                { internalType: 'uint8', name: 'guardianIndex', type: 'uint8' },
              ],
              internalType: 'struct Structs.Signature[]',
              name: 'signatures',
              type: 'tuple[]',
            },
            { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
          ],
          internalType: 'struct Structs.VM',
          name: 'vm',
          type: 'tuple',
        },
        { internalType: 'bool', name: 'valid', type: 'bool' },
        { internalType: 'string', name: 'reason', type: 'string' },
      ],
      stateMutability: 'view',
      type: 'function',
    };

    ```

## Create VAA Handling Functions

In this section, we'll create a series of helper functions in the `src/helpers/vaaHelper.ts` file that will retrieve and verify VAAs and fetch and replace outdated Guardian signatures to generate a correctly signed VAA.

To get started, import the necessary dependencies:

```typescript title="src/helpers/vaaHelper.ts"
import axios from 'axios';
import { eth } from 'web3';
import {
  deserialize,
  serialize,
  VAA,
  Signature,
} from '@wormhole-foundation/sdk';
import {
  RPC,
  ETH_CORE,
  LOG_MESSAGE_PUBLISHED_TOPIC,
  WORMHOLESCAN_API,
} from '../config/constants';
import { PARSE_AND_VERIFY_VM_ABI } from '../config/layouts';
```

### Fetch a VAA ID from a Transaction

To retrieve a VAA, we first need to get its VAA ID from a transaction hash. This ID allows us to fetch the full VAA later.
The VAA ID is structured as follows:

```bash
chain/emitter/sequence
```

 - **`chain`**: The [Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} (Ethereum is 2).
 - **`emitter`**: The contract address that emitted the VAA.
 - **`sequence`**: A unique identifier for the event.

We must assemble the ID correctly since this is the format the Wormholescan API expects when querying VAAs.

Follow the below steps to process the transaction logs and construct the VAA ID:

1. **Get the transaction receipt**: Iterate over the array of transaction hashes and fetch the receipt to access its logs.

2. **Find the Wormhole event**: Iterate over the transaction logs and check for events emitted by the Wormhole Core contract. Look specifically for `LogMessagePublished` events, which indicate a VAA was created.

3. **Extract the emitter and sequence number**: If a matching event is found, extract the emitter address from `log.topics[1]` and remove the `0x` prefix. Then, the sequence number from `log.data` is extracted, converting it from hex to an integer.

4. **Construct the VAA ID**: Format the extracted data in `chain/emitter/sequence` format.

```typescript title="src/helpers/vaaHelper.ts"
export async function fetchVaaId(txHashes: string[]): Promise<string[]> {
  const vaaIds: string[] = [];

  for (const tx of txHashes) {
    try {
      const result = (
        await axios.post(RPC, {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [tx],
        })
      ).data.result;

      if (!result)
        throw new Error(`Unable to fetch transaction receipt for ${tx}`);

      for (const log of result.logs) {
        if (
          log.address === ETH_CORE &&
          log.topics?.[0] === LOG_MESSAGE_PUBLISHED_TOPIC
        ) {
          const emitter = log.topics[1].substring(2);
          const seq = BigInt(log.data.substring(0, 66)).toString();
          vaaIds.push(`2/${emitter}/${seq}`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${tx}:`, error);
    }
  }

  return vaaIds;
}
```

???- code "Try it out: VAA ID retrieval"
    If you want to try out the function before moving forward, create a test file inside the `test` directory: 

    1. Create the directory and file:

        ```bash
        mkdir -p test
        touch test/fetchVaaId.run.ts
        ```  

    2. Add the function call:  

        ```typescript title="test/fetchVaaId.run.ts"
        import { fetchVaaId } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchVaaId = async () => {
          for (const tx of TXS) {
            const vaaIds = await fetchVaaId([tx]);

            if (vaaIds.length > 0) {
              console.log(`Transaction: ${tx}`);
              vaaIds.forEach((vaaId) => console.log(`VAA ID: ${vaaId}`));
            } else {
              console.log(`No VAA ID found for transaction: ${tx}`);
            }
          }
        };

        testFetchVaaId();

        ```  

    3. Run the script:  

        ```bash
        npx tsx test/fetchVaaId.run.ts
        ```  

        If successful, the output will be:

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/fetchVaaId.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty
        		>Transaction: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367</span
        	>
        	<span data-ty
        		>VAA ID: 2/0000000000000000000000003ee18b2214aff97000d974cf647e7c347e8fa585/164170</span
        	>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>

        If no VAA ID is found, the script will log an error message.

### Fetch the Full VAA

Now that you have the VAA ID, we can use it to fetch the full VAA payload from the Wormholescan API. This payload contains the VAA bytes, which will later be used for signature validation.

Open `src/helpers/vaaHelper.ts` and create the `fetchVaa()` function to iterate through VAA IDs and extract the `vaaBytes` payload.

```typescript title="src/helpers/vaaHelper.ts"
export async function fetchVaa(
  vaaIds: string[]
): Promise<{ id: string; vaaBytes: string }[]> {
  const results: { id: string; vaaBytes: string }[] = [];

  for (const id of vaaIds) {
    try {
      const response = await axios.get(`${WORMHOLESCAN_API}/signed_vaa/${id}`);
      const vaaBytes = response.data.vaaBytes;
      results.push({ id, vaaBytes });
    } catch (error) {
      console.error(`Error fetching VAA for ${id}:`, error);
    }
  }
  return results;
}
```

???- code "Try it out: VAA retrieval"
    If you want to try the function before moving forward, create a script inside the `test` directory  

    1. Create the script file:

        ```bash
        touch test/fetchVaa.run.ts
        ```

    2. Add the function call:

        ```typescript title="test/fetchVaa.run.ts"
        import { fetchVaaId, fetchVaa } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchVaa = async () => {
          for (const tx of TXS) {
            const vaaIds = await fetchVaaId([tx]);

            if (vaaIds.length === 0) {
              console.log(`No VAA ID found for transaction: ${tx}`);
              continue;
            }

            for (const vaaId of vaaIds) {
              const vaaBytes = await fetchVaa([vaaId]);

              console.log(
                `Transaction: ${tx}\nVAA ID: ${vaaId}\nVAA Bytes: ${
                  vaaBytes.length > 0 ? vaaBytes[0].vaaBytes : 'Not found'
                }`
              );
            }
          }
        };

        testFetchVaa();

        ```

    3. Run the script:

        ```bash
        npx tsx test/fetchVaa.run.ts
        ```

        If successful, the output will be:

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/fetchVaa.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty
        		>Transaction: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367</span
        	>
        	<span data-ty
        		>VAA Bytes: AQAAAAMNANQSwD/HRPcKp7Yxypl1ON8dZeMBzgYJrd2KYz6l9Tq9K9fj72fYJgkMeMaB9h...</span
        	>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>

        If no VAA is found, the script will log an error message.

### Validate VAA Signatures

Now, we need to verify its validity. A VAA is only considered valid if it contains signatures from currently active Guardians and is correctly verified by the Wormhole Core contract.

Open `src/helpers/vaaHelper.ts` and add the `checkVaaValidity()` function. This function verifies whether a VAA is valid by submitting it to an Ethereum RPC node and checking for outdated signatures.  

Follow these steps to implement the function:  

1. **Prepare the VAA for verification**: Construct the VAA payload in a format that can be sent to the Wormhole Core contract.

2. **Send an `eth_call` request**: Submit the VAA to an Ethereum RPC node, calling the `parseAndVerifyVM` function on the Wormhole Core contract.

3. **Decode the response**: Check whether the VAA is valid. If it contains outdated signatures, further action will be required to replace them.

```typescript title="src/helpers/vaaHelper.ts"
export async function checkVaaValidity(vaaBytes: string) {
  try {
    const vaa = Buffer.from(vaaBytes, 'base64');
    vaa[4] = 4; // Set guardian set index to 4

    const result = (
      await axios.post(RPC, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            from: null,
            to: ETH_CORE,
            data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [
              `0x${vaa.toString('hex')}`,
            ]),
          },
          'latest',
        ],
      })
    ).data.result;

    const decoded = eth.abi.decodeParameters(
      PARSE_AND_VERIFY_VM_ABI.outputs,
      result
    );
    console.log(
      `${decoded.valid ? '✅' : '❌'} VAA Valid: ${decoded.valid}${
        decoded.valid ? '' : `, Reason: ${decoded.reason}`
      }`
    );

    return { valid: decoded.valid, reason: decoded.reason };
  } catch (error) {
    console.error(`Error checking VAA validity:`, error);
    return { valid: false, reason: 'RPC error' };
  }
}
```

???- code "Try it out: VAA Validity"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. Create the script file:

        ```bash
        touch test/checkVaaValidity.run.ts
        ```

    2. Add the function call:

        ```typescript title="test/checkVaaValidity.run.ts"
        import {
          fetchVaaId,
          fetchVaa,
          checkVaaValidity,
        } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testCheckVaaValidity = async () => {
          for (const tx of TXS) {
            const vaaIds = await fetchVaaId([tx]);

            if (vaaIds.length === 0) {
              console.log(`No VAA ID found for transaction: ${tx}`);
              continue;
            }

            for (const vaaId of vaaIds) {
              const vaaData = await fetchVaa([vaaId]);

              if (vaaData.length === 0 || !vaaData[0].vaaBytes) {
                console.log(`VAA not found for ID: ${vaaId}`);
                continue;
              }

              const result = await checkVaaValidity(vaaData[0].vaaBytes);
              console.log(
                `Transaction: ${tx}\nVAA ID: ${vaaId}\nVAA Validity:`,
                result
              );
            }
          }
        };

        testCheckVaaValidity();

        ```

    3. Run the script:

        ```bash
        npx tsx test/checkVaaValidity.run.ts
        ```

        If the VAA is valid, the output will be:  

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/checkVaaValidity.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty>✅ VAA Valid: true</span>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>

        If invalid, the output will include the reason:

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/checkVaaValidity.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty>❌ VAA Valid: false, Reason: VM signature invalid</span>
        	<span data-ty
        		>Transaction: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367</span
        	>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>

### Fetch Observations (VAA Signatures)

Before replacing outdated signatures, we need to fetch the original VAA signatures from Wormholescan. This allows us to compare them with the latest Guardian set and determine which ones need updating.

Inside `src/helpers/vaaHelper.ts`, create the `fetchObservations()` function to query the Wormholescan API for observations related to a given VAA. Format the response by converting Guardian addresses to lowercase for consistency, and return an empty array if an error occurs.

```typescript title="src/helpers/vaaHelper.ts"
export async function fetchObservations(vaaId: string) {
  try {
    console.log(`Fetching observations`);

    const response = await axios.get(
      `https://api.wormholescan.io/api/v1/observations/${vaaId}`
    );

    return response.data.map((obs: any) => ({
      guardianAddr: obs.guardianAddr.toLowerCase(),
      signature: obs.signature,
    }));
  } catch (error) {
    console.error(`Error fetching observations:`, error);
    return [];
  }
}
```

???- code "Try it out: Fetch Observations"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. Create the script file:

        ```bash
        touch test/fetchObservations.run.ts
        ```

    2. Add the function call:

        ```typescript title="test/fetchObservations.run.ts"
        import { fetchVaaId, fetchObservations } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchObservations = async () => {
          for (const tx of TXS) {
            const vaaIds = await fetchVaaId([tx]);

            if (vaaIds.length === 0) {
              console.log(`No VAA ID found for transaction: ${tx}`);
              continue;
            }

            for (const vaaId of vaaIds) {
              const observations = await fetchObservations(vaaId);

              if (observations.length === 0) {
                console.log(`No observations found for VAA ID: ${vaaId}`);
                continue;
              }

              console.log(
                `Transaction: ${tx}\nVAA ID: ${vaaId}\nObservations:`,
                observations
              );
            }
          }
        };

        testFetchObservations();

        ```

    3. Run the script:

        ```bash
        npx tsx test/fetchObservations.run.ts
        ```

        If successful, the output will be:

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/fetchObservations.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty>Fetching observations</span>
        	<span data-ty
        		>Transaction: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367</span
        	>
        	<span data-ty
        		>Observations: [ { guardianAddr: '0xda798f6896a3331f64b48c12d1d57fd9cbe70811', signature:
        		'ZGFlMDYyOGNjZjFjMmE0ZTk5YzE2OThhZjAzMDM4NzZlYTM1OWMxMzczNDA3YzdlMDMxZTkyNzk0ODkwYjRiYjRiOWFmNzM3NjRiMzIyOTE0ZTQwYzNlMjllMWEzNmM2NTc3ZDc5ZTdhNTM2MzA5YjA4YjExZjE3YzE3MDViNWIwMQ=='
        		}, { guardianAddr: '0x74a3bf913953d695260d88bc1aa25a4eee363ef0', signature:
        		'MzAyOTU4OGU4MWU0ODc0OTAwNDU3N2EzMGZlM2UxMDJjOWYwMjM0NWVhY2VmZWQ0ZGJlNTFkNmI3YzRhZmQ5ZTNiODFjNTg3MDNmYzUzNmJiYWFiZjNlODc1YTY3OTQwMGE4MmE3ZjZhNGYzOGY3YmRmNDNhM2VhNGQyNWNlNGMwMA=='
        		},</span
        	>
        	<span data-ty>...]</span>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>

        If no observations are found, the script will log an error message.

### Fetch the Latest Guardian Set

Now that we have the original VAA signatures, we must fetch the latest Guardian set from Wormholescan. This will allow us to compare the stored signatures with the current Guardians and determine which signatures need replacing.

Create the `fetchGuardianSet()` function inside `src/helpers/vaaHelper.ts` to fetch the latest Guardian set.

```typescript title="src/helpers/vaaHelper.ts"

export async function fetchGuardianSet() {
  try {
    console.log('Fetching current guardian set');

    const response = await axios.get(`${WORMHOLESCAN_API}/guardianset/current`);
    const guardians = response.data.guardianSet.addresses.map((addr: string) =>
      addr.toLowerCase()
    );
    const guardianSet = response.data.guardianSet.index;

    return [guardians, guardianSet];
  } catch (error) {
    console.error('Error fetching guardian set:', error);
    return [];
  }
}
```

???- code "Try it out: Fetch Guardian Set"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. Create the script file:

        ```bash
        touch test/fetchGuardianSet.run.ts
        ```

    2. Add the function call:

        ```typescript title="test/fetchGuardianSet.run.ts"
        import { fetchGuardianSet } from '../src/helpers/vaaHelper';

        const testFetchGuardianSet = async () => {
          const [guardians, guardianSetIndex] = await fetchGuardianSet();

          console.log('Current Guardian Set Index:', guardianSetIndex);
          console.log('Guardian Addresses:', guardians);
        };

        testFetchGuardianSet();

        ```

    3. Run the script:

        ```bash
        npx tsx test/fetchGuardianSet.run.ts
        ```

        If successful, the output will be:

        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npx tsx test/fetchGuardianSet.run.ts</span>
        	<span data-ty> </span>
        	<span data-ty>Fetching current guardian set</span>
        	<span data-ty>Current Guardian Set Index: 4</span>
            <span data-ty>Guardian Addresses: [
                '0x5893b5a76c3f739645648885bdccc06cd70a3cd3',
                '0xff6cb952589bde862c25ef4392132fb9d4a42157',
                '0x114de8460193bdf3a2fcf81f86a09765f4762fd1',
                '0x107a0086b32d7a0977926a205131d8731d39cbeb',
            </span>
            <span data-ty>...]</span>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>
        If an error occurs while fetching the Guardian set, a `500` status error will be logged.

### Replace Outdated Signatures

With the full VAA, Guardian signatures, and the latest Guardian set, we can now update outdated signatures while maintaining the required signature count.

1. **Create the `replaceSignatures()` function**: Open `src/helpers/vaaHelper.ts` and add the function header. To catch and handle errors properly, all logic will be wrapped inside a `try` block.

    ```typescript title="src/helpers/vaaHelper.ts"
    export async function replaceSignatures(
      vaa: string | Uint8Array<ArrayBufferLike>,
      observations: { guardianAddr: string; signature: string }[],
      currentGuardians: string[],
      guardianSetIndex: number
    ) {
      console.log('Replacing Signatures...');

      try {
        // Add logic in the following steps here
      } catch (error) {
        console.error('Unexpected error in replaceSignatures:', error);
      }
    }
    ```

     - **`vaa`**: Original VAA bytes.
     - **`observations`**: Observed signatures from the network.
     - **`currentGuardians`**: Latest Guardian set.
     - **`guardianSetIndex`**: Current Guardian set index.

2. **Validate input data**: Ensure all required parameters are present before proceeding. If any required input is missing, the function throws an error to prevent execution with incomplete data. The Guardian set should never be empty; if it is, this likely indicates an error in fetching the Guardian set in a previous step.

    ```typescript
        if (!vaa) throw new Error('VAA is undefined or empty.');
        if (currentGuardians.length === 0)
          throw new Error('Guardian set is empty.');
        if (observations.length === 0) throw new Error('No observations provided.');
    ```

3. **Filter valid signatures**: Remove signatures from inactive Guardians, keeping only valid ones. If there aren't enough valid signatures to replace the outdated ones, execution is halted to prevent an incomplete or invalid VAA.

    ```typescript
        const validSigs = observations.filter((sig) =>
          currentGuardians.includes(sig.guardianAddr)
        );

        if (validSigs.length === 0)
          throw new Error('No valid signatures found. Cannot proceed.');
    ```

4. **Convert valid signatures**: Ensure signatures are correctly formatted for verification. Convert hex-encoded signatures if necessary and extract their components.

    ```typescript
        const formattedSigs = validSigs
          .map((sig) => {
            try {
              const sigBuffer = Buffer.from(sig.signature, 'base64');
              // If it's 130 bytes, it's hex-encoded and needs conversion
              const sigBuffer1 =
                sigBuffer.length === 130
                  ? Buffer.from(sigBuffer.toString(), 'hex')
                  : sigBuffer;

              const r = BigInt('0x' + sigBuffer1.subarray(0, 32).toString('hex'));
              const s = BigInt('0x' + sigBuffer1.subarray(32, 64).toString('hex'));
              const vRaw = sigBuffer1[64];
              const v = vRaw < 27 ? vRaw : vRaw - 27;

              return {
                guardianIndex: currentGuardians.indexOf(sig.guardianAddr),
                signature: new Signature(r, s, v),
              };
            } catch (error) {
              console.error(
                `Failed to process signature for guardian: ${sig.guardianAddr}`,
                error
              );
              return null;
            }
          })
          .filter(
            (sig): sig is { guardianIndex: number; signature: Signature } =>
              sig !== null
          ); // Remove null values
    ```

5. **Deserialize the VAA**: Convert the raw VAA data into a structured format for further processing.

    ```typescript
        let parsedVaa: VAA<'Uint8Array'>;
        try {
          parsedVaa = deserialize('Uint8Array', vaa);
        } catch (error) {
          throw new Error(`Error deserializing VAA: ${error}`);
        }
    ```

6. **Identify outdated signatures**: Compare the current VAA signatures with the newly formatted ones to detect which signatures belong to outdated Guardians. Remove these outdated signatures to ensure only valid ones remain.

    ```typescript
        const outdatedGuardianIndexes = parsedVaa.signatures
          .filter(
            (vaaSig) =>
              !formattedSigs.some(
                (sig) => sig.guardianIndex === vaaSig.guardianIndex
              )
          )
          .map((sig) => sig.guardianIndex);

        console.log('Outdated Guardian Indexes:', outdatedGuardianIndexes);

        let updatedSignatures = parsedVaa.signatures.filter(
          (sig) => !outdatedGuardianIndexes.includes(sig.guardianIndex)
        );
    ```

7. **Replace outdated signatures**: Substitute outdated signatures with valid ones while maintaining the correct number of signatures. If there aren’t enough valid replacements, execution stops.

    ```typescript
        const validReplacements = formattedSigs.filter(
          (sig) =>
            !updatedSignatures.some((s) => s.guardianIndex === sig.guardianIndex)
        );

        // Check if we have enough valid signatures to replace outdated ones**
        if (outdatedGuardianIndexes.length > validReplacements.length) {
          console.warn(
            `Not enough valid replacement signatures! Need ${outdatedGuardianIndexes.length}, but only ${validReplacements.length} available.`
          );
          return;
        }

        updatedSignatures = [
          ...updatedSignatures,
          ...validReplacements.slice(0, outdatedGuardianIndexes.length),
        ];

        updatedSignatures.sort((a, b) => a.guardianIndex - b.guardianIndex);
    ```

8. **Serialize the updated VAA**: Reconstruct the VAA with the updated signatures and convert it into a format suitable for submission.

    ```typescript
        const updatedVaa: VAA<'Uint8Array'> = {
          ...parsedVaa,
          guardianSet: guardianSetIndex,
          signatures: updatedSignatures,
        };

        let patchedVaa: Uint8Array;
        try {
          patchedVaa = serialize(updatedVaa);
        } catch (error) {
          throw new Error(`Error serializing updated VAA: ${error}`);
        }
    ```

9. **Send the updated VAA for verification and handle errors**: Submit the updated VAA to an Ethereum RPC node for validation, ensuring it can be proposed for Guardian approval. If an error occurs during submission or signature replacement, log the issue and prevent further execution.

    ```typescript
        try {
          if (!(patchedVaa instanceof Uint8Array))
            throw new Error('Patched VAA is not a Uint8Array!');

          const vaaHex = `0x${Buffer.from(patchedVaa).toString('hex')}`;

          console.log('Sending updated VAA to RPC...');

          const result = await axios.post(RPC, {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [
              {
                from: null,
                to: ETH_CORE,
                data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [vaaHex]),
              },
              'latest',
            ],
          });

          const verificationResult = result.data.result;
          console.log('Updated VAA (hex):', vaaHex);
          return verificationResult;
        } catch (error) {
          throw new Error(`Error sending updated VAA to RPC: ${error}`);
        }
    ```

???- code "Complete Function"
    ```typescript
    export async function replaceSignatures(
      vaa: string | Uint8Array<ArrayBufferLike>,
      observations: { guardianAddr: string; signature: string }[],
      currentGuardians: string[],
      guardianSetIndex: number
    ) {
      console.log('Replacing Signatures...');

      try {
        if (!vaa) throw new Error('VAA is undefined or empty.');
        if (currentGuardians.length === 0)
          throw new Error('Guardian set is empty.');
        if (observations.length === 0) throw new Error('No observations provided.');

        const validSigs = observations.filter((sig) =>
          currentGuardians.includes(sig.guardianAddr)
        );

        if (validSigs.length === 0)
          throw new Error('No valid signatures found. Cannot proceed.');

        const formattedSigs = validSigs
          .map((sig) => {
            try {
              const sigBuffer = Buffer.from(sig.signature, 'base64');
              // If it's 130 bytes, it's hex-encoded and needs conversion
              const sigBuffer1 =
                sigBuffer.length === 130
                  ? Buffer.from(sigBuffer.toString(), 'hex')
                  : sigBuffer;

              const r = BigInt('0x' + sigBuffer1.subarray(0, 32).toString('hex'));
              const s = BigInt('0x' + sigBuffer1.subarray(32, 64).toString('hex'));
              const vRaw = sigBuffer1[64];
              const v = vRaw < 27 ? vRaw : vRaw - 27;

              return {
                guardianIndex: currentGuardians.indexOf(sig.guardianAddr),
                signature: new Signature(r, s, v),
              };
            } catch (error) {
              console.error(
                `Failed to process signature for guardian: ${sig.guardianAddr}`,
                error
              );
              return null;
            }
          })
          .filter(
            (sig): sig is { guardianIndex: number; signature: Signature } =>
              sig !== null
          ); // Remove null values

        let parsedVaa: VAA<'Uint8Array'>;
        try {
          parsedVaa = deserialize('Uint8Array', vaa);
        } catch (error) {
          throw new Error(`Error deserializing VAA: ${error}`);
        }

        const outdatedGuardianIndexes = parsedVaa.signatures
          .filter(
            (vaaSig) =>
              !formattedSigs.some(
                (sig) => sig.guardianIndex === vaaSig.guardianIndex
              )
          )
          .map((sig) => sig.guardianIndex);

        console.log('Outdated Guardian Indexes:', outdatedGuardianIndexes);

        let updatedSignatures = parsedVaa.signatures.filter(
          (sig) => !outdatedGuardianIndexes.includes(sig.guardianIndex)
        );

        const validReplacements = formattedSigs.filter(
          (sig) =>
            !updatedSignatures.some((s) => s.guardianIndex === sig.guardianIndex)
        );

        // Check if we have enough valid signatures to replace outdated ones**
        if (outdatedGuardianIndexes.length > validReplacements.length) {
          console.warn(
            `Not enough valid replacement signatures! Need ${outdatedGuardianIndexes.length}, but only ${validReplacements.length} available.`
          );
          return;
        }

        updatedSignatures = [
          ...updatedSignatures,
          ...validReplacements.slice(0, outdatedGuardianIndexes.length),
        ];

        updatedSignatures.sort((a, b) => a.guardianIndex - b.guardianIndex);

        const updatedVaa: VAA<'Uint8Array'> = {
          ...parsedVaa,
          guardianSet: guardianSetIndex,
          signatures: updatedSignatures,
        };

        let patchedVaa: Uint8Array;
        try {
          patchedVaa = serialize(updatedVaa);
        } catch (error) {
          throw new Error(`Error serializing updated VAA: ${error}`);
        }

        try {
          if (!(patchedVaa instanceof Uint8Array))
            throw new Error('Patched VAA is not a Uint8Array!');

          const vaaHex = `0x${Buffer.from(patchedVaa).toString('hex')}`;

          console.log('Sending updated VAA to RPC...');

          const result = await axios.post(RPC, {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [
              {
                from: null,
                to: ETH_CORE,
                data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [vaaHex]),
              },
              'latest',
            ],
          });

          const verificationResult = result.data.result;
          console.log('Updated VAA (hex):', vaaHex);
          return verificationResult;
        } catch (error) {
          throw new Error(`Error sending updated VAA to RPC: ${error}`);
        }
      } catch (error) {
        console.error('Unexpected error in replaceSignatures:', error);
      }
    }
    ```

## Create Script to Replace Outdated VAA Signatures

Now that we have all the necessary helper functions, we will create a script to automate replacing outdated VAA signatures. This script will retrieve a transaction’s VAA sequentially, check its validity, fetch the latest Guardian set, and update its signatures. By the end, it will output a correctly signed VAA that can be proposed for Guardian approval.

1. **Open the file**: Inside `src/scripts/replaceSignatures.ts`, import the required helper functions needed to process the VAAs.

    ```typescript title="src/scripts/replaceSignatures.ts"
    import {
      fetchVaaId,
      fetchVaa,
      checkVaaValidity,
      fetchObservations,
      fetchGuardianSet,
      replaceSignatures,
    } from '../helpers/vaaHelper';
    import { TXS } from '../config/constants';
    ```

2. **Define the main execution function**: Add the following function inside `src/scripts/replaceSignatures.ts` to process each transaction in `TXS`, going step by step through the signature replacement process.

    ```typescript
    async function main() {
      try {
        for (const tx of TXS) {
          console.log(`\nProcessing TX: ${tx}\n`);

          // 1. Fetch Transaction VAA IDs:
          const vaaIds = await fetchVaaId([tx]);
          if (!vaaIds.length) continue;

          // 2. Fetch VAA Data:
          const vaaData = await fetchVaa(vaaIds);
          if (!vaaData.length) continue;

          const vaaBytes = vaaData[0].vaaBytes;
          if (!vaaBytes) continue;

          // 3. Check VAA Validity:
          const { valid } = await checkVaaValidity(vaaBytes);
          if (valid) continue;

          // 4. Fetch Observations (VAA signatures):
          const observations = await fetchObservations(vaaIds[0]);

          // 5. Fetch Current Guardian Set:
          const [currentGuardians, guardianSetIndex] = await fetchGuardianSet();

          // 6. Replace Signatures:
          const response = await replaceSignatures(
            Buffer.from(vaaBytes, 'base64'),
            observations,
            currentGuardians,
            guardianSetIndex
          );

          if (!response) continue;
        }
      } catch (error) {
        console.error('❌ Error in execution:', error);
        process.exit(1);
      }
    }
    ```

3. **Make the script executable**: Ensure it runs when executed.

    ```typescript
    main();
    ```

    To run the script, use the following command:

    ```bash
    npx tsx src/scripts/replaceSignatures.ts
    ```

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx src/scripts/replaceSignatures.ts</span>
    	<span data-ty> </span>
    	<span data-ty>Processing TX: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367</span>
        <span data-ty>❌ VAA Valid: false, Reason: VM signature invalid</span>
        <span data-ty>Fetching observations</span>
        <span data-ty>Fetching current guardian set</span>
        <span data-ty>Replacing Signatures...</span>
        <span data-ty>Outdated Guardian Indexes: [ 0 ]</span>
        <span data-ty>Sending updated VAA to RPC...</span>
        <span data-ty>Updated VAA (hex): 0x01000000040d010019447b72d51e33923a3d6b28496ccd3722d5f1e33e2...</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>
The script logs each step, skipping valid VAAs, replacing outdated signatures for invalid VAAs, and logging any errors. It then completes with a valid VAA ready for submission.

## Resources

You can explore the complete project and find all necessary scripts and configurations in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}.

The demo repository includes a bonus script to check the VAA redemption status on Ethereum and Solana, allowing you to verify whether a transaction has already been redeemed on the destination chain.

## Conclusion

You've successfully built a script to fetch, validate, and replace outdated signatures in VAAs using Wormholescan and the Wormhole SDK.

It's important to note that this tutorial does not update VAAs in the Wormhole network. Before redeeming the VAA, you must propose it for Guardian approval to finalize the process.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
