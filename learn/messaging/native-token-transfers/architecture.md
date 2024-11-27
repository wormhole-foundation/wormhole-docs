---
title: Native Token Transfers Architecture
description: Explore Wormhole's Native Token Transfers architecture, which covers components, message flow, rate limiting, and custom transceivers.
---

## Introduction

The Native Token Transfers (NTT) architecture within the Wormhole ecosystem offers a robust framework for secure and efficient token transfers across multiple blockchains. This architecture relies on the manager and transceiver core components that work together to manage cross-chain communication and token operations complexities.

For the technical implementations of the functions, refer to the [Managers and Transceivers](/docs/build/contract-integrations/native-token-transfers/managers-transceivers/){target=\_blank} page.

## System Components

The NTT framework is composed of managers, which oversee the transfer process, and transceivers, which handle cross-chain messaging, ensuring smooth and reliable token transfers.

### Managers

_Managers_ are responsible for handling the flow of token transfers between different blockchains and ensuring that tokens are locked or burned on the source chain before being minted or unlocked on the destination chain. The main tasks of managers include rate-limiting transactions, verifying message authenticity (message attestation), and managing the interaction between multiple transceivers, who are responsible for cross-chain communications.

Each manager is assigned to a specific token but can operate across multiple chains. Their key responsibility is to ensure that tokens are securely locked or burned on the source chain before being minted or unlocked on the destination chain. This provides the integrity of token transfers and prevents double-spending.

A manager is responsible for:

- **Handling token transfer flow** - upon a transfer request, `NttManager` either locks or burns tokens depending on the configuration, emits a `TransferSent` event, and ensures tokens can’t be accessed on the source chain before leasing them on the destination chain. This process safeguards against double-spending and maintains a secure transfer
- **Rate-limiting** - the `NttManager` contract includes rate-limiting functionality to prevent overloading the network or flooding the target chain. The `NttManager` applies rate limits to manage transfer flow and prevent network congestion. Limits apply to both outgoing and incoming transfers
    - **Outbound** - transfers exceeding the outbound limit are queued (if `shouldQueue` is true) or reverted
    - **Inbound** - similar limits apply on the destination chain, delaying transfers if capacity is exceeded

    Rate limit duration and queuing are customizable per chain, and events notify users when transfers hit the limit

- **Message authenticity verification** - the `NttManager` ensures transfer security by verifying message authenticity through multiple attestations from transceivers. For each transfer, a threshold number of attestation signatures must be gathered from transceivers. Once verified, `NttManager` releases tokens on the destination chain, ensuring only authenticated transfers are processed
- **Interaction with transceivers** - `NttManager` collaborates with transceivers, forwarding transfer messages between chains and handling message verification. Transceivers route messages with transfer details to the destination chain, coordinating with `NttManager` to verify that tokens are locked or burned before releasing them on the other side. Transceivers can be customized to work with different security protocols, adding flexibility

### Transceivers

_Transceivers_ facilitate cross-chain token transfers by ensuring the accurate transmission of messages between different blockchains. They work in conjunction with managers to route token transfers from the source chain to the recipient chain. Their primary function is to ensure that messages regarding the transfer process are delivered correctly, and that tokens are safely transferred across chains.

While transceivers operate closely with Wormhole's ecosystem, they can also be configured independently of Wormhole's core system, allowing for flexibility. This adaptability allows them to be integrated with various verification backends to accommodate different security needs or platform-specific requirements.

Transceivers are entrusted with several responsibilities:

- **Message transmission** - transceivers handle the routing of transfer messages between chains. When a transfer is initiated, the transceiver sends the message (including transfer details like recipient and amount) to the destination chain’s manager for verification and processing
- **Manager coordination** - transceivers work with managers to ensure tokens are locked or burned on the source chain before issuance on the destination chain, reinforcing the security of each transfer
- **Custom verification support** - transceivers can integrate with custom verification backends, allowing flexibility to adapt to different security protocols or chain requirements. This customization enables protocols to use different attestation standards as needed

How it works:

1. The transceiver receives instructions from the manager to send messages across chains
2. It quotes delivery fees, handles cross-chain message relaying, and verifies delivery to ensure tokens are safely transferred
3. For each message, the transceiver coordinates with managers, ensuring only authorized transfers are processed on the destination chain

![NTT architecture diagram](/docs/images/learn/messaging/native-token-transfers/architecture/architecture-1.webp)

!!! note
    [Learn more](/docs/learn/messaging/native-token-transfers/architecture/#lifecycle-of-a-message){target=\_blank} about the architecture of Native Token Transfers message lifecycles.

#### Custom Transceivers

The NTT framework supports advanced features such as custom transceivers for specialized message verification, enhancing security and adaptability. The architecture includes detailed processes for initiating transfers, managing rate limits, and finalizing token operations, with specific instructions and events outlined for EVM-compatible chains and Solana.

NTT has the flexibility to support custom message verification in addition to Wormhole Guardian message verification. Custom verifiers are implemented as transceiver contracts and can be protocol-specific or provided by other third-party attesters. Protocols can also configure the threshold of attestations required to mark a token transfer as valid — for example, 2/2, 2/3, 3/5.

![Custom Attestation with NTT diagram](/docs/images/learn/messaging/native-token-transfers/architecture/architecture-2.webp)

The verifier performs checks based on predefined criteria and issues approval for transactions that meet these requirements. This approval is incorporated into the Wormhole message, ensuring that only transactions verified by both the Wormhole Guardian Network and the additional verifier are processed. The model includes an extra verifier in the bridging process, enhancing security and providing an added assurance of transaction integrity.

For more details, to collaborate, or to see examples of custom transceivers, [contact](https://discord.com/invite/wormholecrypto){target=\_blank} Wormhole contributors.

## Lifecycle of a Message

The lifecycle of a message in the Wormhole ecosystem for Native Token Transfers (NTT) involves multiple steps to ensure secure and accurate cross-chain token transfers. This lifecycle can vary depending on the blockchain being used, and the following explanations focus on the EVM and Solana implementations. The key stages include initiating the transfer, handling rate limits, sending and receiving messages, and finally, minting or unlocking tokens on the destination chain.

### Transfer

The process begins when a client initiates a transfer. For EVM, this is done using the `transfer` function, whereas in Solana, the client uses either the `transfer_lock` or `transfer_burn` instruction, depending on whether the program is in locking or burning mode. The client specifies the transfer amount, recipient chain ID, recipient address, and a flag (`should_queue` on both EVM and Solana) to decide whether the transfer should be queued if it hits the rate limit.

In both cases:

- If the source chain is in locking mode, the tokens are locked on the source chain to be unlocked on the destination chain
- If the source chain is in burning mode, the tokens are burned on the source chain, and new tokens are minted on the destination chain

Once initiated, an event (such as `TransferSent` on EVM or a corresponding log on Solana) is emitted to signal that the transfer process has started.

### Rate Limit

Both EVM and Solana implement rate-limiting for transfers to prevent abuse or network overload. Rate limits apply to both the source and destination chains. If transfers exceed the current capacity, depending on whether the `shouldQueue` flag is set to true, they can be queued.

- On EVM, the transfer is added to an outbound queue if it hits the rate limit, with a delay corresponding to the configured rate limit duration. If `shouldQueue` is set to false, the transfer is reverted with an error
- On Solana, the transfer is added to an **Outbox** via the `insert_into_outbox method`, and if the rate limit is hit, the transfer is queued with a `release_timestamp`. If `shouldQueue` is false, the transfer is reverted with a `TransferExceedsRateLimit` error

Both chains emit events or logs when transfers are rate-limited or queued.

### Send

After being forwarded to the Transceiver, the message is transmitted across the chain. Transceivers are responsible for delivering the message containing the token transfer details. Depending on the Transceiver's implementation, messages may be routed through different systems, such as Wormhole relayers or other custom relaying solutions. Once the message is transmitted, an event is emitted to signal successful transmission.

- In EVM, the message is sent using the `sendMessage` function, which handles the transmission based on the Transceiver's implementation. The Transceiver may use Wormhole relayers or custom relaying solutions to forward the message
- In Solana, the transfer message is placed in an Outbox and released via the `release_outbound` instruction. The Solana transceiver, such as the Wormhole Transceiver, may send the message using the `post_message` instruction, which Wormhole Guardians observe for verification

In both cases, an event or log (e.g., `SendTransceiverMessage` on EVM or a similar log on Solana) is emitted to signal that the message has been transmitted.

### Receive

Upon receiving the message on the destination chain, an off-chain relayer forwards the message to the destination Transceiver for verification. 

- In EVM, the message is received by the `NttManager` on the destination chain, which verifies the message's authenticity. Depending on the M of N threshold set for the attestation process, the message may require attestations from multiple transceivers
- In Solana, the message is received via the `receive_message` instruction in the Wormhole Transceiver program. The message is verified and stored in a `VerifiedTransceiverMessage` account, after which it is placed in an Inbox for further processing

In both chains, replay protection mechanisms ensure that a message cannot be executed more than once. Events or logs are emitted (e.g., `ReceivedMessage` on EVM or `ReceiveMessage` on Solana) to notify that the message has been successfully received.

### Mint or Unlock

Finally, after the message is verified and attested to, the tokens can be either minted (if they were burned on the source chain) or unlocked (if they were locked). The tokens are then transferred to the recipient on the destination chain, completing the cross-chain token transfer process. 

- On EVM, tokens are either minted (if burned on the source chain) or unlocked (if locked on the source chain). The `TransferRedeemed` event signals that the tokens have been successfully transferred
- On Solana, the tokens are unlocked or minted depending on whether the program is in locking or burning mode. The `release_inbound_unlock` or `release_inbound_mint` instruction is used to complete the transfer, and a corresponding log is produced

In both cases, once the tokens have been released, the transfer process is complete, and the recipient receives the tokens. Events are emitted to indicate that the transfer has been fully redeemed.