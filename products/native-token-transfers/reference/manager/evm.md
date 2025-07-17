---
title: Native Token Transfers Manager Contract (EVM)
description: The NTT Manager Solidity contract enables cross-chain token transfers, peer registration, rate limiting, and message attestation within the NTT protocol.
categories: NTT, Transfer
---

# NTT Manager Contract Reference (EVM)

The [NttManager]({{repositories.native_token_transfers.repository_url}}/blob/{{repositories.native_token_transfers.evm_version}}/evm/src/NttManager/NttManager.sol){target=\_blank} contract is responsible for managing the token and associated transceivers. It enables cross-chain token transfers, peer registration, rate limiting, and message attestation for the NTT protocol.

## Structure Overview

The NTT Manager system is built using a layered inheritance structure composed of multiple base contracts and interfaces.

```text
NttManager
├── INttManager
├── RateLimiter
│   ├── IRateLimiter
│   └── IRateLimiterEvents
└── ManagerBase
    ├── IManagerBase
    ├── TransceiverRegistry
    ├── PausableOwnable
    ├── ReentrancyGuardUpgradeable
    └── Implementation
```

**Key Components:**

- **NttManager**: The main contract that combines all functionality for token transfers with rate limiting.
- **ManagerBase**: Provides core management functionality including message handling, threshold management, and transceiver coordination.
- **RateLimiter**: Adds rate limiting capabilities with queuing mechanisms for both inbound and outbound transfers.
- **TransceiverRegistry**: Manages the registration, enabling, and disabling of transceivers.
- **PausableOwnable**: Provides ownership and emergency pause functionality.
- **ReentrancyGuardUpgradeable**: Protects against reentrancy attacks in an upgradeable context.
- **Implementation**: Handles proxy implementation logic for upgradeable contracts.

## State Variables

- `token` ++"address"++ — Address of the token that this NTT Manager is tied to.
- `mode` ++"Mode"++ — Mode of the NTT Manager (LOCKING=0 or BURNING=1).
- `chainId` ++"uint16"++ — Wormhole chain ID that the NTT Manager is deployed on.
- `NTT_MANAGER_VERSION` ++"string"++ — The version string of the NttManager contract implementation.
- `rateLimitDuration` ++"uint64"++ — Duration (in seconds) for limits to fully replenish.

## Events

### InboundTransferLimitUpdated

Emitted when the inbound transfer limit is updated. *(Defined in RateLimiter.sol)*

```sol
event InboundTransferLimitUpdated(
    uint16 chainId,
    uint256 oldLimit,
    uint256 newLimit
)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID for which the limit was updated.

    ---

    `oldLimit` ++"uint256"++

    The previous inbound limit.

    ---

    `newLimit` ++"uint256"++

    The new inbound limit.

### InboundTransferQueued

Emitted when an inbound transfer is queued due to rate limiting. *(Defined in RateLimiter.sol)*

```sol
event InboundTransferQueued(bytes32 digest)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the queued transfer.

### MessageAlreadyExecuted

Emitted when a message has already been executed to notify client against retries. *(Defined in ManagerBase.sol)*

```sol
event MessageAlreadyExecuted(
    bytes32 indexed sourceNttManager,
    bytes32 indexed msgHash
)
```

??? interface "Parameters"

    `sourceNttManager` ++"bytes32"++

    The address of the source NttManager.

    ---

    `msgHash` ++"bytes32"++

    The keccak-256 hash of the message.

### MessageAttestedTo

Emitted when a message has been attested to by a transceiver. *(Defined in ManagerBase.sol)*

```sol
event MessageAttestedTo(bytes32 digest, address transceiver, uint8 index)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the message.

    ---

    `transceiver` ++"address"++

    The address of the transceiver that attested to the message.

    ---

    `index` ++"uint8"++

    The index of the transceiver in the registry.

### NotPaused

Emitted when the contract is unpaused. *(Defined in PausableUpgradeable.sol)*

```sol
event NotPaused(bool notPaused)
```

??? interface "Parameters"

    `notPaused` ++"bool"++

    Whether the contract is not paused.

### OutboundTransferCancelled

Emitted when an outbound transfer has been cancelled. *(Defined in NttManager.sol)*

```sol
event OutboundTransferCancelled(uint256 sequence, address recipient, uint256 amount)
```

??? interface "Parameters"

    `sequence` ++"uint256"++

    The sequence number being cancelled.

    ---

    `recipient` ++"address"++

    The canceller and recipient of the funds.

    ---

    `amount` ++"uint256"++

    The amount of the transfer being cancelled.

### OutboundTransferLimitUpdated

Emitted when the outbound transfer limit is updated. *(Defined in RateLimiter.sol)*

```sol
event OutboundTransferLimitUpdated(uint256 oldLimit, uint256 newLimit)
```

??? interface "Parameters"

    `oldLimit` ++"uint256"++

    The previous outbound limit.

    ---

    `newLimit` ++"uint256"++

    The new outbound limit.

### OutboundTransferQueued

Emitted when an outbound transfer is queued due to rate limiting. *(Defined in RateLimiter.sol)*

```sol
event OutboundTransferQueued(uint64 sequence)
```

??? interface "Parameters"

    `sequence` ++"uint64"++

    The sequence number of the queued transfer.

### OutboundTransferRateLimited

Emitted when an outbound transfer is rate limited. *(Defined in RateLimiter.sol)*

```sol
event OutboundTransferRateLimited(
    address sender,
    uint64 sequence,
    uint256 amount,
    uint256 currentCapacity
)
```

??? interface "Parameters"

    `sender` ++"address"++

    The address that initiated the transfer.

    ---

    `sequence` ++"uint64"++

    The sequence number of the transfer.

    ---

    `amount` ++"uint256"++

    The amount being transferred.

    ---

    `currentCapacity` ++"uint256"++

    The current available capacity.

### OwnershipTransferred

Emitted when ownership of the contract is transferred. *(Defined in OwnableUpgradeable.sol)*

```sol
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

??? interface "Parameters"

    `previousOwner` ++"address"++

    The previous owner address.

    ---

    `newOwner` ++"address"++

    The new owner address.

### Paused

Emitted when the contract is paused. *(Defined in PausableUpgradeable.sol)*

```sol
event Paused(bool paused)
```

??? interface "Parameters"

    `paused` ++"bool"++

    Whether the contract is paused.

### PauserTransferred

Emitted when pauser capability is transferred. *(Defined in PausableUpgradeable.sol)*

```sol
event PauserTransferred(address indexed oldPauser, address indexed newPauser)
```

??? interface "Parameters"

    `oldPauser` ++"address"++

    The previous pauser address.

    ---

    `newPauser` ++"address"++

    The new pauser address.

### PeerUpdated

Emitted when the peer contract is updated. *(Defined in NttManager.sol)*

```sol
event PeerUpdated(
    uint16 indexed chainId_,
    bytes32 oldPeerContract,
    uint8 oldPeerDecimals,
    bytes32 peerContract,
    uint8 peerDecimals
)
```

??? interface "Parameters"

    `chainId_` ++"uint16"++

    The chain ID of the peer contract.

    ---

    `oldPeerContract` ++"bytes32"++

    The old peer contract address.

    ---

    `oldPeerDecimals` ++"uint8"++

    The old peer contract decimals.

    ---

    `peerContract` ++"bytes32"++

    The new peer contract address.

    ---

    `peerDecimals` ++"uint8"++

    The new peer contract decimals.

### ThresholdChanged

Emitted when the threshold required for transceivers is changed. *(Defined in ManagerBase.sol)*

```sol
event ThresholdChanged(uint8 oldThreshold, uint8 threshold)
```

??? interface "Parameters"

    `oldThreshold` ++"uint8"++

    The old threshold.

    ---

    `threshold` ++"uint8"++

    The new threshold.

### TransceiverAdded

Emitted when a transceiver is added to the NttManager. *(Defined in ManagerBase.sol)*

```sol
event TransceiverAdded(address transceiver, uint256 transceiversNum, uint8 threshold)
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The address of the transceiver.

    ---

    `transceiversNum` ++"uint256"++

    The current number of transceivers.

    ---

    `threshold` ++"uint8"++

    The current threshold of transceivers.

### TransceiverRemoved

Emitted when a transceiver is removed from the NttManager. *(Defined in ManagerBase.sol)*

```sol
event TransceiverRemoved(address transceiver, uint8 threshold)
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The address of the transceiver.

    ---

    `threshold` ++"uint8"++

    The current threshold of transceivers.

### TransferRedeemed

Emitted when a transfer has been redeemed (either minted or unlocked on the recipient chain). *(Defined in NttManager.sol)*

```sol
event TransferRedeemed(bytes32 indexed digest)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the message.

### TransferSent

Emitted when a message is sent from the NttManager. *(Defined in NttManager.sol)*

```sol
event TransferSent(
    bytes32 indexed recipient,
    bytes32 indexed refundAddress,
    uint256 amount,
    uint256 fee,
    uint16 recipientChain,
    uint64 msgSequence
)
```

??? interface "Parameters"

    `recipient` ++"bytes32"++

    The recipient of the message.

    ---

    `refundAddress` ++"bytes32"++

    The address on the destination chain to which the refund of unused gas will be paid.

    ---

    `amount` ++"uint256"++

    The amount transferred.

    ---

    `fee` ++"uint256"++

    The amount of ether sent along with the tx to cover the delivery fee.

    ---

    `recipientChain` ++"uint16"++

    The chain ID of the recipient.

    ---

    `msgSequence` ++"uint64"++

    The unique sequence ID of the message.

### TransferSent (Digest Version)

Emitted when a message is sent from the NttManager (digest version). *(Defined in NttManager.sol)*

```sol
event TransferSent(bytes32 indexed digest)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the message.

## Functions

### attestationReceived

Called by transceivers when attestation is received. *(Defined in NttManager.sol)*

```sol
function attestationReceived(
    uint16 sourceChainId,
    bytes32 sourceNttManagerAddress,
    TransceiverStructs.NttManagerMessage memory payload
) external
```

??? interface "Parameters"

    `sourceChainId` ++"uint16"++

    The chain ID of the source.

    ---

    `sourceNttManagerAddress` ++"bytes32"++

    The address of the source NttManager.

    ---

    `payload` ++"TransceiverStructs.NttManagerMessage"++

    The message payload containing transfer details.

    ??? child "`NttManagerMessage` struct"

        `id` ++"bytes32"++

        Unique message identifier (incrementally assigned on EVM chains).
        
        ---

        `sender` ++"bytes32"++

        Original message sender address.
        
        ---

        `payload` ++"bytes"++

        Payload that corresponds to the transfer type.

> **Emits**: `MessageAlreadyExecuted` (if message was already executed), `OutboundTransferCancelled` or `TransferRedeemed` (if message execution succeeds), `TransferSent` (if message execution succeeds)

### cancelOutboundQueuedTransfer

Cancel an outbound transfer that's been queued due to rate limiting. *(Defined in NttManager.sol)*

```sol
function cancelOutboundQueuedTransfer(uint64 messageSequence) external
```

??? interface "Parameters"

    `messageSequence` ++"uint64"++

    The sequence number of the queued transfer to cancel.

> **Emits**: `OutboundTransferCancelled`

### completeInboundQueuedTransfer

Complete an inbound transfer that's been queued due to rate limiting. *(Defined in NttManager.sol)*

```sol
function completeInboundQueuedTransfer(bytes32 digest) external
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the queued transfer.

> **Emits**: `TransferRedeemed`

### completeOutboundQueuedTransfer

Complete an outbound transfer that's been queued due to rate limiting. *(Defined in NttManager.sol)*

```sol
function completeOutboundQueuedTransfer(uint64 messageSequence) external payable returns (uint64)
```

??? interface "Parameters"

    `messageSequence` ++"uint64"++

    The sequence number of the queued transfer.

??? interface "Returns"

    `sequence` ++"uint64"++

    The sequence number of the completed transfer.

> **Emits**: `TransferSent` (two variants)

### executeMsg

Execute a message when threshold is met. *(Defined in NttManager.sol)*

```sol
function executeMsg(
    uint16 sourceChainId,
    bytes32 sourceNttManagerAddress,
    TransceiverStructs.NttManagerMessage memory message
) external
```

??? interface "Parameters"

    `sourceChainId` ++"uint16"++

    The chain ID of the source.

    ---

    `sourceNttManagerAddress` ++"bytes32"++

    The address of the source NttManager.

    ---

    `message` ++"TransceiverStructs.NttManagerMessage"++

    The message to execute containing transfer details.

    ??? child "`NttManagerMessage` struct"

        `id` ++"bytes32"++

        Unique message identifier (incrementally assigned on EVM chains).
        
        ---

        `sender` ++"bytes32"++

        Original message sender address.
        
        ---

        `payload` ++"bytes"++

        Payload that corresponds to the transfer type.

> **Emits**: `MessageAlreadyExecuted` (if already executed), `OutboundTransferCancelled` or `TransferRedeemed` (depending on transfer type)

### getCurrentInboundCapacity

Returns the currently remaining inbound capacity from a chain. *(Defined in RateLimiter.sol)*

```sol
function getCurrentInboundCapacity(uint16 chainId) external view returns (uint256)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID to check capacity for.

??? interface "Returns"

    `capacity` ++"uint256"++

    The current available inbound capacity from the specified chain.

### getCurrentOutboundCapacity

Returns the currently remaining outbound capacity. *(Defined in RateLimiter.sol)*

```sol
function getCurrentOutboundCapacity() public view returns (uint256)
```

??? interface "Returns"

    `capacity` ++"uint256"++

    The current available outbound capacity.

### getInboundLimitParams

Returns the inbound rate limit parameters for a chain. *(Defined in RateLimiter.sol)*

```sol
function getInboundLimitParams(uint16 chainId_) external view returns (RateLimitParams memory)
```

??? interface "Parameters"

    `chainId_` ++"uint16"++

    The chain ID to get parameters for.

??? interface "Returns"

    `params` ++"RateLimitParams struct"++

    The inbound rate limit parameters for the specified chain.

    ??? child "`RateLimitParams` struct"

        `limit` ++"TrimmedAmount"++

        Current rate limit value.
        
        ---

        `currentCapacity` ++"TrimmedAmount"++

        The current capacity left.
        
        ---

        `lastTxTimestamp` ++"uint64"++

        Timestamp of when capacity was previously consumed.

### getInboundQueuedTransfer

Returns queued transfer details for inbound queue. *(Defined in RateLimiter.sol)*

```sol
function getInboundQueuedTransfer(bytes32 digest) external view returns (InboundQueuedTransfer memory)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the queued transfer.

??? interface "Returns"

    `transfer` ++"InboundQueuedTransfer struct"++

    The queued transfer details.

    ??? child "`InboundQueuedTransfer` struct"

        `amount` ++"TrimmedAmount"++

        The amount of the transfer, trimmed.
        
        ---

        `txTimestamp` ++"uint64"++

        The timestamp of the transfer.
        
        ---

        `recipient` ++"address"++

        The recipient of the transfer.

### getMode

Returns the mode (locking or burning) of the NttManager. *(Defined in ManagerBase.sol)*

```sol
function getMode() public view returns (uint8)
```

??? interface "Returns"

    `mode` ++"uint8"++

    The mode of the NttManager (0 for LOCKING, 1 for BURNING).

    ??? child "`Mode` enum values"

        `LOCKING` ++"0"++

        Tokens are locked on the source chain and unlocked on the destination chain.
        
        ---

        `BURNING` ++"1"++

        Tokens are burned on the source chain and minted on the destination chain.

### getMigratesImmutables

Returns whether the contract migrates immutables. *(Defined in Implementation.sol)*

```sol
function getMigratesImmutables() external view returns (bool)
```

??? interface "Returns"

    `migrates` ++"bool"++

    Whether the contract migrates immutables.

### getOutboundLimitParams

Returns the outbound rate limit parameters. *(Defined in RateLimiter.sol)*

```sol
function getOutboundLimitParams() external view returns (RateLimitParams memory)
```

??? interface "Returns"

    `params` ++"RateLimitParams struct"++

    The outbound rate limit parameters.

    ??? child "`RateLimitParams` struct"

        `limit` ++"TrimmedAmount"++

        Current rate limit value.
        
        ---

        `currentCapacity` ++"TrimmedAmount"++

        The current capacity left.
        
        ---

        `lastTxTimestamp` ++"uint64"++

        Timestamp of when capacity was previously consumed.

### getOutboundQueuedTransfer

Returns queued transfer details for outbound queue. *(Defined in RateLimiter.sol)*

```sol
function getOutboundQueuedTransfer(uint64 queueSequence) external view returns (OutboundQueuedTransfer memory)
```

??? interface "Parameters"

    `queueSequence` ++"uint64"++

    The sequence number of the queued transfer.

??? interface "Returns"

    `transfer` ++"OutboundQueuedTransfer struct"++

    The queued transfer details.

    ??? child "`OutboundQueuedTransfer` struct"

        `recipient` ++"bytes32"++

        The recipient of the transfer.
        
        ---

        `refundAddress` ++"bytes32"++

        The refund address for unused gas.
        
        ---

        `amount` ++"TrimmedAmount"++

        The amount of the transfer, trimmed.
        
        ---

        `txTimestamp` ++"uint64"++

        The timestamp of the transfer.
        
        ---

        `recipientChain` ++"uint16"++

        The chain of the recipient.
        
        ---

        `sender` ++"address"++

        The sender of the transfer.
        
        ---

        `transceiverInstructions` ++"bytes"++

        Additional instructions for the recipient chain.

### getPeer

Returns peer information for a given chain ID. *(Defined in NttManager.sol)*

```sol
function getPeer(uint16 chainId_) external view returns (NttManagerPeer memory)
```

??? interface "Parameters"

    `chainId_` ++"uint16"++

    The chain ID of the peer.

??? interface "Returns"

    `peer` ++"NttManagerPeer struct"++

    The peer information for the given chain ID.

    ??? child "`NttManagerPeer` struct"

        `peerAddress` ++"bytes32"++

        The address of the peer contract on the remote chain.
        
        ---

        `tokenDecimals` ++"uint8"++

        The number of decimals for the peer token.

### getThreshold

Returns the number of transceivers that must attest to a message. *(Defined in ManagerBase.sol)*

```sol
function getThreshold() external view returns (uint8)
```

??? interface "Returns"

    `threshold` ++"uint8"++

    The number of attestations required for a message to be considered valid.

### getTransceiverInfo

Returns the info for all enabled transceivers. *(Defined in TransceiverRegistry.sol)*

```sol
function getTransceiverInfo() external view returns (TransceiverInfo[] memory)
```

??? interface "Returns"

    `info` ++"TransceiverInfo[] memory"++

    An array of transceiver information structs.

    ??? child "`TransceiverInfo` struct"

        `registered` ++"bool"++

        Whether this transceiver is registered.
        
        ---

        `enabled` ++"bool"++

        Whether this transceiver is enabled.
        
        ---

        `index` ++"uint8"++

        Index of the transceiver.

### getTransceivers

Returns the enabled Transceiver contracts. *(Defined in TransceiverRegistry.sol)*

```sol
function getTransceivers() external view returns (address[] memory)
```

??? interface "Returns"

    `result` ++"address[] memory"++

    An array of enabled transceiver addresses.

### initialize

Initializes the contract. *(Defined in Implementation.sol)*

```sol
function initialize() external payable
```

### isMessageApproved

Checks if a message has been approved with at least the minimum threshold of attestations from distinct endpoints. *(Defined in ManagerBase.sol)*

```sol
function isMessageApproved(bytes32 digest) external view returns (bool)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The keccak-256 hash of the message.

??? interface "Returns"

    `approved` ++"bool"++

    Whether the message has been approved.

### isMessageExecuted

Checks if a message has been executed. *(Defined in ManagerBase.sol)*

```sol
function isMessageExecuted(bytes32 digest) external view returns (bool)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The keccak-256 hash of the message.

??? interface "Returns"

    `executed` ++"bool"++

    Whether the message has been executed.

### isPaused

Returns true if the contract is paused, and false otherwise. *(Defined in PausableUpgradeable.sol)*

```sol
function isPaused() external view returns (bool)
```

??? interface "Returns"

    `paused` ++"bool"++

    Whether the contract is paused.

### messageAttestations

Returns the number of attestations for a given message. *(Defined in ManagerBase.sol)*

```sol
function messageAttestations(bytes32 digest) external view returns (uint8)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The keccak-256 hash of the message.

??? interface "Returns"

    `count` ++"uint8"++

    The number of attestations for the message.

### migrate

Migrates the contract state to a new implementation. *(Defined in Implementation.sol)*

```sol
function migrate() external
```

### nextMessageSequence

Returns the next message sequence. *(Defined in ManagerBase.sol)*

```sol
function nextMessageSequence() external view returns (uint64)
```

??? interface "Returns"

    `sequence` ++"uint64"++

    The next message sequence number.

### owner

Returns the address of the current owner. *(Defined in OwnableUpgradeable.sol)*

```sol
function owner() external view returns (address)
```

??? interface "Returns"

    `owner` ++"address"++

    The address of the current owner.

### pause

Pauses the manager. *(Defined in ManagerBase.sol)*

```sol
function pause() external
```

> **Emits**: `Paused`

### pauser

Returns the current pauser account address. *(Defined in PausableUpgradeable.sol)*

```sol
function pauser() external view returns (address)
```

??? interface "Returns"

    `pauser` ++"address"++

    The address of the current pauser.

### quoteDeliveryPrice

Fetches the delivery price for a given recipient chain transfer. *(Defined in ManagerBase.sol)*

```sol
function quoteDeliveryPrice(
    uint16 recipientChain, 
    bytes memory transceiverInstructions
) public view returns (uint256[] memory, uint256)
```

??? interface "Parameters"

    `recipientChain` ++"uint16"++

    The chain ID of the recipient.

    ---

    `transceiverInstructions` ++"bytes"++

    The transceiver-specific instructions for the transfer.

??? interface "Returns"

    `deliveryQuotes` ++"uint256[] memory"++

    An array of delivery quotes from each transceiver.

    ---

    `totalPrice` ++"uint256"++

    The total price for delivery across all transceivers.

### removeTransceiver

Removes the transceiver for the given chain. *(Defined in ManagerBase.sol)*

```sol
function removeTransceiver(address transceiver) external
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The address of the transceiver contract to remove.

### setInboundLimit

Set the inbound transfer limit for a specific chain. *(Defined in NttManager.sol)*

```sol
function setInboundLimit(uint256 limit, uint16 chainId_) external
```

??? interface "Parameters"

    `limit` ++"uint256"++

    The new inbound transfer limit.

    ---

    `chainId_` ++"uint16"++

    The chain ID to set the limit for.

### setOutboundLimit

Set the outbound transfer limit. *(Defined in NttManager.sol)*

```sol
function setOutboundLimit(uint256 limit) external
```

??? interface "Parameters"

    `limit` ++"uint256"++

    The new outbound transfer limit.

### setPeer

Set peer contract information for a specific chain. *(Defined in NttManager.sol)*

```sol
function setPeer(
    uint16 peerChainId,
    bytes32 peerContract,
    uint8 decimals,
    uint256 inboundLimit
) external
```

??? interface "Parameters"

    `peerChainId` ++"uint16"++

    The chain ID of the peer.

    ---

    `peerContract` ++"bytes32"++

    The address of the peer contract.

    ---

    `decimals` ++"uint8"++

    The number of decimals for the peer token.

    ---

    `inboundLimit` ++"uint256"++

    The inbound transfer limit for this peer.

> **Emits**: `PeerUpdated`

### setThreshold

Sets the threshold for the number of attestations required for a message to be considered valid. *(Defined in ManagerBase.sol)*

```sol
function setThreshold(uint8 threshold) external
```

??? interface "Parameters"

    `threshold` ++"uint8"++

    The number of attestations required.

> **Emits**: `ThresholdChanged`

### setTransceiver

Sets the transceiver for the given chain. *(Defined in ManagerBase.sol)*

```sol
function setTransceiver(address transceiver) external
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The address of the transceiver contract.

> **Emits**: `TransceiverAdded`

### tokenDecimals

Returns the number of decimals for the token. *(Defined in NttManager.sol)*

```sol
function tokenDecimals() external view returns (uint8)
```

??? interface "Returns"

    `decimals` ++"uint8"++

    The number of decimals for the token.

### transceiverAttestedToMessage

Returns if the transceiver has attested to the message. *(Defined in ManagerBase.sol)*

```sol
function transceiverAttestedToMessage(bytes32 digest, uint8 index) external view returns (bool)
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The keccak-256 hash of the message.

    ---

    `index` ++"uint8"++

    The index of the transceiver.

??? interface "Returns"

    `attested` ++"bool"++

    Whether the transceiver has attested to the message.

### transfer (basic)

Transfer tokens (simple version). *(Defined in NttManager.sol)*

```sol
function transfer(
    uint256 amount, 
    uint16 recipientChain, 
    bytes32 recipient
) external payable returns (uint64)
```

??? interface "Parameters"

    `amount` ++"uint256"++

    The amount of tokens to transfer.

    ---

    `recipientChain` ++"uint16"++

    The chain ID of the recipient.

    ---

    `recipient` ++"bytes32"++

    The recipient address on the destination chain.

??? interface "Returns"

    `sequence` ++"uint64"++

    The sequence number of the transfer.

> **Emits**: `OutboundTransferRateLimited` (if rate limited), `TransferSent` (two variants, if successful)

### transfer (advanced)

Transfer tokens (full version with additional parameters). *(Defined in NttManager.sol)*

```sol
function transfer(
    uint256 amount,
    uint16 recipientChain,
    bytes32 recipient,
    bytes32 refundAddress,
    bool shouldQueue,
    bytes memory transceiverInstructions
) external payable returns (uint64)
```

??? interface "Parameters"

    `amount` ++"uint256"++

    The amount of tokens to transfer.

    ---

    `recipientChain` ++"uint16"++

    The chain ID of the recipient.

    ---

    `recipient` ++"bytes32"++

    The recipient address on the destination chain.

    ---

    `refundAddress` ++"bytes32"++

    The address to refund unused gas to.

    ---

    `shouldQueue` ++"bool"++

    Whether to queue the transfer if rate limited.

    ---

    `transceiverInstructions` ++"bytes"++

    Additional instructions for transceivers.

??? interface "Returns"

    `sequence` ++"uint64"++

    The sequence number of the transfer.

> **Emits**: `OutboundTransferRateLimited` (if rate limited), `TransferSent` (two variants, if successful)

### transferOwnership

Transfer ownership of the Manager and all Transceiver contracts. *(Defined in ManagerBase.sol)*

```sol
function transferOwnership(address newOwner) external
```

??? interface "Parameters"

    `newOwner` ++"address"++

    The address of the new owner.

> **Emits**: `OwnershipTransferred`

### transferPauserCapability

Transfers the ability to pause to a new account. *(Defined in PausableOwnable.sol)*

```sol
function transferPauserCapability(address newPauser) external
```

??? interface "Parameters"

    `newPauser` ++"address"++

    The address of the new pauser.

> **Emits**: `PauserTransferred`

### upgrade

Upgrades to a new manager implementation. *(Defined in ManagerBase.sol)*

```sol
function upgrade(address newImplementation) external
```

??? interface "Parameters"

    `newImplementation` ++"address"++

    The address of the new implementation contract.

### unpause

Unpauses the manager. *(Defined in ManagerBase.sol)*

```sol
function unpause() external
```

> **Emits**: `NotPaused`

## Errors

### BurnAmountDifferentThanBalanceDiff

Error when burn amount differs from balance difference. *(Defined in NttManager.sol)*

```sol
error BurnAmountDifferentThanBalanceDiff(uint256 burnAmount, uint256 balanceDiff);
```

??? interface "Parameters"

    `burnAmount` ++"uint256"++

    The amount that was burned.

    ---

    `balanceDiff` ++"uint256"++

    The actual balance difference.

### CallerNotTransceiver

Error when the caller is not the transceiver. *(Defined in TransceiverRegistry.sol)*

```sol
error CallerNotTransceiver(address caller);
```

??? interface "Parameters"

    `caller` ++"address"++

    The address that is not a transceiver.

### CancellerNotSender

Error when someone other than the original sender tries to cancel a queued outbound transfer. *(Defined in NttManager.sol)*

```sol
error CancellerNotSender(address canceller, address sender);
```

??? interface "Parameters"

    `canceller` ++"address"++

    The address attempting to cancel.

    ---

    `sender` ++"address"++

    The original sender address.

### CapacityCannotExceedLimit

The new capacity cannot exceed the limit. *(Defined in RateLimiter.sol)*

```sol
error CapacityCannotExceedLimit(TrimmedAmount newCurrentCapacity, TrimmedAmount newLimit);
```

??? interface "Parameters"

    `newCurrentCapacity` ++"TrimmedAmount"++

    The new current capacity value.

    ??? child "`TrimmedAmount` type"

        `amount` ++"uint64"++

        The amount value (64 bits).
        
        ---

        `decimals` ++"uint8"++

        The number of decimals (8 bits).

    ---

    `newLimit` ++"TrimmedAmount"++

    The new limit value.

    ??? child "`TrimmedAmount` type"

        `amount` ++"uint64"++

        The amount value (64 bits).
        
        ---

        `decimals` ++"uint8"++

        The number of decimals (8 bits).

### DeliveryPaymentTooLow

Payment for a transfer is too low. *(Defined in ManagerBase.sol)*

```sol
error DeliveryPaymentTooLow(uint256 requiredPayment, uint256 providedPayment);
```

??? interface "Parameters"

    `requiredPayment` ++"uint256"++

    The required payment amount.

    ---

    `providedPayment` ++"uint256"++

    The payment amount that was provided.

### DisabledTransceiver

Error when the transceiver is disabled. *(Defined in TransceiverRegistry.sol)*

```sol
error DisabledTransceiver(address transceiver);
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The disabled transceiver address.

### InboundQueuedTransferNotFound

The inbound transfer is no longer queued. *(Defined in RateLimiter.sol)*

```sol
error InboundQueuedTransferNotFound(bytes32 digest);
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the queued transfer.

### InboundQueuedTransferStillQueued

The transfer is still queued. *(Defined in RateLimiter.sol)*

```sol
error InboundQueuedTransferStillQueued(bytes32 digest, uint256 transferTimestamp);
```

??? interface "Parameters"

    `digest` ++"bytes32"++

    The digest of the queued transfer.

    ---

    `transferTimestamp` ++"uint256"++

    The timestamp of the transfer.

### InvalidInitialization

Error when the contract is in an invalid initialization state. *(Defined in Initializable.sol)*

```sol
error InvalidInitialization();
```

### InvalidMode

The mode is invalid (neither LOCKING nor BURNING). *(Defined in NttManager.sol)*

```sol
error InvalidMode(uint8 mode);
```

??? interface "Parameters"

    `mode` ++"uint8"++

    The invalid mode value.

### InvalidPauser

Error when the pauser is not a valid pauser account. *(Defined in PausableUpgradeable.sol)*

```sol
error InvalidPauser(address account);
```

??? interface "Parameters"

    `account` ++"address"++

    The invalid pauser account address.

### InvalidPeer

Peer for the chain does not match the configuration. *(Defined in NttManager.sol)*

```sol
error InvalidPeer(uint16 chainId, bytes32 peerAddress);
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID of the peer.

    ---

    `peerAddress` ++"bytes32"++

    The peer address that doesn't match.

### InvalidPeerChainIdZero

Peer chain ID cannot be zero. *(Defined in NttManager.sol)*

```sol
error InvalidPeerChainIdZero();
```

### InvalidPeerDecimals

Peer cannot have zero decimals. *(Defined in NttManager.sol)*

```sol
error InvalidPeerDecimals();
```

### InvalidPeerSameChainId

Peer cannot be on the same chain. *(Defined in NttManager.sol)*

```sol
error InvalidPeerSameChainId();
```

### InvalidPeerZeroAddress

Peer cannot be the zero address. *(Defined in NttManager.sol)*

```sol
error InvalidPeerZeroAddress();
```

### InvalidRecipient

Error when the recipient is invalid. *(Defined in NttManager.sol)*

```sol
error InvalidRecipient();
```

### InvalidRefundAddress

Error when the refund address is invalid. *(Defined in NttManager.sol)*

```sol
error InvalidRefundAddress();
```

### InvalidTargetChain

Error when trying to execute a message on an unintended target chain. *(Defined in NttManager.sol)*

```sol
error InvalidTargetChain(uint16 targetChain, uint16 thisChain);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    The target chain ID from the message.

    ---

    `thisChain` ++"uint16"++

    The current chain ID.

### InvalidTransceiverZeroAddress

Error when the transceiver is the zero address. *(Defined in TransceiverRegistry.sol)*

```sol
error InvalidTransceiverZeroAddress();
```

### MessageNotApproved

Error when the message is not approved. *(Defined in ManagerBase.sol)*

```sol
error MessageNotApproved(bytes32 msgHash);
```

??? interface "Parameters"

    `msgHash` ++"bytes32"++

    The hash of the message that is not approved.

### NoEnabledTransceivers

There are no transceivers enabled with the Manager. *(Defined in ManagerBase.sol)*

```sol
error NoEnabledTransceivers();
```

### NonRegisteredTransceiver

Error when attempting to remove a transceiver that is not registered. *(Defined in TransceiverRegistry.sol)*

```sol
error NonRegisteredTransceiver(address transceiver);
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The non-registered transceiver address.

### NotEnoughCapacity

Not enough capacity to send the transfer. *(Defined in RateLimiter.sol)*

```sol
error NotEnoughCapacity(uint256 currentCapacity, uint256 amount);
```

??? interface "Parameters"

    `currentCapacity` ++"uint256"++

    The current available capacity.

    ---

    `amount` ++"uint256"++

    The requested transfer amount.

### NotInitializing

Error when a function can only be called during initialization. *(Defined in Initializable.sol)*

```sol
error NotInitializing();
```

### NotMigrating

Error when a function can only be called during migration. *(Defined in Implementation.sol)*

```sol
error NotMigrating();
```

### NotImplemented

Feature is not implemented. *(Defined in INttManager.sol)*

```sol
error NotImplemented();
```

### OnlyDelegateCall

Error when a function can only be called via delegate call. *(Defined in Implementation.sol)*

```sol
error OnlyDelegateCall();
```

### OwnableInvalidOwner

Error when the owner is not a valid owner account. *(Defined in OwnableUpgradeable.sol)*

```sol
error OwnableInvalidOwner(address owner);
```

??? interface "Parameters"

    `owner` ++"address"++

    The invalid owner address.

### OwnableUnauthorizedAccount

Error when the caller account is not authorized to perform an operation. *(Defined in OwnableUpgradeable.sol)*

```sol
error OwnableUnauthorizedAccount(address account);
```

??? interface "Parameters"

    `account` ++"address"++

    The unauthorized account address.

### OutboundQueuedTransferNotFound

Outbound transfer is no longer queued. *(Defined in RateLimiter.sol)*

```sol
error OutboundQueuedTransferNotFound(uint64 queueSequence);
```

??? interface "Parameters"

    `queueSequence` ++"uint64"++

    The sequence number of the queued transfer.

### OutboundQueuedTransferStillQueued

Cannot complete the outbound transfer, still queued. *(Defined in RateLimiter.sol)*

```sol
error OutboundQueuedTransferStillQueued(uint64 queueSequence, uint256 transferTimestamp);
```

??? interface "Parameters"

    `queueSequence` ++"uint64"++

    The sequence number of the queued transfer.

    ---

    `transferTimestamp` ++"uint256"++

    The timestamp of the transfer.

### PeerNotRegistered

Error when the manager doesn't have a peer registered for the destination chain. *(Defined in ManagerBase.sol)*

```sol
error PeerNotRegistered(uint16 chainId);
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    The chain ID for which no peer is registered.

### RefundFailed

Error when the refund to the sender fails. *(Defined in ManagerBase.sol)*

```sol
error RefundFailed(uint256 refundAmount);
```

??? interface "Parameters"

    `refundAmount` ++"uint256"++

    The amount that failed to be refunded.

### RequireContractIsNotPaused

Error when a function requires the contract to not be paused. *(Defined in PausableUpgradeable.sol)*

```sol
error RequireContractIsNotPaused();
```

### RequireContractIsPaused

Error when a function requires the contract to be paused. *(Defined in PausableUpgradeable.sol)*

```sol
error RequireContractIsPaused();
```

### RetrievedIncorrectRegisteredTransceivers

Retrieved incorrect number of registered transceivers. *(Defined in ManagerBase.sol)*

```sol
error RetrievedIncorrectRegisteredTransceivers(uint256 retrieved, uint256 registered);
```

??? interface "Parameters"

    `retrieved` ++"uint256"++

    The number of transceivers retrieved.

    ---

    `registered` ++"uint256"++

    The number of transceivers that should be registered.

### StaticcallFailed

Staticcall reverted. *(Defined in NttManager.sol)*

```sol
error StaticcallFailed();
```

### ThresholdTooHigh

The threshold for transceiver attestations is too high. *(Defined in ManagerBase.sol)*

```sol
error ThresholdTooHigh(uint256 threshold, uint256 transceivers);
```

??? interface "Parameters"

    `threshold` ++"uint256"++

    The requested threshold value.

    ---

    `transceivers` ++"uint256"++

    The number of available transceivers.

### TooManyTransceivers

Error when the number of registered transceivers exceeds 64. *(Defined in TransceiverRegistry.sol)*

```sol
error TooManyTransceivers();
```

### TransceiverAlreadyAttestedToMessage

Error when the transceiver already attested to the message. *(Defined in ManagerBase.sol)*

```sol
error TransceiverAlreadyAttestedToMessage(bytes32 NttManagerMessageHash);
```

??? interface "Parameters"

    `NttManagerMessageHash` ++"bytes32"++

    The hash of the NTT Manager message.

### TransceiverAlreadyEnabled

Error when attempting to enable a transceiver that is already enabled. *(Defined in TransceiverRegistry.sol)*

```sol
error TransceiverAlreadyEnabled(address transceiver);
```

??? interface "Parameters"

    `transceiver` ++"address"++

    The already enabled transceiver address.

### TransferAmountHasDust

The transfer has some dust. *(Defined in NttManager.sol)*

```sol
error TransferAmountHasDust(uint256 amount, uint256 dust);
```

??? interface "Parameters"

    `amount` ++"uint256"++

    The transfer amount.

    ---

    `dust` ++"uint256"++

    The dust amount.

### UndefinedRateLimiting

If the rate limiting behavior isn't explicitly defined in the constructor. *(Defined in RateLimiter.sol)*

```sol
error UndefinedRateLimiting();
```

### UnexpectedDeployer

The caller is not the deployer. *(Defined in NttManager.sol)*

```sol
error UnexpectedDeployer(address expectedOwner, address owner);
```

??? interface "Parameters"

    `expectedOwner` ++"address"++

    The expected owner address.

    ---

    `owner` ++"address"++

    The actual owner address.

### UnexpectedMsgValue

An unexpected msg.value was passed with the call. *(Defined in NttManager.sol)*

```sol
error UnexpectedMsgValue();
```

### ZeroAmount

Error when the transfer amount is zero. *(Defined in NttManager.sol)*

```sol
error ZeroAmount();
```

### ZeroThreshold

The number of thresholds should not be zero. *(Defined in ManagerBase.sol)*

```sol
error ZeroThreshold();
```
