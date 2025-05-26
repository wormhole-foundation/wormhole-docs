---
title: Token Bridge Payload Structure
description: Discover the structure and purpose of each Token Bridge payload, including Transfer, TransferWithPayload, AssetMeta, and governance messages.
categories: Token-Bridge, Transfers
---

# Token Bridge Message and Payload Structure

To enable secure and flexible cross-chain token transfers, the [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank} defines a set of standardized payloads. These payloads are embedded in [Verifiable Action Approvals (VAAs)](/docs/protocol/infrastructure/vaas/){target=\_blank} and processed by bridge contracts on the source and destination chains. Each payload has a unique format and serves a specific role in the lifecycle of token bridging.

This page outlines each payload type in detail.

## Transfer

The `Transfer` payload (ID = `1`) is the core mechanism for moving tokens across chains. It is emitted when a user locks or burns tokens on the source chain. On the destination chain, it instructs the bridge to either mint a wrapped token or release native tokens from custody.

```text
PayloadID uint8 = 1
Amount uint256
TokenAddress bytes32
TokenChain uint16
To bytes32
ToChain uint16
Fee uint256
```

??? interface "Parameters"

    `PayloadID` ++"uint8"++

    Value must be `1`, indicating a `Transfer` operation.

    ---

    `Amount` ++"uint256"++

    Amount being transferred, truncated to 8 decimals for consistency across all chains.

    ---

    `TokenAddress` ++"bytes32"++

    Address of the token. Left-zero-padded if shorter than 32 bytes
    
    ---

    `TokenChain` ++"uint16"++

    Chain ID of the token.
    
    ---

    `To` ++"bytes32"++

    Address of the recipient. Left-zero-padded if shorter than 32 bytes.
    
    ---

    `ToChain` ++"uint16"++

    Chain ID of the recipient.
    
    ---

    `Fee` ++"uint256"++

    Amount of tokens that the user is willing to pay as relayer fee. Must be less than Amount. Optional and can be claimed by relayers who submit the VAA on the target chain.
   

To keep `Transfer` messages small, they don't carry all the token's metadata. However, this means that before a token can be transferred to a new chain for the first time, the metadata needs to be bridged, and the wrapped asset needs to be created. Metadata, in this case, includes the number of decimals, which is a core requirement for instantiating a token.

## AssetMeta

Before a token can be transferred to a new chain for the first time, its metadata must be attested using the `AssetMeta` payload (ID = `2`). This ensures proper decimal precision and display.

```text
PayloadID uint8 = 2
TokenAddress [32]uint8
TokenChain uint16
Decimals uint8
Symbol [32]uint8
Name [32]uint8
```

??? interface "Parameters"

    `PayloadID` ++"uint8"++

    Value must be `2`, indicating a `AssetMeta` operation.

    ---

    `TokenAddress` ++"[32]uint8"++

    Address of the token. Left-zero-padded if shorter than 32 bytes.

    ---

    `TokenChain` ++"uint16"++

    Chain ID of the token.

    ---

    `Decimals` ++"uint8"++

    Number of decimals the token uses on its native chain (not truncated to 8).

    ---

    `Symbol` ++"[32]uint8"++

    Symbol of the token, UTF-8 encoded and padded to 32 bytes.

    ---

    `Name` ++"[32]uint8"++

    Name of the token, UTF-8 encoded and padded to 32 bytes.

Before a token can be transferred to a new chain, the `AssetMeta` message must be submitted to that chain. The bridge uses this metadata to create a wrapped token representation with accurate name, symbol, and decimal precision.

## TransferWithPayload

The `TransferWithPayload` payload (ID = `3`) extends the standard token transfer by allowing developers to include arbitrary data. This enables interactions with destination chain smart contracts, such as triggering swaps or staking.

```text
PayloadID uint8 = 3
Amount uint256
TokenAddress bytes32
TokenChain uint16
To bytes32
ToChain uint16
FromAddress bytes32
Payload bytes
```

??? interface "Parameters"

    `PayloadID` ++"uint8"++

    Value must be `3`, indicating a `TransferWithPayload` operation.

    ---

    `Amount` ++"uint256"++

    Amount being transferred, truncated to 8 decimals.

    ---

    `TokenAddress` ++"bytes32"++

    Address of the token. Left-zero-padded if shorter than 32 bytes. 

    ---

    `TokenChain` ++"uint16"++

    Chain ID of the token.

    ---

    `To` ++"bytes32"++

    Address of the recipient. Must be a contract capable of parsing and handling the payload. Left-zero-padded if shorter than 32 bytes

    ---

    `ToChain` ++"uint16"++

    Chain ID of the recipient.

    ---

    `FromAddress` ++"bytes32"++

    Address of the sender on the source chain.

    ---

    `Payload` ++"bytes"++

    Arbitrary data passed to the recipient contract. Can be used for DeFi operations, authentication, or app-specific logic.


Unlike `Transfer`, the `TransferWithPayload` message must be redeemed by the recipient contract since only that contract can handle the custom payload properly.

## RegisterChain

The `RegisterChain` governance payload (Action ID = `1`) registers a Token Bridge emitter address for a foreign chain. This ensures the bridge only accepts messages from known peers.

```text
Module [32]byte
Action uint8 = 1
ChainId uint16

EmitterChainID uint16
EmitterAddress [32]uint8
```

??? interface "Parameters"

    `Module` ++"[32]byte"++

    Module identifier. Left-padded with `TokenBridge` for Token Bridge.

    ---

    `Action` ++"uint8"++

    Value must be `1`, indicating a `RegisterChain` operation.

    ---

    `ChainID` ++"uint16"++

    The chain where this governance action should be applied. `0` is a valid value for all chains

    ---

    `EmitterChainID` ++"uint16"++

    Chain ID of the registered emitter.

    ---

    `EmitterAddress` ++"[32]uint8"++

    Address of the registered emitter, left-zero-padded if shorter than 32 bytes.

This payload can only be emitted by the Wormhole governance contract, which ensures that each chain only accepts messages from one verified bridge emitter per remote chain.

## UpgradeContract

The `UpgradeContract` governance payload (Action ID = `2`) facilitates upgrades to the Token Bridge contract on a specific chain.

```text
Module [32]byte
Action uint8 = 2
ChainId uint16

NewContract [32]uint8
```

??? interface "Parameters"

    `Module` ++"[32]byte"++

    Module identifier, left-padded with `TokenBridge` for Token Bridge.

    ---

    `Action` ++"uint8"++

    Value must be `2`, indicating an `UpgradeContract` operation.

    ---

    `ChainID` ++"uint16"++

    The target chain where the governance action should be applied.

    ---

    `NewContract` ++"[32]uint8"++

    Address of the new Token Bridge contract, left-zero-padded to 32 bytes.

This message allows the Wormhole governance system to deploy new versions of the bridge while retaining control over interoperability and security.

## Summary of Payload Structure

| Payload Type          | ID            | Purpose                                                                | Who Emits It           |
|-----------------------|---------------|------------------------------------------------------------------------|------------------------|
| `Transfer`            | PayloadID `1` | Moves tokens between chains by minting or releasing on the destination | Token Bridge contract  |
| `AssetMeta`           | PayloadID `2` | Attests token metadata (decimals, symbol, name) before first transfer  | Token Bridge contract  |
| `TransferWithPayload` | PayloadID `3` | Transfers tokens along with a custom payload for contract execution    | Token Bridge contract  |
| `RegisterChain`       | Action `1`    | Registers a verified Token Bridge emitter for a foreign chain          | Wormhole governance    |
| `UpgradeContract`     | Action `2`    | Upgrades the Token Bridge contract on a specific chain                 | Wormhole governance    |