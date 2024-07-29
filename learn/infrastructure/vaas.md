---
title: VAAs
description: 
---

<!--
[link](#){target=\_blank}
-->

# Verified Action Approvals

VAAs are the core messaging primitive in Wormhole. You can think of them as packets of cross chain data that are emitted any time a cross chain application contract interacts with the Core Contract.

The basic VAA has two components: a Header and a Body.

Messages emitted by contracts need to be validated by the guardians before they can be sent to the target chain. Once a majority of guardians observe the message and finality has been achieved, the Guardians sign a keccak256 hash of the message body.

The message is wrapped up in a structure called a VAA which combines the message with the guardian signatures to form a proof.

VAAs are uniquely indexed by the (emitter_chain, emitter_address, sequence) tuple. A VAA can be obtained by querying the Guardian [RPC](#){target=\_blank} or the [API](#){target=\_blank} with this information.

These VAA's are ultimately what a smart contract on a receiving chain must process in order to receive a wormhole message.

## VAA Format

VAA's contain two sections of data.

### Header 

The header holds metadata about the current VAA, the guardian set that is currently active, and the list of signatures gathered so far.

```js
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```

where each signature is:

```js
--8<-- 'code/learn/infrastructure/VAAs/signature.js'
```

