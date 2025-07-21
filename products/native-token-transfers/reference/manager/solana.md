---
title: Native Token Transfers Manager Program (Solana)
description: The NTT Manager Solana program enables cross-chain token transfers, peer registration, rate limiting, and message attestation within the NTT protocol.
categories: NTT, Transfer
---

# NTT Manager Program Reference (Solana)

The NTT Manager program is responsible for managing the token and associated transceivers on Solana. It enables cross-chain token transfers, peer registration, rate limiting, and message attestation for the NTT protocol.

## Structure Overview

The NTT Manager system on Solana is implemented as a single Anchor program. The program provides comprehensive token transfer management capabilities, supports both burning and locking modes, integrates with Solana's Token Program (including Token-2022), and provides rate limiting and security features.

```text
NTT Manager Program
├── Core Instructions
├── Administrative Instructions
├── Rate Limiting
├── Transceiver Management
├── Peer Management
└── Wormhole Integration
```

**Key Components:**

- **NttManager Program**: The primary Solana program that coordinates token transfers, transceiver interactions, and peer communication for the NTT protocol.
- **Core Instructors**: Handles token transfer instructions like transfer, redeem, and release.
- **Administrative Instructions**: Manages ownership, configuration updates, and emergency pause functionality.
- **Rate Limiting**: Implements configurable inbound and outbound transfer limits with time-based capacity replenishment.
- **Transceiver Management**: Maintains a registry of enabled transceivers and allows dynamic registration/deregistration.
- **Peer Management**: Manages authorized cross-chain peers.
- **Wormhole Integration**: Built-in transceiver that connects the program to Wormhole's messaging layer.

## Instructions

### accept_token_authority

Accepts token authority from a pending token authority transfer. *(Defined in NTT Manager)*

```rust
pub fn accept_token_authority(ctx: Context<AcceptTokenAuthority>) -> Result<()>
```

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `token_authority` ++"Signer"++

    The new token authority accepting the transfer.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### accept_token_authority_from_multisig

Accepts token authority from a multisig pending token authority transfer. *(Defined in NTT Manager)*

```rust
pub fn accept_token_authority_from_multisig(
    ctx: Context<AcceptTokenAuthorityFromMultisig>
) -> Result<()>
```

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `multisig` ++"Account<Multisig>"++

    The multisig account acting as the new token authority.

    ---

    `transaction` ++"Account<Transaction>"++

    The multisig transaction account.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### broadcast_wormhole_id

Broadcasts the NTT Manager ID via Wormhole. *(Defined in example-native-token-transfers)*

```rust
pub fn broadcast_wormhole_id(ctx: Context<BroadcastId>) -> Result<()>
```

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for transaction fees.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `wormhole_bridge` ++"mut Account<BridgeData>"++

    The Wormhole bridge data account.

    ---

    `wormhole_message` ++"mut Signer"++

    The Wormhole message account.

    ---

    `wormhole_emitter` ++"Account<EmitterData>"++

    The Wormhole emitter account.

    ---

    `wormhole_sequence` ++"mut Account<SequenceData>"++

    The Wormhole sequence account.

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

    `wormhole_program` ++"Program<WormholeCoreBridge>"++

    The Wormhole core bridge program.

### broadcast_wormhole_peer

Broadcasts peer information via Wormhole. *(Defined in example-native-token-transfers)*

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

    Similar to `broadcast_wormhole_id` with additional peer-specific accounts.

### claim_ownership

Claims ownership of the NTT Manager after a transfer has been initiated. *(Defined in example-native-token-transfers)*

```rust
pub fn claim_ownership(ctx: Context<ClaimOwnership>) -> Result<()>
```

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `new_owner` ++"Signer"++

    The new owner claiming ownership.

### claim_token_authority

Claims token authority after a transfer has been initiated. *(Defined in example-native-token-transfers)*

```rust
pub fn claim_token_authority(ctx: Context<ClaimTokenAuthority>) -> Result<()>
```

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `token_authority` ++"Signer"++

    The new token authority claiming authority.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### claim_token_authority_to_multisig

Claims token authority to a multisig account. *(Defined in example-native-token-transfers)*

```rust
pub fn claim_token_authority_to_multisig(
    ctx: Context<ClaimTokenAuthorityToMultisig>
) -> Result<()>
```

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `multisig` ++"Account<Multisig>"++

    The multisig account claiming token authority.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### deregister_transceiver

Removes a transceiver from the enabled set. *(Defined in example-native-token-transfers)*

```rust
pub fn deregister_transceiver(ctx: Context<DeregisterTransceiver>) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `registered_transceiver` ++"mut Account<RegisteredTransceiver>"++

    The registered transceiver account to deregister.

### initialize

Initializes the NTT Manager program with configuration parameters. *(Defined in example-native-token-transfers)*

```rust
pub fn initialize(ctx: Context<Initialize>, args: InitializeArgs) -> Result<()>
```

??? interface "Parameters"

    `args` ++"InitializeArgs"++

    The initialization arguments.

    ??? child "`InitializeArgs` type"

        `chain_id` ++"u16"++

        The chain ID for this deployment.
        
        ---

        `limit` ++"u64"++

        The initial rate limit for transfers.
        
        ---

        `mode` ++"Mode"++

        The mode (Burning or Locking) for token handling.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for initialization.

    ---

    `deployer` ++"Signer"++

    The program deployer (must be upgrade authority).

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account to initialize.

    ---

    `mint` ++"InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `rate_limit` ++"mut Account<OutboxRateLimit>"++

    The outbound rate limit account.

    ---

    `token_authority` ++"UncheckedAccount"++

    The token authority account.

    ---

    `custody` ++"mut InterfaceAccount<TokenAccount>"++

    The custody account (for locking mode).

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

    ---

    `associated_token_program` ++"Program<AssociatedToken>"++

    The associated token program.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### initialize_lut

Initializes a lookup table for the program. *(Defined in example-native-token-transfers)*

```rust
pub fn initialize_lut(ctx: Context<InitializeLUT>, recent_slot: u64) -> Result<()>
```

??? interface "Parameters"

    `recent_slot` ++"u64"++

    A recent slot number for lookup table initialization.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for lookup table creation.

    ---

    `lut` ++"mut UncheckedAccount"++

    The lookup table account to initialize.

    ---

    `lut_authority` ++"UncheckedAccount"++

    The lookup table authority.

    ---

    `address_lookup_table_program` ++"Program<AddressLookupTableProgram>"++

    The address lookup table program.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### mark_outbox_item_as_released

Marks an outbox item as released by a specific transceiver. *(Defined in example-native-token-transfers)*

```rust
pub fn mark_outbox_item_as_released(ctx: Context<MarkOutboxItemAsReleased>) -> Result<bool>
```

??? interface "Returns"

    `released` ++"bool"++

    Whether the item was successfully marked as released.

??? interface "Accounts"

    `transceiver` ++"Signer"++

    The transceiver marking the item as released.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `outbox_item` ++"mut Account<OutboxItem>"++

    The outbox item to mark as released.

    ---

    `registered_transceiver` ++"Account<RegisteredTransceiver>"++

    The registered transceiver account.

### receive_wormhole_message

Receives and processes a message from Wormhole. *(Defined in example-native-token-transfers)*

```rust
pub fn receive_wormhole_message(ctx: Context<ReceiveMessage>) -> Result<()>
```

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for message processing.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `peer` ++"Account<NttManagerPeer>"++

    The peer account for the sending chain.

    ---

    `inbox_item` ++"mut Account<InboxItem>"++

    The inbox item account to create.

    ---

    `inbox_rate_limit` ++"mut Account<InboxRateLimit>"++

    The inbound rate limit account.

    ---

    `vaa` ++"Account<PostedVaa<TransceiverMessage>>"++

    The verified VAA containing the message.

    ---

    `transceiver_message` ++"mut UncheckedAccount"++

    The transceiver message account.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### redeem

Redeems a transfer by consuming a verified message. *(Defined in example-native-token-transfers)*

```rust
pub fn redeem(ctx: Context<Redeem>, args: RedeemArgs) -> Result<()>
```

??? interface "Parameters"

    `args` ++"RedeemArgs"++

    The redeem arguments (currently empty struct).

??? interface "Accounts"

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `transceiver_message` ++"Account<ValidatedTransceiverMessage<NativeTokenTransfer>>"++

    The validated transceiver message.

    ---

    `inbox_item` ++"mut Account<InboxItem>"++

    The inbox item being redeemed.

### register_transceiver

Registers a new transceiver with the NTT Manager. *(Defined in example-native-token-transfers)*

```rust
pub fn register_transceiver(ctx: Context<RegisterTransceiver>) -> Result<()>
```

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for registration.

    ---

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `registered_transceiver` ++"mut Account<RegisteredTransceiver>"++

    The registered transceiver account to create.

    ---

    `transceiver` ++"UncheckedAccount"++

    The transceiver program to register.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### release_inbound_mint

Releases an inbound transfer by minting tokens to the recipient. *(Defined in example-native-token-transfers)*

```rust
pub fn release_inbound_mint(
    ctx: Context<ReleaseInboundMint>,
    args: ReleaseInboundArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"ReleaseInboundArgs"++

    The release arguments.

    ??? child "`ReleaseInboundArgs` type"

        `revert_on_delay` ++"bool"++

        Whether to revert if the transfer is still in delay.

??? interface "Accounts"

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `inbox_item` ++"mut Account<InboxItem>"++

    The inbox item to release.

    ---

    `inbox_rate_limit` ++"mut Account<InboxRateLimit>"++

    The inbound rate limit account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `recipient_token` ++"mut InterfaceAccount<TokenAccount>"++

    The recipient's token account.

    ---

    `token_authority` ++"UncheckedAccount"++

    The token authority account.

    ---

    `custody` ++"mut InterfaceAccount<TokenAccount>"++

    The custody account.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### release_inbound_unlock

Releases an inbound transfer by unlocking tokens from custody. *(Defined in example-native-token-transfers)*

```rust
pub fn release_inbound_unlock(
    ctx: Context<ReleaseInboundUnlock>,
    args: ReleaseInboundArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"ReleaseInboundArgs"++

    The release arguments.

    ??? child "`ReleaseInboundArgs` type"

        `revert_on_delay` ++"bool"++

        Whether to revert if the transfer is still in delay.

??? interface "Accounts"

    Similar to `release_inbound_mint` but unlocks tokens from custody instead of minting.

### release_wormhole_outbound

Releases an outbound transfer via Wormhole. *(Defined in example-native-token-transfers)*

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

        The recipient chain ID.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for the release.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `outbox_item` ++"mut Account<OutboxItem>"++

    The outbox item to release.

    ---

    `transceiver_message` ++"mut UncheckedAccount"++

    The transceiver message account.

    ---

    Wormhole-specific accounts for message posting...

### revert_token_authority

Reverts a pending token authority change. *(Defined in example-native-token-transfers)*

```rust
pub fn revert_token_authority(ctx: Context<RevertTokenAuthority>) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

### set_inbound_limit

Sets the inbound transfer rate limit. *(Defined in example-native-token-transfers)*

```rust
pub fn set_inbound_limit(
    ctx: Context<SetInboundLimit>,
    args: SetInboundLimitArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"SetInboundLimitArgs"++

    The inbound limit arguments.

    ??? child "`SetInboundLimitArgs` type"

        `limit` ++"u64"++

        The new inbound rate limit.

        ---

        `chain_id` ++"ChainId"++

        The chain ID to set the limit for.

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `rate_limit` ++"mut Account<InboxRateLimit>"++

    The inbound rate limit account.

### set_outbound_limit

Sets the outbound transfer rate limit. *(Defined in example-native-token-transfers)*

```rust
pub fn set_outbound_limit(
    ctx: Context<SetOutboundLimit>,
    args: SetOutboundLimitArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"SetOutboundLimitArgs"++

    The outbound limit arguments.

    ??? child "`SetOutboundLimitArgs` type"

        `limit` ++"u64"++

        The new outbound rate limit.

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `rate_limit` ++"mut Account<OutboxRateLimit>"++

    The outbound rate limit account.

### set_paused

Sets the pause state of the program. *(Defined in example-native-token-transfers)*

```rust
pub fn set_paused(ctx: Context<SetPaused>, pause: bool) -> Result<()>
```

??? interface "Parameters"

    `pause` ++"bool"++

    Whether to pause or unpause the program.

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

### set_peer

Sets a peer NTT Manager on another chain. *(Defined in example-native-token-transfers)*

```rust
pub fn set_peer(ctx: Context<SetPeer>, args: SetPeerArgs) -> Result<()>
```

??? interface "Parameters"

    `args` ++"SetPeerArgs"++

    The peer arguments.

    ??? child "`SetPeerArgs` type"

        `chain_id` ++"ChainId"++

        The chain ID of the peer.

        ---

        `address` ++"[u8; 32]"++

        The address of the peer NTT Manager.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for peer registration.

    ---

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `peer` ++"mut Account<NttManagerPeer>"++

    The peer account to create or update.

    ---

    `inbox_rate_limit` ++"mut Account<InboxRateLimit>"++

    The inbound rate limit account for the peer.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### set_threshold

Sets the threshold number of transceivers required for message approval. *(Defined in example-native-token-transfers)*

```rust
pub fn set_threshold(ctx: Context<SetThreshold>, threshold: u8) -> Result<()>
```

??? interface "Parameters"

    `threshold` ++"u8"++

    The new threshold value.

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

### set_token_authority

Sets the token authority using a checked transfer process. *(Defined in example-native-token-transfers)*

```rust
pub fn set_token_authority(ctx: Context<SetTokenAuthorityChecked>) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `new_token_authority` ++"UncheckedAccount"++

    The new token authority account.

### set_token_authority_one_step_unchecked

Sets the token authority in a single step without checks. *(Defined in example-native-token-transfers)*

```rust
pub fn set_token_authority_one_step_unchecked(
    ctx: Context<SetTokenAuthorityUnchecked>
) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `new_token_authority` ++"UncheckedAccount"++

    The new token authority account.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

### set_wormhole_peer

Sets a Wormhole transceiver peer on another chain. *(Defined in example-native-token-transfers)*

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

    `owner` ++"Signer"++

    The program owner.

    ---

    `config` ++"Account<Config>"++

    The program configuration account.

    ---

    `peer` ++"mut Account<WormholeTransceiverPeer>"++

    The Wormhole transceiver peer account.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### transfer_burn

Initiates an outbound transfer by burning tokens. *(Defined in example-native-token-transfers)*

```rust
pub fn transfer_burn(
    ctx: Context<TransferBurn>,
    args: TransferArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"TransferArgs"++

    The transfer arguments.

    ??? child "`TransferArgs` type"

        `amount` ++"u64"++

        The amount of tokens to transfer.

        ---

        `recipient_chain` ++"ChainId"++

        The recipient chain ID.

        ---

        `recipient_address` ++"[u8; 32]"++

        The recipient address on the target chain.

        ---

        `should_queue` ++"bool"++

        Whether to queue the transfer if rate limited.

??? interface "Accounts"

    `payer` ++"mut Signer"++

    The account paying for the transfer.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `from` ++"mut InterfaceAccount<TokenAccount>"++

    The sender's token account.

    ---

    `mint` ++"mut InterfaceAccount<Mint>"++

    The mint account for the managed token.

    ---

    `outbox_item` ++"mut Account<OutboxItem>"++

    The outbox item account to create.

    ---

    `outbox_rate_limit` ++"mut Account<OutboxRateLimit>"++

    The outbound rate limit account.

    ---

    `session_authority` ++"UncheckedAccount"++

    The session authority for the transfer.

    ---

    `token_authority` ++"UncheckedAccount"++

    The token authority account.

    ---

    `token_program` ++"Interface<TokenInterface>"++

    The token program interface.

    ---

    `system_program` ++"Program<System>"++

    The system program.

### transfer_lock

Initiates an outbound transfer by locking tokens in custody. *(Defined in example-native-token-transfers)*

```rust
pub fn transfer_lock(
    ctx: Context<TransferLock>,
    args: TransferArgs
) -> Result<()>
```

??? interface "Parameters"

    `args` ++"TransferArgs"++

    The transfer arguments.

    ??? child "`TransferArgs` type"

        `amount` ++"u64"++

        The amount of tokens to transfer.

        ---

        `recipient_chain` ++"ChainId"++

        The recipient chain ID.

        ---

        `recipient_address` ++"[u8; 32]"++

        The recipient address on the target chain.

        ---

        `should_queue` ++"bool"++

        Whether to queue the transfer if rate limited.

??? interface "Accounts"

    Similar to `transfer_burn` but locks tokens in custody instead of burning.

### transfer_ownership

Initiates a two-step ownership transfer process. *(Defined in example-native-token-transfers)*

```rust
pub fn transfer_ownership(ctx: Context<TransferOwnership>) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The current program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `new_owner` ++"UncheckedAccount"++

    The proposed new owner.

### transfer_ownership_one_step_unchecked

Transfers ownership in a single step without verification. *(Defined in example-native-token-transfers)*

```rust
pub fn transfer_ownership_one_step_unchecked(ctx: Context<TransferOwnership>) -> Result<()>
```

??? interface "Accounts"

    `owner` ++"Signer"++

    The current program owner.

    ---

    `config` ++"mut Account<Config>"++

    The program configuration account.

    ---

    `new_owner` ++"UncheckedAccount"++

    The new owner.

### version

Returns the program version string. *(Defined in example-native-token-transfers)*

```rust
pub fn version(_ctx: Context<Version>) -> Result<String>
```

??? interface "Returns"

    `version` ++"String"++

    The version string ("3.0.0").

## Data Structures

### Config

The main program configuration account. *(Defined in config.rs)*

```rust
pub struct Config {
    pub bump: u8,
    pub owner: Pubkey,
    pub pending_owner: Option<Pubkey>,
    pub mint: Pubkey,
    pub token_program: Pubkey,
    pub mode: Mode,
    pub chain_id: ChainId,
    pub next_transceiver_id: u8,
    pub threshold: u8,
    pub enabled_transceivers: Bitmap,
    pub paused: bool,
    pub custody: Pubkey,
}
```

??? interface "Fields"

    `bump` ++"u8"++

    The canonical bump for the config account.

    ---

    `owner` ++"Pubkey"++

    The owner of the program.

    ---

    `pending_owner` ++"Option<Pubkey>"++

    The pending owner (before claiming ownership).

    ---

    `mint` ++"Pubkey"++

    The mint address of the token managed by this program.

    ---

    `token_program` ++"Pubkey"++

    The address of the token program (Token or Token-2022).

    ---

    `mode` ++"Mode"++

    The mode that this program is running in (Burning or Locking).

    ---

    `chain_id` ++"ChainId"++

    The chain ID of the chain that this program is running on.

    ---

    `next_transceiver_id` ++"u8"++

    The next transceiver ID to use when registering a transceiver.

    ---

    `threshold` ++"u8"++

    The number of transceivers that must attest to a transfer.

    ---

    `enabled_transceivers` ++"Bitmap"++

    Bitmap of enabled transceivers.

    ---

    `paused` ++"bool"++

    Whether the program is paused.

    ---

    `custody` ++"Pubkey"++

    The custody account that holds tokens in locking mode.

### Mode

The operating mode of the NTT Manager. *(Defined in ntt-messages)*

```rust
pub enum Mode {
    Locking,
    Burning,
}
```

??? interface "Variants"

    `Locking`

    Tokens are locked in custody and unlocked on release.

    ---

    `Burning`

    Tokens are burned on transfer and minted on release.

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

## Errors

### BadAmountAfterBurn

Error when the amount after burning doesn't match expected. *(Defined in error.rs)*

```rust
BadAmountAfterBurn
```

### BadAmountAfterTransfer

Error when the amount after transfer doesn't match expected. *(Defined in error.rs)*

```rust
BadAmountAfterTransfer
```

### BitmapIndexOutOfBounds

Error when bitmap index is out of bounds. *(Defined in error.rs)*

```rust
BitmapIndexOutOfBounds
```

### CantReleaseYet

Error when trying to release a transfer that is still in delay. *(Defined in error.rs)*

```rust
CantReleaseYet
```

### DisabledTransceiver

Error when attempting to use a disabled transceiver. *(Defined in error.rs)*

```rust
DisabledTransceiver
```

### IncorrectRentPayer

Error when the rent payer is incorrect. *(Defined in error.rs)*

```rust
IncorrectRentPayer
```

### InvalidChainId

Error when an invalid chain ID is provided. *(Defined in error.rs)*

```rust
InvalidChainId
```

### InvalidDeployer

Error when the deployer is not authorized. *(Defined in error.rs)*

```rust
InvalidDeployer
```

### InvalidMintAuthority

Error when the mint authority is invalid. *(Defined in error.rs)*

```rust
InvalidMintAuthority
```

### InvalidMode

Error when an invalid mode is specified. *(Defined in error.rs)*

```rust
InvalidMode
```

### InvalidMultisig

Error when a multisig account is invalid. *(Defined in error.rs)*

```rust
InvalidMultisig
```

### InvalidNttManagerPeer

Error when the NTT Manager peer is invalid. *(Defined in error.rs)*

```rust
InvalidNttManagerPeer
```

### InvalidPendingOwner

Error when the pending owner is invalid. *(Defined in error.rs)*

```rust
InvalidPendingOwner
```

### InvalidPendingTokenAuthority

Error when the pending token authority is invalid. *(Defined in error.rs)*

```rust
InvalidPendingTokenAuthority
```

### InvalidRecipientAddress

Error when the recipient address is invalid. *(Defined in error.rs)*

```rust
InvalidRecipientAddress
```

### InvalidTransceiverPeer

Error when the transceiver peer is invalid. *(Defined in error.rs)*

```rust
InvalidTransceiverPeer
```

### InvalidTransceiverProgram

Error when the transceiver program is invalid. *(Defined in error.rs)*

```rust
InvalidTransceiverProgram
```

### MessageAlreadySent

Error when attempting to send a message that has already been sent. *(Defined in error.rs)*

```rust
MessageAlreadySent
```

### NoRegisteredTransceivers

Error when no transceivers are registered. *(Defined in error.rs)*

```rust
NoRegisteredTransceivers
```

### NotPaused

Error when expecting the program to be paused but it's not. *(Defined in error.rs)*

```rust
NotPaused
```

### OverflowExponent

Error when there's an overflow in exponent calculation. *(Defined in error.rs)*

```rust
OverflowExponent
```

### OverflowScaledAmount

Error when there's an overflow in scaled amount calculation. *(Defined in error.rs)*

```rust
OverflowScaledAmount
```

### Paused

Error when the program is paused and operation is not allowed. *(Defined in error.rs)*

```rust
Paused
```

### ThresholdTooHigh

Error when the threshold is set too high. *(Defined in error.rs)*

```rust
ThresholdTooHigh
```

### TransferAlreadyRedeemed

Error when attempting to redeem a transfer that has already been redeemed. *(Defined in error.rs)*

```rust
TransferAlreadyRedeemed
```

### TransferCannotBeRedeemed

Error when a transfer cannot be redeemed. *(Defined in error.rs)*

```rust
TransferCannotBeRedeemed
```

### TransferExceedsRateLimit

Error when a transfer exceeds the rate limit. *(Defined in error.rs)*

```rust
TransferExceedsRateLimit
```

### TransferNotApproved

Error when a transfer has not been approved by enough transceivers. *(Defined in error.rs)*

```rust
TransferNotApproved
```

### ZeroThreshold

Error when the threshold is set to zero. *(Defined in error.rs)*

```rust
ZeroThreshold
```
