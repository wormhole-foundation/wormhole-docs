---
title: Solana Shims
description: Understand how Wormhole uses shim programs on Solana to optimize message emission and VAA verification without modifying the Core Bridge.
categories: Basics
---

# Solana Shims

Wormhole shims on Solana are lightweight programs that enable cheaper and more flexible message emission and verification while preserving Guardian observation guarantees. They are designed for integrators who want to reduce Solana rent costs without sacrificing core protocol security or Guardian compatibility.

## The Core Bridge Account Problem

When you emit a message on Solana using the legacy [Wormhole Core Bridge](/docs/protocol/infrastructure/core-contracts/){target=\_blank}, it creates a new on-chain account — a Program Derived Address (PDA) — for every message. Each of these accounts must hold enough SOL to be rent-exempt, locking up lamports that cannot be reclaimed since Core Bridge does not allow these accounts to be closed. Over time, this results in two big problems:

- **Permanent On-Chain State**: Every message leaves behind a permanent account, increasing long-term storage needs on Solana.
- **Lost Lamports to Rent**: Integrators lose SOL for every message, as the lamports needed for rent exemption remain locked in the message accounts indefinitely.

Solana’s rent-exemption model is designed to ensure account persistence, but this is not a limitation of the protocol itself. The fundamental constraint is the legacy `post_message` function, which always creates a new, non-reclaimable account per emission. Even after a message is consumed, these accounts cannot be closed or reused, resulting in unrecoverable rent costs.

Although the `post_message_unreliable` function allows for account reuse, it has strict limitations: once a message is overwritten, it cannot be recovered, making it non-re-observable if missed by Guardians. It also requires that the new payload size matches the existing account size, as the feature predates Solana account resizing.

Verification adds even more cost: the `post_vaa` instruction creates additional temporary accounts for signatures and VAA data, further increasing rent costs and on-chain state. These accounts aren’t automatically cleaned up, so the cost and on-chain state only grow with usage.

This design ensures reliability, as message data is always available on-chain for Guardians to observe. However, it comes at a cost in both storage and lost SOL. To address these issues, Wormhole introduces Solana shims, which fundamentally change the cost model for emission and verification.

## What Are the Solana Shims?

To address the limitations of the Core Bridge, Wormhole deploys two specialized Solana programs called shims:

- **[Post Message Shim (`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`)](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}**: Emits Wormhole messages efficiently, without creating new message accounts for each emission, reducing rent costs.
- **[Verify VAA Shim (`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`)](https://explorer.solana.com/address/EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at){target=\_blank}**: Verifies VAAs on-chain without leaving permanent accounts.

Both act as lightweight wrappers around the existing Core Bridge. No upgrade to the Core Bridge itself is required. However, for the Post Message Shim, the Guardian network made some operational changes so that messages emitted via the shim could still be observed reliably:

- Read message data directly from the shim instruction instead of the Core Bridge message account.
- Ignore the Core Bridge’s unreliable message account to prevent duplicate VAAs.
- Allow re-observation of messages by transaction ID.
- Guardian RPCs retain transaction history longer, so shim-emitted messages remain observable.

### Emission and Verification

Wormhole shims on Solana refer to two different approaches depending on whether you are emitting messages or verifying VAAs:

**Emission Shim**

A Solana program deployed at [EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}. It wraps the Core Bridge’s `post_message_unreliable` instruction and emits message data as a log event instead of storing it in a rent-exempt message account. This removes rent costs and avoids long-term state bloat. Guardians are configured to observe this canonical shim, allowing integrators to send messages through it without additional setup.

- **How it works**: Call the [`post_message`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_post_message_shim.json){target=_blank} instruction on the Post Message Shim program. This emits the Wormhole message as a log event instead of creating a rent-exempt message account.

**Verification Shim**

A Solana program deployed at [EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at](https://explorer.solana.com/address/EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at){target=\_blank}. It provides a [`verify_hash`](https://github.com/wormhole-foundation/wormhole/blob/4656bd4a72cb99f4e94a771a802856c9451af844/svm/wormhole-core-shims/programs/verify-vaa/src/lib.rs#L195){target=\_blank} instruction that checks Guardian signatures against the active Guardian set for a VAA's digest. It ensures quorum, validates each signature in order, recovers the public keys, and matches them against the Guardian set. If all checks pass, the VAA is verified without creating persistent rent-exempt accounts. This replaces using the Core Bridge’s `verify_signatures` and `post_vaa`. Integrators can call the canonical shim, but existing programs may need to be modified to adopt this approach.

- **How it works**: First, call [`post_signatures`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_verify_vaa_shim.json#L43){target=_blank} on the Verification Shim to store Guardian signatures in a temporary account. Then, from within your program, call [`verify_hash`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/programs/verify-vaa/README.md#verify-hash-technical-details){target=_blank} to check the VAA’s digest against Guardian signatures. In the same transaction, close the signatures account with [`close_signatures`](https://github.com/wormhole-foundation/wormhole/blob/main/svm/wormhole-core-shims/anchor/idls/wormhole_verify_vaa_shim.json#L11){target=\_blank} to reclaim rent. 

## Key Solana Concepts

To understand how shims work, it helps to know a few Solana basics:

- **PDA (Program Derived Address)**: 
    - Program‑owned accounts that provide a mechanism to deterministically create an address using a combination of optional "seeds" (predefined inputs) and a specific program ID.
    - The Emission Shim avoids generating a new keypair for each message by using a PDA per emitter (owned by the shim) and emitting data via CPI events/logs instead of creating a rent-exempt account per message. The Verification Shim similarly avoids persistent storage by using a temporary signatures account that is closed in the same flow to reclaim lamports.
- **CPI (Cross-Program Invocation)**: Solana’s version of one smart contract calling another. Used by shims to invoke logic in the Core Bridge or other programs. 
- **[Anchor CPI Event](https://www.anchor-lang.com/docs/basics/cpi){target=\_blank}**: 
    - A structured log emitted during a CPI call, observable in transaction logs, used by the emission shim to report sequence number, timestamp, and payload.
    - The emission shim emits these events so Guardians can observe messages directly from transaction logs (rather than accounts).

## Guardian Observation Methods

|                      | Legacy Model           | Shim Model               |
|----------------------|------------------------|--------------------------|
| Message Storage      | On-chain account       | Transaction logs (CPI)   |
| Data Permanence      | Permanent              | Until RPC history pruned |
| Guardian Observation | Reads account data     | Reads transaction logs   |
| Cost                 | High (rent + compute)  | Low (compute only)       |
| Sequence Handling    | Account-based          | Account-based            |
| Closing Accounts     | Not possible           | Not needed               |

With shims, the message’s existence depends on the transaction log, so cost drops, but indefinite on-chain visibility is no longer guaranteed. Sequence tracking remains the same as the legacy model, so integrators can switch between the two without disrupting sequence numbers.

## Transaction Costs

Solana charges for two main resources when processing transactions: compute units (for execution) and rent (for storing data on-chain). Understanding how each contributes to the overall cost is key to seeing why shims are so much cheaper.

- **Compute Units (CU)**: Solana measures CPU resource usage per transaction as “compute units”. Each transaction has a CU limit (usually ~200,000, which can be increased for a fee).
- **Rent**: One-time cost in SOL to keep an account on-chain. Most of the Core Bridge’s cost comes from rent, not CUs.

!!!note "Why is the shim cheaper?"
    Even though the shim uses slightly more compute (extra logic for logging), it avoids account creation entirely. Since rent is the most significant cost, the total emission cost drops.

## Safety, Tradeoffs & Limitations

Shims preserve the security guarantees of the Core Bridge but change how message data is stored. Instead of writing messages and verification data to permanent on-chain accounts, shims emit this information as transaction logs. Guardians must observe these logs before the node’s transaction history is pruned.

This trade-off is consistent with all other Wormhole chain implementations, none of which store messages permanently on-chain. For most use cases, logs — accessible through RPC providers or blockchain explorers — are sufficient for auditability. However, if guaranteed on-chain permanence is a strict requirement, the legacy Core Bridge approach remains the safer choice, despite higher rent costs and ongoing state growth.

## Next Steps

- [Efficient Emission on Solana](/docs/products/messaging/guides/solana-shims/sol-emission/){target=\_blank}
- [Efficient Verification on Solana](/docs/products/messaging/guides/solana-shims/sol-verification/){target=\_blank}