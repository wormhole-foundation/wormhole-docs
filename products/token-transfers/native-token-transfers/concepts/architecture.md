---
title: Native Token Transfers Architecture
description: Explore Wormhole's Native Token Transfers architecture, which covers components, message flow, rate limiting, and custom transceivers.
categories: NTT, Transfer
---

# NTT Architecture

The Native Token Transfers (NTT) architecture within the Wormhole ecosystem offers a robust framework for secure and efficient token transfers across multiple blockchains. This architecture relies on the manager and transceiver core components, which work together to manage the complexities of cross-chain communication and token operations.

In the following video, Wormhole Foundation DevRel Pauline Barnades walks you through NTT as a flexible framework, covering key features, deployment modes, the roles of verifiers and managers, and more:

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/Od5cTaxjTiw?si=-ZAj5eRkJb_qgCqn' frameborder='0' allowfullscreen></iframe></div>

???- interface "Video Chapters"

    - [00:00](https://www.youtube.com/watch?v=Od5cTaxjTiw){target=\_blank}: Going Multichain with Full Control
    - [00:46](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=46s){target=\_blank}: Core Concept: A Framework, Not a Token Standard
    - [01:18](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=78s){target=\_blank}: NTT Key Features
    - [01:51](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=111s){target=\_blank}: Burn and Mint Deployment Model
    - [02:14](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=134s){target=\_blank}: Hub and Spoke Deployment Model
    - [02:40](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=160s){target=\_blank}: Understanding the Roles of the Verifiers (Transceivers)
    - [04:01](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=241s){target=\_blank}: Understanding the Role of the NTT Managers
    - [04:24](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=264s){target=\_blank}: Access Control: Owner vs. Pauser Roles
    - [05:15](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=315s){target=\_blank}: Combine NTT with Other Wormhole Products
    - [05:59](https://www.youtube.com/watch?v=Od5cTaxjTiw&t=359s){target=\_blank}: Framework Overview & Conclusion

## System Components

The NTT framework is composed of managers, which oversee the transfer process, and transceivers, which handle cross-chain messaging, ensuring smooth and reliable token transfers.

### Managers

_Managers_ are responsible for handling the flow of token transfers between different blockchains and ensuring that tokens are locked or burned on the source chain before being minted or unlocked on the destination chain. The main tasks of managers include rate-limiting transactions, verifying message authenticity (message attestation), and managing the interaction between multiple transceivers, who are responsible for cross-chain communications.

Each manager is assigned to a specific token but can operate across multiple chains. Their key responsibility is to ensure that tokens are securely locked or burned on the source chain before being minted or unlocked on the destination chain. This provides the integrity of token transfers and prevents double spending.

A manager is responsible for:

- **Handling token transfer flow**: Upon a transfer request, `NttManager` either locks or burns tokens depending on the configuration, emits a `TransferSent` event, and ensures tokens can’t be accessed on the source chain before leasing them on the destination chain. This process safeguards against double-spending and maintains a secure transfer.
- **Rate-limiting**: The `NttManager` contract includes rate-limiting functionality to prevent overloading the network or flooding the target chain. The `NttManager` applies rate limits to manage transfer flow and prevent network congestion. Limits apply to both outgoing and incoming transfers.
    - **Outbound**: Transfers exceeding the outbound limit are queued (if `shouldQueue` is true) or reverted.
    - **Inbound**: Similar limits apply on the destination chain, delaying transfers if capacity is exceeded.

    Rate limit duration and queuing are customizable per chain, and events notify users when transfers hit the limit.

- **Message authenticity verification**: The `NttManager` ensures transfer security by verifying message authenticity through multiple attestations from transceivers. For each transfer, a threshold number of attestation signatures must be gathered from transceivers. Once verified, `NttManager` releases tokens on the destination chain, ensuring only authenticated transfers are processed.
- **Interaction with transceivers**: `NttManager` collaborates with transceivers, forwarding transfer messages between chains and handling message verification. Transceivers route messages with transfer details to the destination chain, coordinating with `NttManager` to verify that tokens are locked or burned before releasing them on the other side. Transceivers can be customized to work with different security protocols, adding flexibility.

### Transceivers

_Transceivers_ facilitate cross-chain token transfers by ensuring the accurate transmission of messages between different blockchains. They work in conjunction with managers to route token transfers from the source chain to the recipient chain. Their primary function is to ensure that messages regarding the transfer process are delivered correctly and that tokens are safely transferred across chains.

While transceivers operate closely with Wormhole's ecosystem, they can also be configured independently of Wormhole's core system, allowing for flexibility. This adaptability enables them to be integrated with various verification backends, accommodating different security needs or platform-specific requirements.

Transceivers are entrusted with several responsibilities:

- **Message transmission**: Transceivers handle the routing of transfer messages between chains. When a transfer is initiated, the transceiver sends the message (including transfer details like recipient and amount) to the destination chain’s manager for verification and processing.
- **Manager coordination**: Transceivers work with managers to ensure tokens are locked or burned on the source chain before issuance on the destination chain, reinforcing the security of each transfer.
- **Custom verification support**: Transceivers can integrate with custom verification backends, allowing flexibility to adapt to different security protocols or chain requirements. This customization enables protocols to use different attestation standards as needed.

How it works:

1. The transceiver receives instructions from the manager to send messages across chains.
2. It quotes delivery fees, handles cross-chain message relaying, and verifies delivery to ensure tokens are safely transferred.
3. For each message, the transceiver coordinates with managers, ensuring only authorized transfers are processed on the destination chain.

![NTT architecture diagram](/docs/images/products/native-token-transfers/concepts/architecture/architecture-1.webp)

!!! note
    [Learn more](/docs/products/token-transfers/native-token-transfers/concepts/architecture/#lifecycle-of-a-message){target=\_blank} about the architecture of Native Token Transfers message lifecycles.

#### Custom Transceivers

The NTT framework supports advanced features, such as custom transceivers for specialized message verification, which enhance security and adaptability. The architecture includes detailed processes for initiating transfers, managing rate limits, and finalizing token operations, with specific instructions and events outlined for EVM-compatible chains and SVM-compatible chains.

NTT has the flexibility to support custom message verification in addition to Wormhole Guardian message verification. Custom verifiers are implemented as transceiver contracts and can be protocol-specific or provided by other third-party attesters. Protocols can also configure the threshold of attestations required to mark a token transfer as valid, for example, 2/2, 2/3, 3/5.

![Custom Attestation with NTT diagram](/docs/images/products/native-token-transfers/concepts/architecture/architecture-2.webp)

The verifier performs checks based on predefined criteria and issues approval for transactions that meet these requirements. This approval is incorporated into the Wormhole message, ensuring that only transactions verified by both the Wormhole Guardian Network and the additional verifier are processed. The model includes an extra verifier in the bridging process, enhancing security and providing an added assurance of transaction integrity.

For more details, to collaborate, or to see examples of custom transceivers, [contact](https://discord.com/invite/wormholecrypto){target=\_blank} Wormhole contributors.

## On-Chain State

The NTT contracts maintain minimal state on‑chain to safely route transfers, prevent replays, and manage throughput across multiple chains. This state is primarily managed by the NTT Manager, its Rate Limiter, and the Transceiver Registry:

 - **Message attestations**: Records which transceivers have attested to each cross‑chain message, enforces the M‑of‑N attestation threshold, and prevents re‑execution of processed messages.
 - **Peer registrations**: Maps each remote chain to its associated NTT Manager and token decimal configuration, ensuring only trusted peers can mint/unlock tokens.
 - **Rate limiting**: Enforces inbound and outbound throughput caps and queues transfers when limits are exceeded, protecting liquidity and downstream networks.
 - **Transceiver registry**: Maintains the list of registered and enabled transceivers, along with their bitmap index, allowing governance to add/remove messaging providers.

## Lifecycle of a Message

The lifecycle of a message in the Wormhole ecosystem for Native Token Transfers (NTT) involves multiple steps to ensure secure and accurate cross-chain token transfers. This lifecycle can vary depending on the blockchain being used, and the following explanations focus on the EVM and SVM implementations. The key stages include initiating the transfer, handling rate limits, sending and receiving messages, and finally, minting or unlocking tokens on the destination chain.

### Transfer

The process begins when a client initiates a transfer. For EVM, this is done using the `transfer` function, whereas in SVM, the client uses either the `transfer_lock` or `transfer_burn` instruction, depending on whether the program is in locking or burning mode. The client specifies the transfer amount, recipient chain ID, recipient address, and a flag (`should_queue` on both EVM and SVM) to decide whether the transfer should be queued if it hits the rate limit.

In both cases:

- If the source chain is in locking mode, the tokens are locked on the source chain to be unlocked on the destination chain.
- If the source chain is in burning mode, the tokens are burned on the source chain, and new tokens are minted on the destination chain.

Once initiated, an event (such as `TransferSent` on EVM or a corresponding log on SVM) is emitted to signal that the transfer process has started.

### Rate Limit

Both EVM and SVM implement rate-limiting for transfers to prevent abuse or network overload. Rate limits apply to both the source and destination chains. If transfers exceed the current capacity, depending on whether the `shouldQueue` flag is set to true, they can be queued.

- On EVM, the transfer is added to an outbound queue if it hits the rate limit, with a delay corresponding to the configured rate limit duration. If `shouldQueue` is set to false, the transfer is reverted with an error.
- On SVM, the transfer is added to an **Outbox** via the `insert_into_outbox` method, and if the rate limit is hit, the transfer is queued with a `release_timestamp`. If `shouldQueue` is false, the transfer is reverted with a `TransferExceedsRateLimit` error.

Both chains emit events or logs when transfers are rate-limited or queued.

### Send

After being forwarded to the Transceiver, the message is transmitted across the chain. Transceivers are responsible for delivering the message containing the token transfer details. Depending on the Transceiver's implementation, messages may be routed through different systems, such as Wormhole relayers or other custom relaying solutions. Once the message is transmitted, an event is emitted to signal successful transmission.

- In EVM, the message is sent using the `sendMessage` function, which handles the transmission based on the Transceiver's implementation. The Transceiver may use Wormhole relayers or custom relaying solutions to forward the message.
- In SVM, the transfer message is placed in an Outbox and released via the `release_outbound` instruction. The SVM transceiver, such as the Wormhole Transceiver, may send the message using the `post_message` instruction, which Wormhole Guardians observe for verification.

In both cases, an event or log (e.g., `SendTransceiverMessage` on EVM or a similar log on SVM) is emitted to signal that the message has been transmitted.

### Receive

Upon receiving the message on the destination chain, an off-chain relayer forwards the message to the destination Transceiver for verification. 

- In EVM, the message is received by the `NttManager` on the destination chain, which verifies the message's authenticity. Depending on the M of N threshold set for the attestation process, the message may require attestations from multiple transceivers.
- In SVM, the message is received via the `receive_message` instruction in the Wormhole Transceiver program. The message is verified and stored in a `VerifiedTransceiverMessage` account, after which it is placed in an Inbox for further processing.

In both chains, replay protection mechanisms ensure that a message cannot be executed more than once. Events or logs are emitted (e.g., `ReceivedMessage` on EVM or `ReceiveMessage` on SVM) to notify that the message has been successfully received.

### Mint or Unlock

Finally, after the message is verified and attested to, the tokens can be either minted (if they were burned on the source chain) or unlocked (if they were locked). The tokens are then transferred to the recipient on the destination chain, completing the cross-chain token transfer process. 

- On EVM, tokens are either minted (if burned on the source chain) or unlocked (if locked on the source chain). The `TransferRedeemed` event signals that the tokens have been successfully transferred.
- On SVM, the tokens are unlocked or minted depending on whether the program is in locking or burning mode. The `release_inbound_unlock` or `release_inbound_mint` instruction is used to complete the transfer, and a corresponding log is produced.

In both cases, once the tokens have been released, the transfer process is complete, and the recipient receives the tokens. Events are emitted to indicate that the transfer has been fully redeemed.