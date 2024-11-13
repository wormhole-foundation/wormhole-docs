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

Specific layouts appear frequently in cross-chain interactions when working with the Wormhole SDK. These common layouts include fields like chain IDs, addresses, and signatures, which are essential for Wormhole’s cross-chain messaging infrastructure.

### Chain ID Layout

Chain IDs are crucial for identifying cross-chain messages' source and destination chains. Wormhole uses layouts to handle chain IDs efficiently.

```typescript
const chainIdLayout = { name: 'chainId', binary: 'uint', size: 2 } as const;
```

This layout defines a 2-byte unsigned integer (uint) for chain IDs. It is commonly used in VAAs and other payloads to identify which chain the message is originating from or targeting.

### Address Layout

Addresses are used to reference contracts or wallets across chains. These layouts typically consist of a fixed byte size, often 32 bytes.

```typescript
const addressLayout = { name: 'address', binary: 'bytes', size: 32 } as const;
```

This layout defines a 32-byte array representing an address, a standard format for smart contracts and user addresses.

### Signature Layout

Signatures, typically fixed-size byte arrays, verify the integrity and authenticity of messages in the Wormhole protocol.

```typescript
const signatureLayout = { name: 'signature', binary: 'bytes', size: 64 } as const;
```

This layout represents a 64-byte cryptographic signature commonly used for verifying VAAs.

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

### VAAs and Payload Handling

Wormhole’s core functionality revolves around VAAs, which are signed messages that allow different chains to communicate. These VAAs contain complex data that must be encoded using layouts. The layout system in the Wormhole SDK simplifies this by providing structured serialization and deserialization tools.

Here’s how a typical VAA payload might be structured using the Wormhole SDK's layout system:

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-16.ts"
```

This layout structure lets developers easily define and work with VAAs in their applications, ensuring the data conforms to Wormhole’s protocol requirements.

### Serializing VAA Data

Developers can use the `serializeLayout` function to serialize a VAA message. This ensures that the message is correctly formatted before being transmitted between chains.

```typescript
--8<-- "code/build/applications/wormhole-sdk/sdk-layout/layout-17.ts"
```

### Deserializing VAA Data

When a VAA message is received, it needs to be deserialized so that the application can work with it. The `deserializeLayout` function converts the binary VAA back into a structured object.

```typescript
const deserializedVAA = deserializeLayout(vaaLayout, serializedVAA);
```

This allows the application to interpret the incoming data and act accordingly quickly.

### Registering Custom Payloads

In addition to predefined layouts, Wormhole integrators can define and register their custom payloads. This is especially useful when integrating protocol-specific features, such as the ["Submit Your Protocol"](https://wormholescan.io/#/developers/submit){target=\_blank} feature in [WormholeScan](https://wormholescan.io/){target=\_blank}.

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

#### Correct Sizes for `uint`, `int`, and `bytes`

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