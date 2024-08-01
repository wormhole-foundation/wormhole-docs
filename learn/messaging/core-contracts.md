---
title: Core Contracts
description: Discover Wormhole's Core Contracts, enabling cross-chain communication with message sending, receiving, and multicast features for efficient synchronization.
---

# Core Contracts

The Core Contracts are the mechanism by which all Wormhole messages are emitted. All cross-chain applications either interact directly with the Core Contract or interact with another contract that does. There is one Core Contract on each blockchain in the ecosystem, which is the contract which the Guardians are required to observe. The Core Contract is the contract that ultimately emits the messages the [Guardians](/learn/infrastructure/guardians/){target=\_blank} pick up as an [Observation](#){target=\_blank}.

In general, Core Contracts are simple and can be broken down to a sending and receiving side, which will be defined next. 

## Sending

Currently, there are no fees to publish a message (with the exception of publishing on Solana), but this is not guaranteed to always be the case.

The implementation strategy for `publishMessage` differs by chain. However, the general strategy consists of the Core Contract posting the `emitterAddress` (the contract which called `publishMessage`), `sequenceNumber`, and `consistencyLevel` into the blockchain logs. Once the desired `consistencyLevel` has been reached and the message passes all of the Guardians' optional checks, the Guardian Network will produce the requested VAAs.

The method signature for publishing messages:

```js
--8<-- 'code/learn/messaging/core-contracts/sending.js'
```

#### Parameters

**payload**

The content of the emitted message is an arbitrary byte array. Due to the constraints of individual blockchains, it may be capped to a certain maximum length.

**consistencyLevel**

!!! note
    Some advanced integrators may want to get messages before finality, which is where the `consistency_level` field offers chain-specific flexibility.

The `consistency_level` can be considered as a numeric `enum` data type where the value is treated differently for different chains.

It describes the level of finality to reach before the Guardians will observe and attest the emitted event. This is a defense against reorgs and rollbacks since a transaction, once considered `final`, is guaranteed not to have the state changes it caused be rolled back.

Different chains use different consensus mechanisms, so there are different finality assumptions with each one, see the options for finality in the [Environments](#){target=\_blank} pages. <!-- link to blockchain platforms -->

**nonce**

A free integer field that can be used however the developer would like. Note that a different `nonce` will result in a different digest.

#### Returns

**sequenceNumber**

A unique number that increments for every message for a given emitter (and implicitly chain). This combined with the emitter address and emitter chain ID allows the VAA for this message to be queried from the [APIs](#){target=\_blank}.

## Receiving

The method signature for receiving messages, encoded as a VAA

```js
--8<-- 'code/learn/messaging/core-contracts/receiving.js'
```

When passed a VAA, this function will either return the payload and associated metadata for the VAA or throw an exception. An exception should only ever be thrown if the VAA fails signature verification, indicating that the VAA is invalid or inauthentic in some form.

!!! note
    A developer should take care to make sure this method is called during the execution of a transaction where a VAA is passed to ensure the signatures are checked and verified.

## Multicast

Please notice that there is no destination address or chain in these functions.

VAAs simply attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain they are brought to.

This multicast-by-default model is integral to the design. Having this multicast capacity makes it easy to synchronize state across the entire ecosystem, because a single blockchain can make its data available to every chain in a single action with low latency. This reduces the complexity of the n^2 problems encountered by routing data to a large number of blockchains.

This does not mean an application _cannot_ specify a destination address or chain. For example, the Token Bridge and Standard Relayer contracts require that some destination details be passed and verified on the destination chain.

Because the VAA creation is separate from relaying, there is no _additional_ cost to the multicast model when a single chain is being targeted. If the data isn't needed on a certain blockchain, don't relay it there, and it won't cost anything.
