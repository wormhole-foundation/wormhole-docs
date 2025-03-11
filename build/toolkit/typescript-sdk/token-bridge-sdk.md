---
title: Get Started with Token Bridge
description: Learn how to integrate Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
---

# Token Bridge

## Introduction
 
Wormhole's Token Bridge offers a solution that enables token transfers across blockchain networks using a lock-and-mint mechanism. Leveraging Wormhole's [generic message-passing protocol](/docs/learn/fundamentals/introduction/){target=\_blank}, the Token Bridge allows assets to move across supported blockchains without native token swaps. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain, making the transfer process efficient and chain-agnostic. This approach is highly scalable and doesn't require each blockchain to understand the token transfer logic of other chains, making it a robust and flexible solution for multichain dApps. Additionally, the Token Bridge supports [Contract Controlled Transfers](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions.

This page demonstrates how to practically interact with Wormhole's Token Bridge, leveraging the Wormhole SDK and various contract interfaces to send tokens across chains, attest new tokens, and attach arbitrary payloads for contract-controlled transfers. For more details on how the Token Bridge works, refer to the [Token Bridge](/docs/learn/messaging/token-bridge/){target=\_blank} or [Native Token Transfers](/docs/learn/messaging/native-token-transfers/overview/#token-bridge){target=\_blank} pages in the Learn section.

## Prerequisites

To interact with the Wormhole Token Bridge, you must ensure you have the addresses and chain IDs for the Wormhole Core and Token Bridge contracts on the networks you want to work with.

- [The address of the Token Bridge Core Contract](/docs/build/reference/contract-addresses/#token-bridge) on the chains you're working with
- [The Wormhole chain ID](/docs/build/reference/chain-ids/) of the chains you're you're targeting for token transfers

## Setup and Installation

Before you can start interacting with Wormhole's Token Bridge, you need to set up your development environment by installing the Wormhole SDK and configuring your project to use it. This section guides you through the necessary steps to get started.

1. **Install the Wormhole SDK** 
 
    First, ensure you have `Node.js` and `npm` installed on your machine. Then, install the Wormhole SDK packages:

    ```sh
    npm install @wormhole-foundation/wormhole-sdk @wormhole-foundation/sdk-base
    ```

    - `@wormhole-foundation/wormhole-sdk` - core Wormhole SDK for interacting with the Wormhole network
    - `@wormhole-foundation/sdk-base` - Base SDK provides foundational types and interfaces

2.  **Import the necessary modules**

    In your TypeScript or JavaScript file (e.g., index.ts), import the required classes and functions from the SDK:

    ```ts
    import { TokenBridge, createTokenBridge } from '@wormhole-foundation/sdk-base';
    import { Relayer, createRelayer } from '@wormhole-foundation/sdk-base'; // If using Relayer
    // Import other necessary modules as needed
    ```

3. **Initialize the TokenBridge Interface**

    To use methods like `createAttestation()`, `transfer()`, `redeem()`, and other, you need to instantiate the respective interfaces provided by the SDK. Here's how to set it up in a blockchain-agnostic manner:

    ```ts
    // Replace with your blockchain provider setup
    // A provider connects your application to the blockchain network (e.g., via JSON-RPC, WebSocket)
    const provider = /* Initialize your blockchain provider here */;

    // Replace with your wallet or signer setup
    // A signer is an object that can sign transactions and messages with your private key
    // Ensure you handle private keys securely and do not expose them in your codebase
    const signer = /* Initialize your signer here */;

    // Token Bridge contract address on the source chain
    const tokenBridgeAddress = 'TOKEN_BRIDGE_CONTRACT_ADDRESS';

    // Create an instance of the TokenBridge
    const tokenBridge: TokenBridge = createTokenBridge(
      tokenBridgeAddress,
      provider,
      signer
    );

    // If using Relayer, initialize it similarly
    const relayerAddress = 'RELAYER_CONTRACT_ADDRESS';
    const relayer: Relayer = createRelayer(
      relayerAddress,
      provider,
      signer
    );
    ```

## Retrieving the Verifiable Action Approval (VAA)

The [Verifiable Action Approval (VAA)](/docs/learn/infrastructure/vaas/){target=\_blank} is a crucial component in the Wormhole Token Bridge workflow. It proves that the Wormhole Guardians have observed and approved a specific action (such as attesting a token or initiating a transfer) on the source chain. This approval is necessary to execute actions on the destination chain.

### Essential Steps to Retrieve a VAA

1. **Initiate an action on the source chain**

    Begin by performing an action that emits a VAA, such as attesting a token or transferring tokens. For example, when you call `tokenBridge.createAttestation(tokenAddress)`, it initiates the attestation process and emits a VAA once the transaction is mined.

    ```ts
    const tokenAddress = 'INSERT_YOUR_TOKEN_ADDRESS';
    const attestationTx = await tokenBridge.createAttestation(tokenAddress);
    await attestationTx.wait(); // Wait for the transaction to be mined
    ```

2. **Obtain the transaction hash**

    After the transaction is mined, retrieve the transaction hash from the transaction receipt. This hash uniquely identifies the transaction on the blockchain.

    ```ts
    const receipt = await attestationTx.wait();
    const transactionHash = receipt.transactionHash;
    console.log('Transaction Hash:', transactionHash);
    ```

3. **Fetch the VAA from the Wormhole Guardians**

    Fetch the VAA associated with the transaction using the Wormhole SDK or Wormhole's REST API. The SDK provides utilities to simplify this process.

    ```ts
    import { getEmitterAddressEth, getSignedVAA } from '@wormhole-foundation/wormhole-sdk';

    const emitterAddress = getEmitterAddressEth(tokenBridgeAddress);
    const sequence = extractSequenceFromReceipt(receipt); // Implement based on your transaction logs

    // Fetch the VAA using the Wormhole SDK
    const vaa = await getSignedVAA('ETH', emitterAddress, sequence);
    console.log('Attestation VAA:', vaa);
    ```

    !!!note
        - Emitter address - typically the Token Bridge contract address on the source chain
        - Sequence number - extracted from the transaction receipt by parsing the emitted events/logs
        - API endpoint - ensure you're using the correct Wormhole API endpoint corresponding to your network

4. **Use the retrieved VAA in Subsequent actions**
    
    Once you have the VAA, you can use it to complete actions on the destination chain, such as submitting the attestation or redeeming transferred tokens.

    ```ts
    // Example: Submitting the Attestation VAA on the target chain
    await tokenBridge.submitAttestation(vaa);
    ```

## Core Actions

The Wormhole Token Bridge SDK offers a set of TypeScript types and functions that make it easy to interact with the bridge. The main steps to interact with the Token Bridge are:

- **Attest a token (if needed)** -  if the token has never been transferred to the target chain before, its metadata must be attested
- **Transfer tokens (lock & mint)** - initiate a transfer on the source chain, emit a VAA and redeem the tokens on the destination chain
- **Transfer tokens with payload** - include additional data that can trigger actions on the destination chain's contracts
- **Redeem transfers** - use the emitted VAA to complete the transfer and receive tokens on the target chain

Below, the four main actions—attesting a token, transferring tokens, transferring tokens with a payload, and redeeming transfers— will be demonstrated using the Wormhole Token Bridge. Each step references the underlying smart contract methods and the SDK interface files that enable these operations.

!!!note
    The code snippets below are simplified and focus on the main calls. For full implementations, refer to the provided contract source files (like [`bridge/Bridge.sol` ](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank} and [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}) and your integrated SDK code (e.g., `tokenBridge.ts`).
    
    The examples assume you have set up a project with TypeScript, the Wormhole SDK, RPC endpoints, and private keys configured.

### Attesting a Token

If a token has never been transferred to a target chain, it must be attested so the Token Bridge can recognize its metadata (decimals, name, symbol) and create a wrapped version if necessary.

Attesting a new token involves providing its metadata and setting the `payload_id` to `2`. This ensures the wrapped token on the destination chain preserves the original token's properties and consistency across chains. For more details, see the [Attestation section](/docs/learn/infrastructure/vaas/#attestation){target=\_blank}.

The attestation process doesn't require you to manually input token details like name, symbol, or decimals. The Token Bridge contract retrieves these values from the token contract itself when you call the `attestToken()` method.

The `createAttestation()` method is part of the TokenBridge interface provided by the Wormhole SDK, which you initialized in the [setup and installation section](docs/build/contract-integrations/token-bridge/#setup-and-installation){target=\_blank} above. This method abstracts the underlying smart contract call to `ITokenBridge.attestToken()`, simplifying the attestation process.

When `attestToken()` is called, the contract:

- Calls the token contract’s `decimals()`, `symbol()`, and `name()` functions
- Uses these values to create a metadata payload (`payload_id` set to `2`) 
- Emits a VAA containing this metadata, which the Guardians sign and publish

To attest a token, follow these steps:

1. **Create an instance of the Token Bridge contract** - ensure you have initialized the `tokenBridge` instance as shown in the [Setup and Installation section](/docs/build/contract-integrations/token-bridge/#setup-and-installation){target=\_blank}
2. **Call the `createAttestation` method, passing in the token's address** - use the createAttestation method to initiate the attestation process for your token
3. **Send the transaction** - sign and send the transaction to execute the attestation
4. **Obtain the attestation VAA from the Wormhole Guardians** - after the transaction is mined, retrieve the VAA which proves that the Guardians have approved the attestation
5. **Call the `submitAttestation` function, passing in the VAA** - submit the obtained VAA on the target chain to finalize the attestation
6. **Send the transaction to submit the attestation** - sign and send the transaction to complete the attestation process

Under the hood, calling `tokenBridge.createAttestation()` uses Wormhole’s core method:

- The `createAttestation` method is defined in the Wormhole SDK's [`TokenBridge` interface](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L188){target=\_blank}
- On-chain, the `attestToken` method can be found in `bridge/Bridge.sol` and is part of the [`ITokenBridge` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L38){target=\_blank}
- The logic for creating the attestation VAA can be found in `bridge/Bridge.sol`, specifically in the [`attestToken`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L38){target=\_blank} function

```ts
// 1. Ensure tokenBridge is initialized as shown in the Setup and Installation section

// Define the token address you want to attest
const tokenAddress = 'INSERT_YOUR_TOKEN_ADDRESS';

// 2. Call the createAttestation method to initiate attestation
const attestationTx = await tokenBridge.createAttestation(tokenAddress);

// 3. Send the attestation transaction and wait for it to be mined
await sendTransaction(attestationTx);
const receipt = await attestationTx.wait();
console.log('Attestation transaction mined:', receipt.transactionHash);

// 4. Extract the sequence number from the transaction receipt
const sequence = extractSequenceFromReceipt(receipt); // Implement this function based on your transaction logs

// 5. Fetch the signed VAA from the Wormhole Guardians
const emitterAddress = getEmitterAddressEth(tokenBridgeAddress); // Ensure you have imported getEmitterAddressEth
const vaa = await getSignedVAA('ETH', emitterAddress, sequence); // Replace 'ETH' with your source chain if different
console.log('Attestation VAA:', vaa);

// 6. Submit the attestation VAA on the target chain
const submitTx = await tokenBridge.submitAttestation(vaa);
await sendTransaction(submitTx);
console.log('Attestation submitted on target chain:', submitTx.hash);
```

!!!note
    - Ensure the token contract on the source chain implements standard ERC-20 metadata functions (`decimals()`, `symbol()`, `name()`)
    - Call `attestToken()` (via the Wormhole SDK or directly on the contract) for the token address
    - You don't have to put the token details anywhere in your code. If the token contract is a standard ERC-20, the Token Bridge will read its metadata
    - The attestation may fail or produce incomplete metadata if the token does not implement these standard functions. In that case, you must ensure the token is ERC-20 compliant

### Transferring Tokens (Lock & Mint)

Once a token is attested (if necessary), a cross-chain token transfer is initiated, following the lock-and-mint mechanism. On the source chain, tokens are locked (or burned if they're already a wrapped asset), and a VAA is emitted. On the destination chain, that VAA is used to mint or release the corresponding amount of wrapped tokens.

Transferring tokens flow:

1. **Source chain** - call `ITokenBridge.transferTokens()` defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L92){target=\_blank} to lock/burn tokens and produce a VAA with transfer details
2. **Guardian Network** - the Guardians sign the VAA, making it available for retrieval
3. **Destination chain** - use `ITokenBridge.completeTransfer()` defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L120){target=\_blank} and implemented in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L468){target=\_blank} with the signed VAA to mint/release tokens to the designated recipient

Relevant methods and code references:

- **Source chain initiation** - The underlying logic for logging transfers (and producing a VAA) can be found in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L302){target=\_blank}
- **Destination chain redemption** - `ITokenBridge.completeTransfer()` verifies the VAA and mints or releases the tokens
- **SDK integration** - The Wormhole SDK provides convenient methods like [`tokenBridge.transfer()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L215){target=\_blank} and [`tokenBridge.redeem()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L231){target=\_blank} in [`tokenBridge.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}, abstracting away direct contract calls

```ts
// Assumes you have a tokenBridge instance from tokenBridge.ts set up
const sender = 'INSERT_SOURCE_CHAIN_SENDER_ADDRESS';    // e.g., EVM address
const recipient = 'INSERT_TARGET_CHAIN_RECIPIENT_ADDRESS'; // e.g., Solana address in wormhole format
const tokenAddress = 'INSERT_SOURCE_CHAIN_TOKEN_ADDRESS';
const amount = BigInt("1000"); // Example amount

// 1. Initiate the transfer on the source chain:
for await (const tx of tokenBridge.transfer(sender, recipient, tokenAddress, amount)) {
  await sendTransaction(tx);
}

// 2. After the Guardians sign the VAA, obtain it from a Wormhole Guardian network source:
const transferVAA = 'INSERT_VAA'; // Obtain from Guardian network

// 3. On the destination chain, redeem the tokens:
const receiver = 'INSERT_YOUR_DESTINATION_CHAIN_ADDRESS'; 
for await (const tx of tokenBridge.redeem(receiver, transferVAA)) {
  await sendTransaction(tx);
}
```

!!!note
    - The Token Bridge normalizes token amounts to 8 decimals when passing them between chains. Make sure your application accounts for potential decimal truncation
    - The VAA ensures the integrity of the message. Only after the Guardians sign the VAA can it be redeemed on the destination chain
    - If the token has already been attested and recognized on the destination chain, you can proceed directly with this step

Once you've completed these steps, the recipient on the destination chain will have the wrapped tokens corresponding to the locked tokens on the source chain, enabling cross-chain asset portability without direct liquidity pools or manual swaps.

### Transferring Tokens with a Payload (Contract Controlled Transfers)

While a standard token transfer moves tokens between chains, a transfer with a payload allows you to embed arbitrary data in the VAA. This data can be used on the destination chain to execute additional logic—such as automatically depositing tokens into a DeFi protocol, initiating a swap on a DEX, or interacting with a custom smart contract.

Transferring tokens with payload flow:

1. **Source chain**
    - Call `ITokenBridge.transferTokensWithPayload()` defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L101){target=\_blank} instead of `transferTokens()`
    - Include a custom payload (arbitrary bytes) with the token transfer
2. **Guardian Network** - as with any transfer, the Guardians sign the VAA produced by the Token Bridge
3. **Destination chain**
    - On redemption, call [`ITokenBridge.completeTransferWithPayload()`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L114){target=\_blank} instead of `completeTransfer()`
    - Only the designated recipient contract can redeem these tokens. This ensures that the intended contract securely handles the attached payload

Relevant methods and code references:

- **Source chain initiation** - `ITokenBridge.transferTokensWithPayload()`. You can find the underlying logic for logging these payload-carrying transfers in [`Bridge.sol` (`logTransferWithPayload`)](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L336){target=\_blank}
- **Destination chain redemption** - `ITokenBridge.completeTransferWithPayload()` ensures that only the intended recipient address can redeem the tokens and process the payload.
- **SDK integration** - The Wormhole SDK provides a single [`tokenBridge.transfer()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L215){target=\_blank} method that can optionally take a payload parameter. If provided, the SDK uses `transferTokensWithPayload` under the hood. Likewise, redemption calls `completeTransferWithPayload()` when it detects a payload, which is handled by [`tokenBridge.redeem()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L231){target=\_blank}

```ts
// Similar setup to a normal transfer, but we include a payload
const sender = 'INSERT_SOURCE_CHAIN_SENDER_ADDRESS';
const recipient = 'INSERT_TARGET_CHAIN_RECIPIENT_ADDRESS';
const tokenAddress = 'INSERT_SOURCE_CHAIN_TOKEN_ADDRESS';
const amount = BigInt("50000"); // Example amount
const customPayload = new Uint8Array([0x01, 0x02, 0x03]); // Arbitrary data

// 1. Initiate a transfer with payload on the source chain:
for await (const tx of tokenBridge.transfer(sender, recipient, tokenAddress, amount, customPayload)) {
  await sendTransaction(tx);
}

// 2. After obtaining the payload-carrying VAA from the Guardians:
const payloadVAA = 'INSERT_VAA'; // obtained from Wormhole Guardian network
```

!!!note
    - Because only the intended `to` address can redeem a `TransferWithPayload` message, you ensure another address can't intercept or misuse the payload
    - The only difference from a standard transfer is the inclusion of the payload and the corresponding redemption call. Everything else—from acquiring the VAA to sending transactions—follows the same pattern

### Redeeming Transfers

Once a transfer VAA is obtained from the Wormhole Guardian network, the final step is to redeem the tokens on the destination chain. Redemption verifies the VAA's authenticity and releases (or mints) tokens to the specified recipient. This applies to standard transfers and contract-controlled transfers with payloads, though the redemption method differs slightly for each.

Redeeming transfers flow:

1. **Obtain the transfer VAA** - after initiating a transfer on the source chain, the Wormhole Guardian network observes and signs the resulting message, creating a Verifiable Action Approval (VAA). You'll need to fetch this VAA from a Guardian-supported endpoint or service
2. **Call the appropriate redemption function**
    - For standard transfers: `ITokenBridge.completeTransfer()`
    - For transfers with payload: `ITokenBridge.completeTransferWithPayload()`

    The Wormhole SDK's `tokenBridge.redeem()` method automatically determines which on-chain function to call based on the VAA payload type.

3. **Execution and token delivery** - on successful redemption, the tokens are minted (if foreign) or released (if native) to the recipient address on the destination chain. For payload transfers, the designated contract can execute the payload's logic at this time

Relevant methods and code references:

- **Redemption functions** - `ITokenBridge.completeTransfer()` and `ITokenBridge.completeTransferWithPayload()` are both defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}. On-chain logic for processing these calls resides in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- **SDK integration** - The Wormhole SDK's `tokenBridge.redeem()` method (in [`tokenBridge.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}) accepts the VAA and automatically handles calling the correct function on-chain

```ts
const transferVAA = 'INSERT_VAA'; // Obtained from Guardian network
const receiver = 'INSERT_DESTINATION_CHAIN_ADDRESS';

for await (const tx of tokenBridge.redeem(receiver, transferVAA)) {
  await sendTransaction(tx);
}

// Once redeemed, the tokens are now available at the receiver's address
```

!!!important 
    - Ensure you're using a VAA that is properly signed by the Guardian network. Redemption will fail if the VAA is invalid or the network's signatures are incomplete.
    - VAAs are guaranteed to be redeemable for at least 24 hours after production. After that, if the Guardian set changes, you may need to take additional steps (such as re-verification or signature collection) to redeem older VAAs.
    - If redeeming a transfer with payload, remember that only the contract specified as the recipient in the VAA can redeem the tokens and execute the payload. Ensure the recipient address matches the intended contract before attempting redemption.
    - If you try to redeem a VAA that has already been processed, it will fail. Check if `isTransferCompleted()` (in the SDK or contract) returns `true` before retrying redemption.

## Portal Bridge

A practical implementation of the Wormhole Token Bridge can be seen in [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides an easy-to-use interface for transferring tokens across multiple blockchain networks. It leverages the Wormhole infrastructure to handle cross-chain asset transfers seamlessly, offering users a convenient way to bridge their assets while ensuring security and maintaining token integrity.