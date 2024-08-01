---
title: VAAs
description:  Learn about Verified Action Approvals (VAAs) in Wormhole, their structure, validation, and role in cross-chain communication.
---

<!--
code boxes need to be displayed in another way
[link](#){target=\_blank}
-->

# Verified Action Approvals

VAAs are Wormhole's core messaging primitive. They are packets of cross-chain data that are emitted any time a cross-chain application contract interacts with the Core Contract.

The basic VAA has two components: a Header and a Body.

The Guardians must validate messages emitted by contracts before they can be sent to the target chain. Once a majority of Guardians observe the message and finality has been achieved, the Guardians sign a keccak256 hash of the message body.

The message is wrapped up in a structure called a VAA, which combines the message with the Guardian signatures to form a proof.

VAAs are uniquely indexed by the (`emitter_chain`, `emitter_address`, `sequence`) tuple. A VAA can be obtained by querying the Guardian [RPC](#){target=\_blank} or the [API](#){target=\_blank} with this information.

These VAAs are ultimately what a smart contract on a receiving chain must process to receive a Wormhole message.

## VAA Format

VAAs contain two sections of data.

### Header 

The header holds metadata about the current VAA, the Guardian Set that is currently active, and the list of signatures gathered so far.

- `version` ++"byte"++ - the VAA Version
- `guardian_set_index` ++"u32"++ - indicates which Guardian Set is signing
- `len_signatures` ++"u8"++ - the number of signatures stored
- `signatures` ++"[]signature"++ - the collection of Guardian signatures

Where each `signature` is:

- `index` ++"u8"++ - the index of this Guardian in the Guardian Set
- `signature` ++"[65]byte"++ - the ECDSA signature 

### Body 

The body is _deterministically_ derived from an on-chain message. Any two Guardians must derive the exact same body. This requirement exists so that there is always a one-to-one relationship between VAAs and messages to avoid double processing of messages.

- `timestamp` ++"u32"++ - the timestamp of the block this message was published in
- `nonce` ++"u32"++
- `emitter_chain` ++"u16"++ - the id of the chain that emitted the message
- `emitter_address` ++"[32]byte"++ - the contract address (wormhole formatted) that called the core contract
- `sequence` ++"u64"++ - the auto incrementing integer that represents the number of messages published by this emitter
- `consistency_level` ++"u8"++ - the consistency level (finality) required by this emitter
- `payload` ++"[]byte"++ - arbitrary bytes containing the data to be acted on

The body is the relevant information for consumers and is handed back from a call like `parseAndVerifyVAA`. Because the `emitterAddress` is included as part of the body, the developer is able to tell if this VAA originated from a trusted contract.

!!! note
    Because VAAs have no destination, they are effectively multicast. They will be verified as authentic by any Core Contract on any chain in the network. If a VAA has a specific destination, it is entirely the responsibility of relayers to complete that delivery appropriately.

## Signatures

The body of the VAA is hashed twice with `keccak256` to produce the signed digest message.

```js
--8<-- 'code/learn/infrastructure/VAAs/snippet-1.js'
```

!!! note
    Different implementations of the ECDSA signature validation may apply a keccak256 hash to the message passed, so care must be taken to pass the correct arguments.
    
    For example, the [Solana secp256k1 program](https://docs.solanalabs.com/runtime/programs#secp256k1-program){target=\_blank} will hash the message passed. In this case, the argument for the message should be a single hash of the body, not the twice-hashed body.

## Payload Types

Different applications that are built on Wormhole may specify a format for the payloads attached to a VAA. This payload provides information on the target chain and contract so it can take some action (e.g., minting tokens to a receiver address).

### Token Transfer

Tokens are transferred from one chain to another using a lockup/mint and burn/unlock mechanism. While many bridges work on this basic premise, this implementation achieves this by relying on the generic message-passing protocol provided by Wormhole to support routing the lock and burn events from one chain to another. This makes Wormhole's token bridge ultimately chain-agnostic. An implementation can be quickly incorporated into the network as long as a wormhole contract exists on the chain we wish to transfer to. Due to the generic message-passing nature of Wormhole, programs emitting messages do not need to know anything about the implementation details of any other chain.

To transfer tokens from A to B, we must lock the tokens on A and mint them on B. The tokens on A must be proven to be locked before the minting can occur on B. To facilitate this process, chain A first locks the tokens and emits a message indicating that the locking has been completed. This message has the following structure and is referred to as a transfer message:

- `payload_id = 1` ++"u8"++ - token transfer
- `amount` ++"u256"++ - amount of tokens being transferred
- `token_address` ++"u8[32]"++ - address on the source chain
- `token_chain` ++"u16"++ - numeric ID for the source chain
- `to` ++"u8[32]"++ - address on the destination chain
- `to_chain` ++"u16"++ - numeric ID for the destination chain
- `fee` ++"u256"++ - portion of amount paid to a relayer

This structure contains everything the receiving chain needs to learn about a lockup event. Once Chain B receives this payload, it can mint the corresponding asset.

Note that Chain B is agnostic regarding how the tokens on the sending side were locked. They could have been burned by a mint or locked in a custody account. The protocol relays the event once enough Guardians have attested to its existence.

### Attestation

The Transfer event above needs an important detail added. While the program on Chain B can trust the message to inform it of token lockup events, it has no way of knowing what the token being locked up actually is. The address alone is a meaningless value to most users. To solve this, the Token Bridge supports token attestation.

For a token attestation, Chain A emits a message containing metadata about a token which Chain B may use to preserve the name, symbol, and decimal precision of a token address.

The message format for this action is as follows:

- `payload_id = 2` ++"u8"++ - attestation
- `token_address` ++"[32]byte"++ - address of the originating token contract
- `token_chain` ++"u16"++ - chain ID of the originating token 
- `decimals` ++"u8"++ - number of decimals this token should have
- `symbol` ++"[32]byte"++ - short name of asset
- `name` ++"[32]byte"++ - full name of asset

Attestations use a fixed-length byte array to encode UTF8 token name and symbol data.

!!! note
    Because the byte array is fixed length, the data contained may truncate multibyte unicode characters.

When sending an attestation VAA, we recommend sending the longest UTF8 prefix that does NOT truncate a character and right-padding it with 0 bytes.

When parsing an attestation VAA, we recommend trimming all trailing 0 bytes and converting the remainder to UTF8 via any lossy algorithm.

!!! note
    Be mindful that different on-chain systems may have different VAA parsers, which may result in different names/symbols on different chains if the string is long or contains invalid UTF8.

An essential detail of the token bridge is that an attestation is required before a token can be transferred. This is because without knowing a token's decimal precision, it is not possible for Chain B to correctly mint the correct amount of tokens when processing a transfer.

### Token + Message

!!! note
    This VAA type is also referred to as a payload3 message or a Contract Controlled Transfer.

The Token + Message data structure is identical to the token-only data structure with the addition of a `payload` field that contains arbitrary bytes. This arbitrary byte field is where an app may include additional data in the transfer to inform some application-specific behavior.

- `payload_id = 3` ++"u8"++ - token transfer with wessage 
- `amount` ++"u256"++ - amount of tokens being transferred
- `token_address` ++"u8[32]"++ - address on the source chain
- `token_chain` ++"u16"++ - numeric ID for the source chain
- `to` ++"u8[32]"++ - address on the destination chain
- `to_chain` ++"u16"++ - numeric ID for the destination chain
- `fee` ++"u256"++ - portion of amount paid to a relayer
- `payload` ++"[]byte"++ - message, arbitrary bytes, app specific

### Governance

Governance VAAs don't have a `payload_id` field like the above formats; they're used to trigger some action in the deployed contracts (e.g., upgrade).

### Action Structure

Governance messages contain pre-defined actions, which can target the various Wormhole modules currently deployed on-chain. The structure contains the following fields:

- `module` ++"u8[32]"++ - contains a right-aligned module identifier
- `action` ++"u8"++ - predefined governance action to execute
- `chain`  ++"u16"++ - chain the action is targeting, 0 = all chains
- `args`  ++"..."++ - arguments to the action

Here is an example message containing a governance action triggering a code upgrade to the Solana core contract. The module field here is a right-aligned encoding of the ASCII "Core", represented as a 32-byte hex string.

```js
--8<-- 'code/learn/infrastructure/VAAs/snippet-2.js'
```

### Actions

The meaning of each numeric action is pre-defined and documented in the Wormhole design documents. For each application, the relevant definitions can be found via these links:

- Core governance actions are documented in the their [whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0002_governance_messaging.md){target=\_blank}
- Token Bridge governance actions are documented in the their [whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003_token_bridge.md){target=\_blank}
- NFT Bridge governance actions are documented in their [whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0006_nft_bridge.md){target=\_blank}

## Lifetime of a Message

!!! note
    Anyone can submit the VAA to the target chain. The Guardians typically do not perform this step to avoid transaction fees. Instead, applications built on top of Wormhole can acquire the VAA via the Guardian RPC and make the submission in a separate flow.

With the concepts now defined, we can illustrate what a full flow for a message passing between two chains looks like. The following stages demonstrate each stage of processing the Wormhole network performs in order to route a message.

1. **A message is emitted by a contract running on chain A** - any contract can emit messages, and the Guardians are programmed to observe all chains for these events. Here, the Guardians are represented as a single entity to simplify the graphics, but the observation of the message must be performed individually by each of the 19 Guardians
2. **Signatures are aggregated** - Guardians observe and sign the message independently. Once enough Guardians have signed the message, the collection of signatures are combined with the message and metadata to produce a VAA
3. **VAA submitted to target chain** - the VAA acts as proof that the Guardians have collectively attested the existence of the message payload; in order to complete the final step, the VAA itself is submitted (or relayed) to the target chain to be processed by a receiving contract

