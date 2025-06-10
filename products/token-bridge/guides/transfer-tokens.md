---
title: Transfer Tokens via the Token Bridge Contract
description: Learn how to transfer your token via Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
categories: Token-Bridge, Transfer
---

# Token Transfers via the Token Bridge Contract

## Introduction 

Wormhole's Token Bridge enables seamless cross-chain token transfers using a lock-and-mint mechanism. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain. The primary functions of the Token Bridge contracts revolve around:

- **Attesting a token** - registering a new token for cross-chain transfers
- **Transferring tokens** - locking and minting tokens across chains
- **Transferring tokens with a payload** - including additional data with transfers

This page outlines how to transfer tokens via the Token Bridge contract. To understand the theoretical workings of the Token Bridge, refer to the [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank} page in the Learn section. 

## Prerequisites

To transfer a token with the Wormhole Token Bridge, you'll need the following:

- [The address of the Token Bridge contract](/docs/products/reference/contract-addresses/#token-bridge){target=\_blank} on the chains you're working with
- [The Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're targeting for token transfers
- The token you want to transfer must be [attested](/docs/products/token-bridge/guides/attest-tokens/){target=\_blank} beforehand.

## Transfer Tokens 

Once a token is attested, a cross-chain token transfer can be initiated following the lock-and-mint mechanism. On the source chain, tokens are locked (or burned if they're already a wrapped asset), and a VAA is emitted. On the destination chain, that VAA is used to mint or release the corresponding amount of wrapped tokens.

Call `transferTokens()` to lock/burn tokens and produce a VAA with transfer details.

```solidity
function transferTokens(
    address token,
    uint256 amount,
    uint16 recipientChain,
    bytes32 recipient,
    uint256 arbiterFee,
    uint32 nonce
) external payable returns (uint64 sequence);
```

??? interface "Parameters"

    `token` ++"address"++
        
    The address of the token being transferred.

    ---

    `amount` ++"uint256"++  
    The amount of tokens to be transferred.

    ---

    `recipientChain` ++"uint16"++  
    The Wormhole chain ID of the destination chain.

    ---

    `recipient` ++"bytes32"++  
    The recipient's address on the destination chain.

    ---

    `arbiterFee` ++"uint256"++  
    Optional fee to be paid to an arbiter for relaying the transfer.

    ---

    `nonce` ++"uint32"++  
    A unique identifier for the transaction.

??? interface "Returns"

    `sequence` ++"uint64"++
    
    A unique identifier for the transfer transaction.

Once a transfer VAA is obtained from the Wormhole Guardian network, the final step is to redeem the tokens on the destination chain. Redemption verifies the VAA's authenticity and releases (or mints) tokens to the specified recipient. To redeem the tokens, call `completeTransfer()`.

```solidity
function completeTransfer(bytes memory encodedVm) external;
```

??? interface "Parameters"

    `encodedVm` ++"bytes memory"++
    
    The signed VAA containing the transfer details.

!!!note
    - The Token Bridge normalizes token amounts to 8 decimals when passing them between chains. Make sure your application accounts for potential decimal truncation
    - The VAA ensures the integrity of the message. Only after the Guardians sign the VAA can it be redeemed on the destination chain

## Source Code References

For a deeper understanding of the Token Bridge implementation and to review the actual source code, please refer to the following links:

- [Token Bridge contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- [Token Bridge interface](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}

## Portal Bridge

A practical implementation of the Wormhole Token Bridge can be seen in [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides an easy-to-use interface for transferring tokens across multiple blockchain networks. It leverages the Wormhole infrastructure to handle cross-chain asset transfers seamlessly, offering users a convenient way to bridge their assets while ensuring security and maintaining token integrity.
