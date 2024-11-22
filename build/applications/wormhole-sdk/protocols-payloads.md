---
title: Building Protocols and Payloads
description: Learn how to build, register, and integrate protocols and payloads in the Wormhole TypeScript SDK with type-safe layouts
---

# Building Protocols and Payloads

## Introduction

The [Wormhole TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} provides a flexible and powerful system for integrating cross-chain communication into your applications. A key feature of the SDK is its ability to define protocols—modular units representing distinct functionalities—and their associated payloads, which encapsulate the data required for specific operations within those protocols.

This guide will help you understand how to build protocols and payloads in the SDK, covering:

 - The role of protocols and payloads in cross-chain communication
 - The mechanics of registering protocols and payloads using the SDK
 - Best practices for creating strongly typed layouts to ensure compatibility and reliability
 - Real-world examples using the `TokenBridge` as a reference implementation

By the end of this guide, you’ll have a solid understanding of how to define, register, and use protocols and payloads in your projects.

## What is a Protocol?

In the Wormhole SDK, a protocol represents a significant feature or functionality that operates across multiple blockchains. Protocols provide the framework for handling specific types of messages, transactions, or operations consistently and standardized.

Examples of Protocols:

 - **`TokenBridge`** - enables cross-chain token transfers, including operations like transferring tokens and relaying payloads
 - **`NTT (Native Token Transfers)`** - manages native token movements across chains

Protocols are defined by:

 - A `name` - a string identifier (e.g., `TokenBridge`, `Ntt`)
 - A set of `payloads` - these represent the specific actions or messages supported by the protocol, such as `Transfer` or `TransferWithPayload`

Each protocol is registered in the Wormhole SDK, allowing developers to leverage its predefined features or extend it with custom payloads.

## What is a Payload?

A payload is a structured piece of data that encapsulates the details of a specific operation within a protocol. It defines the format, fields, and types of data used in a message or transaction. Payloads ensure consistency and type safety when handling complex cross-chain operations.

Each payload is defined as:

 - A `layout` - describes the binary format of the payload fields
 - A `literal` - combines the protocol name and payload name into a unique identifier (e.g., `TokenBridge:Transfer`)

By registering payloads, developers can enforce type safety and enable serialization and deserialization for specific protocol operations.

## Register Protocols and Payloads

Protocols and payloads work together to enable cross-chain communication with precise type safety. For instance, in the `TokenBridge` protocol:

 - The protocol is registered under the `TokenBridge` namespace
 - Payloads like `Transfer` or `AttestMeta` are linked to the protocol to handle specific operations

Understanding the connection between these components is important for customizing or extending the SDK to suit your needs.

### Register Protocols

Registering a protocol establishes its connection to Wormhole's infrastructure, ensuring it interacts seamlessly with payloads and platforms while maintaining type safety and consistency.

#### How Protocol Registration Works

Protocol registration involves two key tasks:

 - **Mapping protocols to interfaces** - connect the protocol to its corresponding interface, defining its expected behavior across networks (`N`) and chains (`C`). This ensures type safety, similar to strong typing, by preventing runtime errors if protocol definitions are incorrect
 - **Linking protocols to platforms** - specify platform-specific implementations if needed, or use default mappings for platform-agnostic protocols

For example, here's the `TokenBridge` protocol registration:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-1.ts"
```

This code snippet:

 - Maps the `TokenBridge` protocol to its interface to define how it operates
 - Links the protocol to a default platform mapping via `EmptyPlatformMap`

You can view the full implementation in the [`TokenBridge` protocol file](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L14-L70){target=\_blank}.

#### Platform-Specific Protocols

Some protocols require platform-specific behavior. For instance, the EVM-compatible Wormhole Registry maps native addresses for Ethereum-based chains:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-2.ts"
```

This ensures that `EvmAddress` is registered as the native address type for EVM-compatible platforms. See the [EVM platform address file](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/platforms/evm/src/address.ts#L98-L106){target=\_blank} for details.

### Register Payloads

[Payload registration](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/dbbbc7c365db602dd3b534f6d615ac80c3d2aaf1/core/definitions/src/vaa/registration.ts){target=\_balnk} enables developers to define, serialize, and handle custom message types within their protocols. It establishes the connection between a protocol and its payloads, ensuring seamless integration, type enforcement, and runtime efficiency.

This process ties a protocol to its payloads using a combination of:

 - **Payload literals** - unique identifiers in the format `<ProtocolName>:<PayloadName>`. These literals map each payload to a layout
 - **Payload layouts** - structures that define the binary representation of payload data
 - **The payload factory** - a centralized runtime registry that maps payload literals to layouts for dynamic resolution and serialization

These components work together to streamline the definition and management of protocol payloads.

#### How Payload Registration Works

Payload registration involves:

1. **Define payload layouts** - create layouts to structure your payloads. For instance, a protocol might use a `TransferWithPayload` layout:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-3.ts"
    ```

2. **Register payloads** - use `registerPayloadTypes` to map payload literals to their layouts:

    ```typescript
    registerPayloadTypes("ProtocolName", protocolNamedPayloads)
    ```

3. **Access registered payloads** - dynamically use the `payloadFactory` to fetch registered layouts. For example:

    ```typescript
    const layout = payloadFactory.get("ProtocolName:PayloadName")
    ```

These steps link payload literals and their layouts, enabling seamless runtime handling.

#### The Payload Factory

At the core of the payload registration process is the `payloadFactory`, a registry that manages the mapping between payload literals and layouts:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-4.ts"
```

 - The `payloadFactory` ensures each payload literal maps to its layout uniquely
 - The [`registerPayloadType`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/dbbbc7c365db602dd3b534f6d615ac80c3d2aaf1/core/definitions/src/vaa/registration.ts#L46-L52){target=\_blank} function adds individual payloads, while [`registerPayloadTypes`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/dbbbc7c365db602dd3b534f6d615ac80c3d2aaf1/core/definitions/src/vaa/registration.ts#L62-L64){target=\_blank} supports bulk registration

This implementation ensures dynamic, efficient handling of payloads at runtime.

## Integrate Protocols with Payloads

Integrating payloads with protocols enables dynamic identification through payload literals, while serialization and deserialization ensure their binary representation is compatible across chains. For more details on these processes, refer to the [Layouts page](/docs/build/applications/wormhole-sdk/sdk-layout/){target=\_blank}.

### Payload Discriminators

Payload discriminators are mechanisms in the Wormhole SDK that dynamically identify and map incoming payloads to their respective layouts at runtime. They are relevant for protocols like `TokenBridge`, enabling efficient handling of diverse payload types while ensuring type safety and consistent integration.

#### How Discriminators Work

Discriminators evaluate serialized binary data and determine the corresponding payload layout by inspecting fixed fields or patterns within the data. Each payload layout is associated with a payload literal (e.g., `TokenBridge:Transfer` or `TokenBridge:TransferWithPayload`).

This system ensures:

 - **Dynamic runtime identification** - payloads are parsed based on their content, even if a single protocol handles multiple payload types
 - **Strict type enforcement** - discriminators leverage layout mappings to prevent invalid payloads from being processed

Below is an example of how the Wormhole SDK builds a discriminator to distinguish between payload layouts:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-5.ts"
```

 - `buildDiscriminator` takes a list of layouts and generates a function that can identify the appropriate layout for a given serialized payload
 - The `allowAmbiguous` parameter determines whether layouts with overlapping characteristics are permitted

### Real-World Example: TokenBridge Protocol

Integrating protocols with their respective payloads exemplifies how the Wormhole SDK leverages layouts and type-safe registration mechanisms to ensure efficient cross-chain communication. This section focuses on how protocols like `TokenBridge` use payloads to facilitate specific operations.

#### Token Bridge Protocol and Payloads

The `TokenBridge` protocol enables cross-chain token transfers through its payloads. Key payloads include:

 - **`Transfer`** - handles basic token transfer operations
 - **`TransferWithPayload`** - extends the `Transfer` payload to include custom data, enhancing functionality

Payloads are registered to the `TokenBridge` protocol via the `PayloadLiteralToLayoutMapping` interface, which links payload literals (e.g., `TokenBridge:Transfer`) to their layouts.

Additionally, the protocol uses reusable layouts like [`transferCommonLayout`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/protocols/tokenBridge/tokenBridgeLayout.ts#L29C7-L47){target=\_blank} and extends them in more specialized layouts such as [`transferWithPayloadLayout`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/protocols/tokenBridge/tokenBridgeLayout.ts#L49-L57){target=\_blank}:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-6.ts"
```

This layout includes:

 - A `payloadIdItem` to identify the payload type
 - Common fields for token and recipient details
 - A customizable `payload` field for additional data

#### Use the Discriminator

To manage multiple payloads, the `TokenBridge` protocol utilizes a discriminator to distinguish between payload types dynamically. For example:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-7.ts"
```

 - The [`getTransferDiscriminator`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/dbbbc7c365db602dd3b534f6d615ac80c3d2aaf1/core/definitions/src/protocols/tokenBridge/tokenBridge.ts#L67-L70){target=\_blank} function dynamically evaluates payloads using predefined layouts
 - This ensures that each payload type is processed according to its unique structure and type-safe layout

#### Register Payloads to Protocols

Here’s how the `TokenBridge` protocol connects its payloads to the Wormhole SDK:

```typescript
--8<-- "code/build/applications/wormhole-sdk/protocols-payloads/pl-8.ts"
```

This registration links the `TokenBridge` payload literals to their respective layouts, enabling serialization and deserialization at runtime.

You can explore the complete `TokenBridge` protocol and payload definitions in the [`TokenBridge` layout file](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridgeLayout.ts){target=\_blank}.

#### Token Bridge Payloads

The following payloads are registered for the `TokenBridge` protocol:

 - **`AttestMeta`** - used for token metadata attestation
 - **`Transfer`** - facilitates token transfers
 - **`TransferWithPayload`** - adds a custom payload to token transfers

These payloads and their layouts are defined in the [`TokenBridge` layout file](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/definitions/src/protocols/tokenBridge/tokenBridgeLayout.ts){target=\_blank}.

### Other Protocols: Native Token Transfers (NTT)

While this guide focuses on the `TokenBridge` protocol, other protocols, like NTT, follow a similar structure.

 - NTT manages the transfer of native tokens across chains
 - Payloads such as `WormholeTransfer` and `WormholeTransferStandardRelayer` are registered to the protocol using the same patterns for payload literals and layouts
 - The same mechanisms for type-safe registration and payload discriminators apply, ensuring reliability and extensibility

For more details, you can explore the [NTT implementation in the SDK](https://github.com/wormhole-foundation/example-native-token-transfers/blob/00f83aa215338b1b8fd66f522bd0f45be3e98a5a/sdk/definitions/src/ntt.ts){target=\_blank}.