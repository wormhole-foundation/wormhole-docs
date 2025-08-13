---
title: Solana Shims
description: Understand how Wormhole uses shim programs on Solana to optimize message emission and VAA verification without modifying the Core Bridge.
categories: Basics
---

# Solana Shims

Wormhole shims on Solana are lightweight programs that enable cheaper and more flexible message emission and verification while preserving Guardian observation guarantees. They are designed for integrators who want to reduce Solana rent costs without sacrificing core protocol security or Guardian compatibility.

This page explains what shims are, why they were created, how they work, and what this means for integrators.

## The Core Bridge Account Problem

When you emit a message on Solana using the legacy [Wormhole Core Bridge](/docs/protocol/infrastructure/core-contracts/){target=\_blank}, it creates a new on-chain account — a Program Derived Address (PDA) — for every message. Each of these accounts must hold enough SOL to be rent-exempt, locking up lamports that cannot be reclaimed since Core Bridge does not allow these accounts to be closed. Over time, this results in two big problems:

- **Permanent On-Chain State**: Every message leaves behind a permanent account, increasing long-term storage needs on Solana.
- **Lost Lamports to Rent**: Integrators lose SOL for every message, as the lamports needed for rent exemption remain locked in the message accounts indefinitely.

Solana’s rent-exemption model is designed to ensure account persistence, but this is not a limitation of the protocol itself. The real constraint is the legacy `post_message` function, which always creates a new, non-reclaimable account per emission. Even after a message is consumed, these accounts cannot be closed or reused, resulting in unrecoverable rent costs.

Although the `post_message_unreliable` function allows for account reuse, it has strict limitations: once a message is overwritten, there is no way to recover it, making it non-re-observable if missed by Guardians. It also requires that the new payload size matches the existing account size, as the feature predates Solana account resizing.

Verification adds even more cost: the `post_vaa` instruction creates creates additional temporary accounts for signatures and VAA data, further increasing rent costs and on-chain state. These accounts aren’t automatically cleaned up, so the cost and on-chain state only grow with usage.

This design does ensure reliability, as messages data is always available on-chain for Guardians to observe. However, it comes at a cost in both storage and lost SOL. To address these issues, Wormhole introduces Solana shims, which fundamentally change the cost model for emission and verification.

## What Are the Solana Shim Contracts?

To address the limitations of the Core Bridge, Wormhole deploys two specialized Solana programs called shims:

- **[Post Message Shim (`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`)](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}**: Emits Wormhole messages efficiently, without creating new message accounts for each emission, reducing rent costs.
- **[Verify VAA Shim (`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`)](https://explorer.solana.com/address/EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at){target=\_blank}**: Verifies VAAs on-chain without leaving permanent accounts.

Both shims act as lightweight wrappers around the existing Core Bridge. No upgrade to the Core Bridge itself is required. However, for the Post Message Shim, the Guardian network made some operational changes so that messages emitted via the shim could still be observed reliably:

- Read message data directly from the shim instruction instead of the Core Bridge message account.
- Ignore the Core Bridge’s unreliable message account to prevent duplicate VAAs.
- Allow re-observation of messages by transaction ID.
- Guardian RPCs retain transaction history longer so shim-emitted messages remain observable.

### Emission and Verification

Wormhole shims on Solana refer to two different approaches depending on whether you are emitting messages or verifying VAAs:

- **Emission Shim**: The emission shim is a Solana program deployed at [EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX](https://explorer.solana.com/address/EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX){target=\_blank}. It wraps the Core Bridge’s `post_message_unreliable` instruction and emits message data as a log event instead of storing it in a rent-exempt message account. This reduces rent costs and prevents long-term state bloat. Guardians are configured to observe messages from this canonical shim, so integrators can simply send messages through it without additional setup.

- **Verification Shim**: The verification shim is a Solana program deployed at [EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at](https://explorer.solana.com/address/EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at){target=\_blank}. It provides a [`verify_hash`](https://github.com/wormhole-foundation/wormhole/blob/4656bd4a72cb99f4e94a771a802856c9451af844/svm/wormhole-core-shims/programs/verify-vaa/src/lib.rs#L195){target=\_blank} instruction that checks the provided Guardian signatures against the active Guardian set for the digest of the VAA. It ensures quorum, validates each signature in order, recovers the public keys, and matches them against the Guardian set. If all checks pass, the VAA is considered verified without creating rent-exempt accounts that persist on-chain. This replaces using the Core Bridge’s `verify_signatures` and `post_vaa` directly. No new deployment is required—integrators can call the canonical shim—but existing programs may need changes to adopt this approach, as the logic is handled entirely within the shim program rather than the Core Bridge.

## Key Solana Concepts

To understand how shims work, it helps to know a few Solana basics:

- **PDA (Program Derived Address)**: 
    - Deterministic, program-owned accounts created without private keys.
    - In the legacy model, each message uses a unique PDA (derived from emitter and sequence number) to store data.
    - Shim difference: Emission shim skips PDA creation and instead puts message data in transaction logs, so nothing is left behind on-chain.
- **CPI (Cross-Program Invocation)**: Solana’s version of one smart contract calling another. Used by shims to invoke logic in the Core Bridge or other programs. 
- **[Anchor CPI Event](https://www.anchor-lang.com/docs/basics/cpi){target=\_blank}**: 
    - A structured log emitted during a CPI call, observable in transaction logs, used by the emission shim to report sequence number, timestamp, and payload.
    - The emission shim emits these events so Guardians can observe messages directly from transaction logs (rather than accounts).

## Guardian Observation Methods

|                      | Legacy Model                   | Shim Model                            |
|----------------------|--------------------------------|---------------------------------------|
| Message Storage      | On-chain message account (PDA) | Transaction logs (CPI event)          |
| Data Permanence      | On-chain forever               | In logs (until RPC history is pruned) |
| Guardian Observation | Reads account data             | Reads transaction logs                |
| Cost                 | High (rent + compute)          | Low (compute only, no rent)           |
| Sequence Handling    | Account-based                  | Event-based                           |
| Closing Accounts     | Not possible                   | Not needed                            |

With shims, the message’s existence depends on the transaction log, so cost drops, but indefinite on-chain visibility is no longer guaranteed.

## Transaction Costs

Solana charges for two main resources when processing transactions: compute units (for execution) and rent (for storing data on-chain). Understanding how each contributes to overall cost is key to seeing why shims are so much cheaper.

- **Compute Units (CU)**: Solana measures CPU resource usage per transaction as “compute units”. Each transaction has a CU limit (usually ~200,000, can be increased for a fee).
- **Rent**: One-time cost in SOL to keep an account on-chain. Most of the Core Bridge’s cost comes from rent, not CUs.

!!!note "Why is the shim cheaper?"
    Even though the shim uses slightly more compute (extra logic for logging), it avoids account creation entirely. Since rent is the most significant cost, the total emission cost drops.

## Safety, Tradeoffs & Limitations

Shims keep all security guarantees of the Core Bridge, except that messages and verification data are not permanently stored on-chain. If a Guardian misses the transaction log (for example, if their node history is too short), re-observation is only possible as long as the transaction history is available.

While the Solana shims dramatically reduce costs and prevent long-term account bloat, they do so at the expense of message permanence. With shims, messages and verification data are no longer stored in permanent on-chain accounts; instead, they exist only in transaction logs for a limited period, meaning Guardians must observe these logs promptly or risk missing the message once node history is pruned. This means Guardians must observe these logs promptly, or the opportunity to process the message may be lost once the node’s transaction history is pruned. As a result, shims are ideal for integrators who prioritize cost savings and efficiency over indefinite on-chain availability. However, for use cases that require permanent on-chain message history and auditability, the legacy Core Bridge approach remains the safer choice, despite its higher rent costs and storage requirements.

## Next Steps

- [Efficient Emission on Solana (Shim)](/docs/products/messaging/guides/solana-shims/sol-emission/){target=\_blank}
- [Efficient Verification on Solana (Shim)](/docs/products/messaging/guides/solana-shims/sol-verification/){target=\_blank}
- [Solana Shim Deployment Guide](/docs/products/messaging/guides/solana-shims/shim-deployment/){target=\_blank}

