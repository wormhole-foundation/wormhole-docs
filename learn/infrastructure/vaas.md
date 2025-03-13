---
title: VAAs
description: Learn about Verified Action Approvals (VAAs) in Wormhole, their structure, validation, and role in cross-chain communication.
---

# Verified Action Approvals

Verified Action Approvals (VAAs) are Wormhole's core messaging primitive. They are packets of cross-chain data emitted whenever a cross-chain application contract interacts with the Core Contract.

[Guardians](/docs/learn/infrastructure/guardians/){target=\_blank} validate messages emitted by contracts before sending them to the target chain. Once a majority of Guardians agree the message is valid, they sign a keccak256 hash of the message body. 

The message is wrapped up in a structure called a VAA, which combines the message with the Guardian signatures to form a proof. 

VAAs are uniquely indexed by the (`emitter_chain`, `emitter_address`, `sequence`) tuple. To obtain a VAA, one can query the [Wormholescan API](https://docs.wormholescan.io/){target=\_blank} with this information.

!!!tip "Sequence number"
    The `sequence` field depends on the final ordering of blocks on the emitter chain. When a lower consistency level is chosen (i.e., not waiting for finality), there is a chance that chain reorganizations could lead to multiple, different VAAs appearing for what looks like the “same” message on the user side. 
    
    The tuple (`emitter_chain`, `emitter_address`, `sequence`) can only be considered unique if the chain does not undergo a reorg and the block containing the message has effectively reached finality. However, there is always a small chance of an extended reorg that could invalidate or alter a previously emitted sequence number.

## VAA Format

The basic VAA consists of header and body components described as follows:

- **Header** - holds metadata about the current VAA, the Guardian set that is currently active, and the list of signatures gathered so far
    - `version` ++"byte"++ - the VAA Version
    - `guardian_set_index` ++"u32"++ - indicates which Guardian set is signing
    - `len_signatures` ++"u8"++ - the number of signatures stored
    - `signatures` ++"[]signature"++ - the collection of Guardian signatures

    Where each `signature` is:

    - `index` ++"u8"++ - the index of this Guardian in the Guardian set
    - `signature` ++"[65]byte"++ - the ECDSA signature

- **Body** - _deterministically_ derived from an on-chain message. Any two Guardians processing the same message must derive the same resulting body to maintain a one-to-one relationship between VAAs and messages to avoid double-processing messages

!!!tip "Consistency level"
    This is only strictly true once the chain's state is finalized. If a reorg occurs, and a transaction that previously appeared in block X is replaced by block Y, Guardians observing different forks may generate different VAAs for what the emitter contract believes is the same message.
    
    This scenario is less likely once a block is sufficiently buried, but it can still happen if you choose a faster (less finalized) consistency level.

- `timestamp` ++"u32"++ - the timestamp of the block this message was published in
- `nonce` ++"u32"++
- `emitter_chain` ++"u16"++ - the id of the chain that emitted the message
- `emitter_address` ++"[32]byte"++ - the contract address (Wormhole formatted) that called the Core Contract
- `sequence` ++"u64"++ - the auto-incrementing integer that represents the number of messages published by this emitter
- `consistency_level` ++"u8"++ - the consistency level (finality) required by this emitter
- `payload` ++"[]byte"++ - arbitrary bytes containing the data to be acted on

The body contains relevant information for entities, such as contracts, or other systems, that process or utilize VAAs. When a function like `parseAndVerifyVAA` is called, the body is returned, allowing verification of the `emitterAddress` to determine if the VAA originated from a trusted contract.

Because VAAs have no destination, they are effectively multicast. Any Core Contract on any chain in the network will verify them as authentic. If a VAA has a specific destination, relayers are entirely responsible for completing that delivery appropriately.

## Consistency and Finality

The consistency level determines whether Guardians wait for a chain’s final commitment state or issue a VAA sooner under less-final conditions. This choice is especially relevant for blockchains without instant finality, where the risk of reorganization remains until a block is deeply confirmed. 

Guardian watchers are specialized processes that monitor each blockchain in real time. They enforce the selected consistency level by deciding whether enough commitment has been reached before signing and emitting a VAA. Some chains allow only one commitment level (effectively final), while others let integrators pick between near-final or fully finalized states. Choosing a faster option speeds up VAA production but increases reorg risk. A more conservative option takes longer but reduces the likelihood of rollback.

## Signatures

The body of the VAA is hashed twice with `keccak256` to produce the signed digest message.

```js
--8<-- 'code/learn/infrastructure/VAAs/snippet-1.js'
```

!!!tip "Hash vs double hash"
    Different implementations of the ECDSA signature validation may apply a keccak256 hash to the message passed, so care must be taken to pass the correct arguments.
    
    For example, the [Solana secp256k1 program](https://docs.solanalabs.com/runtime/programs#secp256k1-program){target=\_blank} will hash the message passed. In this case, the argument for the message should be a single hash of the body, not the twice-hashed body.

## Payload Types

Different applications built on Wormhole may specify a format for the payloads attached to a VAA. This payload provides information on the target chain and contract so it can take action (e.g., minting tokens to a receiver address).

### Token Transfer

Many bridges use a lockup/mint and burn/unlock mechanism to transfer tokens between chains. Wormhole's generic message-passing protocol handles the routing of lock and burn events across chains to ensure Wormhole's Token Bridge is chain-agnostic and can be rapidly integrated into any network with a Wormhole contract.

Transfering tokens from Chain A to Chain B, requires the following steps:

- Lock the token on Chain A
- Chain A emits a message as proof the token lockup is complete
- Chain B receives the message confirming the lockup event on Chain A
- Token is minted on Chain B

The message Chain A emits to verify the lockup is referred to as a transfer message and has the following structure:

- `payload_id` ++"u8"++ - the ID of the payload. This should be set to `1` for a token transfer
- `amount` ++"u256"++ - amount of tokens being transferred
- `token_address` ++"u8[32]"++ - address on the source chain
- `token_chain` ++"u16"++ - numeric ID for the source chain
- `to` ++"u8[32]"++ - address on the destination chain
- `to_chain` ++"u16"++ - numeric ID for the destination chain
- `fee` ++"u256"++ - portion of amount paid to a relayer

This structure contains everything the receiving chain needs to learn about a lockup event. Once Chain B receives this payload, it can mint the corresponding asset.

Note that Chain B is agnostic regarding how the tokens on the sending side were locked. They could have been burned by a mint or locked in a custody account. The protocol relays the event once enough Guardians have attested to its existence.

### Attestation

While Chain B can trust the message from Chain A to inform it of token lockup events, it has no way of verifying the correct token is locked up. To solve this, the Token Bridge supports token attestation.

To create a token attestation, Chain A emits a message containing metadata about a token, which Chain B may use to preserve the name, symbol, and decimal precision of a token address.

The message format for token attestation is as follows:

- `payload_id` ++"u8"++ - the ID of the payload. This should be set to `2` for an attestation
- `token_address` ++"[32]byte"++ - address of the originating token contract
- `token_chain` ++"u16"++ - chain ID of the originating token 
- `decimals` ++"u8"++ - number of decimals this token should have
- `symbol` ++"[32]byte"++ - short name of asset
- `name` ++"[32]byte"++ - full name of asset

#### Attestation Tips 

Be aware of the following considerations when working with attestations:

- Attestations use a fixed-length byte array to encode UTF8 token name and symbol data. Because the byte array is fixed length, the data contained may truncate multibyte Unicode characters

- When sending an attestation VAA, it is recommended to send the longest UTF-8 prefix that doesn't truncate a character and then right-pad it with zero bytes

- When parsing an attestation VAA, it is recommended to trim all trailing zero bytes and converting the remainder to UTF-8 via any lossy algorithm

- Be mindful that different on-chain systems may have different VAA parsers, resulting in different names/symbols on different chains if the string is long or contains invalid UTF8

- Without knowing a token's decimal precision, Chain B cannot correctly mint the number of tokens when processing a transfer. For this reason, the Token Bridge requires an attestation for each token transfer

### Token Transfer with Message

The Token Transfer with Message data structure is identical to the token-only data structure, except for the following:

- **`fee` field** - replaced with the `from_address` field 
- **`payload` field** - is added containing arbitrary bytes. A dApp may include additional data in this arbitrary byte field to inform some application-specific behavior

This VAA type is also referred to as a `payload3` message or a Contract Controlled Transfer and has the following structure:

- `payload_id` ++"u8"++ -  the ID of the payload. This should be set to `3` for a token transfer with message 
- `amount` ++"u256"++ - amount of tokens being transferred
- `token_address` ++"u8[32]"++ - address on the source chain
- `token_chain` ++"u16"++ - numeric ID for the source chain
- `to` ++"u8[32]"++ - address on the destination chain
- `to_chain` ++"u16"++ - numeric ID for the destination chain
- `from_address` ++"u8[32]"++ - address that called the Token Bridge on the source chain
- `payload` ++"[]byte"++ - message, arbitrary bytes, app specific

### Governance

Governance VAAs don't have a `payload_id` field like the preceding formats. They're used to trigger some action in the deployed contracts (for example, upgrade).

#### Action Structure

Governance messages contain pre-defined actions, which can target the various Wormhole modules currently deployed on-chain. The structure contains the following fields:

- `module` ++"u8[32]"++ - contains a right-aligned module identifier
- `action` ++"u8"++ - predefined governance action to execute
- `chain`  ++"u16"++ - chain the action is targeting. This should be set to `0` for all chains
- `args`  ++"any"++ - arguments to the action

Below is an example message containing a governance action triggering a code upgrade to the Solana Core Contract. The module field here is a right-aligned encoding of the ASCII Core, represented as a 32-byte hex string.

```js
--8<-- 'code/learn/infrastructure/VAAs/snippet-2.js'
```

#### Actions

The meaning of each numeric action is pre-defined and documented in the Wormhole design documents. For each application, the relevant definitions can be found via these links:

- [Core governance actions](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0002_governance_messaging.md){target=\_blank}
- [Token Bridge governance actions](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003_token_bridge.md){target=\_blank}

## Lifetime of a Message

Anyone can submit the VAA to the target chain. The Guardians typically don't perform this step to avoid transaction fees. Instead, applications built on top of Wormhole can acquire the VAA via the Guardian RPC and make the submission in a separate flow.

With the concepts now defined, it is possible to illustrate what a full flow for message passing between two chains looks like. The following stages demonstrate each step of processing that the Wormhole network performs to route a message.

1. **A message is emitted by a contract running on Chain A** - any contract can emit messages, and the Guardians are programmed to observe all chains for these events. Here, the Guardians are represented as a single entity to simplify the graphics, but the observation of the message must be performed individually by each of the 19 Guardians
2. **Signatures are aggregated** - Guardians observe and sign the message independently. Once enough Guardians have signed the message, the collection of signatures is combined with the message and metadata to produce a VAA
3. **VAA submitted to target chain** - the VAA acts as proof that the Guardians have collectively attested the existence of the message payload; to complete the final step, the VAA itself is submitted (or relayed) to the target chain to be processed by a receiving contract

![Lifetime of a message diagram](/docs/images/learn/infrastructure/vaas/lifetime-vaa-diagram.webp)

## Next Steps

<div class="grid cards" markdown>

-   :octicons-book-16:{ .lg .middle } **Guardians**

    ---

    Explore Wormhole's Guardian Network, a decentralized system for secure, scalable cross-chain communication across various blockchain ecosystems.

    [:custom-arrow: Learn About Guardians](/docs/learn/infrastructure/guardians/)

- :octicons-tools-16:{ .lg .middle } **Wormhole Relayer**

    ---

    Explore this how-to guide to using Wormhole-deployed relayers to send and receive messages using VAAs.

    [:custom-arrow: Build with Wormhole Relayer](/docs/build/core-messaging/wormhole-relayers/)

</div>


