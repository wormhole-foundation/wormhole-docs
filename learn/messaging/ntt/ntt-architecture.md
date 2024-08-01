---
title: Native Token Transfers
description: Discover Wormhole's Native Token Transfers (NTT) for secure, flexible cross-chain token transfers with customizable features and deployment options.
---

## Introduction 

high level overview 

## System Components

There are two primary components to NTT.

### Managers

Manage the token and the transceivers, handle rate limiting, and message attestation. Each `NttManager` corresponds to a single token but can control multiple transceivers. Key functions include:

- `transfer` - initiates a token transfer process involving token locking or burning on the source chain
- `quoteDeliveryPrice` - quotes the fee for delivering a message to a specific target chain by querying and aggregating quotes from the Transceiver contracts
- `setPeer` - establishes trust between different instances of NTT manager contracts across chains by cross-registering them as peers, ensuring secure communication

### Transceivers

Responsible for sending NTT transfers forwarded through the manager on the source chain and delivered to a corresponding peer manager on the recipient chain. These contracts are responsible for encoding, sending, receiving, and decoding messages across chains, ensuring the seamless transfer of tokens. Transceivers can be defined independently of the Wormhole core and modified to support any verification backend. Key functions:

- `sendMessage` - this external function sends messages to a specified recipient chain. It encodes the token transfer details into a message format recognized by the system
- `quoteDeliveryPrice` - provides an estimation of the cost associated with delivering a message to a target chain and gauges transaction fees

![NTT arcgitecture diagram](/images/learn/messaging/messaging-1.webp)

!!! note
    [Learn more](#){target=\_blank} about the architecture of Native Token Transfers message lifecycles.
<!-- this takes to https://docs.wormhole.com/wormhole/native-token-transfers/architecture -->


#### Custom Transceivers

NTT has the flexibility to support custom message verification in addition to Wormhole Guardian message verification. Custom verifiers are implemented as Transceiver contracts and can be protocol-specific or provided by other third-party attesters. Protocols can also configure the threshold of attestations required to mark a token transfer as valid — for example 2/2, 2/3, 3/5, etc.

![Custom Attestation with NTT diagram](/images/learn/messaging/messaging-2.webp)

The verifier performs checks based on predefined criteria and issues approval for transactions that meet these requirements. This approval is incorporated into the Wormhole message, ensuring that only transactions verified by both the Wormhole Guardian network and the additional verifier are processed. model incorporates an extra verifier(s) into the bridging process, enhancing security and providing an added assurance of transaction integrity.

For more details, to collaborate or see examples of custom transceivers, contact Wormhole contributors.


## Lifecycle of a Message
### EVM
### Solana