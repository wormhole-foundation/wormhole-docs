---
title: SDK Reference 
description: TODO
---

# Wormhole TS SDK Reference
<!--TODO: Reference (outline all of the classes, functions, etc. - this should include Platforms, Chain Context, etc.)-->

## Introduction

 Understanding several higher-level Wormhole concepts, and how the SDK abstracts them away, will help you use the tools most effectively. The following sections will introduce and discuss the concepts of platforms, chain contexts, addresses, signers, and protocols, how they are used in the Wormhole context, and how the SDK helps ease development in each conceptual area. Detailed information on the functions, constants, and definitions exposed in each area is also included. 

!!! warning
    This package is a work in progress, so the interface may change, and there are likely bugs. Please [report](https://github.com/wormhole-foundation/connect-sdk/issues/){target=\_blank} any issues you find.


## Platforms

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


## Chain Context

The `definitions` package of the SDK includes the `ChainContext` class which creates an interface for working with connected chains in a standardized way. This class contains the network, chain, and platform configurations for connected chains along with cached RPC and protocol clients. The `ChainContext` class also exposes chain-specific methods and utilities, which are outlined in the next section. Much of the `ChainContext` functionality comes from the `Platform` methods but some specific chains may have overridden methods via the context.

The `ChainContext` class includes the following type parameters and methods:

??? interface "Type parameters"

    **`N`** extends _Network_

    ---

    **`C`** extends _Chain = Chain_

    ---

    **`P`** extends _Platform = ChainToPlatform<C>_




??? interface "**`getRpc`** - Get an RPC connection for this chain, uses the configuration passed in the initial constructor"

    ??? child "Parameters"

        None - uses values passed in the constructor

    ??? child "Returns"

        ++"Promise<RpcConnection<P>>"++ - the RPC connection for this chain

??? interface "**`getDecimals`** - Get the number of decimals for a token"

    ??? child "Parameters"

        `token` ++"TokenAddress<C>"++ - the token to get the decimals for

    ??? child "Returns"

        ++"Promise<number>"++ - the number of decimals for the token

??? interface "**`getBalance`** - Get the balance of a token for a given address"

    ??? child "Parameters"

        `walletAddr` ++"string"++ - the address to get the balance for

        ---

        `token` ++"TokenAddress<C>"++ - the token to get the balance for

    ??? child "Returns"

        ++"Promise<bigint | null>"++ - the balance of the token for the address, or null if no balance is found

??? interface "**`getLatestBlock`** - Get the latest block number seen by the chain according to the RPC"

    ??? child "Parameters"

        None - uses the values passed in the constructor

    ??? child "Returns"

        ++"Promise<number>"++ - the latest block number

??? interface "**`getLatestFinalizedBlock`** - Get the latest _finalized_ block number seen by the chain according to the RPC"

    ??? child "Parameters"

        None - uses the values passed in the constructor

    ??? child "Returns"

        ++"Promise<number>"++ - the latest finalized block number

??? interface "**`parseTransaction`** - Parse the Wormhole Core messages from a transaction"

    ??? child "Parameters"

        `txid` ++"string"++ - the transaction to parse

    ??? child "Returns"

        ++"Promise<WormholeMessageId[]>"++ - the Wormhole Core messages emitted by the transaction

??? interface "**`sendWait`** - Send a transaction and wait for it to be confirmed"

    ??? child "Parameters"

        `stxns` ++"SignedTx[]"++ - an array of signed transactions to send

    ??? child "Returns"

        ++"Promise<string[]>"++ - the transaction hashes of the sent transactions

??? interface "**`getToken`** - Get the token data from the local cache if available"

    ??? child "Parameters"

        `symbol` ++"TokenSymbol"++ - the symbol of the token to get

    ??? child "Returns"

        ++"Token | undefined"++ - the token data, or `undefined` if none available

??? interface "**`getNativeWrappedTokenId`** - Get the token id of the wrapped token for the native gas token"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<TokenId<C>>"++ - the wrapped token for the native gas token

??? interface "**`getTokenAccount`** - Get the token account for a given address and token"

    ??? child "Note"

        This function is really only useful in the context of Solana but is included here to provide a consistent interface 

    ??? child "Parameters"

        `address` ++"UniversalOrNative<C>"++ - the address to get the token account for

        ---

        `token` ++"TokenAddress<C>"++ - the token to get the token account for

    ??? child "Returns"

        `address` ++"Promise<ChainAddress<C>>"++ - the token account for the address and token

??? interface "**`supportsProtocol`** - Check to see if a given protocol is supported by this chain by confirming if it is registered in the platform and the configuration is available and correct"

    ??? child "Parameters"

        `protocolName` ++"ProtocolName"++ - the name of the protocol to check for support

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this protocol is supported

??? interface "**`getProtocol`** - Construct a protocol client for the given protocol"

    ??? child "Note"

        If no contracts are passed, it is assumed the default contracts should be used and that the protocol client is cacheable
    
    ??? child "Parameters"

        `protocolName` ++"ProtocolName"++ - the name of the protocol to construct a client for

        ---

        `contracts` ++"Contracts"++ - (optional) contracts to use when constructing the client

        ---

        `rpc` ++"RpcConnection<P>"++ - the RPC connection value passed to the constructor

    ??? child "Returns"

        ++"Promise<ProtocolInstance<P, PN, N, C>>"++ - an instance of the protocol client that implements the protocol interface for the chain

??? interface "**`supportsWormholeCore`** - Check to see if the Wormhole Core protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Wormhole Core protocol



??? interface "**`getWormholeCore`** - Get the Wormhole Core protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<WormholeCore<N, C>>"++ - the Wormhole Core protocol client for this chain

??? interface "**`supportsTokenBridge`** - Check to see if the Token Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Token Bridge protocol

??? interface "**`getTokenBridge`** - Get the Token Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<TokenBridge<N, C>>"++ - the Token Bridge protocol client for this chain

??? interface "**`supportsAutomaticTokenBridge`** - Check to see if the Automatic Token Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Automatic Token Bridge protocol



??? interface "**`getAutomaticTokenBridge`** - Get the Automatic Token Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<AutomaticTokenBridge<N, C>>"++ - the Automatic Token Bridge protocol client for this chain

??? interface "**`supportsCircleBridge`** - Check to see if the Circle Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Circle Bridge protocol

??? interface "**`getCircleBridge`** - Get the Circle Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<CircleBridge<N, C>>"++ - the Circle Bridge protocol client for this chain

??? interface "**`supportsAutomaticCircleBridge`** - Check to see if the Automatic Circle Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Automatic Circle Bridge protocol

??? interface "**`getAutomaticCircleBridge`** - Get the Automatic Circle Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<AutomaticCircleBridge<N, C>>"++ - the Automatic Circle Bridge protocol client for this chain

??? interface "**`supportsIbcBridge`** - Check to see if the IBC Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the IBC Bridge protocol

??? interface "**`getIbcBridge`** - Get the IBC Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        ++"Promise<IbcBridge<N, C>>"++ - the IBC Bridge protocol client for this chain

??? interface "**`supportsPorticoBridge`** - Check to see if the Portico Bridge protocol is supported by this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

        `true | false` ++"boolean"++ - indicating if this chain supports the Portico Bridge protocol

??? interface "**`getPorticoBridge`** - Get the Portico Bridge protocol client for this chain"

    ??? child "Parameters"

        None - uses values passed to the constructor

    ??? child "Returns"

            ++"Promise<PorticoBridge<N, C>>"++ - the Portico Bridge protocol client for this chain

## Addresses

The SDK uses the `UniversalAddress` class to implement the `Address` interface all address types must implement. To ensure seamless interoperability, addresses from various networks are parsed into their byte representation and modified as needed to ensure they are exactly 32 bytes long. Each platform also has an address type that understands the native address formats, referred to as `NativeAddress.` These abstractions allow you to work with addresses consistently regardless of the underlying chain.

The `Address` interface represents a parsed address and includes the following methods:

??? interface "**`toString`** - Return the address in its canonical string format"

    ??? child "Parameters"

        None - uses values passed to `UniversalAddress` constructor

    ??? child "Returns"

        ++"string"++ - address in canonical string format

??? interface "**`toUint8Array`** - Return the bytes for the address"

    ??? child "Parameters"

        None - uses values passed to `UniversalAddress` constructor

    ??? child "Returns"

        ++"Uint8Array"++ - bytes for the address

??? interface "**`toUniversalAddress`** - Return an address that has been converted to its universal representation" 

    ??? child "Parameters"

        None - uses values passed to `UniversalAddress` constructor

    ??? child "Returns"

        UniversalAddress ++"bytes32"++ - an address that has been parsed into its byte representation and possibly modified to ensure it is exactly 32 bytes long

??? interface "**`unwrap`** - Return the underlying native address type"

    ??? child "Parameters"

        None - uses values passed to `UniversalAddress` constructor

    ??? child "Returns"

        ++"unknown"++ - returns the underlying native address type such as a ++"Uint8Array"++ for `UniversalAddress` a checksum hex string ++"string"++ for EVM (ethers) or a `PublicKey` for Solana

## Signers

In the SDK, a `Signer` type is defined which consists of the following interfaces:  

- **`SignerBase`** - defines the base functionality common to all signers

    ??? interface "Methods"

        ??? child "**`chain`**"

            ??? child "Parameters"

                None

            ??? child "Returns"
         
                ++"number"++ - the chain the signer operates on 

        ??? child "**`address`**"

            ??? child "Parameters"

                None

            ??? child "Returns"
         
                ++"string"++ - the signer's address

- **`SignOnlySigner`** - a signer that only signs transactions but does not broadcast them to the network

    ??? interface "Methods"

        ??? child "**`sign`**" 

            ??? child "Parameters"

                `tx` ++"UnsignedTransaction<N, C>[]"++ - an array of unsigned transactions to be signed

            ??? child "Returns"

                ++"Promise<SignedTx[]>"++ - a promise that resolves with an array of signed and serialized transactions

- **`SignAndSendSigner`** - a signer that both signs transactions and sends them to the network

    ??? interface "Methods"

        ??? child "**`signAndSend`**"

            ??? child "Parameters"

                `tx` ++"UnsignedTransaction<N, C>[]"++ - an array of unsigned transactions to be signed

            ??? child "Returns"

                ++"Promise<TxHash[]"++ - a promise that resolves with an array of transaction hashes

Certain methods require either a `SignOnlySigner` or a `SignAndSendSigner` interface in order to sign transactions. A signer can be created by wrapping an existing offline wallet or a web wallet. Both signer interfaces extend the `SignerBase` which defines the shared `chain` and `address` methods for the transaction. 

A `SignOnlySigner` is used in scenarios where the signer isn't connected to the network or prefers not to broadcast transactions themselves. It accepts an array of unsigned transactions and returns an array of signed and serialized transactions. Before signing, the transactions may be inspected or altered. It's important to note that the serialization process is chain-specific. Refer to the testing signers (e.g., [EVM](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/evm/src/signer.ts){target=\_blank} or [Solana](https://github.com/wormhole-foundation/connect-sdk/blob/main/platforms/solana/src/signer.ts){target=\_blank}) for an example of how to implement a signer for a specific chain or platform.

Conversely, a `SignAndSendSigner` is appropriate when the signer is connected to the network and intends to broadcast the transactions. This type of signer also accepts an array of unsigned transactions but returns an array of transaction IDs, corresponding to the order of the unsigned transactions.

## Protocols

While Wormhole is a Generic Message Passing (GMP) protocol, several protocols have been built to provide specific functionality. If available, each protocol will have a platform-specific implementation. These implementations provide methods to generate transactions or read state from the contract on-chain.

### Wormhole Core

The core protocol forms the foundation for all Wormhole activity. Every supported platform module contains a core protocol configured to work with the specific platform. The protocol consists of two key subpackages, the `base` and `definitions` packages. The `base` package contains [constants](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/constants){target=/_blank} such as contract addresses, RPC configurations, and finality as well as [utility](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/base/src/utils){target=/_blank} types for accessing and validating constants. The [`definitions`](https://github.com/wormhole-foundation/wormhole-sdk-ts/tree/5810ebbd3635aaf1b5ab675da3f99f62aec2210f/core/definitions) package defines the VAA payload structure layout, interfaces for platforms and chain contexts, protocol interfaces, and types. 

This protocol is responsible for emitting the message containing the information necessary to perform bridging, including the [emitter address](/learn/fundamentals/glossary#emitter){target=\_blank}, the [sequence number](/learn/fundamentals/glossary#sequence){target=\_blank} for the message, and the payload of the message itself.

### Token Bridge

The most familiar protocol built on Wormhole is the Token Bridge. Every chain has a `TokenBridge` protocol client that provides a consistent interface for interacting with the Token Bridge. This includes methods to generate the transactions required to transfer tokens and methods to generate and redeem attestations. `WormholeTransfer` abstractions are the recommended way to interact with these protocols but it is possible to use them directly.

```ts
--8<-- 'code/build/applications/wormhole-sdk/token-bridge-snippet.ts'
```

Supported protocols are defined in the [definitions module](https://github.com/wormhole-foundation/connect-sdk/tree/main/core/definitions/src/protocols){target=\_blank}.