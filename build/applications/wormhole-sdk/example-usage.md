---
title: Example SDK Usage 
description: Find sample code snippets demonstrating some of the powerful abstractions offered via the Wormhole TypeScript SDK
---

# Example SDK Usage

## Usage

Getting started is simple. First, import Wormhole:

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts::1'
```

Then, import each of the ecosystem [platforms](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/sdk/src/platforms/){target=/_blank} that you wish to support:

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts:4:9'
```


To make the platform modules available for use, pass them to the Wormhole constructor:

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts:13:20'
```

With a configured Wormhole object, you can do things like parse addresses for the provided platforms, get a `ChainContext` object, or fetch VAAs.

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts:22:22'
```

You can retrieve a VAA as follows. In this example, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will vary by network.

```ts
--8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts:54:61'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/get-vaa.ts'
    ```

Optionally, you can override the default configuration with a partial `WormholeConfig` object to specify particular fields, such as a different RPC endpoint.

```ts
--8<-- 'code/build/applications/wormhole-sdk/config-override.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/config.ts'
    ```

## Adresses

<!--TODO: copy for this example-->

```ts
--8<-- 'code/build/applications/wormhole-sdk/addresses.ts'
```

## Signers

```ts
--8<-- 'code/build/applications/wormhole-sdk/signers.ts'
```

## Tokens

The `TokenId` interface provides a unique identifier for a token on a given chain. This interface accepts the chain name and token contract address to generate this unique identifier. In the case of a blockchain's native currency (like ETH for Ethereum), you pass the keyword `native` in place of a token contract address

The following example demonstrates usage of `TokenId`, including syntax for both passing a token contract address and using the `native` keyword. Finally, the snippet also demonstrates how to convert a `TokenId` back into a regular address format when needed.

```ts
--8<-- 'code/build/applications/wormhole-sdk/tokens.ts'
```

You can find the directory of token constants used by the SDK in the [`tokens`](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants/tokens){target=/_blank} folder of the `base` subpackage.

## Transfers

While using the `ChainContext` and `Protocol` clients directly is possible, the SDK provides some helpful abstractions for doing things like transferring tokens.


The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers

Performing a token transfer is trivial for any source and destination chains. You can create a new `Wormhole` object to make objects like `TokenTransfer`, `CircleTransfer`, and `GatewayTransfer`, to transfer tokens between chains.

The following example demonstrates the process of initiating and completing a token transfer. It starts by creating a `TokenTransfer` object, which tracks the transfer's state throughout its lifecycle. The code then obtains a quote for the transfer, ensuring the amount is sufficient to cover fees and any requested native gas.

The transfer process is divided into three main steps:

1. Initiating the transfer on the source chain
2. Waiting for the transfer to be attested (if not automatic)
3. Completing the transfer on the destination chain

For automatic transfers, the process ends after initiation. For manual transfers, the code waits for the transfer to be attested and then completes it on the destination chain.

```ts
--8<-- 'code/build/applications/wormhole-sdk/token-bridge.ts:120:158'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/build/applications/wormhole-sdk/token-bridge.ts'
    ```

Internally, this uses the TokenBridge protocol client to transfer tokens. Like other Protocols, the `TokenBridge` protocol provides a consistent set of methods across all chains to generate a set of transactions for that specific chain.

### Native USDC Transfers

You can also transfer native USDC using [Circle's CCTP](https://www.circle.com/en/cross-chain-transfer-protocol/){target=\_blank}. Please note that if the transfer is set to `Automatic` mode, a fee for performing the relay will be included in the quote. This fee is deducted from the total amount requested to be sent. For example, if the user wishes to receive `1.0` on the destination, the amount sent should be adjusted to `1.0` plus the relay fee. The same principle applies to native gas drop offs.

In the following example, the `wh.circleTransfer` function is called with several parameters to set up the transfer. It takes the amount to be transferred (in the token's base units), the sender's chain and address, and the receiver's chain and address. The function also allows specifying whether the transfer should be automatic, meaning it will be completed without further user intervention.

An optional payload can be included with the transfer, though in this case it's set to undefined. Finally, if the transfer is automatic, you can request that native gas (the blockchain's native currency used for transaction fees) be sent to the receiver along with the transferred tokens.

When waiting for the `VAA`, a timeout of `60,000` milliseconds is used. The amount of time required for the VAA to become available will [vary by network](https://developers.circle.com/stablecoins/docs/required-block-confirmations#mainnet/){target=\_blank}.

```ts
--8<-- 'code/build/applications/wormhole-sdk/cctp.ts:69:112'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/cctp.ts'
    ```

### Gateway Transfers

Gateway transfers are passed through the Wormhole Gateway to or from Cosmos chains. A transfer into Cosmos from outside Cosmos will be automatically delivered to the destination via IBC from the Gateway chain. A transfer within Cosmos will use IBC to transfer from the origin to the Gateway chain, then out from the Gateway to the destination chain.

```ts
--8<-- 'code/build/applications/wormhole-sdk/cosmos.ts:152:172'
```

A transfer leaving Cosmos will produce a VAA from the Gateway that must be manually redeemed on the destination chain.

```ts
--8<-- 'code/build/applications/wormhole-sdk/cosmos.ts:184:207'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/cosmos.ts'
    ```

### Recovering Transfers

It may be necessary to recover an abandoned transfer before being completed. To do this, instantiate the `Transfer` class with the `from` static method and pass one of several types of identifiers. A `TransactionId` or `WormholeMessageId` may be used to recover the transfer.

```ts
--8<-- 'code/build/applications/wormhole-sdk/cctp.ts:120:126'
```

??? code "View the complete script"
    ```ts hl_lines="130"
    --8<-- 'code/build/applications/wormhole-sdk/cctp.ts'
    ```

## Routes

While a specific `WormholeTransfer`, such as `TokenTransfer` or `CCTPTransfer`, may be used the developer must know exactly which transfer type to use for a given request.

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

The following section demonstrates the process of setting up and validating a token transfer using Wormhole's routing system.

```ts
--8<-- 'code/build/applications/wormhole-sdk/router.ts:24:31'
```

Once created, the resolver can be used to provide a list of input and possible output tokens.

```ts
--8<-- 'code/build/applications/wormhole-sdk/router.ts:33:53'
```

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfill the request. Creating a transfer request fetches the token details since all routes will need to know about the tokens.

```ts
--8<-- 'code/build/applications/wormhole-sdk/router.ts:55:67'
```

Choosing the best route is currently left to the developer, but strategies might include sorting by output amount or expected time to complete the transfer (no estimate is currently provided).

After choosing the best route, extra parameters like `amount`, `nativeGasDropoff`, and `slippage` can be passed, depending on the specific route selected and a quote can be retrieved with the validated request.

After successful validation, the code requests a transfer quote. This quote likely includes important details such as fees, estimated time, and the final amount to be received. If the quote is generated successfully, it's displayed for the user to review and decide whether to proceed with the transfer. This process ensures that all transfer details are properly set up and verified before any actual transfer takes place.

```ts
--8<-- 'code/build/applications/wormhole-sdk/router.ts:72:93'
```

Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`.

```ts
--8<-- 'code/build/applications/wormhole-sdk/router.ts:100:106'
```

??? code "View the complete script"

    ```ts
    --8<-- 'code/build/applications/wormhole-sdk/router.ts'
    ```

See the `router.ts` example in the [examples directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/examples/){target=\_blank} for a full working example.

## Protocols

### Wormhole Core

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

### Token Bridge

```ts
--8<-- 'code/build/applications/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.

## See Also

The TSdoc is available [on GitHub](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}.