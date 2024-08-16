---
title: Circle's CCTP Bridge
description: Unlock fast, affordable USDC transfers with Wormhole's integration of Circle's CCTP, featuring automatic relaying and native gas solutions.
---

# Circle's CCTP Bridge

Wormhole Connect and the Wormhole Connect SDK support fast, cheap, native USDC bridging between all networks supported by Circle's [Cross-Chain Transfer Protocol](https://www.circle.com/en/cross-chain-transfer-protocol){target=\_blank}. CCTP is Circle's native USDC cross-chain transfer attestation service.

While this protocol is wholly separate from Wormhole itself, Wormhole builds on top of CCTP and adds several valuable augmentations, making it more straightforward to use and more useful for end users. These features include automated relaying, which eliminates the need for users to redeem USDC transfers themselves; gas payment on the destination chain, allowing users to transfer USDC without needing to pay gas on the destination chain; and gas dropoff, enabling users to convert a portion of USDC into the destination chain's gas token upon a successful transfer.

!!! note
    Wormhole supports all CCTP-supported chains but at the moment only a [handful of chains](https://developers.circle.com/stablecoins/docs/supported-domains){target=\_blank} are supported by Circle.

You can use Wormhole's CCTP-powered USDC bridging by embedding the [Connect Widget](#){target=\_blank} or by integrating the [Connect SDK](#){target=\_blank} directly.

## Automatic Relaying

To complete a CCTP transfer, the [Circle Attestation](https://developers.circle.com/stablecoins/reference/getattestation){target=\_blank} must be delivered to the destination chain.

This attestation delivery may be difficult or impossible in some contexts. For example, in a browser context, the user does not wish to wait for finality to deliver the attestation. To address this difficulty, the Wormhole CCTP relayer may be used either with the [Wormhole Connect Widget](#){target=\_blank} or more directly with the [Connect SDK](#){target=\_blank}.

The Wormhole CCTP Relayer charges a fee to deliver the attestation and complete the transfer.

|      Chain      |       Fee       |
|:---------------:|:---------------:|
|  Ethereum       |     1.0 USDC    |
| Everything else |     0.1 USDC    |

<!-- this is maybe the intended profit margin, but definitely not the total relaying cost, needs to be reviewed -->

## Native Gas Drop-Off

Another advantage of using the automatic relaying feature is the opportunity to transfer some native gas to the receiver on the destination chain. This feature is referred to as _native gas drop-off_.

The ability to perform native gas drop-off addresses the common issue where a user may hold a balance of USDC but has no native gas to perform subsequent transactions.

<!-- 
!!! note
    Native gas dropoff is limited to TODO 
-->