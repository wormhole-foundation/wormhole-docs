---
title: Native Token Transfers Architecture
description: Explore Wormhole's Native Token Transfers architecture, which covers components, message flow, rate limiting, and custom transceivers.
---

## Introduction 

The Native Token Transfers (NTT) architecture in the Wormhole ecosystem enables secure and efficient token transfers across multiple blockchains. Its core components, managers and transceivers, are designed to handle the complexities of cross-chain communication.

_Managers_ oversee the token transfer process, including rate-limiting and message attestation. They manage interactions with multiple transceivers and ensure that tokens are locked or burned on the source chain before being minted or unlocked on the destination chain.

_Transceivers_ are responsible for encoding, sending, receiving, and decoding messages across chains, facilitating seamless communication between different blockchain environments. They work with Managers to ensure that messages are accurately processed and tokens are correctly transferred, providing a reliable system for cross-chain token transfers.

The NTT framework supports advanced features such as custom transceivers for specialized message verification, enhancing security and adaptability. The architecture includes detailed processes for initiating transfers, managing rate limits, and finalizing token operations, with specific instructions and events outlined for EVM-compatible chains and Solana.

## System Components

There are two primary components to NTT: Managers and Transceivers.

### Managers

Manage the token and the transceivers, handle rate-limiting and message attestation. Each `NttManager` corresponds to a single token but can control multiple transceivers. Key functions include:

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

NTT has the flexibility to support custom message verification in addition to Wormhole Guardian message verification. Custom verifiers are implemented as Transceiver contracts and can be protocol-specific or provided by other third-party attesters. Protocols can also configure the threshold of attestations required to mark a token transfer as valid — for example, 2/2, 2/3, 3/5.

![Custom Attestation with NTT diagram](/images/learn/messaging/messaging-2.webp)

The verifier performs checks based on predefined criteria and issues approval for transactions that meet these requirements. This approval is incorporated into the Wormhole message, ensuring that only transactions verified by both the Wormhole Guardian Network and the additional verifier are processed. The model includes an extra verifier(s) in the bridging process, enhancing security and providing an added assurance of transaction integrity.

For more details, to collaborate, or to see examples of custom transceivers, contact Wormhole contributors.

## Lifecycle of a Message

### EVM

#### Transfer

A client calls on `transfer` to initiate an NTT transfer. The client must specify, at minimum, the transfer amount, the recipient chain, and the recipient address on the recipient chain. `transfer` also supports a flag to specify whether the `NttManager` should queue rate-limited transfers or revert. Clients can also include additional instructions to forward along to the Transceiver on the source chain. Depending on the mode set in the initial configuration of the `NttManager` contract, transfers are either "locked" or "burned." Once the transfer has been forwarded to the Transceiver, the `NttManager` emits the `TransferSent` event.

_Events_

```ts
/// @notice Emitted when a message is sent from the nttManager.
/// @dev Topic0
///      0x9716fe52fe4e02cf924ae28f19f5748ef59877c6496041b986fbad3dae6a8ecf
/// @param recipient The recipient of the message.
/// @param amount The amount transferred.
/// @param fee The amount of ether sent along with the tx to cover the delivery fee.
/// @param recipientChain The chain ID of the recipient.
/// @param msgSequence The unique sequence ID of the message.
event TransferSent(
    bytes32 recipient, uint256 amount, uint256 fee, uint16 recipientChain, uint64 msgSequence
);
```


#### Rate Limit

A transfer can be rate-limited on both on the source and destination chains. If a transfer is rate-limited on the source chain and the `shouldQueue` flag is enabled, it is added to an outbound queue. The transfer can be released after the configured `_rateLimitDuration` has expired via the `completeOutboundQueuedTransfer` method. The `OutboundTransferQueued` and `OutboundTransferRateLimited` events are emitted.

If the client attempts to release the transfer from the queue before the expiry of the `rateLimitDuration`, the contract reverts with an `OutboundQueuedTransferStillQueued` error.

Similarly, rate-limited transfers on the destination chain are added to an inbound queue. These transfers can be released from the queue via the `completeInboundQueuedTransfer` method, and the `InboundTransferQueued` event is emitted.

If the client attempts to release the transfer from the queue before the `rateLimitDuration` expires, the contract reverts with an `InboundQueuedTransferStillQueued` error.

To disable the rate limiter, set `_rateLimitDuration` to 0 and enable the `_skipRateLimiting` field in the `NttManager` constructor. Configuring this incorrectly will throw an error. If the rate limiter is disabled, the inbound and outbound rate limits can be set to 0.

_Events_

```ts
/// @notice Emitted whenn an outbound transfer is queued.
/// @dev Topic0
///      0x69add1952a6a6b9cb86f04d05f0cb605cbb469a50ae916139d34495a9991481f.
/// @param queueSequence The location of the transfer in the queue.
event OutboundTransferQueued(uint64 queueSequence);
```

```ts
/// @notice Emitted when an outbound transfer is rate limited.
/// @dev Topic0
///      0x754d657d1363ee47d967b415652b739bfe96d5729ccf2f26625dcdbc147db68b.
/// @param sender The initial sender of the transfer.
/// @param amount The amount to be transferred.
/// @param currentCapacity The capacity left for transfers within the 24-hour window.
event OutboundTransferRateLimited(
    address indexed sender, uint64 sequence, uint256 amount, uint256 currentCapacity
);
```

```ts
/// @notice Emitted when an inbound transfer is queued
/// @dev Topic0
///      0x7f63c9251d82a933210c2b6d0b0f116252c3c116788120e64e8e8215df6f3162.
/// @param digest The digest of the message.
event InboundTransferQueued(bytes32 digest);
```

#### Send

Once the `NttManager` forwards the message to the Transceiver, the message is transmitted via the `sendMessage method`. The method signature is enforced by the Transceiver but transceivers are free to determine their own implementation for transmitting messages. (e.g. a message routed through the Wormhole Transceiver can be sent via standard relaying, a specialized or custom relayer, or manually published via the core bridge).

Once the message has been transmitted, the contract emits the `SendTransceiverMessage` event.

_Events_

```ts
/// @notice Emitted when a message is sent from the transceiver.
/// @dev Topic0
///      0x53b3e029c5ead7bffc739118953883859d30b1aaa086e0dca4d0a1c99cd9c3f5.
/// @param recipientChain The chain ID of the recipient.
/// @param message The message.
event SendTransceiverMessage(
    uint16 recipientChain, TransceiverStructs.TransceiverMessage message
);
```

#### Receive

Once a message has been emitted by a Transceiver on the source chain, an off-chain process (for example, a relayer) will forward the message to the corresponding Transceiver on the recipient chain. The relayer interacts with the Transceiver via an entry point to receive messages. For example, the relayer will call the `receiveWormholeMessage` method on the `WormholeTransceiver` contract to execute the message. The `ReceiveRelayedMessage` event is emitted during this process.

This method should also forward the message to the `NttManager` on the destination chain. Note that the the Transceiver interface does not declare a signature for this method because receiving messages is specific to each Transceiver, and a one-size-fits-all solution would be overly restrictive.

The `NttManager` contract allows an M of N threshold for Transceiver attestations to determine whether a message can be safely executed. For example, if the threshold requirement is 1, the message will be executed after a single Transceiver delivers a valid attestation. If the threshold requirement is 2, the message will only be executed after two Transceivers deliver valid attestations. When a Transceiver attests to a message, the contract emits the `MessageAttestedTo` event.

NTT implements replay protection, so if a given Transceiver attempts to deliver a message attestation twice, the contract reverts with `TransceiverAlreadyAttestedToMessage` error. NTT also implements replay protection against re-executing messages. This check also acts as reentrancy protection as well.

If a message has already been executed, the contract ends execution early and emits the `MessageAlreadyExecuted` event instead of reverting via an error. This mitigates the possibility of race conditions from transceivers attempting to deliver the same message when the threshold is less than the total number of available of Transceivers (i.e. threshold < totalTransceivers) and notifies the client (off-chain process) so they don't attempt redundant message delivery.

_Events_

```ts
/// @notice Emitted when a relayed message is received.
/// @dev Topic0
///      0xf557dbbb087662f52c815f6c7ee350628a37a51eae9608ff840d996b65f87475
/// @param digest The digest of the message.
/// @param emitterChainId The chain ID of the emitter.
/// @param emitterAddress The address of the emitter.
event ReceivedRelayedMessage(bytes32 digest, uint16 emitterChainId, bytes32 emitterAddress);
```

```ts
/// @notice Emitted when a message is received.
/// @dev Topic0
///     0xf6fc529540981400dc64edf649eb5e2e0eb5812a27f8c81bac2c1d317e71a5f0.
/// @param digest The digest of the message.
/// @param emitterChainId The chain ID of the emitter.
/// @param emitterAddress The address of the emitter.
/// @param sequence The sequence of the message.
event ReceivedMessage(
    bytes32 digest, uint16 emitterChainId, bytes32 emitterAddress, uint64 sequence
);
```

```ts
/// @notice Emitted when a message has already been executed to
///         notify client of against retries.
/// @dev Topic0
///      0x4069dff8c9df7e38d2867c0910bd96fd61787695e5380281148c04932d02bef2.
/// @param sourceNttManager The address of the source nttManager.
/// @param msgHash The keccak-256 hash of the message.
event MessageAlreadyExecuted(bytes32 indexed sourceNttManager, bytes32 indexed msgHash);
```

#### Mint or Unlock

Once a transfer has been successfully verified, the tokens can be minted (if the mode is "burning") or unlocked (if the mode is "locking") to the recipient on the destination chain. Note that the source token decimals are bounded betweeen 0 and `TRIMMED_DECIMALS` as enforced in the wire format. The transfer amount is untrimmed (scaled-up) if the destination chain token decimals exceed `TRIMMED_DECIMALS`. Once the approriate number of tokens have been minted or unlocked to the recipient, the `TransferRedeemed` event is emitted.

_Events_

```ts
/// @notice Emitted when a transfer has been redeemed
///         (either minted or unlocked on the recipient chain).
/// @dev Topic0
///      0x504e6efe18ab9eed10dc6501a417f5b12a2f7f2b1593aed9b89f9bce3cf29a91.
/// @param digest The digest of the message.
event TransferRedeemed(bytes32 indexed digest);
```

### Solana

#### Transfer

A client calls the `transfer_lock` or `transfer_burn` instruction based on whether the program is in `LOCKING` or `BURNING` mode. The program mode is set during initialization. When transferring, the client must specify the amount of the transfer, the recipient chain, the recipient address on the recipient chain, and the boolean flag `should_queue` to specify whether the transfer should be queued if it hits the outbound rate limit. If `should_queue` is set to false, the transfer reverts instead of queuing if the rate limit were to be hit.

!!! note
    Using the wrong transfer instruction, i.e. `transfer_lock` for a program that is in `BURNING` mode, will result in an `InvalidMode` error.

Depending on the mode and instruction, the following will be produced in the program logs:

```ts
Program log: Instruction: TransferLock
Program log: Instruction: TransferBurn
```

Outbound transfers are always added to an Outbox via the `insert_into_outbox` method. This method checks the transfer against the configured outbound rate limit amount to determine whether the transfer should be rate-limited. An `OutboxItem` is a Solana Account that holds details of the outbound transfer. The transfer can be released from the Outbox immediately if no rate limit is hit. The transfer can be released from the Outbox immediately unless a rate limit is hit, in which case it will only be released after the delay duration associated with the rate limit has expired.

#### Rate Limit

During the transfer process, the program checks rate limits via the `consume_or_delay` function. The Solana rate-limiting logic is equivalent to the EVM rate-limiting logic.

If the transfer amount fits within the current capacity:

- Reduce the current capacity
- Refill the inbound capacity for the destination chain
- Add the transfer to the Outbox with `release_timestamp` set to the current timestamp, so it can be released immediately.

If the transfer amount does not fit within the current capacity:

- If `shouldQueue = true`, add the transfer to the Outbox with `release_timestamp` set to the current timestamp plus the configured `RATE_LIMIT_DURATION`.
- If `shouldQueue = false`, revert with a `TransferExceedsRateLimit` error

#### Send

The caller then needs to request each Transceiver to send messages via the `release_outbound` instruction. To execute this instruction, the caller needs to pass the account of the Outbox item to be released. The instruction will then verify that the Transceiver is one of the specified senders for the message. Transceivers then send the messages based on the verification backend they are using.

For example, the Wormhole Transceiver will send by calling `post_message` on the Wormhole program, so that the Wormhole Guardians can observe and verify the message.

!!! note
    When `revert_on_delay` is true, the transaction will revert if the release timestamp has not been reached. When `revert_on_delay` is false, the transaction succeeds, but the outbound release is not performed.

The following will be produced in the program logs:

```ts
Program log: Instruction: ReleaseOutbound
```

#### Receive

Similar to EVM, Transceivers vary in how they receive messages since message relaying and verification methods may differ between implementations.

The Wormhole Transceiver receives a verified Wormhole message on Solana via the `receive_message` entrypoint instruction. Callers can use the `receive_wormhole_message` Anchor library function to execute this instruction. The instruction verifies the Wormhole Verified Action Approvals (VAAs) and stores it in a `VerifiedTransceiverMessage` account.

The following will be produced in the program logs:

```ts
Program log: Instruction: ReceiveMessage
```

`redeem` checks the inbound rate limit and places the message in an Inbox. Logic works the same as the outbound rate limit mentioned previously.

The following will be produced in the program logs:

```ts
Program log: Instruction: Redeem
```

#### Mint or Unlock

The inbound transfer is released and the tokens are unlocked or minted to the recipient through either `release_inbound_mint` if the mode is `BURNING`, or `release_inbound_unlock` if the mode is `LOCKING`. Similar to transfer, using the wrong transfer instruction (such as `release_inbound_mint` for a program that is in locking mode) will result in `InvalidMode` error.

!!! note
    When `revert_on_delay` is true, the transaction will revert if the release timestamp has not been reached. When `revert_on_delay` is false, the transaction succeeds, but the minting/unlocking is not performed.

Depending on the mode and instruction, the following will be produced in the program logs:

```ts
Program log: Instruction: ReleaseInboundMint
Program log: Instruction: ReleaseInboundUnlock
```