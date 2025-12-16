---
title: Executor Framework
description: Learn how the Executor framework enables permissionless cross-chain message execution using on-chain contracts and off-chain providers.
categories: Basics, Executor
---
<!-- 
Goal: Explain more in depth how the executor works - concept page
→ overview 
→ components
→ executor contract and relay providers
→ gas dropoff
→ flows from the overview page 
→ current framework page minus contract references
-->

<!-- simplify how the executor works with relay providers focus   

- enables anyone to act as a relayer (often referred to as a [relay provider](/docs/products/messaging/concepts/executor-framework/#relay-provider){target=\_blank}) in a permissionless network, 
- architecture still relies on the core Wormhole guarantees (VAAs for security, Guardian verification), but it changes how the relaying service is accessed and who can fulfill it.
- deploys a lightweight [Executor Contract](/docs/products/messaging/concepts/executor-framework/#executor-contract){target=\_blank} on every supported chain.
- Relayers do not own the executor contract, which is available for anyone to interact with, making it stateless and permissionless. 

- When an application requests cross-chain message delivery via the Executor, it first fetches a signed fee quote off-chain from a chosen executor provider. It then calls the Executor contract on the source chain, providing the target chain, target address, and that signed quote.

The Executor contract essentially records an Execution Request, escrows the payment (including a small fee), and emits an event that off-chain executor nodes are listening for. An available executor node corresponding to the provided quote will then take the VAA and execute the message on the destination chain. Execution works similarly to how a standard relayer would — for example, by calling the target contract with the message payload. Because the execution network is open, different providers can offer pricing quotes for message delivery, and developers or users can choose competitively. This fosters a decentralized marketplace of relayers, rather than a single service.

For developers, integrating the [Executor framework](/docs/products/messaging/concepts/executor-framework/){target=\_blank} can be as straightforward as using the standard relayer, with the added benefit of supporting non-EVM chains and custom pricing logic. It’s described as _a permissionless, extensible, and low-overhead cross-chain execution framework_. The extensibility means the system is built to accommodate various message types and future features, and permissionless means integrators are not tied to a single provider – it is possible to run an executor node if desired, or rely on community-run services. The Executor is part of Wormhole’s effort to make relaying truly multichain. For example, delivering messages to Solana or other ecosystems where an EVM-style relayer contract is insufficient will be possible through this framework.

The Messaging Executor is a recent addition, and its availability might initially be limited to specific chains as it rolls out. It works alongside the Wormhole core messaging contract, complementing the existing relayer system. As the Executor network grows, developers get the advantage of broader chain support without having to custom-build their relayers for those environments. The Executor remains fully trust-minimized — execution providers cannot compromise message security, and their signed quotes simply ensure fair compensation for delivery.

For more technical details, see the [open-source example Executor implementation](https://github.com/wormholelabs-xyz/example-messaging-executor){target=\_blank}. It explains how quotes, requests, and the off-chain API function within the Executor system.
-->

# Executor

The Executor is a shared execution framework that delivers Wormhole messages across chains. It standardizes how message execution is requested, quoted, and performed, enabling any service or protocol to execute messages permissionlessly through on-chain contracts.

The [Executor framework](/docs/products/messaging/concepts/executor-framework/){target=\_blank} enables anyone to act as a relayer within a permissionless network that uses a request-and-quote model for delivering messages. Instead of relying on a single, centralized relayer service, the Executor framework creates an open marketplace where multiple providers can compete to deliver messages based on signed execution quotes.

At its core, the Executor relies on Wormhole’s existing guarantees: messages are still secured by VAAs and verified by the Guardian network. The difference lies in how delivery requests are initiated and fulfilled.  

1. Applications call a lightweight, stateless Executor contract on the source chain, providing the target chain, target address, and a signed fee quote from a chosen provider.  
2. The contract emits an event representing the execution request, which any off-chain provider can detect.  
3. A matching provider then retrieves the VAA and performs the delivery on the destination chain.

By decentralizing message execution and supporting both EVM and non-EVM environments, the Executor framework enables developers to integrate Wormhole relaying with broader chain compatibility, without deploying or maintaining their own relayers.

<!-- mermaid added from relayers page -->

```mermaid
sequenceDiagram
    participant App as Application
    participant ExContract as Executor Contract (Source Chain)
    participant ExecNode as Executor Node (Off-chain)
    participant Dest as Target Contract (Destination Chain)

    App<<->>ExecNode: Fetch signed quote
    App->>ExContract: Submit Execution Request<br/>(target chain, target address, signed quote)
    ExContract->>ExecNode: Emit event with request + escrowed fee
    ExecNode-->>ExecNode: Listen for events<br/>Match signed quote
    ExecNode->>Dest: Deliver VAA + execute message payload
    Dest-->>App: Target contract logic executed
```

## Components 

- **Relay Provider**: An off-chain party responsible for performing message execution between chains. 
- **[Executor contract](/docs/products/reference/executor-addresses/){target=\_blank}**: The shared on-chain contract or program used to make execution requests. 
- **Execution Quote**: A signed quote defining cost and parameters for execution between a source and destination chain. 
- **Execution Request**: A request generated on-chain or off-chain for a given message (e.g., NTT, VAA v1, etc.) to be executed on another chain. 
- **Quoter**: An off-chain service that produces signed quotes. It's Quoter’s EVM public key that identifies each Relay Provider.
- **Payee**: The wallet address designated by the Quoter to receive payment once the execution is completed. 

For a deeper look at how these components interact, see the [Executor framework documentation](/docs/products/messaging/concepts/executor-framework/){target=\_blank}.

## Request Flow

Message execution starts on the source chain, where an integrator creates an execution request. The request includes a signed quote from a Quoter, along with message data and delivery instructions.

1. A client requests a quote from a Quoter, specifying source and destination chains.  
2. The Quoter returns a signed quote with pricing and parameters.  
3. The client sends a message through an integrator contract, including the signed quote.  
4. The integrator publishes the message via the[ Wormhole Core contract](/docs/protocol/infrastructure/core-contracts/){target=\_blank}.  
5. The integrator then calls the Executor contract to register the execution request.

```mermaid
---
title: v1 VAA Execution Request
---
sequenceDiagram
		participant C as Client
		participant Q as Quoter
		box Source Chain
		participant I as Integrator Contract
		participant W as Wormhole Core
		participant E as Executor Contract
		end
    C->>Q: srcChain, dstChain
    Q-->>C: signedQuote
    C->>I: sendMessage(signedQuote, relayInstructions)
    I->>W: publishMessage
    W-->>I: sequence
    I->>E: requestExecution
```

## Result Flow

Once the request is recorded on-chain, off-chain Relay Providers monitor the Executor contract for events that match their signed quotes. When a valid request is detected, the provider retrieves the message from the Guardians and executes it on the destination chain.

1. The Executor contract emits an event with the request and payment details.
2. A Relay Provider verifies the quote and fetches the associated message (e.g., a VAA).
3. The provider delivers the message to the destination chain’s integrator contract.
4. The integrator verifies the message with the Wormhole Core contract and performs the specified logic.

```mermaid
---
title: v1 VAA Execution Result
---
sequenceDiagram
		box Source Chain
		participant EC as Executor Contract
		end
		participant E as Relayer (Off-Chain)
		box Destination Chain
		participant I as Integrator Contract
		participant W as Wormhole Core
		end
		EC-->>E: event
    E->>I: executeVaaV1
    I->>W: parseAndVerifyVM
```

## Security Considerations

The Executor Contract is explicitly designed to be immutable and sit outside an integrator's security stack. Executor is intended to be used as a mechanism to permissionlessly deliver cross-chain data that includes an independent attestation source, such as Wormhole VAAs.

## Executor Framework

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