---
title: Native Token Transfers Rate Limiting
description: Learn about rate limits in Wormhole NTT by configuring send/receive limits, queuing, and canceling flows to manage multichain token transfers efficiently.
---

## Introduction

The Native Token Transfer (NTT) framework provides configurable per-chain rate limits for sending and receiving token transfers. Integrators can manage these limits via their own governance processes to quickly adapt to on-chain activity.

If a transfer is rate-limited on the source chain and queueing is enabled via `shouldQueue = true`, the transfer is placed into an outbound queue and can be released after the duration of the rate limit expires.

You can configure the following limits on every chain where NTT is deployed directly using the manager:

- **Sending limit** - a single outbound limit for sending tokens from the chain
- **Per-chain receiving limits** - the maximum receiving limit, which can be configured on a per-chain basis. For example, allowing `100` tokens to be received from Ethereum, but only 50 tokens to be received from Arbitrum

Rate limits are replenished every second over a fixed duration. While the default duration is 24 hours, the value is configurable at contract creation. Rate-limited transfers on the destination chain are added to an inbound queue with a similar release delay.

## Queuing Mechanism

When a transfer exceeds the rate limit, it is held in a queue and can be released after the set rate limit duration has expired. The sending and receiving queuing behavior is as follows:

- **Sending** - if an outbound transfer violates rate limits, users can either revert and try again later or queue their transfer. Users must return after the queue duration has expired to complete sending their transfer
- **Receiving** - if an inbound transfer violates rate limits, it is held in a queue. Users or relayers must return after the queue duration has expired to complete receiving their transfer on the destination chain
    
## Cancel Flows

If users bridge frequently between a given source chain and destination chain, the capacity could be exhausted quickly. Loss of capacity can leave other users rate-limited, potentially delaying their transfers.  The outbound transfer cancels the inbound rate limit on the source chain to avoid unintentional delays. This allows for refilling the inbound rate limit by an amount equal to the outbound transfer amount and vice-versa, with the inbound transfer canceling the outbound rate limit on the destination chain and refilling the outbound rate limit with an amount.