---
title: Standard Relayer to Executor Migration
description: Overview of key differences between the Executor framework and the Standard Relayer, plus guidance for migrating existing integrations.
categories: Relayers, Executor
url: https://wormhole.com/docs/protocol/infrastructure/relayers/executor-vs-sr/
---

# Standard Relayer to Executor Migration

This page explains the practical differences between the [Executor framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank} and the Legacy Standard Relayer, focusing on how quoting, payments, and message handling differ. It is intended for teams currently integrating with the Standard Relayer who are transitioning to the Executor-based flow. 

The table below summarizes the core differences at a high level before diving into each area in detail.

| Category          | Standard Relayer             | Executor                        |
| ----------------- | ---------------------------- | ------------------------------- |
| Quoting           | On-chain price query         | Off-chain signed quote          |
| Payment           | Paid on `sendPayloadToEvm`   | Paid on [`requestExecution`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L22){target=\_blank} |
| VAA Verification  | Relayer handles verification | Your contract verifies using the Core Contract |
| Replay Protection | Built-in                     | You choose sequence / hash      |
| Delivery Behavior | Opinionated delivery engine  | Stateless request registry      |
| Refunds           | On-chain via relayer logic   | Off-chain via provider policy   |

## Quoting, Payment, and Refunds 

Both models rely on a quote to determine execution cost, but they differ in how the quote is obtained and how payment and refunds are handled.

**Standard Relayer**

- **Quoting**: On-chain via `IDeliveryProvider.quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)`, which returns `(nativePriceQuote, refundPerGasUnused)`.
- **Payment**: Supplied to `sendPayloadToEvm` alongside `nativePriceQuote`.
- **Refunds**: Managed on-chain by the relayer contract through its refund/value-forwarding logic and surfaced via events and explicit error types.

**Executor**

- **Quoting**: Off-chain via a signed quote returned by a [Quoter](/docs/protocol/infrastructure/relayers/executor-framework/#relay-provider){target=\_blank} operated by a Relay Provider. The quote encodes the relay instructions and delivery terms.
- **Request**: The application calls `Executor.requestExecution(...)` (or the SDK helper `_publishAndRelay`), passing the signed quote and relay instructions.
- **Payment**: The payment is transferred to the provider’s designated `payee` when the request is registered. The Executor contract is stateless and performs minimal checks (chain match, expiry).
- **Refunds**: Determined entirely by the provider’s off-chain policy. The Executor contract does not handle refund mechanics, gas accounting, or delivery logic.

## VAA Verification

The two systems differ in where VAA verification occurs and how the message reaches your application.

**Standard Relayer**  

The Relayer contract (together with the [Core Contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank}) fetches and verifies the VAA before delivery. Your contract implements `receiveWormholeMessages` and typically only validates the expected sender, source chain, and its own application-level invariants.

**Executor**  

Your contract verifies the VAA directly. Using the SDK base, it calls Core’s `parseAndVerifyVM`, applies replay protection, and then dispatches to `_executeVaa` with the payload and VAA metadata. Verification becomes explicit in your contract’s execution flow, while the on-chain Executor contract remains minimal.

## Replay Protection and Finality

Replay protection works very differently between the two models, especially depending on the VAA’s consistency level.

**Standard Relayer**

The Standard Relayer enforces an “execute only once” guarantee at the delivery layer. Applications do not implement custom replay protection — the relayer ensures each request is executed exactly once.

**Executor**

Executor integrations must implement their own replay-protection scheme. Two options are available:

- **Sequence-based**: Recommended for finalized VAAs. It tracks `(emitterChain, emitterAddress, sequence)` and is the lowest-cost approach, but cannot safely handle non-finalized (e.g., instant) consistency levels.
- **Hash-based**: Works for all consistency levels, including instant. It uses the VAA hash to guarantee unique identification and prevent replays.

The [Hello Executor demo](https://github.com/wormhole-foundation/demo-hello-executor){target=\_blank} includes examples of both approaches and explains how they map to consistency levels (e.g., `200` for finalized, `1` for instant). Use `SequenceReplayProtectionLib` for finalized messages or `HashReplayProtectionLib` for non-finalized flows.

## Delivery Behavior

The two models differ in how delivery is handled, what is enforced on-chain, and what guarantees are provided by the infrastructure versus the provider.

**Standard Relayer**

The Standard Relayer provides a managed delivery flow with on-chain pricing, refund logic, and detailed error handling. It offers:

- Delivery to the target contract with gas limit, receiver value, refund mechanics, and delivery status events.
- A dedicated `DeliveryProvider` contract for on-chain pricing and supported chains.
- A broad error surface for misquotes, overrides, and budget violations.

**Executor**

The Executor contract is intentionally minimal. It registers execution requests and forwards payment to the provider, leaving all delivery semantics to the off-chain provider. It offers:

- A stateless executor contract that accepts requests, transfers payment to the provider’s designated payee, and emits request events.
- Minimal validation (chain match, expiry), with no price enforcement on-chain, no gas accounting, and no message inspection.
- An open provider marketplace, where any provider can fulfill the request by submitting the VAA.

## Migration Notes

Moving from the Standard Relayer to the Executor model involves changes to how messages are published, how delivery requests are issued, and how peers and replay protection are handled. The steps below outline the core updates required in a typical integration.

- **Sending**: Replace `quoteEVMDeliveryPrice` + `sendPayloadToEvm` with two calls: `Core.publishMessage` and `Executor.requestExecution` (or the SDK helper `_publishAndRelay`). Fetch a signed quote from your chosen provider off-chain.
- **Receiving**: Replace `IWormholeReceiver.receiveWormholeMessages` with the Executor base pattern: implement `_executeVaa`, `_replayProtect`, and `_getPeer` when using the SDK, or `executeVAA` if implementing the flow manually.
- **Access control and addressing**: Migrate registered senders to a `peers` registry keyed by Wormhole chain ID (universal `bytes32` address). SDK helpers are available for converting and validating peer addresses. 
- **Finality and replay protection**: If delivery semantics were previously used for replay safety, choose either sequence-based (finalized consistency only), or hash-based replay protection (any consistency level) and wire `_replayProtect` according to your chosen consistency level.
- **Fees and refunds**: Refunds, retries, and SLAs are provider policy in the Executor model. Use the provider’s API and signed-quote metadata for observability and error handling.

## Next Steps

The resources below provide deeper technical detail and example implementations. 

- [**Executor framework**](/docs/protocol/infrastructure/relayers/executor-framework/#relay-provider){target=\_blank}: Overview of the Executor model, components, and request flow.
- [**Executor addresses**](/docs/products/messaging/reference/executor-addresses/){target=\_blank}: Chain-specific deployed addresses.
- [**Hello Executor example**](https://github.com/wormhole-foundation/demo-hello-executor){target=\_blank}: Minimal end-to-end Executor demo showing quoting, request calls, and replay protection.
