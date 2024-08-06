---
title: Wormhole TS SDK 
description: Explore Wormhole's Typescript SDK and learn about how to perform different types of transfers, including Native, Token, USDC, and Gateway Transfers.
---

# Wormhole TS SDK {: #wormhole-ts-sdk}

The Wormhole Typescript SDK is useful for interacting with the chains Wormhole supports and the [protocols](#protocols) built on top of Wormhole.

!!! warning
    This package is a Work in Progress, so the interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues){target=\_blank} any issues you find.

## Installation {: #installation}

### Basic {: #basic}

Install the (meta) package:

```bash
npm install @wormhole-foundation/sdk
```

This package combines all the individual packages to make setup easier while allowing for tree shaking.  

### Advanced {: #advanced}

Alternatively, you can install a specific set of published packages:

```bash
# constants
npm install @wormhole-foundation/sdk-base

# contract interfaces, basic types, vaa payload definitions
npm install @wormhole-foundation/sdk-definitions

# Evm specific utilities
npm install @wormhole-foundation/sdk-evm

# Evm TokenBridge protocol client
npm install @wormhole-foundation/sdk-evm-tokenbridge
```

## Usage {: #usage}

Getting started is simple; just import Wormhole and the [Platform](#platforms) modules you wish to support:

```ts
import { wormhole } from '@wormhole-foundation/sdk';
```

Then, pass the [Platform](#platforms) modules to the Wormhole constructor to make them available for use:

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/wormhole-init.ts'
```

With a configured Wormhole object, we can do things like parse addresses for the platforms we passed, get a [ChainContext](#chain-context) object, or fetch VAAs.

```ts
// Grab a ChainContext object from our configured Wormhole instance
const ctx = wh.getChain('Solana');
```

You can retrieve a VAA as follows:

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa-snippet.ts'
```

??? code "View the complete script"
    ```ts hl_lines="68-74"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa.ts'
    ```


Optionally, you can override the default configuration with a partial `WormholeConfig` object to specify particular fields, such as a different RPC endpoint.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/config-override.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/config.ts'
    ```

## Concepts {: #concepts}

Understanding several higher-level concepts of the SDK will help you use it effectively. The following sections will introduce and discuss the concepts of platforms, chain contexts, addresses, tokens, signers, and protocols.

### Platforms {: #platforms}

Every chain is unique, but many share similar functionality. The `Platform` modules provide a consistent interface for interacting with the chains that share a platform.

Each platform can be installed separately so that dependencies can stay as slim as possible.

### Chain Context {: #chain-context}

The `Wormhole` class provides a `getChain` method that returns a `ChainContext` object for a given chain. This object provides access to the chain specific methods and utilities. Much of the functionality in the `ChainContext` is provided by the `Platform` methods but the specific chain may have overridden methods.

The `ChainContext` object is also responsible for holding a cached RPC client and protocol clients.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-chain.ts'
```

### Addresses {: #addresses}

Within the Wormhole context, addresses are often [normalized](https://docs.wormhole.com/wormhole/blockchain-environments/evm#addresses){target=\_blank} to 32 bytes and referred to in this SDK as a `UniversalAddresses`.

Each platform has an address type that understands the native address formats, referred to as `NativeAddress.` This abstraction allows the SDK to work with addresses consistently regardless of the underlying chain.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/addresses.ts'
```

### Tokens {: #tokens} 

Similar to the `ChainAddress` type, the `TokenId` type provides the Chain and Address of a given token.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/tokens.ts'
```

### Signers {: #signers}

An object that fulfils the `Signer` interface is required to sign transactions. This simple interface can be implemented by wrapping a web wallet or other signing mechanism.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/signers.ts'
```

See the testing signers ([Evm](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank}, [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}, ...) for an example of how to implement a signer for a specific chain or platform.

### Protocols {: #protocols}

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality.

If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

#### Wormhole Core {: #wormhole-core}

The core protocol underlies all Wormhole activity. This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [Emitter address](https://docs.wormhole.com/wormhole/reference/glossary#emitter){target=\_blank}, the [Sequence number](https://docs.wormhole.com/wormhole/reference/glossary#sequence){target=\_blank} for the message, and the Payload of the message itself.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/core-bridge.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-core-bridge.ts'
    ```

The payload contains the information necessary to perform whatever action is required based on the Protocol that uses it. 

#### Token Bridge {: #token-bridge}

The most familiar protocol built on Wormhole is the Token Bridge.

Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge. This includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations.

`WormholeTransfer` abstractions are the recommended way to interact with these protocols but it is possible to use them directly.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.

## Transfers {: #transfers}

While using the [ChainContext](#chain-context) and [Protocol](#protocols) clients directly is possible, the SDK provides some helpful abstractions for doing things like transferring tokens.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers {: #token-transfers}

Performing a Token Transfer is trivial for any source and destination chains.

We can create a new `Wormhole` object to make objects like `TokenTransfer,` `CircleTransfer,` and `GatewayTransfer,` to transfer tokens between chains. The transfer object is responsible for tracking the transfer throughout the process and providing updates on its status.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-token-transfer.ts'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/token-bridge.ts'
    ```

Internally, this uses the [TokenBridge](#token-bridge) protocol client to transfer tokens. Like other Protocols, the `TokenBridge` protocol provides a consistent set of methods across all chains to generate a set of transactions for that specific chain.

### Native USDC Transfers {: #native-usdc-transfers}

We can also transfer native USDC using [Circle's CCTP](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank}. Please note that if the transfer is set to Automatic mode, a fee for performing the relay will be included in the quote. This fee is deducted from the total amount requested to be sent. For example, if the user wishes to receive `1.0` on the destination, the amount sent should be adjusted to `1.0` plus the relay fee. The same principle applies to native gas dropoffs

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/cctp-example-snippet.ts'
```

??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/cctp.ts'
    ```

### Gateway Transfers {: #gateway-transfers}

Gateway transfers are passed through the Wormhole Gateway to or from Cosmos chains.

A transfer into Cosmos from outside cosmos will be automatically delivered to the destination via IBC from the Gateway chain (fka Wormchain)

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/gateway-inbound-example.ts'
```

??? code "View the complete script"
    ```ts hl_lines="120"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/cosmos.ts'
    ```

A transfer within Cosmos will use IBC to transfer from the origin to the Gateway chain, then out from the Gateway to the destination chain

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/gateway-intercosmos-example.ts'
```

??? code "View the complete script"
    ```ts hl_lines="152"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/cosmos.ts'
    ```

A transfer leaving Cosmos will produce a VAA from the Gateway that must be manually redeemed on the destination chain.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/gateway-outbound-example.ts'
```

??? code "View the complete script"
    ```ts hl_lines="184"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/cosmos.ts'
    ```

### Recovering Transfers {: #recovering-transfers}

It may be necessary to recover an abandoned transfer before being completed. To do this, instantiate the Transfer class with the `from` static method and pass one of several types of identifiers.

A `TransactionId` or `WormholeMessageId` may be used to recover the transfer.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/recover-transfer-example.ts'
```

??? code "View the complete script"
    ```ts hl_lines="130"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/cctp.ts'
    ```

## Routes {: #routes}

While a specific `WormholeTransfer` may be used (TokenTransfer, CCTPTransfer, etc.), the developer must know exactly which transfer type to use for a given request. 

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/resolver-create-example.ts'
```

??? code "View the complete script"
    ```ts hl_lines="30"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/router.ts'
    ```

Once created, the resolver can be used to provide a list of input and possible output tokens.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-resolver-list-tokens.ts'
```

??? code "View the complete script"
    ```ts hl_lines="41"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/router.ts'
    ```

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfill the request.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-request-create.ts'
```

??? code "View the complete script"
    ```ts hl_lines="63"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/router.ts'
    ```

Choosing the best route is currently left to the developer, but strategies might include sorting by output amount or expected time to complete the transfer (no estimate is currently provided).

After choosing the best route, extra parameters like `amount`, `nativeGasDropoff`, and `slippage` can be passed, depending on the specific route selected and a quote can be retrieved with the validated request.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-request-validate.ts'
```

??? code "View the complete script"
    ```ts hl_lines="83"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/router.ts'
    ```

Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-request-initiate.ts'
```

??? code "View the complete script"
    ```ts hl_lines="107"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/router.ts'
    ```

Note: See the `router.ts` example in the [examples directory](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/main/examples){target=\_blank} for a full working example.

## See also {: #see-also}

The tsdoc is available [on Github](https://wormhole-foundation.github.io/wormhole-sdk-ts/){target=\_blank}.