---
title: Data Layouts
description: Learn how to efficiently define, serialize, and deserialize data structures using Wormhole SDK's layout system for cross-chain communication.
---

# Data Layouts

## Introduction

In the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, the [layout system](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/base/src/utils/layout){target=\_blank} is essential for efficient cross-chain communication. It allows developers to define, serialize, and deserialize data structures, ensuring consistency and reusability across different blockchain environments.

By understanding the layout mechanism, you’ll be able to:

 - Define data structures (numbers, arrays, and custom types)
 - Efficiently serialize and deserialize data using the SDK’s utilities
 - Handle protocol-specific layouts with ease

This guide is essential for developers looking to integrate Wormhole into their applications or protocols, especially those dealing with complex payloads or cross-chain communication.

## Key Concepts

### Layout Items

A layout defines how data structures should be serialized (converted into binary format) and deserialized (converted back into their original structure). This ensures consistent data formatting when transmitting information across different blockchain environments.

Layouts are composed of [layout items](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/core/base/src/utils/layout/items.ts){target=\_blank}, which describe individual fields or sets of fields in your data. Each layout item specifies:

 - **`name`** - name of the field
 - **`binary`** - type of data (e.g., `uint`, `bytes`)
 - **`size`** - byte length for fixed-size fields within uint and bytes items only

Layout items can represent:

 - **Primitive types** - basic data types like unsigned integers (`uint`) or byte arrays (`bytes`)
 - **Composite types** - more complex structures, such as arrays or nested objects

Below is an example of a layout that might be used to serialize a message across the Wormhole protocol:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-0.ts"
```

In this example:

 - `sourceChain` is a 2-byte unsigned integer (`uint`) identifying the source blockchain
 - `orderSender` is a fixed-length 32-byte array representing the sender's address
 - `redeemer` is another 32-byte array used for the redeemer’s address
 - `redeemerMessage` is a variable-length byte sequence, with its length specified by a 4-byte integer

This layout definition ensures that all necessary data fields are consistently encoded and can be correctly interpreted when they are deserialized.

### Serialization and Deserialization

Serialization converts structured data into binary format; deserialization reverses this, reconstructing the original objects.

You can serialize data using the `serializeLayout` function:

```typescript
const serialized = serializeLayout(fillLayout, exampleFill);
```

To deserialize the binary data back into a structured object, use the `deserializeLayout` function:

```typescript
const deserialized = deserializeLayout(fillLayout, serialized);
```

### Custom Conversions

Layouts also allow for custom conversions, which help map complex or custom types (like chain IDs or universal addresses) into a more usable format. This is useful when serializing or deserializing data that doesn’t fit neatly into simple types like integers or byte arrays.

For example, consider a custom conversion for a chain ID:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-1.ts"
```

This setup allows Wormhole to convert between human-readable formats and binary-encoded data used in payloads.

### Error Handling

The layout system performs error checks during serialization and deserialization. An error is thrown if data is incorrectly sized or in the wrong format. Refer to the below example:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-2.ts"
```

## Application of Layouts

This section will focus on applying the concepts explained earlier through examples. These will help developers better understand how to define layouts, serialize and deserialize data, and use custom conversions where needed.

### Defining Layouts

To get started with layouts in Wormhole, you need to define your structure. A layout is simply a list of fields (layout items) describing how each data piece will be serialized.

Consider the following layout for a payload:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-3.ts"
```

In this example:

 - `sourceChain` is an unsigned integer (uint) of 2 bytes
 - `orderSender` is a 32-byte fixed-length byte array
 - `redeemer` is another 32-byte byte array
 - `redeemerMessage` is a length-prefixed byte array, with the length specified by a 4-byte integer

### Serialize Data

Once a layout is defined, the next step is to serialize data according to that structure. You can accomplish this using the `serializeLayout` function from the Wormhole SDK.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-4.ts"
```

This takes the data structure (`examplePayload`) and serializes it according to the rules defined in the layout (`exampleLayout`). The result is a `Uint8Array` representing the serialized binary data.

### Deserialize Data

Deserialization is the reverse of serialization. Given a serialized `Uint8Array`, we can convert it back into its original structure using the `deserializeLayout` function.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-5.ts"
```

This will output the structured object, making it easy to work with data transmitted or received from another chain.

### Handling Variable-Length Fields

One of the most powerful aspects of Wormhole SDK's layout system is the ability to handle variable-length fields, such as arrays and length-prefixed byte sequences.

For instance, if you want to serialize or deserialize a message where the length of the content isn't known beforehand, you can define a layout item with a `lengthSize` field.

```typescript
{ name: 'message', binary: 'bytes', lengthSize: 4 }
```

This tells the SDK to first read or write the message's length (in 4 bytes) and then handle the actual content.

## Nested Layouts and Strong Typing

One of the benefits of using the Wormhole SDK in TypeScript is its support for strong typing. This ensures that serialized and deserialized data conform to expected structures, reducing errors during development by enforcing type checks at compile time.

In complex protocols, layouts can contain nested structures. This is where nested layouts become essential, allowing you to represent hierarchical data (such as transactions or multi-part messages) clearly and structured.

Refer to the following nested layout where a message contains nested fields:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-6.ts"
```

In this layout:

 - `source` is an object with two fields: `chainId` and `sender`
 - `redeemer` is another object with two fields: `address` and a length-prefixed `message`

### Strong Typing

Using TypeScript, the `LayoutToType` utility provided by the SDK automatically generates a strongly typed structure based on the layout:

```typescript
type NestedMessage = LayoutToType<typeof nestedLayout>;
```

This ensures that when you serialize or deserialize data, it matches the expected structure.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-7.ts"
```

### Serialization and Deserialization with Nested Layouts

You can serialize and deserialize nested structures in the same way as simpler layouts:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-8.ts"
```

By enforcing strong typing, TypeScript helps ensure that the message object conforms to the nested layout structure, reducing the risk of data inconsistency during cross-chain communication.

## Commonly Used Layouts

The Wormhole SDK includes predefined layouts frequently used in cross-chain messaging. These layouts are optimized for standard fields such as chain IDs, addresses, and signatures. You can explore the complete set of predefined layouts in the [layout-items directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/definitions/src/layout-items){target=\_blank} of the Wormhole SDK.

### Chain ID Layouts

Chain ID layouts in the Wormhole SDK derive from a common foundation: `chainItemBase`. This structure defines the binary representation of a chain ID as a 2-byte unsigned integer, ensuring consistency across serialization and deserialization processes.

#### Base Structure

This simple structure is the blueprint for more specific layouts by standardizing the binary format and size.

```typescript
const chainItemBase = { binary: "uint", size: 2 } as const;
```

#### Dynamic Chain ID Layout

The dynamic chain ID layout, [`chainItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/chain.ts#L13-L40){target=\_blank}, extends `chainItemBase` by adding flexible custom conversion logic. It enables runtime validation of chain IDs, supports optional null values, and restricts chain IDs to a predefined set when needed.

```typescript
export const chainItem = <
  const C extends readonly Chain[] = typeof chains,
  const N extends boolean = false,
>(opts?: {
  allowedChains?: C;
  allowNull?: N;
}) =>
  ({
    ...chainItemBase, // Builds on the base structure
    custom: {
      to: (val: number): AllowNull<C[number], N> => { ... },
      from: (val: AllowNull<C[number], N>): number => { ... },
    },
  });
```

This layout is versatile. It allows the serialization of human-readable chain names (e.g., `Ethereum`) to numeric IDs (e.g., `1`) and vice versa. This is particularly useful when working with dynamic configurations or protocols supporting multiple chains.

#### Fixed Chain ID Layout

The fixed chain ID layout, [`fixedChainItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/chain.ts#L42-L49){target=\_blank}, is more rigid. It also extends `chainItemBase`, but the custom field is hardcoded for a single chain. This eliminates runtime validation and enforces strict adherence to a specific chain.

```typescript
export const fixedChainItem = <const C extends Chain>(chain: C) =>
  ({
    ...chainItemBase, // Builds on the base structure
    custom: {
      to: chain,
      from: chainToChainId(chain),
    },
  });
```

This layout allows developers to efficiently serialize and deserialize messages involving a single, fixed chain ID.

### Address Layout

The Wormhole SDK uses a Universal Address Layout to serialize and deserialize blockchain addresses into a standardized format. This layout ensures that addresses are always represented as fixed 32-byte binary values, enabling seamless cross-chain communication.

#### Base Structure

The [`universalAddressItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/universalAddress.ts#L7-L14){target=\_blank} defines the layout for addresses. It uses the binary type bytes and enforces a fixed size of 32 bytes for consistency.

```typescript
export const universalAddressItem = {
  binary: "bytes",
  size: 32,
  custom: {
    to: (val: Uint8Array): UniversalAddress => new UniversalAddress(val),
    from: (val: UniversalAddress): Uint8Array => val.toUint8Array(),
  } satisfies CustomConversion<Uint8Array, UniversalAddress>,
} as const satisfies LayoutItem;
```

This layout ensures consistent address handling by defining the following:

 - **Serialization** - converts a high-level `UniversalAddress` object into raw binary (32 bytes) for efficient storage or transmission
 - **Deserialization** - converts raw binary back into a `UniversalAddress` object, enabling further interaction in a human-readable or programmatic format

### Signature Layout

In the Wormhole SDK, the Signature Layout defines how serial and deserialize cryptographic signatures. These signatures are critical for verifying message authenticity and ensuring data integrity, particularly in Guardian-signed VAAs.

#### Base Structure

The `signatureLayout` specifies the binary structure of a secp256k1 signature. It divides the signature into three components:

```typescript
const signatureLayout = [
  { name: "r", binary: "uint", size: 32 },
  { name: "s", binary: "uint", size: 32 },
  { name: "v", binary: "uint", size: 1 },
] as const satisfies Layout;
```

This layout provides a clear binary format for the secp256k1 signature, making it efficient to process within the Wormhole protocol.

#### Layout with Custom Conversion

The [`signatureItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/signature.ts#L15-L22){target=\_blank} builds upon the `signatureLayout` by adding custom conversion logic. This conversion transforms raw binary data into a high-level Signature object and vice versa.

```typescript
export const signatureItem = {
  binary: "bytes",
  layout: signatureLayout,
  custom: {
    to: (val: LayoutToType<typeof signatureLayout>) => new Signature(val.r, val.s, val.v),
    from: (val: Signature) => ({ r: val.r, s: val.s, v: val.v }),
  } satisfies CustomConversion<LayoutToType<typeof signatureLayout>, Signature>,
} as const satisfies BytesLayoutItem;
```

The `custom` field ensures seamless integration of raw binary data with the Signature class, encapsulating signature-specific logic.

## Advanced Use Cases

The Wormhole SDK’s layout system is designed to handle various data structures and serialization needs. This section will explore more advanced use cases, such as handling conditional data structures, fixed conversions, and optimizing serialization performance.

???- code "Switch Statements for Conditional Layouts"

    In some cases, the structure of serialized data might change based on a specific field, such as a payload ID. The switch layout type conditionally defines layouts based on a value.

    For example, different message types can be identified using a payload ID, and the layout for each message can be determined at runtime:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-13.ts"
    ```

    The switch statement helps developers parse multiple payload types using the same structure, depending on a control field like an ID.

???- code "Fixed Conversions and Omitted Fields"

    Fixed conversions and omitted fields allow developers to handle known, static data without including it in every serialization or deserialization operation. For instance, when specific fields in a layout always hold a constant value, they can be omitted from the deserialized object.

    **Example: Fixed Conversion**

    In some cases, a field may always contain a predefined value. The layout system supports fixed conversions, allowing developers to “hard-code” these values:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-14.ts"
    ```

    **Example: Omitted Fields**

    Omitted fields can be useful when padding or reserved fields exist that don’t need to be returned in the deserialized output:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-15.ts"
    ```

    In this case, `sourceChain` is omitted from the deserialized result but still considered during serialization.

## Integration with Wormhole Protocol

The layout system is critical in ensuring seamless interaction with the Wormhole protocol, mainly when dealing with VAAs. These cross-chain messages must be serialized and deserialized to ensure they can be transmitted and processed accurately across different chains.

### VAAs and Layouts

VAAs are the backbone of Wormhole’s cross-chain communication. Each VAA is a signed message encapsulating critical information such as the originating chain, the emitter address, a sequence number, and Guardian signatures. The Wormhole SDK leverages its layout system to define, serialize, and deserialize VAAs, ensuring data integrity and chain compatibility.

#### Base VAA Structure

The Wormhole SDK organizes the VAA structure into three key components:

 - [**Header**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/vaa.ts#L37-L41){target=\_blank} - contains metadata such as the Guardian set index and an array of Guardian signatures
 - [**Envelope**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/vaa.ts#L44-L51){target=\_blank} - includes chain-specific details such as the emitter chain, address, sequence, and consistency level
 - **Payload** - provides application-specific data, such as the actual message or operation being performed

**Header layout:**

```typescript
const guardianSignatureLayout = [
  { name: "guardianIndex", binary: "uint", size: 1 },
  { name: "signature", ...signatureItem },
] as const satisfies Layout;

export const headerLayout = [
  { name: "version", binary: "uint", size: 1, custom: 1, omit: true },
  { name: "guardianSet", ...guardianSetItem },
  { name: "signatures", binary: "array", lengthSize: 1, layout: guardianSignatureLayout },
] as const satisfies Layout;
```

The header defines essential metadata for validating and processing the VAA, such as the Guardian set index and their signatures. Each signature is represented using the `signatureItem` layout, ensuring consistency and compatibility across different platforms.

!!! note "Signature Standard Compliance"

    The signature field uses the `signatureItem` layout, which is explicitly defined as 65 bytes. This is aligned with widely-used standards such as EIP-2612 and Uniswap's Permit2, ensuring compatibility with cryptographic protocols and applications.

**Envelope layout:**

```typescript
export const envelopeLayout = [
  { name: "timestamp", binary: "uint", size: 4 },
  { name: "nonce", binary: "uint", size: 4 },
  { name: "emitterChain", ...chainItem() },
  { name: "emitterAddress", ...universalAddressItem },
  { name: "sequence", ...sequenceItem },
  { name: "consistencyLevel", binary: "uint", size: 1 },
] as const satisfies Layout;
```

The envelope encapsulates the VAA's core message data, including chain-specific information like the emitter address and sequence number. This structured layout ensures that the VAA can be securely transmitted across chains.

**Payload Layout:**

The Payload contains the user-defined data specific to the application or protocol, such as a token transfer message, governance action, or other cross-chain operation. The layout of the payload is dynamic and depends on the payload type, identified by the `payloadLiteral` field.

```typescript
const examplePayloadLayout = [
  { name: "type", binary: "uint", size: 1 },
  { name: "data", binary: "bytes", lengthSize: 2 },
] as const satisfies Layout;
```

This example demonstrates a payload containing:

 - A type field, specifying the operation type (e.g., transfer or governance action).
 - A data field, which is length-prefixed and can store the operation-specific information.

Dynamic payload layouts are selected at runtime using the `payloadLiteral` field, which maps to a predefined layout in the Wormhole SDK.

**Combined Base Layout:**

The base VAA layout combines the header, envelope, and dynamically selected payload layout:

```typescript
export const baseLayout = [...headerLayout, ...envelopeLayout] as const;
```

At runtime, the payload layout is appended to the `baseLayout` to form the complete structure.

#### Serializing VAA Data

The Wormhole SDK provides the [`serialize`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/functions.ts#L48-L54){target=\_blank} function to serialize a VAA message. This function combines the base layout (header and envelope) with the appropriate payload layout, ensuring that the message is correctly formatted for transmission across chains.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-17.ts"
```

This ensures the VAA is correctly formatted for transmission across the Wormhole network.

???- note "How does it work?"

    Internally, the serialize function dynamically combines the `baseLayout` (header and envelope) with the payload layout defined by the `payloadLiteral`. The full layout is then passed to the `serializeLayout` function, which converts the data into binary format.

    ```typescript
    const layout = [
    ...baseLayout, // Header and envelope layout
    payloadLiteralToPayloadItemLayout(vaa.payloadLiteral), // Payload layout
    ] as const;

    return serializeLayout(layout, vaa as LayoutToType<typeof layout>);
    ```

#### Deserializing VAA Data

The Wormhole SDK provides the [`deserialize`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/functions.ts#L162-L200){target=\_blank} function to parse a VAA from its binary format back into a structured object. This function uses the `baseLayout` and payload discriminator logic to ensure the VAA is correctly interpreted.

```typescript
import { deserialize } from '@wormhole-foundation/sdk-core/vaa/functions';

const serializedVAA = new Uint8Array([
  /* Serialized VAA binary data */
]);

const vaaPayloadType = 'SomePayloadType'; // The payload type expected for this VAA
const deserializedVAA = deserialize(vaaPayloadType, serializedVAA);
```

???- note "How does it work?"

    Internally, the `deserialize` function uses the `baseLayout` (header and envelope) to parse the main VAA structure. It then identifies the appropriate payload layout using the provided payload type or discriminator.

    ```typescript
    const [header, envelopeOffset] = deserializeLayout(headerLayout, data, { consumeAll: false });

    const [envelope, payloadOffset] = deserializeLayout(envelopeLayout, data, {
    offset: envelopeOffset,
    consumeAll: false,
    });

    const [payloadLiteral, payload] =
    typeof payloadDet === 'string'
        ? [
            payloadDet as PayloadLiteral,
            deserializePayload(payloadDet as PayloadLiteral, data, payloadOffset),
        ]
        : deserializePayload(payloadDet as PayloadDiscriminator, data, payloadOffset);

    return {
    ...header,
    ...envelope,
    payloadLiteral,
    payload,
    } satisfies VAA;
    ```

### Registering Custom Payloads

In addition to predefined layouts, Wormhole integrators can define and register their custom payloads. This is especially useful when integrating protocol-specific features, such as the [**Submit Your Protocol**](https://wormholescan.io/#/developers/submit){target=\_blank} feature in [WormholeScan](https://wormholescan.io/){target=\_blank}.

Below's an example of a custom payload registration:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-18.ts"
```

Custom payloads enable developers to extend the functionality of Wormhole's cross-chain messages, allowing for more specialized use cases.

## Common Pitfalls & Best Practices

When working with the Wormhole SDK layout system, it's important to be aware of a few common issues that can arise. Below are some pitfalls to avoid and best practices to ensure smooth integration.

### Pitfalls to Avoid

#### Mismatched Types in Layouts

Ensure that the type you define in your layout matches the actual data type used in serialization and deserialization. For example, if you define a field as `binary: 'uint'`, the corresponding data should be a `number` or `bigint`, not a `string` or `bytes`.

```typescript
// Incorrect: Passing a string where an unsigned integer is expected
{ name: 'sourceChain', binary: 'uint', size: 2 } 
// Usage should be: { sourceChain: 6 } not { sourceChain: '6' }
```

#### Defining Sizes for Data Types

When defining sizes for each data type, make sure to match the actual data length to the specified size to prevent serialization and deserialization errors:

 - `uint` and `int` - the specified size must be large enough to accommodate the data value. For instance, storing a value greater than 255 in a single byte (`uint8`) will fail since it exceeds the byte’s capacity. Similarly, an undersized integer (e.g., specifying 2 bytes for a 4-byte integer) can lead to data loss or deserialization failure
 - `bytes` - the data must match the specified byte length in the layout. For example, defining a field as 32 bytes (`size: 32`) requires the provided data to be exactly 32 bytes long; otherwise, serialization will fail

```typescript
// Pitfall: Mismatch between the size of data and the defined size in the layout
{ name: 'orderSender', binary: 'bytes', size: 32 }
// If the provided data is not exactly 32 bytes, this will fail
```

#### Incorrectly Defined Arrays

Arrays can be fixed-length or length-prefixed, so it’s important to define them correctly. Fixed-length arrays must match the specified length, while length-prefixed arrays need a `lengthSize` field.

```typescript
// Pitfall: Array length does not match the expected size
{ name: 'redeemerMessage', binary: 'bytes', lengthSize: 4 }
```

### Best Practices

These best practices and common pitfalls can help prevent bugs and improve the reliability of your implementation when working with layouts in the Wormhole SDK.

#### Use Constants for Sizes and Types

Instead of hardcoding sizes and types across your codebase, define constants that can be reused across multiple layouts. This ensures consistency and reduces the chance of errors.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-9.ts"
```

#### Validate Data Before Serialization

Before calling `serializeLayout`, ensure your data matches the expected structure and types. Catching errors earlier in the process can save debugging time.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-10.ts"
```

#### Consistent Error Handling

Always handle errors during both serialization and deserialization. Catching exceptions allows you to log or resolve issues gracefully when working with potentially corrupted or invalid data.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-11.ts"
```

#### Leverage Reusable Layouts

Create reusable layout definitions for commonly used structures like chain IDs, addresses, and signatures whenever possible. This minimizes code duplication and helps keep your layouts maintainable.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-12.ts"
```

## Performance Considerations

Efficient serialization and deserialization are crucial when handling large amounts of cross-chain data. Below are some strategies and best practices to ensure optimal performance when using Wormhole SDK layouts.

### Lazy Instantiation

Building a discriminator can be resource-intensive for complex or large datasets. The layout structures do not incur significant upfront costs, but deferring the creation of discriminators until needed can improve efficiency.

```typescript
const lazyDiscriminator = lazyInstantiate(() => layoutDiscriminator(layouts));
```

This approach ensures that discriminators are only built when required, helping to optimize performance, especially for complex or conditional layouts.

### Minimize Layout Redundancy

When defining layouts, reuse common components (like chain IDs and addresses) across your project to avoid duplication. This not only improves code maintainability but also minimizes unnecessary memory use.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-19.ts"
```