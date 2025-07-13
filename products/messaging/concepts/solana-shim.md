---
title: Solana Shim
description:
categories: Basics
---

# Solana Shims

Solana shims are optional auxiliary programs that act as wrappers or “adapters” around the Core Bridge contracts. They enable cheaper and more flexible behavior for emission or verification of Wormhole messages without modifying the Core Bridge itself.

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