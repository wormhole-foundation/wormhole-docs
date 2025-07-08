---
title: Efficient Emission on Solana (Shim)
description:
categories: Basics
---

<!-- TODO add link in messaging overview -->

# Efficient Emission on Solana (Shim)

Purpose: Introduces a new emission mechanism via a shim program to avoid:

- Creating one-time, unreclaimable message accounts per message
- Contention from mutable config account references
- High rent costs

Key Concepts:

- Uses a CPI event to emit the sequence number and timestamp
- Guardians reconstruct the message from the instruction data
- Sequence tracking stays reliable via core bridge
- Still pays fees, so fee_collector is touched (limiting parallelism)

