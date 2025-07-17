---
title: Native Token Transfers Transceiver Program (Solana)
description: The NTT Transceiver program handles message transmission and verification across chains as part of the Native Token Transfers protocol on Solana.
categories: NTT, Transfer
---

# Transceivers Program Reference (Solana)

The NTT Transceiver program is responsible for sending and receiving messages between chains as part of the NTT protocol on Solana. It supports multiple verification methods and operates alongside the NTT Manager program to enable cross-chain token transfers.

## Structure Overview

The NTT Transceiver system on Solana is implemented as a standalone Anchor program that provides Wormhole-based message verification and relay capabilities. The transceiver acts as a bridge between the NTT Manager and the Wormhole protocol, handling cross-chain message transmission and verification.

```text
NTT Transceiver Program
├── Wormhole Integration
│   ├── Message Transmission
│   ├── Message Reception & Verification  
│   ├── Peer Management
│   └── Broadcasting Capabilities
├── Admin Functions
└── Message Processing
```

**Key Components:**

- **NTT Transceiver Program**: Transmits, receives, and verifies NTT messages between chains, integrating with the Wormhole messaging layer.
- **Wormhole Integration**: Enables native message transmission, reception, and verification using the Wormhole protocol.
- **Administrative Functions**: Provides interfaces for setting up peer configurations and managing broadcast behavior.
- **Message Processing**: Automatically processes inbound and outbound messages and forwards valid messages to the NTT Manager.

## Instructions

### broadcast_wormhole_id

Broadcasts the transceiver ID via Wormhole to announce presence on the network. *(Defined in ntt-transceiver)*

```rust
pub fn broadcast_wormhole_id(ctx: Context<BroadcastId>) -> Result<()>
```

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for the broadcast transaction.

    ---

    `config` ++"Account<Config>"++

    The NTT Manager configuration account.

    ---

    `mint` ++"InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `wormhole_bridge` ++"mut Account<BridgeData>"++

    The Wormhole bridge data account.

    ---

    `wormhole_message` ++"mut Signer"++

    The Wormhole message account to create.

    ---

    `wormhole_emitter` ++"Account<EmitterData>"++

    The Wormhole emitter account.

    ---

    `wormhole_sequence` ++"mut Account<SequenceData>"++

    The Wormhole sequence tracking account.

    ---

    `wormhole_fee_collector` ++"mut Account<FeeCollectorData>"++

    The Wormhole fee collector account.

    ---

    `clock` ++"Sysvar<Clock>"++

    The clock sysvar.

    ---

    `rent` ++"Sysvar<Rent>"++

    The rent sysvar.

    ---

    `system_program` ++"Program<System>"++

    The system program.

    ---

    `ntt_program` ++"Program<NttProgram>"++

    The NTT Manager program.

    ---

    `wormhole_program` ++"Program<WormholeProgram>"++

    The Wormhole core bridge program.

### broadcast_wormhole_peer

Broadcasts peer transceiver information via Wormhole. *(Defined in ntt-transceiver)*

```rust
pub fn broadcast_wormhole_peer(
    ctx: Context<BroadcastPeer>,
    args: BroadcastPeerArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"BroadcastPeerArgs"++

    The broadcast peer arguments.

    ??? child "`BroadcastPeerArgs` type"

        `chain_id` ++"ChainId"++

        The chain ID to broadcast peer information for.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for the broadcast transaction.

    ---

    `config` ++"Account<Config>"++

    The NTT Manager configuration account.

    ---

    `peer` ++"Account<WormholeTransceiverPeer>"++

    The peer transceiver account containing peer information.

    ---

    `wormhole_bridge` ++"mut Account<BridgeData>"++

    The Wormhole bridge data account.

    ---

    `wormhole_message` ++"mut Signer"++

    The Wormhole message account to create.

    ---

    `wormhole_emitter` ++"Account<EmitterData>"++

    The Wormhole emitter account.

    ---

    `wormhole_sequence` ++"mut Account<SequenceData>"++

    The Wormhole sequence tracking account.

    ---

    `wormhole_fee_collector` ++"mut Account<FeeCollectorData>"++

    The Wormhole fee collector account.

    ---

    `clock` ++"Sysvar<Clock>"++

    The clock sysvar.

    ---

    `rent` ++"Sysvar<Rent>"++

    The rent sysvar.

    ---

    `system_program` ++"Program<System>"++

    The system program.

    ---

    `ntt_program` ++"Program<NttProgram>"++

    The NTT Manager program.

    ---

    `wormhole_program` ++"Program<WormholeProgram>"++

    The Wormhole core bridge program.

### receive_wormhole_message

Receives and processes an inbound message from Wormhole. *(Defined in ntt-transceiver)*

```rust
pub fn receive_wormhole_message(ctx: Context<ReceiveMessage>) -> Result<()>
```

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for message processing.

    ---

    `config` ++"mut Account<Config>"++

    The NTT Manager configuration account.

    ---

    `peer` ++"Account<WormholeTransceiverPeer>"++

    The peer transceiver account for verification.

    ---

    `vaa` ++"Account<PostedVaa<TransceiverMessage>>"++

    The verified VAA (Verifiable Action Approval) containing the message.

    ---

    `transceiver_message` ++"mut UncheckedAccount"++

    The transceiver message account to create.

    ---

    `ntt_program` ++"Program<NttProgram>"++

    The NTT Manager program.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### release_wormhole_outbound

Releases an outbound message via Wormhole. *(Defined in ntt-transceiver)*

```rust
pub fn release_wormhole_outbound(
    ctx: Context<ReleaseOutbound>,
    args: ReleaseOutboundArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"ReleaseOutboundArgs"++

    The release outbound arguments.

    ??? child "`ReleaseOutboundArgs` type"

        `recipient_chain` ++"ChainId"++

        The chain ID of the recipient chain.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for the release transaction.

    ---

    `config` ++"Account<Config>"++

    The NTT Manager configuration account.

    ---

    `outbox_item` ++"mut Account<OutboxItem>"++

    The outbox item to be released.

    ---

    `registered_transceiver` ++"Account<RegisteredTransceiver>"++

    The registered transceiver account.

    ---

    `transceiver_message` ++"mut UncheckedAccount"++

    The transceiver message account to create.

    ---

    `wormhole_bridge` ++"mut Account<BridgeData>"++

    The Wormhole bridge data account.

    ---

    `wormhole_message` ++"mut Signer"++

    The Wormhole message account to create.

    ---

    `wormhole_emitter` ++"Account<EmitterData>"++

    The Wormhole emitter account.

    ---

    `wormhole_sequence` ++"mut Account<SequenceData>"++

    The Wormhole sequence tracking account.

    ---

    `wormhole_fee_collector` ++"mut Account<FeeCollectorData>"++

    The Wormhole fee collector account.

    ---

    `clock` ++"Sysvar<Clock>"++

    The clock sysvar.

    ---

    `rent` ++"Sysvar<Rent>"++

    The rent sysvar.

    ---

    `system_program` ++"Program<System>"++

    The system program.

    ---

    `ntt_program` ++"Program<NttProgram>"++

    The NTT Manager program.

    ---

    `wormhole_program` ++"Program<WormholeProgram>"++

    The Wormhole core bridge program.

### set_wormhole_peer

Sets or updates a peer transceiver on another chain. *(Defined in ntt-transceiver)*

```rust
pub fn set_wormhole_peer(
    ctx: Context<SetTransceiverPeer>,
    args: SetTransceiverPeerArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"SetTransceiverPeerArgs"++

    The transceiver peer arguments.

    ??? child "`SetTransceiverPeerArgs` type"

        `chain_id` ++"ChainId"++

        The chain ID of the peer.

        ---

        `address` ++"[u8; 32]"++

        The address of the peer transceiver.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for peer configuration.

    ---

    `owner` ++"Signer"++

    The owner of the NTT Manager (must authorize peer changes).

    ---

    `config` ++"Account<Config>"++

    The NTT Manager configuration account.

    ---

    `peer` ++"mut Account<WormholeTransceiverPeer>"++

    The peer account to create or update.

    ---

    `system_program` ++"Program<System>"++

    The system program.

    ---

    `ntt_program` ++"Program<NttProgram>"++

    The NTT Manager program.

### transceiver_type

Returns the type identifier for this transceiver. *(Defined in ntt-transceiver)*

```rust
pub fn transceiver_type(_ctx: Context<TransceiverType>) -> Result<String>
```

??? interface "Returns"

    `transceiver_type` ++"String"++

    The transceiver type identifier ("wormhole").

??? interface "Accounts"

    No accounts required (empty context).

## Data Structures

### WormholeTransceiverPeer

Stores information about a peer transceiver on another chain. *(Defined in peer.rs)*

```rust
pub struct WormholeTransceiverPeer {
    pub bump: u8,
    pub chain_id: ChainId,
    pub address: [u8; 32],
}
```

??? interface "Fields"

    `bump` ++"u8"++

    The canonical bump for the peer account.

    ---

    `chain_id` ++"ChainId"++

    The chain ID of the peer.

    ---

    `address` ++"[u8; 32]"++

    The address of the peer transceiver.

### TransceiverMessage

The message format used for cross-chain communication. *(Defined in messages.rs)*

```rust
pub struct TransceiverMessage<P> {
    pub source_ntt_manager: [u8; 32],
    pub recipient_ntt_manager: [u8; 32],
    pub ntt_manager_payload: P,
    pub transceiver_payload: Vec<u8>,
}
```

??? interface "Fields"

    `source_ntt_manager` ++"[u8; 32]"++

    The address of the source NTT Manager.

    ---

    `recipient_ntt_manager` ++"[u8; 32]"++

    The address of the recipient NTT Manager.

    ---

    `ntt_manager_payload` ++"P"++

    The payload specific to the NTT Manager.

    ---

    `transceiver_payload` ++"Vec<u8>"++

    Additional payload specific to the transceiver.

### ChainId

A Wormhole chain identifier. *(Defined in ntt-messages)*

```rust
pub struct ChainId {
    pub id: u16,
}
```

??? interface "Fields"

    `id` ++"u16"++

    The numeric chain ID.

### BroadcastPeerArgs

Arguments for broadcasting peer information. *(Defined in broadcast_peer.rs)*

```rust
pub struct BroadcastPeerArgs {
    pub chain_id: ChainId,
}
```

??? interface "Fields"

    `chain_id` ++"ChainId"++

    The chain ID to broadcast peer information for.

### ReleaseOutboundArgs

Arguments for releasing outbound messages. *(Defined in release_outbound.rs)*

```rust
pub struct ReleaseOutboundArgs {
    pub recipient_chain: ChainId,
}
```

??? interface "Fields"

    `recipient_chain` ++"ChainId"++

    The chain ID of the recipient chain.

### SetTransceiverPeerArgs

Arguments for setting transceiver peers. *(Defined in admin.rs)*

```rust
pub struct SetTransceiverPeerArgs {
    pub chain_id: ChainId,
    pub address: [u8; 32],
}
```

??? interface "Fields"

    `chain_id` ++"ChainId"++

    The chain ID of the peer.

    ---

    `address` ++"[u8; 32]"++

    The address of the peer transceiver.

## Constants

### TRANSCEIVER_TYPE

The type identifier for this transceiver implementation. *(Defined in lib.rs)*

```rust
pub const TRANSCEIVER_TYPE: &str = "wormhole";
```
