---
title: Wormhole TS SDK 
description: Explore Wormhole's Typescript SDK and learn about how to perform different types of transfers, including Native, Token, USDC, and Gateway Transfers.
---

# Wormhole TS SDK

The Wormhole Typescript SDK is useful for interacting with the chains Wormhole supports and the [protocols](#protocols) built on top of Wormhole.

## Warning 

:warning: This package is a Work in Progress, so the interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues) any issues you find. :warning:

## Installation

### Basic 

Install the (meta) package

```bash
npm install @wormhole-foundation/sdk
```

This package combines all the individual packages to make setup easier while allowing for tree shaking.  

### Advanced

Alternatively, for an advanced user, install a specific set of published packages.

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

## Usage

Getting started is simple; just import Wormhole and the [Platform](#platforms) modules you wish to support

```ts
import { wormhole } from '@wormhole-foundation/sdk';
```

??? code "View the complete script"
    ```ts hl_lines="2"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa.ts'
    ```

And pass those to the Wormhole constructor to make them available for use

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/wormhole-init.ts'
```

??? code "View the complete script"
    ```ts hl_lines="16"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa.ts'
    ```

With a configured Wormhole object, we can do things like parse addresses for the platforms we passed, get a [ChainContext](#chain-context) object, or fetch VAAs.

<!--EXAMPLE_WORMHOLE_CHAIN-->
```ts
// Grab a ChainContext object from our configured Wormhole instance
const ctx = wh.getChain('Solana');
```

??? code "View the complete script"
    ```ts hl_lines="21"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa.ts'
    ```

You can retrieve a VAA as follows:

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa-snippet.ts'
```

??? code "View the complete script"
    ```ts hl_lines="68-74"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-vaa.ts'
    ```

Optionally, the default configuration may be overridden if you want to support a different RPC endpoint.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/config-override.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/config.ts'
    ```

## Concepts

Understanding several higher-level concepts of the SDK will help you use it effectively.

### Platforms

Every chain is its own special snowflake, but many share similar functionality. The `Platform` modules provide a consistent interface for interacting with the chains that share a platform.

Each platform can be installed separately so that dependencies can stay as slim as possible.

### Chain Context

The `Wormhole` class provides a `getChain` method that returns a `ChainContext` object for a given chain. This object provides access to the chain specific methods and utilities. Much of the functionality in the `ChainContext` is provided by the `Platform` methods but the specific chain may have overridden methods.

The ChainContext object is also responsible for holding a cached rpc client and protocol clients.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/get-chain.ts'
```

### Addresses

Within the Wormhole context, addresses are often [normalized](https://docs.wormhole.com/wormhole/blockchain-environments/evm#addresses) to 32 bytes and referred to in this SDK as a `UniversalAddresses`.

Each platform has an address type that understands the native address formats, unsurprisingly referred to as NativeAddress. This abstraction allows the SDK to work with addresses consistently regardless of the underlying chain.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/addresses.ts'
```

### Tokens 

Similar to the `ChainAddress` type, the `TokenId` type provides the Chain and Address of a given Token.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/tokens.ts'
```

### Signers

An object that fulfils the `Signer` interface is required to sign transactions. This simple interface can be implemented by wrapping a web wallet or other signing mechanism.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/signers.ts'
```

See the testing signers ([Evm](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts), [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts), ...) for an example of how to implement a signer for a specific chain or platform.

### Protocols

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality.

If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

#### Wormhole Core

The core protocol underlies all Wormhole activity. This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [Emitter address](https://docs.wormhole.com/wormhole/reference/glossary#emitter), the [Sequence number](https://docs.wormhole.com/wormhole/reference/glossary#sequence) for the message, and the Payload of the message itself.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/core-bridge.ts'
```

??? code "View the complete script"
    ```ts
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-core-bridge.ts'
    ```

The information necessary to perform whatever action is required based on the Protocol that uses it is within the payload.

#### Token Bridge

The most familiar protocol built on Wormhole is the Token Bridge.

Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge. This includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations.

`WormholeTransfer` abstractions are the recommended way to interact with these protocols but it is possible to use them directly.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols).

## Transfers

While using the [ChainContext](#chain-context) and [Protocol](#protocols) clients directly is possible, to do things like transfer tokens, the SDK provides some helpful abstractions.

The `WormholeTransfer` interface provides a convenient abstraction to encapsulate the steps involved in a cross-chain transfer.

### Token Transfers

Performing a Token Transfer is trivial for any source and destination chains.

We can create a new `Wormhole` object to make `TokenTransfer,` `CircleTransfer,` `GatewayTransfer,` etc., objects to transfer tokens between chains. The transfer object is responsible for tracking the transfer through the process and providing updates on its status.

```ts
--8<-- 'code/build/build-multichain-applications/wormhole-sdk/example-token-transfer.ts'
```

See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/tokenBridge.ts#L122)


??? code "View the complete script"
    ```ts hl_lines="122"
    --8<-- 'code/build/build-multichain-applications/wormhole-sdk/token-bridge.ts'
    ```


Internally, this uses the [TokenBridge](#token-bridge) protocol client to transfer tokens. Like other Protocols, the `TokenBridge` protocol provides a consistent set of methods across all chains to generate a set of transactions for that specific chain.

### Native USDC Transfers

We can also transfer native USDC using [Circle's CCTP](https://www.circle.com/en/cross-chain-transfer-protocol)

<!--EXAMPLE_CCTP_TRANSFER-->
```ts
 const xfer = await wh.circleTransfer(
  // amount as bigint (base units)
  req.amount,
  // sender chain/address
  src.address,
  // receiver chain/address
  dst.address,
  // automatic delivery boolean
  req.automatic,
  // payload to be sent with the transfer
  undefined,
  // If automatic, native gas can be requested to be sent to the receiver
  req.nativeGas
);

// Note, if the transfer is requested to be Automatic, a fee for performing the relay
// will be present in the quote. The fee comes out of the amount requested to be sent.
// If the user wants to receive 1.0 on the destination, the amount to send should be 1.0 + fee.
// The same applies for native gas dropoff
const quote = await CircleTransfer.quoteTransfer(
  src.chain,
  dst.chain,
  xfer.transfer
);
console.log('Quote', quote);

console.log('Starting Transfer');
const srcTxids = await xfer.initiateTransfer(src.signer);
console.log(`Started Transfer: `, srcTxids);

if (req.automatic) {
  const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
  console.log(`Finished relay: `, relayStatus);
  return;
}

// Note: Depending on chain finality, this timeout may need to be increased.
// See https://developers.circle.com/stablecoin/docs/cctp-technical-reference#mainnet for more
console.log('Waiting for Attestation');
const attestIds = await xfer.fetchAttestation(60_000);
console.log(`Got Attestation: `, attestIds);

console.log('Completing Transfer');
const dstTxids = await xfer.completeTransfer(dst.signer);
console.log(`Completed Transfer: `, dstTxids);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/cctp.ts#L80)
<!--EXAMPLE_CCTP_TRANSFER-->

### Gateway Transfers

Gateway transfers are passed through the Wormhole Gateway to or from Cosmos chains.

A transfer into Cosmos from outside cosmos will be automatically delivered to the destination via IBC from the Gateway chain (fka Wormchain)
<!--EXAMPLE_GATEWAY_INBOUND-->
```ts
console.log(
  `Beginning transfer into Cosmos from ${
    src.chain.chain
  }:${src.address.address.toString()} to ${
    dst.chain.chain
  }:${dst.address.address.toString()}`
);

const xfer = await GatewayTransfer.from(wh, {
  token: token,
  amount: amount,
  from: src.address,
  to: dst.address,
} as GatewayTransferDetails);
console.log('Created GatewayTransfer: ', xfer.transfer);

const srcTxIds = await xfer.initiateTransfer(src.signer);
console.log('Started transfer on source chain', srcTxIds);

const attests = await xfer.fetchAttestation(600_000);
console.log('Got Attestations', attests);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/cosmos.ts#L120)
<!--EXAMPLE_GATEWAY_INBOUND-->

A transfer within Cosmos will use IBC to transfer from the origin to the Gateway chain, then out from the Gateway to the destination chain
<!--EXAMPLE_GATEWAY_INTERCOSMOS-->
```ts
console.log(
  `Beginning transfer within cosmos from ${
    src.chain.chain
  }:${src.address.address.toString()} to ${
    dst.chain.chain
  }:${dst.address.address.toString()}`
);

const xfer = await GatewayTransfer.from(wh, {
  token: token,
  amount: amount,
  from: src.address,
  to: dst.address,
} as GatewayTransferDetails);
console.log('Created GatewayTransfer: ', xfer.transfer);

const srcTxIds = await xfer.initiateTransfer(src.signer);
console.log('Started transfer on source chain', srcTxIds);

const attests = await xfer.fetchAttestation(60_000);
console.log('Got attests: ', attests);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/cosmos.ts#L152)
<!--EXAMPLE_GATEWAY_INTERCOSMOS-->

A transfer leaving Cosmos will produce a VAA from the Gateway that must be manually redeemed on the destination chain 
<!--EXAMPLE_GATEWAY_OUTBOUND-->
```ts
console.log(
  `Beginning transfer out of cosmos from ${
    src.chain.chain
  }:${src.address.address.toString()} to ${
    dst.chain.chain
  }:${dst.address.address.toString()}`
);

const xfer = await GatewayTransfer.from(wh, {
  token: token,
  amount: amount,
  from: src.address,
  to: dst.address,
} as GatewayTransferDetails);
console.log('Created GatewayTransfer: ', xfer.transfer);
const srcTxIds = await xfer.initiateTransfer(src.signer);
console.log('Started transfer on source chain', srcTxIds);

const attests = await xfer.fetchAttestation(600_000);
console.log('Got attests', attests);

// Since we're leaving cosmos, this is required to complete the transfer
const dstTxIds = await xfer.completeTransfer(dst.signer);
console.log('Completed transfer on destination chain', dstTxIds);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/cosmos.ts#L184)
<!--EXAMPLE_GATEWAY_OUTBOUND-->

### Recovering Transfers

It may be necessary to recover an abandoned transfer before being completed. To do this, instantiate the Transfer class with the `from` static method and pass one of several types of identifiers.

A `TransactionId` or `WormholeMessageId` may be used to recover the transfer

<!--EXAMPLE_RECOVER_TRANSFER-->
```ts
  // Rebuild the transfer from the source txid
  const xfer = await CircleTransfer.from(wh, txid);

  const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
  console.log("Got attestation: ", attestIds);

  const dstTxIds = await xfer.completeTransfer(signer);
  console.log("Completed transfer: ", dstTxIds);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/cctp.ts#L130)
<!--EXAMPLE_RECOVER_TRANSFER-->

## Routes

While a specific `WormholeTransfer` may be used (TokenTransfer, CCTPTransfer, etc.), the developer must know exactly which transfer type to use for a given request. 

To provide a more flexible and generic interface, the `Wormhole` class provides a method to produce a `RouteResolver` that can be configured with a set of possible routes to be supported.

<!--EXAMPLE_RESOLVER_CREATE-->
```ts
// create new resolver, passing the set of routes to consider
const resolver = wh.resolver([
  routes.TokenBridgeRoute, // manual token bridge
  routes.AutomaticTokenBridgeRoute, // automatic token bridge
  routes.CCTPRoute, // manual CCTP
  routes.AutomaticCCTPRoute, // automatic CCTP
  routes.AutomaticPorticoRoute, // Native eth transfers
]);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/router.ts#L30)
<!--EXAMPLE_RESOLVER_CREATE-->

Once created, the resolver can be used to provide a list of input and possible output tokens.

<!--EXAMPLE_RESOLVER_LIST_TOKENS-->
```ts
// what tokens are available on the source chain?
const srcTokens = await resolver.supportedSourceTokens(sendChain);
console.log(
  'Allowed source tokens: ',
  srcTokens.map((t) => canonicalAddress(t))
);

// Grab the first one for the example
// const sendToken = srcTokens[0]!;
const sendToken = Wormhole.tokenId(sendChain.chain, 'native');

// given the send token, what can we possibly get on the destination chain?
const destTokens = await resolver.supportedDestinationTokens(
  sendToken,
  sendChain,
  destChain
);
console.log(
  'For the given source token and routes configured, the following tokens may be receivable: ',
  destTokens.map((t) => canonicalAddress(t))
);
//grab the first one for the example
const destinationToken = destTokens[0]!;
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/router.ts#L41)
<!--EXAMPLE_RESOLVER_LIST_TOKENS-->

Once the tokens are selected, a `RouteTransferRequest` may be created to provide a list of routes that can fulfil the request

<!--EXAMPLE_REQUEST_CREATE-->
```ts
// creating a transfer request fetches token details
// since all routes will need to know about the tokens
const tr = await routes.RouteTransferRequest.create(wh, {
  from: sender.address,
  to: receiver.address,
  source: sendToken,
  destination: destinationToken,
});

// resolve the transfer request to a set of routes that can perform it
const foundRoutes = await resolver.findRoutes(tr);
console.log(
  'For the transfer parameters, we found these routes: ',
  foundRoutes
);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/router.ts#L63)
<!--EXAMPLE_REQUEST_CREATE-->

Choosing the best route is currently left to the developer but strategies might include sorting by output amount or expected time to complete the transfer (no estimate currently provided).

After choosing the best route, extra parameters like `amount`, `nativeGasDropoff`, and `slippage` can be passed, depending on the specific route selected and a quote can be retrieved with the validated request.

<!--EXAMPLE_REQUEST_VALIDATE-->
```ts
console.log(
  'This route offers the following default options',
  bestRoute.getDefaultOptions()
);
// Specify the amount as a decimal string
const amt = '0.001';
// Create the transfer params for this request
const transferParams = { amount: amt, options: { nativeGas: 0 } };

// validate the transfer params passed, this returns a new type of ValidatedTransferParams
// which (believe it or not) is a validated version of the input params
// this new var must be passed to the next step, quote
const validated = await bestRoute.validate(transferParams);
if (!validated.valid) throw validated.error;
console.log('Validated parameters: ', validated.params);

// get a quote for the transfer, this too returns a new type that must
// be passed to the next step, execute (if you like the quote)
const quote = await bestRoute.quote(validated.params);
if (!quote.success) throw quote.error;
console.log('Best route quote: ', quote);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/router.ts#L83)
<!--EXAMPLE_REQUEST_VALIDATE-->


Finally, assuming the quote looks good, the route can initiate the request with the quote and the `signer`

<!--EXAMPLE_REQUEST_INITIATE-->
```ts
// Now the transfer may be initiated
// A receipt will be returned, guess what you gotta do with that?
const receipt = await bestRoute.initiate(sender.signer, quote);
console.log('Initiated transfer with receipt: ', receipt);
```
See example [here](https://github.com/wormhole-foundation/wormhole-sdk-ts/blob/main/examples/src/router.ts#L107)
<!--EXAMPLE_REQUEST_INITIATE-->

Note: See the `router.ts` example in the examples directory for a full working example

## See also

The tsdoc is available [here](https://wormhole-foundation.github.io/wormhole-sdk-ts/)