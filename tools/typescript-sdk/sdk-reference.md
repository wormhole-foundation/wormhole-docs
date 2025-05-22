---
title: Wormhole TS SDK 
description: Explore Wormhole's TypeScript SDK and learn how to perform different types of transfers, including native, token, and USDC.
categories: Typescript-SDK
---

# Wormhole TypeScript SDK

## Introduction

The Wormhole TypeScript SDK is useful for interacting with the chains Wormhole supports and the [protocols](#protocols) built on top of Wormhole. This package bundles together functions, definitions, and constants that streamline the process of connecting chains and completing transfers using Wormhole. The SDK also offers targeted sub-packages for Wormhole-connected platforms, which allow you to add multichain support without creating outsized dependencies.

This section covers all you need to know about the functionality and ease of development offered through the Wormhole TypeScript SDK. Take a tour of the package to discover how it helps make integration easier. Learn more about how the SDK abstracts away complexities around concepts like platforms, contexts, and signers. Finally, you'll find guidance on usage, along with code examples, to show you how to use the tools of the SDK.


<div class="grid cards" markdown>

-   :octicons-download-16:{ .lg .middle } **Installation**

    ---

    Find installation instructions for both the meta package and installing specific, individual packages

    [:custom-arrow: Install the SDK](#installation)

-   :octicons-book-16:{ .lg .middle } **Concepts**

    ---

    Understand key concepts and how the SDK abstracts them away. Learn more about platforms, chain context, addresses, and signers

    [:custom-arrow: Explore concepts](#concepts)

-   :octicons-file-code-16:{ .lg .middle } **Usage**

    ---

    Guidance on using the SDK to add seamless interchain messaging to your application, including code examples

    [:custom-arrow: Use the SDK](#usage)

-   :octicons-code-square-16:{ .lg .middle } **TSdoc for SDK**

    ---

    Review the TSdoc for the Wormhole TypeScript SDK for a detailed look at availabel methods, classes, interfaces, and definitions

    [:custom-arrow: View the TSdoc on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}

</div>

!!! warning
    This package is a work in progress. The interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues){target=\_blank} any issues you find.

## Installation

### Basic

To install the meta package using npm, run the following command in the root directory of your project:

```bash
npm install @wormhole-foundation/sdk
```

This package combines all the individual packages to make setup easier while allowing for tree shaking.  

### Advanced

Alternatively, you can install a specific set of published packages individually:

??? interface "`sdk-base` - exposes constants"

    ```sh
    npm install @wormhole-foundation/sdk-base
    ```

??? interface "`sdk-definitions` - exposes contract interfaces, basic types, and VAA payload definitions"

    ```sh
    npm install @wormhole-foundation/sdk-definitions
    ```

??? interface "`sdk-evm` - exposes EVM-specific utilities"

    ```sh
    npm install @wormhole-foundation/sdk-evm
    ```

??? interface "`sdk-evm-tokenbridge` - exposes the EVM Token Bridge protocol client"

    ```sh
    npm install @wormhole-foundation/sdk-evm-tokenbridge
    ```

## Usage

Getting your integration started is simple. First, import Wormhole:

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts::1'
```

Then, import each of the ecosystem [platforms](#platforms) that you wish to support:

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts:4:9'
```


To make the [platform](#platforms) modules available for use, pass them to the Wormhole constructor:

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts:13:20'
```

With a configured Wormhole object, you can do things like parse addresses for the provided platforms, get a [`ChainContext`](#chain-context) object, or fetch VAAs.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts:22:22'
```

You can retrieve a VAA as follows. In this example, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will vary by network.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts:54:61'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/get-vaa.ts'
    ```

Optionally, you can override the default configuration with a partial `WormholeConfig` object to specify particular fields, such as a different RPC endpoint.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/config-override.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/config.ts'
    ```

## Concepts

Understanding several higher-level Wormhole concepts and how the SDK abstracts them away will help you use the tools most effectively. The following sections will introduce and discuss the concepts of platforms, chain contexts, addresses, signers, and protocols, how they are used in the Wormhole context, and how the SDK helps ease development in each conceptual area.

### Platforms

While every chain has unique attributes, chains from the same platform typically have standard functionalities they share. The SDK includes `Platform` modules, which create a standardized interface for interacting with the chains of a supported platform. The contents of a module vary by platform but can include:

- Protocols, such as [Wormhole core](#wormhole-core), preconfigured to suit the selected platform
- Definitions and configurations for types, signers, addresses, and chains 
- Helpers configured for dealing with unsigned transactions on the selected platform

These modules also import and expose essential functions and define types or constants from the chain's native ecosystem to reduce the dependencies needed to interact with a chain using Wormhole. Rather than installing the entire native package for each desired platform, you can install a targeted package of standardized functions and definitions essential to connecting with Wormhole, keeping project dependencies as slim as possible.


Wormhole currently supports the following platforms:

- EVM
- Solana
- Cosmos
- Sui
- Aptos
- Algorand

See the [Platforms folder of the TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms){target=\_blank} for an up-to-date list of the platforms supported by the Wormhole TypeScript SDK.

### Chain Context

The `definitions` package of the SDK includes the `ChainContext` class, which creates an interface for working with connected chains in a standardized way. This class contains the network, chain, and platform configurations for connected chains and cached RPC and protocol clients. The `ChainContext` class also exposes chain-specific methods and utilities. Much of the functionality comes from the `Platform` methods but some specific chains may have overridden methods via the context. This is also where the `Network`, `Chain`, and `Platform` type parameters which are used throughout the package are defined.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-chain.ts'
```

### Addresses

The SDK uses the `UniversalAddress` class to implement the `Address` interface, which all address types must implement. Addresses from various networks are parsed into their byte representation and modified as needed to ensure they are exactly 32 bytes long. Each platform also has an address type that understands the native address formats, referred to as `NativeAddress.` These abstractions allow you to work with addresses consistently regardless of the underlying chain.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/addresses.ts'
```

### Tokens

Similar to the `ChainAddress` type, the `TokenId` type provides the chain and address of a given token. The following snippet introduces `TokenId`, a way to uniquely identify any token, whether it's a standard token or a blockchain's native currency (like ETH for Ethereum).

Wormhole uses their contract address to create a `TokenId` for standard tokens. For native currencies, Wormhole uses the keyword `native` instead of an address. This makes it easy to work with any type of token consistently.

Finally, the snippet demonstrates how to convert a `TokenId` back into a regular address format when needed.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/tokens.ts'
```

### Signers

Certain methods of signing transactions require a `Signer` interface in the SDK. Depending on the specific requirements, this interface can be fulfilled by either a `SignOnlySigner` or a `SignAndSendSigner`. A signer can be created by wrapping an offline or web wallet.

A `SignOnlySigner` is used when the signer isn't connected to the network or prefers not to broadcast transactions themselves. It accepts an array of unsigned transactions and returns an array of signed and serialized transactions. Before signing, the transactions may be inspected or altered. It's important to note that the serialization process is chain-specific. Refer to the testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank} or [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for an example of how to implement a signer for a specific chain or platform.

Conversely, a `SignAndSendSigner` is appropriate when the signer is connected to the network and intends to broadcast the transactions. This type of signer also accepts an array of unsigned transactions but returns an array of transaction IDs corresponding to the order of the unsigned transactions.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/signers.ts'
```

#### Set Up a Signer with Ethers.js

To sign transactions programmatically with the Wormhole SDK, you can use Ethers.js to manage private keys and handle signing. Here's an example of setting up a signer using Ethers.js:

```javascript
--8<-- 'code/tools/typescript-sdk/sdk-reference/ethers.js'
```

 - **`provider`** - responsible for connecting to the Ethereum network (or any EVM-compatible network). It acts as a bridge between your application and the blockchain, allowing you to fetch data, check the state of the blockchain, and submit transactions

 - **`signer`** - represents the account that will sign the transaction. In this case, you’re creating a signer using the private key associated with the account. The signer is responsible for authorizing transactions by digitally signing them with the private key

 - **`Wallet`** - combines both the provider (for blockchain interaction) and the signer (for transaction authorization), allowing you to sign and send transactions programmatically

These components work together to create, sign, and submit a transaction to the blockchain.

???- tip "Managing Private Keys Securely"
    Handling private keys is unavoidable, so it’s crucial to manage them securely. Here are some best practices:

     - **Use environment variables** - avoid hardcoding private keys in your code. Use environment variables or secret management tools to inject private keys securely
     - **Hardware wallets** - for production environments, consider integrating hardware wallets to keep private keys secure while allowing programmatic access through the SDK

### Protocols

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality. If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

#### Wormhole Core

The core protocol underlies all Wormhole activity. This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [emitter address](https://docs.wormhole.com/wormhole/reference/glossary#emitter){target=\_blank}, the [sequence number](https://docs.wormhole.com/wormhole/reference/glossary#sequence){target=\_blank} for the message, and the payload of the message itself.

The following example demonstrates sending and verifying a message using the Wormhole Core protocol on Solana.

First, initialize a Wormhole instance for the Testnet environment, specifically for the Solana chain. Then, obtain a signer and its associated address, which will be used to sign transactions.

Next, get a reference to the core messaging bridge, which is the main interface for interacting with Wormhole's cross-chain messaging capabilities.
The code then prepares a message for publication. This message includes:

- The sender's address
- The message payload (in this case, the encoded string `lol`)
- A nonce (set to `0` here, but can be any user-defined value to uniquely identify the message)
- A [consistency (finality) level](/docs/products/reference/consistency-levels/){target=\_blank} (set to `0`, which determines the finality requirements for the message)

After preparing the message, the next steps are to generate, sign, and send the transaction or transactions required to publish the message on the Solana blockchain. Once the transaction is confirmed, the Wormhole message ID is extracted from the transaction logs. This ID is crucial for tracking the message across chains.

The code then waits for the Wormhole network to process and sign the message, turning it into a Verified Action Approval (VAA). This VAA is retrieved in a `Uint8Array` format, with a timeout of 60 seconds.

Lastly, the code will demonstrate how to verify the message on the receiving end. A verification transaction is prepared using the original sender's address and the VAA, and finally, this transaction is signed and sent.

???+ code "View the complete script"
    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/example-core-bridge.ts'
    ```

The payload contains the information necessary to perform whatever action is required based on the protocol that uses it.

#### Token Bridge

The most familiar protocol built on Wormhole is the Token Bridge. Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge, which includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations. `WormholeTransfer` abstractions are the recommended way to interact with these protocols, but it is possible to use them directly.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.

## Transfers

While using the [`ChainContext`](#chain-context) and [`Protocol`](#protocols) clients directly is possible, the SDK provides some helpful abstractions for transferring tokens.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers

Performing a token transfer is trivial for any source and destination chains. You can create a new `Wormhole` object to make objects like `TokenTransfer` and `CircleTransfer`, to transfer tokens between chains.

The following example demonstrates the process of initiating and completing a token transfer. It starts by creating a `TokenTransfer` object, which tracks the transfer's state throughout its lifecycle. The code then obtains a quote for the transfer, ensuring the amount is sufficient to cover fees and any requested native gas.

The transfer process is divided into three main steps:

1. Initiating the transfer on the source chain
2. Waiting for the transfer to be attested (if not automatic)
3. Completing the transfer on the destination chain

For automatic transfers, the process ends after initiation. The code waits for the transfer to be attested for manual transfers and then completes it on the destination chain.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge.ts:120:158'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge.ts'
    ```

Internally, this uses the [TokenBridge](#token-bridge) protocol client to transfer tokens. Like other Protocols, the `TokenBridge` protocol provides a consistent set of methods across all chains to generate a set of transactions for that specific chain.

### Native USDC Transfers

You can also transfer native USDC using [Circle's CCTP](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank}. Please note that if the transfer is set to `Automatic` mode, a fee for performing the relay will be included in the quote. This fee is deducted from the total amount requested to be sent. For example, if the user wishes to receive `1.0` on the destination, the amount sent should be adjusted to `1.0` plus the relay fee. The same principle applies to native gas drop offs.

In the following example, the `wh.circleTransfer` function is called with several parameters to set up the transfer. It takes the amount to be transferred (in the token's base units), the sender's chain and address, and the receiver's chain and address. The function also allows specifying whether the transfer should be automatic, meaning it will be completed without further user intervention.

An optional payload can be included with the transfer, though it's set to undefined in this case. Finally, if the transfer is automatic, you can request that native gas (the blockchain's native currency used for transaction fees) be sent to the receiver along with the transferred tokens.

When waiting for the `VAA`, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will [vary by network](https://developers.circle.com/stablecoins/docs/required-block-confirmations#mainnet){target=\_blank}.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/cctp.ts:69:112'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/cctp.ts'
    ```

### Recovering Transfers

It may be necessary to recover an abandoned transfer before it is completed. To do this, instantiate the `Transfer` class with the `from` static method and pass one of several types of identifiers. A `TransactionId` or `WormholeMessageId` may be used to recover the transfer.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/cctp.ts:120:126'
```

??? code "View the complete script"
    ```ts hl_lines="130"
    --8<-- 'code/tools/typescript-sdk/sdk-reference/cctp.ts'
    ```

## Routes

While a specific `WormholeTransfer`, such as `TokenTransfer` or `CCTPTransfer`, may be used, the developer must know exactly which transfer type to use for a given request.

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

The following section demonstrates setting up and validating a token transfer using Wormhole's routing system.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts:24:31'
```

Once created, the resolver can be used to provide a list of input and possible output tokens.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts:33:53'
```

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfill the request. Creating a transfer request fetches the token details since all routes will need to know about the tokens.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts:55:67'
```

Choosing the best route is currently left to the developer, but strategies might include sorting by output amount or expected time to complete the transfer (no estimate is currently provided).

After choosing the best route, extra parameters like `amount`, `nativeGasDropoff`, and `slippage` can be passed, depending on the specific route selected. A quote can be retrieved with the validated request.

After successful validation, the code requests a transfer quote. This quote likely includes important details such as fees, estimated time, and the final amount to be received. If the quote is generated successfully, it's displayed for the user to review and decide whether to proceed with the transfer. This process ensures that all transfer details are properly set up and verified before any actual transfer occurs.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts:72:93'
```

Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts:100:106'
```

??? code "View the complete script"

    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/router.ts'
    ```

See the `router.ts` example in the [examples directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/examples){target=\_blank} for a full working example.

### Routes as Plugins

Routes can be imported from any npm package that exports them and configured with the resolver. Custom routes must extend [`Route`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/0c57292368146c460abc9ce9e7f6a42be8e0b903/connect/src/routes/route.ts#L21-L64){target=\_blank} and implement [`StaticRouteMethods`](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/0c57292368146c460abc9ce9e7f6a42be8e0b903/connect/src/routes/route.ts#L101){target=\_blank}.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/custom-route.ts'
```

A noteworthy example of a route exported from a separate npm package is Wormhole Native Token Transfers (NTT). See the [`NttAutomaticRoute`](https://github.com/wormhole-foundation/native-token-transfers/blob/66f8e414223a77f5c736541db0a7a85396cab71c/sdk/route/src/automatic.ts#L48){target=\_blank} route implementation.

## See Also

The TSdoc is available [on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}.
