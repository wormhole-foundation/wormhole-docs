---
title: Executor Framework
description: TODO
categories: Basics
---

# Executor Framework

The [Executor framework](https://github.com/wormholelabs-xyz/example-messaging-executor/tree/main){target=\_blank} is a standardized, permissionless system for executing cross-chain messages. It combines a lightweight on-chain contract with off-chain services that quote, monitor, and perform execution. By minimizing on-chain logic and verification, the framework reduces cost and complexity while allowing independent providers to compete and fulfill requests across multiple chains.

The Executor framework separates responsibilities between three independent participants:

| Actor	            | Responsibility                                                      | 
|-------------------|---------------------------------------------------------------------| 
| Integrator        | Creates and submits execution requests using valid quotes.          | 
| Executor Contract | Publishes requests, transfers payment, and emits observable events. | 
| Relay Provider	| Monitors events, validates quotes, and performs message execution.  | 

This modular structure enables permissionless, verifiable, and cost-efficient message execution across multiple blockchains — without persistent on-chain state or protocol-specific relayers.

## Relay Provider

A Relay Provider is an off-chain participant that performs message execution between chains. Each provider must operate at least one Quoter service that issues signed quotes describing how and when an execution will be performed.

A quote specifies the source and destination chains, pricing, and an expiry time before which the Executor contract can accept the quote. Short expiry windows reduce the risk of stale quotes but must be long enough for users to submit transactions on the source chain. 

Relay Providers may operate multiple wallets, each capable of performing execution or receiving payment. They can choose whether payments are collected per-wallet or directed to a central [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank} defined by the Quoter.

Providers should provide a public API that allows clients to check the status of an execution request and should return details such as when the request was initiated, any additional gas payments made, and the transaction in which execution occurred. It should also report whether a refund was issued, along with the transaction details, or the reason why a refund was not applicable.

To improve transparency, each provider should define a Service-Level Agreement (SLA) describing:

- Supported execution types.
- Time limits for retrying execution attempts.
- Conditions and timing of refunds.
- Expected execution behavior and error handling.

Providers must monitor the Executor contract on all supported chains for:

- **Request for Execution**: emitted when a new execution request is created.
- **Add Relay Instructions**: emitted when additional gas or payment is added to a request.

!!!note
    The framework does not prevent repeated execution attempts. Providers should implement their own safeguards to avoid duplicate deliveries.

## Executor Contract

Each supported chain hosts a stateless, permissionless Executor contract. The contract provides an interface for submitting execution requests and emitting observable events for off-chain providers. It maintains no persistent state; all requests exist as events that off-chain agents can detect.

When called, the Executor contract:

- Accepts execution requests from integrators or clients.
- Verifies basic parameters (source/destination chain IDs, expiry time).
- Transfers payment to the designated [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank}.
- Emits events containing request details for off-chain consumption  

The Executor contract exposes the [`requestExecution`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L22){target=\_blank} function, used by both on-chain and off-chain integrations to create an execution request.

```solidity
requestExecution(
    uint16 dstChain,
    bytes32 dstAddr,
    bytes32 refundAddr,
    SignedQuote signedQuote,
    bytes request,
    bytes relayInstructions
)
```

When `requestExecution`  is called, the contract checks that:

- The quote’s source chain matches the chain of deployment.
- The destination matches the provided destination chain.
- The quote has not expired.

If all checks pass, payment is transferred to the [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank} defined in the quote, and a [`RequestForExecution`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L61){target=\_blank} event is emitted.

To remain lightweight and chain-agnostic, the Executor contract performs only minimal validation:

- No signature verification: The client is responsible for verifying the quote before submission.
- No message inspection: The contract does not parse or validate the message payload.
- No payment enforcement: The contract does not check that the payment matches the quoted fee; providers enforce this off-chain.

This minimal design keeps the contract generic, inexpensive, and compatible with multiple message formats and future Wormhole protocols.