---
title: Get Started with Core Contracts
description: This guide walks through the key methods of the Core Contracts, providing you with the knowledge needed to integrate them into your cross-chain contracts
---

# Core Contracts

## Introduction

Wormhole's Core Contracts, deployed on each supported blockchain network, enable the fundamental operations of sending and receiving cross-chain messages.

While the implementation details of the Core Contracts varies by network, the core functionality remains consistent across chains. Each version of the Core Contract facilitates secure and reliable cross-chain communication, ensuring that developers can effectively publish and verify messages.

This guide will walk you through the variations and key methods of the Core Contracts, providing you with the knowledge needed to integrate them into your cross-chain contracts. To learn more about Core Contracts' features and how it works, please refer to the [Core Contracts](/learn/infrastructure/core-contracts/) page in the Learn section.

## Prerequisites

To interact with the Wormhole Core Contract, you'll need the following:

- [The address of the Core Contract](/build/reference/contract-addresses#core-contracts) on the chains you're deploying your contract on
- [The Wormhole chain ID](/build//reference/chain-ids/) of the chains you're deploying your contract on
- [The consistency levels](/build/reference/consistency-levels/) (required finality) for the chains you're deploying your contract on

## How to Interact with Core Contracts

Before writing your own contracts, it's essential to understand the key functions and events of the Wormhole Core Contracts. The primary functionality revolves around:

- **Sending messages** - submitting messages to the Wormhole network for cross-chain communication
- **Receiving and verifying messages** - validating messages received from other chains via the Wormhole network

While the implementation details of the Core Contracts vary by network, the core functionality remains consistent across chains.

### Sending Messages

To send a message, regardless of the environment or chain, the Core Contract is invoked with a message argument from an [emitter](/learn/glossary/#emitter). This emitter might be your contract or an existing application such as the [Token Bridge](/learn/messaging/token-nft-bridge#token-bridge){target=\_blank} or [NFT Bridge](/learn/messaging/token-nft-bridge#nft-bridge){target=\_blank}.

=== "EVM"

    The `IWormhole.sol` interface provides the `publishMessage` function, which can be used to publish a message directly to the Core Contract:

    ```solidity
    --8<-- 'code/build/contract-integrations/core-contracts/sending.sol'
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
        --8<-- 'code/build/contract-integrations/core-contracts/sendMessageEVM.sol'
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
        
        The data being sent in the message. This is a variable-length byte array that contains the actual content or information being transmitted.

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
        --8<-- 'code/build/contract-integrations/core-contracts/sendMessageSolana.rs'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/solana/programs/01_hello_world){target=\_blank} repository on GitHub.

Once the message is emitted from the Core Contract, the [Guardian Network](/learn/infrastructure/guardians/) will observe the message and sign the digest of an Attestation [VAA](/learn/infrastructure/vaas/).

VAAs are [multicast](/learn/infrastructure/core-contracts/#multicast) by default. This means there is no default target chain for a given message. The application developer decides on the format of the message and its treatment upon receipt.

### Receiving Messages

The way a message is received and handled depends on the environment.

=== "EVM"

    On EVM chains, the message passed is the raw VAA encoded as binary. The `IWormhole.sol` interface provides the `parseAndVerifyVM` function, which can be used to parse and verify the received message.

    ```solidity
    --8<-- 'code/build/contract-integrations/core-contracts/receiving.sol'
    ```

    ??? interface "Parameters"

        `encodedVM` ++"bytes calldata"++
        
        The encoded message as a Verified Action Approval (VAA), which contains all necessary information for verification and processing.

    ??? interface "Returns"

        `vm` ++"VM memory"++
        
        The valid parsed VAA, which will include the original `emitterAddress`, `sequenceNumber`, and `consistencyLevel`, among other fields outlined on the [VAAs](/learn/infrastructure/vaas/) page.

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
        --8<-- 'code/build/contract-integrations/core-contracts/receiveMessageEVM.sol'
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
        --8<-- 'code/build/contract-integrations/core-contracts/receiveMessageSolana.rs'
        ```

        View the complete Hello World example in the [Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding/tree/main/solana/programs/01_hello_world){target=\_blank} repository on GitHub.

In addition to environment-specific checks that should be performed, a contract should take care to check other [fields in the body](/learn/infrastructure/vaas/), including:

- **Emitter** - is this coming from an expected emitter address and chain ID? Typically, contracts will provide a method to register a new emitter and check the incoming message against the set of emitters it trusts
- **Sequence** - is this the expected sequence number? How should out-of-order deliveries be handled?
- **Consistency level** - for the chain this message came from, is the [consistency level](/build/reference/consistency-levels/) enough to guarantee the transaction won't be reverted after taking some action?

Outside of the VAA body, but also relevant, is the VAA digest, which can be used for replay protection by checking if the digest has already been seen. Since the payload itself is application-specific, there may be other elements to check to ensure safety.

## Source Code References

For a deeper understanding of the Core Contract implementation for a specific blockchain environment and to review the actual source code, please refer to the following links:

- [Algorand Core Contract source code](https://github.com/wormhole-foundation/wormhole/blob/main/algorand/wormhole_core.py){target=\_blank}
- [Aptos Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/aptos/wormhole){target=\_blank}
- [EVM Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/ethereum/contracts){target=\_blank} ([`IWormhole.sol` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank})
- [NEAR Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/near/contracts/wormhole){target=\_blank}
- [Solana Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/solana/bridge/program){target=\_blank}
- [Sui Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/sui/wormhole){target=\_blank}
- [Terra Core Contract source code](https://github.com/wormhole-foundation/wormhole/tree/main/terra/contracts/wormhole){target=\_blank}
