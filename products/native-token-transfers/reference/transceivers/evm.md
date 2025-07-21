---
title: Native Token Transfers Transceivers Contracts (EVM)
description: The NTT Transceiver Solidity contracts handle message transmission and verification across chains as part of the Native Token Transfers protocol.
categories: NTT, Transfer
---

# Transceivers Contracts Reference (EVM)

The NTT [Transceiver]({{repositories.native_token_transfers.repository_url}}/blob/{{repositories.native_token_transfers.evm_version}}/evm/src/Transceiver/WormholeTransceiver/WormholeTransceiver.sol){target=\_blank} contracts are responsible for sending and receiving messages between chains as part of the NTT protocol. They support multiple verification methods and operate alongside the NTT Manager to enable cross-chain token transfers.

## Structure Overview

The NTT Transceiver system is built using a layered inheritance structure with the base [`Transceiver`]({{repositories.native_token_transfers.repository_url}}/blob/{{repositories.native_token_transfers.evm_version}}/evm/src/Transceiver/Transceiver.sol){target=\_blank} contract providing common functionality and specific implementations like [`WormholeTransceiver`]({{repositories.native_token_transfers.repository_url}}/blob/{{repositories.native_token_transfers.evm_version}}/evm/src/Transceiver/WormholeTransceiver/WormholeTransceiver.sol){target=\_blank} adding protocol-specific features.

```text
WormholeTransceiver
├── IWormholeTransceiver
├── IWormholeReceiver
└── WormholeTransceiverState
    ├── IWormholeTransceiverState
    └── Transceiver
        ├── ITransceiver
        ├── PausableOwnable
        ├── ReentrancyGuardUpgradeable
        └── Implementation
```

**Key Components:**

- **Transceiver**: Base abstract contract providing common transceiver functionality including message transmission, ownership management, and upgrade capabilities.
- **WormholeTransceiver**: Concrete implementation for Wormhole protocol, handling message verification through Wormhole Core and supporting multiple delivery methods (standard relaying, custom relaying, manual).
- **WormholeTransceiverState**: State management contract for Wormhole-specific storage including peer registration, relaying configuration, and VAA consumption tracking.
- **PausableOwnable**: Provides ownership and emergency pause functionality.
- **ReentrancyGuardUpgradeable**: Protects against reentrancy attacks in an upgradeable context.
- **Implementation**: Handles proxy implementation logic for upgradeable contracts.

## State Variables

- `nttManager` ++"address"++: Immutable address of the NTT Manager that this transceiver is tied to.
- `nttManagerToken` ++"address"++: Immutable address of the token associated with the NTT deployment.
- `deployer` ++"address"++: Immutable address of the contract deployer.
- `WORMHOLE_TRANSCEIVER_VERSION` ++"string"++: The version string of the WormholeTransceiver contract implementation.
- `consistencyLevel` ++"uint8"++: Immutable Wormhole consistency level for message finality.
- `wormhole` ++"IWormhole"++: Immutable reference to the Wormhole Core bridge contract.
- `wormholeRelayer` ++"IWormholeRelayer"++: Immutable reference to the Wormhole Relayer contract.
- `specialRelayer` ++"ISpecialRelayer"++: Immutable reference to a custom relayer contract.
- `gasLimit` ++"uint256"++: Immutable gas limit for cross-chain message delivery.

## Events

### NotPaused

Emitted when the contract is unpaused. *(Defined in PausableUpgradeable.sol)*

```sol
event NotPaused(bool notPaused)
```

??? interface "Parameters"

    `notPaused` ++"bool"++

    Whether the contract is not paused.

### OwnershipTransferred

Emitted when ownership is transferred. *(Defined in OwnableUpgradeable.sol)*

```sol
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

??? interface "Parameters"

    `previousOwner` ++"address"++

    The address of the previous owner.

    ---

    `newOwner` ++"address"++

    The address of the new owner.

### Paused

Emitted when the contract is paused. *(Defined in PausableUpgradeable.sol)*

```sol
event Paused(bool paused)
```

??? interface "Parameters"

    `paused` ++"bool"++

    Whether the contract is paused.

### PauserTransferred

Emitted when the pauser capability is transferred. *(Defined in PausableUpgradeable.sol)*

```sol
event PauserTransferred(address indexed oldPauser, address indexed newPauser)
```

??? interface "Parameters"

    `oldPauser` ++"address"++

    The address of the previous pauser.

    ---

    `newPauser` ++"address"++

    The address of the new pauser.

### ReceivedMessage

Emitted when a message is received. *(Defined in IWormholeTransceiver.sol)*

```sol
event ReceivedMessage(
    bytes32 digest,
    uint16 emitterChainId,
    bytes32 emitterAddress,
    uint64 sequence
)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the message.

    ---

    `emitterChainId` ++"uint16"++

    The chain ID of the emitter.

    ---

    `emitterAddress` ++"bytes32"++

    The address of the emitter.

    ---

    `sequence` ++"uint64"++

    The sequence of the message.

### ReceivedRelayedMessage

Emitted when a relayed message is received. *(Defined in IWormholeTransceiver.sol)*

```sol
event ReceivedRelayedMessage(
    bytes32 digest,
    uint16 emitterChainId,
    bytes32 emitterAddress
)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the message.

    ---

    `emitterChainId` ++"uint16"++

    The chain ID of the emitter.

    ---

    `emitterAddress` ++"bytes32"++

    The address of the emitter.

### RelayingInfo

Emitted when a message is sent from the transceiver. *(Defined in IWormholeTransceiverState.sol)*

```sol
event RelayingInfo(
    uint8 relayingType,
    bytes32 refundAddress,
    uint256 deliveryPayment
)
```

??? interface "Parameters"

    `relayingType` ++"uint8"++

    The type of relaying.

    ---

    `refundAddress` ++"bytes32"++

    The refund address for unused gas.

    ---

    `deliveryPayment` ++"uint256"++

    The amount of ether sent along with the tx to cover the delivery fee.

### SendTransceiverMessage

Emitted when a message is sent from the transceiver. *(Defined in IWormholeTransceiver.sol)*

```sol
event SendTransceiverMessage(
    uint16 recipientChain,
    TransceiverStructs.TransceiverMessage message
)
```

??? interface "Parameters"

    `recipientChain` ++"uint16"++

    The chain ID of the recipient.

    ---

    `message` ++"TransceiverStructs.TransceiverMessage"++

    The message.

    ??? child "`TransceiverMessage` type"

        `sourceNttManagerAddress` ++"bytes32"++

        The address of the source NTT Manager.
        
        ---

        `recipientNttManagerAddress` ++"bytes32"++

        The address of the recipient NTT Manager.
        
        ---

        `nttManagerPayload` ++"bytes"++

        The NTT Manager payload.
        
        ---

        `transceiverPayload` ++"bytes"++

        The transceiver-specific payload.

### SetIsSpecialRelayingEnabled

Emitted when special relaying is enabled for the given chain. *(Defined in IWormholeTransceiverState.sol)*

```sol
event SetIsSpecialRelayingEnabled(uint16 chainId, bool isRelayingEnabled)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to set.

    ---

    `isRelayingEnabled` ++"bool"++

    A boolean indicating whether special relaying is enabled.

### SetIsWormholeEvmChain

Emitted when the chain is EVM compatible. *(Defined in IWormholeTransceiverState.sol)*

```sol
event SetIsWormholeEvmChain(uint16 chainId, bool isEvm)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to set.

    ---

    `isEvm` ++"bool"++

    A boolean indicating whether relaying is enabled.

### SetIsWormholeRelayingEnabled

Emitted when relaying is enabled for the given chain. *(Defined in IWormholeTransceiverState.sol)*

```sol
event SetIsWormholeRelayingEnabled(uint16 chainId, bool isRelayingEnabled)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to set.

    ---

    `isRelayingEnabled` ++"bool"++

    A boolean indicating whether relaying is enabled.

### SetWormholePeer

Emitted when a peer transceiver is set. *(Defined in IWormholeTransceiverState.sol)*

```sol
event SetWormholePeer(uint16 chainId, bytes32 peerContract)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID of the peer.

    ---

    `peerContract` ++"bytes32"++

    The address of the peer contract.

## Functions

### encodeWormholeTransceiverInstruction

Encodes the `WormholeTransceiverInstruction` into a byte array. *(Defined in WormholeTransceiver.sol)*

```sol
function encodeWormholeTransceiverInstruction(
    WormholeTransceiverInstruction memory instruction
) external pure returns (bytes memory)
```

??? interface "Parameters"

    `instruction` ++"WormholeTransceiverInstruction"++

    The `WormholeTransceiverInstruction` to encode.

    ??? child "`WormholeTransceiverInstruction` type"

        `shouldSkipRelayerSend` ++"bool"++

        Whether to skip delivery via the relayer.

??? interface "Returns"

    `encoded` ++"bytes"++

    The encoded instruction.

### getMigratesImmutables

Returns whether the contract migrates immutables during upgrades. *(Defined in Implementation.sol)*

```sol
function getMigratesImmutables() public view returns (bool)
```

??? interface "Returns"

    `migratesImmutables` ++"bool"++

    Whether the contract migrates immutables.

### getNttManagerOwner

Returns the owner address of the NTT Manager that this transceiver is related to. *(Defined in Transceiver.sol)*

```sol
function getNttManagerOwner() external view returns (address)
```

??? interface "Returns"

    `owner` ++"address"++

    The owner address of the NTT Manager.

### getNttManagerToken

Returns the address of the token associated with this NTT deployment. *(Defined in Transceiver.sol)*

```sol
function getNttManagerToken() external view returns (address)
```

??? interface "Returns"

    `token` ++"address"++

    The address of the token.

### getTransceiverType

Returns the string type of the transceiver. *(Defined in WormholeTransceiver.sol)*

```sol
function getTransceiverType() external pure returns (string memory)
```

??? interface "Returns"

    `transceiverType` ++"string"++

    The type of the transceiver (e.g., "wormhole").

### getWormholePeer

Returns the peer contract address for a given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function getWormholePeer(uint16 chainId) public view returns (bytes32)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to query.

??? interface "Returns"

    `peerContract` ++"bytes32"++

    The address of the peer contract on the given chain.

### initialize

Initializes the contract implementation. Only callable through a delegate call. *(Defined in Implementation.sol)*

```sol
function initialize() external payable
```

### isPaused

Returns whether the contract is currently paused. *(Defined in PausableUpgradeable.sol)*

```sol
function isPaused() public view returns (bool)
```

??? interface "Returns"

    `paused` ++"bool"++

    Whether the contract is paused.

### isSpecialRelayingEnabled

Returns whether special relaying is enabled for a given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function isSpecialRelayingEnabled(uint16 chainId) public view returns (bool)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to query.

??? interface "Returns"

    `isEnabled` ++"bool"++

    Whether special relaying is enabled.

### isVAAConsumed

Returns whether a VAA has been consumed. *(Defined in WormholeTransceiverState.sol)*

```sol
function isVAAConsumed(bytes32 hash) public view returns (bool)
```

??? interface "Parameters"

    `hash` ++"bytes32"++

    The hash of the VAA.

??? interface "Returns"

    `consumed` ++"bool"++

    Whether the VAA has been consumed.

### isWormholeEvmChain

Returns whether a chain is EVM compatible. *(Defined in WormholeTransceiverState.sol)*

```sol
function isWormholeEvmChain(uint16 chainId) public view returns (bool)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to query.

??? interface "Returns"

    `isEvm` ++"bool"++

    Whether the chain is EVM compatible.

### isWormholeRelayingEnabled

Returns whether relaying is enabled for a given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function isWormholeRelayingEnabled(uint16 chainId) public view returns (bool)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to query.

??? interface "Returns"

    `isEnabled` ++"bool"++

    Whether relaying is enabled.

### migrate

Migrates the contract to a new implementation. Only callable during upgrades through a delegate call. *(Defined in Implementation.sol)*

```sol
function migrate() external
```

### parseWormholeTransceiverInstruction

Parses the encoded instruction and returns the instruction struct. *(Defined in WormholeTransceiver.sol)*

```sol
function parseWormholeTransceiverInstruction(
    bytes memory encoded
) external pure returns (WormholeTransceiverInstruction memory instruction)
```

??? interface "Parameters"

    `encoded` ++"bytes"++

    The encoded instruction.

??? interface "Returns"

    `instruction` ++"WormholeTransceiverInstruction"++

    The parsed `WormholeTransceiverInstruction`.

    ??? child "`WormholeTransceiverInstruction` type"

        `shouldSkipRelayerSend` ++"bool"++

        Whether to skip delivery via the relayer.

### quoteDeliveryPrice

Fetch the delivery price for a given recipient chain transfer. *(Defined in Transceiver.sol)*

```sol
function quoteDeliveryPrice(
    uint16 recipientChain,
    TransceiverStructs.TransceiverInstruction memory instruction
) external view returns (uint256)
```

??? interface "Parameters"

    `recipientChain` ++"uint16"++

    The Wormhole chain ID of the target chain.

    ---

    `instruction` ++"TransceiverStructs.TransceiverInstruction"++

    An additional Instruction provided by the Transceiver to be executed on the recipient chain.

    ??? child "`TransceiverInstruction` type"

        `index` ++"uint8"++

        The index of the transceiver.
        
        ---

        `payload` ++"bytes"++

        The instruction payload.

??? interface "Returns"

    `deliveryPrice` ++"uint256"++

    The cost of delivering a message to the recipient chain, in this chain's native token.

### owner

Returns the address of the current owner. *(Defined in OwnableUpgradeable.sol)*

```sol
function owner() public view returns (address)
```

??? interface "Returns"

    `owner` ++"address"++

    The address of the current owner.

### pauser

Returns the address of the current pauser. *(Defined in PausableUpgradeable.sol)*

```sol
function pauser() public view returns (address)
```

??? interface "Returns"

    `pauser` ++"address"++

    The address of the current pauser.

### receiveMessage

Receive an attested message from the verification layer. *(Defined in WormholeTransceiver.sol)*

```sol
function receiveMessage(bytes memory encodedMessage) external
```

??? interface "Parameters"

    `encodedMessage` ++"bytes"++

    The attested message.

> **Emits**: `ReceivedMessage`

### receiveWormholeMessages

Receives and processes Wormhole messages via the relayer. Only callable by the relayer. *(Defined in WormholeTransceiver.sol)*

```sol
function receiveWormholeMessages(
    bytes memory payload,
    bytes[] memory additionalMessages,
    bytes32 sourceAddress,
    uint16 sourceChain,
    bytes32 deliveryHash
) external payable
```

??? interface "Parameters"

    `payload` ++"bytes"++

    The message payload.

    ---

    `additionalMessages` ++"bytes[]"++

    Additional messages array.

    ---

    `sourceAddress` ++"bytes32"++

    The source address of the message.

    ---

    `sourceChain` ++"uint16"++

    The source chain ID.

    ---

    `deliveryHash` ++"bytes32"++

    The delivery hash.

> **Emits**: `ReceivedRelayedMessage`

### sendMessage

Send a message to another chain. *(Defined in Transceiver.sol)*

```sol
function sendMessage(
    uint16 recipientChain,
    TransceiverStructs.TransceiverInstruction memory instruction,
    bytes memory nttManagerMessage,
    bytes32 recipientNttManagerAddress,
    bytes32 refundAddress
) external payable
```

??? interface "Parameters"

    `recipientChain` ++"uint16"++

    The Wormhole chain ID of the recipient.

    ---

    `instruction` ++"TransceiverStructs.TransceiverInstruction"++

    An additional Instruction provided by the Transceiver to be executed on the recipient chain.

    ??? child "`TransceiverInstruction` type"

        `index` ++"uint8"++

        The index of the transceiver.
        
        ---

        `payload` ++"bytes"++

        The instruction payload.

    ---

    `nttManagerMessage` ++"bytes"++

    A message to be sent to the nttManager on the recipient chain.

    ---

    `recipientNttManagerAddress` ++"bytes32"++

    The Wormhole formatted address of the peer NTT Manager on the recipient chain.

    ---

    `refundAddress` ++"bytes32"++

    The Wormhole formatted address of the refund recipient.

> **Emits**: `SendTransceiverMessage`, `RelayingInfo`

### setIsSpecialRelayingEnabled

Set whether special relaying is enabled for the given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function setIsSpecialRelayingEnabled(uint16 chainId, bool isRelayingEnabled) external
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The Wormhole chain ID to set.

    ---

    `isRelayingEnabled` ++"bool"++

    A boolean indicating whether special relaying is enabled.

> **Emits**: `SetIsSpecialRelayingEnabled`

### setIsWormholeEvmChain

Set whether the chain is EVM compatible. *(Defined in WormholeTransceiverState.sol)*

```sol
function setIsWormholeEvmChain(uint16 chainId, bool isEvm) external
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The Wormhole chain ID to set.

    ---

    `isEvm` ++"bool"++

    A boolean indicating whether the chain is an EVM chain.

> **Emits**: `SetIsWormholeEvmChain`

### setIsWormholeRelayingEnabled

Set whether Wormhole relaying is enabled for the given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function setIsWormholeRelayingEnabled(uint16 chainId, bool isRelayingEnabled) external
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The Wormhole chain ID to set.

    ---

    `isRelayingEnabled` ++"bool"++

    A boolean indicating whether relaying is enabled.

> **Emits**: `SetIsWormholeRelayingEnabled`

### setWormholePeer

Set the Wormhole peer contract for the given chain. *(Defined in WormholeTransceiverState.sol)*

```sol
function setWormholePeer(uint16 chainId, bytes32 peerContract) external payable
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The Wormhole chain ID of the peer to set.

    ---

    `peerContract` ++"bytes32"++

    The address of the peer contract on the given chain.

> **Emits**: `SetWormholePeer`

### transferOwnership

Transfers ownership of the contract to a new account. Can only be called by the current owner. *(Defined in OwnableUpgradeable.sol)*

```sol
function transferOwnership(address newOwner) public
```

??? interface "Parameters"

    `newOwner` ++"address"++

    The address of the new owner.

> **Emits**: `OwnershipTransferred`

### transferPauserCapability

Transfers the ability to pause to a new account. *(Defined in PausableOwnable.sol)*

```sol
function transferPauserCapability(address newPauser) public
```

??? interface "Parameters"

    `newPauser` ++"address"++

    The address of the new pauser.

> **Emits**: `PauserTransferred`

### transferTransceiverOwnership

Transfers the ownership of the transceiver to a new address. *(Defined in Transceiver.sol)*

```sol
function transferTransceiverOwnership(address newOwner) external
```

??? interface "Parameters"

    `newOwner` ++"address"++

    The address of the new owner.

> **Emits**: `OwnershipTransferred`

### upgrade

Upgrades the transceiver to a new implementation. *(Defined in Transceiver.sol)*

```sol
function upgrade(address newImplementation) external
```

??? interface "Parameters"

    `newImplementation` ++"address"++

    The address of the new implementation contract.

## Errors

### CallerNotNttManager

The caller is not the NttManager. *(Defined in ITransceiver.sol)*

```sol
error CallerNotNttManager(address caller);
```

??? interface "Parameters"

    `caller` ++"address"++

    The address of the caller.

### CallerNotRelayer

The caller is not the relayer. *(Defined in IWormholeTransceiverState.sol)*

```sol
error CallerNotRelayer(address caller);
```

??? interface "Parameters"

    `caller` ++"address"++

    The caller.

### CannotRenounceTransceiverOwnership

Error when trying renounce transceiver ownership. *(Defined in ITransceiver.sol)*

```sol
error CannotRenounceTransceiverOwnership(address currentOwner);
```

??? interface "Parameters"

    `currentOwner` ++"address"++

    The current owner of the transceiver.

### CannotTransferTransceiverOwnership

Error when trying to transfer transceiver ownership. *(Defined in ITransceiver.sol)*

```sol
error CannotTransferTransceiverOwnership(address currentOwner, address newOwner);
```

??? interface "Parameters"

    `currentOwner` ++"address"++

    The current owner of the transceiver.

    ---

    `newOwner` ++"address"++

    The new owner of the transceiver.

### InvalidPauser

The pauser is not a valid pauser account. *(Defined in PausableUpgradeable.sol)*

```sol
error InvalidPauser(address account);
```

??? interface "Parameters"

    `account` ++"address"++

    The invalid pauser account.

### InvalidRelayingConfig

Error when the relaying configuration is invalid. *(Defined in IWormholeTransceiver.sol)*

```sol
error InvalidRelayingConfig(uint16 chainId);
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID that is invalid.

### InvalidVaa

Error if the VAA is invalid. *(Defined in IWormholeTransceiverState.sol)*

```sol
error InvalidVaa(string reason);
```

??? interface "Parameters"

    `reason` ++"string"++

    The reason the VAA is invalid.

### InvalidWormholeChainIdZero

The chain ID cannot be zero. *(Defined in IWormholeTransceiverState.sol)*

```sol
error InvalidWormholeChainIdZero();
```

### InvalidWormholePeer

Error when the peer transceiver is invalid. *(Defined in IWormholeTransceiver.sol)*

```sol
error InvalidWormholePeer(uint16 chainId, bytes32 peerAddress);
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID of the peer.

    ---

    `peerAddress` ++"bytes32"++

    The address of the invalid peer.

### InvalidWormholePeerZeroAddress

Error the peer contract cannot be the zero address. *(Defined in IWormholeTransceiverState.sol)*

```sol
error InvalidWormholePeerZeroAddress();
```

### NotMigrating

The contract is not currently migrating. *(Defined in Implementation.sol)*

```sol
error NotMigrating();
```

### OnlyDelegateCall

Function can only be called through delegate call. *(Defined in Implementation.sol)*

```sol
error OnlyDelegateCall();
```

### OwnableInvalidOwner

The owner is not a valid owner account. *(Defined in OwnableUpgradeable.sol)*

```sol
error OwnableInvalidOwner(address owner);
```

??? interface "Parameters"

    `owner` ++"address"++

    The invalid owner address.

### OwnableUnauthorizedAccount

The caller account is not authorized to perform an operation. *(Defined in OwnableUpgradeable.sol)*

```sol
error OwnableUnauthorizedAccount(address account);
```

??? interface "Parameters"

    `account` ++"address"++

    The unauthorized account.

### RequireContractIsNotPaused

Contract is not paused, functionality is unblocked. *(Defined in PausableUpgradeable.sol)*

```sol
error RequireContractIsNotPaused();
```

### RequireContractIsPaused

Contract state is paused, blocking functionality. *(Defined in PausableUpgradeable.sol)*

```sol
error RequireContractIsPaused();
```

### PeerAlreadySet

Error if the peer has already been set. *(Defined in IWormholeTransceiverState.sol)*

```sol
error PeerAlreadySet(uint16 chainId, bytes32 peerAddress);
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID of the peer.

    ---

    `peerAddress` ++"bytes32"++

    The address of the peer.

### UnexpectedAdditionalMessages

Additional messages are not allowed. *(Defined in IWormholeTransceiverState.sol)*

```sol
error UnexpectedAdditionalMessages();
```
