---
title: Solana Shims
description: Understand how Wormhole uses shim programs on Solana to optimize message emission and VAA verification without modifying the Core Bridge.
categories: Basics
---

# Solana Shims

Wormhole shims on Solana are lightweight programs that enable cheaper and more flexible message emission and verification while preserving Guardian observation guarantees. They are designed for integrators who want to reduce Solana rent costs without sacrificing core protocol security or Guardian compatibility.

This page explains what shims are, why they were created, how they work, and what this means for integrators.

## The Core Bridge Account Problem

When you emit a message on Solana using the legacy [Wormhole Core Bridge](/docs/protocol/infrastructure/core-contracts/){target=\_blank}, it creates a new on-chain account—specifically, a PDA (Program Derived Address) account—for every message. These accounts must be rent-exempt, meaning SOL is locked up for each one and cannot be recovered, since Core Bridge does not allow these accounts to be closed. Over time, this results in two big problems:

- **Permanent On-Chain State**: Every message leaves behind a permanent account, increasing long-term storage needs on Solana.
- **Lost Lamports to Rent**: Integrators lose SOL for every message, with no way to recover it even after the message has served its purpose. 

Solana doesn’t use gas like EVM chains. Instead, programs must prepay “rent” in SOL for each account. These lamports can only be reclaimed if the account is closed, which isn’t possible for Core Bridge message accounts.

While `post_message_unreliable` allows for account reuse, it has strict limitations: overwritten messages are lost forever, and account reuse can cause sequence conflicts or duplicate VAAs. Guardians expect every message to have a unique emitter and sequence, so reusing accounts risks breaking core protocol guarantees.

Verification adds even more cost: the `post_vaa` instruction creates even more temporary accounts for signatures and VAA data—each adding further rent costs and storage overhead. These accounts aren’t automatically cleaned up, so the cost and on-chain state only grow with usage.

This design does ensure reliability—messages and verification data are always available on-chain for Guardians to observe. However, it comes at a cost in both storage and lost SOL. To address these issues, Wormhole introduces Solana shims, which fundamentally change the cost model for emission and verification:

## What Are the Solana Shim Contracts?

To address the limitations of the Core Bridge, Wormhole deploys two specialized Solana programs called shims:

- **Post Message Shim (`EtZMZM22ViKMo4r5y4Anovs3wKQ2owUmDpjygnMMcdEX`)**: Emits Wormhole messages efficiently, without creating new message accounts for each emission, reducing rent costs.
- **Verify VAA Shim (`EFaNWErqAtVWufdNb7yofSHHfWFos843DFpu4JBw24at`)**: Verifies VAAs on-chain without leaving permanent accounts.

Both shims act as lightweight wrappers around the existing Core Bridge. No upgrade to the main contract is required; Guardian infrastructure continues to work exactly as before.

## Key Solana Concepts

To understand how shims work, it helps to know a few Solana basics:

- **PDA (Program Derived Address)**: 
    - Deterministic, program-owned accounts created without private keys.
    - In the legacy model, each message uses a unique PDA (derived from emitter and sequence number) to store data.
    - Shim difference: Emission shim skips PDA creation and instead puts message data in transaction logs, so nothing is left behind on-chain.
- **CPI (Cross-Program Invocation)**: Solana’s version of one smart contract calling another. Used by shims to invoke logic in the Core Bridge or other programs. 
- **[Anchor CPI Event](https://www.anchor-lang.com/docs){target=\_blank}**: 
    - A structured log emitted during a CPI call, observable in transaction logs, used by the emission shim to report sequence number, timestamp, and payload.
    - The emission shim emits these events so Guardians can observe messages directly from transaction logs (rather than accounts).

## Guardian Observation Methods

|                      | Legacy Model.                  | Shim Model                            |
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

- **Compute Units (CU)**: Solana measures CPU resource usage per transaction as “compute units.” Each transaction has a CU limit (usually ~200,000, can be increased for a fee).
- **Rent**: One-time cost in SOL to keep an account on-chain. Most of the Core Bridge’s cost comes from rent, not CUs.

!!!note "Why is the shim cheaper?"
    Even though the shim uses slightly more compute (extra logic for logging), it avoids account creation entirely. Since rent is the most significant cost, the total emission cost drops.

## Safety, Tradeoffs & Limitations

Shims keep all security guarantees of the Core Bridge, except that messages and verification data are not permanently stored on-chain. If a Guardian misses the transaction log (for example, if their node history is too short), re-observation is only possible as long as the transaction history is available.

While the Solana shims dramatically reduce costs and prevent long-term account bloat, but at the cost of message permanence. With shims, messages and verification data are no longer stored in permanent on-chain accounts; instead, they exist only in transaction logs for a limited period. This means Guardians must observe these logs promptly, or the opportunity to process the message may be lost once the node’s transaction history is pruned. As a result, shims are ideal for integrators who prioritize cost savings and efficiency over indefinite on-chain availability. However, for use cases that require permanent on-chain message history and auditability, the legacy Core Bridge approach remains the safer choice, despite its higher rent costs and storage requirements.

## Next Steps

- [Efficient Emission on Solana (Shim)](/docs/products/messaging/guides/solana-shims/sol-emission/){target=\_blank}
- [Efficient Verification on Solana (Shim)](/docs/products/messaging/guides/solana-shims/sol-verification/){target=\_blank}
- [Solana Shim Deployment Guide](/docs/products/messaging/guides/solana-shims/shim-deployment/){target=\_blank}

