---
title: Replace Outdated Signatures in VAAs
description: Learn how to fetch, validate, and replace outdated signatures in Wormhole VAAs using Wormholescan and the Wormhole SDK to ensure seamless processing.
---

# Replace Outdated Signatures in VAAs

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}

## Introduction

Cross-chain transactions in Wormhole rely on [Verifiable Action Approvals (VAAs)](/docs/learn/infrastructure/vaas/){target=\_blank}, which contain signatures from a trusted set of validators called [Guardians](/docs/learn/infrastructure/guardians/){target=\_blank}. These signatures prove that the network approved an action, such as a token transfer.

However, the set of Guardians changes over time. If a user generates a transaction and waits too long before redeeming it, the Guardian set may have already changed. This means the VAA will contain outdated signatures from Guardians, who are no longer part of the network, causing the transaction to fail.

Instead of discarding these VAAs, we can fetch updated signatures and replace the outdated ones to ensure smooth processing.

In this tutorial, you'll build a script from scratch to:

- Fetch a VAA from [Wormholescan](https://wormholescan.io/#/developers/api-doc){target=\_blank}
- Validate its signatures against the latest Guardian set
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

3. **Set up TypeScript** - create a `tsconfig.json` file

    ```bash
    touch tsconfig.json
    ```

    Then, add the following configuration:

    ```json title="tsconfig.json"
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-1.json"
    ```

4. **Install dependencies** - add the required packages

    ```bash
    npm install @wormhole-foundation/sdk axios web3 tsx @types/node
    ```

     - `@wormhole-foundation/sdk` - handles VAAs and cross-chain interactions  
     - `axios` - makes HTTP requests to the Wormholescan API  
     - `web3` - interacts with Ethereum transactions and contracts  
     - `tsx` - executes TypeScript files without compilation  
     - `@types/node` - provides Node.js type definitions 

5. **Create the project structure** - set up the required directories and files

    ```bash
    mkdir -p src/config && touch src/config/constants.ts src/config/layouts.ts
    mkdir -p src/helpers && touch src/helpers/vaaHelper.ts
    mkdir -p src/scripts && touch scripts/replaceSignatures.ts
    ```

     - **`src/config/*`** - stores public configuration variables and layouts for serializing and deserializing data structures
     - **`src/helpers/*`** - contains utility functions
     - **`src/scripts/*`** - contains scripts for fetching and replacing signatures

6. **Set variables** - define key constants in `src/config/constants.ts`

    ```bash title="src/config/constants.ts"
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-2.ts"
    ```

     - **`RPC`** - endpoint for interacting with an Ethereum RPC node
     - **`ETH_CORE`** - [Wormhole's Core Contract address on Ethereum](/docs/build/reference/contract-addresses/#core-contracts){target=\_blank} responsible for verifying VAAs
     - **`WORMHOLESCAN_API`** - base URL for querying the Wormholescan API to fetch VAA data and Guardian sets
     - **`LOG_MESSAGE_PUBLISHED_TOPIC`** - the event signature hash for `LogMessagePublished`, a Wormhole contract event that signals when a VAA has been emitted. This is used to identify relevant logs in transaction receipts
     - **`TXS`** - list of example transaction hashes that will be used for testing

7. **Define data structure for working with VAAs** - specify the ABI for the Wormhole Core Contract's `parseAndVerifyVM` function, which parses and verifies VAAs. Defining the data structure, also referred to as a [layout](/docs/build/toolkit/typescript-sdk/sdk-layout/){target=\_blank}, for this function ensures accurate decoding and validation of VAAs

    ```typescript title="src/config/layouts.ts"
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-3.ts"
    ```

## Create VAA Handling Functions

In this section, we'll create a series of helper functions in the `src/helpers/vaaHelper.ts` file that will retrieve and verify VAAs and fetch and replace outdated Guardian signatures to generate a correctly signed VAA.

To get started, import the necessary dependencies:

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:1:15"
```

### Fetch a VAA ID from a Transaction

To retrieve a VAA, we first need to get its VAA ID from a transaction hash. This ID allows us to fetch the full VAA later.
The VAA ID is structured as follows:

```bash
chain/emitter/sequence
```

 - `chain` - the [Wormhole chain ID](/docs/build/reference/chain-ids/){target=\_blank} (Ethereum is 2)
 - `emitter` - the contract address that emitted the VAA
 - `sequence` - a unique identifier for the event

We must assemble the ID correctly since this is the format the Wormholescan API expects when querying VAAs.

Follow the below steps to process the transaction logs and construct the VAA ID:

1. **Get the transaction receipt** - iterate over the array of transaction hashes and fetch the receipt to access its logs

2. **Find the Wormhole event** - iterate over the transaction logs and check for events emitted by the Wormhole Core contract. Look specifically for `LogMessagePublished` events, which indicate a VAA was created

3. **Extract the emitter and sequence number** - if a matching event is found, extract the emitter address from `log.topics[1]` and remove the `0x` prefix. Then, the sequence number from `log.data` is extracted, converting it from hex to an integer

4. **Construct the VAA ID** - format the extracted data in `chain/emitter/sequence` format

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:17:50"
```

???- code "Try it out: VAA ID retrieval"
    If you want to try out the function before moving forward, create a test file inside the `test` directory: 

    1. **Create the directory and file** - add a script to call `fetchVaaId` and print the result

        ```bash
        mkdir -p test
        touch test/fetchVaaId.run.ts
        ```  
    2. **Add the function call**  

        ```typescript title="test/fetchVaaId.run.ts"
        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-5.ts"
        ```  

    3. **Run the script**  

        ```bash
        npx tsx test/fetchVaaId.run.ts
        ```  

        If successful, the output will be:

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-6.html"

        If no VAA ID is found, the script will log an error message.

### Fetch the Full VAA

Now that you have the VAA ID, we can use it to fetch the full VAA payload from the Wormholescan API. This payload contains the VAA bytes, which will later be used for signature validation.

Open `src/helpers/vaaHelper.ts` and create the `fetchVaa()` function to iterate through VAA IDs and extract the `vaaBytes` payload.

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:52:67"
```

???- code "Try it out: VAA retrieval"
    If you want to try the function before moving forward, create a script inside the `test` directory  

    1. **Create the script file**

        ```bash
        touch test/fetchVaa.run.ts
        ```

    2. **Add the function call**  

        ```typescript title="test/fetchVaa.run.ts"
        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-7.ts"
        ```

    3. **Run the script**  

        ```bash
        npx tsx test/fetchVaa.run.ts
        ```

        If successful, the output will be:

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-8.html"

        If no VAA is found, the script will log an error message.

### Validate VAA Signatures

Now, we need to verify its validity. A VAA is only considered valid if it contains signatures from currently active Guardians and is correctly verified by the Wormhole Core contract.

Open `src/helpers/vaaHelper.ts` and add the `checkVaaValidity()` function. This function verifies whether a VAA is valid by submitting it to an Ethereum RPC node and checking for outdated signatures.  

Follow these steps to implement the function:  

1. **Prepare the VAA for verification** - construct the VAA payload in a format that can be sent to the Wormhole Core contract

2. **Send an `eth_call` request** - submit the VAA to an Ethereum RPC node, calling the `parseAndVerifyVM` function on the Wormhole Core contract

3. **Decode the response** - check whether the VAA is valid. If it contains outdated signatures, further action will be required to replace them

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:69:107"
```

???- code "Try it out: VAA Validity"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. **Create the script file**

        ```bash
        touch test/checkVaaValidity.run.ts
        ```

    2. **Add the function call**

        ```typescript title="test/checkVaaValidity.run.ts"
        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-9.ts"
        ```

    3. **Run the script**

        ```bash
        npx tsx test/checkVaaValidity.run.ts
        ```

        If the VAA is valid, the output will be:  

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-10.html"

        If invalid, the output will include the reason:

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-11.html"

### Fetch Observations (VAA Signatures)

Before replacing outdated signatures, we need to fetch the original VAA signatures from Wormholescan. This allows us to compare them with the latest Guardian set and determine which ones need updating.

Inside `src/helpers/vaaHelper.ts`, create the `fetchObservations()` function to query the Wormholescan API for observations related to a given VAA. Format the response by converting Guardian addresses to lowercase for consistency, and return an empty array if an error occurs.

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:109:125"
```

???- code "Try it out: Fetch Observations"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. **Create the script file**

        ```bash
        touch test/fetchObservations.run.ts
        ```

    2. **Add the function call**

        ```typescript title="test/fetchObservations.run.ts"
        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-12.ts"
        ```

    3. **Run the script**

        ```bash
        npx tsx test/fetchObservations.run.ts
        ```

        If successful, the output will be:

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-13.html"

        If no observations are found, the script will log an error message.

### Fetch the Latest Guardian Set

Now that we have the original VAA signatures, we must fetch the latest Guardian set from Wormholescan. This will allow us to compare the stored signatures with the current Guardians and determine which signatures need replacing.

Create the `fetchGuardianSet()` function inside `src/helpers/vaaHelper.ts` to fetch the latest Guardian set.

```typescript title="src/helpers/vaaHelper.ts"
--8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:126:142"
```

???- code "Try it out: Fetch Guardian Set"
    If you want to try the function before moving forward, create a script inside the `test` directory

    1. **Create the script file**

        ```bash
        touch test/fetchGuardianSet.run.ts
        ```

    2. **Add the function call**

        ```typescript title="test/fetchGuardianSet.run.ts"
        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-14.ts"
        ```

    3. **Run the script**

        ```bash
        npx tsx test/fetchGuardianSet.run.ts
        ```

        If successful, the output will be:

        --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-15.html"

        If an error occurs while fetching the Guardian set, a `500` status error will be logged.

### Replace Outdated Signatures

With the full VAA, Guardian signatures, and the latest Guardian set, we can now update outdated signatures while maintaining the required signature count.

1. **Create the `replaceSignatures()` function** - open `src/helpers/vaaHelper.ts` and add the function header. To catch and handle errors properly, all logic will be wrapped inside a `try` block

    ```typescript title="src/helpers/vaaHelper.ts"
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:144:152"
        // Add logic in the following steps here
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:280:283"
    ```

     - **`vaa`** - original VAA bytes
     - **`observations`** - observed signatures from the network
     - **`currentGuardians`** - latest Guardian set
     - **`guardianSetIndex`** - current Guardian set index

2. **Validate input data** - ensure all required parameters are present before proceeding. If any required input is missing, the function throws an error to prevent execution with incomplete data. The Guardian set should never be empty; if it is, this likely indicates an error in fetching the Guardian set in a previous step

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:153:156"
    ```

3. **Filter valid signatures** - remove signatures from inactive Guardians, keeping only valid ones. If there aren't enough valid signatures to replace the outdated ones, execution is halted to prevent an incomplete or invalid VAA

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:158:163"
    ```

4. **Convert valid signatures** - ensure signatures are correctly formatted for verification. Convert hex-encoded signatures if necessary and extract their components

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:165:195"
    ```

5. **Deserialize the VAA** - convert the raw VAA data into a structured format for further processing

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:197:202"
    ```

6. **Identify outdated signatures** - compare the current VAA signatures with the newly formatted ones to detect which signatures belong to outdated Guardians. Remove these outdated signatures to ensure only valid ones remain

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:204:217"
    ```

7. **Replace outdated signatures** - substitute outdated signatures with valid ones while maintaining the correct number of signatures. If there aren’t enough valid replacements, execution stops

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:219:237"
    ```

8. **Serialize the updated VAA** - reconstruct the VAA with the updated signatures and convert it into a format suitable for submission

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:239:250"
    ```

9. **Send the updated VAA for verification and handle errors** - submit the updated VAA to an Ethereum RPC node for validation, ensuring it can be proposed for Guardian approval. If an error occurs during submission or signature replacement, log the issue and prevent further execution

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:252:279"
    ```

???- code "Complete Function"
    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-4.ts:144:283"
    ```

## Create Script to Replace Outdated VAA Signatures

Now that we have all the necessary helper functions, we will create a script to automate replacing outdated VAA signatures. This script will retrieve a transaction’s VAA sequentially, check its validity, fetch the latest Guardian set, and update its signatures. By the end, it will output a correctly signed VAA that can be proposed for Guardian approval.

1. **Open the file** - inside `src/scripts/replaceSignatures.ts`, import the required helper functions needed to process the VAAs

    ```typescript title="src/scripts/replaceSignatures.ts"
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-16.ts:1:9"
    ```

2. **Define the main execution function** - add the following function inside `src/scripts/replaceSignatures.ts` to process each transaction in `TXS`, going step by step through the signature replacement process

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-16.ts:11:51"
    ```

3. **Make the script executable** - ensure it runs when executed

    ```typescript
    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-16.ts:53:53"
    ```

    To run the script, use the following command:

    ```bash
    npx tsx src/scripts/replaceSignatures.ts
    ```

    --8<-- "code/tutorials/wormholescan/replace-signatures/replace-sigs-17.html"

The script logs each step, skipping valid VAAs, replacing outdated signatures for invalid VAAs, and logging any errors. It then completes with a valid VAA ready for submission.

## Resources

You can explore the complete project and find all necessary scripts and configurations in Wormhole's [demo GitHub repository](https://github.com/wormhole-foundation/demo-vaa-signature-replacement){target=\_blank}.

The demo repository includes a bonus script to check the VAA redemption status on Ethereum and Solana, allowing you to verify whether a transaction has already been redeemed on the destination chain.

## Conclusion

You've successfully built a script to fetch, validate, and replace outdated signatures in VAAs using Wormholescan and the Wormhole SDK.

It's important to note that this tutorial does not update VAAs in the Wormhole network. Before redeeming the VAA, you must propose it for Guardian approval to finalize the process.