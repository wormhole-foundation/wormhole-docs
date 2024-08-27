---
title: Relayers
description: Discover the role of relayers in the Wormhole network, including client-side, specialized, and standard types, for secure cross-chain communication.
---

# Relayers

This documentation provides a comprehensive guide to relayers within the Wormhole network, describing their role, types, and benefits in facilitating cross-chain processes.

Relayers in the Wormhole context are processes that deliver [Verified Action Approvals (VAAs)](/learn/infrastructure/vaas/){target=\_blank} to their destination, playing a crucial role in Wormhole's security model. They can't compromise security, only availability, and act as delivery mechanisms for VAAs without the capacity to tamper with the outcome.

There are three primary types of relayers discussed:

- **Client-side relaying** - a cost-efficient, no-backend-infrastructure approach relying on user-facing front ends. It provides a simple solution, although it can complicate the user experience due to the manual steps involved
- **Specialized relayers** - backend components that handle parts of the cross-chain process, offering a smoother user experience and allowing off-chain calculations to reduce gas costs. These relayers could operate through direct listening to the Guardian Network (Spy relaying) or by providing a REST endpoint to accept VAAs to be relayed (REST relaying)
- **Standard relayers** - a decentralized relayer network that can deliver arbitrary VAAs, reducing the developer's need to develop, host, or maintain relayers. However, they require all calculations to be done on-chain and might be less gas-efficient

## Fundamentals

This section highlights the crucial principles underpinning the operation and handling of relayers within the Wormhole network.

Relayers are fundamentally not trusted entities within the network. This means that while they don't require your trust, they shouldn't be trusted implicitly. They function as delivery mechanisms, transporting VAAs from their source to their destination.

Key characteristics of VAAs include:

- Public emission from the Guardian Network
- Authentication through signatures from the Guardian Network
- Verifiability by any entity or any Wormhole Core Contract
- As a result of these characteristics, anyone can pick up a VAA and deliver it anywhere, but no one can alter the VAA content without invalidating the signatures

When designing contracts, it's crucial to only trust information contained within your contract or a VAA. Relying on information from a relayer could expose you to input attacks.

Advanced strategies can involve relayers performing trustless off-chain computation passed into the destination contract. These strategies can optimize gas costs but also create attack vectors if not used correctly.

In summary, the design of a relayer should ensure that there's a single, deterministic way to process messages in your protocol. In an optimally designed protocol, relayers should have a "correct" implementation, mirroring "crank turner" processes used elsewhere in blockchain.

## Client-Side Relaying

Client-side relaying relies on user-facing front ends, such as a webpage or a wallet, to complete the cross-chain process.

**Key Features**

- **Cost-efficiency** - users only pay the transaction fee for the second transaction, eliminating any additional costs
- **No backend infrastructure** - the process is completely client-based, eliminating the need for a backend relaying infrastructure

**Implementation**

Users themselves carry out the three steps of the cross-chain process:

1. Perform an action on chain A
2. Retrieve the resulting VAA from the Guardian Network
3. Perform an action on chain B using the VAA

**Considerations**

!!! note
    Though simple, this type of relaying is generally not recommended if your aim is a highly polished user experience. It can, however, be useful for getting a Minimum Viable Product (MVP) up and running.

- Users must sign all required transactions with their own wallet
- Users must have funds to pay the transaction fees on every chain involved
- The user experience may be cumbersome due to the manual steps involved

## Specialized Relayers

Specialized relayers are purpose-built components within the Wormhole protocol, designed to relay messages for specific applications. They are capable of performing off-chain computations and can be customized to suit a variety of use cases.

**Key Features**

- **Optimization** - capable of performing trustless off-chain computations which can optimize gas costs
- **Customizability** - allows for specific strategies like batching, conditional delivery, multi-chain deliveries, and more
- **Incentive structure** - developers have the freedom to design an incentive structure suitable for their application
- **Enhanced UX** - the ability to retrieve a VAA from the Guardian Network and perform an action on the target chain using the VAA on behalf of the user can simplify the user experience

**Implementation**

!!! note
    To make the development of specialized relayers easier, a plugin relayer is available in the [main Wormhole repository](https://github.com/wormhole-foundation/wormhole/tree/main/relayer){target=\_blank}. This sets up the basic infrastructure for relaying, allowing developers to focus on implementing the specific logic for their application.

There are two main methods of setting up a specialized relayer:

- **Spy relaying** - involves listening directly to the Guardian Network via a Spy
- **REST relaying** - provides a REST endpoint to accept a VAA that should be relayed

**Considerations**

Remember, despite their name, specialized relayers still need to be considered trustless. VAAs are public and can be submitted by anyone, so developers shouldn't rely on off-chain relayers to perform any computation considered "trusted."

- Development work and hosting of relayers are required
- The fee-modeling can become complex, as relayers are responsible for paying target chain fees
- Relayers are responsible for availability, adding dependency for the cross-chain application

## Standard Relayers

Standard relayers are a component of a decentralized network in the Wormhole protocol, facilitating the delivery of VAAs to recipient contracts compatible with the standard relayer API.

**Key Features**

- **Lower operational costs** - no need to develop, host, or maintain individual relayers
- **Simplified integration** - because there is no need to run a relayer, integration is as simple as calling a function and implementing an interface

**Implementation**

The standard relayer integration involves two key steps:

- **Delivery request** - request delivery from the Wormhole Relay Ecosystem Contract
- **Relay reception** - implement a [`receiveWormholeMessages`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/bacbe82e6ae3f7f5ec7cdcd7d480f1e528471bbb/src/interfaces/IWormholeReceiver.sol#L44-L50){target=\_blank} function within their contracts. This function is invoked upon successful relay of the VAA

**Considerations**

!!! note
    Developers should note that the choice of relayers depends their project's specific requirements and constraints. Standard relayers offer simplicity and convenience but limit customization and optimization opportunities compared to specialized relayers.

- All computations are performed on-chain
- Potentially less gas-efficient compared to specialized relayers
- Optimization features like conditional delivery, batching, off-chain calculations might be restricted
- Support may not be available for all chains