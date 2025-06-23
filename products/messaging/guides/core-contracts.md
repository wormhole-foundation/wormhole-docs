---
title: Get Started with Core Contracts
description: This guide walks through the key methods of the Core Contracts, providing you with the knowledge needed to integrate them into your cross-chain contracts
categories: Basics
---

# Get Started with Core Contracts

Wormhole's Core Contracts, deployed on each supported blockchain network, enable the fundamental operations of sending and receiving cross-chain messages.

While the implementation details of the Core Contracts varies by network, the core functionality remains consistent across chains. Each version of the Core Contract facilitates secure and reliable cross-chain communication, ensuring that developers can effectively publish and verify messages.

This guide will walk you through the variations and key methods of the Core Contracts, providing you with the knowledge needed to integrate them into your cross-chain contracts. To learn more about Core Contracts' features and how it works, please refer to the [Core Contracts](/docs/protocol/infrastructure/core-contracts/){target=\_blank} page in the Learn section.

## Prerequisites

To interact with the Wormhole Core Contract, you'll need the following:

- The [address of the Core Contract](/docs/products/reference/contract-addresses/#core-contracts){target=\_blank} on the chains you're deploying your contract on
- The [Wormhole chain ID](/docs/products/reference/chain-ids/){target=\_blank} of the chains you're deploying your contract on
- The [Wormhole Finality](/docs/products/reference/consistency-levels/){target=\_blank} (consistency) levels (required finality) for the chains you're deploying your contract on

## How to Interact with Core Contracts

Before writing your own contracts, it's essential to understand the key functions and events of the Wormhole Core Contracts. The primary functionality revolves around:

- **Sending messages** - submitting messages to the Wormhole network for cross-chain communication
- **Receiving and verifying messages** - validating messages received from other chains via the Wormhole network

While the implementation details of the Core Contracts vary by network, the core functionality remains consistent across chains.

### Sending Messages

To send a message, regardless of the environment or chain, the Core Contract is invoked with a message argument from an [emitter](/docs/products/reference/glossary/#emitter){target=\_blank}. This emitter might be your contract or an existing application such as the [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank}.

=== "EVM"

    The `IWormhole.sol` interface provides the `publishMessage` function, which can be used to publish a message directly to the Core Contract:

    ```solidity
    --8<-- 'code/products/messaging/guides/core-contracts/sending.sol'
    ```

    ??? interface "Parameters"

        `nonce` ++"uint32"++
        
        A free integer field that can be used however you like. Note that changing the `nonce` will result in a different digest.

        ---

        `payload` ++"bytes memory"++
        
        The content of the emitted message. Due to the constraints of individual blockchains, it may be capped to a certain maximum length.

        ---

        `consistencyLevel` ++"uint8"++
        
        A value that defines the required level of finality that must be reached before the Guardians will observe and attest to emitted events.

    ??? interface "Returns"

        `sequence` ++"uint64"++
        
        A unique number that increments for every message for a given emitter (and implicitly chain). This, combined with the emitter address and emitter chain ID, allows the VAA for this message to be queried from the [Wormholescan API](https://docs.wormholescan.io/){target=\_blank}.
    
    ??? interface "Example"

        ```solidity
        --8<-- 'code/products/messaging/guides/core-contracts/sendMessageEVM.sol'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/evm/src/01_hello_world){target=\_blank} repository on GitHub.

=== "Solana"

    The `wormhole_anchor_sdk::wormhole` module and the Wormhole program account can be used to pass a message directly to the Core Contract via the `wormhole::post_message` function:

    ```rs
    pub fn post_message<'info>(
        ctx: CpiContext<'_, '_, '_, 'info, PostMessage<'info>>,
        batch_id: u32,
        payload: Vec<u8>,
        finality: Finality
    ) -> Result<()>
    ```

    ??? interface "Parameters"

        `ctx` ++"CpiContext<'_, '_, '_, 'info, PostMessage<'info>>"++ 
        
        Provides the necessary context for executing the function, including the accounts and program information required for the Cross-Program Invocation (CPI).

        ??? child "Type `pub struct CpiContext<'a, 'b, 'c, 'info, T>`"

            ```rs
            pub struct CpiContext<'a, 'b, 'c, 'info, T>
            where
                T: ToAccountMetas + ToAccountInfos<'info>,
            {
                pub accounts: T,
                pub remaining_accounts: Vec<AccountInfo<'info>>,
                pub program: AccountInfo<'info>,
                pub signer_seeds: &'a [&'b [&'c [u8]]],
            }
            ```

            For more information, please refer to the [`wormhole_anchor_sdk` Rust docs](https://docs.rs/anchor-lang/0.29.0/anchor_lang/context/struct.CpiContext.html){target=\_blank}.

        ??? child "Type `PostMessage<'info>`"

            ```rs
            pub struct PostMessage<'info> {
                pub config: AccountInfo<'info>,
                pub message: AccountInfo<'info>,
                pub emitter: AccountInfo<'info>,
                pub sequence: AccountInfo<'info>,
                pub payer: AccountInfo<'info>,
                pub fee_collector: AccountInfo<'info>,
                pub clock: AccountInfo<'info>,
                pub rent: AccountInfo<'info>,
                pub system_program: AccountInfo<'info>,
            }
            ```

            For more information, please refer to the [`wormhole_anchor_sdk` Rust docs](https://docs.rs/wormhole-anchor-sdk/latest/wormhole_anchor_sdk/wormhole/instructions/struct.PostMessage.html){target=\_blank}.

        ---

        `batch_id` ++"u32"++
        
        An identifier for the message batch.

        ---

        `payload` ++"Vec<u8>"++
        
        The data being sent in the message. This is a variable-length byte array that contains the actual content or information being transmitted. To learn about the different types of payloads, check out the [VAAs](/docs/protocol/infrastructure/vaas#payload-types){target=\_blank} page.

        ---

        `finality` ++"Finality"++
        
        Specifies the level of finality or confirmation required for the message.
        
        ??? child "Type `Finality`"

            ```rs
            pub enum Finality {
                Confirmed,
                Finalized,
            }
            ```
    
    ??? interface "Returns"

        ++"Result<()>"++
        
        The result of the function’s execution. If the function completes successfully, it returns `Ok(())`, otherwise it returns `Err(E)`, indicating that an error occurred along with the details about the error
    
    ??? interface "Example"

        ```rust
        --8<-- 'code/products/messaging/guides/core-contracts/sendMessageSolana.rs'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/solana/programs/01_hello_world){target=\_blank} repository on GitHub.

Once the message is emitted from the Core Contract, the [Guardian Network](/docs/protocol/infrastructure/guardians/){target=\_blank} will observe the message and sign the digest of an Attestation [VAA](/docs/protocol/infrastructure/vaas/){target=\_blank}. On EVM chains, the body of the VAA is hashed twice with keccak256 to produce the signed digest message. On Solana, the [Solana secp256k1 program](https://docs.solana.com/developing/runtime-facilities/programs#secp256k1-program){target=\_blank} will hash the message passed. In this case, the argument for the message should be a single hash of the body, not the twice-hashed body.

VAAs are [multicast](/docs/protocol/infrastructure/core-contracts/#multicast){target=\_blank} by default. This means there is no default target chain for a given message. The application developer decides on the format of the message and its treatment upon receipt.

### Receiving Messages

The way a message is received and handled depends on the environment.

=== "EVM"

    On EVM chains, the message passed is the raw VAA encoded as binary. The `IWormhole.sol` interface provides the `parseAndVerifyVM` function, which can be used to parse and verify the received message.

    ```solidity
    --8<-- 'code/products/messaging/guides/core-contracts/receiving.sol'
    ```

    ??? interface "Parameters"

        `encodedVM` ++"bytes calldata"++
        
        The encoded message as a Verified Action Approval (VAA), which contains all necessary information for verification and processing.

    ??? interface "Returns"

        `vm` ++"VM memory"++
        
        The valid parsed VAA, which will include the original `emitterAddress`, `sequenceNumber`, and `consistencyLevel`, among other fields outlined on the [VAAs](/docs/protocol/infrastructure/vaas/) page.

        ??? child "Struct `VM`"

            ```solidity
            struct VM {
                uint8 version;
                uint32 timestamp;
                uint32 nonce;
                uint16 emitterChainId;
                bytes32 emitterAddress;
                uint64 sequence;
                uint8 consistencyLevel;
                bytes payload;
                uint32 guardianSetIndex;
                Signature[] signatures;
                bytes32 hash;
            }
            ```

            For more information, refer to the [`IWormhole.sol` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank}.

        ---
        
        `valid` ++"bool"++
        
        A boolean indicating whether the VAA is valid or not.
        
        ---

        `reason` ++"string"++
        
        If the VAA is not valid, a reason will be provided

    ??? interface "Example"

        ```solidity
        --8<-- 'code/products/messaging/guides/core-contracts/receiveMessageEVM.sol'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/evm/src/01_hello_world){target=\_blank} repository on GitHub.

=== "Solana"

    On Solana, the VAA is first posted and verified by the Core Contract, after which it can be read by the receiving contract and action taken.

    Retrieve the raw message data:

    ```rs
    let posted_message = &ctx.accounts.posted;
    posted_message.data()
    ```

    ??? interface "Example"

        ```rust
        --8<-- 'code/products/messaging/guides/core-contracts/receiveMessageSolana.rs'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/solana/programs/01_hello_world){target=\_blank} repository on GitHub.

#### Validating the Emitter

When processing cross-chain messages, it's critical to ensure that the message originates from a trusted sender (emitter). This can be done by verifying the emitter address and chain ID in the parsed VAA.

Typically, contracts should provide a method to register trusted emitters and check incoming messages against this list before processing them. For example, the following check ensures that the emitter is registered and authorized:

```solidity
require(isRegisteredSender(emitterChainId, emitterAddress), "Invalid emitter");
```

This check can be applied after the VAA is parsed, ensuring only authorized senders can interact with the receiving contract. Trusted emitters can be registered using a method like `setRegisteredSender` during contract deployment or initialization.

```typescript
--8<-- 'code/products/messaging/guides/core-contracts/receiveEmitterCheck.ts'
```

#### Additional Checks

In addition to environment-specific checks that should be performed, a contract should take care to check other [fields in the body](/docs/protocol/infrastructure/vaas/){target=\_blank}, including:

- **Sequence** - is this the expected sequence number? How should out-of-order deliveries be handled?
- **Consistency level** - for the chain this message came from, is the [Wormhole Finality](/docs/products/reference/consistency-levels/){target=\_blank} level enough to guarantee the transaction won't be reverted after taking some action?

The VAA digest is separate from the VAA body but is also relevant. It can be used for replay protection by checking if the digest has already been seen. Since the payload itself is application-specific, there may be other elements to check to ensure safety.

## Source Code References

For a deeper understanding of the Core Contract implementation for a specific blockchain environment and to review the actual source code, please refer to the following links:

- [Algorand Core Contract source code](https://github.com/wormhole-foundation/wormhole/blob/main/algorand/wormhole_core.py){target=\_blank}
- [Aptos Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/aptos/wormhole){target=\_blank}
- [EVM Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/ethereum/contracts){target=\_blank} ([`IWormhole.sol` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank})
- [NEAR Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/near/contracts/wormhole){target=\_blank}
- [Solana Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/solana/bridge/program){target=\_blank}
- [Sui Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/sui/wormhole){target=\_blank}
- [Terra Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/terra/contracts/wormhole){target=\_blank}
