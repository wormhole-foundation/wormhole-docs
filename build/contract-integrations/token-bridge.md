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











<!--  ----------  -->
```ts
```

## How to Interact with the Token Bridge Contracts

The Wormhole Token Bridge SDK offers a set of TypeScript types and functions that make it easy to interact with the bridge. The key functionality revolves around:

- **Token transfers** - locking tokens on the source chain and minting wrapped tokens on the destination chain
- **Attestations** - submitting metadata about a token to other chains for wrapping
- **Verifying wrapped assets** - checking if a token is wrapped and retrieving its original chain and asset details

### Check If a Token Is Wrapped

To verify whether a token is a wrapped asset (i.e., a token from another chain that has been bridged), use the `isWrappedAsset` function.

```ts
isWrappedAsset(nativeAddress: TokenAddress<C>): Promise<boolean>;
```

??? interface "Parameters"

    `nativeAddress` ++"TokenAddress<C>"++
        
    The address of the token you want to check.

??? interface "Returns"

    `true` ++"Promise<boolean>"++
        
    True if the token is a wrapped version of a foreign token.

### Retrieve the Original Asset of a Wrapped Token

If a token is wrapped, you can retrieve its original asset and the chain it originated from using the `getOriginalAsset` function.

```ts
getOriginalAsset(nativeAddress: TokenAddress<C>): Promise<TokenId<Chain>>;
```

??? interface "Parameters"

    `nativeAddress` ++"TokenAddress<C>"++
        
    The wrapped token's address.

??? interface "Returns"

    `Promise` ++"<TokenId<Chain>>"++
        
    The original asset's token ID and the chain it belongs to.

### Get a Token's Universal Address

The UniversalAddress represents a token in a cross-chain manner, allowing you to handle the same token on different chains. Use the `getTokenUniversalAddress` function to retrieve this address.

```ts
getTokenUniversalAddress(token: NativeAddress<C>): Promise<UniversalAddress>;
```

??? interface "Parameters"

    `token` ++"TokenAddress<C>"++
        
    The wrapped token's address.

??? interface "Returns"

    `Promise` ++"<TokenId<Chain>>"++
        
    The original asset's token ID and the chain it belongs to.

### Create a Token Attestation

To transfer a token between chains, its metadata must be attested first. Use the `createAttestation` function to generate an attestation message for the token.

```ts
createAttestation(
  token: TokenAddress<C>,
  payer?: AccountAddress<C>
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `token` ++"TokenAddress<C>"++
        
    The address of the token you want to attest.

    `payer` ++"AccountAddress<C>"++
        
    (Optional) The account paying for the transaction.

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.

### Submit a Token Attestation

Once you have an attestation message (VAA), you can submit it using the `submitAttestation` function to create the wrapped token on the target chain.

```ts
submitAttestation(
  vaa: TokenBridge.AttestVAA,
  payer?: AccountAddress<C>
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `vaa` ++"TokenBridge.AttestVAA"++
        
    The attestation VAA that contains the token metadata.

    `payer` ++"AccountAddress<C>"++
        
    (Optional) The account paying for the transaction.

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.

### Initiate a Token Transfer

You can use the' transfer' function to transfer tokens from one chain to another. This function locks the tokens on the source chain and generates a transfer message.

```ts
transfer(
  sender: AccountAddress<C>,
  recipient: ChainAddress,
  token: TokenAddress<C>,
  amount: bigint,
  payload?: Uint8Array
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `sender` ++"AccountAddress<C>"++
        
    The account initiating the transfer.

    `recipient` ++"ChainAddress"++
        
    The recipient's address on the destination chain.

    `token` ++"TokenAddress<C>"++
        
    The token being transferred.

    `amount` ++"bigint"++
        
    The amount of the token to transfer.

    `payload` ++"Uint8Array"++
        
    (Optional) A custom payload attached to the transfer

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.

### Redeem a Token Transfer

After transferring tokens between chains, the recipient can redeem the transfer using the `redeem` function. This function mints the wrapped tokens on the destination chain or unlocks them if they were previously locked.

```ts
redeem(
  sender: AccountAddress<C>,
  vaa: TokenBridge.TransferVAA,
  unwrapNative?: boolean
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `sender` ++"AccountAddress<C>"++
        
    The account redeeming the transfer.

    `vaa` ++"TokenBridge.TransferVAA"++
        
    The transfer VAA that contains the details of the token lockup on the source chain.

    `unwrapNative` ++"boolean"++
        
    (Optional) Whether to unwrap the native token if it is a wrapped asset.

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.

## Automatic Token Bridge

The `AutomaticTokenBridge` interface offers additional functionality for automatic token transfers, including automatic redemption on the destination chain. This makes the transfer process more efficient by removing the need for manual redemption.

### Initiate an Automatic Transfer

To initiate a token transfer that includes automatic redemption on the destination chain, use the `transfer` method from the `AutomaticTokenBridge` interface.

```ts
transfer(
  sender: AccountAddress<C>,
  recipient: ChainAddress,
  token: TokenAddress<C>,
  amount: bigint,
  nativeGas?: bigint
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `sender` ++"AccountAddress<C>"++
        
    The account initiating the transfer.

    `recipient` ++"ChainAddress"++
        
    The recipient's address on the destination chain.

    `token` ++"TokenAddress<C>"++
        
    The token being transferred.

    `amount` ++"bigint"++
        
    The amount of the token to transfer.

    `nativeGas` ++"bigint"++
        
    (Optional) The amount of native gas to include for the transfer.

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.

### Manually Redeem a Transfer

In rare cases where automatic redemption fails, you can manually redeem the transfer using the `AutomaticTokenBridge`'s `redeem` function.

!!! note
    This function should _only_ be used if it is necessary to take over some stalled transfer.

```ts
redeem(
  sender: AccountAddress<C>,
  vaa: AutomaticTokenBridge.VAA
): AsyncGenerator<UnsignedTransaction<N, C>>;
```

??? interface "Parameters"

    `sender` ++"AccountAddress<C>"++
        
    The account redeeming the transfer.

    `vaa` ++"AutomaticTokenBridge.VAA"++
        
    The transfer VAA to redeem.

??? interface "Returns"

    `AsyncGenerator` ++"<UnsignedTransaction<N, C>>"++
        
    An asynchronous generator that produces transactions to sign and send.


## Portal bridge

A practical implementation of the Wormhole Token Bridge can be seen in [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides an easy-to-use interface for transferring tokens across multiple blockchain networks. It leverages the Wormhole infrastructure to handle cross-chain asset transfers seamlessly, offering users a convenient way to bridge their assets while ensuring security and maintaining token integrity.