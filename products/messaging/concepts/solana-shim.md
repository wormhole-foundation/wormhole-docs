---
title: Solana Shims
description: Understand how Wormhole uses shim programs on Solana to optimize message emission and VAA verification without modifying the Core Bridge.
categories: Basics
---

# Solana Shims

Wormhole shims on Solana are lightweight programs that enable cheaper and more flexible message emission and verification while preserving Guardian observation guarantees. They are designed for integrators who want to reduce Solana rent costs without sacrificing core protocol security or Guardian compatibility.

This page explains how they work, why they exist, and what tradeoffs come with using them.

## Why Shims Exist

The [Core Bridge](/docs/protocol/infrastructure/core-contracts/) is immutable and secure, but on Solana it comes with specific limitations:

- **Emission**: The `post_message` instruction creates a new message account for every call, which permanently consumes state and lamports—even after the VAA has been generated and used. While `post_message_unreliable` allows account reuse, it offers no way to recover messages once overwritten and requires the payload size to exactly match the existing account, as it predates support for account resizing.
- **Verification**: The `post_vaa` instruction requires creating multiple temporary accounts to verify and store a VAA, resulting in added rent costs and on-chain storage overhead.

Solana shims solve these problems _without modifying the Core Bridge_, enabling optimized workflows for Solana-based applications.

## How Shims Fit into Wormhole

Shims are not replacements for the Core Bridge — they are lightweight programs that extend its functionality, specifically on Solana, to reduce cost and simplify integration.

- **Emission**: Emits messages by wrapping `post_message_unreliable`, but avoids storing full payloads on-chain. Instead, it emits a CPI event containing the sequence number and timestamp. Guardians observe this event and reconstruct the message from the instruction data, ensuring it remains fully verifiable — without requiring a new message account or rent payment for each emission.

- **Verifcation**: Verifies VAAs using the `secp256k1_recover` syscall to check guardian signatures against a VAA digest directly. It avoids creating `signature_set` or `vaa` accounts entirely. This means integrators can verify VAAs without incurring permanent storage costs and even handle large payloads that wouldn't fit in a single transaction.

These shims preserve all Wormhole security guarantees — like unique emitter/sequence digests and guardian-based verification — while minimizing rent costs and improving flexibility on Solana.

Guardians are updated to support shims by:

- Recognizing shim program IDs and identifying emissions or verifications initiated through them
- Extracting message data directly from instruction data and emitted events rather than relying on message or VAA accounts
- Treating shim-based messages the same as Wormhole messages, preserving the same emitter address, sequence number, and consistency level as core-originated messages

This ensures that VAAs generated from shim emissions are identical in structure and security to those emitted directly via the Core Bridge.

## Post Message Shim

The Post Message Shim allows Solana programs to emit Wormhole messages without creating a new message account for each emission, significantly reducing rent costs.

- Internally calls `post_message_unreliable` on the Core Bridge but writes an empty payload to the message account.
- Emits a [CPI event](https://book.anchor-lang.com/anchor_in_depth/events.html#cpi-events) containing the sequence and timestamp.
- Guardians observe the instruction data and event logs to reconstruct the full message, including the actual payload
Still touches the fee_collector account, which means emissions remain serialized across integrators
Use this shim when:
You want to reduce the cost of emitting messages on Solana
You don’t need permanent message accounts for re-observation or archival purposes





This shim emits Wormhole messages with the same sequence tracking, but avoids account bloat:

- Calls `post_message_unreliable` with an empty payload account
- Emits a  with timestamp and sequence
- Guardian reconstructs the message from instruction data + CPI event
- Still touches the `fee_collector` (so not parallelizable), but avoids rent costs

Use it when:
- You need cheaper emissions
- You don’t rely on permanent message accounts for re-observation

## Verify VAA Shim

This shim performs signature verification without the core bridge’s `signature_set` or `vaa` accounts:

- Posts guardian signatures to a temporary account
- Verifies the VAA digest via CPI (using `secp256k1_recover`)
- Lets integrators reclaim rent by closing the account after use
- Supports large VAA bodies (e.g. Queries) that wouldn’t fit in a single tx

Use it when:
- You want to save costs and clean up rent
- You need to verify VAAs (or QueryResponses) inside your own Solana programs

## Security Guarantees

- **Same emitters and sequences** → message digest stays unique
- **No duplicate VAAs** → guardians skip zero-payload emissions
- **No upgradeable behavior** → upgrade authority should be dropped after deployment
- **Digest replay protection** remains intact

## Tradeoffs and Limitations

| Feature | Core Bridge | Shim |
|--------|-------------|------|
| Rent Cost | High | Low |
| Guardian Compatibility | Built-in | Requires update |
| Parallel Emission | Limited | Still limited (fee_collector) |
| Re-observation | Permanent | Temporary |
| VAA Size Limit | Yes | No (via accounts) |

## Deployment and Adoption

- Shims are deployed on mainnet with verifiable builds
- Guardians need to opt into observing the shim’s program ID
- Deployment and testing instructions are available in the [Shim Deployment Guide](../guides/shim-deployment.md)

## Learn More

- [Efficient Message Emission on Solana](../guides/efficient-solana-emission.md)
- [Efficient VAA Verification on Solana](../guides/efficient-solana-verification.md)
- [Shim Deployment Guide](../guides/shim-deployment.md)


<!--- 

diagram or table explaining message accounts per emission and how shims avoid them. ??
Explain tradeoffs of message permanence vs. cheaper emissions.

Add short explanation and link to Anchor CPI events: Anchor Events
Explain how Guardian observation works with shim events vs. accounts.
Add explanation of why costs drop despite higher CU. Add cost model explanation: rent (lamports) vs compute (CU)

Add an illustration showing Core Bridge creating PDAs per message vs. Shim using logs

Add a table comparing core verification vs shim approach.

Explain how more CU can still be cheaper due to rent savings.

Explain what "verifiable builds" are and why dropping upgrade authority matters.




Wormhole uses two shims:

- post_message_shim: for emitting messages cheaply
- verify_vaa_shim: for verifying VAAs in a cost-effective way

how messages/VAAs are handled on Solana
important distinctions vs. the traditional Core Bridge model
technical constraints like account creation, CPI limits, Guardian observation behavior, etc.

how it's used in practice
how Guardian observation works
why it's safe
what tradeoffs

--->