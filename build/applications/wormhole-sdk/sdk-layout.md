---
title: Data Layouts
description: Learn how to efficiently define, serialize, and deserialize data structures using Wormhole SDK's layout system for cross-chain communication.
---

# Data Layouts

## Introduction

In the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, the [layout system](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/base/src/utils/layout){target=\_blank} is important for efficient cross-chain communication. It allows developers to define, serialize, and deserialize data structures, ensuring consistency and reusability across different blockchain environments.

By understanding the layout mechanism, you’ll be able to:

 - Define data structures (numbers, arrays, and custom types)
 - Efficiently serialize and deserialize data using the SDK’s utilities
 - Handle protocol-specific layouts with ease

This guide is beneficial for developers looking to integrate Wormhole into their applications or protocols, especially those dealing with complex payloads or cross-chain communication.

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

One relevant aspect of Wormhole SDK's layout system is the ability to handle variable-length fields, such as arrays and length-prefixed byte sequences.

For instance, if you want to serialize or deserialize a message where the length of the content isn't known beforehand, you can define a layout item with a `lengthSize` field.

```typescript
{ name: 'message', binary: 'bytes', lengthSize: 4 }
```

This tells the SDK to read or write the message's length (in 4 bytes) and then handle the content.

## Nested Layouts and Strong Typing

The Wormhole SDK simplifies handling complex structures with nested layouts and strong typing. Nested layouts clearly represent hierarchical data, while strong typing ensures data consistency and catches errors during development.

### Nested Layout

In complex protocols, layouts can contain nested structures. Nested layouts become relevant here, allowing you to represent hierarchical data (such as transactions or multi-part messages) in a structured format.

Refer to the following nested layout where a message contains nested fields:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-6.ts"
```

In this layout:

 - `source` is an object with two fields: `chainId` and `sender`
 - `redeemer` is another object with two fields: `address` and a length-prefixed `message`

### Strong Typing

One of the benefits of using the Wormhole SDK in TypeScript is its support for strong typing. This ensures that serialized and deserialized data conform to expected structures, reducing errors during development by enforcing type checks at compile time.

Using TypeScript, the `LayoutToType` utility provided by the SDK automatically generates a strongly typed structure based on the layout:

```typescript
type NestedMessage = LayoutToType<typeof nestedLayout>;
```

This ensures that when you serialize or deserialize data, it matches the expected structure.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-7.ts"
```

Attempting to assign data of incorrect types will result in a compile-time error. The Wormhole SDK's layout system enforces strong types, reducing runtime errors and improving code reliability.

### Serialization and Deserialization with Nested Layouts

You can serialize and deserialize nested structures in the same way as simpler layouts:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-8.ts"
```

Strong typing in TypeScript ensures that the message object conforms to the nested layout structure. This reduces the risk of data inconsistency during cross-chain communication.

## Commonly Used Layouts

The Wormhole SDK includes predefined layouts frequently used in cross-chain messaging. These layouts are optimized for standard fields such as chain IDs, addresses, and signatures. You can explore the complete set of predefined layouts in the [`layout-items` directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/definitions/src/layout-items){target=\_blank} of the Wormhole SDK.

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
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-9.ts"
```

This layout is versatile. It allows the serialization of human-readable chain names (e.g., `Ethereum`) to numeric IDs (e.g., `1`) and vice versa. This is particularly useful when working with dynamic configurations or protocols supporting multiple chains.

#### Fixed Chain ID Layout

The fixed chain ID layout, [`fixedChainItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/chain.ts#L42-L49){target=\_blank}, is more rigid. It also extends `chainItemBase`, but the custom field is hardcoded for a single chain. This eliminates runtime validation and enforces strict adherence to a specific chain.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-10.ts"
```

This layout allows developers to efficiently serialize and deserialize messages involving a single, fixed chain ID.

### Address Layout

The Wormhole SDK uses a Universal Address Layout to serialize and deserialize blockchain addresses into a standardized format. This layout ensures that addresses are always represented as fixed 32-byte binary values, enabling seamless cross-chain communication.

#### Base Structure

The [`universalAddressItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/universalAddress.ts#L7-L14){target=\_blank} defines the layout for addresses. It uses the binary type bytes and enforces a fixed size of 32 bytes for consistency.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-11.ts"
```

This layout ensures consistent address handling by defining the following:

 - **Serialization** - converts a high-level `UniversalAddress` object into raw binary (32 bytes) for efficient storage or transmission
 - **Deserialization** - converts raw binary back into a `UniversalAddress` object, enabling further interaction in a human-readable or programmatic format

### Signature Layout

In the Wormhole SDK, the Signature Layout defines how to serialize and deserialize cryptographic signatures. These signatures verify message authenticity and ensure data integrity, particularly in Guardian-signed VAAs.

#### Base Structure

The `signatureLayout` specifies the binary structure of a secp256k1 signature. It divides the signature into three components:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-12.ts"
```

This layout provides a clear binary format for the secp256k1 signature, making it efficient to process within the Wormhole protocol.

#### Layout with Custom Conversion

The [`signatureItem`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/layout-items/signature.ts#L15-L22){target=\_blank} builds upon the `signatureLayout` by adding custom conversion logic. This conversion transforms raw binary data into a high-level Signature object and vice versa.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-13.ts"
```

The `custom` field ensures seamless integration of raw binary data with the Signature class, encapsulating signature-specific logic.

## Advanced Use Cases

The Wormhole SDK’s layout system is designed to handle various data structures and serialization needs. This section will explore more advanced use cases, such as handling conditional data structures, fixed conversions, and optimizing serialization performance.

???- code "Switch Statements for Conditional Layouts"

    In some cases, the structure of serialized data might change based on a specific field, such as a payload ID. The switch layout type conditionally defines layouts based on a value.

    For example, different message types can be identified using a payload ID, and the layout for each message can be determined at runtime:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-14.ts"
    ```

    The switch statement helps developers parse multiple payload types using the same structure, depending on a control field like an ID.

???- code "Fixed Conversions and Omitted Fields"

    Fixed conversions and omitted fields allow developers to handle known, static data without including it in every serialization or deserialization operation. For instance, when specific fields in a layout always hold a constant value, they can be omitted from the deserialized object.

    **Example: Fixed Conversion**

    In some cases, a field may always contain a predefined value. The layout system supports fixed conversions, allowing developers to “hard-code” these values:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-15.ts"
    ```

    **Example: Omitted Fields**

    Omitted fields are useful for handling padding or reserved fields that do not carry meaningful information and can safely be excluded from the deserialized output:

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-16.ts"
    ```

    In this example, `reserved` is a padding field with a fixed, non-dynamic value that serves no functional purpose. It is omitted from the deserialized result but still considered during serialization to maintain the correct binary format.

    Only fields with a fixed, known value, such as padding or reserved fields, should be marked as `omit: true`. Fields with meaningful or dynamic information, such as `sourceChain` or `version`, must remain in the deserialized structure to ensure data integrity and allow seamless round-trip conversions between serialized and deserialized representations.

## Integration with Wormhole Protocol

The layout system facilitates seamless interaction with the Wormhole protocol, mainly when dealing with VAAs. These cross-chain messages must be serialized and deserialized to ensure they can be transmitted and processed accurately across different chains.

### VAAs and Layouts

VAAs are the backbone of Wormhole’s cross-chain communication. Each VAA is a signed message encapsulating important information such as the originating chain, the emitter address, a sequence number, and Guardian signatures. The Wormhole SDK leverages its layout system to define, serialize, and deserialize VAAs, ensuring data integrity and chain compatibility.

#### Base VAA Structure

The Wormhole SDK organizes the VAA structure into three key components:

 - [**Header**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/vaa.ts#L37-L41){target=\_blank} - contains metadata such as the Guardian set index and an array of Guardian signatures
 - [**Envelope**](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/vaa.ts#L44-L51){target=\_blank} - includes chain-specific details such as the emitter chain, address, sequence, and consistency level
 - **Payload** - provides application-specific data, such as the actual message or operation being performed

**Header layout:**

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-17.ts"
```

The header defines metadata for validating and processing the VAA, such as the Guardian set index and signatures. Each signature is represented using the `signatureItem` layout, ensuring consistency and compatibility across different platforms.

!!! note "Signature Standard Compliance"

    The signature field uses the `signatureItem` layout, which is explicitly defined as 65 bytes. This layout is aligned with widely used standards such as EIP-2612 and Uniswap's Permit2, ensuring compatibility with cryptographic protocols and applications.

**Envelope layout:**

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-18.ts"
```

The envelope encapsulates the VAA's core message data, including chain-specific information like the emitter address and sequence number. This structured layout ensures that the VAA can be securely transmitted across chains.

**Payload Layout:**

The Payload contains the user-defined data specific to the application or protocol, such as a token transfer message, governance action, or other cross-chain operation. The layout of the payload is dynamic and depends on the payload type, identified by the `payloadLiteral` field.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-19.ts"
```

This example demonstrates a payload containing:

 - A type field specifying the operation type (e.g., transfer or governance action)
 - A data field that is length-prefixed and can store operation-specific information

Dynamic payload layouts are selected at runtime using the `payloadLiteral` field, which maps to a predefined layout in the Wormhole SDK.

**Combined Base Layout:**

The base VAA layout combines the header, envelope, and dynamically selected payload layout:

```typescript
export const baseLayout = [...headerLayout, ...envelopeLayout] as const;
```

At runtime, the payload layout is appended to the `baseLayout` to form the complete structure.

#### Serializing VAA Data

The Wormhole SDK provides the [`serialize`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/functions.ts#L48-L54){target=\_blank} function to serialize a VAA message. This function combines the base layout (header and envelope) with the appropriate payload layout, ensuring the message’s format is correct for transmission across chains.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-20.ts"
```

???- note "How does it work?"

    Internally, the serialize function dynamically combines the `baseLayout` (header and envelope) with the payload layout defined by the `payloadLiteral`. The complete layout is then passed to the `serializeLayout` function, which converts the data into binary format.

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-21.ts"
    ```

#### Deserializing VAA Data

The Wormhole SDK provides the [`deserialize`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/vaa/functions.ts#L162-L200){target=\_blank} function to parse a VAA from its binary format back into a structured object. This function uses the `baseLayout` and payload discriminator logic to ensure the VAA is correctly interpreted.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-22.ts"
```

???- note "How does it work?"

    Internally, the `deserialize` function uses the `baseLayout` (header and envelope) to parse the main VAA structure. It then identifies the appropriate payload layout using the provided payload type or discriminator.

    ```typescript
    --8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-23.ts"
    ```

### Registering Custom Payloads

In addition to predefined layouts, Wormhole integrators can define and register their custom payloads. This is especially useful when integrating protocol-specific features, such as the [**Submit Your Protocol**](https://wormholescan.io/#/developers/submit){target=\_blank} feature in [WormholeScan](https://wormholescan.io/){target=\_blank}.

Below's an example of a custom payload registration:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-24.ts"
```

Custom payloads enable developers to extend the functionality of Wormhole's cross-chain messages, allowing for more specialized use cases.

## Common Pitfalls & Best Practices

When working with the Wormhole SDK layout system, it's important to be aware of a few common issues that can arise. Below are some pitfalls to avoid and best practices to ensure smooth integration.

### Pitfalls to Avoid

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

#### Reuse Predefined Layout Items

Rather than defining sizes or types manually, reuse the predefined layout items provided by the Wormhole SDK. These items ensure consistent formatting and enforce strong typing.

For instance, use the `chainItem` layout for chain IDs or `universalAddressItem` for blockchain addresses:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-25.ts"
```

By leveraging predefined layout items, you reduce redundancy, maintain consistency, and ensure compatibility with Wormhole’s standards.

#### Use Class Instances

Whenever possible, convert deserialized data into higher-level class instances. This makes it easier to validate, manipulate, and interact with structured data. For example, the [`UniversalAddress`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/76b20317b0f68e823d4e6c4a2e41bb2a7705c64f/core/definitions/src/universalAddress.ts#L17-L59){target=\_blank} class ensures consistent address handling:

```typescript
import { UniversalAddress } from '@wormhole-foundation/sdk-core';

const deserializedAddress = new UniversalAddress(someBinaryData);
```

Focusing on reusing predefined layout items and converting deserialized data into higher-level abstractions can ensure a more robust and maintainable implementation.

#### Consistent Error Handling

Always handle errors during both serialization and deserialization. Catching exceptions allows you to log or resolve issues gracefully when working with potentially corrupted or invalid data.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-26.ts"
```

#### Leverage Reusable Layouts

Creating reusable layouts for commonly repeated structures improves code maintainability and reduces duplication. These layouts can represent fields or combinations of fields frequently encountered in cross-chain communication, such as chain IDs, addresses, and signatures.

For example, define a reusable layout for chain IDs and addresses:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-27.ts"
```

By abstracting common elements into a single layout, you ensure consistency across different parts of your application and simplify future updates.

## Performance Considerations

Efficient serialization and deserialization are crucial when handling large amounts of cross-chain data. Below are some strategies and best practices to ensure optimal performance when using Wormhole SDK layouts.

### Lazy Instantiation

Building a discriminator can be resource-intensive for complex or large datasets. The layout structures do not incur significant upfront costs, but deferring the creation of discriminators until needed can improve efficiency.

```typescript
const lazyDiscriminator = lazyInstantiate(() => layoutDiscriminator(layouts));
```

This approach ensures that discriminators are only built when required, helping to optimize performance, especially for complex or conditional layouts.

### Minimize Layout Redundancy

Avoid defining custom layouts for fields already provided by the Wormhole SDK. Instead, reuse predefined layout items like chainItem or universalAddressItem to maintain compatibility with Wormhole standards and ensure strong typing.

For example, instead of manually defining layouts for chain IDs or addresses, leverage the SDK’s built-in items:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-28.ts"
```

Reusing SDK-provided layouts eliminates redundancy, reduces maintenance, and ensures your code aligns with established standards.

## Resources

For further learning and practical experience, explore the following resources:

 - **Wormhole TypeScript SDK** - the [Wormhole SDK repository](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} contains the core implementation of layouts, including predefined layout items and utilities like `serializeLayout` and `deserializeLayout`

 - **Layout tests repository** - for hands-on experimentation, check out this [layout tests repository](https://github.com/nonergodic/layout){target=\_blank}, which provides examples and unit tests to help you better understand serialization, deserialization, and the strong typing mechanism. Running these tests locally is a great way to deepen your understanding of how layouts function in real-world scenarios