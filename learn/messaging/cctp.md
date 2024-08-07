---
title: CCTP and Circle Bridge
description: TODO
---

# CCTP and Circle Bridge

Wormhole Connect and the Wormhole Connect SDK support fast, cheap, native USDC bridging between all networks supported by Circle's [Cross chain Transfer Protocol](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank}. Cross Chain Transfer Protocol is Circle's native USDC cross-chain transfer attestation service.

While this protocol is wholly separate from Wormhole itself, Wormhole builds on top of CCTP and adds several valuable augmentations, making it more straightforward to use and more useful for end users. These features include automated relaying (so that users don't need to redeem USDC transfers themselves), gas payment on the destination chain (so users can transfer USDC without paying gas on the destination chain), and gas dropoff (allowing users to convert some USDC to the destination gas token upon a successful transfer).

!!! note
    Wormhole supports all CCTP-supported chains but at the moment only a [handful of chains](https://developers.circle.com/stablecoins/docs/supported-domains){target=\_blank} are supported by Circle.

You can use Wormhole's CCTP Powered USDC bridging by embedding the [Connect Widget](#){target=\_blank} or by integrating the [Connect SDK](#){target=\_blank} directly.

## Automatic Relaying

To complete a CCTP transfer, the [Circle Attestation](https://developers.circle.com/stablecoins/reference/getattestation){target=\_blank} must be delivered to the destination chain.

This attestation delivery may be difficult or impossible in some contexts. For example, in a browser context, the user does not wish to wait for finality to deliver the attestation. To address this difficulty, the Wormhole CCTP Relayer may be used either with the [Wormhole Connect Widget](#){target=\_blank} or more directly with the [Connect SDK](#){target=\_blank}.

The Wormhole CCTP Relayer charges a fee to deliver the attestation and complete the transfer.

|      Chain      |       Fee       |
|:---------------:|:---------------:|
|  Ethereum       |     1.0 USDC    |
| Everything else |     0.1 USDC    |


Another advantage of using the Automatic Relaying feature is the opportunity to transfer some native gas to the receiver on the destination chain. This feature is referred to as `native gas dropoff`.

The ability to perform native gas dropoff addresses the common issue where a user may hold a balance of USDC but has no native gas to perform subsequent transactions.

!!! note
    Native gas dropoff is limited to TODO <!-- ?? -->

## CCTP via Wormhole Connect Widget

Using the Wormhole Connect widget, supporting CCTP USDC transfers is incredibly simple. Enable USDC bridging directly in your dApp in as few as five lines of code, and you'll get all the user-friendly features built by Wormhole along with it.

An introduction is available on the [Wormhole Connect: Bridging Made Easy](#){target=\_blank} page.

## CCTP via Connect SDK

Supporting CCTP with manual or automatic transfers is straightforward using the Connect SDK.

A full tutorial is available on the [USDC Transfers With Connect SDK](#){target=\_blank} page.