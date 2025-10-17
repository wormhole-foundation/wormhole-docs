---
title: Executor Framework
description: TODO
categories: Basics
---
<!-- grammarly -->
<!-- add links -->
# Executor Framework

The Executor framework defines how cross-chain execution requests are created, validated, and fulfilled. It combines a lightweight on-chain contract with off-chain services that quote, monitor, and perform execution. 
<!-- unify -->
The Executor provides a standardized, permissionless model for message delivery. By minimizing on-chain logic and verification, it reduces cost and complexity while allowing independent providers to compete and fulfill execution requests across chains.

The Executor framework separates responsibilities between three independent participants:

| Actor	            | Responsibility                                                      | 
|-------------------|---------------------------------------------------------------------| 
| Integrator        | Creates and submits execution requests using valid quotes.          | 
| Executor Contract | Publishes requests, transfers payment, and emits observable events. | 
| Relay Provider	| Monitors events, validates quotes, and performs message execution.  | 

This modular structure enables permissionless, verifiable, and cost-efficient message execution across multiple blockchains — without persistent on-chain state or protocol-specific relayers.

## Relay Provider

A Relay Provider is an off-chain participant that performs message execution between chains. Each provider must operate at least one Quoter service that issues signed quotes describing how and when an execution will be performed.

A quote specifies the source and destination chains, pricing, and an expiry time before which the quote can be accepted by the Executor contract. Short expiry windows reduce the risk of stale quotes but must be long enough for users to submit transactions on the source chain. 

Relay Providers may operate multiple wallets, each capable of performing execution or receiving payment. They can choose whether payments are collected per-wallet or directed to a central `payeeAddress` defined by the Quoter.

Providers should provide a public API that allows clients to check the status of an execution request. This should include the time and transaction of:

- When the request was initiated and its details.
- Any Add Gas events associated with the request and their details.
- The the execution associated with the request.
- Any refunds associated with the request (or reason for a lack of refund) and their amounts.

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

The Executor contract:

- Accepts execution requests from integrators or clients.
- Verifies basic parameters (source/destination chain IDs, expiry time).
- Transfers payment to the designated `payeeAddress`.
- Emits events containing request details for off-chain consumption  

The Executor Contract must support the following methods:
<!-- link -->
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
The contract checks that:

- the quote’s source chain matches the chain of deployment,
- the destination matches the provided destination chain, and
- the quote has not expired.

If all checks pass, payment is transferred to the `payeeAddress` defined in the quote, and a `RequestForExecution` event is emitted.

To remain lightweight and chain-agnostic, the Executor contract performs only minimal validation:

- No signature verification: The client is responsible for verifying the quote before submission.
- No message inspection: The contract does not parse or validate the message payload.
- No payment enforcement: The contract does not check that the payment matches the quoted fee; providers enforce this off-chain.

This minimal design keeps the contract generic, inexpensive, and compatible with multiple message formats and future Wormhole protocols.




