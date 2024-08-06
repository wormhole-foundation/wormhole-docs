---
title: Core Messaging
Description: Explore Wormhole Connect's core contracts, which facilitate message emissions across chains and serve as the central interaction point for cross-chain apps.
---

# Core Contract

The core contracts are the mechanism by which all Wormhole messages are emitted. All cross-chain applications either interact directly with the core contract or interact with another contract that subsequently interfaces with the core contract. There is one core contract per blockchain in the ecosystem, and this is the contract that the Guardians are required to observe. The core contract ultimately emits the messages the [Guardians](./guardian.md) pick up as an [Observation](../glossary.md#observation).

Core contracts are generally simple and can be divided into a sending and receiving side, which will be defined next.

## Sending

Currently, there are no fees to publish a message (with the exception of publishing on Solana), but this is not guaranteed to always be the case.

The implementation strategy for `publishMessage` differs by chain, but the general strategy consists of the core contract posting the `emitterAddress` (the contract called `publishMessage`), `sequenceNumber`, and `consistencyLevel` into the blockchain logs. Once the desired `consistencyLevel` has been reached and the message passes all of the Guardians' optional checks, the Guardian Network will produce the requested VAAs.

The method signature for publishing messages is as follows:

```js
--8<-- 'code/build/enable-multichain-integrations/core-messaging/publish-message.sol'
```

### Parameters 

#### Payload 

The content of the emitted message is an arbitrary byte array. Due to the constraints of individual blockchains, it may be capped to a certain maximum length.

#### ConsistencyLevel

Some advanced integrators may want to get messages before finality, where the `consistency_level` field offers chain-specific flexibility.

The `consistency_level` can be considered as a numeric `enum` data type where the value is treated differently for different chains.

It describes the level of finality to reach before the guardians will observe and attest the emitted event. This is a defense against reorgs and rollbacks, since a transaction once considered final is guaranteed not to have the state changes it caused rolled back.

Different chains use different consensus mechanisms, so each one requires different finality assumptions. See the options for finality in the [Environments](../../blockchain-environments/README.md) pages.  

#### Nonce

A free integer field that can be used however the developer would like. Note that a different `nonce` will result in a different digest.

### Returns

#### SequenceNumber

A `sequenceNumber` is a unique number that increments for every message for a given emitter (and implicitly chain). This combined with the emitter address and emitter chain ID allows the VAA for this message to be queried from the [APIs](../api-docs/README.md)

## Receiving

The method signature for receiving messages, encoded as a VAA is as follows:

```solidity
parseAndVerifyVAA(byte[] VAA)
```

When passed a VAA, this function will either return the payload and associated metadata for the VAA or throw an exception. An exception should only ever throw if the VAA fails signature verification, indicating the VAA is invalid or inauthentic in some form.

A developer should ensure this method is called during the execution of a transaction where a VAA is passed to ensure the signatures are checked and verified.

## Multicast

Please note that there is no destination address or chain for these functions. VAAs simply attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain they are brought to.

This multicast-by-default model is integral to the design. Having this multicast capacity makes it easy to synchronize state across the entire ecosystem, because a single blockchain can make its data available to every chain in a single action with low latency. This reduces the complexity of the n^2 problems encountered by routing data to a large number of blockchains.

This does not mean an application cannot specify a destination address or chain. For example, the token bridge and standard relayer contracts require that some destination details are passed and verified on the destination chain. Because the VAA creation is separate from relaying, there is no additional cost to the multicast model when a single chain is being targeted. If data is not required on a specific blockchain, omitting its relay to that chain will ensure no additional costs are incurred.

# Other provided contracts 

## Token Bridge

Before a token transfer can be made, the token being transfered must exist as a wrapped asset on the target chain. This is done by [attesting](./vaa.md) the token details on the target chain. 

The token bridge contract allows token transfers between blockchains through a lock and mint mechanism, using the [core contract](#core-contract) with a [specific payload](./vaa.md#transfer) to pass information about the transfer.

The token bridge also supports sending tokens with some additional data in the form of an arbitrary byte payload attached to the token transfer. This type of transfer is referred to as a [contract controlled transfer](./vaa.md#token--message).

While the [core contract](#core-contract) has no specific receiver by default, transfers sent through the token bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient. 

## NFT Bridge

The NFT bridge functions similarly to the [token bridge](#token-bridge) but with special rules for what may be transferred and how the wrapped version is created on the destination chain.
