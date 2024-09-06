---
title: Interacting with CCTP Contracts
description: Learn how to interact directly with Circle's CCTP Bridge contracts, including TokenMessenger, TokenMinter, and MessageTransmitter. 
---

# Interacting with CCTP Bridge Contracts

Cross-Chain Transfer Protocol (CCTP) is a permissionless utility created by Circle to enable secure, efficient transfers of USDC across blockchain networks through native burning and minting, allowing developers to build multi-chain applications that simplify cross-chain transactions and improve liquidity without trust dependencies. For a full introduction to Circle's CCTP, please see the [CCTP guide in the learn section](/learn/messaging/cctp).

## CCTP Core Contracts Overview

Three core contracts make up CCTP. `TokenMessenger` is the entry point for cross-chain USDC transfers, routing messages to initiate USDC burns on the source chain, and mint USDC on the destination chain. `MessageTransmitter` handles generic message passing, sending messages from the source chain and receiving them on the destination chain. `TokenMinter` is responsible for the actual minting and burning of USDC, utilizing chain-specific settings for both the burners and minters across different networks. This guide will take a closer look at these contracts, paying careful attention to the methods that can be called and their respective parameters and important events emitted by the contracts.

## TokenMessenger Contract

The `TokenMessenger` contract facilitates cross-chain USDC transfers by sending and receiving messages between blockchains. It works with the `MessageTransmitter` to relay messages for burning USDC on a source chain and minting it on a destination chain. It emits events to track deposits for burning and the subsequent minting of tokens on the destination chain. The contract ensures that only registered remote `TokenMessenger` contracts can handle messages, verifies proper conditions for burning tokens, and uses chain-specific settings to manage local and remote minters. Additionally, it provides methods for replacing or updating previously sent burn messages, adding or removing remote `TokenMessengers`, and managing the minting process for cross-chain transfers.

??? code "View the complete TokenMessenger Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/TokenMessenger.sol'
    ```

### Methods

The permissionless messaging functions exposed by the `TokenMessenger` are as follows:

???+ function "**depositForBurn**(_uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken_) — Deposits and burns tokens from sender to be minted on destination domain. Minted tokens will be transferred to mintRecipient."

    === "Parameters"

        - `amount` *uint256* - the amount of tokens to burn
        - `destinationDomain` *uint32* - the network where the token will be minted after burn
        - `mintRecipient` *bytes32* - address of mint recipient on destination domain
        - `burnToken` *address* -  address of contract to burn deposited tokens, on local domain

??? function "**depositForBurnWithCaller**(_uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken, bytes32 destinationCaller_) — Deposits and burns tokens from sender to be minted on destination domain. The mint on the destination domain must be called by `destinationCaller`."

    === "Parameters"

        - `amount` *uint256* - the amount of tokens to burn
        - `destinationDomain` *uint32* - the network where the token will be minted after burn
        - `mintRecipient` *bytes32* - address of mint recipient on destination domain
        - `burnToken` *address* - address of contract to burn deposited tokens, on local domain
        - `destinationCaller` *bytes32* - address of the caller on the destination domain who will trigger the mint

??? function "**replaceDepositForBurn**(_bytes calldata originalMessage, bytes calldata originalAttestation, bytes32 newDestinationCaller, bytes32 newMintRecipient_) — Replaces a previous burn message to modify the mint recipient and/or destination caller. Allows the original message's sender to update the details without requiring a new deposit."

    === "Parameters"

        - `originalMessage` *bytes* - the original burn message to be replaced
        - `originalAttestation` *bytes* - the attestation of the original message
        - `newDestinationCaller` *bytes32* - the new caller on the destination domain, can be the same or updated
        - `newMintRecipient` *bytes32* - the new recipient for the minted tokens, can be the same or updated

### Events

The key events of the `TokenMessenger` contract are as follows:

??? event "**DepositForBurn**(_uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller_) — Emitted when a `DepositForBurn` message is sent."

    === "Parameters"

        - `nonce` *uint64* - the unique nonce reserved for this message
        - `burnToken` *address* - the address of the token being burned on the source domain
        - `amount` *uint256* - the amount of tokens being deposited for burning
        - `depositor` *address* - the address from which the tokens are being transferred and burned
        - `mintRecipient` *bytes32* - the recipient's address on the destination domain who will receive the minted tokens
        - `destinationDomain` *uint32* - the target domain where the tokens will be minted
        - `destinationTokenMessenger` *bytes32* - the address of the `TokenMessenger` on the destination domain
        - `destinationCaller` *bytes32* - the authorized caller on the destination domain to trigger `receiveMessage()`. If `0x0`, any address can trigger it

??? event "**MintAndWithdraw**(_address indexed mintRecipient, uint256 amount, address indexed mintToken_) — Emitted when tokens are minted and withdrawn."

    === "Parameters"

        - `mintRecipient` *address* - the address receiving the minted tokens
        - `amount` *uint256* - the amount of tokens that were minted
        - `mintToken` *address* - the contract address of the minted token

## MessageTransmitter Contract

The `MessageTransmitter` contract ensure the secure sending and receiving of messages across different blockchain domains. It manages message dispatch, incrementing a unique nonce for each message, and emitting events like `MessageSent` and `MessageReceived` to track communication. It ensures proper message format validation, attestation signatures, and nonce usage to prevent replay attacks. The contract supports flexible message delivery options, allowing for a specific `destinationCaller` or a general broadcast, and uses domain-specific configurations to handle communication. It also offers functionality to replace previously sent messages, set maximum message body sizes, and verify that messages can only be received once per nonce to maintain integrity across chains.

??? code "View the complete MessageTransmitter Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/MessageTransmitter.sol'
    ```

### Methods

The permissionless messaging functions exposed by the `MessageTransmitter` contract are as follows:

??? function "**receiveMessage**(_bytes calldata message, bytes calldata attestation_) — Processes and validates an incoming message and its attestation. If valid, it triggers further action based on the message body."

    === "Parameters"

        - `message` *bytes* - the message to be processed, including details such as sender, recipient, and message body
        - `attestation` *bytes* - concatenated 65-byte signature(s) that attest to the validity of the `message`

??? function "**sendMessage**(_uint32 destinationDomain, bytes32 recipient, bytes calldata messageBody_) — Sends a message to a recipient on the specified destination domain. The message is broadcasted with a unique nonce."

    === "Parameters"

        - `destinationDomain` *uint32* - the target blockchain network where the message is to be sent
        - `recipient` *bytes32* - the recipient's address on the destination domain
        - `messageBody` *bytes* - the raw content of the message to be sent

??? function "**sendMessageWithCaller**(_uint32 destinationDomain, bytes32 recipient, bytes32 destinationCaller, bytes calldata messageBody_) — Sends a message to a recipient on the specified destination domain, with a specific caller required to trigger the message on the destination chain."

    === "Parameters"

        - `destinationDomain` *uint32* - the target blockchain network where the message is to be sent
        - `recipient` *bytes32* - the recipient's address on the destination domain
        - `destinationCaller` *bytes32* - the caller on the destination domain who is authorized to trigger the message
        - `messageBody` *bytes* - the raw content of the message to be sent

??? function "**replaceMessage**(_bytes calldata originalMessage, bytes calldata originalAttestation, bytes calldata newMessageBody, bytes32 newDestinationCaller_) — Replaces an original message with a new message body and/or updates the destination caller, keeping the same nonce."

    === "Parameters"

        - `originalMessage` *bytes* - the original message to be replaced
        - `originalAttestation` *bytes* - attestation verifying the original message
        - `newMessageBody` *bytes* - the new content for the replaced message
        - `newDestinationCaller` *bytes32* - the new caller on the destination domain, which can be the same or different from the original caller

### Events

The critical events of the `MessageTransmitter` contract are as follows:

??? event "**MessageSent**(_bytes message_) — Emitted when a new message is dispatched."

    === "Parameters"

        - `message` *bytes* - the raw bytes of the dispatched message

??? event "**MessageReceived**(_address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody_) — Emitted when a new message is successfully received on the destination domain."

    === "Parameters"

        - `caller` *address* - the address (msg.sender) that called the receive function on the destination domain
        - `sourceDomain` *uint32* - the blockchain network where the message originated
        - `nonce` *uint64* - a unique identifier for the message, used to prevent message replay
        - `sender` *bytes32* - the address of the sender from the source domain
        - `messageBody` *bytes* - the body of the received message in raw bytes


## TokenMinter Contract

The `TokenMinter` contract manages the minting and burning of tokens across different blockchain domains. It maintains a registry that links local tokens to their corresponding remote tokens, ensuring that tokens maintain a 1:1 exchange rate across domains. The contract only allows a designated `TokenMessenger` to call mint and burn functions, ensuring security and consistency in cross-chain operations. When tokens are burned on a remote domain, the corresponding token amount is minted on the local domain for a specified recipient, and vice versa. The contract includes mechanisms to pause operations, set burn limits, and update the `TokenController`, which governs token minting permissions. Additionally, it provides functionality to add or remove the local `TokenMessenger` and retrieve the local token address associated with a remote token.

??? code "View the complete TokenMinter Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/TokenMinter.sol'
    ```

### Methods

Most of the methods of the `TokenMinter` contract can be called only by the registered `TokenMessenger`. However, there is one publicly accessible method, a public view function that allows anyone to query the local token associated with a remote domain and token.

??? function "**getLocalToken**(_uint32 remoteDomain, bytes32 remoteToken_) — Returns the local token address associated with a given remote domain and token."

    === "Parameters"

        - `remoteDomain` *uint32* - the remote blockchain domain where the token resides
        - `remoteToken` *bytes32* - the address of the token on the remote domain
