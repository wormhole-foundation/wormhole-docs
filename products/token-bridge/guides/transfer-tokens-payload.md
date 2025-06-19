---
title: Transfer Tokens with Payload - Token Bridge
description: Learn how to transfer your token with an additional payload via Wormhole's Token Bridge for seamless multichain token transfers with payload execution.
categories: Token-Bridge, Transfer
---

# Token Transfers with Payload via the Token Bridge Contract

## Introduction 

Wormhole's [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank} enables seamless cross-chain token transfers using a lock-and-mint mechanism. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain. The primary functions of the Token Bridge contracts revolve around:

- **Attesting a token**: Registering a new token for cross-chain transfers.
- **Transferring tokens**: Locking and minting tokens across chains.
- **Transferring tokens with a payload**: Including additional data with transfers.

This page outlines how to [transfer tokens with a message](/docs/protocol/infrastructure/vaas/#token-transfer-with-message){target=\_blank} via the Token Bridge contract, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions. To understand the theoretical workings of the Token Bridge, refer to the [Token Bridge Overview](/docs/products/token-bridge/overview/){target=\_blank} page. 

## Prerequisites

To transfer a token with a payload via the Token Bridge, you'll need the following:

- [The address of the Token Bridge contract](/docs/products/reference/contract-addresses/#token-bridge){target=\_blank} on the chains you're working with.
- [The Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're targeting for token transfers.
- The token you want to transfer must be [attested](/docs/products/token-bridge/guides/attest-tokens/){target=\_blank} beforehand.
- A formatted payload to be executed in the destination chain.

## Transfer Tokens with Payload

While a standard token transfer moves tokens between chains, a transfer with a payload allows you to embed arbitrary data in the [Verifiable Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}. This data can be used on the destination chain to execute additional logic—such as automatically depositing tokens into a DeFi protocol, initiating a swap on a DEX, or interacting with a custom smart contract.

Call `transferTokensWithPayload()` instead of `transferTokens()` to include a custom payload (arbitrary bytes) with the token transfer.

```solidity
function transferTokensWithPayload(
    address token,
    uint256 amount,
    uint16 recipientChain,
    bytes32 recipient,
    uint32 nonce,
    bytes memory payload
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
    
    The Wormhole [chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the destination chain.

    ---

    `recipient` ++"bytes32"++
    
    The recipient's address on the destination chain.

    ---

    `nonce` ++"uint32"++
    
    A unique identifier for the transaction.

    ---

    `payload` ++"bytes memory"++
    
    Arbitrary data payload attached to the transaction.

??? interface "Returns"
    
    `sequence` ++"uint64"++
    
    A unique identifier for the transfer transaction.

After initiating a transfer on the source chain, the [Guardian](/docs/protocol/infrastructure/guardians/){target=\_blank} network observes and signs the resulting message, creating a VAA. You'll need to fetch this VAA and then call `completeTransferWithPayload()`.

Only the designated recipient contract can redeem tokens. This ensures that the intended contract securely handles the attached payload. On successful redemption, the tokens are minted (if foreign) or released (if native) to the recipient address on the destination chain. For payload transfers, the designated contract can execute the payload's logic at this time.

```solidity
function completeTransferWithPayload(
    bytes memory encodedVm
) external returns (bytes memory);
```

??? interface "Parameters"

    `encodedVm` ++"bytes memory"++

    The signed VAA containing the transfer details.

??? interface "Returns"

    ++"bytes memory"++

    The extracted payload data.

## Source Code References

For a deeper understanding of the Token Bridge implementation and to review the actual source code, please refer to the following links:

- [Token Bridge contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- [Token Bridge interface](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}