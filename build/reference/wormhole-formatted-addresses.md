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

Key functions:

 - **`Constructor`** - use the UniversalAddress constructor to convert native addresses into the Wormhole format

  ```typescript
  const universalAddress = new UniversalAddress("0x123...", "hex");
  ```
 - **`toUniversalAddress()`** - converts a platform-specific address into the Wormhole formatted 32-byte address. This ensures compatibility when interacting with Wormhole
 - **`toNative()`** - converts the Wormhole formatted address back to a native address for a specific blockchain platform
  ```typescript
  const nativeAddress = universalAddress.toNative("Evm");
  ```
 - **`toString()`** - returns the Wormhole formatted address as a hex string, which can be used in various SDK operations
  ```typescript
  console.log(universalAddress.toString()); // Outputs the address as a hex string
  ```

When building cross-chain applications with Wormhole, you’ll often need to:

 - Convert native addresses (like an EVM or Solana address) into a universal format to ensure cross-chain compatibility
 - Convert Wormhole formatted addresses back into native addresses when you need to interact with platform-specific smart contracts or applications

The `UniversalAddress` class simplifies this process by providing methods to handle these conversions smoothly.

## Converting Between Native and Wormhole Formatted Addresses

When building cross-chain applications with Wormhole, you’ll often need to convert addresses between their native formats (e.g., EVM’s hex or Solana’s base58) and the standardized 32-byte hex format (Wormhole formatted). The Wormhole SDK provides methods to easily perform these conversions.

### Converting a Native Address to a Wormhole Formatted Address

Using the `toUniversalAddress()` method, you can convert native addresses into Wormhole formatted addresses. Below are examples for both EVM and Solana addresses.

 - **EVM Example**:
  
    ```typescript
    import { toNative } from "@wormhole-foundation/sdk-core";

    // Convert EVM (Ethereum) native address to Universal Address
    const ethAddress: NativeAddress<"Evm"> = toNative("Ethereum", "0x123123123123...");
    const universalAddress = ethAddress.toUniversalAddress().toString();

    console.log("Universal Address (EVM):", universalAddress);
    // Output: Universal Address (EVM): 0x00000000123123123..... (32-byte hex address)
    ```

  - **Solana Example**:
    
    ```typescript
    // Convert Solana native address to Universal Address
    const solAddress: NativeAddress<"Solana"> = toNative("Solana", "3972....");
    const universalAddress = solAddress.toUniversalAddress().toString();

    console.log("Universal Address (Solana):", universalAddress);
    // Output: Universal Address (Solana): 0x1fc.... (32-byte hex address)
    ```

In both examples:

 - **`toNative()`** - converts the native platform address (EVM or Solana) into a native address type
 - **`toUniversalAddress()`** - then converts that address into the Wormhole formatted 32-byte hex address
 - The result is a standardized address format, ready for use in cross-chain operations

### Converting Back to Native Addresses

If you need to convert a Wormhole formatted address back into its native format, use the toNative() method. Here’s how you can convert a Wormhole formatted address back to an EVM or Solana native address:

```typescript
const nativeAddressEvm = universalAddress.toNative("Evm");
console.log("EVM Native Address:", nativeAddressEvm);

const nativeAddressSolana = universalAddress.toNative("Solana");
console.log("Solana Native Address:", nativeAddressSolana);
```

These conversions ensure that your cross-chain applications can seamlessly handle addresses across different ecosystems.

## Use Cases for Wormhole Formatted Addresses

### Cross-chain Token Transfers

Cross-chain token transfers require addresses to be converted into a standard format. For example, when transferring tokens from Ethereum to Solana, the Ethereum address is converted into a Wormhole formatted address to ensure compatibility. After the transfer, the Wormhole formatted address is converted back into the Solana native format.

### Smart Contract Interactions

In smart contract interactions, especially when building dApps that communicate across multiple chains, Wormhole formatted addresses provide a uniform way to reference addresses. This ensures that addresses from different blockchains can interact seamlessly, whether you're sending messages or making cross-chain contract calls.

### dApp Development

For cross-chain dApp development, Wormhole formatted addresses simplify handling user wallet addresses across various blockchains. This allows developers to manage addresses consistently, regardless of whether they're working with EVM, Solana, or another supported platform.

### Relayers and Infrastructure

Finally, relayers and infrastructure components, such as Wormhole Guardians, rely on the standardized format to efficiently process and relay cross-chain messages. Using a uniform address format simplifies operations, ensuring smooth interoperability across multiple blockchains.


