---
title: Interacting with CCTP Contracts
description: Learn how to interact directly with Circle's CCTP Bridge contracts, including TokenMessenger, TokenMinter, and MessageTransmitter. 
categories: Transfer
---

# Interact with CCTP Contracts

Circle's [Cross-Chain Transfer Protocol (CCTP)](/docs/products/cctp-bridge/overview/){target=\_blank} is a permissionless utility that facilitates secure and efficient USDC transfers across blockchain networks through native burning and minting mechanisms.

As decentralized finance (DeFi) protocols evolve, the need for flexible, secure cross-chain messaging has expanded, requiring solutions beyond simple asset transfers. Wormhole enhances CCTP's capabilities by allowing developers to compose more complex cross-chain interactions. With Wormhole's generic messaging, applications can execute smart contract logic alongside native USDC transfers, enabling richer, more versatile cross-chain experiences.

This guide will walk you through getting started with Wormhole's CCTP contracts and show you how to integrate CCTP into your smart contracts, enabling the composition of advanced cross-chain functions with native USDC transfers.

## Prerequisites

To interact with the Wormhole CCTP, you'll need the following:

- [The address of the CCTP contract](/docs/products/reference/contract-addresses/#cctp){target=\_blank} on the chains you're deploying your contract on
- [The Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're deploying your contract on

## Wormhole's CCTP Integration Contract

Wormhole's Circle Integration contract, `CircleIntegration.sol`, is the contract you'll interact with directly. It burns and mints Circle-supported tokens by using [Circle's CCTP contracts](#circles-cctp-contracts).

The Circle Integration contract emits Wormhole messages with arbitrary payloads to allow additional composability when performing cross-chain transfers of Circle-supported assets.

This contract can be found in [Wormhole's `wormhole-circle-integration` repository](https://github.com/wormhole-foundation/wormhole-circle-integration/){target=\_blank} on GitHub.

!!! note
    Wormhole supports all CCTP-supported chains, but Circle currently supports only a [handful of chains](https://developers.circle.com/stablecoins/docs/supported-domains){target=\_blank}. Please refer to the [CCTP section of the Contract Addresses](/docs/products/reference/contract-addresses/#cctp){target=\_blank} reference page to view the complete list of supported chains.

??? code "Circle Integration contract"
    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/CircleIntegration.sol'
    ```

The functions provided by the Circle Integration contract are as follows:

- **`transferTokensWithPayload`** - calls the Circle Bridge contract to burn Circle-supported tokens. It emits a Wormhole message containing a user-specified payload with instructions for what to do with the Circle-supported assets once they have been minted on the target chain

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

- `redeemTokensWithPayload` - verifies the Wormhole message from the source chain and verifies that the passed Circle Bridge message is valid. It calls the Circle Bridge contract by passing the Circle message and attestation to the `receiveMessage` function, which is responsible for minting tokens to the specified mint recipient. It also verifies that the caller is the specified mint recipient to ensure atomic execution of the additional instructions in the Wormhole message

    ??? interface "Parameters"

        `params` ++"RedeemParameters"++

        A tuple containing the parameters for the redemption.

        ??? child "`RedeemParameters` struct"

            `encodedWormholeMessage` ++"bytes"++

            Wormhole message emitted by a registered contract including information regarding the token burn on the source chain and an arbitrary message.

            ---

            `circleBridgeMessage` ++"bytes"++

            Message emitted by Circle Bridge contract with information regarding the token burn on the source chain.

            ---

            `circleAttestation` ++"bytes"++

            Serialized EC signature attesting the cross-chain transfer.

    ??? interface "Returns"

        `depositInfo` ++"DepositWithPayload"++

        Information about the deposit.

        ??? child "`DepositWithPayload` struct"

            `token` ++"bytes32"++

            Address (`bytes32` left-zero-padded) of token to be minted.

            ---

            `amount` ++"uint256"++

            Amount of tokens to be minted.
            
            ---

            `sourceDomain` ++"uint32"++

            Circle domain for the source chain.

            ---

            `targetDomain` ++"uint32"++

            Circle domain for the target chain.

            ---

            `nonce` ++"uint64"++

            Circle sequence number for the transfer.

            ---

            `fromAddress` ++"bytes32"++

            Source Circle Integration contract caller's address.

            ---

            `mintRecipient` ++"bytes32"++

            Recipient of minted tokens (must be caller of this contract).

            ---

            `payload` ++"bytes"++

            Arbitrary Wormhole message payload.

    ??? interface "Emits"

        `Redeemed` - event emitted when Circle-supported assets have been minted to the `mintRecipient`

        ??? child "Event arguments"

            `emitterChainId` ++"uint16"++

            Wormhole chain ID of emitter contract on source chain.

            ---

            `emitterAddress` ++"bytes32"++

            Address (`bytes32` zero-left-padded) of emitter on source chain.

            ---

            `sequence` ++"uint64"++

            Sequence of Wormhole message used to mint tokens.

## Circle's CCTP Contracts

Three key contracts power Circle's CCTP:

- **`TokenMessenger`** - the entry point for cross-chain USDC transfers, routing messages to initiate USDC burns on the source chain, and mint USDC on the destination chain
- **`MessageTransmitter`** - handles generic message passing, sending messages from the source chain and receiving them on the destination chain
- **`TokenMinter`** - responsible for the actual minting and burning of USDC, utilizing chain-specific settings for both the burners and minters across different networks

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

- **`depositForBurn`** - deposits and burns tokens from the sender to be minted on the destination domain. Minted tokens will be transferred to `mintRecipient`

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

- **`depositForBurnWithCaller`** - deposits and burns tokens from the sender to be minted on the destination domain. This method differs from `depositForBurn` in that the mint on the destination domain can only be called by the designated `destinationCaller` address

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

- **`replaceDepositForBurn`** — replaces a previous `BurnMessage` to modify the mint recipient and/or the destination caller. The replacement message reuses the `_nonce` created by the original message, which allows the original message's sender to update the details without requiring a new deposit

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

- **`handleReceiveMessage`** - handles an incoming message received by the local `MessageTransmitter` and takes the appropriate action. For a burn message, it mints the associated token to the requested recipient on the local domain.

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

- **`receiveMessage`** — processes and validates an incoming message and its attestation. If valid, it triggers further action based on the message body

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

- **`sendMessage`** — sends a message to the destination domain and recipient. It increments the `nonce`, assigns a unique `nonce` to the message, and emits a `MessageSent` event

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

- **`sendMessageWithCaller`** —  sends a message to the destination domain and recipient, requiring a specific caller to trigger the message on the target chain. It increments the `nonce`, assigns a unique `nonce` to the message, and emits a `MessageSent` event

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

- **`replaceMessage`** — replaces an original message with a new message body and/or updates the destination caller. The replacement message reuses the `_nonce` created by the original message

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

- **`getLocalToken`** — a read-only function that returns the local token address associated with a given remote domain and token

    ??? interface "Parameters"

        `remoteDomain` ++"uint32"++
        
        The remote blockchain domain where the token resides.

        ---

        `remoteToken` ++"bytes32"++
        
        The address of the token on the remote domain.

    ??? interface "Returns"

        ++"address"++
        
        The local token address.

## How to Interact with CCTP Contracts

Before writing your own contracts, it's essential to understand the key functions and events of the Wormhole CCTP contracts. The primary functionality revolves around the following:

- **Sending tokens with a message payload** - initiating a cross-chain transfer of Circle-supported assets along with a message payload to a specific target address on the target chain
- **Receiving tokens with a message payload** - validating messages received from other chains via Wormhole and then minting the tokens for the recipient

### Sending Tokens and Messages

To initiate a cross-chain transfer, you must call the `transferTokensWithPayload` method of Wormhole's Circle Integration (CCTP) contract. Once you have initiated a transfer, you must fetch the attested Wormhole message and parse the transaction logs to locate a transfer message emitted by the Circle Bridge contract. Then, a request must be sent to Circle's off-chain process with the transfer message to grab the attestation from the process's response, which validates the token mint on the target chain.

To streamline this process, you can use the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/main){target=\_blank}, which exposes the `WormholeRelayerSDK.sol` contract, including the `CCTPSender` abstract contract. By inheriting this contract, you can transfer USDC while automatically relaying the message payload to the destination chain via a Wormhole-deployed relayer.

??? code "CCTP Sender contract"

    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/CCTPSender.sol'
    ```

The `CCTPSender` abstract contract exposes the `sendUSDCWithPayloadToEvm` function. This function publishes a CCTP transfer of the provided `amount` of USDC and requests that the transfer be delivered along with a `payload` to the specified `targetAddress` on the `targetChain`.

```solidity
--8<-- 'code/products/cctp-bridge/guides/cctp-contracts/sendUSDCWithPayloadToEvm.sol'
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    The target chain for the transfer.

    ---

    `targetAddress` ++"address"++

    The target address for the transfer.

    ---

    `payload` ++"bytes"++

    Arbitrary payload to be delivered to the target chain via Wormhole.

    ---

    `gasLimit` ++"uint256"++

    The gas limit with which to call `targetAddress`.

    ---

    `amount` ++"uint256"++

    The amount of USDC to transfer.

    ---

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published VAA containing the delivery instructions.

When the `sendUSDCWithPayloadToEvm` function is called, the following series of actions are executed:

1. **USDC transfer initiation**:

    - The Circle Token Messenger contract is approved to spend the specified amount of USDC.
    - The `depositForBurnWithCaller` function of the Token Messenger contract is invoked
    - A key is returned, which is to be provided to the Wormhole relayer for message delivery

2. **Message encoding** - the message `payload` is encoded for transmission via the Wormhole relayer. The encoded value also includes the `amount` so that it can be checked on the target chain
3. **Retrieving delivery provider** - the current default delivery provider's address is retrieved
4. **Cost calculation** - the transfer cost is calculated using the Wormhole relayer's `quoteEVMDeliveryPrice` function
5. **Message dispatch**:

    - The `sendToEvm` function of the Wormhole relayer is called with the encoded payload, the delivery provider's address, and the arguments passed to `sendUSDCWithPayloadToEvm`
    - The function must be called with `msg.value` set to the previously calculated cost (from step 4)
    - This function publishes an instruction for the delivery provider to relay the payload and VAAs specified by the key (from step 1) to the target address on the target chain

A simple example implementation is as follows:

```solidity
--8<-- 'code/products/cctp-bridge/guides/cctp-contracts/sendCrossChainDeposit.sol'
```

The above example sends a specified amount of USDC and the recipient's address as a payload to a target contract on another chain, ensuring that the correct cost is provided for the cross-chain transfer.

### Receiving Tokens and Messages

To complete the cross-chain transfer, you must invoke the `redeemTokensWithPayload` function on the target Wormhole Circle Integration contract. This function verifies the message's authenticity, decodes the payload, confirms the recipient and sender, checks message delivery, and then calls the `receiveMessage` function of the [Message Transmitter](#message-transmitter-contract) contract.

Using the Wormhole-deployed relayer automatically triggers the `receiveWormholeMessages` function. This function is defined in the `WormholeRelayerSDK.sol` contract from the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/main){target=\_blank} and is implemented within the `CCTPReceiver` abstract contract.

??? code "CCTP Receiver contract"

    ```solidity
    --8<-- 'code/products/cctp-bridge/guides/cctp-contracts/CCTPReceiver.sol'
    ```

Although you do not need to interact with the `receiveWormholeMessages` function directly, it's important to understand what it does. This function processes cross-chain messages and USDC transfers via Wormhole's Circle (CCTP) Bridge. Here's a summary of what it does:

1. **Validate additional messages** - the function checks that there is at most one CCTP transfer message in the `additionalMessages` array, as it currently only supports processing a single CCTP transfer
2. **Redeem USDC**:
    - If there is a CCTP message, it calls the `redeemUSDC` function of the `CCTPReceiver` contract to decode and redeem the USDC
    - This results in the call of the `receiveMessage` function of Circle's Message Transmitter contract to redeem the USDC based on the provided message and signature
    - The amount of USDC received is calculated by subtracting the contract's previous balance from the current balance after redeeming the USDC
3. **Decode payload** - the incoming payload is decoded, extracting both the expected amount of USDC and a `userPayload` (which could be any additional data)
4. **Verify the amount** - it ensures that the amount of USDC received matches the amount encoded in the payload. If the amounts don't match, the transaction is reverted
5. **Handle the payload and USDC** - after verifying the amounts, `receivePayloadAndUSDC` is called, which is meant to handle the actual logic for processing the received payload and USDC transfer

You'll need to implement the `receivePayloadAndUSDC` function to transfer the USDC and handle the payload as your application needs. A simple example implementation is as follows:

```solidity
--8<-- 'code/products/cctp-bridge/guides/cctp-contracts/receivePayloadAndUSDC.sol'
```

## Complete Example

To view a complete example of creating a contract that integrates with Wormhole's CCTP contracts to send and receive USDC cross-chain, check out the [Hello USDC](https://github.com/wormhole-foundation/hello-usdc){target=\_blank} repository on GitHub.

