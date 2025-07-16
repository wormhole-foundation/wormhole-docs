---
title: Wormhole TS SDK 
description: Explore Wormhole's TypeScript SDK and learn how to perform different types of transfers, including native, token, and USDC.
categories: Typescript SDK
---

# TypeScript SDK Reference

This page covers all you need to know about the functionality offered through the Wormhole TypeScript SDK.

<div class="grid cards" markdown>

-   :octicons-download-16:{ .lg .middle } **Installation**

    ---

    Find installation instructions for both the meta package and installing specific, individual packages.

    [:custom-arrow: Install the SDK](/docs/tools/typescript-sdk/get-started/#install-the-sdk)

-   :octicons-code-square-16:{ .lg .middle } **TSdoc for SDK**

    ---

    Review the TSdoc for the Wormhole TypeScript SDK for a detailed look at available methods, classes, interfaces, and definitions.

    [:custom-arrow: View the TSdoc on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}

-   :octicons-code-square-16:{ .lg .middle } **Source Code**

    ---

    Want to go straight to the source? Check out the TypeScript SDK GitHub repository.
    
    [:custom-arrow: View GitHub Repository](https://github.com/wormhole-foundation/wormhole-sdk-ts/){target=\_blank}

</div>

!!! warning
    This package is a work in progress. The interface may change, and there are likely bugs. Please [report any issues](https://github.com/wormhole-foundation/wormhole-sdk-ts/issues){target=\_blank} you find.

## Concepts

Understanding key Wormhole concepts—and how the SDK abstracts them—will help you use the tools more effectively. The following sections cover platforms, chain contexts, addresses, signers, and protocols, explaining their roles in Wormhole and how the SDK simplifies working with them.

### Platforms

The SDK includes `Platform` modules, which create a standardized interface for interacting with the chains of a supported platform. The contents of a module vary by platform but can include:

- [Protocols](#protocols) preconfigured to suit the selected platform
- Definitions and configurations for types, signers, addresses, and chains 
- Helpers configured for dealing with unsigned transactions on the selected platform

These modules expose key functions and types from the native ecosystem, reducing the need for full packages and keeping dependencies lightweight.

??? interface "Supported platform modules"

    | Platform | Installation Command                               |
    |----------|----------------------------------------------------|
    | EVM      | <pre>```@wormhole-foundation/sdk-evm```</pre>      |
    | Solana   | <pre>```@wormhole-foundation/sdk-solana```</pre>   |
    | Algorand | <pre>```@wormhole-foundation/sdk-algorand```</pre> |
    | Aptos    | <pre>```@wormhole-foundation/sdk-aptos```</pre>    |
    | Cosmos   | <pre>```@wormhole-foundation/sdk-cosmwasm```</pre> |
    | Sui      | <pre>```@wormhole-foundation/sdk-sui```</pre>      |

    See the [Platforms folder of the TypeScript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms){target=\_blank} for an up-to-date list of the platforms supported by the Wormhole TypeScript SDK.

### Chain Context

`ChainContext` (from the `@wormhole-foundation/sdk-definitions` package) provides a unified interface for interacting with connected chains. It:

- Holds network, chain, and platform configurations
- Caches RPC and protocol clients
- Exposes both platform-inherited and chain-specific methods
- Defines the core types used across the SDK: `Network`, `Chain`, and `Platform`

```ts
// Get the chain context for the source and destination chains
// This is useful to grab direct clients for the protocols
--8<-- 'code/tools/typescript-sdk/sdk-reference/get-chain.ts'
```

### Addresses

The SDK uses the `UniversalAddress` class to implement the `Address` interface, standardizing address handling across chains. All addresses are parsed into a 32-byte format. Each platform also defines a `NativeAddress` type that understands its native format. These abstractions ensure consistent cross-chain address handling.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/addresses.ts'
```

### Tokens

The `TokenId` type identifies any token by its chain and address. For standardized tokens, Wormhole uses the token's contract address. For native currencies (e.g., ETH on Ethereum), it uses the keyword `native`. This ensures consistent handling of all tokens.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/tokens.ts'
```

### Signers

The SDK's `Signer` interface can be implemented as either a `SignOnlySigner` or a `SignAndSendSigner`, created by wrapping an offline or web wallet:

- **`SignOnlySigner`**: Signs and serializes unsigned transactions without broadcasting them. Transactions can be inspected or modified before signing. Serialization is chain-specific. See testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank}, [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for implementation examples.
- **`SignAndSendSigner`**: Signs and broadcasts transactions, returning their transaction IDs in order.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/signers.ts'
```

#### Set Up a Signer with Ethers.js

To sign transactions programmatically with the Wormhole SDK, you can use [Ethers.js](https://docs.ethers.org/v6/){target=\_blank} to manage private keys and handle signing. Here's an example of setting up a signer using Ethers.js:

```javascript
--8<-- 'code/tools/typescript-sdk/sdk-reference/ethers.js'
```

These components work together to create, sign, and submit a transaction to the blockchain:

- **`provider`**: Connects to the Ethereum or EVM-compatible network, enabling data access and transaction submission.
- **`signer`** : Represents the account that signs transactions using a private key.
- **`Wallet`**: Combines provider and signer to create, sign, and send transactions programmatically.

### Protocols

Wormhole is a Generic Message Passing (GMP) protocol with several specialized protocols built on top. Each protocol has platform-specific implementations providing methods to generate transactions or read on-chain state.

??? interface "Supported protocol modules"

    | Protocol              | Installation Command                                           |
    |-----------------------|----------------------------------------------------------------|
    | EVM Core              | <pre>```@wormhole-foundation/sdk-evm-core```</pre>             |
    | EVM Token Bridge      | <pre>```@wormhole-foundation/sdk-evm-tokenbridge```</pre>      |
    | EVM CCTP              | <pre>```@wormhole-foundation/sdk-evm-cctp```</pre>             |
    | EVM Portico           | <pre>```@wormhole-foundation/sdk-evm-portico```</pre>          |
    | EVM TBTC              | <pre>```@wormhole-foundation/sdk-evm-tbtc```</pre>             |
    | Solana Core           | <pre>```@wormhole-foundation/sdk-solana-core```</pre>          |
    | Solana Token Bridge   | <pre>```@wormhole-foundation/sdk-solana-tokenbridge```</pre>   |
    | Solana CCTP           | <pre>```@wormhole-foundation/sdk-solana-cctp```</pre>          |
    | Solana TBTC           | <pre>```@wormhole-foundation/sdk-solana-tbtc```</pre>          |
    | Algorand Core         | <pre>```@wormhole-foundation/sdk-algorand-core```</pre>        |
    | Algorand Token Bridge | <pre>```@wormhole-foundation/sdk-algorand-tokenbridge```</pre> |
    | Aptos Core            | <pre>```@wormhole-foundation/sdk-aptos-core```</pre>           |
    | Aptos Token Bridge    | <pre>```@wormhole-foundation/sdk-aptos-tokenbridge```</pre>    |
    | Aptos CCTP            | <pre>```@wormhole-foundation/sdk-aptos-cctp```</pre>           |
    | Cosmos Core           | <pre>```@wormhole-foundation/sdk-cosmwasm-core```</pre>        |
    | Cosmos Token Bridge   | <pre>```@wormhole-foundation/sdk-cosmwasm-tokenbridge```</pre> |
    | Sui Core              | <pre>```@wormhole-foundation/sdk-sui-core```</pre>             |
    | Sui Token Bridge      | <pre>```@wormhole-foundation/sdk-sui-tokenbridge```</pre>      |
    | Sui CCTP              | <pre>```@wormhole-foundation/sdk-sui-cctp```</pre>             |


#### Wormhole Core

The core protocol powers all Wormhole activity by emitting messages containing the [emitter address](/docs/products/reference/glossary/#emitter){target=\_blank}, sequence number, and payload needed for bridging.

Example workflow on Solana Testnet:

1. Initialize a Wormhole instance for Solana.
2. Obtain a signer and its address.
3. Access the core messaging bridge for cross-chain messaging.
4. Prepare a message with:

    - Sender's address
    - Encoded payload (e.g., "lol")
    - Nonce (e.g., 0)
    - Consistency level (e.g., 0)

5. Generate, sign, and send the transaction to publish the message.
6. Extract the Wormhole message ID from transaction logs for tracking.
7. Wait (up to 60s) to receive the [Verified Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank} (in `Uint8Array` format) from the Wormhole network.
8. Prepare and send a verification transaction on the receiving chain using the sender's address and the VAA.

???+ example "Example workflow"
    ```ts
    --8<-- 'code/tools/typescript-sdk/sdk-reference/example-core-bridge.ts'
    ```

The payload contains the information necessary to perform whatever action is required based on the protocol that uses it.

#### Token Bridge

The most familiar protocol built on Wormhole is the Token Bridge. Each supported chain has a `TokenBridge` client that provides a consistent interface for transferring tokens and handling attestations. While `WormholeTransfer` abstractions are recommended, direct interaction with the protocol is also supported.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge-snippet.ts'
```

## Transfers

While using the [`ChainContext`](#chain-context) and [`Protocol`](#protocols) clients directly is possible, the SDK provides some helpful abstractions for transferring tokens.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers

Token transfers between chains are straightforward using Wormhole. Create a `Wormhole` instance and use it to initialize a `TokenTransfer` or `CircleTransfer` object.

The example below shows how to initiate and complete a `TokenTransfer`. After creating the transfer object and retrieving a quote (to verify sufficient amount and fees), the process involves:

1. Initiating the transfer on the source chain.
2. Waiting for attestation (if required).
3. Completing the transfer on the destination chain.

For automatic transfers, the process ends after initiation. Manual transfers require attestation before completion.

```ts
--8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge.ts:120:158'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/tools/typescript-sdk/sdk-reference/token-bridge.ts'
    ```

Internally, this uses the [`TokenBridge`](#token-bridge) protocol client to transfer tokens.

### Native USDC Transfers

You can transfer native USDC using [Circle's CCTP](https://www.circle.com/cross-chain-transfer-protocol){target=\_blank}. If the transfer is set to `automatic`, the quote will include a relay fee, which is deducted from the total amount sent. For example, to receive 1.0 USDC on the destination chain, the sender must cover both the 1.0 and the relay fee. The same applies when including a native gas drop-off.

In the example below, the `wh.circleTransfer` function is used to initiate the transfer. It accepts the amount (in base units), sender and receiver chains and addresses, and an optional automatic flag to enable hands-free completion. You can also include an optional payload (set to `undefined` here) and specify a native gas drop-off if desired.

When waiting for the VAA, a timeout of `60,000` milliseconds is used. The actual wait time [varies by network](https://developers.circle.com/stablecoins/required-block-confirmations#mainnet){target=\_blank}.

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

Choosing the best route is up to the developer and may involve sorting by output amount or estimated completion time (though no estimate is currently provided).

Once a route is selected, parameters like `amount`, `nativeGasDropoff`, and `slippage` can be set. After validation, a transfer quote is requested, including fees, estimated time, and final amount. If successful, the quote is shown to the user for review before proceeding, ensuring all details are verified prior to transfer.

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
