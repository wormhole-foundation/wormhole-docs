
---
title: Get Started with Core Contracts
description: TODO
---

# Core Contracts

## Introduction

TODO

## Sending a Message

To send a message, regardless of the environment or chain, the Core Contract is invoked with a message argument from an [emitter](/learn/glossary/#emitter). This emitter may be your contract or an existing application such as the [Token Bridge](/learn/messaging/token-nft-bridge#token-bridge){target=\_blank}, or [NFT Bridge](/learn/messaging/token-nft-bridge#nft-bridge){target=\_blank}.

=== "EVM"

    Using the [`IWormhole` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank}, you can publish a message directly to the [Core Contract](/learn/messaging/core-contracts/).

    ```solidity
    --8<-- 'code/build/contract-integrations/core-contracts/sendMessageEVM.sol'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01_hello_world/HelloWorld.sol){target=\_blank}.

=== "Solana"

    You can pass a message directly to the Core Contract using the `wormhole_anchor_sdk::wormhole` module and given the Wormhole program account.

    ```rust
    --8<-- 'code/build/contract-integrations/core-contracts/sendMessageSolana.rs'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01_hello_world/src/lib.rs){target=\_blank}.

Once the message is emitted from the Core Contract, the [Guardian Network](/learn/infrastructure/guardians/) will observe the message and sign the digest of an Attestation [VAA](/learn/infrastructure/vaas/). This will be discussed in more depth in the [Off-Chain](#off-chain) section below.

VAAs are [multicast](/learn/messaging/core-contracts/#multicast) by default. This means there is no default target chain for a given message. The application developer decides on the format of the message and its treatment upon receipt.

## Receiving a Message

The way a message is received and handled depends on the environment.

=== "EVM"

    On EVM chains, the message passed is the raw VAA encoded as binary. The Core Contract has not verified it and should be treated as untrusted input until `parseAndVerifyVM` has been called.

    ```solidity
    --8<-- 'code/build/contract-integrations/core-contracts/receiveMessageEVM.sol'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01\_hello\_world/HelloWorld.sol){target=\_blank}.

=== "Solana"

    On Solana, the VAA is first posted and verified by the Core Contract, after which it can be read by the receiving contract and action taken.

    ```rust
    --8<-- 'code/build/contract-integrations/core-contracts/receiveMessageSolana.rs'
    ```

    More details are available in the [Hello World Example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01\_hello\_world/src/lib.rs){target=\_blank}.

In addition to environment-specific checks that should be performed, a contract should take care to check other [fields in the body](/learn/infrastructure/vaas/), including:

- **Emitter** - is this coming from an expected emitter address and chain ID? Typically, contracts will provide a method to register a new emitter and check the incoming message against the set of emitters it trusts
- **Sequence** - is this the expected sequence number? How should out-of-order deliveries be handled?
- **Consistency level** - for the chain this message came from, is the [consistency level](/build/reference/consistency-levels/) enough to guarantee the transaction won't be reverted after taking some action?

Outside of the VAA body, but also relevant, is the VAA digest, which can be used for replay protection by checking if the digest has already been seen. Since the payload itself is application-specific, there may be other elements to check to ensure safety.