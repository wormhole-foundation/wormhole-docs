---
title: Executor Framework
description: Learn how the Executor framework enables permissionless cross-chain message execution using on-chain contracts and off-chain providers.
categories: Basics, Executor
url: https://wormhole.com/docs/products/messaging/concepts/executor-framework/
---

# Executor Framework

The [Executor framework](https://github.com/wormholelabs-xyz/example-messaging-executor/tree/main){target=\_blank} is a standardized, permissionless system for executing cross-chain messages. It combines a lightweight on-chain contract with off-chain services that quote, monitor, and perform execution. By minimizing on-chain logic and verification, the framework reduces cost and complexity while allowing independent providers to compete and fulfill requests across multiple chains.

The Executor framework separates responsibilities between three independent participants:

| Actor	            | Responsibility                                                              | 
|-------------------|-----------------------------------------------------------------------------| 
| Integrator        | Creates and submits execution requests using valid quotes.                  | 
| Executor Contract | Publishes requests, transfers payment, and emits observable events.         | 
| Relay Provider	| Monitors events, issues and validates signed quotes, and executes messages. | 

This modular structure enables permissionless, verifiable, and cost-efficient message execution across multiple blockchains — without persistent on-chain state or protocol-specific relayers.

## Relay Provider

A Relay Provider is an off-chain service that executes messages between chains. Providers compete in a permissionless marketplace by offering signed execution quotes that define their pricing and delivery terms. This system decentralizes message delivery, allowing integrators to choose providers or run their own, rather than relying on a single relayer service. 

Each provider runs infrastructure that listens for execution requests emitted by the Executor contract on supported chains. When a request matches one of their quotes, the provider retrieves the associated VAA from the Guardians and performs the message execution on the destination chain.  

Each Relay Provider operates a Quoter service that issues signed quotes and defines execution terms. 

Each quote specifies: 

- The source and destination chains. 
- Pricing. 
- An expiry time before which the Executor contract can accept the quote. 

Short expiry windows reduce the risk of stale quotes but must be long enough for users to submit transactions on the source chain. 

Because the network is open, multiple providers may compete to fulfill the same request. Each quote defines the conditions under which a provider is willing to execute, enabling competitive pricing and redundancy across the system. Message validity is enforced through the Wormhole VAA and Guardian verification process, preventing providers from altering or forging the message and ensuring all executions remain trust-minimized.

Relay Providers may operate multiple wallets, each capable of performing execution or receiving payment. They can choose whether payments are collected per-wallet or directed to a central [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank} defined by the Quoter.

Providers should provide a public API for integrators to track the status of the request such as: 

- Request creation.
- Added gas fees.
- Transaction executed.
- Any issued refunds. 

To improve transparency, providers may also publish a Service-Level Agreement (SLA) describing the types of executions they support, their retry and refund policies, and their expected behavior during execution.

!!!warning
    The framework does not prevent repeated execution attempts. Providers should implement their own safeguards to avoid duplicate deliveries.

## Executor Contract

Each supported chain hosts a stateless, permissionless [Executor contract](/docs/products/reference/executor-addresses/){target=\_blank}. The contract provides an interface for submitting execution requests and emitting observable events for off-chain providers. It maintains no persistent state; all requests exist as events that off-chain agents can detect.

When called, the Executor contract:

- Accepts execution requests from integrators or clients.
- Verifies basic parameters (source/destination chain IDs, expiry time).
- Transfers payment to the designated [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank}.
- Emits events containing request details for off-chain consumption. 

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

When `requestExecution` is called, the contract checks that:

- The quote’s source chain matches the chain of deployment.
- The destination matches the provided destination chain.
- The quote has not expired.

If all checks pass, payment is transferred to the [`payeeAddress`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L59){target=\_blank} defined in the quote, and a [`RequestForExecution`](https://github.com/wormholelabs-xyz/example-messaging-executor/blob/main/evm/src/Executor.sol#L61){target=\_blank} event is emitted.

To remain lightweight and chain-agnostic, the Executor contract performs only minimal validation:

- **No signature verification**: The client is responsible for verifying the quote before submission.
- **No message inspection**: The contract does not parse or validate the message payload.
- **No payment enforcement**: The contract does not check that the payment matches the quoted fee; providers enforce this off-chain.

This minimal design keeps the contract generic, inexpensive, and compatible with multiple message formats and future Wormhole protocols.
