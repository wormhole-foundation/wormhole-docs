---
title: Relayer Contract
description: Reference for the Wormhole Relayer contract on EVM chains. Covers the proxy structure, components, state variables, functions, events, and errors.
categories: Reference
url: https://wormhole.com/docs/products/messaging/reference/relayer-contract/
---

# Relayer Contract

The [Wormhole Relayer Contract on EVM](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayer.sol){target=\_blank} enables cross-chain message delivery with automatic execution on the destination chain. It publishes delivery instructions as Wormhole messages and defines the logic to process them via the `deliver` function. The contract supports optional value forwarding, gas refunds, message overrides, and integration with third-party delivery providers.

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

Emitted when a send instruction is published and payment is handled. *(Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

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

    Price charged by the delivery provider (in source chain currency units).

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra amount (in source chain currency units) used to top up the receiver value on the target chain.

### Delivery

Emitted after a delivery attempt is executed by a delivery provider. *(Defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

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

    Empty on success; otherwise, truncated return data from the revert.

    ---

    `overridesInfo` ++"bytes"++

    Empty if not an override; otherwise, an encoded `DeliveryOverride`.

### ContractUpgraded (WormholeRelayer)

Emitted when the Wormhole Relayer contract is upgraded to a new implementation via governance. *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

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

Emitted when the Delivery Provider contract is upgraded to a new implementation. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

Emitted when Delivery Provider support for a target chain is changed. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

Emitted when Delivery Provider ownership is transferred. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

Emitted when the Delivery Provider reward address is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event RewardAddressUpdated(
    address indexed newAddress
);
```

??? interface "Parameters"

    `newAddress` ++"address"++

    New reward address.

### TargetChainAddressUpdated

Emitted when the Delivery Provider's peer address for a target chain is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

Emitted when the configured gas overhead for deliveries is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

Emitted when the Delivery Provider's associated Wormhole Relayer address is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

```solidity
event WormholeRelayerUpdated(
    address coreRelayer
);
```

??? interface "Parameters"

    `coreRelayer` ++"address"++

    New Wormhole Relayer contract address on this chain.

### AssetConversionBufferUpdated

Emitted when the Delivery Provider's asset conversion buffer is updated. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

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

## Functions

### sendPayloadToEvm

Publishes an instruction for the default delivery provider to relay a payload to an EVM target. Must be called with `msg.value == quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)`. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++
    
    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++
    
    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++
    
    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++
    
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress`.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendPayloadToEvm (with refund)

Same as above, but sends any refund to refundAddress on refundChain. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit,
    uint16 refundChain,
    address refundAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++
    
    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++
    
    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++
    
    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++
    
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `gasLimit` ++"Gas"++
    
    Gas limit for calling `targetAddress`.

    ---

    `refundChain` ++"uint16"++
    
    Wormhole chain ID where refunds should be sent.

    ---

    `refundAddress` ++"address"++

    Address on `refundChain` to receive refunds.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendVaasToEvm (with refund)

Publishes an instruction (default delivery provider) to relay a payload and additional VAAs. Refunds go to `refundAddress` on `refundChain`. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendVaasToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    Gas gasLimit,
    VaaKey[] memory vaaKeys,
    uint16 refundChain,
    address refundAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---  

    `targetAddress` ++"address"++

    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---  

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---  

    `receiverValue` ++"TargetNative"++

    Value (destination chain Wei) to forward to `targetAddress`.

    ---  

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress`.

    ---  

    `vaaKeys` ++"VaaKey[]"++

    Extra Wormhole messages (VAAs) to deliver along with `payload`.

    ---  

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---  

    `refundAddress` ++"address"++

    Address on `refundChain` that receives any refund.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### sendToEvm (MessageKeys)

Publishes an instruction using a specific delivery provider, optionally attaching extra receiver value funded on the source chain and arbitrary MessageKeys (e.g., VAAs or other supported keys). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function sendToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    LocalNative paymentForExtraReceiverValue,
    Gas gasLimit,
    uint16 refundChain,
    address refundAddress,
    address deliveryProviderAddress,
    MessageKey[] memory messageKeys,
    uint8 consistencyLevel
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"address"++

    Contract on the destination chain (must implement `IWormholeReceiver`).

    ---

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++  
    Value (destination chain Wei) to forward to `targetAddress`.

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra source chain amount. The delivery provider converts this to destination native and adds it to `receiverValue`.

    ---

    `gasLimit` ++"Gas"++

    Gas limit for calling `targetAddress` on the destination chain.

    ---

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---

    `refundAddress` ++"address"++

    Address on `refundChain` that receives any refund.

    ---

    `deliveryProviderAddress` ++"address"++

    Chosen delivery provider (must implement `IDeliveryProvider`).

    ---

    `messageKeys` ++"MessageKey[]"++

    External messages to deliver (e.g., VAAs). Each key’s `keyType` **must** be supported by the delivery provider; otherwise the call reverts.

    ---

    `consistencyLevel` ++"uint8"++

    Wormhole publishing consistency (e.g., instant vs. finalized) used when emitting the delivery instruction.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### send (MessageKeys, generic)

Generic chain-agnostic form (addresses are Wormhole-formatted bytes32, and execution params are encoded). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function send(
    uint16 targetChain,
    bytes32 targetAddress,
    bytes memory payload,
    TargetNative receiverValue,
    LocalNative paymentForExtraReceiverValue,
    bytes memory encodedExecutionParameters,
    uint16 refundChain,
    bytes32 refundAddress,
    address deliveryProviderAddress,
    MessageKey[] memory messageKeys,
    uint8 consistencyLevel
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `targetAddress` ++"bytes32"++

    Wormhole-formatted 32-byte address of the destination contract.

    ---

    `payload` ++"bytes"++

    Bytes delivered to `targetAddress`.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain native (e.g., Wei) forwarded to `targetAddress`.

    ---

    `paymentForExtraReceiverValue` ++"LocalNative"++

    Extra source chain native to be converted by the delivery provider and added to `receiverValue`.

    ---

    `encodedExecutionParameters` ++"bytes"++

    Versioned execution params for the target chain (e.g., for EVM use `encodeEvmExecutionParamsV1(EvmExecutionParamsV1(gasLimit))`).

    ---

    `refundChain` ++"uint16"++

    Wormhole chain ID where any refund will be sent.

    ---

    `refundAddress` ++"bytes32"++

    Wormhole-formatted address on `refundChain` that receives any refund.

    ---

    `deliveryProviderAddress` ++"address"++

    Chosen delivery provider (must implement `IDeliveryProvider`).

    ---

    `messageKeys` ++"MessageKey[]"++

    External messages to deliver (e.g., VAAs). Each key’s `keyType` **must** be supported by the delivery provider.

    ---

    `consistencyLevel` ++"uint8"++

    Wormhole publishing consistency used when emitting the delivery instruction.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the published delivery instruction.

### resendToEvm

Requests a previously published delivery instruction to be redelivered (EVM convenience). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function resendToEvm(
    VaaKey memory deliveryVaaKey,
    uint16 targetChain,
    TargetNative newReceiverValue,
    Gas newGasLimit,
    address newDeliveryProviderAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `deliveryVaaKey` ++"VaaKey"++

    Identifies the original delivery instruction VAA.

    ---  

    `targetChain` ++"uint16"++

    Wormhole chain ID where the message should be redelivered.

    ---  

    `newReceiverValue` ++"TargetNative"++

    Updated value sent to the target contract.

    ---  

    `newGasLimit` ++"Gas"++

    Updated gas limit for the target call.

    ---  

    `newDeliveryProviderAddress` ++"address"++

    Delivery provider to use for the redelivery.

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the redelivery instruction.

### resend (generic)

Generic redelivery (chain-agnostic execution params). *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function resend(
    VaaKey memory deliveryVaaKey,
    uint16 targetChain,
    TargetNative newReceiverValue,
    bytes memory newEncodedExecutionParameters,
    address newDeliveryProviderAddress
) external payable returns (uint64 sequence)
```

??? interface "Parameters"

    `deliveryVaaKey` ++"VaaKey"++
    
    Identifies the original delivery instruction VAA.

    ---  

    `targetChain` ++"uint16"++
    
    Wormhole chain ID where the message should be redelivered.

    ---  

    `newReceiverValue` ++"TargetNative"++
    
    Updated value to forward to the target contract on the destination chain.

    ---  

    `newEncodedExecutionParameters` ++"bytes"++
    
    Versioned, chain-specific execution params for the redelivery (e.g., for EVM use `encodeEvmExecutionParamsV1(EvmExecutionParamsV1(gasLimit))`).

    ---  

    `newDeliveryProviderAddress` ++"address"++
    
    Delivery provider to use for the redelivery (must implement `IDeliveryProvider`).

??? interface "Returns"

    `sequence` ++"uint64"++

    Sequence number of the redelivery instruction.

### quoteEVMDeliveryPrice (default provider)

Returns the price and refund-per-gas info for an EVM delivery using the default provider. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteEVMDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    Gas gasLimit
) external view returns (LocalNative nativePriceQuote, GasPrice targetChainRefundPerGasUnused)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei that will be forwarded to the target contract.

    ---

    `gasLimit` ++"Gas"++

    Gas limit that will be used to call the target contract.

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request the delivery.
    
    ---

    `targetChainRefundPerGasUnused` ++"GasPrice"++

    Refund rate per unused gas on target chain.

### quoteEVMDeliveryPrice (explicit provider)

Same as above, but quotes using a given provider. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteEVMDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    Gas gasLimit,
    address deliveryProviderAddress
) external view returns (LocalNative nativePriceQuote, GasPrice targetChainRefundPerGasUnused)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei to forward to the target contract.

    ---

    `gasLimit` ++"Gas"++

    Gas limit to call the target contract with.

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request this delivery.

    ---

    `targetChainRefundPerGasUnused` ++"GasPrice"++

    Refund rate per unit of unused gas on the destination chain.

### quoteDeliveryPrice (generic)

Generic quote (versioned execution params), returning price and provider's encoded execution info. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteDeliveryPrice(
    uint16 targetChain,
    TargetNative receiverValue,
    bytes memory encodedExecutionParameters,
    address deliveryProviderAddress
) external view returns (LocalNative nativePriceQuote, bytes memory encodedExecutionInfo)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `receiverValue` ++"TargetNative"++

    Amount of destination chain Wei to forward to the target contract.

    ---

    `encodedExecutionParameters` ++"bytes"++

    Versioned execution parameters (e.g., for `EVM_V1`, encodes the gas limit).

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `nativePriceQuote` ++"LocalNative"++

    Source chain price to request this delivery.

    ---

    `encodedExecutionInfo` ++"bytes"++

    Provider's encoded execution info (e.g., for `EVM_V1`, includes gas limit and refund-per-gas).

### quoteNativeForChain

Converts a source chain amount into extra value that will be delivered on the target chain. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function quoteNativeForChain(
    uint16 targetChain,
    LocalNative currentChainAmount,
    address deliveryProviderAddress
) external view returns (TargetNative targetChainAmount)
```

??? interface "Parameters"

    `targetChain` ++"uint16"++

    Wormhole chain ID of the destination chain.

    ---

    `currentChainAmount` ++"LocalNative"++

    Amount paid on the source chain to fund extra receiver value.

    ---

    `deliveryProviderAddress` ++"address"++

    Address of the chosen provider (implements `IDeliveryProvider`).

??? interface "Returns"

    `targetChainAmount` ++"TargetNative"++

    Extra destination chain Wei that will be added to the call's value.

### getDefaultDeliveryProvider

Returns the current default delivery provider address. *(Defined in [WormholeRelayerSend.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerSend.sol){target=\_blank})*

```solidity
function getDefaultDeliveryProvider() external view returns (address deliveryProvider)
```

??? interface "Returns"

    `deliveryProvider` ++"address"++

    Address of the default `IDeliveryProvider` on this chain.

### deliver

Called by a delivery provider to execute a delivery on the target chain. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*

```solidity
function deliver(
    bytes[] memory encodedVMs,
    bytes memory encodedDeliveryVAA,
    address payable relayerRefundAddress,
    bytes memory deliveryOverrides
) external payable
```

??? interface "Parameters"

    `encodedVMs` ++"bytes[]"+

    Signed Wormhole messages to relay.

    ---

    `encodedDeliveryVAA` ++"bytes"++

    Signed WormholeRelayer instruction VAA.

    ---

    `relayerRefundAddress` ++"address payable"++

    Address to receive any relayer refund.

    ---

    `deliveryOverrides` ++"bytes"++

    Optional encoded overrides (or empty).

### deliveryAttempted

Checks whether a delivery attempt has been made for a given hash. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliveryAttempted(bytes32 deliveryHash) external view returns (bool attempted)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `attempted` ++"bool"++

    `true` if a success or failure block was recorded for this hash.

### deliverySuccessBlock

Block number when a delivery was successfully executed. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliverySuccessBlock(bytes32 deliveryHash) external view returns (uint256 blockNumber)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `blockNumber` ++"uint256"++

    Block number where the delivery was marked successful (0 if never successful).

### deliveryFailureBlock

Block number of the latest failed delivery attempt. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function deliveryFailureBlock(bytes32 deliveryHash) external view returns (uint256 blockNumber)
```

??? interface "Parameters"

    `deliveryHash` ++"bytes32"++

    Hash of the delivery VAA.

??? interface "Returns"

    `blockNumber` ++"uint256"++

    Block number of the most recent failed attempt (0 if none).

### getRegisteredWormholeRelayerContract

Returns the registered Wormhole Relayer contract address (wormhole format) for a given chain ID. *(Defined in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank})*

```solidity
function getRegisteredWormholeRelayerContract(uint16 chainId) external view returns (bytes32)
```

??? interface "Parameters"

    `chainId` ++"uint16"++

    Wormhole chain ID.

??? interface "Returns"

    `address` ++"bytes32"++

    Wormhole-formatted address of the relayer contract registered for `chainId` (zero if none).

### registerWormholeRelayerContract

Registers a Wormhole Relayer contract deployed on another chain (governance VM required). *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function registerWormholeRelayerContract(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the `foreignChainId` and `foreignContractAddress`.

### setDefaultDeliveryProvider

Sets the default delivery provider via a governance VM. *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function setDefaultDeliveryProvider(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the new provider address.

### submitContractUpgrade

Upgrades the Wormhole Relayer contract to a new implementation (governance VM required). *(Defined in [WormholeRelayerGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerGovernance.sol){target=\_blank})*

```solidity
function submitContractUpgrade(bytes memory encodedVm) external
```

??? interface "Parameters"

    `encodedVm` ++"bytes"++

    Signed governance VM that encodes the new implementation address.

## Errors

### InvalidDeliveryVaa

Thrown when the delivery VAA fails `parseAndVerifyVM`. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidEmitter

Emitted when the VAA emitter is not the registered Wormhole Relayer for the source chain. *(Used in WormholeRelayerDelivery.sol, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InsufficientRelayerFunds

Reverts if `msg.value` is less than the required execution + refund budget on the target chain. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### TargetChainIsNotThisChain

Reverts when the instruction's `targetChain` does not match the current chain. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### MessageKeysLengthDoesNotMatchMessagesLength

Reverts when the provided message keys do not match the number of delivered messages. (Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}), defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})

### VaaKeysDoNotMatchVaas

Reverts when described VAAs don't match the actual VAAs delivered. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidOverrideGasLimit

Reverts if a redelivery override sets a gas limit lower than the original. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidOverrideReceiverValue

Reverts if a redelivery override sets a receiver value lower than the original. *(Used in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### InvalidMsgValue

Reverts when msg.value does not equal `wormholeMessageFee` + `deliveryQuote` + `paymentForExtraReceiverValue`. *(Used in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### ReentrantDelivery

Reverts on re-entrant calls to relayer entrypoints guarded by `nonReentrant`. *(Used in [WormholeRelayerBase.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerBase.sol){target=\_blank}, defined in [IWormholeRelayerTyped.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayerTyped.sol){target=\_blank})*

### CallerNotApproved(address msgSender)

Custom error declared for access checks. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### PriceIsZero(uint16 chain)

Reverts if a required price value for a chain is zero during quoting/conversion. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### Overflow(uint256 value, uint256 max)

Reverts when an internal quote exceeds a type's allowed maximum (e.g., gas overhead/price bounds). *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### MaxRefundGreaterThanGasLimitCost(uint256 maxRefund, uint256 gasLimitCost)

Declared to guard refund limits vs. gas limit cost. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### MaxRefundGreaterThanGasLimitCostOnSourceChain(uint256 maxRefund, uint256 gasLimitCost)

Declared to guard source chain refund limits vs. gas limit cost. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### ExceedsMaximumBudget(uint16 targetChain, uint256 exceedingValue, uint256 maximumBudget)

Reverts when required target-chain Wei (receiver value + gas) exceeds that chain's configured maximum budget. *(Defined in [DeliveryProvider.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProvider.sol){target=\_blank})*

### ChainIdIsZero()

Reverts if an update is attempted with `chainId = 0`. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### GasPriceIsZero()

Reverts if a price update sets gas price to zero. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### NativeCurrencyPriceIsZero()

Reverts if a price update sets native currency price to zero. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### FailedToInitializeImplementation(string reason)

Reverts if the implementation's `initialize()` delegatecall fails during upgrade/setup. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank} and [DeliveryProviderSetup.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderSetup.sol){target=\_blank})*

### WrongChainId()

Reverts when an operation is invoked with a chainId that doesn't match the contract's configured chain. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### AddressIsZero()

Reverts if a zero address is provided where a nonzero address is required (e.g., ownership handoff). *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBePendingOwner()

Reverts if `confirmOwnershipTransferRequest` is called by an address other than `pendingOwner`. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBeOwner()

Reverts on functions guarded by `onlyOwner` when `msg.sender` is not the owner. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### CallerMustBeOwnerOrPricingWallet()

Reverts on functions guarded by `onlyOwnerOrPricingWallet` when caller is neither. *(Defined in [DeliveryProviderGovernance.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderGovernance.sol){target=\_blank})*

### ImplementationAlreadyInitialized()

Reverts if `initialize()` is called on an implementation that was already initialized. *(Defined in [DeliveryProviderImplementation.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderImplementation.sol){target=\_blank})*

### ImplementationAddressIsZero()

Reverts if `setup()` is called with a zero implementation address. *(Defined in [DeliveryProviderSetup.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/deliveryProvider/DeliveryProviderSetup.sol){target=\_blank})*

### UnexpectedExecutionInfoVersion

Reverts when the `executionInfoVersion` in the delivery VAA does not match the expected version. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*

### VersionMismatchOverride

Reverts when the override's `executionInfoVersion` does not match the original delivery's version. *(Defined in [WormholeRelayerDelivery.sol](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/relayer/wormholeRelayer/WormholeRelayerDelivery.sol){target=\_blank})*
