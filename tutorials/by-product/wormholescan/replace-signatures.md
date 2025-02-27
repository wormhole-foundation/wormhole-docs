---
title: Replace Outdated Signatures in VAAs
description: Learn how to fetch, validate, and replace outdated signatures in Wormhole VAAs using Wormholescan and the Wormhole SDK to ensure seamless processing.
---

# Replace Outdated Signatures in VAAs

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}

## Introduction

Cross-chain transactions in Wormhole rely on [Verifiable Action Approvals (VAAs)](/docs/learn/infrastructure/vaas/){target=\_blank}, which contain signatures from a trusted set of validators called guardians. These signatures prove that the network approved an action, such as a token transfer.

However, the set of guardians changes over time. If a user generates a transaction and waits too long before redeeming it, the guardian set may have already changed. This means the VAA will contain outdated signatures from guardians no longer part of the network, causing the transaction to fail.

Instead of discarding these VAAs, we can fetch updated signatures and replace the outdated ones to ensure smooth processing.

In this tutorial, you'll build a script from scratch to:

- Fetch a VAA from [Wormholescan](https://wormholescan.io/#/developers/api-doc){target=\_blank}
- Validate its signatures against the latest guardian set
- Replace outdated signatures using the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}
- Output a valid VAA ready for submission

By the end, you will have a fully automated tool for updating VAAs, preventing transaction failures due to expired signatures.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally
 - Basic understanding of Wormhole VAAs and how they work

All required RPC endpoints, contract addresses, and example transactions will be provided in the tutorial.

## Project Setup

In this section, you will set up the project by creating the directory, initializing a Node.js project, installing dependencies, and configuring TypeScript.

1. **Create the project directory** - create a new directory and navigate into it

    ```bash
    mkdir wormhole-scan-api-demo
    cd wormhole-scan-api-demo
    ```

2. **Initialize a Node.js project** - generate a `package.json` file

    ```bash
    npm init -y
    ```

3. **Install dependencies** - add the required packages

    ```bash
    npm install @wormhole-foundation/sdk axios web3 tsx typescript @types/node eslint prettier
    ```

4. **Set up TypeScript** - create a `tsconfig.json` file

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json
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

5. **Create the project structure** - set up the required directories and files

    ```bash
    mkdir -p src/config src/helpers src/scripts
    touch src/config/constants.ts
    ```

     - **`src/config/constants.ts`** - stores RPC endpoints and Wormhole contract addresses
     - **`src/helpers/`** - contains utility functions
     - **`src/scripts/`** - contains scripts for fetching and replacing signatures

6. **Set variables** - define key constants in `src/config/constants.ts`

    ```bash
    // RPC endpoints
    export const RPC = 'https://ethereum-rpc.publicnode.com';
    export const RPC_SOL = 'https://solana-rpc.publicnode.com';

    // Wormhole Core contracts
    export const ETH_CORE = '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'.toLowerCase();

    // Solana Emitter Address - Unique identifier for the sending program
    export const SOL_EMITTER_ADDRESS =
    'ec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5';

    // WormholeScan API endpoint
    export const WORMHOLE_SCAN_API = 'https://api.wormholescan.io/v1';

    // Example transactions
    export const TXS = [
    '0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367',
    '0x3c989a6bb40dcd4719453fbe7bbac420f23962c900ae75793124fc9cc614368c'
    ];

    export const SOL_TXS = [
    '66BXU1ahyzaEW8q7Cp3M92myAQegs8v74WgT2gpQK6Cap9WRubbQrorpz2taBDchWdDraZiwpPab9vfvYesnvXHV'
    ];
    ```

## VAA Handling Functions

To update a VAA with valid signatures, we need to process it step by step. This section covers retrieving the VAA, verifying its validity, fetching required signatures, and replacing outdated ones to generate a correctly signed VAA.

### Fetch a VAA ID from a Transaction

To retrieve a VAA, we first need to get its VAA ID from a transaction hash. This ID allows us to fetch the full VAA later.

1. **Create the helper function** - add a new file inside `src/helpers`

    ```bash
    touch src/helpers/vaaHelper.ts
    ```

2. **Fetch the VAA ID** - query the Wormholescan API using a transaction hash. Open `src/helpers/vaaHelper.ts` and add the below script

    ```typescript
    import axios from 'axios';
    import { RPC,
	ETH_CORE,
	LOG_MESSAGE_PUBLISHED_TOPIC, } from '../config/constants';

    // Fetches the VAA ID from a transaction hash
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

			if (!result) throw new Error(`Unable to fetch transaction receipt for ${tx}`);

			for (const log of result.logs) {
				if (log.address === ETH_CORE && log.topics?.[0] === LOG_MESSAGE_PUBLISHED_TOPIC) {
					const emitter = log.topics[1].substring(2);
					const seq = BigInt(log.data.substring(0, 66)).toString();
					vaaIds.push(`2/${emitter}/${seq}`);
				}
			}
		} catch (error) {
			console.error(`❌ Error processing ${tx}:`, error);
		}
	}

	return vaaIds;
    }
    ```

???- note "Test VAA ID retrieval"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test directory and file**  

        ```bash
        mkdir -p test
        touch test/fetchVaaId.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        import { fetchVaaId } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchVaaId = async () => {
        const vaaId = await fetchVaaId(TXS[0]);

        if (vaaId) {
            console.log(`VAA ID: ${vaaId}`);
        }
        };

        testFetchVaaId();
        ```  

    3. **Run the test script**  

        ```bash
        npx tsx test/fetchVaaId.test.ts
        ```  

        If successful, the output will be:  

        ```bash
        VAA ID: 0000000001...
        ```  

        If no VAA is found:  

        ```bash
        No VAA found for this transaction.
        ```  

### Fetch the Full VAA

Now that we have the VAA ID, we can use it to fetch the full VAA payload. This payload contains the VAA bytes, which will later be used for signature validation.

1. **Create the helper function** - add a new function inside `src/helpers/vaaHelper.ts`. Open `src/helpers/vaaHelper.ts` and add the below script

    ```typescript
    import axios from 'axios';
    import { WORMHOLE_SCAN_API } from '../config/constants';

    // Function to fetch VAA data from Wormhole Scan API
    export async function fetchVaa(vaaIds: string[]): Promise<{ id: string; vaaBytes: string }[]> {
        const results: { id: string; vaaBytes: string }[] = [];

        for (const id of vaaIds) {
            try {
                const response = await axios.get(`${WORMHOLE_SCAN_API}/signed_vaa/${id}`);
                const vaaBytes = response.data.vaaBytes;
                results.push({ id, vaaBytes });
            } catch (error) {
                console.error(`❌ Error fetching VAA for ${id}:`, error);
            }
        }
        return results;
    }
    ```

???- note "Test VAA retrieval"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchVaa.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        import { fetchVaaId, fetchVaa } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchVaa = async () => {
        const vaaId = await fetchVaaId(TXS[0]);
        
        if (!vaaId) {
            console.log('VAA ID not found.');
            return;
        }

        const vaaBytes = await fetchVaa(vaaId);
        console.log(`VAA Bytes: ${vaaBytes ? vaaBytes.toString('hex') : 'Not found'}`);
        };

        testFetchVaa();
        ```  

    3. **Run the test script**  

        ```bash
        npx tsx test/fetchVaa.test.ts
        ```  

        If successful, the output will be:  

        ```bash
        VAA Bytes: 01020304...
        ```  

        If no VAA is found:  

        ```bash
        No VAA found for this ID.
        ```  

### Validate VAA Signatures

Now that we have the full VAA, we need to determine whether it's valid. A VAA is only considered valid if it contains signatures from currently active guardians and is correctly verified by the Wormhole Core contract.

To check this, we will send the VAA to an Ethereum RPC node and call the parseAndVerifyVM function on the Wormhole Core contract. The response will indicate whether the VAA is valid or if it contains outdated signatures that need to be replaced.

1. **Create the helper function** - add a new function inside `src/helpers/vaaHelper.ts` to validate VAAs. Open `src/helpers/vaaHelper.ts` and add the below function

    ```typescript
    import axios from 'axios';
    import { eth } from 'web3';
    import { RPC, ETH_CORE, PARSE_AND_VERIFY_VM_ABI } from '../config/constants';

    // ✅ Function to check if VAA is valid
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
                data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [`0x${vaa.toString('hex')}`]),
            },
            'latest',
            ],
        })
        ).data.result;

        const decoded = eth.abi.decodeParameters(PARSE_AND_VERIFY_VM_ABI.outputs, result);
        console.log(
        `${decoded.valid ? '✅' : '❌'} VAA Valid: ${decoded.valid}${decoded.valid ? '' : `, Reason: ${decoded.reason}`}`
        );

        return { valid: decoded.valid, reason: decoded.reason };
    } catch (error) {
        console.error(`❌ Error checking VAA validity:`, error);
        return { valid: false, reason: 'RPC error' };
    }
    }
    ```

???- note "Test VAA Validity"
  If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/checkVaaValidity.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        import { fetchVaaId, fetchVaa, checkVaaValidity } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testCheckVaaValidity = async () => {
        const vaaId = await fetchVaaId(TXS[0]);
        if (!vaaId) {
            console.log('VAA ID not found.');
            return;
        }

        const vaaBytes = await fetchVaa(vaaId);
        if (!vaaBytes) {
            console.log('VAA not found.');
            return;
        }

        const result = await checkVaaValidity(vaaBytes.toString('base64'));
        console.log('VAA Validity:', result);
        };

        testCheckVaaValidity();
        ```  

    3. **Run the test script**  

        ```bash
        npx tsx test/checkVaaValidity.test.ts
        ```  

        If successful, the output will be:  

        ```bash
        ✅ VAA Valid: true
        ```  

        If invalid, the output will include the reason:  

        ```bash
        ❌ VAA Valid: false, Reason: Guardian set mismatch
        ```  

### Fetch Observations (VAA Signatures)

Before replacing outdated signatures, we need to fetch the original VAA signatures from Wormholescan. This allows us to compare them with the latest guardian set and determine which ones need updating.

1. **Create the helper function** - add a new function inside `src/helpers/vaaHelper.ts`. Open src/helpers/vaaHelper.ts and add the following

    ```typescript
    /**
     * Fetches observations (signatures) for a given VAA ID from Wormhole Scan API.
    * @param {string} vaaId - The VAA ID in format "chain/emitter/sequence"
    * @returns {Promise<any[]>} - Returns an array of formatted signatures
    */
    export async function fetchObservations(vaaId: string) {
    try {
        console.log(`🛠  Fetching observations`);
        const response = await axios.get(`https://api.wormholescan.io/api/v1/observations/${vaaId}`);

        return response.data.map((obs: any) => ({
        guardianAddr: obs.guardianAddr.toLowerCase(),
        signature: obs.signature,
        }));
    } catch (error) {
        console.error(`❌ Error fetching observations:`, error);
        return [];
    }
    }
    ```

???- note "Test Fetch Observations"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchObservations.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        import { fetchVaaId, fetchObservations } from '../src/helpers/vaaHelper';
        import { TXS } from '../src/config/constants';

        const testFetchObservations = async () => {
        const vaaIds = await fetchVaaId([TXS[0]]);
        if (!vaaIds.length) {
            console.log('No VAA IDs found.');
            return;
        }

        const observations = await fetchObservations(vaaIds[0]);
        console.log('Observations:', observations);
        };

        testFetchObservations();
        ```  

    3. **Run the test script**  

        ```bash
        npx tsx test/fetchObservations.test.ts
        ```  

        If successful, the output will be:  

        ```bash
        Observations: [
        { guardianAddr: '0xabc123...', signature: '0xabcdef...' },
        { guardianAddr: '0xdef456...', signature: '0x123456...' }
        ]
        ```  

        If no observations are found:  

        ```bash
        ❌ No observations found.
        ```  

### Fetch the Latest Guardian Set

Now that we have the original VAA signatures, we need to fetch the latest guardian set from Wormholescan. This will allow us to compare the stored signatures with the current set of guardians and determine which signatures need to be replaced.

1. **Create the helper function** - add a new function inside `src/helpers/vaaHelper.ts`. Open `src/helpers/vaaHelper.ts` and add the following:

    ```typescript
    export async function fetchGuardianSet() {
    try {
        console.log('🛠  Fetching current guardian set');
        const response = await axios.get(`${WORMHOLE_SCAN_API}/guardianset/current`);
        const guardians = response.data.guardianSet.addresses.map((addr: string) => addr.toLowerCase());
        const guardianSet = response.data.guardianSet.index;

        return [guardians, guardianSet];
    } catch (error) {
        console.error('❌ Error fetching guardian set:', error);
        return [];
    }
    }
    ```

???- note "Test Fetch Guardian Set"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchGuardianSet.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        import { fetchGuardianSet } from '../src/helpers/vaaHelper';

        const testFetchGuardianSet = async () => {
        const [guardians, guardianSetIndex] = await fetchGuardianSet();

        console.log('Current Guardian Set Index:', guardianSetIndex);
        console.log('Guardian Addresses:', guardians);
        };

        testFetchGuardianSet();
        ```  

    3. **Run the test script**  

        ```bash
        npx tsx test/fetchGuardianSet.test.ts
        ```  

        If successful, the output will be:  

        ```bash
        Current Guardian Set Index: 5
        Guardian Addresses: [ '0xabc123...', '0xdef456...', ... ]
        ```  

        If there is an error fetching the data:  

        ```bash
        ❌ Error fetching guardian set: Request failed with status 500
        ```  

### Replace Outdated Signatures

Now that we have the full VAA, guardian observations, and the latest guardian set, we can update any outdated signatures. A VAA is invalid if it contains signatures from a previous guardian set, preventing it from being processed.

In this step, we will:

 1. Identify which signatures in the VAA are outdated
 2. Extract valid signatures from the latest guardian set
 3. Replace outdated signatures with valid ones
 4. Serialize the updated VAA for submission

By the end of this section, the VAA will be fully restored and ready for use.

1. **Create the function** - open `src/helpers/vaaHelper.ts` and add the function header

    ```typescript
        export async function replaceSignatures(
        vaa: string | Uint8Array,
        observations: { guardianAddr: string; signature: string }[],
        currentGuardians: string[],
        guardianSetIndex: number
    ) {
        console.log('Replacing outdated signatures...');
    ```

    ??? interface "Parameters"

        `vaa` ++"string | Uint8Array"++

        The original VAA bytes.

        ---

        `observations` ++"{ guardianAddr: string; signature: string }[]"++

        The observed signatures from the network.

        ---

        `currentGuardians` ++"string[]"++

        The latest guardian set.

        ---

        `guardianSetIndex` ++"number"++

        The current guardian set index.

        ---

2. **Validate input data** - ensure all required parameters are available

    ```typescript
    try {
        if (!vaa) throw new Error('VAA is undefined or empty.');
        if (currentGuardians.length === 0) throw new Error('Guardian set is empty.');
        if (observations.length === 0) throw new Error('No observations provided.');
    ```

    This prevents execution errors due to missing data.

3. **Filter valid signatures** - extract only the signatures from active guardians. Ensure that only valid signatures are used for the update

    ```typescript
            const validSigs = observations.filter((sig) =>
            currentGuardians.includes(sig.guardianAddr)
        );

        if (validSigs.length === 0) throw new Error('No valid signatures found. Cannot proceed.');
    ```

4. **Convert valid signatures** - format them correctly for use in the VAA. Ensure the signatures are in the correct format for verification

    ```typescript
            const formattedSigs = validSigs
            .map((sig) => {
                try {
                    const sigBuffer = Buffer.from(sig.signature, 'base64');
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
                    console.error(`Failed to process signature for guardian: ${sig.guardianAddr}`, error);
                    return null;
                }
            })
            .filter((sig): sig is { guardianIndex: number; signature: Signature } => sig !== null);
    ```

5. **Deserialize the VAA** - convert it into a structured format allowing you to manipulate the VAA contents

    ```typescript
            let parsedVaa: VAA<'Uint8Array'>;
        try {
            parsedVaa = deserialize('Uint8Array', vaa);
        } catch (error) {
            throw new Error(`Error deserializing VAA: ${error}`);
        }
    ```

6. **Identify outdated signatures** - find which ones need to be replaced and remove all signatures that are no longer valid

    ```typescript
            const outdatedGuardianIndexes = parsedVaa.signatures
            .filter((vaaSig) =>
                !formattedSigs.some((sig) => sig.guardianIndex === vaaSig.guardianIndex)
            )
            .map((sig) => sig.guardianIndex);

        console.log('Outdated Guardian Indexes:', outdatedGuardianIndexes);

        let updatedSignatures = parsedVaa.signatures.filter(
            (sig) => !outdatedGuardianIndexes.includes(sig.guardianIndex)
        );
    ```

7. **Replace outdated signatures** - insert valid ones in their place and ensure that all required signatures are present and properly ordered

    ```typescript
            const validReplacements = formattedSigs.filter(
            (sig) => !updatedSignatures.some((s) => s.guardianIndex === sig.guardianIndex)
        );

        if (outdatedGuardianIndexes.length > validReplacements.length) {
            console.warn(
                `Not enough valid replacement signatures. Need ${outdatedGuardianIndexes.length}, found ${validReplacements.length}.`
            );
            return;
        }

        updatedSignatures = [
            ...updatedSignatures,
            ...validReplacements.slice(0, outdatedGuardianIndexes.length),
        ];

        updatedSignatures.sort((a, b) => a.guardianIndex - b.guardianIndex);
    ```

8. **Serialize the updated VAA** - convert the VAA back into a usable format ready for submission

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

9. **Send the updated VAA for verification** - confirm that it is valid and can be proposed for guardian approval

    ```typescript
            console.log('Sending updated VAA to RPC...');
        const vaaHex = `0x${Buffer.from(patchedVaa).toString('hex')}`;

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
    ```

## VAA Signature Replacement Process

Now that we have all the necessary helper functions, we will create a script to automate the process of replacing outdated VAA signatures. This script will sequentially retrieve a transaction’s VAA, check its validity, fetch the latest guardian set, and update its signatures. By the end, it will output a correctly signed VAA that can be proposed for guardian approval.

### Replacement Script

1. **Create the script file** - add a new file inside `src/scripts/`

    ```bash
    touch src/scripts/replaceSignatures.ts
    ```

2. **Open the file** - inside `src/scripts/replaceSignatures.ts` import the required helper functions needed to process the VAAs

    ```typescript
    import {
        fetchVaaId,
        fetchVaa,
        checkVaaValidity,
        fetchObservations,
        fetchGuardianSet,
        replaceSignatures,
        decodeResponse,
    } from '../helpers/vaaHelper';
    import { TXS } from '../config/constants';
    ```

3. **Define the main execution function** - add the following function inside `src/scripts/replaceSignatures.ts` to process each transaction in `TXS`, going step by step through the signature replacement process

    ```typescript
    async function main() {
        try {
            for (const tx of TXS) {
                console.log(
                    '\n --------------------------------------------------------------------------------------------------------'
                );
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

                // 7. Decode Response:
                await decodeResponse(response);
            }
        } catch (error) {
            console.error('❌ Error in execution:', error);
            process.exit(1);
        }
    }
    ```

4. **Make the script executable** - ensure it runs when executed

    ```typescript
    main();
    ```

### Run the Script

Now that the script is set up, you can execute it to fetch, validate, and update outdated VAA signatures.

1. **Run the script** - use the following command to execute the replacement process

    ```bash
    npx tsx src/scripts/replaceSignatures.ts
    ```

    This will process each transaction in TXS, checking its VAA and updating signatures if necessary.

2. **Expected output** - the script will print logs for each step

    ```bash
    --------------------------------------------------------------------------------------------------------

    Processing TX: 0x3ad91ec530187bb2ce3b394d587878cd1e9e037a97e51fbc34af89b2e0719367

    🛠 Fetching VAA ID...
    ✅ VAA ID: 2/ec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5/123456

    🛠 Fetching VAA...
    ✅ VAA retrieved successfully

    🛠 Checking VAA validity...
    ❌ VAA is invalid - outdated signatures detected

    🛠 Fetching observations...
    ✅ 12 signatures found

    🛠 Fetching current guardian set...
    ✅ Guardian Set Index: 4

    🔄 Replacing outdated signatures...
    ✅ Updated VAA successfully

    🛠 Sending updated VAA for verification...
    ✅ VAA is now valid
    ```

     - If a VAA is already valid, it will skip updates
     - If outdated signatures are found, they will be replaced and revalidated
     - If an error occurs, it will be logged

This completes the process of replacing outdated VAA signatures. You now have a valid VAA ready for submission.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}. The repository includes all the example scripts and configurations needed to fetch, validate, and replace outdated VAA signatures using Wormholescan and the Wormhole SDK.

Additionally, this repository provides a script to check the VAA redemption status, allowing you to verify whether a transaction has already been redeemed on the destination chain.

## Conclusion

You've successfully built a script to fetch, validate, and replace outdated signatures in Wormhole VAAs using Wormholescan and the Wormhole SDK. This guide walked you through setting up the project, retrieving VAAs, checking their validity, and updating their signatures to ensure they remain processable.

It's important to note that this tutorial does not update VAAs in the Wormhole network. To finalize the process, you must propose the updated VAA for guardian approval before it can be redeemed.