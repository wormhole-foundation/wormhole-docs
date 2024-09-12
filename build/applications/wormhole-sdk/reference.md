---
title: SDK Reference 
description: TODO
---

<!--TODO: Reference (outline all of the classes, functions, etc. - this should include Platforms, Chain Context, etc.)-->

## Introduction

 Understanding several higher-level Wormhole concepts, and how the SDK abstracts them away, will help you use the tools most effectively. The following sections will introduce and discuss the concepts of platforms, chain contexts, addresses, tokens, signers, and protocols, how they are used in the Wormhole context, and how the SDK helps ease development in each conceptual area. Detailed information on the functions, constants, and definitions exposed in each area is also included. 

!!! warning
    This package is a work in progress, so the interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues/){target=\_blank} any issues you find.


### Platforms

While every chain has unique attributes, chains from the same platform typically have standard functionalities they share. The SDK includes `Platform` modules, which create a standardized interface for interacting with the chains of a supported platform. The contents of a module vary by platform but can include:

- Protocols, such as [Wormhole core](#wormhole-core), preconfigured to suit the selected platform
- Definitions and configurations for types, signers, addresses, and chains 
- Helpers configured for dealing with unsigned transactions on the selected platform

These modules also import and expose essential functions and define types or constants from the chain's native ecosystem to reduce the dependencies needed to interact with a chain using Wormhole. Rather than installing the entire native package for each desired platform, you can install a targeted package of standardized functions and definitions essential to connecting with Wormhole, keeping project dependencies as slim as possible.

Wormhole currently supports the following platforms:

??? interface "EVM"

    ??? child "Available protocols"

        [**`CCTP`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/evm/protocols/cctp/){target=\_blank} - Circle's Cross-Chain Transfer Protocol for moving USDC securely across blockchains

        ---

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/evm/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Ethereum network

        ---

        [**`Portico`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/evm/protocols/portico/){target=\_blank} - Portico Bridge protocol, configured for Ethereum network

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/evm/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Ethereum network

??? interface "Solana"

    ??? child "Available protocols"

        [**`CCTP`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/solana/protocols/cctp/){target=\_blank} - Circle's Cross-Chain Transfer Protocol for moving USDC securely across blockchains

        ---

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/solana/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Solana network

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/solana/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Solana network

??? interface "Cosmos"

    ??? child "Available protocols"

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/cosmwasm/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Cosmos network 

        ---

        [**`IBC`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/cosmwasm/protocols/ibc){target=\_blank} - Cosmos' Inter-Blockchain Protocol, configured for Cosmos network

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/cosmwasm/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Cosmos network

??? interface "Sui"

    ??? child "Available protocols"

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/sui/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Sui network 

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/sui/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Sui network

??? interface "Aptos"

    ??? child "Available protocols"

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/aptos/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Aptos network 

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/aptos/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Aptos network


??? interface "Algorand"

    ??? child "Available protocols"

        [**`Core`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/algorand/protocols/core/){target=\_blank} - Wormhole's Core protocol, configured for Algorand network 

        ---

        [**`Token Bridge`**](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms/algorand/protocols/tokenBridge/){target=\_blank} - Wormhole's Token Bridge protocol, configured for Algorand network


### Chain Context

The `Wormhole` class provides a `getChain` method that returns a `ChainContext` class for a given chain. This context provides a consistent interface for interacting with a chain by holding the network, chain, and platform configurations along with cached RPC and protocol clients. The `ChainContext` class also exposes chain-specific methods and utilities, such as `getBalance`, which retrieves the balance of a token for a given address. Much of the `ChainContext` functionality comes from the `Platform` methods but some specific chains may have overridden methods via the context.

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-chain.ts'
```

### Addresses

The SDK uses the `UniversalAddress` class to implement the `Address` interface. To ensure seamless interoperability, addresses from various networks are parsed into their byte representation and modified as needed to ensure they are exactly 32 bytes long. Each platform also has an address type that understands the native address formats, referred to as `NativeAddress.` These abstractions allow you to work with addresses consistently regardless of the underlying chain.

```ts
--8<-- 'code/build/applications/wormhole-sdk/addresses.ts'
```

### Tokens

The `TokenId` interface provides a unique identifier for a token on a given chain. This interface accepts the chain name and token contract address to generate this unique identifier. In the case of a blockchain's native currency (like ETH for Ethereum), you pass the keyword `native` in place of a token contract address

The following example demonstrates usage of `TokenId`, including syntax for both passing a token contract address and using the `native` keyword. Finally, the snippet also demonstrates how to convert a `TokenId` back into a regular address format when needed.

```ts
--8<-- 'code/build/applications/wormhole-sdk/tokens.ts'
```

You can find the directory of token constants used by the SDK in the [`tokens`](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants/tokens){target=/_blank} folder of the `base` subpackage. 

### Signers

In the SDK, a `Signer` interface is required for certain methods to sign transactions. This interface can be fulfilled by either a `SignOnlySigner` or a `SignAndSendSigner`, depending on the specific requirements. A signer can be created by wrapping an existing offline wallet or a web wallet.

A `SignOnlySigner` is used in scenarios where the signer isn't connected to the network or prefers not to broadcast transactions themselves. It accepts an array of unsigned transactions and returns an array of signed and serialized transactions. Before signing, the transactions may be inspected or altered. It's important to note that the serialization process is chain-specific. Refer to the testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank} or [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for an example of how to implement a signer for a specific chain or platform.

Conversely, a `SignAndSendSigner` is appropriate when the signer is connected to the network and intends to broadcast the transactions. This type of signer also accepts an array of unsigned transactions but returns an array of transaction IDs, corresponding to the order of the unsigned transactions.

```ts
--8<-- 'code/build/applications/wormhole-sdk/signers.ts'
```

### Protocols

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality. If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

#### Wormhole Core

The core protocol forms the foundation for all Wormhole activity. Every supported platform module contains a core protocol configured to work with the specific platform. The protocol consists of two key subpackages, the `base` and `definitions` packages. The `base` package contains [constants](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants){target=/_blank} such as contract addresses, RPC configurations, and finality as well as [utility](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/utils){target=/_blank} types for accessing and validating constants. The [`definitions`](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/definitions) package defines the VAA payload structure layout, interfaces for platforms and chain contexts, protocol interfaces, and types. 

This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [emitter address](/learn/fundamentals/glossary#emitter){target=\_blank}, the [sequence number](/learn/fundamentals/glossary#sequence){target=\_blank} for the message, and the payload of the message itself.

The following example demonstrates sending and verifying a message using the Wormhole Core protocol on Solana.

First, initialize a Wormhole instance for the TestNet environment, specifically for the Solana chain. Then obtain a signer and its associated address, which will be used to sign transactions.
Next, get a reference to the core messaging bridge, which is the main interface for interacting with Wormhole's cross-chain messaging capabilities.
The code then prepares a message for publication. This message includes:

- The sender's address
- The message payload (in this case, the encoded string `lol`)
- A nonce (set to `0` here, but can be any user-defined value to uniquely identify the message)
- A consistency level (set to `0`, which determines the finality requirements for the message)

After preparing the message, the next steps are to generate, sign, and send the transaction or transactions required to publish the message on the Solana blockchain. Once the transaction is confirmed, the Wormhole message ID is extracted from the transaction logs. This ID is crucial for tracking the message across chains.

The code then waits for the Wormhole network to process and sign the message, turning it into a Verified Action Approval (VAA). This VAA is retrieved in a `Uint8Array` format, with a timeout of 60 seconds.

Lastly, the code will demonstrate how to verify the message on the receiving end. A verification transaction is prepared using the original sender's address and the VAA, and finally this transaction is signed and sent.

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/example-core-bridge.ts'
    ```

The payload contains the information necessary to perform whatever action is required based on the protocol that uses it.

#### Token Bridge

The most familiar protocol built on Wormhole is the Token Bridge. Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge. This includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations. `WormholeTransfer` abstractions are the recommended way to interact with these protocols but it is possible to use them directly.

```ts
--8<-- 'code/build/applications/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.