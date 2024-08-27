---
title: Specialized Relayer
description: Learn about specialized relayers, which are purpose-built components within the Wormhole protocol, designed to relay messages for specific applications.
---

# Specialized Relayer

![Specialized Relayer](/images/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/specialized-relayer-1.webp)

Wormhole is compatible with many [ecosystems](/build/start-building/supported-networks) and integration is straightforward.

## On-Chain

In order to send and receive messages between chains, some [on-chain components](#) are important to understand.

### Sending a message

To send a message, regardless of the environment or chain, the core contract is invoked with a message argument from an [emitter](/learn/glossary/#emitter). This emitter may be your contract or an existing application such as the [Token Bridge](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003\_token\_bridge.md){target=\_blank}, or [NFT Bridge](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0006\_nft\_bridge.md){target=\_blank}.

=== "EVM"

    Using the [`IWormhole` interface](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank}, we can publish a message directly to the [core contract](/learn/messaging/core-contracts/).

    ```solidity
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/sendMessageEVM.sol'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01_hello_world/HelloWorld.sol){target=\_blank}.

=== "Solana"

    Using the `wormhole_anchor_sdk::wormhole` module and given the wormhole program account, we can pass a message directly to the core contract.

    ```rust
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/sendMessageSolana.rs'
    ```

    More details are available in the [Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01_hello_world/src/lib.rs){target=\_blank}.

Once the message is emitted from the core contract, the [Guardian Network](/learn/infrastructure/guardians/) will observe the message and sign the digest of an Attestation [VAA](/learn/infrastructure/vaas/). We'll discuss this in more depth in the [Off-Chain](#off-chain) section below.

By default, VAAs are [multicast](/learn/messaging/core-contracts/#multicast). This means there is no default target chain for a given message. It's up to the application developer to decide on the format of the message and its treatment on receipt.

### Receiving a message

The way a message is received and handled depends on the environment.

=== "EVM"

    On EVM chains, the message passed is the raw VAA encoded as binary. It has not been verified by the core contract and should be treated as untrusted input until `parseAndVerifyVM` has been called.

    ```solidity
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/receiveMessageEVM.sol'
    ```

    More details in [the Hello World example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/evm/src/01\_hello\_world/HelloWorld.sol){target=\_blank}.

=== "Solana"

    On Solana, the VAA is first posted and verified by the core contract, after which it can be read by the receiving contract and action taken.

    ```rust
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/receiveMessageSolana.rs'
    ```

    More details are available in [the Hello World Example](https://github.com/wormhole-foundation/wormhole-scaffolding/blob/main/solana/programs/01\_hello\_world/src/lib.rs){target=\_blank}.


In addition to environment specific checks that should be performed, a contract should take care to check other [fields in the body](/learn/infrastructure/vaas/) including:

- Emitter: Is this coming from an emitter address and chain id I expect? Typically contracts will provide a method to register a new emitter and check the incoming message against the set of emitters it trusts.
- Sequence: Is this the sequence number I expect? How should I handle out of order deliveries?
- Consistency Level: For the chain this message came from, is the [consistency level](/build/reference/consistency-levels/) enough to guarantee the transaction will not be reverted after taking some action?

Outside of the body of the VAA, but also relevant, is the digest of the VAA which can be used for replay protection by checking if the digest has already been seen. Since the payload itself is application specific, there may be other elements to check to ensure safety.

## Off-Chain

In order to shuttle messages between chains, some [off-chain processes](/learn/architecture/#off-chain-components) are involved. The [Guardians](/learn/infrastructure/guardians/) observe the events from the core contract and sign a [VAA](/learn/infrastructure/vaas/).

After enough Guardians have signed the message (at least a two thirds + 1 majority or 13 of 19 guardians), the VAA is available to be delivered to a target chain. Once the VAA is available, a [Relayer](/learn/infrastructure/relayer/) may deliver it in a properly formatted transaction to the target chain.

### Specialized Relayer

A relayer is needed to deliver the VAA containing the message to the target chain. When the relayer is written specifically for a custom application, it's referred to as a Specialized Relayer.

A specialized relayer might be as simple as an in-browser process that polls the API for the availability of a VAA after submitting a transaction and delivers it to the target chain. It might also be implemented with a [Spy](/learn/infrastructure/spy/) coupled with some daemon listening for VAAs from a relevant `chainID` and `emitter` then taking action when one is observed.

#### Simple Relayer

Regardless of the environment, in order to get the VAA we intend to relay, we need:

1. The `emitter` address
2. The `sequence` id of the message we're interested in
3. The `chainId` for the chain that emitted the message

With these three components, we're able to uniquely identify a VAA and fetch it from the API.

#### Fetching the VAA

Using the `getSignedVAAWithRetry` function provided in the [SDK](/build/build-apps/wormhole-sdk/), we're able to poll the Guardian RPC until the signed VAA is ready.

```ts
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/getVAA.ts'
```

Once we have the VAA, the delivery method is chain dependent.

=== "EVM"

    On EVM chains, the bytes for the VAA can be passed directly as an argument to an ABI method.

    ```ts
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/deliverVAAEvm.ts'
    ```

=== "Solana"

    ```ts
    --8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/specialized-relayer/deliverVAASolana.ts'
    ```


See the [Specialized Relayer Tutorial](#) for a detailed walkthrough.

## Reference

You can read more about the architecture and core components [in the Learn section](/learn/architecture/).