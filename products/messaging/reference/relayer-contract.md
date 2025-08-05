---
title: Relayer Contract
description: Reference for the Wormhole Relayer contract on EVM chains. Covers the proxy structure, components, state variables, functions, events, and errors.
categories: Basics
---

# Relayer Contract

The [Wormhole Core Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayer.sol){target=\_blank} chains is a proxy-based contract responsible for receiving and verifying Wormhole messages (VAAs). It implements the messaging interface and delegates logic to upgradeable implementation contracts.

## Structure Overview

The Wormhole Relayer system on EVM is implemented as a modular, upgradeable contract suite, organized through layered inheritance and interfaces.

```text
IWormholeRelayer.sol (Interface)
└── WormholeRelayerBase.sol
    ├── WormholeRelayer.sol
    ├── CircleRelayer.sol
    └── TypedUnits.sol
DeliveryProvider.sol (Standalone)
```

**Key Components:**

 - **IWormholeRelayer.sol**: Defines the public interface for the Wormhole Relayer, including delivery functions and fee quoting.
 - **WormholeRelayerBase.sol**: Base logic contract shared by both WormholeRelayer and CircleRelayer. Handles delivery processing, fee management, and VAA parsing.
 - **WormholeRelayer.sol**: Main relayer implementation used with the Wormhole Messaging protocol. Inherits from `WormholeRelayerBase`.
 - **CircleRelayer.sol**: Specialized implementation for Circle messages. Also extends `WormholeRelayerBase`, but is out of scope for this reference.
 - **TypedUnits.sol**: Utility module for safe unit conversions, fee accounting, and delivery quote handling.
 - **DeliveryProvider.sol**: Separate contract that sets and manages delivery pricing and supported chains. Queried by the relayer when calculating fees.

## State Variables

 - **`chainId` ++"uint16"++**: Wormhole chain ID for the current network (e.g., 2 for Ethereum).
 - **`wormhole` ++"IWormhole"++**: Address of the core Wormhole messaging contract used to verify VAAs.
 - **`deliveryProvider` ++"address"++**: Address of the Delivery Provider contract responsible for quoting and setting delivery prices.
 - **`rewardAddress` ++"address"++**: Address that receives excess fees collected from users.
 - **`gasOverheads` ++"mapping(uint16 => GasOverhead)"++**: Per-chain gas overheads used to calculate delivery costs.
 - **`supportedChains` ++"mapping(uint16 => bool)"++**: Tracks which destination chains are supported for message delivery.
 - **`deliveries` ++"mapping(bytes32 => bool)"++**: Records completed deliveries (by VAA hash) to prevent replay.
 - **`deliverySuccessBlock` ++"mapping(bytes32 => uint256)"++**: Stores the block number when a delivery succeeded (used for auditing).
 - **`owner` ++"address"++**: Contract owner with permission to update system parameters (e.g., gas overheads).
 - **`chainHash` ++"uint256"++**: EVM chain ID hash used for cross-checking delivery source chain.
 - **`implementation` ++"address"++**: Address of the current logic contract (used in proxy pattern).

### Events

### SendEvent

Emitted when a delivery request is sent to another chain. (Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})

```solidity
event SendEvent(
    uint64 indexed sequence,
    uint16 indexed targetChain,
    address indexed refundAddress,
    uint256 cost,
    bytes payload
)
```

??? interface "Parameters"

    `sequence` ++"uint64"++

    Sequence number of the Wormhole message sent.

    ---

    `targetChain` ++"uint16"++
    Wormhole chain ID of the target chain.

    ---

    `refundAddress` ++"address"++
    Address that will receive any excess fees refunded.

    ---

    `cost` ++"uint256"++
    Total cost paid for the delivery (message fee + gas).

    ---

    `payload` ++"bytes"++
    The encoded delivery request payload.

### Delivery

Emitted when a delivery is executed on the destination chain. (Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=_blank})

```solidity
event Delivery(
    uint64 indexed sourceSequence,
    uint16 indexed sourceChain,
    address indexed recipient,
    bytes32 deliveryHash,
    uint256 gasUsed
)
```

??? interface "Parameters"

    `sourceSequence` ++"uint64"++

    Sequence number of the original delivery request.

    ---

    `sourceChain` ++"uint16"++
    Wormhole chain ID where the delivery request originated.

    ---

    `recipient` ++"address"++
    Contract that received the delivery.

    ---

    `deliveryHash` ++"bytes32"++
    Hash of the delivery request.

    ---

    `gasUsed` ++"uint256"++
    Actual gas used for execution.

### DeliverySuccess

Emitted when a delivery finishes successfully. (Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})

```solidity
event DeliverySuccess(
    bytes32 indexed deliveryHash
)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the successfully completed delivery.

### DeliveryFailure

Emitted when a delivery fails during execution. (Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})

```solidity
event DeliveryFailure(
    bytes32 indexed deliveryHash,
    string reason
)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery request that failed.

    ---

    `reason` ++"string"++

    Reason for failure (error message).

### RewardAddressSet

Emitted when the reward address for a delivery provider is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event RewardAddressSet(
    address indexed newRewardAddress
)
```

??? interface "Parameters"

    `newRewardAddress` ++"address"++

    Address where rewards for this delivery provider will be sent.  

### GasPriceUpdated

Emitted when the gas price for a specific chain is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event GasPriceUpdated(
    uint16 indexed targetChain,
    uint256 newGasPrice
)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID for which the gas price was updated.  

    ---  

    `newGasPrice` ++"uint256"++

    New gas price (in the smallest denomination of the native token for that chain).  

### TargetChainAddressUpdated

Emitted when the relayer’s address on a target chain is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event TargetChainAddressUpdated(
    uint16 indexed targetChain,
    bytes32 newAddress
)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the target chain.  

    ---  

    `newAddress` ++"bytes32"++

    New relayer address on the target chain (in Wormhole format).  

### AssetConversionBufferUpdated

Emitted when the asset conversion buffer is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event AssetConversionBufferUpdated(
    uint16 indexed targetChain,
    uint16 buffer
)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the target chain.  

    ---  

    `buffer` ++"uint16"++

    Buffer percentage applied to asset conversion rates for this chain.  

### AssetConversionUpdated

Emitted when the asset conversion rate for a target chain is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event AssetConversionUpdated(
    uint16 indexed targetChain,
    uint256 conversionRate
)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the target chain.  

    ---  

    `conversionRate` ++"uint256"++

    New conversion rate (in smallest denomination of the asset).  

### TargetChainDefaultDeliveryProviderSet

Emitted when the default delivery provider for a target chain is updated. (Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/DeliveryProvider.sol){target=\_blank})

```solidity
event TargetChainDefaultDeliveryProviderSet(
    uint16 indexed targetChain,
    address indexed newDeliveryProvider
)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the target chain.  

    ---  

    `newDeliveryProvider` ++"address"++

    Address of the new default delivery provider for this chain.  

