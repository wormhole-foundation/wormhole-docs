---
title: Core Contracts
description: Discover Wormhole's Core Contracts, enabling cross-chain communication with message sending, receiving, and multicast features for efficient synchronization.
---

# Core Contracts

The Core Contracts are the mechanism by which all Wormhole messages are emitted. All cross-chain applications either interact directly with the Core Contract or interact with another contract that does. Each blockchain in the ecosystem has a single Core Contract, which the Guardians are required to monitor. These Core Contracts emit the messages that the [Guardians](/learn/infrastructure/guardians/){target=_blank} pick up as [Observations](/learn/glossary/#observation){target=_blank}.

Core Contracts are generally simple and can be divided into sending and receiving sides, each of which will be defined next. 

## Sending

The implementation strategy for `publishMessage` differs by chain. However, the general strategy consists of the Core Contract posting the following items to the blockchain logs:

- `emitterAddress` of the contract which made the `publishMessage` call
- `sequenceNumber`
- `consistencyLevel` 

Once the desired `consistencyLevel` has been reached and the message passes all of the Guardians' optional checks, the Guardian Network will produce the requested Verified Action Approvals (VAAs).

The method signature for publishing messages:

```js
--8<-- 'code/learn/messaging/core-contracts/sending.js'
```

There are no fees to publish a message, except when publishing on Solana, but this is subject to change in the future.

### Parameters

- `payload` ++"byte[]"++ - the content of the emitted message is an arbitrary byte array. Due to the constraints of individual blockchains, it may be capped to a certain maximum length

- `consistencyLevel` ++"int"++ - a numeric value that defines the required level of finality that must be reached before the Guardians will observe and attest to emitted events. This is a defense against reorgs and rollbacks since a transaction, once considered "final,"  is guaranteed not to have the state changes it caused rolled back. Since different chains use different consensus mechanisms, each one has different finality assumptions, so this value is treated differently on a chain-by-chain basis. See the options for finality for each chain in the [Environments](#){target=\_blank} pages <!-- link to blockchain platforms -->

- `nonce` ++"int"++ - a free integer field that can be used however you like. Note that changing the `nonce` will result in a different digest

### Returns

- `sequenceNumber` ++"int"++ - a unique number that increments for every message for a given emitter (and implicitly chain). This, combined with the emitter address and emitter chain ID, allows the VAA for this message to be queried from the [APIs](#){target=\_blank}

## Receiving

The method signature for receiving a message encoded as a VAA:

```js
--8<-- 'code/learn/messaging/core-contracts/receiving.js'
```

The general approach involves the Core Contract on a target Chain parsing and verifying the components of a VAA, which include the original `emitterAddress`, `sequenceNumber`, and `consistencyLevel` among other fields.

The process of receiving and verifying a VAA ensures that the message was properly attested by the Guardian Network, maintaining the integrity and authenticity of the data transmitted between chains.

### Parameters

- `VAA` ++"byte[]"++ - the encoded message as a Verified Action Approval, which is a byte array that contains all necessary information for verification and processing

### Returns

- `payload` ++"byte[]"++ - the original payload of the message, as extracted from the VAA, which can then be further processed or acted upon according to the logic of the contract

### Error Handling

When a VAA is passed to the `parseAndVerifyVAA` function, it will either return the payload and associated metadata for the VAA or throw an exception. An exception should only be thrown if the VAA fails signature verification, an indication the VAA is invalid or inauthentic in some form.

!!! note
    Take care to make sure this method is called during the execution of a transaction where a VAA is passed to ensure the signatures are checked and verified.

## Multicast

Multicast refers to simultaneously broadcasting a single message or transaction across different blockchains. This means that there is no destination address or chain for the sending and receiving functions. This is possible because VAAs simply attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain where they are used.

This multicast-by-default model makes it easy to synchronize the state across the entire ecosystem because a single blockchain can make its data available to every chain in a single action with low latency. This reduces the complexity of the n^2 problems encountered by routing data to a large number of blockchains.

This doesn't mean an application _cannot_ specify a destination address or chain. For example, the Token Bridge and Standard Relayer contracts require that some destination details be passed and verified on the destination chain.

Because the VAA creation is separate from relaying, the multicast model does not incur an additional cost when a single chain is targeted. If the data isn't needed on a certain blockchain, don't relay it there, and it won't cost anything.

