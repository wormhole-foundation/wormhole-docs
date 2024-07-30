---
title: Core Contracts
description: 
---

<!--
[link](#){target=\_blank}
`
!!! note
```js
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```
=== "Testnet"
```sh
```
```text
```
-->

# Token and NFT Bridge

## Token Bridge

!!! note
    Before a token transfer can be made, the token being transfered must exist as a wrapped asset on the target chain. This is done by [Attesting](#){target=\_blank} the token details on the target chain. <!-- link to VAAs -->

The Token Bridge contract allows token transfers between blockchains through a lock and mint mechanism, using the [Core Contract](/learn/messaging/core-contracts/){target=\_blank} with a specific [payload](#){target=\_blank} to pass information about the transfer. <!--payload links to VAAs page payloads -->

The Token Bridge also supports sending tokens with some additional data in the form of arbitrary byte payload attached to the token transfer. This type of transfer is referred to as a [Contract Controlled Transfer](#){target=\_blank}. <!-- links to VAAs page token + msg  -->

While the [Core Contract](/learn/messaging/core-contracts/){target=\_blank} has no specific receiver by default, transfers sent through the token bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient.

## NFT Bridge

The NFT Bridge functions similarly to the Token Bridge but with special rules for what may be transferred and how the wrapped version is created on the destination chain.