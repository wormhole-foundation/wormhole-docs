---
title: Interacting with CCTP Contracts
description: Learn how to interact directly with Circle's CCTP Bridge contracts, including TokenMessenger, TokenMinter, and MessageTransmitter. 
categories: Transfer, CCTP
---

# Interact with CCTP Contracts

Circle's [Cross-Chain Transfer Protocol (CCTP)](/docs/products/cctp-bridge/overview/){target=\_blank} is a permissionless utility that facilitates secure and efficient USDC transfers across blockchain networks through native burning and minting mechanisms.

As decentralized finance (DeFi) protocols evolve, the need for flexible, secure cross-chain messaging has expanded, requiring solutions beyond simple asset transfers. Wormhole enhances CCTP's capabilities by allowing developers to compose more complex cross-chain interactions. With Wormhole's generic messaging, applications can execute smart contract logic alongside native USDC transfers, enabling richer, more versatile cross-chain experiences.

This guide explains how Wormhole integrates with Circle’s CCTP contracts through the Circle Integration contract, and how to initiate CCTP transfers that are completed via the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}.

## Prerequisites

To interact with the Wormhole CCTP, you'll need the following:

- [The address of the CCTP contract](/docs/products/reference/contract-addresses/#cctp){target=\_blank} on the chains you're deploying your contract on.
- [The Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're deploying your contract on.

## Wormhole's CCTP Integration Contract

Wormhole's Circle Integration contract, `CircleIntegration.sol`, is the contract that applications interact with on the source chain. It initiates CCTP burns via [Circle's CCTP contracts](#circles-cctp-contracts) and emits Wormhole messages to coordinate completion on the destination chain.

This contract can be found in [Wormhole's `wormhole-circle-integration` repository](https://github.com/wormhole-foundation/wormhole-circle-integration/){target=\_blank} on GitHub.

!!! note
    Wormhole supports all CCTP-supported chains, but Circle currently supports only a [handful of chains](https://developers.circle.com/cctp/cctp-supported-blockchains#cctp-domains){target=\_blank}. Please refer to the [CCTP section of the Contract Addresses](/docs/products/reference/contract-addresses/#cctp){target=\_blank} reference page to view the complete list of supported chains.

??? code "Circle Integration contract"
    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/CircleIntegration.sol'
    ```

The Circle Integration contract is used for source-chain initiation. Calling `transferTokensWithPayload` initiates a CCTP transfer by burning USDC on the source chain and emitting a Wormhole message with an application-defined payload. When used with the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank}, this Wormhole message serves as the input for the off-chain execution flow. Attestation retrieval, redemption, and destination execution are handled by a relay provider after an execution request is submitted.

??? interface "Parameters"

    `transferParams` ++"TransferParameters"++

    A tuple containing the parameters for the transfer.

    ??? child "`TransferParameters` struct"

        `token` ++"address"++

        Address of the token to be burned.

        ---

        `amount` ++"uint256"++

        Amount of the token to be burned.

        ---

        `targetChain` ++"uint16"++

        Wormhole chain ID of the target blockchain.

        ---

        `mintRecipient` ++"bytes32"++

        The recipient wallet or contract address on the target chain.

    ---

    `batchId` ++"uint32"++

    The ID for Wormhole message batching.

    ---

    `payload` ++"bytes"++

    Arbitrary payload to be delivered to the target chain via Wormhole.

??? interface "Returns"

    `messageSequence` ++"uint64"++

    Wormhole sequence number for this contract.

## Circle's CCTP Contracts

Three key contracts power Circle's CCTP:

- **`TokenMessenger`**: The entry point for cross-chain USDC transfers, routing messages to initiate USDC burns on the source chain, and mint USDC on the destination chain.
- **`MessageTransmitter`**: Handles generic message passing, sending messages from the source chain and receiving them on the destination chain.
- **`TokenMinter`**: Responsible for the actual minting and burning of USDC, utilizing chain-specific settings for both the burners and minters across different networks.

The following sections will examine these contracts in-depth, focusing on the methods invoked indirectly through function calls in the Wormhole Circle Integration contract.

!!! note
    When using Wormhole's CCTP integration, you will not directly interact with these contracts. You will indirectly interact with them through the Wormhole Circle Integration contract.

These contracts can be found in [Circle's `evm-cctp-contracts` repository](https://github.com/circlefin/evm-cctp-contracts/){target=\_blank} on GitHub.

### Token Messenger Contract

The Token Messenger contract enables cross-chain USDC transfers by coordinating message exchanges between blockchains. It works alongside the Message Transmitter contract to relay messages for burning USDC on a source chain and minting it on a destination chain. The contract emits events to track both the burning of tokens and their subsequent minting on the destination chain.

To ensure secure communication, the Token Messenger restricts message handling to registered remote Token Messenger contracts only. It verifies the proper conditions for token burning and manages local and remote minters using chain-specific settings.

Additionally, the contract provides methods for updating or replacing previously sent burn messages, adding or removing remote Token Messenger contracts, and managing the minting process for cross-chain transfers.

??? code "Token Messenger contract"
    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/TokenMessenger.sol'
    ```

    This contract and the interfaces, contracts, and libraries it relies on are stored in [Circle's `evm-cctp-contracts` repository](https://github.com/circlefin/evm-cctp-contracts/blob/master/src/TokenMessenger.sol){target=\_blank} on GitHub.

The functions provided by the Token Messenger contract are as follows:

- **`depositForBurn`**: Deposits and burns tokens from the sender to be minted on the destination domain. Minted tokens will be transferred to `mintRecipient`.

    ??? interface "Parameters"

        `amount` ++"uint256"++
        
        The amount of tokens to burn.

        ---

        `destinationDomain` ++"uint32"++
        
        The network where the token will be minted after burn.

        ---

        `mintRecipient` ++"bytes32"++
        
        Address of mint recipient on destination domain.

        ---

        `burnToken` ++"address"++
        
        Address of contract to burn deposited tokens, on local domain.

    ??? interface "Returns"

        `_nonce` ++"uint64"++
        
        Unique nonce reserved by message.

    ??? interface "Emits"

        `DepositForBurn` - event emitted when `depositForBurn` is called. The `destinationCaller` is set to `bytes32(0)` to allow any address to call `receiveMessage` on the destination domain

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/DepositForBurn-event.md'

- **`depositForBurnWithCaller`**: Deposits and burns tokens from the sender to be minted on the destination domain. This method differs from `depositForBurn` in that the mint on the destination domain can only be called by the designated `destinationCaller` address.

    ??? interface "Parameters"

        `amount` ++"uint256"++
        
        The amount of tokens to burn.

        ---

        `destinationDomain` ++"uint32"++
        
        The network where the token will be minted after burn.

        ---

        `mintRecipient` ++"bytes32"++
        
        Address of mint recipient on destination domain.

        ---

        `burnToken` ++"address"++
        
        Address of contract to burn deposited tokens, on local domain.

        ---

        `destinationCaller` ++"bytes32"++
        
        Address of the caller on the destination domain who will trigger the mint.

    ??? interface "Returns"

        `_nonce` ++"uint64"++
        
        Unique nonce reserved by message.

    ??? interface "Emits"

        `DepositForBurn` - event emitted when `depositForBurnWithCaller` is called

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/DepositForBurn-event.md'

- **`replaceDepositForBurn`**: Replaces a previous `BurnMessage` to modify the mint recipient and/or the destination caller. The replacement message reuses the `_nonce` created by the original message, which allows the original message's sender to update the details without requiring a new deposit.

    ??? interface "Parameters"

        `originalMessage` ++"bytes"++
        
        The original burn message to be replaced.

        ---

        `originalAttestation` ++"bytes"++
        
        The attestation of the original message.

        ---

        `newDestinationCaller` ++"bytes32"++
        
        The new caller on the destination domain, can be the same or updated.

        ---

        `newMintRecipient` ++"bytes32"++
        
        The new recipient for the minted tokens, can be the same or updated.

    ??? interface "Returns"

        None.

    ??? interface "Emits"

        `DepositForBurn` - event emitted when `replaceDepositForBurn` is called. Note that the `destinationCaller` will reflect the new destination caller, which may be the same as the original destination caller, a new destination caller, or an empty destination caller (`bytes32(0)`), indicating that any destination caller is valid

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/DepositForBurn-event.md'

- **`handleReceiveMessage`**: Handles an incoming message received by the local `MessageTransmitter` and takes the appropriate action. For a burn message, it mints the associated token to the requested recipient on the local domain.

    ???+ note

        Though this function can only be called by the local `MessageTransmitter`, it is included here as it emits the essential event for minting tokens and withdrawing to send to the recipient.

    ??? interface "Parameters"

        `remoteDomain` ++"uint32"++
        
        The domain where the message originated.

        ---

        `sender` ++"bytes32"++
        
        The address of the sender of the message.

        ---

        `messageBody` ++"bytes"++
        
        The bytes making up the body of the message.

    ??? interface "Returns"

        `success` ++"boolean"++
        
        Returns `true` if successful, otherwise, it returns `false`.

    ??? interface "Emits"

        `MintAndWithdraw` - event emitted when tokens are minted

        ??? child "Event arguments"

            `localMinter` ++"address"++
            
            Minter responsible for minting and burning tokens on the local domain.

            ---

            `remoteDomain` ++"uint32"++
            
            The domain where the message originated from.

            ---

            `burnToken` ++"address"++
            
            Address of contract to burn deposited tokens, on local domain.

            ---

            `mintRecipient` ++"address"++
            
            Recipient address of minted tokens (indexed).

            ---

            `amount` ++"uint256"++
            
            Amount of minted tokens.

### Message Transmitter Contract

The Message Transmitter contract ensures secure messaging across blockchain domains by managing message dispatch and tracking communication with events like `MessageSent` and `MessageReceived`. It uses a unique nonce for each message, which ensures proper validation, verifies attestation signatures, and prevents replay attacks.

The contract supports flexible delivery options, allowing messages to be sent to a specific `destinationCaller` or broadcast more generally. It also includes domain-specific configurations to manage communication between chains.

Additional features include replacing previously sent messages, setting maximum message body sizes, and verifying that messages are received only once per nonce to maintain network integrity.

??? code "Message Transmitter contract"
    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/MessageTransmitter.sol'
    ```

    This contract and the interfaces, contracts, and libraries it relies on are stored in [Circle's `evm-cctp-contracts` repository](https://github.com/circlefin/evm-cctp-contracts/blob/master/src/MessageTransmitter.sol){target=\_blank} on GitHub.

The functions provided by the Message Transmitter contract are as follows:

- **`receiveMessage`**: Processes and validates an incoming message and its attestation. If valid, it triggers further action based on the message body.

    ??? interface "Parameters"

        `message` ++"bytes"++
        
        The message to be processed, including details such as sender, recipient, and message body.

        --- 

        `attestation` ++"bytes"++
        
        Concatenated 65-byte signature(s) that attest to the validity of the `message`.

    ??? interface "Returns"

        `success` ++"boolean"++
        
        Returns `true` if successful, otherwise, returns `false`.

    ??? interface "Emits"

        `MessageReceived` - event emitted when a new message is received

        ??? child "Event arguments"

            `caller` ++"address"++
            
            Caller on destination domain.

            ---

            `sourceDomain` ++"uint32"++
            
            The source domain this message originated from.

            ---

            `nonce` ++"uint64"++
            
            Nonce unique to this message (indexed).

            ---

            `sender` ++"bytes32"++
            
            Sender of this message.

            ---

            `messageBody` ++"bytes"++
            
            The body of the message.

- **`sendMessage`**: Sends a message to the destination domain and recipient. It increments the `nonce`, assigns a unique `nonce` to the message, and emits a `MessageSent` event.

    ??? interface "Parameters"

        `destinationDomain` ++"uint32"++
        
        The target blockchain network where the message is to be sent.

        ---

        `recipient` ++"bytes32"++
        
        The recipient's address on the destination domain.

        ---

        `messageBody` ++"bytes"++
        
        The raw bytes content of the message.

    ??? interface "Returns"

        `nonce` ++"uint64"++
        
        Nonce unique to this message.

    ??? interface "Emits"

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/MessageSent-event.md'

- **`sendMessageWithCaller`**: Sends a message to the destination domain and recipient, requiring a specific caller to trigger the message on the target chain. It increments the `nonce`, assigns a unique `nonce` to the message, and emits a `MessageSent` event.

    ??? interface "Parameters"

        `destinationDomain` ++"uint32"++
        
        The target blockchain network where the message is to be sent.

        ---

        `recipient` ++"bytes32"++
        
        The recipient's address on the destination domain.

        ---

        `destinationCaller` ++"bytes32"++ 
        
        The caller on the destination domain.

        ---

        `messageBody` ++"bytes"++
        
        The raw bytes content of the message.

    ??? interface "Returns"

        `nonce` ++"uint64"++
        
        Nonce unique to this message.

    ??? interface "Emits"

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/MessageSent-event.md'

- **`replaceMessage`**: Replaces an original message with a new message body and/or updates the destination caller. The replacement message reuses the `_nonce` created by the original message.

    ??? interface "Parameters"

        `originalMessage` ++"bytes"++
        
        The original message to be replaced.

        ---

        `originalAttestation` ++"bytes"++
        
        Attestation verifying the original message.

        ---

        `newMessageBody` ++"bytes"++
        
        The new content for the replaced message.

        ---

        `newDestinationCaller` ++"bytes32"++
        
        The new destination caller, which may be the same as the original destination caller, a new destination caller, or an empty destination caller (`bytes32(0)`), indicating that any destination caller is valid.

    ??? interface "Returns"

        None.

    ??? interface "Emits"

        --8<-- 'text/products/cctp-bridge/guides/cctp-contracts/MessageSent-event.md'

### Token Minter Contract

The Token Minter contract manages the minting and burning of tokens across different blockchain domains. It maintains a registry that links local tokens to their corresponding remote tokens, ensuring that tokens maintain a 1:1 exchange rate across domains.

The contract restricts minting and burning functions to a designated Token Messenger, which ensures secure and reliable cross-chain operations. When tokens are burned on a remote domain, an equivalent amount is minted on the local domain for a specified recipient, and vice versa.

To enhance control and flexibility, the contract includes mechanisms to pause operations, set burn limits, and update the Token Controller, which governs token minting permissions. Additionally, it provides functionality to add or remove the local Token Messenger and retrieve the local token address associated with a remote token.

??? code "Token Minter contract"
    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/TokenMinter.sol'
    ```

    This contract and the interfaces and contracts it relies on are stored in [Circle's `evm-cctp-contracts` repository](https://github.com/circlefin/evm-cctp-contracts/blob/master/src/TokenMinter.sol){target=\_blank} on GitHub.

Most of the methods of the Token Minter contract can be called only by the registered Token Messenger. However, there is one publicly accessible method, a public view function that allows anyone to query the local token associated with a remote domain and token.

- **`getLocalToken`**: A read-only function that returns the local token address associated with a given remote domain and token.

    ??? interface "Parameters"

        `remoteDomain` ++"uint32"++
        
        The remote blockchain domain where the token resides.

        ---

        `remoteToken` ++"bytes32"++
        
        The address of the token on the remote domain.

    ??? interface "Returns"

        ++"address"++
        
        The local token address.

## CCTP Transfers with Executor

This section describes how the Circle Integration contract is used in practice when executing CCTP transfers through the Executor.

To initiate a cross-chain USDC transfer using Wormhole’s CCTP integration, applications interact directly with the Circle Integration contract on the source chain. 

The primary entry point is `CircleIntegration.transferTokensWithPayload`. This function burns USDC on the source chain using Circle’s CCTP contracts and emits a Wormhole message containing an application-defined payload. This message serves as the input for Executor-based completion of the transfer.

Under the Executor framework, on-chain contracts are only responsible for initiating the transfer. A relay provider completes the transfer by retrieving the Circle attestation and submitting the destination transactions required to redeem USDC and execute any payload-defined logic.

### On-Chain Transfer Initiation

When initiating a transfer, a source-chain contract typically performs the following steps:

- Approves the Circle Integration contract to spend USDC
- Calls `transferTokensWithPayload`, specifying:
    - The USDC amount to burn.
    - The target Wormhole chain ID.
    - The mint recipient on the destination chain.
    - An application-defined payload.

??? code "transferTokensWithPayload"

    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/CircleIntegration.sol:39:99'
    ```

Calling `transferTokensWithPayload` performs the following on-chain actions:

- USDC is burned on the source chain via Circle’s Token Messenger and Token Minter contracts
- A Wormhole message is emitted by the Circle Integration contract, encoding:
    - Transfer metadata.
    - The application payload.

The function returns a Wormhole sequence number that uniquely identifies the transfer.

### Execution and Delivery via Executor

Once the transfer is initiated on-chain, completion is handled through the Executor:

1. An off-chain client observes the emitted Wormhole message and requests execution through the CCTP Executor route (via the TypeScript SDK).
2. A relay provider:
    - Retrieves the Circle message and attestation.
    - Submits the redemption transaction on the destination chain.
    - Invokes any destination logic associated with the payload.

This flow applies to both CCTP v1 and CCTP v2. The version used depends on the source and destination chain configurations and the selected executor route, but the on-chain initiation via `transferTokensWithPayload` remains the same.

From the perspective of a smart contract integrating with CCTP, initiating the transfer is sufficient. The Executor framework and relay providers handle the remaining steps.

## Next Steps

Now that you've learned how to interact directly with Circle's CCTP Bridge contracts, you're ready to explore more advanced features and expand your integration.

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **CCTP Executor Guide**

    ---

    A walkthrough for executing CCTP transfers using the Executor, covering quoting, execution, and status tracking.

    [:custom-arrow: Read the guide](/docs/protocol/infrastructure-guides/cctp-executor/){target=\_blank}

-   :octicons-repo-16:{ .lg .middle } **Demo CCTP Transfer Repository**

    ---

    A demo showcasing CCTP transfers using the Executor, intended as a practical reference for local testing and experimentation.

    [:custom-arrow: View the repository](https://github.com/wormhole-foundation/demo-cctp-transfer){target=\_blank}

-   :octicons-repo-16:{ .lg .middle } **Hello USDC (Legacy Example)**

    ---

    A legacy, contract-based example demonstrating how to integrate with Wormhole’s CCTP contracts.

    [:custom-arrow: Explore on GitHub](https://github.com/wormhole-foundation/hello-usdc){target=\_blank}

</div>