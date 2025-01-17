---
title: VAAs and Protocols
description: Understand how VAAs enable cross-chain messaging and how to handle them using Wormhole's TypeScript and Solidity SDKs.
---

# VAAs and Protocols

## Introduction

Wormhole’s core functionality revolves around [Verifiable Action Approvals](/docs/learn/infrastructure/vaas/){target=\_blank} (VAAs), which are signed messages enabling secure and decentralized communication across chains. This guide focuses on their practical usage within the Wormhole ecosystem, specifically when working with protocol-specific messages in the [TypeScript](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank} and [Solidity](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} SDKs.

For deeper insights into serialization, deserialization, and protocol design, refer to:

- [Data Layouts](/docs/build/applications/wormhole-sdk/sdk-layout/){target=\_blank} for serialization concepts
- [Building Protocols and Payloads](/docs/build/applications/wormhole-sdk/protocols-payloads/){target=\_blank} for designing custom protocol messages

This guide will help you understand how to handle VAAs and protocol messages in off-chain and on-chain scenarios.

## VAA Structure

Understanding the structure of VAAs is fundamental to working with Wormhole’s SDKs. Each section of the VAA—Header, Envelope, and Payload—serves a specific role:

| Section  | Description                                                                                              |
|----------|----------------------------------------------------------------------------------------------------------|
| Header   |  Includes the version and guardian signature information required to verify the VAA                      |
| Envelope |  Contains metadata about the emitted message, such as the emitter chain, emitter address, and timestamp  |
| Payload  |  Represents the actual message, in raw bytes, without a length prefix                                    |

The Body of the VAA combines the Envelope and Payload. It is the core data signed by the Wormhole Guardians and hashed (using `keccak256`) to generate the VAA's unique identifier.

When integrating protocols like Token Bridge or Wormhole Relayer:

- The TypeScript SDK handles VAAs off-chain, focusing on deserialization, validation, and payload extraction before submission
- The Solidity SDK processes VAAs on-chain, using libraries like `VaaLib` to decode and execute protocol actions

## VAAs in Protocol Contexts

### How VAAs Enable Protocol-Specific Messaging

VAAs are the backbone of Wormhole’s cross-chain communication, encapsulating critical protocol payloads that drive actions on different blockchains. Each protocol—such as [Token Bridge](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/definitions/src/protocols/tokenBridge){target=\_blank}, [Wormhole Relayer](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/definitions/src/protocols/relayer){target=\_blank}, or [Circle CCTP](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/core/definitions/src/protocols/circleBridge){target=\_blank}—uses VAAs to securely transmit its messages across chains.

Examples of mapping protocols to VAAs:

| Protocol        | Payload Purpose                                           | Example                            |
|-----------------|-----------------------------------------------------------|------------------------------------|
| Token Bridge    |  Transfers token data and metadata                        |  Token transfer or redemption      |
| Wormhole Relayer|  Manages delivery instructions for messages across chains |  Delivery fee or refund handling   |
| Circle CCTP     |  Facilitates stablecoin mint-and-burn operations          |  Circle-issued stablecoin transfer |

Each protocol integrates its payload format into the VAA structure, ensuring consistent message validation and execution across the ecosystem.

### TypeScript SDK: Off-Chain Handling of VAAs

The TypeScript SDK is designed for off-chain operations like reading, validating, and manipulating VAAs before submitting them to a chain. Developers can easily deserialize VAAs to extract protocol payloads and prepare actions such as initiating token transfers or constructing delivery instructions.

In the example below, we use the real [`envelopeLayout`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/dd6bd2463264680597519285ff559f9e92e85ca7/core/definitions/src/vaa/vaa.ts#L44-L51){target=\_blank} from Wormhole’s TS SDK to deserialize and extract essential information like the emitter chain, sequence, and consistency level:

```typescript
--8<-- "code/build/applications/wormhole-sdk/vaas-protocols/ts-sdk.ts"
```

For more details, you can refer to the [parseVAA example](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/parseVaa.ts){target=\_blank} in the Wormhole SDK repository.

### Solidity SDK: On-Chain Handling of VAAs

The Solidity SDK enables on-chain processing of VAAs directly within smart contracts. This is essential for real-time validation, decoding, and execution of protocol-specific payloads. Developers can use libraries like [`VaaLib`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/e19013d08d1fdf5af9e6344c637e36a270422dd9/src/libraries/VaaLib.sol){target=\_blank} to parse the VAA header and payload, ensuring the message is authentic and consistent with Wormhole’s validation.

Below is an example of parsing an envelope on-chain using the Solidity SDK:

```solidity
--8<-- "code/build/applications/wormhole-sdk/vaas-protocols/solidity-sdk.sol"
```