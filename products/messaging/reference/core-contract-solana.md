---
title: Core Contract (Solana)
description: Reference for the Wormhole Core program on Solana. Covers architecture, PDA accounts, and instructions for posting, verifying, and processing VAAs.
categories: Basics
---

# Core Contract (Solana)

The [Wormhole Core Program on Solana](https://github.com/wormhole-foundation/wormhole/blob/main/solana/bridge/program/src/lib.rs){target=\_blank} is a native Solana program responsible for posting, verifying, and relaying Wormhole messages (VAAs). It implements core messaging functionality, guardian set updates, and upgradeability.

## Structure Overview

The Wormhole Core program on Solana is implemented using modular Rust files. Logic is separated across instruction dispatch, account definitions, core types, and signature verification.

```text
lib.rs
├── instructions.rs
├── accounts.rs
├── api.rs
│   ├── post_message
│   ├── verify_signatures
│   ├── post_vaa
│   ├── upgrade_contract
│   └── upgrade_guardian_set
├── types.rs
└── vaa.rs
```

**Key Components:**

 - **lib.rs**: Program entry point and instruction dispatcher. Registers all handlers and exposes the on-chain processor.
 - **instructions.rs**: Defines the WormholeInstruction enum and maps it to individual instruction handlers.
 - **accounts.rs**: Specifies the account constraints and validation logic for each instruction.
 - **api.rs**: Contains the main logic for processing instructions such as message posting, VAA verification, upgrades, and governance actions.
 - **types.rs**: Defines shared structs and enums used throughout the program, including configuration and GuardianSet formats.
 - **vaa.rs**: Implements VAA parsing, hashing, and signature-related logic used to verify Wormhole messages.
 - **error.rs** (not listed above): Defines custom error types used across the program for precise failure handling.
 - **wasm.rs** (not listed above): Provides WebAssembly bindings for testing and external tooling; not used on-chain.

## Functions

### initialize

Initializes the Wormhole Core contract on Solana with a guardian set and fee configuration. This should be called only once at deployment time. *(Defined in api/initialize.rs)*

```rust
initialize(
    payer: Pubkey,
    fee: u64,
    guardian_set_expiration_time: u32,
    initial_guardians: &[[u8; 20]]
)
```

??? interface "Accounts"

    - `Bridge`: PDA to store global configuration.
    - `GuardianSet`: PDA for guardian set at index 0.
    - `FeeCollector`: PDA to collect message posting fees.
    - `Payer`: Funds account creation.
    - `Clock`, `Rent`, `SystemProgram`: Solana system accounts.

??? interface "Parameters"

    `fee` ++"u64"++

    Fee in lamports required to post messages.

    ---

    `guardian_set_expiration_time` ++"u32"++

    Time in seconds after which the guardian set expires.

    ---

    `initial_guardians` ++"[[u8; 20]]"++

    List of guardian public key hashes (Ethereum-style addresses).

### post_message

Posts a Wormhole message to the Solana Core contract. *(Defined in api/post_message.rs)*

```rust
PostMessage {
    nonce: u32,
    payload: Vec<u8>,
    consistency_level: u8
}
```

??? interface "Accounts"

    - `Bridge`: PDA for global config.
    - `Message`: PDA where the posted message will be stored.
    - `Emitter`: The emitting account (must sign).
    - `Sequence`: PDA tracking the emitter’s message sequence.
    - `Payer`: Pays for account creation and fees.
    - `FeeCollector`: PDA that collects message fees.
    - `Clock`, `Rent`, `SystemProgram`: Solana system accounts.

??? interface "Parameters"

    `nonce` ++"u32"++

    Unique nonce to disambiguate messages with the same payload.

    ---

    `payload` ++"Vec<u8>"++

    The arbitrary message payload to be posted.

    ---

    `consistency_level` ++"u8"++

    Level of finality required before the message is processed.

    `1` = Confirmed, `2` = Finalized.

### post_message_unreliable

Posts a Wormhole message without requiring reliable delivery. Used for lightweight publishing when finality isn't critical. *(Defined in api/post_message_unreliable.rs)*

```rust
PostMessageUnreliable {
    nonce: u32,
    payload: Vec<u8>,
    consistency_level: u8
}
```

??? interface "Accounts"

    - `Bridge`: PDA for global config.
    - `Message`: PDA where the posted message will be stored.
    - `Emitter`: The emitting account (must sign).
    - `Sequence`: PDA tracking the emitter’s message sequence.
    - `Payer`: Pays for account creation and fees.
    - `FeeCollector`: PDA that collects message fees.
    - `Clock`, `Rent`, `SystemProgram`: Solana system accounts.

??? interface "Parameters"

    `nonce` ++"u32"++

    Unique nonce to disambiguate messages with the same payload.

    ---

    `payload` ++"Vec<u8>"++

    The arbitrary message payload to be posted.

    ---

    `consistency_level` ++"u8"++

    Level of finality required before the message is processed. `1` = Confirmed, `2` = Finalized.

### verify_signatures

Verifies Guardian signatures over a VAA body hash. This is the first step in VAA processing and is required before posting the VAA. *(Defined in api/verify_signatures.rs)*

```rust
VerifySignatures {
    signers: [i8; 19]
}
```

??? interface "Accounts"

    - `Payer`: Pays for account creation and fees.
    - `GuardianSet`: PDA holding the current guardian set.
    - `SignatureSet`: PDA that will store the verified signature data.
    - `InstructionsSysvar`: Required to access prior instructions (e.g., secp256k1 sigverify).
    - `Rent`, `SystemProgram`: Solana system accounts.

??? interface "Parameters"

    `signers` ++"[i8; 19]"++

    A mapping from guardian index to its position in the instruction payload (or -1 if not present).

    Used to correlate secp256k1 verify instructions with guardian set entries.

### post_vaa

Finalizes a VAA after signature verification. This stores the message on-chain and marks it as consumed. *(Defined in api/post_vaa.rs)*

```rust
PostVAA {
    version: u8,
    guardian_set_index: u32,
    timestamp: u32,
    nonce: u32,
    emitter_chain: u16,
    emitter_address: [u8; 32],
    sequence: u64,
    consistency_level: u8,
    payload: Vec<u8>
}
```

??? interface "Accounts"

    - `GuardianSet`: PDA of the guardian set used to verify the VAA.
    - `Bridge`: Global Wormhole state.
    - `SignatureSet`: Verified signature PDA (from verify_signatures).
    - `PostedVAA`: PDA where the VAA will be stored.
    - `Payer`: Funds the account creation.
    - `Clock`, `Rent`, `SystemProgram`: Solana system accounts.

??? interface "Parameters"

    `version` ++"u8"++

    VAA protocol version.

    ---

    `guardian_set_index` ++"u32"++

    Index of the Guardian Set that signed this VAA.

    ---

    `timestamp` ++"u32"++

    The time the emitter submitted the message.

    ---

    `nonce` ++"u32"++

    Unique identifier for the message.

    ---

    `emitter_chain` ++"u16"++

    ID of the chain where the message originated.

    ---

    `emitter_address` ++"[u8; 32]"++

    Address of the contract or account that emitted the message.

    ---

    `sequence` ++"u64"++

    Monotonically increasing sequence number for the emitter.

    ---

    `consistency_level` ++"u8"++

    Required confirmation level before the message is accepted.
    
    `1` = Confirmed, `2` = Finalized.

    ---

    `payload` ++"Vec<u8>"++

    Arbitrary data being transferred in the message.

### set_fees

Updates the message posting fee for the core bridge contract. *(Defined in api/governance.rs)*

```rust
SetFees {}
```

This function is called via governance and requires a valid governance VAA. The VAA payload must contain the new fee value.

??? interface "Accounts"

    - `Payer`: Funds transaction execution.
    - `Bridge`: PDA storing global Wormhole state.
    - `Message`: The PostedVAA account containing the governance message.
    - `Claim`: PDA that ensures this governance message hasn't been processed already.
    - `SystemProgram`: Required by Solana for creating/initializing accounts.

### transfer_fees

Transfers the accumulated message posting fees from the contract to a specified recipient. *(Defined in api/governance.rs)*

```rust
TransferFees {}
```

This function is triggered via a governance VAA and transfers the fee balance from the `FeeCollector` to the recipient address specified in the VAA payload.

??? interface "Accounts"

    - `Payer`: Funds transaction execution.
    - `Bridge`: PDA storing global Wormhole state.
    - `Message`: PostedVAA account containing the governance message.
    - `FeeCollector`: PDA holding the accumulated fees.
    - `Recipient`: The account that will receive the fees.
    - `Claim`: PDA that ensures this governance message hasn't been processed already.
    - `Rent`, `SystemProgram`: Standard Solana system accounts.

### upgrade_contract

Upgrades the deployed Wormhole program using a governance VAA. *(Defined in api/governance.rs)*

```rust
UpgradeContract {}
```

This instruction allows authorized governance messages to trigger an upgrade of the on-chain Wormhole program logic to a new address.

??? interface "Accounts"

    - `Payer`: Funds transaction execution.
    - `Bridge`: PDA storing global Wormhole state.
    - `Message`: PostedVAA account containing the governance message.
    - `Claim`: PDA that ensures this governance message hasn't been processed already.
    - `UpgradeAuthority`: PDA with authority to perform the upgrade (seeded with "upgrade").
    - `Spill`: Account that receives remaining funds from the upgrade buffer.
    - `NewContract`: Account holding the new program data.
    - `ProgramData`: Metadata account for the upgradable program.
    - `Program`: Current program to be upgraded.
    - `Rent`, `Clock`: System accounts used during the upgrade process.
    - `BPFLoaderUpgradeable`: Solana system program for upgrades.
    - `SystemProgram`: Required by Solana for creating/initializing accounts.

### upgrade_guardian_set

Upgrades the current guardian set using a governance VAA. *(Defined in api/governance.rs)*

```rust
UpgradeGuardianSet {}
```

This instruction replaces the active guardian set with a new one, allowing the Wormhole network to rotate its validator keys securely through governance.

??? interface "Accounts"

    - `Payer`: Funds transaction execution.
    - `Bridge`: PDA storing global Wormhole state.
    - `Message`: PostedVAA account containing the governance message.
    - `Claim`: PDA that ensures this governance message hasn't been processed already.
    - `GuardianSetOld`: Current (active) guardian set PDA.
    - `GuardianSetNew`: PDA for the newly proposed guardian set.
    - `SystemProgram`: Standard Solana system accounts.

## Errors

### GuardianSetMismatch

The guardian set index does not match the expected value.*(Defined in error.rs)*

### InstructionAtWrongIndex

The instruction was found at the wrong index. *(Defined in error.rs)*

### InsufficientFees

Insufficient fees were provided to post the message. *(Defined in error.rs)*

### InvalidFeeRecipient

The recipient address does not match the one specified in the governance VAA. *(Defined in error.rs)*

### InvalidGovernanceAction

The action specified in the governance payload is invalid. *(Defined in error.rs)*

### InvalidGovernanceChain

The governance VAA was not emitted by a valid governance chain. *(Defined in error.rs)*

### InvalidGovernanceKey

The emitter address in the governance VAA is not the expected governance key. *(Defined in error.rs)*

### InvalidGovernanceModule

The module string in the governance VAA header is invalid. *(Defined in error.rs)*

### InvalidGovernanceWithdrawal

Fee withdrawal would cause the fee collector account to drop below rent-exempt balance. *(Defined in error.rs)*

### InvalidGuardianSetUpgrade

The guardian set upgrade VAA is invalid (e.g., skipped index or mismatched current index). *(Defined in error.rs)*

### InvalidHash

The hash computed from the VAA does not match the expected result. *(Defined in error.rs)*

### InvalidSecpInstruction

The SECP256k1 instruction used for signature verification is malformed. *(Defined in error.rs)*

### MathOverflow

An arithmetic overflow occurred during computation. *(Defined in error.rs)*

### PostVAAConsensusFailed

Not enough valid signatures were collected to achieve quorum. *(Defined in error.rs)*

### PostVAAGuardianSetExpired

The guardian set used to verify the VAA has already expired. *(Defined in error.rs)*

### TooManyGuardians

The guardian set exceeds the maximum allowed number of guardians. *(Defined in error.rs)*

### VAAAlreadyExecuted

The VAA has already been executed and cannot be processed again. *(Defined in error.rs)*

### VAAInvalid

The VAA is structurally invalid or fails to decode. *(Defined in error.rs)*

### InvalidPayloadLength

The payload length is incorrect or malformed. *(Defined in error.rs)*

### EmitterChanged

The emitter address changed unexpectedly. *(Defined in error.rs)*

