---
title: Attesting Tokens via Token Bridge Contracts
description: Learn how to attest your token via Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
categories: Token-Bridge, Transfer
---

# Attesting Tokens via Token Bridge Contracts

## Introduction 

Wormhole's Token Bridge enables seamless cross-chain token transfers using a lock-and-mint mechanism. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain. The primary functions of the Token Bridge contracts revolve around:

- **Attesting a token** - registering a new token for cross-chain transfers
- **Transferring tokens** - locking and minting tokens across chains
- **Transferring tokens with a payload** - including additional data with transfers

This page outlines how to attest your token via the Token Bridge contracts. To understand the theoretical workings of the Token Bridge, refer to the [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank} page in the Learn section. 

## Prerequisites

To attest your token with the Wormhole Token Bridge contract, you'll need the following:

- [The address of the Token Bridge contract](/docs/products/reference/contract-addresses/#token-bridge){target=\_blank} on the chains you're working with


## How to Attest your Token

Suppose a token has never been transferred to the target chain before transferring it cross-chain. In that case, its metadata must be registered so the Token Bridge can recognize it and create a wrapped version if necessary.

The attestation process doesn't require you to manually input token details like name, symbol, or decimals. Instead, the Token Bridge contract retrieves these values from the token contract itself when you call the `attestToken()` method.

```solidity
function attestToken(
    address tokenAddress,
    uint32 nonce
) external payable returns (uint64 sequence);
```

??? interface "Parameters"

    `tokenAddress` ++"address"++
        
    The contract address of the token to be attested.

    ---

    `nonce` ++"uint32"++  

    An arbitrary value provided by the caller to ensure uniqueness.

??? interface "Returns"

    `sequence` ++"uint64"++
    
    A unique identifier for the attestation transaction.

When `attestToken()` is called, the contract emits a Verifiable Action Approval (VAA) containing the token's metadata, which the Guardians sign and publish.

You must ensure the token is ERC-20 compliant. If it does not implement the standard functions, the attestation may fail or produce incomplete metadata.

## How to Verify an Attested Token

To verify if a token has a wrapped representation in a given chain, you can call the `wrappedAsset()` function of the Token Bridge contract in the destination chain that you want to check. The function call will return the address of the wrapped token, or `0x0` if no wrapped token has been attested.

```wrappedAsset
function attestToken(
    uint16 tokenChainId,
    bytes32 tokenAddress
) external view returns (address);
```

??? interface "Parameters"

    `uint16` ++"tokenChainId"++
        
    The Wormhole [chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the source chain.

    ---

    `tokenAddress` ++"bytes32"++  

    The token's [Universal Address](/docs/products/reference/wormhole-formatted-addresses/#universal-address-methods){target=\_blank} in the source chain.

??? interface "Returns"

    `wrappedTokenAddress` ++"address"++
    
    The address of the wrapped token in this chain, or `0x0` if the token has not been attested.

## Source Code References

For a deeper understanding of the Token Bridge implementation and to review the actual source code, please refer to the following links:

- [Token Bridge contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- [Token Bridge interface](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}
