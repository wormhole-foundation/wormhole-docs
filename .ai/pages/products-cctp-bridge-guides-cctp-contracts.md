---
title: Interacting with CCTP Contracts
description: Learn how to interact directly with Circle's CCTP Bridge contracts, including TokenMessenger, TokenMinter, and MessageTransmitter.
categories: Transfer, CCTP
url: https://wormhole.com/docs/products/cctp-bridge/guides/cctp-contracts/
---

# Interact with CCTP Contracts

Circle's [Cross-Chain Transfer Protocol (CCTP)](/docs/products/cctp-bridge/overview/){target=\_blank} is a permissionless utility that facilitates secure and efficient USDC transfers across blockchain networks through native burning and minting mechanisms.

As decentralized finance (DeFi) protocols evolve, the need for flexible, secure cross-chain messaging has expanded, requiring solutions beyond simple asset transfers. Wormhole enhances CCTP's capabilities by allowing developers to compose more complex cross-chain interactions. With Wormhole's generic messaging, applications can execute smart contract logic alongside native USDC transfers, enabling richer, more versatile cross-chain experiences.

This guide will walk you through getting started with Wormhole's CCTP contracts and show you how to integrate CCTP into your smart contracts, enabling the composition of advanced cross-chain functions with native USDC transfers.

## Prerequisites

To interact with the Wormhole CCTP, you'll need the following:

- [The address of the CCTP contract](/docs/products/reference/contract-addresses/#cctp){target=\_blank} on the chains you're deploying your contract on.
- [The Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're deploying your contract on.

## Wormhole's CCTP Integration Contract

Wormhole's Circle Integration contract, `CircleIntegration.sol`, is the contract you'll interact with directly. It burns and mints Circle-supported tokens by using [Circle's CCTP contracts](#circles-cctp-contracts).

The Circle Integration contract emits Wormhole messages with arbitrary payloads to allow additional composability when performing cross-chain transfers of Circle-supported assets.

This contract can be found in [Wormhole's `wormhole-circle-integration` repository](https://github.com/wormhole-foundation/wormhole-circle-integration/){target=\_blank} on GitHub.

!!! note
    Wormhole supports all CCTP-supported chains, but Circle currently supports only a [handful of chains](https://developers.circle.com/cctp/cctp-supported-blockchains#cctp-domains){target=\_blank}. Please refer to the [CCTP section of the Contract Addresses](/docs/products/reference/contract-addresses/#cctp){target=\_blank} reference page to view the complete list of supported chains.

??? code "Circle Integration contract"
    ```solidity
    // SPDX-License-Identifier: Apache 2
    pragma solidity ^0.8.19;

    import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
    import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
    import {IWormhole} from "wormhole/interfaces/IWormhole.sol";
    import {BytesLib} from "wormhole/libraries/external/BytesLib.sol";

    import {ICircleBridge} from "../interfaces/circle/ICircleBridge.sol";

    import {CircleIntegrationGovernance} from "./CircleIntegrationGovernance.sol";
    import {CircleIntegrationMessages} from "./CircleIntegrationMessages.sol";

    /**
     * @notice This contract burns and mints Circle-supported tokens by using Circle's Cross-Chain Transfer Protocol. It also emits
     * Wormhole messages with arbitrary payloads to allow for additional composability when performing cross-chain
     * transfers of Circle-suppored assets.
     */
    contract CircleIntegration is
        CircleIntegrationMessages,
        CircleIntegrationGovernance,
        ReentrancyGuard
    {
        using BytesLib for bytes;

        /**
         * @notice Emitted when Circle-supported assets have been minted to the mintRecipient
         * @param emitterChainId Wormhole chain ID of emitter contract on source chain
         * @param emitterAddress Address (bytes32 zero-left-padded) of emitter on source chain
         * @param sequence Sequence of Wormhole message used to mint tokens
         */
        event Redeemed(
            uint16 indexed emitterChainId,
            bytes32 indexed emitterAddress,
            uint64 indexed sequence
        );

        /**
         * @notice `transferTokensWithPayload` calls the Circle Bridge contract to burn Circle-supported tokens. It emits
         * a Wormhole message containing a user-specified payload with instructions for what to do with
         * the Circle-supported assets once they have been minted on the target chain.
         * @dev reverts if:
         * - user passes insufficient value to pay Wormhole message fee
         * - `token` is not supported by Circle Bridge
         * - `amount` is zero
         * - `targetChain` is not supported
         * - `mintRecipient` is bytes32(0)
         * @param transferParams Struct containing the following attributes:
         * - `token` Address of the token to be burned
         * - `amount` Amount of `token` to be burned
         * - `targetChain` Wormhole chain ID of the target blockchain
         * - `mintRecipient` The recipient wallet or contract address on the target chain
         * @param batchId ID for Wormhole message batching
         * @param payload Arbitrary payload to be delivered to the target chain via Wormhole
         * @return messageSequence Wormhole sequence number for this contract
         */
        function transferTokensWithPayload(
            TransferParameters memory transferParams,
            uint32 batchId,
            bytes memory payload
        ) public payable nonReentrant returns (uint64 messageSequence) {
            // cache wormhole instance and fees to save on gas
            IWormhole wormhole = wormhole();
            uint256 wormholeFee = wormhole.messageFee();

            // confirm that the caller has sent enough ether to pay for the wormhole message fee
            require(msg.value == wormholeFee, "insufficient value");

            // Call the circle bridge and `depositForBurnWithCaller`. The `mintRecipient`
            // should be the target contract (or wallet) composing on this contract.
            (uint64 nonce, uint256 amountReceived) = _transferTokens{value: wormholeFee}(
                transferParams.token,
                transferParams.amount,
                transferParams.targetChain,
                transferParams.mintRecipient
            );

            // encode DepositWithPayload message
            bytes memory encodedMessage = encodeDepositWithPayload(
                DepositWithPayload({
                    token: addressToBytes32(transferParams.token),
                    amount: amountReceived,
                    sourceDomain: localDomain(),
                    targetDomain: getDomainFromChainId(transferParams.targetChain),
                    nonce: nonce,
                    fromAddress: addressToBytes32(msg.sender),
                    mintRecipient: transferParams.mintRecipient,
                    payload: payload
                })
            );

            // send the DepositWithPayload wormhole message
            messageSequence = wormhole.publishMessage{value: wormholeFee}(
                batchId,
                encodedMessage,
                wormholeFinality()
            );
        }

        function _transferTokens(
            address token,
            uint256 amount,
            uint16 targetChain,
            bytes32 mintRecipient
        ) internal returns (uint64 nonce, uint256 amountReceived) {
            // sanity check user input
            require(amount > 0, "amount must be > 0");
            require(mintRecipient != bytes32(0), "invalid mint recipient");
            require(isAcceptedToken(token), "token not accepted");
            require(
                getRegisteredEmitter(targetChain) != bytes32(0),
                "target contract not registered"
            );

            // take custody of tokens
            amountReceived = custodyTokens(token, amount);

            // cache Circle Bridge instance
            ICircleBridge circleBridge = circleBridge();

            // approve the Circle Bridge to spend tokens
            SafeERC20.safeApprove(
                IERC20(token),
                address(circleBridge),
                amountReceived
            );

            // burn tokens on the bridge
            nonce = circleBridge.depositForBurnWithCaller(
                amountReceived,
                getDomainFromChainId(targetChain),
                mintRecipient,
                token,
                getRegisteredEmitter(targetChain)
            );
        }

        function custodyTokens(
            address token,
            uint256 amount
        ) internal returns (uint256) {
            // query own token balance before transfer
            (, bytes memory queriedBalanceBefore) = token.staticcall(
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(this))
            );
            uint256 balanceBefore = abi.decode(queriedBalanceBefore, (uint256));

            // deposit tokens
            SafeERC20.safeTransferFrom(
                IERC20(token),
                msg.sender,
                address(this),
                amount
            );

            // query own token balance after transfer
            (, bytes memory queriedBalanceAfter) = token.staticcall(
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(this))
            );
            uint256 balanceAfter = abi.decode(queriedBalanceAfter, (uint256));

            return balanceAfter - balanceBefore;
        }

        /**
         * @notice `redeemTokensWithPayload` verifies the Wormhole message from the source chain and
         * verifies that the passed Circle Bridge message is valid. It calls the Circle Bridge
         * contract by passing the Circle message and attestation to mint tokens to the specified
         * mint recipient. It also verifies that the caller is the specified mint recipient to ensure
         * atomic execution of the additional instructions in the Wormhole message.
         * @dev reverts if:
         * - Wormhole message is not properly attested
         * - Wormhole message was not emitted from a registered contrat
         * - Wormhole message was already consumed by this contract
         * - msg.sender is not the encoded mintRecipient
         * - Circle Bridge message and Wormhole message are not associated
         * - `receiveMessage` call to Circle Transmitter fails
         * @param params Struct containing the following attributes:
         * - `encodedWormholeMessage` Wormhole message emitted by a registered contract including
         * information regarding the token burn on the source chain and an arbitrary message.
         * - `circleBridgeMessage` Message emitted by Circle Bridge contract with information regarding
         * the token burn on the source chain.
         * - `circleAttestation` Serialized EC Signature attesting the cross-chain transfer
         * @return depositInfo Struct containing the following attributes:
         * - `token` Address (bytes32 left-zero-padded) of token to be minted
         * - `amount` Amount of tokens to be minted
         * - `sourceDomain` Circle domain for the source chain
         * - `targetDomain` Circle domain for the target chain
         * - `nonce` Circle sequence number for the transfer
         * - `fromAddress` Source CircleIntegration contract caller's address
         * - `mintRecipient` Recipient of minted tokens (must be caller of this contract)
         * - `payload` Arbitrary Wormhole message payload
         */
        function redeemTokensWithPayload(
            RedeemParameters calldata params
        ) public returns (DepositWithPayload memory depositInfo) {
            // verify the wormhole message
            IWormhole.VM memory verifiedMessage = verifyWormholeRedeemMessage(
                params.encodedWormholeMessage
            );

            // Decode the message payload into the DepositWithPayload struct. Call the Circle TokenMinter
            // contract to determine the address of the encoded token on this chain.
            depositInfo = decodeDepositWithPayload(verifiedMessage.payload);
            depositInfo.token = fetchLocalTokenAddress(
                depositInfo.sourceDomain,
                depositInfo.token
            );

            // confirm that circle gave us a valid token address
            require(depositInfo.token != bytes32(0), "invalid local token address");

            // confirm that the caller is the `mintRecipient` to ensure atomic execution
            require(
                addressToBytes32(msg.sender) == depositInfo.mintRecipient,
                "caller must be mintRecipient"
            );

            // confirm that the caller passed the correct message pair
            require(
                verifyCircleMessage(
                    params.circleBridgeMessage,
                    depositInfo.sourceDomain,
                    depositInfo.targetDomain,
                    depositInfo.nonce
                ),
                "invalid message pair"
            );

            // call the circle bridge to mint tokens to the recipient
            bool success = circleTransmitter().receiveMessage(
                params.circleBridgeMessage,
                params.circleAttestation
            );
            require(success, "CIRCLE_INTEGRATION: failed to mint tokens");

            // emit Redeemed event
            emit Redeemed(
                verifiedMessage.emitterChainId,
                verifiedMessage.emitterAddress,
                verifiedMessage.sequence
            );
        }

        function verifyWormholeRedeemMessage(
            bytes memory encodedMessage
        ) internal returns (IWormhole.VM memory) {
            require(evmChain() == block.chainid, "invalid evm chain");

            // parse and verify the Wormhole core message
            (
                IWormhole.VM memory verifiedMessage,
                bool valid,
                string memory reason
            ) = wormhole().parseAndVerifyVM(encodedMessage);

            // confirm that the core layer verified the message
            require(valid, reason);

            // verify that this message was emitted by a trusted contract
            require(verifyEmitter(verifiedMessage), "unknown emitter");

            // revert if this message has been consumed already
            require(
                !isMessageConsumed(verifiedMessage.hash),
                "message already consumed"
            );
            consumeMessage(verifiedMessage.hash);

            return verifiedMessage;
        }

        function verifyEmitter(
            IWormhole.VM memory vm
        ) internal view returns (bool) {
            // verify that the sender of the wormhole message is a trusted
            return (getRegisteredEmitter(vm.emitterChainId) == vm.emitterAddress &&
                vm.emitterAddress != bytes32(0));
        }

        function verifyCircleMessage(
            bytes memory circleMessage,
            uint32 sourceDomain,
            uint32 targetDomain,
            uint64 nonce
        ) internal pure returns (bool) {
            // parse the circle bridge message inline
            uint32 circleSourceDomain = circleMessage.toUint32(4);
            uint32 circleTargetDomain = circleMessage.toUint32(8);
            uint64 circleNonce = circleMessage.toUint64(12);

            // confirm that both the Wormhole message and Circle message share the same transfer info
            return (sourceDomain == circleSourceDomain &&
                targetDomain == circleTargetDomain &&
                nonce == circleNonce);
        }

        /**
         * @notice Fetches the local token address given an address and domain from
         * a different chain.
         * @param sourceDomain Circle domain for the sending chain.
         * @param sourceToken Address of the token for the sending chain.
         * @return Address bytes32 formatted address of the `sourceToken` on this chain.
         */
        function fetchLocalTokenAddress(
            uint32 sourceDomain,
            bytes32 sourceToken
        ) public view returns (bytes32) {
            return
                addressToBytes32(
                    circleTokenMinter().remoteTokensToLocalTokens(
                        keccak256(abi.encodePacked(sourceDomain, sourceToken))
                    )
                );
        }

        /**
         * @notice Converts type address to bytes32 (left-zero-padded)
         * @param address_ Address to convert to bytes32
         * @return Address bytes32
         */
        function addressToBytes32(address address_) public pure returns (bytes32) {
            return bytes32(uint256(uint160(address_)));
        }
    }

    ```

The functions provided by the Circle Integration contract are as follows:

- **`transferTokensWithPayload`**: Calls the Circle Bridge contract to burn Circle-supported tokens. It emits a Wormhole message containing a user-specified payload with instructions for what to do with the Circle-supported assets once they have been minted on the target chain.

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

- **`redeemTokensWithPayload`**: Verifies the Wormhole message from the source chain and verifies that the passed Circle Bridge message is valid. It calls the Circle Bridge contract by passing the Circle message and attestation to the `receiveMessage` function, which is responsible for minting tokens to the specified mint recipient. It also verifies that the caller is the specified mint recipient to ensure atomic execution of the additional instructions in the Wormhole message.

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

        **`Redeemed`**: Event emitted when Circle-supported assets have been minted to the `mintRecipient`.

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
    /*
     * Copyright (c) 2022, Circle Internet Financial Limited.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    pragma solidity 0.7.6;

    import "./interfaces/IMessageHandler.sol";
    import "./interfaces/ITokenMinter.sol";
    import "./interfaces/IMintBurnToken.sol";
    import "./interfaces/IMessageTransmitter.sol";
    import "./messages/BurnMessage.sol";
    import "./messages/Message.sol";
    import "./roles/Rescuable.sol";

    /**
     * @title TokenMessenger
     * @notice Sends messages and receives messages to/from MessageTransmitters
     * and to/from TokenMinters
     */
    contract TokenMessenger is IMessageHandler, Rescuable {
        // ============ Events ============
        /**
         * @notice Emitted when a DepositForBurn message is sent
         * @param nonce unique nonce reserved by message
         * @param burnToken address of token burnt on source domain
         * @param amount deposit amount
         * @param depositor address where deposit is transferred from
         * @param mintRecipient address receiving minted tokens on destination domain as bytes32
         * @param destinationDomain destination domain
         * @param destinationTokenMessenger address of TokenMessenger on destination domain as bytes32
         * @param destinationCaller authorized caller as bytes32 of receiveMessage() on destination domain, if not equal to bytes32(0).
         * If equal to bytes32(0), any address can call receiveMessage().
         */
        event DepositForBurn(
            uint64 indexed nonce,
            address indexed burnToken,
            uint256 amount,
            address indexed depositor,
            bytes32 mintRecipient,
            uint32 destinationDomain,
            bytes32 destinationTokenMessenger,
            bytes32 destinationCaller
        );

        /**
         * @notice Emitted when tokens are minted
         * @param mintRecipient recipient address of minted tokens
         * @param amount amount of minted tokens
         * @param mintToken contract address of minted token
         */
        event MintAndWithdraw(
            address indexed mintRecipient,
            uint256 amount,
            address indexed mintToken
        );

        /**
         * @notice Emitted when a remote TokenMessenger is added
         * @param domain remote domain
         * @param tokenMessenger TokenMessenger on remote domain
         */
        event RemoteTokenMessengerAdded(uint32 domain, bytes32 tokenMessenger);

        /**
         * @notice Emitted when a remote TokenMessenger is removed
         * @param domain remote domain
         * @param tokenMessenger TokenMessenger on remote domain
         */
        event RemoteTokenMessengerRemoved(uint32 domain, bytes32 tokenMessenger);

        /**
         * @notice Emitted when the local minter is added
         * @param localMinter address of local minter
         * @notice Emitted when the local minter is added
         */
        event LocalMinterAdded(address localMinter);

        /**
         * @notice Emitted when the local minter is removed
         * @param localMinter address of local minter
         * @notice Emitted when the local minter is removed
         */
        event LocalMinterRemoved(address localMinter);

        // ============ Libraries ============
        using TypedMemView for bytes;
        using TypedMemView for bytes29;
        using BurnMessage for bytes29;
        using Message for bytes29;

        // ============ State Variables ============
        // Local Message Transmitter responsible for sending and receiving messages to/from remote domains
        IMessageTransmitter public immutable localMessageTransmitter;

        // Version of message body format
        uint32 public immutable messageBodyVersion;

        // Minter responsible for minting and burning tokens on the local domain
        ITokenMinter public localMinter;

        // Valid TokenMessengers on remote domains
        mapping(uint32 => bytes32) public remoteTokenMessengers;

        // ============ Modifiers ============
        /**
         * @notice Only accept messages from a registered TokenMessenger contract on given remote domain
         * @param domain The remote domain
         * @param tokenMessenger The address of the TokenMessenger contract for the given remote domain
         */
        modifier onlyRemoteTokenMessenger(uint32 domain, bytes32 tokenMessenger) {
            require(
                _isRemoteTokenMessenger(domain, tokenMessenger),
                "Remote TokenMessenger unsupported"
            );
            _;
        }

        /**
         * @notice Only accept messages from the registered message transmitter on local domain
         */
        modifier onlyLocalMessageTransmitter() {
            // Caller must be the registered message transmitter for this domain
            require(_isLocalMessageTransmitter(), "Invalid message transmitter");
            _;
        }

        // ============ Constructor ============
        /**
         * @param _messageTransmitter Message transmitter address
         * @param _messageBodyVersion Message body version
         */
        constructor(address _messageTransmitter, uint32 _messageBodyVersion) {
            require(
                _messageTransmitter != address(0),
                "MessageTransmitter not set"
            );
            localMessageTransmitter = IMessageTransmitter(_messageTransmitter);
            messageBodyVersion = _messageBodyVersion;
        }

        // ============ External Functions  ============
        /**
         * @notice Deposits and burns tokens from sender to be minted on destination domain.
         * Emits a `DepositForBurn` event.
         * @dev reverts if:
         * - given burnToken is not supported
         * - given destinationDomain has no TokenMessenger registered
         * - transferFrom() reverts. For example, if sender's burnToken balance or approved allowance
         * to this contract is less than `amount`.
         * - burn() reverts. For example, if `amount` is 0.
         * - MessageTransmitter returns false or reverts.
         * @param amount amount of tokens to burn
         * @param destinationDomain destination domain
         * @param mintRecipient address of mint recipient on destination domain
         * @param burnToken address of contract to burn deposited tokens, on local domain
         * @return _nonce unique nonce reserved by message
         */
        function depositForBurn(
            uint256 amount,
            uint32 destinationDomain,
            bytes32 mintRecipient,
            address burnToken
        ) external returns (uint64 _nonce) {
            return
                _depositForBurn(
                    amount,
                    destinationDomain,
                    mintRecipient,
                    burnToken,
                    // (bytes32(0) here indicates that any address can call receiveMessage()
                    // on the destination domain, triggering mint to specified `mintRecipient`)
                    bytes32(0)
                );
        }

        /**
         * @notice Deposits and burns tokens from sender to be minted on destination domain. The mint
         * on the destination domain must be called by `destinationCaller`.
         * WARNING: if the `destinationCaller` does not represent a valid address as bytes32, then it will not be possible
         * to broadcast the message on the destination domain. This is an advanced feature, and the standard
         * depositForBurn() should be preferred for use cases where a specific destination caller is not required.
         * Emits a `DepositForBurn` event.
         * @dev reverts if:
         * - given destinationCaller is zero address
         * - given burnToken is not supported
         * - given destinationDomain has no TokenMessenger registered
         * - transferFrom() reverts. For example, if sender's burnToken balance or approved allowance
         * to this contract is less than `amount`.
         * - burn() reverts. For example, if `amount` is 0.
         * - MessageTransmitter returns false or reverts.
         * @param amount amount of tokens to burn
         * @param destinationDomain destination domain
         * @param mintRecipient address of mint recipient on destination domain
         * @param burnToken address of contract to burn deposited tokens, on local domain
         * @param destinationCaller caller on the destination domain, as bytes32
         * @return nonce unique nonce reserved by message
         */
        function depositForBurnWithCaller(
            uint256 amount,
            uint32 destinationDomain,
            bytes32 mintRecipient,
            address burnToken,
            bytes32 destinationCaller
        ) external returns (uint64 nonce) {
            // Destination caller must be nonzero. To allow any destination caller, use depositForBurn().
            require(destinationCaller != bytes32(0), "Invalid destination caller");

            return
                _depositForBurn(
                    amount,
                    destinationDomain,
                    mintRecipient,
                    burnToken,
                    destinationCaller
                );
        }

        /**
         * @notice Replace a BurnMessage to change the mint recipient and/or
         * destination caller. Allows the sender of a previous BurnMessage
         * (created by depositForBurn or depositForBurnWithCaller)
         * to send a new BurnMessage to replace the original.
         * The new BurnMessage will reuse the amount and burn token of the original,
         * without requiring a new deposit.
         * @dev The new message will reuse the original message's nonce. For a
         * given nonce, all replacement message(s) and the original message are
         * valid to broadcast on the destination domain, until the first message
         * at the nonce confirms, at which point all others are invalidated.
         * Note: The msg.sender of the replaced message must be the same as the
         * msg.sender of the original message.
         * @param originalMessage original message bytes (to replace)
         * @param originalAttestation original attestation bytes
         * @param newDestinationCaller the new destination caller, which may be the
         * same as the original destination caller, a new destination caller, or an empty
         * destination caller (bytes32(0), indicating that any destination caller is valid.)
         * @param newMintRecipient the new mint recipient, which may be the same as the
         * original mint recipient, or different.
         */
        function replaceDepositForBurn(
            bytes calldata originalMessage,
            bytes calldata originalAttestation,
            bytes32 newDestinationCaller,
            bytes32 newMintRecipient
        ) external {
            bytes29 _originalMsg = originalMessage.ref(0);
            _originalMsg._validateMessageFormat();
            bytes29 _originalMsgBody = _originalMsg._messageBody();
            _originalMsgBody._validateBurnMessageFormat();

            bytes32 _originalMsgSender = _originalMsgBody._getMessageSender();
            // _originalMsgSender must match msg.sender of original message
            require(
                msg.sender == Message.bytes32ToAddress(_originalMsgSender),
                "Invalid sender for message"
            );
            require(
                newMintRecipient != bytes32(0),
                "Mint recipient must be nonzero"
            );

            bytes32 _burnToken = _originalMsgBody._getBurnToken();
            uint256 _amount = _originalMsgBody._getAmount();

            bytes memory _newMessageBody = BurnMessage._formatMessage(
                messageBodyVersion,
                _burnToken,
                newMintRecipient,
                _amount,
                _originalMsgSender
            );

            localMessageTransmitter.replaceMessage(
                originalMessage,
                originalAttestation,
                _newMessageBody,
                newDestinationCaller
            );

            emit DepositForBurn(
                _originalMsg._nonce(),
                Message.bytes32ToAddress(_burnToken),
                _amount,
                msg.sender,
                newMintRecipient,
                _originalMsg._destinationDomain(),
                _originalMsg._recipient(),
                newDestinationCaller
            );
        }

        /**
         * @notice Handles an incoming message received by the local MessageTransmitter,
         * and takes the appropriate action. For a burn message, mints the
         * associated token to the requested recipient on the local domain.
         * @dev Validates the local sender is the local MessageTransmitter, and the
         * remote sender is a registered remote TokenMessenger for `remoteDomain`.
         * @param remoteDomain The domain where the message originated from.
         * @param sender The sender of the message (remote TokenMessenger).
         * @param messageBody The message body bytes.
         * @return success Bool, true if successful.
         */
        function handleReceiveMessage(
            uint32 remoteDomain,
            bytes32 sender,
            bytes calldata messageBody
        )
            external
            override
            onlyLocalMessageTransmitter
            onlyRemoteTokenMessenger(remoteDomain, sender)
            returns (bool)
        {
            bytes29 _msg = messageBody.ref(0);
            _msg._validateBurnMessageFormat();
            require(
                _msg._getVersion() == messageBodyVersion,
                "Invalid message body version"
            );

            bytes32 _mintRecipient = _msg._getMintRecipient();
            bytes32 _burnToken = _msg._getBurnToken();
            uint256 _amount = _msg._getAmount();

            ITokenMinter _localMinter = _getLocalMinter();

            _mintAndWithdraw(
                address(_localMinter),
                remoteDomain,
                _burnToken,
                Message.bytes32ToAddress(_mintRecipient),
                _amount
            );

            return true;
        }

        /**
         * @notice Add the TokenMessenger for a remote domain.
         * @dev Reverts if there is already a TokenMessenger set for domain.
         * @param domain Domain of remote TokenMessenger.
         * @param tokenMessenger Address of remote TokenMessenger as bytes32.
         */
        function addRemoteTokenMessenger(uint32 domain, bytes32 tokenMessenger)
            external
            onlyOwner
        {
            require(tokenMessenger != bytes32(0), "bytes32(0) not allowed");

            require(
                remoteTokenMessengers[domain] == bytes32(0),
                "TokenMessenger already set"
            );

            remoteTokenMessengers[domain] = tokenMessenger;
            emit RemoteTokenMessengerAdded(domain, tokenMessenger);
        }

        /**
         * @notice Remove the TokenMessenger for a remote domain.
         * @dev Reverts if there is no TokenMessenger set for `domain`.
         * @param domain Domain of remote TokenMessenger
         */
        function removeRemoteTokenMessenger(uint32 domain) external onlyOwner {
            // No TokenMessenger set for given remote domain.
            require(
                remoteTokenMessengers[domain] != bytes32(0),
                "No TokenMessenger set"
            );

            bytes32 _removedTokenMessenger = remoteTokenMessengers[domain];
            delete remoteTokenMessengers[domain];
            emit RemoteTokenMessengerRemoved(domain, _removedTokenMessenger);
        }

        /**
         * @notice Add minter for the local domain.
         * @dev Reverts if a minter is already set for the local domain.
         * @param newLocalMinter The address of the minter on the local domain.
         */
        function addLocalMinter(address newLocalMinter) external onlyOwner {
            require(newLocalMinter != address(0), "Zero address not allowed");

            require(
                address(localMinter) == address(0),
                "Local minter is already set."
            );

            localMinter = ITokenMinter(newLocalMinter);

            emit LocalMinterAdded(newLocalMinter);
        }

        /**
         * @notice Remove the minter for the local domain.
         * @dev Reverts if the minter of the local domain is not set.
         */
        function removeLocalMinter() external onlyOwner {
            address _localMinterAddress = address(localMinter);
            require(_localMinterAddress != address(0), "No local minter is set.");

            delete localMinter;
            emit LocalMinterRemoved(_localMinterAddress);
        }

        // ============ Internal Utils ============
        /**
         * @notice Deposits and burns tokens from sender to be minted on destination domain.
         * Emits a `DepositForBurn` event.
         * @param _amount amount of tokens to burn (must be non-zero)
         * @param _destinationDomain destination domain
         * @param _mintRecipient address of mint recipient on destination domain
         * @param _burnToken address of contract to burn deposited tokens, on local domain
         * @param _destinationCaller caller on the destination domain, as bytes32
         * @return nonce unique nonce reserved by message
         */
        function _depositForBurn(
            uint256 _amount,
            uint32 _destinationDomain,
            bytes32 _mintRecipient,
            address _burnToken,
            bytes32 _destinationCaller
        ) internal returns (uint64 nonce) {
            require(_amount > 0, "Amount must be nonzero");
            require(_mintRecipient != bytes32(0), "Mint recipient must be nonzero");

            bytes32 _destinationTokenMessenger = _getRemoteTokenMessenger(
                _destinationDomain
            );

            ITokenMinter _localMinter = _getLocalMinter();
            IMintBurnToken _mintBurnToken = IMintBurnToken(_burnToken);
            require(
                _mintBurnToken.transferFrom(
                    msg.sender,
                    address(_localMinter),
                    _amount
                ),
                "Transfer operation failed"
            );
            _localMinter.burn(_burnToken, _amount);

            // Format message body
            bytes memory _burnMessage = BurnMessage._formatMessage(
                messageBodyVersion,
                Message.addressToBytes32(_burnToken),
                _mintRecipient,
                _amount,
                Message.addressToBytes32(msg.sender)
            );

            uint64 _nonceReserved = _sendDepositForBurnMessage(
                _destinationDomain,
                _destinationTokenMessenger,
                _destinationCaller,
                _burnMessage
            );

            emit DepositForBurn(
                _nonceReserved,
                _burnToken,
                _amount,
                msg.sender,
                _mintRecipient,
                _destinationDomain,
                _destinationTokenMessenger,
                _destinationCaller
            );

            return _nonceReserved;
        }

        /**
         * @notice Sends a BurnMessage through the local message transmitter
         * @dev calls local message transmitter's sendMessage() function if `_destinationCaller` == bytes32(0),
         * or else calls sendMessageWithCaller().
         * @param _destinationDomain destination domain
         * @param _destinationTokenMessenger address of registered TokenMessenger contract on destination domain, as bytes32
         * @param _destinationCaller caller on the destination domain, as bytes32. If `_destinationCaller` == bytes32(0),
         * any address can call receiveMessage() on destination domain.
         * @param _burnMessage formatted BurnMessage bytes (message body)
         * @return nonce unique nonce reserved by message
         */
        function _sendDepositForBurnMessage(
            uint32 _destinationDomain,
            bytes32 _destinationTokenMessenger,
            bytes32 _destinationCaller,
            bytes memory _burnMessage
        ) internal returns (uint64 nonce) {
            if (_destinationCaller == bytes32(0)) {
                return
                    localMessageTransmitter.sendMessage(
                        _destinationDomain,
                        _destinationTokenMessenger,
                        _burnMessage
                    );
            } else {
                return
                    localMessageTransmitter.sendMessageWithCaller(
                        _destinationDomain,
                        _destinationTokenMessenger,
                        _destinationCaller,
                        _burnMessage
                    );
            }
        }

        /**
         * @notice Mints tokens to a recipient
         * @param _tokenMinter address of TokenMinter contract
         * @param _remoteDomain domain where burned tokens originate from
         * @param _burnToken address of token burned
         * @param _mintRecipient recipient address of minted tokens
         * @param _amount amount of minted tokens
         */
        function _mintAndWithdraw(
            address _tokenMinter,
            uint32 _remoteDomain,
            bytes32 _burnToken,
            address _mintRecipient,
            uint256 _amount
        ) internal {
            ITokenMinter _minter = ITokenMinter(_tokenMinter);
            address _mintToken = _minter.mint(
                _remoteDomain,
                _burnToken,
                _mintRecipient,
                _amount
            );

            emit MintAndWithdraw(_mintRecipient, _amount, _mintToken);
        }

        /**
         * @notice return the remote TokenMessenger for the given `_domain` if one exists, else revert.
         * @param _domain The domain for which to get the remote TokenMessenger
         * @return _tokenMessenger The address of the TokenMessenger on `_domain` as bytes32
         */
        function _getRemoteTokenMessenger(uint32 _domain)
            internal
            view
            returns (bytes32)
        {
            bytes32 _tokenMessenger = remoteTokenMessengers[_domain];
            require(_tokenMessenger != bytes32(0), "No TokenMessenger for domain");
            return _tokenMessenger;
        }

        /**
         * @notice return the local minter address if it is set, else revert.
         * @return local minter as ITokenMinter.
         */
        function _getLocalMinter() internal view returns (ITokenMinter) {
            require(address(localMinter) != address(0), "Local minter is not set");
            return localMinter;
        }

        /**
         * @notice Return true if the given remote domain and TokenMessenger is registered
         * on this TokenMessenger.
         * @param _domain The remote domain of the message.
         * @param _tokenMessenger The address of the TokenMessenger on remote domain.
         * @return true if a remote TokenMessenger is registered for `_domain` and `_tokenMessenger`,
         * on this TokenMessenger.
         */
        function _isRemoteTokenMessenger(uint32 _domain, bytes32 _tokenMessenger)
            internal
            view
            returns (bool)
        {
            return
                _tokenMessenger != bytes32(0) &&
                remoteTokenMessengers[_domain] == _tokenMessenger;
        }

        /**
         * @notice Returns true if the message sender is the local registered MessageTransmitter
         * @return true if message sender is the registered local message transmitter
         */
        function _isLocalMessageTransmitter() internal view returns (bool) {
            return
                address(localMessageTransmitter) != address(0) &&
                msg.sender == address(localMessageTransmitter);
        }
    }
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

        ??? child "Event Arguments"

            `nonce` ++"uint64"++ 
            
            Unique nonce reserved by message (indexed).

            ---

            `burnToken` ++"address"++ 
            
            Address of token burnt on source domain.

            ---

            `amount` ++"uint256"++
            
            The deposit amount.

            ---

            `depositor` ++"address"++
            
            Address where deposit is transferred from.

            ---

            `mintRecipient` ++"bytes32"++
            
            Address receiving minted tokens on destination domain.

            ---

            `destinationDomain` ++"uint32"++ -
            
            Destination domain.

            ---

            `destinationTokenMessenger` ++"bytes32"++
            
            Address of `TokenMessenger` on destination domain.
            
            ---

            `destinationCaller` ++"bytes32"++
            
            Authorized caller of the `receiveMessage` function on the destination domain, if not equal to `bytes32(0)`. If equal to `bytes32(0)`, any address can call `receiveMessage`.

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

        ??? child "Event Arguments"

            `nonce` ++"uint64"++ 
            
            Unique nonce reserved by message (indexed).

            ---

            `burnToken` ++"address"++ 
            
            Address of token burnt on source domain.

            ---

            `amount` ++"uint256"++
            
            The deposit amount.

            ---

            `depositor` ++"address"++
            
            Address where deposit is transferred from.

            ---

            `mintRecipient` ++"bytes32"++
            
            Address receiving minted tokens on destination domain.

            ---

            `destinationDomain` ++"uint32"++ -
            
            Destination domain.

            ---

            `destinationTokenMessenger` ++"bytes32"++
            
            Address of `TokenMessenger` on destination domain.
            
            ---

            `destinationCaller` ++"bytes32"++
            
            Authorized caller of the `receiveMessage` function on the destination domain, if not equal to `bytes32(0)`. If equal to `bytes32(0)`, any address can call `receiveMessage`.

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

        ??? child "Event Arguments"

            `nonce` ++"uint64"++ 
            
            Unique nonce reserved by message (indexed).

            ---

            `burnToken` ++"address"++ 
            
            Address of token burnt on source domain.

            ---

            `amount` ++"uint256"++
            
            The deposit amount.

            ---

            `depositor` ++"address"++
            
            Address where deposit is transferred from.

            ---

            `mintRecipient` ++"bytes32"++
            
            Address receiving minted tokens on destination domain.

            ---

            `destinationDomain` ++"uint32"++ -
            
            Destination domain.

            ---

            `destinationTokenMessenger` ++"bytes32"++
            
            Address of `TokenMessenger` on destination domain.
            
            ---

            `destinationCaller` ++"bytes32"++
            
            Authorized caller of the `receiveMessage` function on the destination domain, if not equal to `bytes32(0)`. If equal to `bytes32(0)`, any address can call `receiveMessage`.

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
    /*
     * Copyright (c) 2022, Circle Internet Financial Limited.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    pragma solidity 0.7.6;

    import "@memview-sol/contracts/TypedMemView.sol";
    import "./interfaces/IMessageTransmitter.sol";
    import "./interfaces/IMessageHandler.sol";
    import "./messages/Message.sol";
    import "./roles/Pausable.sol";
    import "./roles/Rescuable.sol";
    import "./roles/Attestable.sol";

    /**
     * @title MessageTransmitter
     * @notice Contract responsible for sending and receiving messages across chains.
     */
    contract MessageTransmitter is
        IMessageTransmitter,
        Pausable,
        Rescuable,
        Attestable
    {
        // ============ Events ============
        /**
         * @notice Emitted when a new message is dispatched
         * @param message Raw bytes of message
         */
        event MessageSent(bytes message);

        /**
         * @notice Emitted when a new message is received
         * @param caller Caller (msg.sender) on destination domain
         * @param sourceDomain The source domain this message originated from
         * @param nonce The nonce unique to this message
         * @param sender The sender of this message
         * @param messageBody message body bytes
         */
        event MessageReceived(
            address indexed caller,
            uint32 sourceDomain,
            uint64 indexed nonce,
            bytes32 sender,
            bytes messageBody
        );

        /**
         * @notice Emitted when max message body size is updated
         * @param newMaxMessageBodySize new maximum message body size, in bytes
         */
        event MaxMessageBodySizeUpdated(uint256 newMaxMessageBodySize);

        // ============ Libraries ============
        using TypedMemView for bytes;
        using TypedMemView for bytes29;
        using Message for bytes29;

        // ============ State Variables ============
        // Domain of chain on which the contract is deployed
        uint32 public immutable localDomain;

        // Message Format version
        uint32 public immutable version;

        // Maximum size of message body, in bytes.
        // This value is set by owner.
        uint256 public maxMessageBodySize;

        // Next available nonce from this source domain
        uint64 public nextAvailableNonce;

        // Maps a bytes32 hash of (sourceDomain, nonce) -> uint256 (0 if unused, 1 if used)
        mapping(bytes32 => uint256) public usedNonces;

        // ============ Constructor ============
        constructor(
            uint32 _localDomain,
            address _attester,
            uint32 _maxMessageBodySize,
            uint32 _version
        ) Attestable(_attester) {
            localDomain = _localDomain;
            maxMessageBodySize = _maxMessageBodySize;
            version = _version;
        }

        // ============ External Functions  ============
        /**
         * @notice Send the message to the destination domain and recipient
         * @dev Increment nonce, format the message, and emit `MessageSent` event with message information.
         * @param destinationDomain Domain of destination chain
         * @param recipient Address of message recipient on destination chain as bytes32
         * @param messageBody Raw bytes content of message
         * @return nonce reserved by message
         */
        function sendMessage(
            uint32 destinationDomain,
            bytes32 recipient,
            bytes calldata messageBody
        ) external override whenNotPaused returns (uint64) {
            bytes32 _emptyDestinationCaller = bytes32(0);
            uint64 _nonce = _reserveAndIncrementNonce();
            bytes32 _messageSender = Message.addressToBytes32(msg.sender);

            _sendMessage(
                destinationDomain,
                recipient,
                _emptyDestinationCaller,
                _messageSender,
                _nonce,
                messageBody
            );

            return _nonce;
        }

        /**
         * @notice Replace a message with a new message body and/or destination caller.
         * @dev The `originalAttestation` must be a valid attestation of `originalMessage`.
         * Reverts if msg.sender does not match sender of original message, or if the source domain of the original message
         * does not match this MessageTransmitter's local domain.
         * @param originalMessage original message to replace
         * @param originalAttestation attestation of `originalMessage`
         * @param newMessageBody new message body of replaced message
         * @param newDestinationCaller the new destination caller, which may be the
         * same as the original destination caller, a new destination caller, or an empty
         * destination caller (bytes32(0), indicating that any destination caller is valid.)
         */
        function replaceMessage(
            bytes calldata originalMessage,
            bytes calldata originalAttestation,
            bytes calldata newMessageBody,
            bytes32 newDestinationCaller
        ) external override whenNotPaused {
            // Validate each signature in the attestation
            _verifyAttestationSignatures(originalMessage, originalAttestation);

            bytes29 _originalMsg = originalMessage.ref(0);

            // Validate message format
            _originalMsg._validateMessageFormat();

            // Validate message sender
            bytes32 _sender = _originalMsg._sender();
            require(
                msg.sender == Message.bytes32ToAddress(_sender),
                "Sender not permitted to use nonce"
            );

            // Validate source domain
            uint32 _sourceDomain = _originalMsg._sourceDomain();
            require(
                _sourceDomain == localDomain,
                "Message not originally sent from this domain"
            );

            uint32 _destinationDomain = _originalMsg._destinationDomain();
            bytes32 _recipient = _originalMsg._recipient();
            uint64 _nonce = _originalMsg._nonce();

            _sendMessage(
                _destinationDomain,
                _recipient,
                newDestinationCaller,
                _sender,
                _nonce,
                newMessageBody
            );
        }

        /**
         * @notice Send the message to the destination domain and recipient, for a specified `destinationCaller` on the
         * destination domain.
         * @dev Increment nonce, format the message, and emit `MessageSent` event with message information.
         * WARNING: if the `destinationCaller` does not represent a valid address, then it will not be possible
         * to broadcast the message on the destination domain. This is an advanced feature, and the standard
         * sendMessage() should be preferred for use cases where a specific destination caller is not required.
         * @param destinationDomain Domain of destination chain
         * @param recipient Address of message recipient on destination domain as bytes32
         * @param destinationCaller caller on the destination domain, as bytes32
         * @param messageBody Raw bytes content of message
         * @return nonce reserved by message
         */
        function sendMessageWithCaller(
            uint32 destinationDomain,
            bytes32 recipient,
            bytes32 destinationCaller,
            bytes calldata messageBody
        ) external override whenNotPaused returns (uint64) {
            require(
                destinationCaller != bytes32(0),
                "Destination caller must be nonzero"
            );

            uint64 _nonce = _reserveAndIncrementNonce();
            bytes32 _messageSender = Message.addressToBytes32(msg.sender);

            _sendMessage(
                destinationDomain,
                recipient,
                destinationCaller,
                _messageSender,
                _nonce,
                messageBody
            );

            return _nonce;
        }

        /**
         * @notice Receive a message. Messages with a given nonce
         * can only be broadcast once for a (sourceDomain, destinationDomain)
         * pair. The message body of a valid message is passed to the
         * specified recipient for further processing.
         *
         * @dev Attestation format:
         * A valid attestation is the concatenated 65-byte signature(s) of exactly
         * `thresholdSignature` signatures, in increasing order of attester address.
         * ***If the attester addresses recovered from signatures are not in
         * increasing order, signature verification will fail.***
         * If incorrect number of signatures or duplicate signatures are supplied,
         * signature verification will fail.
         *
         * Message format:
         * Field                 Bytes      Type       Index
         * version               4          uint32     0
         * sourceDomain          4          uint32     4
         * destinationDomain     4          uint32     8
         * nonce                 8          uint64     12
         * sender                32         bytes32    20
         * recipient             32         bytes32    52
         * messageBody           dynamic    bytes      84
         * @param message Message bytes
         * @param attestation Concatenated 65-byte signature(s) of `message`, in increasing order
         * of the attester address recovered from signatures.
         * @return success bool, true if successful
         */
        function receiveMessage(bytes calldata message, bytes calldata attestation)
            external
            override
            whenNotPaused
            returns (bool success)
        {
            // Validate each signature in the attestation
            _verifyAttestationSignatures(message, attestation);

            bytes29 _msg = message.ref(0);

            // Validate message format
            _msg._validateMessageFormat();

            // Validate domain
            require(
                _msg._destinationDomain() == localDomain,
                "Invalid destination domain"
            );

            // Validate destination caller
            if (_msg._destinationCaller() != bytes32(0)) {
                require(
                    _msg._destinationCaller() ==
                        Message.addressToBytes32(msg.sender),
                    "Invalid caller for message"
                );
            }

            // Validate version
            require(_msg._version() == version, "Invalid message version");

            // Validate nonce is available
            uint32 _sourceDomain = _msg._sourceDomain();
            uint64 _nonce = _msg._nonce();
            bytes32 _sourceAndNonce = _hashSourceAndNonce(_sourceDomain, _nonce);
            require(usedNonces[_sourceAndNonce] == 0, "Nonce already used");
            // Mark nonce used
            usedNonces[_sourceAndNonce] = 1;

            // Handle receive message
            bytes32 _sender = _msg._sender();
            bytes memory _messageBody = _msg._messageBody().clone();
            require(
                IMessageHandler(Message.bytes32ToAddress(_msg._recipient()))
                    .handleReceiveMessage(_sourceDomain, _sender, _messageBody),
                "handleReceiveMessage() failed"
            );

            // Emit MessageReceived event
            emit MessageReceived(
                msg.sender,
                _sourceDomain,
                _nonce,
                _sender,
                _messageBody
            );
            return true;
        }

        /**
         * @notice Sets the max message body size
         * @dev This value should not be reduced without good reason,
         * to avoid impacting users who rely on large messages.
         * @param newMaxMessageBodySize new max message body size, in bytes
         */
        function setMaxMessageBodySize(uint256 newMaxMessageBodySize)
            external
            onlyOwner
        {
            maxMessageBodySize = newMaxMessageBodySize;
            emit MaxMessageBodySizeUpdated(maxMessageBodySize);
        }

        // ============ Internal Utils ============
        /**
         * @notice Send the message to the destination domain and recipient. If `_destinationCaller` is not equal to bytes32(0),
         * the message can only be received on the destination chain when called by `_destinationCaller`.
         * @dev Format the message and emit `MessageSent` event with message information.
         * @param _destinationDomain Domain of destination chain
         * @param _recipient Address of message recipient on destination domain as bytes32
         * @param _destinationCaller caller on the destination domain, as bytes32
         * @param _sender message sender, as bytes32
         * @param _nonce nonce reserved for message
         * @param _messageBody Raw bytes content of message
         */
        function _sendMessage(
            uint32 _destinationDomain,
            bytes32 _recipient,
            bytes32 _destinationCaller,
            bytes32 _sender,
            uint64 _nonce,
            bytes calldata _messageBody
        ) internal {
            // Validate message body length
            require(
                _messageBody.length <= maxMessageBodySize,
                "Message body exceeds max size"
            );

            require(_recipient != bytes32(0), "Recipient must be nonzero");

            // serialize message
            bytes memory _message = Message._formatMessage(
                version,
                localDomain,
                _destinationDomain,
                _nonce,
                _sender,
                _recipient,
                _destinationCaller,
                _messageBody
            );

            // Emit MessageSent event
            emit MessageSent(_message);
        }

        /**
         * @notice hashes `_source` and `_nonce`.
         * @param _source Domain of chain where the transfer originated
         * @param _nonce The unique identifier for the message from source to
                  destination
         * @return hash of source and nonce
         */
        function _hashSourceAndNonce(uint32 _source, uint64 _nonce)
            internal
            pure
            returns (bytes32)
        {
            return keccak256(abi.encodePacked(_source, _nonce));
        }

        /**
         * Reserve and increment next available nonce
         * @return nonce reserved
         */
        function _reserveAndIncrementNonce() internal returns (uint64) {
            uint64 _nonceReserved = nextAvailableNonce;
            nextAvailableNonce = nextAvailableNonce + 1;
            return _nonceReserved;
        }
    }
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

        `MessageSent` - event emitted when a new message is dispatched

        ??? child "Event arguments"

            `message` ++"bytes"++
            
            The raw bytes of the message.

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

        `MessageSent` - event emitted when a new message is dispatched

        ??? child "Event arguments"

            `message` ++"bytes"++
            
            The raw bytes of the message.

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

        `MessageSent` - event emitted when a new message is dispatched

        ??? child "Event arguments"

            `message` ++"bytes"++
            
            The raw bytes of the message.

### Token Minter Contract

The Token Minter contract manages the minting and burning of tokens across different blockchain domains. It maintains a registry that links local tokens to their corresponding remote tokens, ensuring that tokens maintain a 1:1 exchange rate across domains.

The contract restricts minting and burning functions to a designated Token Messenger, which ensures secure and reliable cross-chain operations. When tokens are burned on a remote domain, an equivalent amount is minted on the local domain for a specified recipient, and vice versa.

To enhance control and flexibility, the contract includes mechanisms to pause operations, set burn limits, and update the Token Controller, which governs token minting permissions. Additionally, it provides functionality to add or remove the local Token Messenger and retrieve the local token address associated with a remote token.

??? code "Token Minter contract"
    ```solidity
    /*
     * Copyright (c) 2022, Circle Internet Financial Limited.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    pragma solidity 0.7.6;

    import "./interfaces/ITokenMinter.sol";
    import "./interfaces/IMintBurnToken.sol";
    import "./roles/Pausable.sol";
    import "./roles/Rescuable.sol";
    import "./roles/TokenController.sol";
    import "./TokenMessenger.sol";

    /**
     * @title TokenMinter
     * @notice Token Minter and Burner
     * @dev Maintains registry of local mintable tokens and corresponding tokens on remote domains.
     * This registry can be used by caller to determine which token on local domain to mint for a
     * burned token on a remote domain, and vice versa.
     * It is assumed that local and remote tokens are fungible at a constant 1:1 exchange rate.
     */
    contract TokenMinter is ITokenMinter, TokenController, Pausable, Rescuable {
        // ============ Events ============
        /**
         * @notice Emitted when a local TokenMessenger is added
         * @param localTokenMessenger address of local TokenMessenger
         * @notice Emitted when a local TokenMessenger is added
         */
        event LocalTokenMessengerAdded(address localTokenMessenger);

        /**
         * @notice Emitted when a local TokenMessenger is removed
         * @param localTokenMessenger address of local TokenMessenger
         * @notice Emitted when a local TokenMessenger is removed
         */
        event LocalTokenMessengerRemoved(address localTokenMessenger);

        // ============ State Variables ============
        // Local TokenMessenger with permission to call mint and burn on this TokenMinter
        address public localTokenMessenger;

        // ============ Modifiers ============
        /**
         * @notice Only accept messages from the registered message transmitter on local domain
         */
        modifier onlyLocalTokenMessenger() {
            require(_isLocalTokenMessenger(), "Caller not local TokenMessenger");
            _;
        }

        // ============ Constructor ============
        /**
         * @param _tokenController Token controller address
         */
        constructor(address _tokenController) {
            _setTokenController(_tokenController);
        }

        // ============ External Functions  ============
        /**
         * @notice Mints `amount` of local tokens corresponding to the
         * given (`sourceDomain`, `burnToken`) pair, to `to` address.
         * @dev reverts if the (`sourceDomain`, `burnToken`) pair does not
         * map to a nonzero local token address. This mapping can be queried using
         * getLocalToken().
         * @param sourceDomain Source domain where `burnToken` was burned.
         * @param burnToken Burned token address as bytes32.
         * @param to Address to receive minted tokens, corresponding to `burnToken`,
         * on this domain.
         * @param amount Amount of tokens to mint. Must be less than or equal
         * to the minterAllowance of this TokenMinter for given `_mintToken`.
         * @return mintToken token minted.
         */
        function mint(
            uint32 sourceDomain,
            bytes32 burnToken,
            address to,
            uint256 amount
        )
            external
            override
            whenNotPaused
            onlyLocalTokenMessenger
            returns (address mintToken)
        {
            address _mintToken = _getLocalToken(sourceDomain, burnToken);
            require(_mintToken != address(0), "Mint token not supported");
            IMintBurnToken _token = IMintBurnToken(_mintToken);

            require(_token.mint(to, amount), "Mint operation failed");
            return _mintToken;
        }

        /**
         * @notice Burn tokens owned by this TokenMinter.
         * @param burnToken burnable token address.
         * @param burnAmount amount of tokens to burn. Must be
         * > 0, and <= maximum burn amount per message.
         */
        function burn(address burnToken, uint256 burnAmount)
            external
            override
            whenNotPaused
            onlyLocalTokenMessenger
            onlyWithinBurnLimit(burnToken, burnAmount)
        {
            IMintBurnToken _token = IMintBurnToken(burnToken);
            _token.burn(burnAmount);
        }

        /**
         * @notice Add TokenMessenger for the local domain. Only this TokenMessenger
         * has permission to call mint() and burn() on this TokenMinter.
         * @dev Reverts if a TokenMessenger is already set for the local domain.
         * @param newLocalTokenMessenger The address of the new TokenMessenger on the local domain.
         */
        function addLocalTokenMessenger(address newLocalTokenMessenger)
            external
            onlyOwner
        {
            require(
                newLocalTokenMessenger != address(0),
                "Invalid TokenMessenger address"
            );

            require(
                localTokenMessenger == address(0),
                "Local TokenMessenger already set"
            );

            localTokenMessenger = newLocalTokenMessenger;

            emit LocalTokenMessengerAdded(localTokenMessenger);
        }

        /**
         * @notice Remove the TokenMessenger for the local domain.
         * @dev Reverts if the TokenMessenger of the local domain is not set.
         */
        function removeLocalTokenMessenger() external onlyOwner {
            address _localTokenMessengerBeforeRemoval = localTokenMessenger;
            require(
                _localTokenMessengerBeforeRemoval != address(0),
                "No local TokenMessenger is set"
            );

            delete localTokenMessenger;
            emit LocalTokenMessengerRemoved(_localTokenMessengerBeforeRemoval);
        }

        /**
         * @notice Set tokenController to `newTokenController`, and
         * emit `SetTokenController` event.
         * @dev newTokenController must be nonzero.
         * @param newTokenController address of new token controller
         */
        function setTokenController(address newTokenController)
            external
            override
            onlyOwner
        {
            _setTokenController(newTokenController);
        }

        /**
         * @notice Get the local token address associated with the given
         * remote domain and token.
         * @param remoteDomain Remote domain
         * @param remoteToken Remote token
         * @return local token address
         */
        function getLocalToken(uint32 remoteDomain, bytes32 remoteToken)
            external
            view
            override
            returns (address)
        {
            return _getLocalToken(remoteDomain, remoteToken);
        }

        // ============ Internal Utils ============
        /**
         * @notice Returns true if the message sender is the registered local TokenMessenger
         * @return True if the message sender is the registered local TokenMessenger
         */
        function _isLocalTokenMessenger() internal view returns (bool) {
            return
                address(localTokenMessenger) != address(0) &&
                msg.sender == address(localTokenMessenger);
        }
    }
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

## How to Interact with CCTP Contracts

Before writing your own contracts, it's essential to understand the key functions and events of the Wormhole CCTP contracts. The primary functionality revolves around the following:

- **Sending tokens with a message payload**: Initiating a cross-chain transfer of Circle-supported assets along with a message payload to a specific target address on the target chain.
- **Receiving tokens with a message payload**: Validating messages received from other chains via Wormhole and then minting the tokens for the recipient.

### Sending Tokens and Messages

To initiate a cross-chain transfer, you must call the `transferTokensWithPayload` method of Wormhole's Circle Integration (CCTP) contract. Once you have initiated a transfer, you must fetch the attested Wormhole message and parse the transaction logs to locate a transfer message emitted by the Circle Bridge contract. Then, a request must be sent to Circle's off-chain process with the transfer message to grab the attestation from the process's response, which validates the token mint on the target chain.

To streamline this process, you can use the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/main){target=\_blank}, which exposes the `WormholeRelayerSDK.sol` contract, including the `CCTPSender` abstract contract. By inheriting this contract, you can transfer USDC while automatically relaying the message payload to the destination chain via a Wormhole-deployed relayer.

??? code "CCTP Sender contract"

    ```solidity
    abstract contract CCTPSender is CCTPBase {
        uint8 internal constant CONSISTENCY_LEVEL_FINALIZED = 15;

        using CCTPMessageLib for *;

        mapping(uint16 => uint32) public chainIdToCCTPDomain;

        /**
         * Sets the CCTP Domain corresponding to chain 'chain' to be 'cctpDomain'
         * So that transfers of USDC to chain 'chain' use the target CCTP domain 'cctpDomain'
         *
         * This action can only be performed by 'cctpConfigurationOwner', who is set to be the deployer
         *
         * Currently, cctp domains are:
         * Ethereum: Wormhole chain id 2, cctp domain 0
         * Avalanche: Wormhole chain id 6, cctp domain 1
         * Optimism: Wormhole chain id 24, cctp domain 2
         * Arbitrum: Wormhole chain id 23, cctp domain 3
         * Base: Wormhole chain id 30, cctp domain 6
         *
         * These can be set via:
         * setCCTPDomain(2, 0);
         * setCCTPDomain(6, 1);
         * setCCTPDomain(24, 2);
         * setCCTPDomain(23, 3);
         * setCCTPDomain(30, 6);
         */
        function setCCTPDomain(uint16 chain, uint32 cctpDomain) public {
            require(
                msg.sender == cctpConfigurationOwner,
                "Not allowed to set CCTP Domain"
            );
            chainIdToCCTPDomain[chain] = cctpDomain;
        }

        function getCCTPDomain(uint16 chain) internal view returns (uint32) {
            return chainIdToCCTPDomain[chain];
        }

        /**
         * transferUSDC wraps common boilerplate for sending tokens to another chain using IWormholeRelayer
         * - approves the Circle TokenMessenger contract to spend 'amount' of USDC
         * - calls Circle's 'depositForBurnWithCaller'
         * - returns key for inclusion in WormholeRelayer `additionalVaas` argument
         *
         * Note: this requires that only the targetAddress can redeem transfers.
         *
         */

        function transferUSDC(
            uint256 amount,
            uint16 targetChain,
            address targetAddress
        ) internal returns (MessageKey memory) {
            IERC20(USDC).approve(address(circleTokenMessenger), amount);
            bytes32 targetAddressBytes32 = addressToBytes32CCTP(targetAddress);
            uint64 nonce = circleTokenMessenger.depositForBurnWithCaller(
                amount,
                getCCTPDomain(targetChain),
                targetAddressBytes32,
                USDC,
                targetAddressBytes32
            );
            return
                MessageKey(
                    CCTPMessageLib.CCTP_KEY_TYPE,
                    abi.encodePacked(getCCTPDomain(wormhole.chainId()), nonce)
                );
        }

        // Publishes a CCTP transfer of 'amount' of USDC
        // and requests a delivery of the transfer along with 'payload' to 'targetAddress' on 'targetChain'
        //
        // The second step is done by publishing a wormhole message representing a request
        // to call 'receiveWormholeMessages' on the address 'targetAddress' on chain 'targetChain'
        // with the payload 'abi.encode(amount, payload)'
        // (and we encode the amount so it can be checked on the target chain)
        function sendUSDCWithPayloadToEvm(
            uint16 targetChain,
            address targetAddress,
            bytes memory payload,
            uint256 receiverValue,
            uint256 gasLimit,
            uint256 amount
        ) internal returns (uint64 sequence) {
            MessageKey[] memory messageKeys = new MessageKey[](1);
            messageKeys[0] = transferUSDC(amount, targetChain, targetAddress);

            bytes memory userPayload = abi.encode(amount, payload);
            address defaultDeliveryProvider = wormholeRelayer
                .getDefaultDeliveryProvider();

            (uint256 cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
                targetChain,
                receiverValue,
                gasLimit
            );

            sequence = wormholeRelayer.sendToEvm{value: cost}(
                targetChain,
                targetAddress,
                userPayload,
                receiverValue,
                0,
                gasLimit,
                targetChain,
                address(0x0),
                defaultDeliveryProvider,
                messageKeys,
                CONSISTENCY_LEVEL_FINALIZED
            );
        }

        function addressToBytes32CCTP(address addr) private pure returns (bytes32) {
            return bytes32(uint256(uint160(addr)));
        }
    }

    ```

The `CCTPSender` abstract contract exposes the `sendUSDCWithPayloadToEvm` function. This function publishes a CCTP transfer of the provided `amount` of USDC and requests that the transfer be delivered along with a `payload` to the specified `targetAddress` on the `targetChain`.

```solidity
function sendUSDCWithPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    uint256 receiverValue,
    uint256 gasLimit,
    uint256 amount
) internal returns (uint64 sequence) 
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
    - The `depositForBurnWithCaller` function of the Token Messenger contract is invoked.
    - A key is returned, which is to be provided to the relayer for message delivery.

2. **Message encoding**: The message `payload` is encoded for transmission via the relayer. The encoded value also includes the `amount` so that it can be checked on the target chain.
3. **Retrieving delivery provider**: The current default delivery provider's address is retrieved.
4. **Cost calculation**: The transfer cost is calculated using the relayer's `quoteEVMDeliveryPrice` function.
5. **Message dispatch**:

    - The `sendToEvm` function of the relayer is called with the encoded payload, the delivery provider's address, and the arguments passed to `sendUSDCWithPayloadToEvm`.
    - The function must be called with `msg.value` set to the previously calculated cost (from step 4).
    - This function publishes an instruction for the delivery provider to relay the payload and VAAs specified by the key (from step 1) to the target address on the target chain.

A simple example implementation is as follows:

```solidity
function sendCrossChainDeposit(
    uint16 targetChain,
    address targetAddress,
    address recipient,
    uint256 amount,
    uint256,
    gasLimit
) public payable {
    uint256 cost = quoteCrossChainDeposit(targetChain);
    require(
        msg.value == cost,
        "msg.value must be quoteCrossChainDeposit(targetChain)"
    );

    IERC20(USDC).transferFrom(msg.sender, address(this), amount);

    bytes memory payload = abi.encode(recipient);
    sendUSDCWithPayloadToEvm(
        targetChain,
        targetAddress, // address (on targetChain) to send token and payload to
        payload,
        0, // receiver value
        gasLimit,
        amount
    );
}

```

The above example sends a specified amount of USDC and the recipient's address as a payload to a target contract on another chain, ensuring that the correct cost is provided for the cross-chain transfer.

### Receiving Tokens and Messages

To complete the cross-chain transfer, you must invoke the `redeemTokensWithPayload` function on the target Wormhole Circle Integration contract. This function verifies the message's authenticity, decodes the payload, confirms the recipient and sender, checks message delivery, and then calls the `receiveMessage` function of the [Message Transmitter](#message-transmitter-contract) contract.

Using the Wormhole-deployed relayer automatically triggers the `receiveWormholeMessages` function. This function is defined in the `WormholeRelayerSDK.sol` contract from the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/main){target=\_blank} and is implemented within the `CCTPReceiver` abstract contract.

??? code "CCTP Receiver contract"

    ```solidity
    abstract contract CCTPReceiver is CCTPBase {
        function redeemUSDC(
            bytes memory cctpMessage
        ) internal returns (uint256 amount) {
            (bytes memory message, bytes memory signature) = abi.decode(
                cctpMessage,
                (bytes, bytes)
            );
            uint256 beforeBalance = IERC20(USDC).balanceOf(address(this));
            circleMessageTransmitter.receiveMessage(message, signature);
            return IERC20(USDC).balanceOf(address(this)) - beforeBalance;
        }

        function receiveWormholeMessages(
            bytes memory payload,
            bytes[] memory additionalMessages,
            bytes32 sourceAddress,
            uint16 sourceChain,
            bytes32 deliveryHash
        ) external payable {
            // Currently, 'sendUSDCWithPayloadToEVM' only sends one CCTP transfer
            // That can be modified if the integrator desires to send multiple CCTP transfers
            // in which case the following code would have to be modified to support
            // redeeming these multiple transfers and checking that their 'amount's are accurate
            require(
                additionalMessages.length <= 1,
                "CCTP: At most one Message is supported"
            );

            uint256 amountUSDCReceived;
            if (additionalMessages.length == 1)
                amountUSDCReceived = redeemUSDC(additionalMessages[0]);

            (uint256 amount, bytes memory userPayload) = abi.decode(
                payload,
                (uint256, bytes)
            );

            // Check that the correct amount was received
            // It is important to verify that the 'USDC' sent in by the relayer is the same amount
            // that the sender sent in on the source chain
            require(amount == amountUSDCReceived, "Wrong amount received");

            receivePayloadAndUSDC(
                userPayload,
                amountUSDCReceived,
                sourceAddress,
                sourceChain,
                deliveryHash
            );
        }

        // Implement this function to handle in-bound deliveries that include a CCTP transfer
        function receivePayloadAndUSDC(
            bytes memory payload,
            uint256 amountUSDCReceived,
            bytes32 sourceAddress,
            uint16 sourceChain,
            bytes32 deliveryHash
        ) internal virtual {}
    }

    ```

Although you do not need to interact with the `receiveWormholeMessages` function directly, it's important to understand what it does. This function processes cross-chain messages and USDC transfers via Wormhole's Circle (CCTP) Bridge. Here's a summary of what it does:

1. **Validate additional messages**: The function checks that there is at most one CCTP transfer message in the `additionalMessages` array, as it currently only supports processing a single CCTP transfer.
2. **Redeem USDC**:
    - If there is a CCTP message, it calls the `redeemUSDC` function of the `CCTPReceiver` contract to decode and redeem the USDC.
    - This results in the call of the `receiveMessage` function of Circle's Message Transmitter contract to redeem the USDC based on the provided message and signature.
    - The amount of USDC received is calculated by subtracting the contract's previous balance from the current balance after redeeming the USDC.
3. **Decode payload**: The incoming payload is decoded, extracting both the expected amount of USDC and a `userPayload` (which could be any additional data).
4. **Verify the amount**: It ensures that the amount of USDC received matches the amount encoded in the payload. If the amounts don't match, the transaction is reverted.
5. **Handle the payload and USDC**: After verifying the amounts, `receivePayloadAndUSDC` is called, which is meant to handle the actual logic for processing the received payload and USDC transfer.

You'll need to implement the `receivePayloadAndUSDC` function to transfer the USDC and handle the payload as your application needs. A simple example implementation is as follows:

```solidity
function receivePayloadAndUSDC(
    bytes memory payload,
    uint256 amountUSDCReceived,
    bytes32, // sourceAddress
    uint16, // sourceChain
    bytes32 // deliveryHash
) internal override onlyWormholeRelayer {
    address recipient = abi.decode(payload, (address));

    IERC20(USDC).transfer(recipient, amountUSDCReceived);
}

```

## Complete Example

To view a complete example of creating a contract that integrates with Wormhole's CCTP contracts to send and receive USDC cross-chain, check out the [Hello USDC](https://github.com/wormhole-foundation/hello-usdc){target=\_blank} repository on GitHub.
