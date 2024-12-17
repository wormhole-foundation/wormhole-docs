---
title: Get Started with Token Bridge
description: Learn how to integrate Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
---

# Token Bridge

<!-- 
creating a contract that interacts with the token bridge directly 
how to interact with the token bridge 
-->

## Introduction 

Wormhole's Token Bridge offers a solution that enables token transfers across blockchain networks using a lock-and-mint mechanism. Leveraging Wormhole's [generic message-passing protocol](/docs/learn/fundamentals/introduction/){target=\_blank}, the Token Bridge allows assets to move across supported blockchains without native token swaps. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain, making the transfer process efficient and chain-agnostic. This approach is highly scalable and doesn't require each blockchain to understand the token transfer logic of other chains, making it a robust and flexible solution for multichain dApps. Additionally, the Token Bridge supports [Contract Controlled Transfers](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions.

This page demonstrates how to interact with Wormhole’s Token Bridge at a practical level, leveraging the Wormhole SDK and various contract interfaces to send tokens across chains, attest new tokens, and attach arbitrary payloads for contract-controlled transfers. For more details on how the Token Bridge works, refer to the [Token Bridge](/docs/learn/messaging/token-bridge/){target=\_blank} or [Native Token Transfers](/docs/learn/messaging/native-token-transfers/overview/#token-bridge){target=\_blank} pages in the Learn section.

## Prerequisites

To interact with the Wormhole Token Bridge, you'll need to ensure you have the addresses and chain IDs for the Wormhole core and Token Bridge contracts on the networks you want to work with.

- [The address of the Token Bridge Core Contract](/docs/build/reference/contract-addresses#core-contracts) on the chains you're working with
- [The Wormhole chain ID](/docs/build/reference/chain-ids/) of the chains you're you're targeting for token transfers

## Core Actions

The Wormhole Token Bridge SDK offers a set of TypeScript types and functions that make it easy to interact with the bridge. The main steps to interact with the Token Bridge are:

- **Attest a token (if needed)** -  if the token has never been transferred to the target chain before, its metadata must be attested
- **Transfer tokens (lock & mint)** - initiate a transfer on the source chain, emit a VAA, and redeem the tokens on the destination chain
- **Transfer tokens with payload** - include additional data that can trigger actions on the destination chain’s contracts
- **Redeem transfers** - use the emitted VAA to complete the transfer and receive tokens on the target chain

Below is an example flow demonstrating the four main actions—attesting a token, transferring tokens, transferring tokens with a payload, and redeeming transfers—using the Wormhole Token Bridge. Each step references the underlying smart contract methods and the SDK interface files that enable these operations.

!!!note
    - The code snippets below are simplified and focus on the main calls.
    - For full implementations, refer to the provided contract source files (like [`bridge/Bridge.sol` ](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank} and [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}) and your integrated SDK code (e.g., `tokenBridge.ts`).
    - The examples assume you have set up a project with `Node.js/TypeScript`, the Wormhole SDK, RPC endpoints, and private keys configured.

### Attesting a Token

If you’re working with a token that has never been transferred to a particular target chain, you must attest it so the Token Bridge can recognize its metadata (decimals, name, symbol) and create a wrapped version if needed. 

For tokens that do not exist on the target chain, you must attest their details, including metadata and `payload_id`, which must be set to `2` for an attestation. This ensures that the wrapped token on the destination chain preserves the original token’s properties. The attestation process records the token's metadata on the target chain to ensure consistency across chains. See the [Attestation section](/docs/learn/infrastructure/vaas/#attestation){target=\_blank} for more details.

The attestation process does not require you to manually provide token details like name, symbol, or decimals directly in the code call. Instead, the Token Bridge contract queries these details from the token contract itself when you call the `attestToken()` method.

Behind the scenes, when `ITokenBridge.attestToken()` is called with a given token address, the Token Bridge contract:

- Calls the token contract’s `decimals()`, `symbol()`, and `name()` functions
- Uses these values to create a metadata payload (`payload_id` set to `2`) that describes the token
- Emits a VAA containing this metadata, which the Guardians sign and publish

Under the hood, calling `tokenBridge.createAttestation()` uses Wormhole’s core method:

- `ITokenBridge.attestToken()` from [`src/interfaces/ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}
- The logic for creating the attestation VAA can be found in `bridge/Bridge.sol`, specifically in the [`attestToken`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L38){target=\_blank} function

```ts
// In your code, you might have a tokenBridge instance set up from tokenBridge.ts
// This references the Wormhole SDK that internally calls `ITokenBridge.attestToken`.

const tokenAddress = "<YOUR_TOKEN_ADDRESS>";
for await (const tx of tokenBridge.createAttestation(tokenAddress)) {
  // Sign and send the transaction (e.g., via your wallet or ethers.js)
  await sendTransaction(tx);
}

// Once the attestation VAA is generated by Wormhole Guardians, you'll submit it on the target chain:
const attestationVAA = ... // obtain from Wormhole Guardian network
for await (const tx of tokenBridge.submitAttestation(attestationVAA)) {
  await sendTransaction(tx);
}
```

- The `createAttestation` method is defined in the Wormhole SDK's [`TokenBridge` interface](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L188){target=\_blank}
- On-chain, the `attestToken` method can be found in `bridge/Bridge.sol` and is part of the [`ITokenBridge` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L38){target=\_blank}

!!!important
    - Ensure the token contract on the source chain implements standard ERC-20 metadata functions (`decimals()`, `symbol()`, `name()`).
    - Simply call `attestToken()` (via the Wormhole SDK or directly on the contract) for the token address.
    - You don't have to put the token details anywhere in your code. If the token contract is a standard ERC-20, the Token Bridge will handle reading its metadata.
    - If the token does not implement these standard functions, the attestation may fail or produce incomplete metadata. In that case, you would need to ensure the token is properly ERC-20 compliant.

### Transferring Tokens (Lock & Mint)

Once a token is attested (if that step was necessary), initiating a cross-chain token transfer follows the lock-and-mint mechanism. On the source chain, tokens are locked (or burned if they’re already a wrapped asset), and a VAA is emitted. On the destination chain, that VAA is used to mint or release the corresponding amount of wrapped tokens.

Transferring tokens flow:

1. **Source chain** - call `ITokenBridge.transferTokens()` to lock/burn tokens. This produces a VAA with transfer details
2. **Guardian Network** - the Guardians sign the VAA, making it available for retrieval
3. **Destination chain** - use `ITokenBridge.completeTransfer()` with the signed VAA to mint/release tokens to the designated recipient

Relevant methods and code references:

- **Source chain initiation** - `ITokenBridge.transferTokens()` is defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L92){target=\_blank}. The underlying logic for logging transfers (and producing a VAA) can be found in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L302){target=\_blank}
- **Destination chain redemption** - `ITokenBridge.completeTransfer()` is also defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L120){target=\_blank} and implemented in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L468){target=\_blank}. It verifies the VAA and mints or releases the tokens
- **SDK integration** - The Wormhole SDK provides convenient methods like [`tokenBridge.transfer()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L215){target=\_blank} and [`tokenBridge.redeem()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L231){target=\_blank} in [`tokenBridge.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}, abstracting away direct contract calls

```ts
// Assumes you have a tokenBridge instance from tokenBridge.ts set up
const sender = "<SOURCE_CHAIN_SENDER_ADDRESS>";    // e.g., EVM address
const recipient = "<TARGET_CHAIN_RECIPIENT_ADDRESS>"; // e.g., Solana address in wormhole format
const tokenAddress = "<SOURCE_CHAIN_TOKEN_ADDRESS>";
const amount = BigInt("1000"); // Example amount

// 1. Initiate the transfer on the source chain:
for await (const tx of tokenBridge.transfer(sender, recipient, tokenAddress, amount)) {
  await sendTransaction(tx);
}

// 2. After the Guardians sign the VAA, obtain it from a Wormhole Guardian network source:
const transferVAA = ... // Obtain from Guardian network

// 3. On the destination chain, redeem the tokens:
const receiver = "<YOUR_DESTINATION_CHAIN_ADDRESS>"; 
for await (const tx of tokenBridge.redeem(receiver, transferVAA)) {
  await sendTransaction(tx);
}
```

!!!note
    - The Token Bridge normalizes token amounts to 8 decimals when passing them between chains. Make sure your application accounts for potential decimal truncation.
    - The VAA ensures the integrity of the message. Only after the Guardians sign the VAA can it be redeemed on the destination chain.
    - If the token is already attested and recognized on the destination chain, you can directly proceed with this step.

Once you’ve completed these steps, the recipient on the destination chain will have the wrapped tokens corresponding to the locked tokens on the source chain, enabling cross-chain asset portability without direct liquidity pools or manual swaps.

### Transferring Tokens with a Payload (Contract Controlled Transfers)

While a standard token transfer simply moves tokens between chains, a transfer with a payload allows you to embed arbitrary data in the VAA. This data can be used on the destination chain to execute additional logic—such as automatically depositing tokens into a DeFi protocol, initiating a swap on a DEX, or interacting with a custom smart contract.

Transferring tokens with payload flow:

1. **Source chain**
    - Call `ITokenBridge.transferTokensWithPayload()` instead of `transferTokens()`
    - Include a custom payload (arbitrary bytes) with the token transfer
2. **Guardian Network** - as with any transfer, the Guardians sign the VAA produced by the Token Bridge
3. **Destination chain**
    - On redemption, call `ITokenBridge.completeTransferWithPayload()` instead of `completeTransfer()`
    - Only the designated recipient contract can redeem these tokens. This ensures the attached payload is securely handled by the intended contract

Relevant methods and code references:

- **Source Chain Initiation** - `ITokenBridge.transferTokensWithPayload()` is defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L101){target=\_blank}. Underlying logic for logging these payload-carrying transfers can be found in [`Bridge.sol` (`logTransferWithPayload`)](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L336){target=\_blank}
- **Destination chain redemption** - [`ITokenBridge.completeTransferWithPayload()`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol#L114){target=\_blank} ensures that only the intended recipient address can redeem the tokens and process the payload.
- **SDK Integration** - The Wormhole SDK provides a single [`tokenBridge.transfer()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L215){target=\_blank} method that can optionally take a payload parameter. If provided, the SDK uses `transferTokensWithPayload` under the hood. Likewise, redemption calls `completeTransferWithPayload()` when it detects a payload, which is handled by [`tokenBridge.redeem()`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L231){target=\_blank}

```ts
// Similar setup to a normal transfer, but we include a payload
const sender = "<SOURCE_CHAIN_SENDER_ADDRESS>";
const recipient = "<TARGET_CHAIN_RECIPIENT_ADDRESS>";
const tokenAddress = "<SOURCE_CHAIN_TOKEN_ADDRESS>";
const amount = BigInt("50000"); // Example amount
const customPayload = new Uint8Array([0x01, 0x02, 0x03]); // Arbitrary data

// 1. Initiate a transfer with payload on the source chain:
for await (const tx of tokenBridge.transfer(sender, recipient, tokenAddress, amount, customPayload)) {
  await sendTransaction(tx);
}

// 2. After obtaining the payload-carrying VAA from the Guardians:
const payloadVAA = ... // obtained from Wormhole Guardian network

// 3. On the destination chain, redeem:
const receiver = "<DESTINATION_CHAIN_CONTRACT_ADDRESS>";
for await (const tx of tokenBridge.redeem(receiver, payloadVAA)) {
  await sendTransaction(tx);
}

// The payload is now available on the destination chain's contract, allowing custom logic to execute upon token arrival.
```

!!!note
    - Because only the intended `to` address can redeem a `TransferWithPayload` message, you ensure that the payload can’t be intercepted or misused by another address.
    - The only difference from a standard transfer is the inclusion of the payload and the corresponding redemption call. Everything else—from acquiring the VAA to sending transactions—follows the same pattern.

### Redeeming Transfers

Once a transfer VAA is obtained from the Wormhole Guardian network, the final step is to redeem the tokens on the destination chain. Redemption verifies the VAA’s authenticity and releases (or mints) tokens to the specified recipient. This applies to both standard transfers and contract-controlled transfers with payloads, though the redemption method differs slightly for each.

Redeeming transfers flow:

1. **Obtain the transfer VAA** - after initiating a transfer on the source chain, the Wormhole Guardian network observes and signs the resulting message, creating a Verifiable Action Approval (VAA). You’ll need to fetch this VAA from a Guardian-supported endpoint or service
2. **Call the appropriate redemption function**
    - For standard transfers: `ITokenBridge.completeTransfer()`
    - For transfers with payload: `ITokenBridge.completeTransferWithPayload()`

    The Wormhole SDK’s `tokenBridge.redeem()` method determines automatically which on-chain function to call based on the VAA payload type

3. **Execution and token delivery** - on successful redemption, the tokens are minted (if foreign) or released (if native) to the recipient address on the destination chain. For payload transfers, the designated contract can execute the payload’s logic at this time

Relevant methods and code references:

- **Redemption functions** - `ITokenBridge.completeTransfer()` and `ITokenBridge.completeTransferWithPayload()` are both defined in [`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}. On-chain logic for processing these calls resides in [`Bridge.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- **SDK integration** - The Wormhole SDK’s `tokenBridge.redeem()` method (in [`tokenBridge.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts){target=\_blank}) accepts the VAA and automatically handles calling the correct function on-chain

```ts
const transferVAA = ...; // Obtained from Guardian network
const receiver = "<DESTINATION_CHAIN_ADDRESS>";

for await (const tx of tokenBridge.redeem(receiver, transferVAA)) {
  await sendTransaction(tx);
}

// Once redeemed, the tokens are now available at the receiver’s address.
```

!!!important 
    - Ensure you’re using a VAA that is properly signed by the Guardian network. If the VAA is invalid or the network’s signatures are incomplete, redemption will fail.
    - VAAs are guaranteed to be redeemable for at least 24 hours after being produced. After that, if the Guardian set changes, you may need to take additional steps (such as re-verification or signature collection) to redeem older VAAs.
    - If redeeming a transfer with payload, remember that only the contract specified as the recipient in the VAA can redeem the tokens and execute the payload. Ensure the recipient address matches the intended contract before attempting redemption.
    - Remember that token amounts might be normalized to 8 decimals for the bridging process. Confirm that the final amounts after redemption align with your expectations.
    - If you try to redeem a VAA that has already been processed, it will fail. Check if `isTransferCompleted()` (in the SDK or contract) returns `true` before retrying redemption.

## Portal bridge

A practical implementation of the Wormhole Token Bridge can be seen in [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides an easy-to-use interface for transferring tokens across multiple blockchain networks. It leverages the Wormhole infrastructure to handle cross-chain asset transfers seamlessly, offering users a convenient way to bridge their assets while ensuring security and maintaining token integrity.

## Conclusion

This page has highlighted the foundational steps involved in working with the Wormhole Token Bridge, including establishing recognition for a new token on the destination chain (if needed), moving assets across different chains without relying on native liquidity pools or swaps, embedding additional data to enable advanced, automated cross-chain operations, and finalizing the process to release or mint tokens for the intended recipient on the destination chain. Equipped with these fundamental workflows, developers can create multichain applications that seamlessly shift assets between ecosystems, implement custom logic upon token arrival, and deliver a smooth, user-friendly experience.