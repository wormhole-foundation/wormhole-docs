---
title: Managers and Transceivers
description: Explore the roles of Managers and Transceivers in NTT cross-chain token transfers, including key functions, lifecycle events, and rate-limiting mechanisms.
categories: NTT, Transfer
---

# Flow of an NTT Transfer

This page outlines the full lifecycle of an NTT message, covering how transfers are initiated, sent, verified, and completed across supported chains. It highlights the distinct roles of the NTT Manager and Transceivers.

_NTT Managers_ oversee transfers, handle rate-limiting and attestations, and manage multiple transceivers per token. They ensure tokens are locked or burned on the source chain before minting or unlocking on the destination chain.

_Transceivers_ route transfers between source and destination managers, ensuring accurate message delivery and token transfers. They operate independently of Wormhole’s core and can support various verification backends.

## Lifecycle of a Message Overview

This section outlines the high-level NTT message lifecycle common to both EVM-compatible chains and Solana.

1. **Transfer**: The client initiates the transfer, specifying the amount, recipient chain, and address, which is then forwarded to the transceiver on the source chain. Transfers on both source and destination chains can be rate-limited, causing them to be queued if limits are reached.
2. **Send**: The transceiver takes the forwarded message and sends it using its own method (like Wormhole relaying). 
3. **Receive**: An off-chain relayer delivers the message to the destination transceiver, which then processes it and passes it on to the destination manager. It also covers validation through multiple attestations and protections against replay.
4. **Mint or Unlock**: After verification, the tokens are either minted or unlocked to the recipient on the destination chain, completing the transfer.

While the core steps are similar, platform-specific implementation details—such as contract methods and program instructions differ.

## EVM Chains

### Transfer

A client calls on `transfer` to initiate an NTT transfer. The client must specify, at minimum, the transfer amount, the recipient chain, and the recipient address on the recipient chain. `transfer` also supports a flag to specify whether the `NttManager` should queue rate-limited transfers or revert. Clients can also include additional instructions to forward along to the transceiver on the source chain. Depending on the mode set in the initial configuration of the `NttManager` contract, transfers are either "locked" or "burned." Once the transfer has been forwarded to the transceiver, the `NttManager` emits the `TransferSent` event.

### Rate Limit

A transfer can be rate-limited on both the source and destination chains. If a transfer is rate-limited on the source chain and the `shouldQueue` flag is enabled, it is added to an outbound queue. The transfer can be released after the configured `_rateLimitDuration` has expired via the `completeOutboundQueuedTransfer` method. The `OutboundTransferQueued` and `OutboundTransferRateLimited` events are emitted.

If the client attempts to release the transfer from the queue before the expiry of the `rateLimitDuration`, the contract reverts with an `OutboundQueuedTransferStillQueued` error.

Similarly, rate-limited transfers on the destination chain are added to an inbound queue. These transfers can be released from the queue via the `completeInboundQueuedTransfer` method, and the `InboundTransferQueued` event is emitted.

If the client attempts to release the transfer from the queue before the `rateLimitDuration` expires, the contract reverts with an `InboundQueuedTransferStillQueued` error.

To deactivate the rate limiter, set `_rateLimitDuration` to 0 and enable the `_skipRateLimiting` field in the `NttManager` constructor. Configuring this incorrectly will throw an error. If the rate limiter is deactivated, the inbound and outbound rate limits can be set to 0.

### Send

Once the `NttManager` forwards the message to the transceiver, the message is transmitted via the `sendMessage method`. The method signature is enforced by the transceiver but transceivers are free to determine their own implementation for transmitting messages. (e.g. a message routed through the Wormhole transceiver can be sent via Wormhole relaying, a custom relayer, or manually published via the core bridge).

Once the message has been transmitted, the contract emits the `SendTransceiverMessage` event.

### Receive

Once a message has been emitted by a transceiver on the source chain, an off-chain process (for example, a relayer) will forward the message to the corresponding transceiver on the recipient chain. The relayer interacts with the transceiver via an entry point to receive messages. For example, the relayer will call the `receiveWormholeMessage` method on the `WormholeTransceiver` contract to execute the message. The `ReceiveRelayedMessage` event is emitted during this process.

This method should also forward the message to the `NttManager` on the destination chain. Note that the transceiver interface doesn't declare a signature for this method because receiving messages is specific to each transceiver, and a one-size-fits-all solution would be overly restrictive.

The `NttManager` contract allows an M of N threshold for transceiver attestations to determine whether a message can be safely executed. For example, if the threshold requirement is 1, the message will be executed after a single transceiver delivers a valid attestation. If the threshold requirement is 2, the message will only be executed after two transceivers deliver valid attestations. When a transceiver attests to a message, the contract emits the `MessageAttestedTo` event.

NTT implements replay protection, so if a given transceiver attempts to deliver a message attestation twice, the contract reverts with `TransceiverAlreadyAttestedToMessage` error. NTT also implements replay protection against re-executing messages. This check also acts as reentrancy protection as well.

If a message has already been executed, the contract ends execution early and emits the `MessageAlreadyExecuted` event instead of reverting via an error. This mitigates the possibility of race conditions from transceivers attempting to deliver the same message when the threshold is less than the total number of available of transceivers (i.e. threshold < totalTransceivers) and notifies the client (off-chain process) so they don't attempt redundant message delivery.

### Mint or Unlock

Once a transfer has been successfully verified, the tokens can be minted (if the mode is "burning") or unlocked (if the mode is "locking") to the recipient on the destination chain. Note that the source token decimals are bounded between `0` and `TRIMMED_DECIMALS` as enforced in the wire format. The transfer amount is untrimmed (scaled-up) if the destination chain token decimals exceed `TRIMMED_DECIMALS`. Once the appropriate number of tokens have been minted or unlocked to the recipient, the `TransferRedeemed` event is emitted.

## Solana

### Transfer

A client calls the `transfer_lock` or `transfer_burn` instruction based on whether the program is in `LOCKING` or `BURNING` mode. The program mode is set during initialization. When transferring, the client must specify the amount of the transfer, the recipient chain, the recipient address on the recipient chain, and the boolean flag `should_queue` to specify whether the transfer should be queued if it hits the outbound rate limit. If `should_queue` is set to false, the transfer reverts instead of queuing if the rate limit were to be hit.

!!! note
    Using the wrong transfer instruction, i.e. `transfer_lock` for a program that is in `BURNING` mode, will result in an `InvalidMode` error.

Depending on the mode and instruction, the following will be produced in the program logs:

```ts
Program log: Instruction: TransferLock
Program log: Instruction: TransferBurn
```

Outbound transfers are always added to an Outbox via the `insert_into_outbox` method. This method checks the transfer against the configured outbound rate limit amount to determine whether the transfer should be rate-limited. An `OutboxItem` is a Solana Account that holds details of the outbound transfer. The transfer can be released from the Outbox immediately if no rate limit is hit. The transfer can be released from the Outbox immediately unless a rate limit is hit, in which case it will only be released after the delay duration associated with the rate limit has expired.

### Rate Limit

During the transfer process, the program checks rate limits via the `consume_or_delay` function. The Solana rate-limiting logic is equivalent to the EVM rate-limiting logic.

If the transfer amount fits within the current capacity:

- Reduce the current capacity
- Refill the inbound capacity for the destination chain
- Add the transfer to the Outbox with `release_timestamp` set to the current timestamp, so it can be released immediately.

If the transfer amount doesn't fit within the current capacity:

- If `shouldQueue = true`, add the transfer to the Outbox with `release_timestamp` set to the current timestamp plus the configured `RATE_LIMIT_DURATION`.
- If `shouldQueue = false`, revert with a `TransferExceedsRateLimit` error

### Send

The caller then needs to request each transceiver to send messages via the `release_outbound` instruction. To execute this instruction, the caller needs to pass the account of the Outbox item to be released. The instruction will then verify that the transceiver is one of the specified senders for the message. Transceivers then send the messages based on the verification backend they are using.

For example, the Wormhole transceiver will send by calling `post_message` on the Wormhole program, so that the Wormhole Guardians can observe and verify the message.

!!! note
    When `revert_on_delay` is true, the transaction will revert if the release timestamp hasn't been reached. When `revert_on_delay` is false, the transaction succeeds, but the outbound release isn't performed.

The following will be produced in the program logs:

```ts
Program log: Instruction: ReleaseOutbound
```

### Receive

Similar to EVM, transceivers vary in how they receive messages since message relaying and verification methods may differ between implementations.

The Wormhole transceiver receives a verified Wormhole message on Solana via the `receive_message` entrypoint instruction. Callers can use the `receive_wormhole_message` Anchor library function to execute this instruction. The instruction verifies the Wormhole Verified Action Approvals (VAAs) and stores it in a `VerifiedTransceiverMessage` account.

The following will be produced in the program logs:

```ts
Program log: Instruction: ReceiveMessage
```

`redeem` checks the inbound rate limit and places the message in an Inbox. Logic works the same as the outbound rate limit mentioned previously.

The following will be produced in the program logs:

```ts
Program log: Instruction: Redeem
```

### Mint or Unlock

The inbound transfer is released and the tokens are unlocked or minted to the recipient through either `release_inbound_mint` if the mode is `BURNING`, or `release_inbound_unlock` if the mode is `LOCKING`. Similar to transfer, using the wrong transfer instruction (such as `release_inbound_mint` for a program that is in locking mode) will result in `InvalidMode` error.

!!! note
    When `revert_on_delay` is true, the transaction will revert if the release timestamp hasn't been reached. When `revert_on_delay` is false, the transaction succeeds, but the minting/unlocking isn't performed.

Depending on the mode and instruction, the following will be produced in the program logs:

```ts
Program log: Instruction: ReleaseInboundMint
Program log: Instruction: ReleaseInboundUnlock
```