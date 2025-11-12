---
title: Executor vs Standard Relayer
description: TODO
categories: Relayers, Executor
---
<!--TODOs
links [link](#){target=\_blank}
-->
# Executor vs Standard Relayer

This guide explains the practical differences between the [Executor framework](#){target=\_blank} and the legacy Standard Relayer, focusing on how quoting, payments, and message handling differ. It is intended for teams currently integrating with the Standard Relayer who are transitioning to the Executor-based flow. It also covers migration steps and how to integrate off-chain quoting and relay APIs using the [demo-hello-executor](#){target=\_blank} example.

## Quoting, payment, and refunds

Standard Relayer

- **Quote on‑chain** via `IDeliveryProvider.quoteEVMDeliveryPrice(targetChain, receiverValue, gasLimit)`; it returns `(nativePriceQuote, refundPerGasUnused)`.
- **Pay** by attaching `nativePriceQuote` to `sendPayloadToEvm`.
- **Refunds/value forwarding/overrides** are handled by the Relayer contract and surfaced via events and explicit error types.

Executor

- **Quote off‑chain**: obtain a **signed quote** from a **Quoter** operated by a Relay Provider.
- **Request** by calling `Executor.requestExecution(...)` (directly or through the SDK helper `_publishAndRelay`), passing the **signed quote** and your relay instructions.
- **Payment** is transferred to the provider’s designated `payee` upon request registration; the Executor contract is **stateless** and performs minimal checks (chains match, not expired). Provider policies (delivery window, retries, refunds) are enforced **off‑chain**.

## VAA verification: who does what?

- **Standard Relayer:** You don’t directly verify the VAA. The **Relayer contract** (plus Core) handles delivery; you implement `receiveWormholeMessages` and typically only validate sender/chain and your own app invariants.
- **Executor:** **Your contract** (via the SDK base) calls **Core**’s `parseAndVerifyVM` and then dispatches to `_executeVaa` with the payload and VAA metadata. This makes verification explicit in your app’s stack and keeps the on‑chain “Executor” generic/minimal.

## Replay protection & finality

With the Executor integration you **choose** a replay protection scheme:

- **Sequence-based** (recommended for *finalized* VAAs): safe and cheap—track `(emitterChain, emitterAddress, sequence)`.
- **Hash-based** (works for all consistency levels, including “instant”): track the VAA hash to prevent replays.

The Hello Executor demo shows both options and ties the choice to **consistency levels** (e.g., `200 = finalized`, `1 = instant`). Use `SequenceReplayProtectionLib` for finalized messages or `HashReplayProtectionLib` for others.

## Behavior surface area differences

### What the Relayer contract provides out of the box

- **Delivery** to your target with **gas limit**, **receiver value**, refund mechanics, and **delivery status events**.
- A **dedicated DeliveryProvider** contract for on‑chain pricing and supported chains.
- A large error surface for misquotes/overrides and budget violations.
    
    See the Relayer reference for the contract structure, events and errors. 
    

### What the Executor provides out of the box

- **Stateless** executor contract that: accepts requests, transfers payment to the **payee** in the signed quote, and **emits events**.
- Minimal validation (chain match, expiry), **no price enforcement** on-chain, and no message inspection.
- **Open marketplace** of providers: anyone can fulfill a request using the VAA.
    
    See the Executor overview/framework for actors, flows, and contract behavior.
    

## Migration notes (Relayer → Executor)

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

## Testing & example scaffolding

The **Hello Executor** repo includes:

- Role‑based `HelloWormhole` with send/receive in one contract.
- **Replay protection** examples (sequence/hash).
- **Fork tests** on Sepolia & Base Sepolia and CI.
    
    Use this as your starting point and adapt to separate send/receive contracts if desired (the SDK offers `ExecutorSend`, `ExecutorReceive`, and `ExecutorSendReceive`).
    

## Appendix A — Standard Relayer reference links

- **Relayer Guide** (interfaces, send/receive methods, delivery guarantees & statuses). [Wormhole](https://wormhole.com/docs/products/messaging/guides/wormhole-relayers/)
- **Relayer Contract Reference** (structure, events, errors like `ReentrantDelivery`, `ExceedsMaximumBudget`, etc.). [Wormhole](https://wormhole.com/docs/products/messaging/reference/relayer-contract/)
- **Interact with Core Contracts** (using Core directly: `publishMessage`, `parseAndVerifyVM`, `messageFee`). [Wormhole](https://wormhole.com/docs/products/messaging/reference/core-contract-evm/)

## Appendix B — Executor reference links

- **Executor Overview** (components, request/result flow, security). [Wormhole](https://wormhole.com/docs/products/messaging/concepts/executor-overview/)
- **Executor Framework** (roles, `requestExecution` behavior, stateless design). [Wormhole](https://wormhole.com/docs/products/messaging/concepts/executor-framework/)
- **Executor addresses** (per‑chain deployed addresses). [Wormhole](https://wormhole.com/docs/products/reference/executor-addresses/?utm_source=chatgpt.com)

## Appendix C — SDK notes (main vs v0.1)

- **v0.1** focused on Relayer patterns and shipped a `Base` with helpers (`onlyWormholeRelayer`, registered senders). [GitHub](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/v0.1.0)
- **Current (main)** expands the SDK to general integrations:
    - **Core** interfaces/libraries (e.g., `ICoreBridge`, `messageFee`, `publishMessage`, verification helpers).
    - **Executor** integration bases (`ExecutorSend`, `ExecutorReceive`, `ExecutorSendReceive`).
    - **ReplayProtection** libraries and utility modules (universal addresses, parsing helpers), as used in the Hello Executor demo. [GitHub+1](https://github.com/wormhole-foundation/demo-hello-executor)
