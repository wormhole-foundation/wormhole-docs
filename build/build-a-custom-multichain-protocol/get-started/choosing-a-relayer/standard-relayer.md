---
title: Standard Relayer
description: Learn about the Standard Relayer, a tool that enables seamless cross-chain messaging between contracts on different EVM blockchains without requiring off-chain deployments.
---

# Standard Relayer

![Standard Relayer](/images/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/standard-relayer-1.webp)

The Standard Relayer provides a mechanism for a contract on one chain to send a message to a contract on a different chain without the developer dealing with any off chain deployments.

!!! warning
    The Standard Relayer feature is currently limited to EVM environments. You can find the complete list of EVM environment blockchains on the [Supported Networks page](/build/start-building/supported-networks).

## Tutorials

The following tutorials demonstrate use of the Standard Relayer:

 - [Hello Wormhole](#) - A tutorial that covers message passing across EVM environments 
 - [Hello Token](#) - A tutorial that covers token transfer across EVM environments

## On Chain

On chain, a smart contract interacts with the [IWormholeRelayer](https://github.com/wormhole-foundation/wormhole-relayer-solidity-sdk/blob/main/src/interfaces/IWormholeRelayer.sol){target=\_blank} to send and receive messages.

### Sending a Message

To send a message to a contract on another EVM chain, you can call the `sendPayloadToEvm` method, provided by the `IWormholeRelayer` interface.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/sendPayloadToEvm.sol'
```

The `sendPayloadToEvm` method is marked `payable` so you can pay for our transaction to be submitted.

The value to attach to the invocation is determined by calling the `quoteEVMDeliveryPrice`, which provides an estimate of the cost of gas on the target chain.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/quoteEVMDeliveryPrice.sol'
```

This method should be called prior to sending a message and the value returned for `nativePriceQuote` should be attached to the call to send the payload in order to cover the cost of the transaction on the target chain.

In total, sending a message across EVM chains can be as simple as:

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/getQuoteAndSend.sol'
```

### Receiving a Message

To receive a message using the `Standard Relayer` feature, the target contract must implement the [IWormholeReceiver](https://github.com/wormhole-foundation/wormhole-relayer-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol){target=\_blank} interface.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/receiveWormholeMessages.sol'
```

The logic inside the function body may be whatever business logic is required to take action on the specific payload.

### Other Considerations

There are some implementation details that should be considered during development to ensure safety and improve UX. Ensure that your engineering efforts have properly considered each of the following areas:

- Receiving a message from relayer
- Check for expected emitter
- Call `parseAndVerify` on any additional VAAs
- Replay protection
- Message Ordering (No guarantees on order of messages delivered)
- Fowarding/Call Chaining
- Refunding overpayment of `gasLimit`
- Refunding overpayment of value sent

## Off Chain

If taking advantage of Automatic Relaying, no off chain logic need be implemented. While no off chain programs are required, a developer may want to track the progress of messages in flight. To track the progress of messages in flight, use the worm CLI tool's `status` subcommand. As an example, you can use the following commands to track the status of a transfer by providing the environment, origin network, and transaction hash to the `worm status` command: 

=== "MainNet"

    ```bash
    worm status mainnet ethereum INSERT-TRANSACTION-HASH
    ```

=== "TestNet"

    ```bash
    worm status testnet ethereum INSERT-TRANSACTION-HASH
    ```

See the [CLI tool docs](/build/toolkit/cli) for installation and usage.

## See Also

Reference documentation for EVM chains is available on the [Supported Networks page](/build/start-building/supported-networks/evm).