---
title: Wormhole SDK Layouts
description: Learn how to efficiently define, serialize, and deserialize data structures using Wormhole SDK's layout system for cross-chain communication.
---

# Wormhole SDK Layouts

## Introduction

In the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, the [layout system](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/base/src/utils/layout){target=\_blank} is essential for efficient cross-chain communication. It allows developers to define, serialize, and deserialize data structures, ensuring consistency and reusability across different blockchain environments.

By understanding the layout mechanism, you’ll be able to:

 - Define data structures (like numbers, arrays, and custom types)
 - Efficiently serialize and deserialize data using the SDK’s utilities
 - Handle protocol-specific layouts with ease

This guide is essential for developers looking to integrate Wormhole into their applications or protocols, especially those dealing with complex payloads or cross-chain communication.

## Key Concepts

### Layout Items

At the core of the layout system is the concept of Layout Items, which describe how individual fields or sets of fields are encoded. Layout items can represent:

 - **Primitive types** - simple data types like uint or bytes
 - **Composite types** - arrays or nested structures

For example, a layout item could be defined as:

 - Numbers (int, uint) – for signed/unsigned integers, specify byte size

    ```typescript
    { name: "sourceChain", binary: "uint", size: 2 }
    ```

 - Bytes – fixed or length-prefixed byte sequences

    ```typescript
    { name: "orderSender", binary: "bytes", size: 32 }
    ```

Each layout item has associated properties:

 - **name** – the field name
 - **binary type** – describes the type (uint, bytes, etc.)
 - **size** – specifies the byte length for the item

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
const chainCustomConversion = {
  to: (chainId: number) => toChain(chainId),
  from: (chain: Chain) => chainToChainId(chain),
} satisfies CustomConversion<number, Chain>;
```

This setup allows Wormhole to convert between human-readable formats and binary-encoded data used in payloads.

### Error Handling

The layout system performs error checks during serialization and deserialization. An error is thrown if data is incorrectly sized or in the wrong format. Refer to the below example:

```typescript
try {
  deserializeLayout(fillLayout, corruptedData);
} catch (error) {
  console.error("Error during deserialization:", error.message);
}
```

## Application of Layouts

This section will focus on applying the concepts explained earlier through examples. These will help developers better understand how to define layouts, serialize and deserialize data, and use custom conversions where needed.

### Defining Layouts

To get started with layouts in Wormhole, you need to define your structure. A layout is simply a list of fields (layout items) describing how each data piece will be serialized.

Consider the following layout for a payload:

```typescript
const exampleLayout = [
  { name: "sourceChain", binary: "uint", size: 2 },
  { name: "orderSender", binary: "bytes", size: 32 },
  { name: "redeemer", binary: "bytes", size: 32 },
  { name: "redeemerMessage", binary: "bytes", lengthSize: 4 }
] as const;
```

In this example:

 - `sourceChain` is an unsigned integer (uint) of 2 bytes
 - `orderSender` is a 32-byte fixed-length byte array
 - `redeemer` is another 32-byte byte array
 - `redeemerMessage` is a length-prefixed byte array, with the length specified by a 4-byte integer

### Serialize Data

Once a layout is defined, the next step is to serialize data according to that structure. You can accomplish this using the `serializeLayout` function from the Wormhole SDK. For example:

```typescript
const examplePayload = {
  sourceChain: 6,
  orderSender: new Uint8Array(32),
  redeemer: new Uint8Array(32),
  redeemerMessage: new Uint8Array([0x01, 0x02, 0x03])
};

const serializedData = serializeLayout(exampleLayout, examplePayload);
console.log(serializedData);
```

This takes the data structure (examplePayload) and serializes it according to the rules defined in the layout (exampleLayout). The result is a Uint8Array representing the serialized binary data.

### Deserialize Data

Deserialization is the reverse of serialization. Given a serialized Uint8Array, we can convert it back into its original structure using the deserializeLayout function. For example:

```typescript
const deserializedPayload = deserializeLayout(exampleLayout, serializedData);
console.log(deserializedPayload);
```

This will output the structured object, making it easy to work with data transmitted or received from another chain.

### Handling Variable-Length Fields

One of the most powerful aspects of Wormhole SDK's layout system is the ability to handle variable-length fields, such as arrays and length-prefixed byte sequences.

For instance, if you want to serialize or deserialize a message where the length of the content isn't known beforehand, you can define a layout item with a `lengthSize` field.

```typescript
{ name: "message", binary: "bytes", lengthSize: 4 }
```

This tells the SDK to first read or write the message's length (in 4 bytes) and then handle the actual content.

## Nested Layouts and Strong Typing

One of the benefits of using the Wormhole SDK in TypeScript is its support for strong typing. This ensures that serialized and deserialized data conform to expected structures, reducing errors during development by enforcing type checks at compile time.

In complex protocols, layouts can contain nested structures. This is where nested layouts become essential, allowing you to represent hierarchical data (such as transactions or multi-part messages) clearly and structured.

Refer to the following nested layout where a message contains nested fields:

```typescript
const nestedLayout = [
  {
    name: "source",
    binary: "object",
    layout: [
      { name: "chainId", binary: "uint", size: 2 },
      { name: "sender", binary: "bytes", size: 32 }
    ]
  },
  {
    name: "redeemer",
    binary: "object",
    layout: [
      { name: "address", binary: "bytes", size: 32 },
      { name: "message", binary: "bytes", lengthSize: 4 }
    ]
  }
] as const satisfies Layout;
```

In this layout:

 - source is an object with two fields: chainId and sender
 - redeemer is another object with two fields: address and a length-prefixed message

### Strong Typing

Using TypeScript, the LayoutToType utility provided by the SDK automatically generates a strongly typed structure based on the layout:

```typescript
type NestedMessage = LayoutToType<typeof nestedLayout>;
```

This ensures that when you serialize or deserialize data, it matches the expected structure. For example:

```typescript
const message: NestedMessage = {
  source: {
    chainId: 6,
    sender: new Uint8Array(32),
  },
  redeemer: {
    address: new Uint8Array(32),
    message: new Uint8Array([0x01, 0x02, 0x03])
  }
};
```

### Serialization and Deserialization with Nested Layouts

You can serialize and deserialize nested structures in the same way as simpler layouts:

```typescript
const serializedNested = serializeLayout(nestedLayout, message);
const deserializedNested = deserializeLayout(nestedLayout, serializedNested);

console.log(deserializedNested);
```

By enforcing strong typing, TypeScript helps ensure that the message object conforms to the nested layout structure, reducing the risk of data inconsistency during cross-chain communication.

## Common Pitfalls & Best Practices

When working with the Wormhole SDK layout system, it's important to be aware of a few common issues that can arise. Below are some pitfalls to avoid and best practices to ensure smooth integration.

### Pitfalls to Avoid

#### Mismatched Types in Layouts

Ensure that the type you define in your layout matches the actual data type used in serialization and deserialization. For example, if you define a field as binary: "uint", the corresponding data should be a `number` or `bigint`, not a `string` or `bytes`.

```typescript
// Incorrect: Passing a string where an unsigned integer is expected
{ name: "sourceChain", binary: "uint", size: 2 } 
// Usage should be: { sourceChain: 6 } not { sourceChain: "6" }
```

#### Incorrect Sizes for Bytes and Integers

Be careful when specifying sizes for uint, int, and bytes types. For example, uint types need to match the size of bytes. If the size is too small or too large, it will cause serialization or deserialization failures.

```typescript
// Pitfall: Mismatch between the size of data and the defined size in the layout
{ name: "orderSender", binary: "bytes", size: 32 }
// If the provided data is not exactly 32 bytes, this will fail
```

#### Incorrectly Defined Arrays

Arrays can be fixed-length or length-prefixed, so it’s important to define them correctly. Fixed-length arrays must match the specified length, while length-prefixed arrays need a lengthSize field.

```typescript
// Pitfall: Array length does not match the expected size
{ name: "redeemerMessage", binary: "bytes", lengthSize: 4 }
```

### Best Practices

These best practices and common pitfalls can help prevent bugs and improve the reliability of your implementation when working with layouts in the Wormhole SDK.

#### Use Constants for Sizes and Types

Instead of hardcoding sizes and types across your codebase, define constants that can be reused across multiple layouts. This ensures consistency and reduces the chance of errors.

```typescript
const SIZE_32 = 32;
const UINT_TYPE = "uint";

{ name: "orderSender", binary: "bytes", size: SIZE_32 }
{ name: "sourceChain", binary: UINT_TYPE, size: 2 }
```

#### Validate Data Before Serialization

Before calling serializeLayout, ensure your data matches the expected structure and types. Catching errors earlier in the process can save debugging time.

```typescript
// Validate data structure before serialization
const exampleFill = {
  sourceChain: 6,
  orderSender: new Uint8Array(32), // ensure correct size and type
  // more fields...
};
```

#### Consistent Error Handling

Always handle errors during both serialization and deserialization. Catching exceptions allows you to log or resolve issues gracefully when working with potentially corrupted or invalid data.

```typescript
try {
  const deserialized = deserializeLayout(fillLayout, data);
} catch (error) {
  console.error("Deserialization failed:", error);
}
```

#### Leverage Reusable Layouts

Create reusable layout definitions for commonly used structures like chain IDs, addresses, and signatures whenever possible. This minimizes code duplication and helps keep your layouts maintainable.

```typescript
const commonLayout = [
  { name: "chainId", binary: "uint", size: 2 },
  { name: "address", binary: "bytes", size: 32 },
];

// Reuse the common layout in different contexts
```

## Advanced Use Cases

The Wormhole SDK’s layout system is designed to handle various data structures and serialization needs. This section will explore more advanced use cases, such as handling conditional data structures, fixed conversions, and optimizing serialization performance.

???- code "Switch Statements for Conditional Layouts"

    In some cases, the structure of serialized data might change based on a specific field, such as a payload ID. The switch layout type conditionally defines layouts based on a value.

    For example, different message types can be identified using a payload ID, and the layout for each message can be determined at runtime:

    ```typescript
    const switchLayout = {
    binary: "switch",
    idSize: 1, // size of the payload ID
    idTag: "messageType", // tag to identify the type of message
    layouts: [
        [[1, "messageType1"], fillLayout], // layout for type 1
        [[2, "messageType2"], fastFillLayout], // layout for type 2
    ],
    } as const satisfies Layout;
    ```

    The switch statement helps developers parse multiple payload types using the same structure, depending on a control field like an ID.

???- code "Fixed Conversions and Omitted Fields"

    Fixed conversions and omitted fields allow developers to handle known, static data without including it in every serialization or deserialization operation. For instance, when specific fields in a layout always hold a constant value, they can be omitted from the deserialized object.

    **Example: Fixed Conversion**

    In some cases, a field may always contain a predefined value. The layout system supports fixed conversions, allowing developers to “hard-code” these values:

    ```typescript
    const fixedConversionLayout = {
    binary: "uint",
    size: 2,
    custom: {
        to: "Ethereum",
        from: chainToChainId("Ethereum"),
    },
    } as const satisfies Layout;
    ```

    **Example: Omitted Fields**

    Omitted fields can be useful when padding or reserved fields exist that don’t need to be returned in the deserialized output:

    ```typescript
    const omittedFieldLayout = [
    { name: "sourceChain", binary: "uint", size: 2, omit: true }, // omitted from deserialization
    ] as const satisfies Layout;
    ```

    In this case, sourceChain is omitted from the deserialized result but still considered during serialization.

???- code "Lazy Instantiation"

    Building large and complex layouts can sometimes be computationally expensive. The SDK provides the ability to easily instantiate certain layout features, which can improve performance when building complex structures.

    ```typescript
    const lazyDiscriminator = lazyInstantiate(() => layoutDiscriminator(layouts));
    ```

    By using lazy instantiation, layout structures or discriminators are only created when they are first needed, which can reduce the initial overhead when dealing with large datasets or layouts.

## Integration with Wormhole Protocol

The layout system is critical in ensuring seamless interaction with the Wormhole Protocol, mainly when dealing with VAAs. These cross-chain messages must be serialized and deserialized to ensure they can be transmitted and processed accurately across different chains.

### VAAs and Payload Handling

Wormhole’s core functionality revolves around VAAs, which are signed messages that allow different chains to communicate. These VAAs contain complex data that must be encoded using layouts. The layout system in the Wormhole SDK simplifies this by providing structured serialization and deserialization tools.

Here’s how a typical VAA payload might be structured using the Wormhole SDK's layout system:

```typescript
const vaaLayout = [
  { name: "version", binary: "uint", size: 1 },
  { name: "guardianSetIndex", binary: "uint", size: 4 },
  { name: "timestamp", binary: "uint", size: 4 },
  { name: "emitterChain", binary: "uint", size: 2 },
  { name: "emitterAddress", binary: "bytes", size: 32 },
  { name: "sequence", binary: "uint", size: 8 },
  { name: "consistencyLevel", binary: "uint", size: 1 },
] as const satisfies Layout;
```

This layout structure lets developers easily define and work with VAAs in their applications, ensuring the data conforms to Wormhole’s protocol requirements.

### Serializing VAA Data

Developers can use the serializeLayout function to serialize a VAA message. This ensures that the message is correctly formatted before being transmitted between chains.

```typescript
const vaaData = {
  version: 1,
  guardianSetIndex: 5,
  timestamp: 1633000000,
  emitterChain: 2, // Ethereum
  emitterAddress: new Uint8Array(32).fill(0),
  sequence: BigInt(1),
  consistencyLevel: 1,
};

const serializedVAA = serializeLayout(vaaLayout, vaaData);
```

### Deserializing VAA Data

When a VAA message is received, it needs to be deserialized so that the application can work with it. The deserializeLayout function converts the binary VAA back into a structured object.

```typescript
const deserializedVAA = deserializeLayout(vaaLayout, serializedVAA);
```

This allows the application to interpret the incoming data and act accordingly quickly.

### Registering Custom Payloads

In addition to predefined layouts, Wormhole integrators can define and register their custom payloads. This is especially useful when integrating protocol-specific features, such as the "Submit Your Protocol" feature in WormholeScan.

Below's an example of a custom payload registration:

```typescript
const customPayloadLayout = [
  { name: "protocolId", binary: "uint", size: 4 },
  { name: "payload", binary: "bytes", lengthSize: 4 },
] as const satisfies Layout;

const serializedCustomPayload = serializeLayout(customPayloadLayout, {
  protocolId: 1234,
  payload: new Uint8Array([0x01, 0x02, 0x03]),
});
```

Custom payloads enable developers to extend the functionality of Wormhole's cross-chain messages, allowing for more specialized use cases.

## Commonly Used Layouts

Specific layouts appear frequently in cross-chain interactions when working with the Wormhole SDK. These common layouts include fields like chain IDs, addresses, and signatures, which are essential for Wormhole’s cross-chain messaging infrastructure.

### Chain ID Layout

Chain IDs are crucial for identifying cross-chain messages' source and destination chains. Wormhole uses layouts to handle Chain IDs efficiently.

```typescript
const chainIdLayout = { name: "chainId", binary: "uint", size: 2 } as const;
```

This layout defines a 2-byte unsigned integer (uint) for Chain IDs. It is commonly used in VAAs and other payloads to identify which chain the message is originating from or targeting.

### Address Layout

Addresses are used to reference contracts or wallets across chains. These layouts typically consist of a fixed byte size, often 32 bytes.

```typescript
const addressLayout = { name: "address", binary: "bytes", size: 32 } as const;
```

This layout defines a 32-byte array representing an address, a standard format for smart contracts and user addresses.

### Signature Layout

Signatures, typically fixed-size byte arrays, verify the integrity and authenticity of messages in the Wormhole protocol.

```typescript
const signatureLayout = { name: "signature", binary: "bytes", size: 64 } as const;
```

This layout represents a 64-byte cryptographic signature commonly used for verifying VAAs.

## Performance Considerations

Efficient serialization and deserialization are crucial when handling large amounts of cross-chain data. Below are some strategies and best practices to ensure optimal performance when using Wormhole SDK layouts.

### Lazy Instantiation

Large, complex layouts can introduce overhead, especially when layouts are built eagerly. Using lazy instantiation, you can defer layout creation until needed, reducing the upfront cost.

```typescript
const lazyDiscriminator = lazyInstantiate(() => layoutDiscriminator(layouts));
```

This ensures that layout structures or discriminators are only created when required, improving overall performance, especially when dealing with complex or large datasets.

### Minimize Layout Redundancy

When defining layouts, reuse common components (like chain IDs and addresses) across your project to avoid duplication. This not only improves code maintainability but also minimizes unnecessary memory use.

```typescript
const commonLayouts = [
  { name: "chainId", binary: "uint", size: 2 },
  { name: "address", binary: "bytes", size: 32 },
];
```

### Batch Serialization

Batch serialization and deserialization operations are more efficient when dealing with large amounts of data. This reduces the number of function calls and can improve performance by handling multiple layouts in a single operation.

```typescript
const batchSerialized = layouts.map(layout => serializeLayout(layout, data));
```

This approach is beneficial when working with multiple payloads or messages that must be processed together.