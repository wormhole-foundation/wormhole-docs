---
title: Core Contract (EVM)
description: Reference for the Wormhole Core contract deployed on EVM chains. Includes the proxy structure, exposed events, functions, and usage tips.
categories: Basics
---

# Core Contract (EVM)

The [Wormhole Core Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/Implementation.sol){target=\_blank} chains is a proxy-based contract responsible for receiving and verifying Wormhole messages (VAAs). It implements the messaging interface and delegates logic to upgradeable implementation contracts.

## Structure Overview

The Wormhole Core system on EVM uses an upgradeable proxy architecture, separating interface and logic. The proxy delegates calls to an implementation contract, which is composed of multiple modular components.

```text
Wormhole.sol (Proxy)
└── Implementation.sol
    └── Governance.sol
        ├── GovernanceStructs.sol
        ├── Messages.sol
        ├── Setters.sol
        └── Structs.sol
```

**Key Components:**

 - **Wormhole.sol**: The upgradeable proxy contract that delegates all logic to `Implementation.sol`.
 - **Implementation.sol**: The main logic contract, which handles message publication and initialization. Inherits from Governance.sol.
 - **Governance.sol**: Core governance logic for processing upgrades, setting fees, and updating the Guardian set. Also responsible for verifying governance VAAs and performing privileged actions.
 - **GovernanceStructs.sol**: Provides structures and helpers for processing governance-related VAAs.
 - **Messages.sol**: Handles VAA parsing and verification.
 - **Setters.sol**: Contains internal functions for mutating contract state.
 - **Structs.sol**: Defines core data structures like GuardianSet and VM (VAA Message) used across multiple modules.

## State Variables

 - `provider` ++"Structs.Provider"++ - Holds metadata like `chainId`, `governanceChainId`, and `governanceContract`. This is a nested struct.
 - `guardianSets` ++"mapping(uint32 => GuardianSet)"++ - Mapping of all guardian sets by index.
 - `guardianSetIndex` ++"uint32"++ - Index of the currently active guardian set.
 - `guardianSetExpiry` ++"uint32"++ - How long a guardian set remains valid after it's replaced (in seconds).
 - `sequences` ++"mapping(address => uint64)"++ - Tracks message sequences per emitter (used to enforce message ordering).
 - `consumedGovernanceActions` ++"mapping(bytes32 => bool)"++ - Used to prevent governance VAAs from being reused (replay protection).
 - `initializedImplementations` ++"mapping(address => bool)"++ - Tracks which implementation addresses have been initialized (for upgrade safety).
 - `messageFee` ++"uint256"++ - The amount (in native gas token) required to post a message. Set via governance.
 - `evmChainId` ++"uint256"++ - The actual EVM chain ID (e.g. 1 for Ethereum, 10 for Optimism). Used in fork recovery.

## Functions

### publishMessage

Publishes a message to Wormhole's Guardian Network.

```solidity
function publishMessage(
    uint32 nonce,
    bytes memory payload,
    uint8 consistencyLevel
) public payable returns (uint64 sequence)
```

??? interface "Parameters"

    `nonce` ++"uint32"++

    Custom sequence identifier for the emitter.

    ---

    `payload` ++"bytes"++

    Arbitrary user data to be included in the message.

    ---

    `consistencyLevel` ++"uint8"++

    Finality requirement for Guardian attestation (e.g., safe or finalized).

??? interface "Returns"

    `sequence` ++"uint64"++

    Unique sequence number assigned to this message.

### getCurrentGuardianSetIndex

Returns the index of the currently active Guardian set.

Each VAA includes the index of the Guardian set that signed it. This function allows contracts to retrieve the current index, ensuring the VAA is verified against the correct set.

```solidity
function getCurrentGuardianSetIndex() external view returns (uint32)
```

??? interface "Returns"

    `index` ++"uint32"++

    The index of the active Guardian set used to verify signatures.

### getGuardianSet

Retrieves metadata for a given Guardian set index.

```solidity
function getGuardianSet(uint32 index) external view returns (address[] memory keys, uint32 expirationTime)
```

??? interface "Parameters"

    `index` ++"uint32"++

    Guardian set index to query.

??? interface "Returns"

    `keys` ++"address[]"++

    Public keys of the guardians in this set.

    ---

    `expirationTime` ++"uint32"++

    Timestamp after which the Guardian set is considered expired.

### getGuardianSetExpiry

Returns the expiration time of a specific Guardian set index.

```solidity
function getGuardianSetExpiry(uint32 index) external view returns (uint32)
```

??? interface "Parameters"

    `index` ++"uint32"++

    The index of the Guardian set to query.

??? interface "Returns"

    `expiry` ++"uint32"++

    UNIX timestamp after which the set is no longer valid.

### messageFee

Returns the current fee (in native tokens) required to publish a message.

```solidity
function messageFee() public view returns (uint256)
```

??? interface "Returns"

    `fee` ++"uint256"++

    Fee in wei required to publish a message successfully. Must be sent as `msg.value`.

### nextSequence

Retrieves the next sequence number for a given emitter address.

```solidity
function nextSequence(address emitter) external view returns (uint64)
```

??? interface "Parameters"

    `emitter` ++"address"++

    The address for which the next sequence will be issued.

??? interface "Returns"

    `sequence` ++"uint64"++

    The next sequence number for the specified emitter.

### parseAndVerifyVM

Verifies signatures and parses a signed VAA.

```solidity
function parseAndVerifyVM(bytes memory encodedVM)
    external
    view
    returns (
        VM memory vm,
        bool valid,
        string memory reason
    )
```

??? interface "Parameters"

    `encodedVM` ++"bytes"++

    Serialized signed VAA from Guardians.

??? interface "Returns"

    `vm` ++"VM memory"++

    Full parsed VAA contents

    ---

    `valid` ++"bool"++

    Whether the VAA is valid according to the current Guardian set.

    ---

    `reason` ++"string"++

    Reason for invalidity if `valid` is false (invalid).

### verifyVM

Performs low-level VAA signature verification.

```solidity
function verifyVM(bytes memory encodedVM)
    public view returns (bool isValid, string memory reason)
```

??? interface "Parameters"

    `encodedVM` ++"bytes"++

    Serialized signed VAA to verify.

??? interface "Returns"

    `isValid` ++"bool"++

    `true` if the signatures are valid and meet the quorum.

    ---

    `reason` ++"string"++

    Explanation for failure if `isValid` is `false`.

### verifySignatures

Used to verify individual Guardian signatures against a VAA digest.

```solidity
function verifySignatures(
    bytes32 hash,
    Structs.Signature[] memory signatures,
    GuardianSet memory guardianSet
) public view returns (bool)
```

??? interface "Parameters"

    `hash` ++"bytes32"++

    The message digest to verify.

    ---

    `signatures` ++"Structs.Signature[]"++

    An array of Guardian signatures.

    ---

    `guardianSet` ++"GuardianSet memory"++

    Guardian set to validate against.

??? interface "Returns"

    `isValid` ++"bool"++

    `true` if the required number of valid signatures is present.

### quorum

Returns the number of Guardian signatures required to reach quorum.

```solidity
function quorum() public view returns (uint8)
```

??? interface "Returns"

    `quorum` ++"uint8"++

    Number of valid Guardian signatures required to reach consensus for VAA verification.

### chainId

Returns Wormhole chain ID used internally by the protocol.

```solidity
function chainId() public view returns (uint16)
```

??? interface "Returns"

    `id` ++"uint16"++

    Wormhole-specific chain identifier. 

### evmChainId

Returns the EVM chain ID (i.e., value from block.chainid).

```solidity
function evmChainId() public view returns (uint256)
```

??? interface "Returns"

    `id` ++"uint256"++

    Native EVM chain ID for the current network.

## Events

### LogMessagePublished

Emitted when a message is published via `publishMessage`.

```solidity
event LogMessagePublished(
    address indexed sender,
    uint64 sequence,
    uint32 nonce,
    bytes payload,
    uint8 consistencyLevel
)
```

??? interface "Parameters"

    `sender` ++"address"++  

    Address that called `publishMessage`.

    ---

    `sequence` ++"uint64"++

    The sequence number of the message.

    ---

    `nonce` ++"uint32"++

    The provided nonce.

    ---

    `payload` ++"bytes"++

    The payload that was published.

    ---

    `consistencyLevel` ++"uint8"++

    Finality level requested.

### ContractUpgraded

Emitted when the Core Contract is upgraded to a new implementation via governance.

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
)
```

??? interface "Parameters"

    `oldContract` ++"address"++

    The address of the previous implementation.

    ---

    `newContract` ++"address"++

    The address of the new implementation.

### GuardianSetAdded

Emitted when a new Guardian set is registered via governance.

```solidity
event GuardianSetAdded(
    uint32 indexed index
)
```

??? interface "Parameters"

    `index` ++"uint32"++

    Index of the newly added Guardian set.