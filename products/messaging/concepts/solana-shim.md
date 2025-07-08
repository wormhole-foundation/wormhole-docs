---
title: Solana Shim
description:
categories: Basics
---

# Solana Shims

Wormhole's Solana shims are optional helper programs that make message emission and verification cheaper and more flexible, without modifying the Core Bridge itself.


Solana shims are auxiliary Solana programs (smart contracts) that act as wrappers or “adapters” around the Core Bridge contracts. They enable more efficient or flexible behavior for emission or verification of Wormhole messages without modifying the immutable core bridge.

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