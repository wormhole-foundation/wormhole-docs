---
title: Executor vs Standard Relayer
description: TODO
categories: Relayers, Executor
---
<!--TODOs
[link](#){target=\_blank}
-->
# Executor vs Standard Relayer

This page explains the practical differences between the [Executor framework](#){target=\_blank} and the Legacy Standard Relayer, focusing on how quoting, payments, and message handling differ. It is intended for teams currently integrating with the Standard Relayer who are transitioning to the Executor-based flow. 

The table below summarizes the core differences at a high level before diving into each area in detail.

| Category          | Standard Relayer             | Executor                        |
| ----------------- | ---------------------------- | ------------------------------- |
| Quoting           | On-chain price query         | Off-chain signed quote          |
| Payment           | Paid on `sendPayloadToEvm`   | Paid on `requestExecution`      |
| VAA Verification  | Relayer handles verification | Your contract verifies via Core |
| Replay Protection | Built-in                     | You choose Sequence / Hash      |
| Delivery Behavior | Opinionated delivery engine  | Stateless request registry      |
| Refunds           | On-chain via relayer logic   | Off-chain via provider policy   |

## Quoting, Payment, and Refunds 

Both models rely on a quote to determine execution cost, but they differ in how the quote is obtained and how payment and refunds are handled.

**Standard Relayer**

- **Quoting**: On-chain via `IDeliveryProvider.quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)`, which returns `(nativePriceQuote, refundPerGasUnused)`.
- **Payment**: Supplied to `sendPayloadToEvm` alongside `nativePriceQuote`.
- **Refunds**: Managed on-chain by the relayer contract through its refund/value-forwarding logic and surfaced via events and explicit error types.

**Executor**

- **Quoting**: Off-chain via a signed quote returned by a [Quoter](#){target=\_blank} operated by a Relay Provider. The quote encodes the relay instructions and delivery terms.
- **Request**: The application calls `Executor.requestExecution(...)` (or the SDK helper `_publishAndRelay`), passing the signed quote and relay instructions.
- **Payment**: The payment is transferred to the provider’s designated `payee` when the request is registered. The Executor contract is stateless and performs minimal checks (chain match, expiry).
- **Refunds**: Determined entirely by the provider’s off-chain policy. The Executor contract does not handle refund mechanics, gas accounting, or delivery logic.

## VAA Verification

The two systems differ in where VAA verification occurs and how the message reaches your application.

**Standard Relayer**  

The Relayer contract (together with Core) fetches and verifies the VAA before delivery. Applications implement `receiveWormholeMessages` and typically only validate the expected sender, source chain, and their own application-level invariants.

**Executor**  

Your contract verifies the VAA directly. Using the SDK base, it calls Core’s `parseAndVerifyVM`, applies replay protection, and then dispatches to `_executeVaa` with the payload and VAA metadata. Verification becomes explicit in the application’s execution stack, while the on-chain Executor contract remains minimal.

## Replay Protection and Finality

Replay protection works very differently between the two models, especially depending on the VAA’s consistency level.

**Standard Relayer**

The Standard Relayer enforces an “execute only once” guarantee at the delivery layer. Applications do not implement custom replay protection — the relayer ensures each request is executed exactly once.

**Executor**

Executor integrations must implement their own replay-protection scheme. Two options are available:

- **Sequence-based**: Recommended for finalized VAAs. Tracks `(emitterChain, emitterAddress, sequence)` and is the lowest-cost approach.
- **Hash-based**: Works for all consistency levels, including instant. Tracks the VAA hash to prevent replays.

The [Hello Executor demo](#){target=\_blank} includes examples of both approaches and explains how they map to consistency levels (e.g., `200` for finalized, `1` for instant). Use `SequenceReplayProtectionLib` for finalized messages or `HashReplayProtectionLib` for non-finalized flows.

## Delivery Behavior

The two models differ in how delivery is handled, what is enforced on-chain, and what guarantees are provided by the infrastructure versus the provider.

**Standard Relayer**

The Standard Relayer provides a managed delivery flow with on-chain pricing, refund logic, and detailed error handling. It offers:

- Delivery to the target contract with gas limit, receiver value, refund mechanics, and delivery status events.
- A dedicated `DeliveryProvider` contract for on-chain pricing and supported chains.
- A broad error surface for misquotes, overrides, and budget violations.

See the [Relayer reference](#){target=\_blank} for contract structure, events, and error definitions.

**Executor**
<!-- rewrite intro shorter  -->
The Executor contract is intentionally minimal. It registers execution requests and forwards payment to the provider, leaving all delivery semantics to the off-chain provider. It offers:

- A stateless executor contract that accepts requests, transfers payment to the provider’s designated payee, and emits request events.
- Minimal validation (chain match, expiry), with no price enforcement on-chain, no gas accounting, and no message inspection.
- An open provider marketplace, where any provider can fulfill the request by submitting the VAA.

See the [Executor overview](#){target=\_blank} and framework pages for a detailed breakdown of actors, flows, and contract behavior.


## Migration Notes
<!-- intro -->

1. **Sending**
    - Replace `quoteEVMDeliveryPrice` + `sendPayloadToEvm` with **(a)** `Core.publishMessage` and **(b)** `Executor.requestExecution` (or `_publishAndRelay` from the SDK base).
    - Fetch a **signed quote** off‑chain from your chosen provider.
2. **Receiving**
    - Replace `IWormholeReceiver.receiveWormholeMessages` with the **Executor base** pattern: implement `_executeVaa`, `_replayProtect`, and `_getPeer` if using the SDK or `executeVAA` if doing a standalone implementation.
3. **Access control & addressing**
    - Migrate “registered senders” to a **`peers` registry** keyed by Wormhole chain ID → universal `bytes32` address (SDK helpers available).
4. **Finality & replay protection**
    - If you previously relied on delivery semantics for replay safety, choose **Sequence** (finalized only) or **Hash-based** (any consistency) libraries and wire `_replayProtect`. Align this with your chosen **consistency level**.
5. **Fees & refunds**
    - On the Executor path, **refunds and retries** are provider‑policy. Use the provider’s API / signed quote data for observability and SLAs.

## Testing and Examples
<!-- intro -->
The **Hello Executor** repo includes:

- Role‑based `HelloWormhole` with send/receive in one contract.
- **Replay protection** examples (sequence/hash).
- **Fork tests** on Sepolia & Base Sepolia and CI.
    
    Use this as your starting point and adapt to separate send/receive contracts if desired (the SDK offers `ExecutorSend`, `ExecutorReceive`, and `ExecutorSendReceive`).
    
## References
<!-- intro 
sneak these links into the content -->

Standard Relayer reference links

- **Relayer Guide** (interfaces, send/receive methods, delivery guarantees & statuses). [Wormhole](https://wormhole.com/docs/products/messaging/guides/wormhole-relayers/)
- **Relayer Contract Reference** (structure, events, errors like `ReentrantDelivery`, `ExceedsMaximumBudget`, etc.). [Wormhole](https://wormhole.com/docs/products/messaging/reference/relayer-contract/)
- **Interact with Core Contracts** (using Core directly: `publishMessage`, `parseAndVerifyVM`, `messageFee`). [Wormhole](https://wormhole.com/docs/products/messaging/reference/core-contract-evm/)


Executor reference links

- **Executor Overview** (components, request/result flow, security). [Wormhole](https://wormhole.com/docs/products/messaging/concepts/executor-overview/)
- **Executor Framework** (roles, `requestExecution` behavior, stateless design). [Wormhole](https://wormhole.com/docs/products/messaging/concepts/executor-framework/)
- **Executor addresses** (per‑chain deployed addresses). [Wormhole](https://wormhole.com/docs/products/reference/executor-addresses/?utm_source=chatgpt.com)


SDK notes (main vs v0.1)

- **v0.1** focused on Relayer patterns and shipped a `Base` with helpers (`onlyWormholeRelayer`, registered senders). [GitHub](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/v0.1.0)
- **Current (main)** expands the SDK to general integrations:
    - **Core** interfaces/libraries (e.g., `ICoreBridge`, `messageFee`, `publishMessage`, verification helpers).
    - **Executor** integration bases (`ExecutorSend`, `ExecutorReceive`, `ExecutorSendReceive`).
    - **ReplayProtection** libraries and utility modules (universal addresses, parsing helpers), as used in the Hello Executor demo. [GitHub+1](https://github.com/wormhole-foundation/demo-hello-executor)
