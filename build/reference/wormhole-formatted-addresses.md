---
title: Wormhole Formatted Addresses
description: Explanation of Wormhole formatted 32-byte hex addresses, their conversion, and usage across different blockchain platforms.
categories: Reference
---

# Wormhole Formatted Addresses

## Introduction

Wormhole formatted addresses are 32-byte hex representations of addresses from any supported blockchain. Whether an address originates from EVM, Solana, Cosmos, or another ecosystem, Wormhole standardizes all addresses into this format to ensure cross-chain compatibility.

This uniform format is essential for smooth interoperability in token transfers and messaging across chains. Wormhole uses formatted addresses throughout the [Wormhole SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, especially in cross-chain transactions, such as transfer functions that utilize the `bytes32` representation for recipient addresses.

## Platform-Specific Address Formats

Each blockchain ecosystem Wormhole supports has its method for formatting native addresses. To enable cross-chain compatibility, Wormhole converts these native addresses into the standardized 32-byte hex format.

Here’s an overview of the native address formats and how they are normalized to the Wormhole format:

| Platform        | Native Address Format            | Wormhole Formatted Address |
|-----------------|----------------------------------|----------------------------|
| EVM             |  Hex (e.g., 0x...)               |  32-byte Hex               |
| Solana          |  Base58                          |  32-byte Hex               |
| CosmWasm        |  Bech32                          |  32-byte Hex               |
| Algorand        |  Algorand App ID                 |  32-byte Hex               |
| Sui             |  Hex                             |  32-byte Hex               |
| Aptos           |  Hex                             |  32-byte Hex               |
| Near            |  SHA-256                         |  32-byte Hex               |

These conversions allow Wormhole to interact seamlessly with various chains using a uniform format for all addresses.

### Address Format Handling

The Wormhole SDK provides mappings that associate each platform with its native address format. You can find this mapping in the Wormhole SDK file [`platforms.ts`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/007f61b27c650c1cf0fada2436f79940dfa4f211/core/base/src/constants/platforms.ts#L93-L102){target=\_blank}:

```typescript
const platformAddressFormatEntries = [
  ['Evm', 'hex'],
  ['Solana', 'base58'],
  ['Cosmwasm', 'bech32'],
  ['Algorand', 'algorandAppId'],
  ['Sui', 'hex'],
  ['Aptos', 'hex'],
  ['Near', 'sha256'],
];
```

These entries define how the [`UniversalAddress`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/007f61b27c650c1cf0fada2436f79940dfa4f211/core/definitions/src/universalAddress.ts#L23){target=\_blank} class handles different address formats based on the platform.

## Universal Address Methods

The `UniversalAddress` class is essential for working with Wormhole formatted addresses. It converts native blockchain addresses into the standardized 32-byte hex format used across Wormhole operations.

Key functions:

 - **`new UniversalAddress()`** - use the `UniversalAddress` constructor to convert native addresses into the Wormhole format

    ```typescript
    const universalAddress = new UniversalAddress('0x123...', 'hex');
    ```

 - **`toUniversalAddress()`** - converts a platform-specific address into the Wormhole formatted 32-byte hex address

    ```typescript
    const ethAddress: NativeAddress<'Evm'> = toNative('Ethereum', '0x0C9...');
    const universalAddress = ethAddress.toUniversalAddress().toString();
    ```

 - **`toNative()`** - converts the Wormhole formatted address back to a native address for a specific blockchain platform

    ```typescript
    const nativeAddress = universalAddress.toNative('Evm');
    ```

 - **`toString()`** - returns the Wormhole formatted address as a hex string, which can be used in various SDK operations

    ```typescript
    console.log(universalAddress.toString());
    ```

These methods allow developers to convert between native addresses and the Wormhole format, ensuring cross-chain compatibility.

## Convert Between Native and Wormhole Formatted Addresses

The Wormhole SDK allows developers to easily convert between native addresses and Wormhole formatted addresses when building cross-chain applications.

### Convert a Native Address to a Wormhole Formatted Address

Example conversions for EVM and Solana:

=== "EVM"

    ```typescript
    --8<-- 'code/build/reference/formatted-addresses/evm.ts'
    ```

=== "Solana"

    ```typescript
    --8<-- 'code/build/reference/formatted-addresses/solana.ts'
    ```

The result is a standardized address format that is ready for cross-chain operations.

### Convert Back to Native Addresses

Below is how you can convert a Wormhole formatted address back to an EVM or Solana native address:

```typescript
const nativeAddressEvm = universalAddress.toNative('Evm');
console.log('EVM Native Address:', nativeAddressEvm);

const nativeAddressSolana = universalAddress.toNative('Solana');
console.log('Solana Native Address:', nativeAddressSolana);
```

These conversions ensure that your cross-chain applications can seamlessly handle addresses across different ecosystems.

## Use Cases for Wormhole Formatted Addresses

### Cross-chain Token Transfers

Cross-chain token transfers require addresses to be converted into a standard format. For example, when transferring tokens from Ethereum to Solana, the Ethereum address is converted into a Wormhole formatted address to ensure compatibility. After the transfer, the Wormhole formatted address is converted back into the Solana native format.

### Smart Contract Interactions

In smart contract interactions, especially when building dApps that communicate across multiple chains, Wormhole formatted addresses provide a uniform way to reference addresses. This ensures that addresses from different blockchains can interact seamlessly, whether you're sending messages or making cross-chain contract calls.

### DApp Development

For cross-chain dApp development, Wormhole formatted addresses simplify handling user wallet addresses across various blockchains. This allows developers to manage addresses consistently, regardless of whether they work with EVM, Solana, or another supported platform.

### Relayers and Infrastructure

Finally, relayers and infrastructure components, such as Wormhole Guardians, rely on the standardized format to efficiently process and relay cross-chain messages. A uniform address format simplifies operations, ensuring smooth interoperability across multiple blockchains.