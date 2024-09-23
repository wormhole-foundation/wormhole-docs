---
title: Get Started with Token Bridge
description: Learn how to integrate Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
---

# Token Bridge

## Introduction

Building a multichain decentralized application requires overcoming the challenge of seamless token transfers across different blockchains. Without interoperability, transferring assets securely while maintaining token properties and functionality can be slow, inflexible, and costly with traditional solutions.

Wormhole's Token Bridge offers a solution that enables token transfers across blockchain networks using a lock-and-mint mechanism. Leveraging Wormhole's [generic message-passing protocol](/learn/fundamentals/introduction/){target=\_blank}, the Token Bridge allows assets to move across supported blockchains without native token swaps. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain, making the transfer process efficient and chain-agnostic. This approach is highly scalable and doesn't require each blockchain to understand the token transfer logic of other chains, making it a robust and flexible solution for multichain dApps. Additionally, the Token Bridge supports [Contract Controlled Transfers](/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions.

This page will walk you through the essential methods and events of the Token Bridge contracts, providing you with the knowledge needed to integrate them into your cross-chain applications. For more details on how the Token Bridge works, refer to the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} or [Native Token Transfers](/learn/messaging/native-token-transfers/overview/#token-bridge){target=\_blank} pages in the Learn section and the [Token Bridge Whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003_token_bridge.md){target=\_blank}.

## Prerequisites

To interact with the Wormhole Token Bridge, you'll need the following:

- **SDK Installation** - Ensure that the Wormhole SDK is installed in your project. You can install it via npm or yarn:
```sh
npm install @wormhole-foundation/sdk
```
- [The address of the Token Bridge Core Contract](/build/reference/contract-addresses#core-contracts) on the chains you're working with
- [The Wormhole chain ID](/build/reference/chain-ids/) of the chains you're you're targeting for token transfers
- **Token attestation** - the token you wish to transfer must be compatible with the destination chain as a wrapped asset. For tokens that do not already exist on the target chain, you must attest their details, which includes metadata like `name`, `symbol`, `decimals`, and `payload_id` which must be set to `2` for an attestation. This ensures that the wrapped token on the destination chain preserves the original token’s properties. The attestation process creates a record of the token's metadata on the target chain to ensure its consistency across chains. See the [Attestation section](/learn/infrastructure/vaas/#attestation){target=\_blank} for more details and all the required metadata fields

## How to Interact with the Token Bridge Contracts

The Wormhole Token Bridge SDK offers a set of TypeScript types and functions that make it easy to interact with the bridge. This includes handling token transfers, verifying wrapped assets, and submitting attestations. The key functionality revolves around:

- **Token transfers** - locking tokens on the source chain and minting wrapped tokens on the destination chain
- **Attestations** - submitting metadata about a token to other chains for wrapping
- **Verifying wrapped assets** - checking if a token is wrapped and retrieving its original chain and asset details

### Check if a Token is Wrapped

To verify whether a token is a wrapped asset (i.e., a token from another chain that has been bridged), use the `isWrappedAsset` function.

```ts
isWrappedAsset(nativeAddress: TokenAddress<C>): Promise<boolean>;
```

??? interface "Parameters"

    `nativeAddress` ++"TokenAddress<C>"++
        
    The address of the token you want to check.

??? interface "Returns"

    `true` ++"Promise<boolean>"++
        
    If the token is a wrapped version of a foreign token.

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

Once you have an attestation message (VAA), you can submit it to create the wrapped token on the target chain using the `submitAttestation` function.

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

To transfer tokens from one chain to another, you can use the `transfer` function. This function locks the tokens on the source chain and generates a transfer message.

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
    This function should _not_ be used unless it is necessary to take over some stalled transfer.

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