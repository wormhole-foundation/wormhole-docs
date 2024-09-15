---
title: Specialized Relayer
description: Learn about specialized relayers, which are purpose-built components within the Wormhole protocol, designed to relay messages for specific applications.
---

# Specialized Relayer

![Specialized Relayer](/images/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/specialized-relayer-1.webp)

Wormhole is compatible with many [ecosystems](/build/start-building/supported-networks) and integration is straightforward.

## On-Chain Components

It's important to understand some [on-chain components](#) before sending and receiving messages between chains.

### Sending a Message

To send a message, regardless of the environment or chain, the Core Contract is invoked with a message argument from an [emitter](/learn/glossary/#emitter). This emitter may be your contract or an existing application such as the [Token Bridge](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003\_token\_bridge.md){target=\_blank}, or [NFT Bridge](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0006\_nft\_bridge.md){target=\_blank}.
=== "EVM"

    Using the [`IWormhole` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank}, you can publish a message directly to the [Core Contract](/learn/messaging/core-contracts/).

    ```solidity
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/sendMessageEVM.sol'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01_hello_world/HelloWorld.sol){target=\_blank}.

=== "Solana"

    You can pass a message directly to the Core Contract using the `wormhole_anchor_sdk::wormhole` module and given the Wormhole program account.

    ```rust
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/sendMessageSolana.rs'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01_hello_world/src/lib.rs){target=\_blank}.
    Once the message is emitted from the Core Contract, the [Guardian Network](/learn/infrastructure/guardians/) will observe the message and sign the digest of an Attestation [VAA](/learn/infrastructure/vaas/). This will be discussed in more depth in the [Off-Chain](#off-chain) section below.

VAAs are [multicast](/learn/messaging/core-contracts/#multicast) by default. This means there is no default target chain for a given message. The application developer decides on the format of the message and its treatment upon receipt.

### Receiving a Message

The way a message is received and handled depends on the environment.

=== "EVM"

    On EVM chains, the message passed is the raw VAA encoded as binary. The Core Contract has not verified it and should be treated as untrusted input until `parseAndVerifyVM` has been called.

    ```solidity
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/receiveMessageEVM.sol'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01\_hello\_world/HelloWorld.sol){target=\_blank}.
=== "Solana"

    On Solana, the VAA is first posted and verified by the Core Contract, after which it can be read by the receiving contract and action taken.

    ```rust
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/receiveMessageSolana.rs'
    ```

    More details are available in the [Hello World Example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01\_hello\_world/src/lib.rs){target=\_blank}.

In addition to environment-specific checks that should be performed, a contract should take care to check other [fields in the body](/learn/infrastructure/vaas/), including:

- **Emitter** - is this coming from an expected emitter address and chain ID? Typically, contracts will provide a method to register a new emitter and check the incoming message against the set of emitters it trusts
- **Sequence** - is this the expected sequence number? How should out-of-order deliveries be handled?
- **Consistency level** - for the chain this message came from, is the [consistency level](/build/reference/consistency-levels/) enough to guarantee the transaction won't be reverted after taking some action?
Outside of the VAA body, but also relevant, is the VAA digest, which can be used for replay protection by checking if the digest has already been seen. Since the payload itself is application-specific, there may be other elements to check to ensure safety.

## Off-Chain Components

Shuttling messages between chains requires some [off-chain processes](/learn/architecture/#off-chain-components). The [Guardians](/learn/infrastructure/guardians/) observe these events from the Core Contract and sign a [VAA](/learn/infrastructure/vaas/).

After enough Guardians have signed the message (at least two-thirds + 1 majority or 13 of 19 Guardians), the VAA is available to be delivered to a target chain. Once the VAA is available, a [relayer](/learn/infrastructure/relayer/) may deliver it in a properly formatted transaction to the target chain.

### Specialized Relayer

A relayer is needed to deliver the VAA containing the message to the target chain. When the relayer is explicitly written for a custom application, it's called a specialized relayer.

A specialized relayer might be as simple as an in-browser process that polls the API for the availability of a VAA after submitting a transaction and delivers it to the target chain. It might also be implemented with a [Spy](/learn/infrastructure/spy/) coupled with some daemon listening for VAAs from a relevant `chainID` and `emitter` then taking action when one is observed.
#### Simple Relayer

Regardless of the environment, to get the VAA you intend to relay, you need:

1. The `emitter` address
2. The `sequence` id of the message you're interested in
3. The `chainId` for the chain that emitted the message

With these three components, you're able to uniquely identify a VAA and fetch it from the API.

#### Fetching the VAA

Using the `getSignedVAAWithRetry` function provided in the [SDK](/build/build-apps/wormhole-sdk/), you can poll the Guardian RPC until the signed VAA is ready.

```ts

--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/getVAA.ts'


Once you have the VAA, the delivery method is chain-dependent.

=== "EVM"


On EVM chains, the bytes for the VAA can be passed directly as an argument to an ABI method.
    ```ts
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/deliverVAAEvm.ts'
    ```

=== "Solana"


    On Solana, the VAA is first posted to the core bridge, and then a custom transaction is prepared to process and validate the VAA. 

    ```ts
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/deliverVAASolana.ts'
    ```

<!-- See the [Specialized Relayer Tutorial](#) for a detailed guide. -->

## Reference

Here's a simple example of creating a specialized relayer for a custom application. This example assumes you are familiar with the basics of setting up a Wormhole environment.

1. **Initialize the project**: Start by setting up a basic Node.js project and installing the Wormhole SDK.
2. **Set up environment variables**: Configure your environment to point to the correct Wormhole RPC endpoints.
3. **Write the relayer logic**: Implement the logic to listen for specific VAAs, fetch them, and submit them to the target chain.
4. **Test the relayer**: Deploy your relayer in a test environment to ensure it correctly processes and relays VAAs.
