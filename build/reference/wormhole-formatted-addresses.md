---
title: Wormhole Formatted Addresses
description: 
---

# Wormhole Formatted Addresses

## Introduction

Wormhole formatted addresses are 32-byte hex representations of addresses from any supported blockchain. Whether an address originates from EVM, Solana, Cosmos, or another ecosystem, Wormhole standardizes all addresses into this 32-byte format.

The reason for this format is to provide a universal, cross-chain compatible address system. Since Wormhole supports multiple blockchain ecosystems, having a consistent format is essential for smooth interoperability in cross-chain activities like token transfers and messaging.

Wormhole formatted addresses are used in various Wormhole SDK methods, particularly when working with cross-chain transactions and contracts. As an example, the `transfer()` function in the NTT EVM contract uses the Wormhole formatted `bytes32` representation for the recipient's address.

## Platform-Specific Address Formats

Each blockchain ecosystem supported by Wormhole has its own method for formatting native addresses. These formats differ based on the design of the chain and how it handles addresses. To enable cross-chain compatibility, Wormhole converts these native addresses into a standardized 32-byte hex format, referred to as a Wormhole formatted address.

Here is an overview of the native address formats for different platforms and how they are normalized to the Wormhole format:

| Platform        | Native Address Format            | Wormhole Formatted Address |
|-----------------|----------------------------------|----------------------------|
| EVM             | `Hex (e.g., 0x...) `             | `32-byte Hex`              |
| Solana          | `Base58`                         | `32-byte Hex `             |
| CosmWasm        | `Bech32`                         | `32-byte Hex `             |
| Algorand        | `Algorand App ID `               | `32-byte Hex `             |
| Sui             | `Hex`                            | `32-byte Hex `             |
| Aptos           | `Hex`                            | `32-byte Hex `             |
| Near            | `SHA-256 `                       | `32-byte Hex `             |

These conversions allow Wormhole to interact seamlessly with a wide variety of chains while using a uniform format for all addresses.

### How Address Conversion Works

Wormhole uses the `UniversalAddress` class to convert addresses from their platform-specific formats into the Wormhole formatted `bytes32`. For example:

 - EVM addresses, which are typically represented as a 20-byte hex string, are padded or truncated to fit the 32-byte format.
 - Solana addresses, which are Base58 encoded, are decoded into their raw byte format and then normalized to 32 bytes.

This ensures that all platforms can interact with each other using a consistent address structure, even though their native formats differ.

### Address Format Handling

The Wormhole SDK provides mappings that associate each platform with its native address format. You can find this mapping in the Wormhole SDK file [`platforms.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/007f61b27c650c1cf0fada2436f79940dfa4f211/core/base/src/constants/platforms.ts#L93-L102){target=\_blank}:

```typescript
const platformAddressFormatEntries = [
  ["Evm", "hex"],
  ["Solana", "base58"],
  ["Cosmwasm", "bech32"],
  ["Algorand", "algorandAppId"],
  ["Sui", "hex"],
  ["Aptos", "hex"],
  ["Near", "sha256"]
];
```

These entries define how the `UniversalAddress` class handles different address formats based on the platform.

## The UniversalAddress Class

The `UniversalAddress` class is the central component for working with Wormhole formatted addresses. It allows developers to convert native blockchain addresses (e.g., from EVM, Solana, or Cosmos) into a consistent 32-byte hex format, which is used across all Wormhole operations.

Purpose of the `UniversalAddress` class:

 - Converts platform-specific addresses into the Wormhole formatted 32-byte address
 - Provides methods to convert between native formats and the universal Wormhole format
 - Ensures consistent handling of addresses across multiple blockchains in a cross-chain environment

