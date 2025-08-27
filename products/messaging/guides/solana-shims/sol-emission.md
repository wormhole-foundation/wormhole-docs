---
title: Solana Message Emission via Shim
description: Learn how to reduce rent costs when emitting Wormhole messages on Solana by using the emission shim instead of post_message.
categories: Basics
---

# Solana Message Emission via Shim

This guide explains how to use Wormhole’s emission shim on Solana to reduce the cost of message emission. The shim enables integrators to emit messages without creating a new account for each message, minimizing rent costs and state bloat while maintaining Guardian compatibility.

For more background, see [Solana Shims concept page](/docs/products/messaging/concepts/solana-shim/){target=\_blank}. 

## How It Works

The emission shim exposes a [`post_message`](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/api/post_message.rs){target=\_blank} instruction that is closely modeled on the Core Bridge’s `post_message_unreliable`, but not identical.

The shim differs from the standard `post_message` approach in two key ways. First, it uses a Program Derived Address (PDA) per emitter for message accounts, removing the need to generate a new keypair for each emission. Second, instead of writing the message into a persistent, rent-exempt account, it emits the data via an Anchor CPI event, which Guardians can observe directly. This design reduces rent costs and avoids leaving behind unused accounts.

The shim works through a few main components:

- **Shim Program**: Provides a `post_message` instruction modeled on the Core Bridge’s `post_message_unreliable`.
- **Sequence Handling**: The Core Bridge still manages sequence numbers. It reads the sequence number from the core bridge and emits it in a [CPI event](https://www.anchor-lang.com/docs/basics/cpi){target=\_blank}, along with the timestamp.
- **Message Account**: Calls `post_message_unreliable` on the core bridge, writing an empty payload, so no unique message is stored on-chain.
- **Guardian Role**: Guardians reconstruct the message from instruction data and the emitted event, not from a persistent account.

```mermaid
graph LR
    A[Integrator Program]
    B[Emission Shim]
    C[Core Bridge]
    D[Guardians]

    A -- call post_message --> B
    B -- emits event & calls core --> C
    C -- instruction data & event --> D
```

The emission fee is still paid, and sequence numbers are still managed by the Core Bridge as before. The difference is that instead of creating a new message account for each emission, the shim emits a CPI event with the message data. All the information Guardians need is captured in the transaction logs, without leaving behind permanent accounts.

## Prerequisites

To interact with the emission shim, you'll need the following:

- [Rust and Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools){target=\_blank} installed.  
- [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank}
- The canonical Emission Shim program already deployed at [`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}.
- The shim’s [IDL](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_post_message_shim.json){target=\_blank} for wiring accounts.
- A payer (signer) founded with enough SOL to cover compute, first-use PDA rent, and the Core Bridge message fee.

## Setup

To start, import the shim crate so we can call `wormhole_post_message_shim::cpi::post_message`. Then, pull the Core Bridge addresses needed to be passed along (the shim is a front-door into Core, not a replacement).

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs:2:9'
```

## Accounts

When calling the shim’s `post_message` instruction, you need to pass:

- `bridge`: Core Bridge config.
- `message`: PDA derived from the emitter; reused by the shim instead of generating new accounts.
- `emitter`: The emitter address (signer).
- `sequence`: PDA for sequence tracking.
- `payer`: Pays compute and any rent needed on first use (signer).
- `fee_collector`: Fee account.
- `clock`: Sysvar for current time.
- `system_program`: Standard Solana system program (for account creation on first use).
- `wormhole_program`: The Wormhole Core Bridge program.
- `event_authority`: PDA used by the shim to emit log events (Anchor CPI events).
- `program`: The shim program itself.

Define the accounts your instruction needs. The struct below wires the shim and Core together and ensures your emitter PDA can sign the CPI via seeds.

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs:10:60'
```

This instruction reuses a single per-emitter message PDA (no per-message rent). When invoked, the shim emits your payload as an Anchor CPI event and, in the same transaction, calls the Core Bridge with an empty payload so Core still assigns the sequence and enforces fees/finality. Guardians read the Core call (sequence/finality) and the shim event (payload) from the transaction logs, producing a standard VAA without leaving a persistent message account.

## Call post_message

The following function does the emission. It optionally transfers the Core message fee, calls the shim’s `post_message` via CPI, passing nonce, finality, and your payload, and signs the CPI with your emitter PDA.

```rs
--8<-- 'code/products/messaging/guides/shims/post_message.rs:62'
```

## Migration Guidance

If migrating from the legacy emission path:

- No account resizing needed; the shim handles variable-length payloads by always passing an empty payload to the core bridge.
- For on-chain programs that only call the shim via CPI, consider emitting a dummy/empty message after migration to avoid edge cases with initial CPI depth (Solana limits the depth of cross-program calls).
- You still pay the Wormhole fee via `fee_collector` (parallelization limits apply).

## Guardian Behavior

Guardians are configured to:

- Watch for instructions to the emission shim’s program address.
- Extract the message data, emitter, sequence, and nonce from instruction data and the CPI event, not from an on-chain message.
- Ignore the empty account that the core bridge might write (since the payload is empty), preventing duplicate VAAs.

All 19 Guardians are configured to observe shim emissions on mainnet. As with all Wormhole messages, at least 13 of 19 Guardians must attest for a VAA to be produced and the shim emissions to be processed by the network.

## Limitations and Security Considerations 

- **Rent**: No persistent account rent is paid for every emission; the cost is now dominated by compute and the emission fee.
- **Logs**: Since all observability is log-based, re-observation is only possible while Solana transaction history is available.
- **Parallelization**: Still limited by the `fee_collector` account being mutable.
- **CPI Depth**: The first shim call for an emitter adds one extra stack depth. This is only relevant if you are near the Solana CPI limit (4).

## Conclusion

By using the emission shim, you can dramatically reduce rent costs when emitting Wormhole messages from Solana, while ensuring compatibility with Guardian observation and core bridge sequencing.

For a complete, working reference, see the full example implementation in the Wormhole repo: [`post_message.rs`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/programs/wormhole-integrator-example/src/instructions/post_message.rs){target=\_blank}.