---
title: Get Started with Token Bridge
description: Learn how to integrate Wormhole's Token Bridge for seamless multichain token transfers with a lock-and-mint mechanism and cross-chain asset management.
---

# Token Bridge

## Introduction 

Wormhole's Token Bridge enables seamless cross-chain token transfers using a lock-and-mint mechanism. The bridge locks tokens on the source chain and mints them as wrapped assets on the destination chain. Additionally, the Token Bridge supports [contract-controlled transfers (transfers with messages)](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}, where arbitrary byte payloads can be attached to the token transfer, enabling more complex chain interactions. 

This page outlines the core contract methods needed to integrate Token Bridge functionality into your smart contracts. To understand the theoretical workings of the Token Bridge, refer to the [Token Bridge](/docs/learn/transfers/token-bridge/){target=\_blank} page in the Learn section. 

## Prerequisites

To interact with the Wormhole Token Bridge, you'll need the following:

- [The address of the Token Bridge contract](/docs/build/reference/contract-addresses/#token-bridge){target=\_blank} on the chains you're working with
- [The Wormhole chain ID](/docs/build/reference/chain-ids/){target=\_blank} of the chains you're targeting for token transfers

## How to Interact with Token Bridge Contracts

The primary functions of the Token Bridge contracts revolve around:

- **Attesting a token** - registering a new token for cross-chain transfers
- **Transferring tokens** - locking and minting tokens across chains
- **Transferring tokens with a payload** - including additional data for contract-controlled transfers

### Attest a token

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

### Transfer Tokens 

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

### Transfer tokens with payload

While a standard token transfer moves tokens between chains, a transfer with a payload allows you to embed arbitrary data in the VAA. This data can be used on the destination chain to execute additional logic—such as automatically depositing tokens into a DeFi protocol, initiating a swap on a DEX, or interacting with a custom smart contract.

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
    The Wormhole chain ID of the destination chain.

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

After initiating a transfer on the source chain, the Wormhole Guardian network observes and signs the resulting message, creating a Verifiable Action Approval (VAA). You'll need to fetch this VAA and then call `completeTransferWithPayload()`.

Only the designated recipient contract can redeem tokens. This ensures that the intended contract securely handles the attached payload. On successful redemption, the tokens are minted (if foreign) or released (if native) to the recipient address on the destination chain. For payload transfers, the designated contract can execute the payload's logic at this time.

```solidity
function completeTransferWithPayload(bytes memory encodedVm) external returns (bytes memory);
```

??? interface "Parameters"

    `encodedVm` ++"bytes memory"++

    The signed VAA containing the transfer details.

??? interface "Returns"

    `bytes memory`

    The extracted payload data.

## Source Code References

For a deeper understanding of the Token Bridge implementation and to review the actual source code, please refer to the following links:

- [Token Bridge contract](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol){target=\_blank}
- [Token Bridge interface](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank}

## Portal Bridge

A practical implementation of the Wormhole Token Bridge can be seen in [Portal Bridge](https://portalbridge.com/){target=\_blank}, which provides an easy-to-use interface for transferring tokens across multiple blockchain networks. It leverages the Wormhole infrastructure to handle cross-chain asset transfers seamlessly, offering users a convenient way to bridge their assets while ensuring security and maintaining token integrity.

## FAQs

### Can ownership of wrapped tokens be transferred from the Token Bridge?

No, you cannot transfer ownership of wrapped token contracts from the [Token Bridge](/docs/learn/transfers/token-bridge/){target=\_blank} because the Token Bridge deploys and retains ownership of these contracts and tokens.

 - **On EVM chains** - when you attest a token, the Token Bridge deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the Token Bridge contract itself
 - **On Solana** - the Token Bridge deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the Token Bridge

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows the Token Bridge to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/main/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

### How do I update the metadata of a wrapped token?

Because wrapped tokens are deployed and controlled by the Token Bridge program, which is under the authority of the Wormhole Guardians, there is no direct way for you to update their metadata. Instead, you must coordinate with the respective block explorer teams to request and apply metadata changes.

### How do I calculate the current gas costs for Ethereum Mainnet VAA verification?

You can refer to the [core-bridge repository](https://github.com/nonergodic/core-bridge){target=\_blank} for guidance on how to calculate the current gas costs associated with verifying VAAs on Ethereum Mainnet. This repository provides up-to-date references and examples to help you gauge costs accurately.

### How can I update my wrapped token image on Solscan?

Updating the metadata (such as the token image, name, or symbol) of a wrapped token on [Solscan](https://solscan.io/){target=\_blank} requires [contacting the Solscan team](https://solscan.io/contactus){target=\_blank} directly. Wormhole cannot make these updates for you because the wrapped token contracts are owned and controlled by the Token Bridge, not individual developers or projects.

To request an update, contact Solscan via [support@solscan.io](mailto:support@solscan.io) or their [contact form](https://solscan.io/contactus){target=\_blank}.
