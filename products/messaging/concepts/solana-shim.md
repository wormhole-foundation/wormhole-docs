---
title: Solana Shims
description: Understand how Wormhole uses shim programs on Solana to optimize message emission and VAA verification without modifying the Core Bridge.
categories: Basics
---

# Solana Shims

<!--- TODO --->
what are Solana shims Include this definition in the opening section of the Solana Shims concept page.
diagram or table explaining message accounts per emission and how shims avoid them. ??

Explain tradeoffs of message permanence vs. cheaper emissions.

Add short explanation and link to Anchor CPI events: Anchor Events
Explain how Guardian observation works with shim events vs. accounts.
Add explanation of why costs drop despite higher CU. Add cost model explanation: rent (lamports) vs compute (CU)

Add an illustration showing Core Bridge creating PDAs per message vs. Shim using logs

Add a table comparing core verification vs shim approach.

Explain how more CU can still be cheaper due to rent savings.

Explain what "verifiable builds" are and why dropping upgrade authority matters.


<!------------------------------------>

In Wormhole, shims are lightweight Solana programs that act as extensions to the immutable Core Bridge. They offer alternative ways to emit and verify messages that:
- Reduce rent costs by avoiding permanent account creation
- Leverage instruction logs or syscalls to maintain compatibility with Guardian observation
- Preserve core guarantees like unique sequence numbers and VAA validity

They don’t replace the Core Bridge, but provide drop-in alternatives for integrators looking to optimize performance and cost.

<!------------------------------------>

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