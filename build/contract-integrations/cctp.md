---
title: Interacting with CCTP Contracts
description: Learn how to interact directly with Circle's CCTP Bridge contracts, including TokenMessenger, TokenMinter, and MessageTransmitter. 
---

# Interacting with CCTP Bridge Contracts

Cross-Chain Transfer Protocol (CCTP) is a permissionless utility created by Circle to enable secure, efficient transfers of USDC across blockchain networks through native burning and minting, allowing developers to build multi-chain applications that simplify cross-chain transactions and improve liquidity without trust dependencies. For a full introduction to Circle's CCTP, please see the [CCTP guide in the learn section](/learn/messaging/cctp).

## CCTP Core Contracts Overview

Three core contracts make up CCTP:

- **`TokenMessenger`** - The entry point for cross-chain USDC transfers. Routes messages to initiate USDC burns on the source chain and mint USDC on the destination chain
- **`MessageTransmitter`** - Handles generic message passing. Sends messages from the source chain and receives them on the destination chain 
- **`TokenMinter`** - Responsible for the actual minting and burning of USDC. Utilizes chain-specific settings for both the burners and minters across different networks 

This guide will take a closer look at these contracts, paying careful attention to the methods that can be called, their respective parameters, and important events emitted  the contracts.

## TokenMessenger Contract

The `TokenMessenger` contract facilitates cross-chain USDC transfers by sending and receiving messages between blockchains. It works with the `MessageTransmitter` to relay messages for burning USDC on a source chain and minting it on a destination chain. It emits events to track deposits for burning and the subsequent minting of tokens on the destination chain. The contract ensures that only registered remote `TokenMessenger` contracts can handle messages, verifies proper conditions for burning tokens, and uses chain-specific settings to manage local and remote minters. Additionally, it provides methods for replacing or updating previously sent burn messages, adding or removing remote `TokenMessengers`, and managing the minting process for cross-chain transfers.

??? code "View the complete TokenMessenger Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/TokenMessenger.sol'
    ```

### Methods and Events

The permissionless messaging functions, and their related events, exposed by the `TokenMessenger` are as follows:

- **`depositForBurn`** - Deposits and burns tokens from sender to be minted on destination domain. Minted tokens will be transferred to `mintRecipient`

    ??? interface "Parameters"

        `amount` ++"uint256"++ The amount of tokens to burn

        ---

        `destinationDomain` ++"uint32"++ The network where the token will be minted after burn

        ---

        `mintRecipient` ++"bytes32"++ Address of mint recipient on destination domain

        ---

        `burnToken` ++"address"++ Address of contract to burn deposited tokens, on local domain

    ??? interface "Returns"

        `_nonce` ++"uint64"++ unique nonce reserved by message

    ??? interface "Emits"

        `DepositForBurn` ++"event"++

        ??? child "Event Arguments"
        
            `nonce` ++"uint64"++ - unique nonce reserved by message (indexed)

            ---

            `burnToken` ++"address"++ - address of token burnt on source domain

            ---
                
            `amount` ++"uint256"++ - deposit amount

            ---

            `depositor` ++"address"++ - address where deposit is transferred from

            ---

            `mintRecipient` ++""++ - address receiving minted tokens on destination domain as ++"bytes32"++

            ---

            `destinationDomain` ++"uint32"++ - destination domain
                
            ---

            `destinationTokenMessenger` ++"bytes32"++ - address of `TokenMessenger` on destination domain as ++"bytes32"++
            
            ---
                
            `bytes32(0)` - placeholder for `destinationCaller` to allow any address to call `receiveMessage` on the destination domain

- **`depositForBurnWithCaller`** - Deposits and burns tokens from sender to be minted on destination domain. This method differs from `depositForBurn` in that the mint on the destination domain can only be called by the designated `destinationCaller` address 

    ??? interface "Parameters"

        `amount` ++"uint256"++ - the amount of tokens to burn

        ---

        `destinationDomain` ++"uint32"++ - the network where the token will be minted after burn

        ---

        `mintRecipient` ++"bytes32"++ - address of mint recipient on destination domain

        ---

        `burnToken` ++"address"++ - address of contract to burn deposited tokens, on local domain

        ---

        `destinationCaller` ++"bytes32"++ - address of the caller on the destination domain who will trigger the mint

    ??? interface "Returns"

        `_nonce` ++"uint64"++ unique nonce reserved by message

    ??? interface "Emits"

        `_depositForBurn` ++"event"++

        ??? child "Event Arguments"
        
            `nonce` ++"uint64"++ - unique nonce reserved by message (indexed)

            ---

            `burnToken` ++"address"++ - address of token burnt on source domain

            ---
                
            `amount` ++"uint256"++ - deposit amount

            ---

            `depositor` ++"address"++ - address where deposit is transferred from

            ---

            `mintRecipient` ++"bytes32"++ - address receiving minted tokens on destination domain

            ---

            `destinationDomain` ++"uint32"++ - destination domain 
                
            ---

            `destinationTokenMessenger` ++"bytes32"++ - address of `TokenMessenger` on destination domain as ++"bytes32"++
            
            ---
                
            `destinationCaller` ++"bytes32"++ - authorized caller of `receiveMessage` on destination domain


- **`replaceDepositForBurn`** — Replaces a previous `BurnMessage` to modify the mint recipient and/or destination caller. Allows the original message's sender to update the details without requiring a new deposit

    ??? interface "Parameters"

        `originalMessage` ++"bytes"++ - the original burn message to be replaced

        ---

        `originalAttestation` ++"bytes"++ - the attestation of the original message

        ---

        `newDestinationCaller` ++"bytes32"++ - the new caller on the destination domain, can be the same or updated

        ---

        `newMintRecipient` ++"bytes32"++ - the new recipient for the minted tokens, can be the same or updated

    ??? interface "Returns"

        Nothing. The replacement message reuses the `_nonce` created by the original message

    ??? interface "Emits"

        `DepositForBurn` ++"event"++

        ??? child "Event Arguments"

            `nonce` ++"uint64"++ - the nonce from the original message is used

            ---

            `burnToken` ++"address"++ - address of token burnt on source domain

            ---
                
            `amount` ++"uint256"++ - deposit amount

            ---

            `msg.sender` ++"address"++ - the `msg.sender` of the replaced message must be the same as the `msg.sender` of the original message

            ---

            `newMintRecipient` ++"bytes32"++ - the new mint recipient, which may be the same as the original mint recipient, or different

            ---

            `destinationDomain` ++"uint32"++ - the orginal message destination domain 
                
            ---

            `recipient` ++"bytes32"++ - the recipient from the original message

            `destinationTokenMessenger` ++"bytes32"++ - address of `TokenMessenger` on destination domain as ++"bytes32"++
            
            ---
                
            `newDestinationCaller` ++"bytes32"++ - the new destination caller, which may be the same as the original destination caller, a new destination caller, or an empty destination caller (`bytes32(0)`), indicating that any destination caller is valid



- **`handleReceiveMessage`** - Handles an incoming message received by the local `MessageTransmitter` and takes the appropriate action. For a burn message, mints the associated token to the requested recipient on the local domain. 

    ???+ note 

        Though this function can only be called by the local `MessageTransmitter`, it is included here as it emits the essential event for minting tokens and withdrawing to send to the recipient

    ??? interface "Parameters"

        `remoteDomain` ++"uint32"++ - the domain where the message originated

        ---

        `sender` ++"bytes32"++ - the address of the sender of the message

        ---

        `messageBody` ++"bytes"++ - the bytes making up the body of the message


    ??? interface "Returns"

        `true` ++"boolean"++ - returns `true` if successful


    ??? interface "Emits"

        `MintAndWithdraw` ++"event"++ including `_localMinter` address, `remoteDomain`, `_burnToken`, and 

        ??? child "Event Arguments"

            `localMinter` ++"address"++ - minter responsible for minting and burning tokens on the local domain

            ---

            `remoteDomain` ++"uint32"++ - the domain where the message originated from

            ---

            `burnToken` ++"address"++ address of contract to burn deposited tokens, on local domain

            ---

            `mintRecipient` ++"address"++ - recipient address of minted tokens (indexed)

            ---

            `amount` ++"uint256"++ - amount of minted tokens


## MessageTransmitter Contract

The `MessageTransmitter` contract ensure the secure sending and receiving of messages across different blockchain domains. It manages message dispatch, incrementing a unique nonce for each message, and emitting events like `MessageSent` and `MessageReceived` to track communication. It ensures proper message format validation, attestation signatures, and nonce usage to prevent replay attacks. The contract supports flexible message delivery options, allowing for a specific `destinationCaller` or a general broadcast, and uses domain-specific configurations to handle communication. It also offers functionality to replace previously sent messages, set maximum message body sizes, and verify that messages can only be received once per nonce to maintain integrity across chains.

??? code "View the complete MessageTransmitter Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/MessageTransmitter.sol'
    ```

### Methods and Events

The permissionless messaging functions, and their related events, exposed by the `MessageTransmitter` contract are as follows:

- **`receiveMessage`** — Processes and validates an incoming message and its attestation. If valid, it triggers further action based on the message body

    ??? interface "Parameters"

        `message` ++"bytes"++ - the message to be processed, including details such as sender, recipient, and message body

        --- 

        `attestation` ++"bytes"++ - concatenated 65-byte signature(s) that attest to the validity of the `message`

    ??? interface "Returns"

        `true` ++"boolean"++ - returns true if successful


    ??? interface "Emits"

        `MessageReceived` ++"event"++

        ??? child "Event Arguments"

            `caller` ++"address"++ - caller on destination domain

            ---

            `sourceDomain` ++"uint32"++ - the source domain this message originated from

            ---

            `nonce` ++"uint64"++ - nonce unique to this message (indexed)

            ---

            `sender` ++"bytes32"++ - sender of this message

            ---

            `messageBody` ++"bytes"++ - the body of the message in bytes

- **`sendMessage`** — Increments the `nonce`, assigns unique `nonce` to message, and emits `MessageSent` event to send message to the destination domain and recipient

    ??? interface "Parameters"

        `destinationDomain` ++"uint32"++ - the target blockchain network where the message is to be sent

        ---

        `recipient` ++"bytes32"++ - the recipient's address on the destination domain

        ---

        `messageBody` ++"bytes"++ - the raw bytes content of the message

    ??? interface "Returns"

        `nonce` ++"uint64"++ - nonce unique to this message

    ??? interface "Emits"

        `MessageSent` ++"event"++

        ??? child "Event Arguments"

            `message` ++"bytes"++ - raw bytes of message

- **`sendMessageWithCaller`** — Increments the `nonce`, assigns unique `nonce` to message, and emits `MessageSent` event to send message to the destination domain and recipient. Requires a specific caller to trigger the message on the destination chain

    ??? interface "Parameters"

        `destinationDomain` ++"uint32"++ - the target blockchain network where the message is to be sent

        ---

        `recipient` ++"bytes32"++ - the recipient's address on the destination domain

        ---

        `destinationCaller` ++"bytes32"++ - caller on the destination domain

        ---

        `messageBody` ++"bytes"++ - the raw bytes content of the message

    ??? interface "Returns"

        `nonce` ++"uint64"++ - nonce unique to this message

    ??? interface "Emits"

        `MessageSent` ++"event"++

        ??? child "Event Arguments"

            `message` ++"bytes"++ - raw bytes of message

- **`replaceMessage`** — Replaces an original message with a new message body and/or updates the destination caller, keeping the same nonce

    ??? interface "Parameters"

        `originalMessage` ++"bytes"++ - the original message to be replaced

        ---

        `originalAttestation` ++"bytes"++ - attestation verifying the original message

        ---

        `newMessageBody` ++"bytes"++ - the new content for the replaced message

        ---

        `newDestinationCaller` ++"bytes32"++ - the new destination caller, which may be the same as the original destination caller, a new destination caller, or an empty destination caller (`bytes32(0)`), indicating that any destination caller is valid

    ??? interface "Returns"

        Nothing. The replacement message reuses the `_nonce` created by the original message

    ??? interface "Emits"

        `MessageSent` ++"event"++

        ??? child "Event Arguments"

            `message` ++"bytes"++ - raw bytes of message

## TokenMinter Contract

The `TokenMinter` contract manages the minting and burning of tokens across different blockchain domains. It maintains a registry that links local tokens to their corresponding remote tokens, ensuring that tokens maintain a 1:1 exchange rate across domains. The contract only allows a designated `TokenMessenger` to call mint and burn functions, ensuring security and consistency in cross-chain operations. When tokens are burned on a remote domain, the corresponding token amount is minted on the local domain for a specified recipient, and vice versa. The contract includes mechanisms to pause operations, set burn limits, and update the `TokenController`, which governs token minting permissions. Additionally, it provides functionality to add or remove the local `TokenMessenger` and retrieve the local token address associated with a remote token.

??? code "View the complete TokenMinter Contract"
    ```solidity
    --8<-- 'code/build/contract-integrations/cctp/TokenMinter.sol'
    ```

### Methods

Most of the methods of the `TokenMinter` contract can be called only by the registered `TokenMessenger`. However, there is one publicly accessible method, a public view function that allows anyone to query the local token associated with a remote domain and token.

- **`getLocalToken`** — Returns the local token address associated with a given remote domain and token

    ??? interface "Parameters"

        `remoteDomain` ++"uint32"++ - the remote blockchain domain where the token resides

        ---

        `remoteToken` ++"bytes32"++ - the address of the token on the remote domain

    ??? interface "Returns"

        ++"address"++ - local token address
