---
title: Wormhole TS SDK 
description: Explore Wormhole's Typescript SDK and learn about how to perform different types of transfers, including Native, Token, USDC, and Gateway Transfers.
---

# Wormhole TS SDK {: #wormhole-ts-sdk}

The Wormhole Typescript SDK is useful for interacting with the chains Wormhole supports and the [protocols](#protocols) built on top of Wormhole.

!!! warning
    This package is a work in progress, so the interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues){target=\_blank} any issues you find.

## Installation {: #installation}

### Basic {: #basic}

Install the (meta) package:

```bash
npm install @wormhole-foundation/sdk
```

This package combines all the individual packages to make setup easier while allowing for tree shaking.  

### Advanced {: #advanced}

Alternatively, you can install a specific set of published packages:

- `sdk-base` - exposes constants
```sh
npm install @wormhole-foundation/sdk-base
```

- `sdk-definitions` - exposes contract interfaces, basic types, and VAA payload definitions
```sh
npm install @wormhole-foundation/sdk-definitions
```

- `sdk-evm` - exposes EVM-specific utilities
```sh
npm install @wormhole-foundation/sdk-evm
```

- `sdk-evm-tokenbridge` - exposes the EVM Token Bridge protocol client
```sh
npm install @wormhole-foundation/sdk-evm-tokenbridge
```

## Usage {: #usage}

Getting started is simple; just import Wormhole:

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts::1'
```

Then, import each of the ecosystem [platforms](#platforms) that you wish to support:

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts:4:9'
```


To make the [platform](#platforms) modules available for use, pass them to the Wormhole constructor:

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts:13:20'
```

With a configured Wormhole object, you can do things like parse addresses for the provided platforms, get a [`ChainContext`](#chain-context) object, or fetch VAAs.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts:22:22'
```

You can retrieve a VAA as follows. In this example, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will vary by network. 

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts:54:61'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/get-vaa.ts'
    ```

Optionally, you can override the default configuration with a partial `WormholeConfig` object to specify particular fields, such as a different RPC endpoint.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/config-override.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/config.ts'
    ```

## Concepts {: #concepts}

Understanding several higher-level concepts of the SDK will help you use it effectively. The following sections will introduce and discuss the concepts of platforms, chain contexts, addresses, tokens, signers, and protocols.

### Platforms {: #platforms}

Every chain is unique, but many share similar functionality. The `Platform` modules provide a consistent interface for interacting with the chains that share a platform.

Each platform can be installed separately so that dependencies can stay as slim as possible.

Wormhole currently supports the following platforms:

- EVM
- Solana
- Cosmwasm
- Sui
- Aptos

See the [Platforms folder of the Typescript SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/platforms){target=\_blank} for an up-to-date list of the platforms supported by the Wormhole Typescript SDK. 

### Chain Context {: #chain-context}

The `Wormhole` class provides a `getChain` method that returns a `ChainContext` object for a given chain. This object provides access to the chain specific methods and utilities. Much of the functionality in the `ChainContext` is provided by the `Platform` methods but the specific chain may have overridden methods.

The `ChainContext` object is also responsible for holding a cached RPC client and protocol clients.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/get-chain.ts'
```

### Addresses {: #addresses}

Within the Wormhole context, addresses are often [normalized](https://docs.wormhole.com/wormhole/blockchain-environments/evm#addresses){target=\_blank} to 32 bytes and referred to in this SDK as a `UniversalAddress`.

Each platform has an address type that understands the native address formats, referred to as `NativeAddress.` This abstraction allows the SDK to work with addresses consistently regardless of the underlying chain.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/addresses.ts'
```

### Tokens {: #tokens} 

Similar to the `ChainAddress` type, the `TokenId` type provides the chain and address of a given token. The following snippet introduces `TokenId`, a way to uniquely identify any token, whether it's a standard token or a blockchain's native currency (like ETH for Ethereum).

For standard tokens, Wormhole uses their contract address to create a `TokenId`. For native currencies, Wormhole uses the keyword `native` instead of an address. This makes it easy to work with any type of token consistently.

Finally, the snippet also demonstrates how to convert a `TokenId` back into a regular address format when needed.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/tokens.ts'
```

### Signers {: #signers}

In the SDK, a `Signer` interface is required for certain methods to sign transactions. This interface can be fulfilled by either a `SignOnlySigner` or a `SignAndSendSigner`, depending on the specific requirements. A signer can be created by wrapping an existing offline wallet or a web wallet.

A `SignOnlySigner` is used in scenarios where the signer is not connected to the network or prefers not to broadcast transactions themselves. It accepts an array of unsigned transactions and returns an array of signed and serialized transactions. Before signing, the transactions may be inspected or altered. It's important to note that the serialization process is chain-specific; refer to the testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank} or [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for an example of how to implement a signer for a specific chain or platform.

Conversely, a `SignAndSendSigner` is appropriate when the signer is connected to the network and intends to broadcast the transactions. This type of signer also accepts an array of unsigned transactions but returns an array of transaction IDs, corresponding to the order of the unsigned transactions.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/signers.ts'
```

### Protocols {: #protocols}

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality. If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

#### Wormhole Core {: #wormhole-core}

The core protocol underlies all Wormhole activity. This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [emitter address](https://docs.wormhole.com/wormhole/reference/glossary#emitter){target=\_blank}, the [sequence number](https://docs.wormhole.com/wormhole/reference/glossary#sequence){target=\_blank} for the message, and the payload of the message itself.

The following example demonstrates sending and verifying a message using the Wormhole Core protocol on Solana. 

First, we initialize a Wormhole instance for the Testnet environment, specifically for the Solana chain. We then obtain a signer and its associated address, which will be used to sign transactions.
Next, we get a reference to the core messaging bridge, which is the main interface for interacting with Wormhole's cross-chain messaging capabilities.
The code then prepares a message for publication. This message includes:

- The sender's address
- The message payload (in this case, the encoded string "lol")
- A nonce (set to `0` here, but can be any user-defined value to uniquely identify the message)
- A consistency level (set to `0`, which determines the finality requirements for the message)

After preparing the message, the next steps are to generate, sign, and send the transaction(s) required to publish the message on the Solana blockchain. Once the transaction is confirmed, the Wormhole message ID is extracted from the transaction logs. This ID is crucial for tracking the message across chains.

The code then waits for the Wormhole network to process and sign the message, turning it into a Verified Action Approval (VAA). This VAA is retrieved in a `Uint8Array` format, with a timeout of 60 seconds.

Lastly, the code will demonstrate how to verify the message on the receiving end. A verification transaction is prepared using the original sender's address and the VAA, and finally this transaction is signed and sent.

???+ code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/example-core-bridge.ts'
    ```

The payload contains the information necessary to perform whatever action is required based on the protocol that uses it. 

#### Token Bridge {: #token-bridge}

The most familiar protocol built on Wormhole is the Token Bridge. Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge. This includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations. `WormholeTransfer` abstractions are the recommended way to interact with these protocols but it is possible to use them directly.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.

## Transfers {: #transfers}

While using the [`ChainContext`](#chain-context) and [`Protocol`](#protocols) clients directly is possible, the SDK provides some helpful abstractions for doing things like transferring tokens.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers {: #token-transfers}

Performing a token transfer is trivial for any source and destination chains. You can create a new `Wormhole` object to make objects like `TokenTransfer`, `CircleTransfer`, and `GatewayTransfer`, to transfer tokens between chains. 

The following example demonstrates the process of initiating and completing a token transfer. It starts by creating a `TokenTransfer` object, which tracks the transfer's state throughout its lifecycle. The code then obtains a quote for the transfer, ensuring the amount is sufficient to cover fees and any requested native gas.

The transfer process is divided into three main steps: 

1. Initiating the transfer on the source chain
2. Waiting for the transfer to be attested (if not automatic)
3. Completing the transfer on the destination chain 

For automatic transfers, the process ends after initiation. For manual transfers, the code waits for the transfer to be attested and then completes it on the destination chain.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/token-bridge.ts:120:158'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/build/build-apps/wormhole-sdk/token-bridge.ts'
    ```

Internally, this uses the [TokenBridge](#token-bridge) protocol client to transfer tokens. Like other Protocols, the `TokenBridge` protocol provides a consistent set of methods across all chains to generate a set of transactions for that specific chain.

### Native USDC Transfers {: #native-usdc-transfers}

You can also transfer native USDC using [Circle's CCTP](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank}. Please note that if the transfer is set to `Automatic` mode, a fee for performing the relay will be included in the quote. This fee is deducted from the total amount requested to be sent. For example, if the user wishes to receive `1.0` on the destination, the amount sent should be adjusted to `1.0` plus the relay fee. The same principle applies to native gas dropoffs.

In the following example, the `wh.circleTransfer` function is called with several parameters to set up the transfer. It takes the amount to be transferred (in the token's base units), the sender's chain and address, and the receiver's chain and address. The function also allows specifying whether the transfer should be automatic, meaning it will be completed without further user intervention.

An optional payload can be included with the transfer, though in this case it's set to undefined. Finally, if the transfer is automatic, you can request that native gas (the blockchain's native currency used for transaction fees) be sent to the receiver along with the transferred tokens. 

When waiting for the `VAA`, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will [vary by network](https://developers.circle.com/stablecoin/docs/cctp-technical-reference#mainnet){target=\_blank}. 

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/cctp.ts:69:112'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/cctp.ts'
    ```

### Gateway Transfers {: #gateway-transfers}

Gateway transfers are passed through the Wormhole Gateway to or from Cosmos chains. A transfer into Cosmos from outside Cosmos will be automatically delivered to the destination via IBC from the Gateway chain (fka Wormchain). A transfer within Cosmos will use IBC to transfer from the origin to the Gateway chain, then out from the Gateway to the destination chain.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/cosmos.ts:152:172'
```

A transfer leaving Cosmos will produce a VAA from the Gateway that must be manually redeemed on the destination chain.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/cosmos.ts:184:207'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/cosmos.ts'
    ```

### Recovering Transfers {: #recovering-transfers}

It may be necessary to recover an abandoned transfer before being completed. To do this, instantiate the `Transfer` class with the `from` static method and pass one of several types of identifiers. A `TransactionId` or `WormholeMessageId` may be used to recover the transfer.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/cctp.ts:120:126'
```

??? code "View the complete script"
    ```ts hl_lines="130"
    --8<-- 'code/build/build-apps/wormhole-sdk/cctp.ts'
    ```

## Routes {: #routes}

While a specific `WormholeTransfer` may be used (`TokenTransfer`, `CCTPTransfer`, etc.), the developer must know exactly which transfer type to use for a given request. 

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

The following section demonstrates the process of setting up and validating a token transfer using Wormhole's routing system.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/router.ts:24:31'
```

Once created, the resolver can be used to provide a list of input and possible output tokens.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/router.ts:33:53'
```

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfill the request. Creating a transfer request fetches the token details since all routes will need to know about the tokens.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/router.ts:55:67'
```

Choosing the best route is currently left to the developer, but strategies might include sorting by output amount or expected time to complete the transfer (no estimate is currently provided).

After choosing the best route, extra parameters like `amount`, `nativeGasDropoff`, and `slippage` can be passed, depending on the specific route selected and a quote can be retrieved with the validated request. 

After successful validation, the code requests a transfer quote. This quote likely includes important details such as fees, estimated time, and the final amount to be received. If the quote is generated successfully, it's displayed for the user to review and decide whether to proceed with the transfer. This process ensures that all transfer details are properly set up and verified before any actual transfer takes place.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/router.ts:72:93'
```

Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`.

```ts
--8<-- 'code/build/build-apps/wormhole-sdk/router.ts:100:106'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-apps/wormhole-sdk/router.ts'
    ```

See the `router.ts` example in the [examples directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/examples){target=\_blank} for a full working example.

## See Also {: #see-also}

The tsdoc is available [on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}.