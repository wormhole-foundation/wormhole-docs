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

## Events

### SendEvent

Emitted when a send instruction is published and payment is handled. (Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})

```solidity
event SendEvent(
    uint64 indexed sequence,
    LocalNative deliveryQuote,
    LocalNative paymentForExtraReceiverValue
);
```

??? interface "Parameters"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction message.

    ---

    `deliveryQuote` ++"LocalNative"++

    Price charged by the delivery provider (in source-chain currency units).

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra amount (in source-chain currency units) used to top up receiver value on the target chain.

### Delivery

Emitted after a delivery attempt is executed by a delivery provider. (Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})

```solidity
event Delivery(
    address indexed recipientContract,
    uint16 indexed sourceChain,
    uint64 indexed sequence,
    bytes32 deliveryVaaHash,
    DeliveryStatus status,
    Gas gasUsed,
    RefundStatus refundStatus,
    bytes additionalStatusInfo,
    bytes overridesInfo
);
```

??? interface "Parameters"

    `recipientContract` ++"address"++

    Target contract that was called.

    ---

    `sourceChain` ++"uint16"++

    Wormhole chain ID where the delivery was requested.

    ---

    `sequence` ++"uint64"++

    Sequence number of the delivery VAA on the source chain.

    ---

    `deliveryVaaHash` ++"bytes32"++

    Hash of the delivery VAA.

    ---

    `status` ++"DeliveryStatus"++

    `SUCCESS` if the target call did not revert; `RECEIVER_FAILURE` if it reverted.

    ---

    `gasUsed` ++"Gas"++

    Gas consumed when calling the target contract.

    ---

    `refundStatus` ++"RefundStatus"++

    Result of the refund path (same-chain or cross-chain) or `NO_REFUND_REQUESTED`.

    ---

    `additionalStatusInfo` ++"bytes"++

    Empty on success; otherwise truncated return data from the revert.

    ---

    `overridesInfo` ++"bytes"++

    Empty if not an override; otherwise an encoded `DeliveryOverride`.

### ContractUpgraded (WormholeRelayer)

Emitted when the Wormhole Relayer contract is upgraded to a new implementation via governance. (Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
);
```

??? interface "Parameters"

    `oldContract` ++"address"++

    Address of the previous implementation.

    ---

    `newContract` ++"address"++

    Address of the new implementation.

### ContractUpgraded (DeliveryProvider)

Emitted when the Delivery Provider contract is upgraded to a new implementation. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event ContractUpgraded(
    address indexed oldContract,
    address indexed newContract
);
```

??? interface "Parameters"

    `oldContract` ++"address"++

    Address of the previous implementation.

    ---

    `newContract` ++"address"++

    Address of the new implementation.

### ChainSupportUpdated

Emitted when Delivery Provider support for a target chain is changed. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event ChainSupportUpdated(
    uint16 targetChain,
    bool isSupported
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose support setting changed.

    ---

    `isSupported` ++"bool"++

    Whether deliveries to `targetChain` are supported.

### OwnershipTransfered

Emitted when Delivery Provider ownership is transferred. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event OwnershipTransfered(
    address indexed oldOwner,
    address indexed newOwner
);
```

??? interface "Parameters"

    `oldOwner` ++"address"++

    Previous owner.

    ---

    `newOwner` ++"address"++

    New owner.

### RewardAddressUpdated

Emitted when the Delivery Provider reward address is updated. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event RewardAddressUpdated(
    address indexed newAddress
);
```

??? interface "Parameters"

    `newAddress` ++"address"++

    New reward address.

### TargetChainAddressUpdated

Emitted when the Delivery Provider’s peer address for a target chain is updated. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event TargetChainAddressUpdated(
    uint16 indexed targetChain,
    bytes32 indexed newAddress
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose peer address changed.

    ---

    `newAddress` ++"bytes32"++

    New peer address in Wormhole bytes32 format.

### DeliverGasOverheadUpdated

Emitted when the configured gas overhead for deliveries is updated. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event DeliverGasOverheadUpdated(
    Gas indexed oldGasOverhead,
    Gas indexed newGasOverhead
);
```

??? interface "Parameters"

    `oldGasOverhead` ++"Gas"++

    Previous overhead value.

    ---

    `newGasOverhead` ++"Gas"++

    New overhead value.

### WormholeRelayerUpdated

Emitted when the Delivery Provider’s associated Wormhole Relayer address is updated. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event WormholeRelayerUpdated(
    address coreRelayer
);
```

??? interface "Parameters"

    `coreRelayer` ++"address"++

    New Wormhole Relayer contract address on this chain.

### AssetConversionBufferUpdated

Emitted when the Delivery Provider’s asset conversion buffer is updated. (Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})

```solidity
event AssetConversionBufferUpdated(
    uint16 targetChain,
    uint16 buffer,
    uint16 bufferDenominator
);
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID whose buffer settings changed.

    ---

    `buffer` ++"uint16"++

    Buffer numerator.

    ---

    `bufferDenominator` ++"uint16"++

    Buffer denominator.


