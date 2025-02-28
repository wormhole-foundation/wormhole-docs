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

By the end, you'll have a script that ensures VAAs remain valid and processable, avoiding transaction failures.

## Prerequisites

Before you begin, ensure you have the following:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
 - [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed globally

## Project Setup

In this section, you will create the directory, initialize a Node.js project, install dependencies, and configure TypeScript.

1. **Create the project** - set up the directory and navigate into it

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
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-1.json"
    ```

5. **Create the project structure** - set up the required directories and files

    ```bash
    mkdir -p src/config src/helpers src/scripts
    touch src/config/constants.ts
    ```

     - **`src/config/constants.ts`** - stores public configuration variables
     - **`src/helpers/`** - contains utility functions
     - **`src/scripts/`** - contains scripts for fetching and replacing signatures

6. **Set variables** - define key constants in `src/config/constants.ts`

    ```bash
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-2.ts"
    ```

     - **`RPC`** - endpoint for interacting with an Ethereum RPC node
     - **`ETH_CORE`** - [Ethereum contract address](/docs/build/reference/contract-addresses/#core-contracts){target=\_blank} responsible for verifying VAAs
     - **`WORMHOLE_SCAN_API`** - base URL for querying the Wormholescan API to fetch VAA data and guardian sets
     - **`TXS`** - list of example transaction hashes that will be used for testing

## VAA Handling Functions

This section covers retrieving the VAA, verifying its validity, fetching required signatures, and replacing outdated ones to generate a correctly signed VAA.

### Fetch a VAA ID from a Transaction

To retrieve a VAA, we first need to get its VAA ID from a transaction hash. This ID allows us to fetch the full VAA later.

1. **Create the helper file** - add a new file inside `src/helpers` to store VAA-related utility functions

    ```bash
    touch src/helpers/vaaHelper.ts
    ```

2. **Import dependencies** - open `src/helpers/vaaHelper.ts` and import the required modules: `axios` for making API requests, `web3` for encoding and decoding Ethereum transactions, `@wormhole-foundation/sdk` for handling VAAs, and `constants` from the configuration file

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:1:15"
    ```

3. **Fetch the VAA ID** - add the function to extract the VAA ID from a transaction hash. This function queries the Ethereum node for a transaction receipt, checks if the transaction emitted a Wormhole message, and constructs the VAA ID in the format `chain/emitter/sequence`

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:17:50"
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
        --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-4.ts"
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

Now that you have the VAA ID, we can use it to fetch the full VAA payload from the Wormholescan API. This payload contains the VAA bytes, which will later be used for signature validation.

 - **Create the `fetchVaa()` function** - open `src/helpers/vaaHelper.ts` and add the below function. This function iterates through the provided VAA IDs, queries the API for each, and extracts the `vaaBytes` payload. If a request fails, the error is logged, and processing continues for the remaining IDs

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:52:67"
    ```

???- note "Test VAA retrieval"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchVaa.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-5.ts"
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

Now, we need to verify its validity. A VAA is only considered valid if it contains signatures from currently active guardians and is correctly verified by the Wormhole Core contract.

 - **Create the `checkVaaValidity()` function** - add a new function inside `src/helpers/vaaHelper.ts` to validate VAAs. The below function sends the VAA to an Ethereum RPC node and calls the `parseAndVerifyVM` function on the Wormhole Core contract. The response will indicate whether the VAA is valid or contains outdated signatures that need replacing.

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:69:107"
    ```

???- note "Test VAA Validity"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/checkVaaValidity.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-6.ts"
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

 - **Create the `fetchObservations()` function** - add a new function inside `src/helpers/vaaHelper.ts` to query the Wormholescan API for observations related to a given VAA. Then, format the response, converting guardian addresses to lowercase for consistency. If an error occurs, it returns an empty array.

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:109:124"
    ```

???- note "Test Fetch Observations"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchObservations.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-7.ts"
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

Now that we have the original VAA signatures, we must fetch the latest guardian set from Wormholescan. This will allow us to compare the stored signatures with the current guardians and determine which signatures need replacing.

1. **Create the `fetchGuardianSet()` function** - add a new function inside `src/helpers/vaaHelper.ts` to fetch the latest guardian set

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:126:142"
    ```

???- note "Test Fetch Guardian Set"
    If you want to test the function before moving forward, create a test file inside the `test` directory:  

    1. **Create the test file**  

        ```bash
        touch test/fetchGuardianSet.test.ts
        ```  

    2. **Add the test logic**  

        ```typescript
        --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-8.ts"
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

With the full VAA, guardian signatures, and the latest guardian set, we can now update outdated signatures while maintaining the required signature count.

1. **Create the `replaceSignatures()` function** - open `src/helpers/vaaHelper.ts` and add the function header

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:144:150"
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

2. **Validate input data** - ensure all required parameters are present before proceeding. If any required input is missing, the function throws an error to prevent execution with incomplete data

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:152:156"
    ```

3. **Filter valid signatures** - remove signatures from inactive guardians, keeping only valid ones. If no valid signatures are found, execution is halted

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:158:163"
    ```

4. **Convert valid signatures** - ensure signatures are correctly formatted for verification. Convert hex-encoded signatures if necessary and extract their components

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:165:195"
    ```

5. **Deserialize the VAA** - convert the raw VAA data into a structured format for further processing

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:197:202"
    ```

6. **Identify outdated signatures** - compare the current VAA signatures with the newly formatted ones to detect which signatures belong to outdated guardians. Remove these outdated signatures to ensure only valid ones remain

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:204:217"
    ```

7. **Replace outdated signatures** - substitute outdated signatures with valid ones while maintaining the correct number of signatures. If there aren’t enough valid replacements, execution stops

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:219:237"
    ```

8. **Serialize the updated VAA** - reconstruct the VAA with the updated signatures and convert it into a format suitable for submission

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:239:250"
    ```

9. **Send the updated VAA for verification** - validate the updated VAA by submitting it to an Ethereum RPC node, ensuring it can be proposed for guardian approval

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:252:276"
    ```

10. **Handle errors** - catch any unexpected errors during VAA submission or signature replacement

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-3.ts:277:283"
    ```

## VAA Signature Replacement Process

Now that we have all the necessary helper functions, we will create a script to automate replacing outdated VAA signatures. This script will retrieve a transaction’s VAA sequentially, check its validity, fetch the latest guardian set, and update its signatures. By the end, it will output a correctly signed VAA that can be proposed for guardian approval.

### Replacement Script

1. **Create the script file** - add a new file inside `src/scripts/`

    ```bash
    touch src/scripts/replaceSignatures.ts
    ```

2. **Open the file** - inside `src/scripts/replaceSignatures.ts`, import the required helper functions needed to process the VAAs

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-9.ts:1:10"
    ```

3. **Define the main execution function** - add the following function inside `src/scripts/replaceSignatures.ts` to process each transaction in `TXS`, going step by step through the signature replacement process

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-9.ts:12:55"
    ```

4. **Make the script executable** - ensure it runs when executed

    ```typescript
    --8<-- "code/tutorials/by-product/wormholescan/replace-signatures/replace-sigs-9.ts:57:57"
    ```

### Run the Script

Now that the script is set up, you can execute it to fetch, validate, and update outdated VAA signatures.

1. **Run the script** - use the following command to execute the replacement process. This will process each transaction in `TXS`, check its VAA, and update signatures if necessary

    ```bash
    npx tsx src/scripts/replaceSignatures.ts
    ```

2. **Expected output** - the script will print logs for each step

    ```bash

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

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}. The repository contains all necessary scripts and configurations for working with VAAs using Wormholescan and the Wormhole SDK.

Additionally, this repository provides a script to check the VAA redemption status on Ethereum and Solana, allowing you to verify whether a transaction has already been redeemed on the destination chain.

## Conclusion

You've successfully built a script to fetch, validate, and replace outdated signatures in Wormhole VAAs using Wormholescan and the Wormhole SDK.

It's important to note that this tutorial does not update VAAs in the Wormhole network. Before redeeming the VAA, you must propose it for guardian approval to finalize the process.