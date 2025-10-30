---
title: Solana Message Emission via Shim
description: Learn how to reduce rent costs when emitting Wormhole messages on Solana by using the emission shim instead of post_message.
categories: Basics
---

# Solana Message Emission via Shim

The emission shim is a lightweight Solana program that lets integrators emit Wormhole messages without creating a new rent-exempt account for every message. It passes an empty payload to the core bridge and emits the message data through transaction logs, reducing rent costs and avoiding state bloat while remaining fully compatible with Guardian observation.

Migrating from the legacy path is straightforward: no account resizing is needed, and programs can call the shim directly. The Wormhole fee is still paid through the `fee_collector`, with the same parallelization limits as before. 

Guardians are configured to observe the canonical shim address, reading message data, emitter, and nonce from the transaction logs and CPI events, rather than on-chain accounts. They also ignore the empty core bridge payload to prevent duplicate VAAs. On mainnet, all 19 Guardians support shim emissions, and, as with all Wormhole messages, at least 13 attestations are required for a valid VAA.

!!!note
    For on-chain programs that only call the shim via CPI, consider emitting a dummy/empty message after migration to avoid edge cases with initial CPI depth (Solana limits the depth of cross-program calls).

For more background, see [Emission Shim concept section](/docs/products/messaging/concepts/solana-shim/#emission-shim){target=\_blank}. 

## Prerequisites

To interact with the emission shim, you'll need the following:

- [Rust and Solana CLI](https://solana.com/docs/intro/installation){target=\_blank} installed.  
- [Anchor installed](https://www.anchor-lang.com/docs/installation){target=\_blank}.
- The canonical emission shim program already deployed at [`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}.
- The shim’s [IDL](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_post_message_shim.json){target=\_blank} for wiring accounts.
- A payer (signer) funded with enough SOL to cover compute and message fees.

## Setup

To start, import the shim crate to call `wormhole_post_message_shim::cpi::post_message`. Then, pull the core bridge addresses needed to be passed along.

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs::9'
```

## Accounts

When calling the shim’s `post_message` instruction, you need to pass:

- **`bridge`**: Holds the Wormhole core bridge config.
- **`message`**: Represents the PDA derived from the emitter and is reused by the shim instead of generating new accounts.
- **`emitter`**: Serves as the emitter address (signer).
- **`sequence`**: Tracks the emitter's sequence account.
- **`payer`**: Pays compute and any rent needed on first use (signer).
- **`fee_collector`**: Collects the Wormhole message fee.
- **`clock`**: Provides the current Solana time from the sysvar.
- **`system_program`**: Supplies the standard Solana system program for account creation on first use.
- **`wormhole_program`**: Points to the Wormhole core bridge program.
- **`event_authority`**: Acts as the PDA used by the shim to emit log events (Anchor CPI events).
- **`program`**: Specifies the shim program itself.

The struct below defines the accounts required by your instruction and wires the shim to the core bridge, ensuring the emitter PDA can sign the CPI via seeds.

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs:10:60'
```

This instruction reuses a single per-emitter message PDA (no per-message rent). When invoked, the shim emits your payload as an Anchor CPI event and, in the same transaction, calls the core bridge with an empty payload, allowing the core bridge to still assign the sequence and enforce fees/finality. Guardians read the Core call (sequence/finality) and the shim event (payload) from the transaction logs, producing a standard VAA without leaving a persistent message account.

## Call post_message

The `post_message` function builds a `CpiContext` and invokes the shim’s `post_message` instruction, forwarding the nonce, finality, and your payload. The Core Bridge enforces fee requirements and assigns the sequence, while the shim emits the payload as an event in the same transaction.

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs:62'
```

## Limitations and Considerations 

- **Rent**: No persistent account rent is paid for every emission; the cost is now dominated by compute and the emission fee.
- **Logs**: Since all observability is log-based, re-observation is only possible while Solana transaction history is available.
- **Parallelization**: Still limited by the `fee_collector` account being mutable.
- **CPI Depth**: The first shim call for an emitter adds one extra stack depth. This is only relevant if you are near the Solana CPI limit (4).

## Conclusion

By using the emission shim, you can dramatically reduce rent costs when emitting Wormhole messages from Solana, while ensuring compatibility with Guardian observation and core bridge sequencing.

For a complete, working reference, see the full example implementation in the Wormhole repo: [`post_message.rs`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/programs/wormhole-integrator-example/src/instructions/post_message.rs){target=\_blank}.