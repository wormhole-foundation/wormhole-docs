---
title: Standard Relayer
description: Learn about the standard relayer configuration for seamless cross-chain messaging between contracts on different EVM blockchains without off-chain deployments.
---

# Standard Relayer

![Standard Relayer](/images/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/standard-relayer-1.webp)

A standard relayer provides a mechanism for a contract on one chain to send a message to a contract on a different chain without requiring the developer to deal with any off-chain deployments. The WormholeRelayer module allows developers to deliver their VAAs via an untrusted `DeliveryProvider`, rather than needing to develop and host their relay infrastructure.

!!! note
    The standard relayer configuration is currently limited to EVM environments. The complete list of EVM environment blockchains is on the [Supported Networks page](/build/start-building/supported-networks).

<!-- ## Tutorials

The following tutorials demonstrate the use of a standard relayer:

 - [Hello Wormhole](#) - A tutorial that covers message passing across EVM environments 
 - [Hello Token](#) - A tutorial that covers token transfer across EVM environments -->

## On-Chain Components

There are three relevant interfaces to discuss when utilizing the `WormholeRelayer` module:

- [**`IWormholeRelayer`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayer.sol){target=\_blank} - the primary interface by which you send and receive messages. It allows you to request the sending of messages and VAAs
- [**`IWormholeReceiver`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeReceiver.sol){target=\_blank} - this is the interface you are responsible for implementing. It allows the selected delivery provider to deliver messages/VAAs to your contract
- [**`IDeliveryProvider`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IDeliveryProvider.sol){target=\_blank} - this interface represents the delivery pricing information for a given relayer network. Each delivery provider implements this on every blockchain they support delivering from

Check out the [EVM page](/build/start-building/supported-networks/evm/) for contract addresses on each supported blockchain.

### Sending a Message

To send a message to a contract on another EVM chain, you can call the `sendPayloadToEvm` method provided by the `IWormholeRelayer` interface.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/sendPayloadToEvm.sol'
```

The `sendPayloadToEvm` method is marked `payable` to receive fee payment for the transaction. The value to attach to the invocation is determined by calling the `quoteEVMDeliveryPrice`, which provides an estimate of the cost of gas on the target chain.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/quoteEVMDeliveryPrice.sol'
```

This method should be called before sending a message, and the value returned for `nativePriceQuote` should be attached to the call to send the payload to cover the transaction's cost on the target chain. In total, sending a message across EVM chains can be as simple as getting a fee quote and sending the message as follows: 

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/getQuoteAndSend.sol'
```

### Receiving a Message

To receive a message using a standard relayer, the target contract must implement the [`IWormholeReceiver`](https://github.com/wormhole-foundation/wormhole-relayer-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol){target=\_blank} interface.

```solidity
--8<-- 'code/build/build-a-custom-multichain-protocol/get-started/choosing-a-relayer/standard-relayer/receiveWormholeMessages.sol'
```

The logic inside the function body may be whatever business logic is required to take action on the specific payload.

### Delivery Guarantees

The `WormholeRelayer` protocol is intended to create a service interface whereby mutually distrustful integrators and delivery providers can work together to provide a seamless dApp experience. You don't trust the delivery providers with your data, and the delivery providers don't trust your smart contract. The primary agreement between integrators and delivery providers is that when a delivery is requested, the provider will attempt to deliver the VAA within the provider's stated delivery timeframe.

This creates a marketplace whereby providers can set different price levels and service guarantees. Delivery providers effectively accept the slippage risk premium of delivering your VAAs in exchange for a set fee rate. Thus, the providers agree to deliver your messages even if they do so at a loss.

Delivery providers should set their prices such that they turn a profit on average but not necessarily on every single transfer. Thus, some providers may choose to set higher rates for tighter guarantees or lower rates for less stringent guarantees.

### Delivery Statuses

All deliveries result in one of the following four outcomes before the delivery provider's delivery timeframe. When they occur, these outcomes are emitted as EVM events from the `WormholeRelayer` contract. The four possible outcomes are:

- (0) Delivery Success
- (1) Receiver Failure
- (2) Forward Request Success
- (3) Forward Request Failure

A receiver failure is a scenario in which the selected provider attempted the delivery but it could not be completely successfully. The three possible causes for a delivery failure are:

- The target contract does not implement the `IWormholeReceiver` interface
- The target contract threw an exception or reverted during the execution of `receiveWormholeMessages`
- The target contract exceeded the specified `gasLimit` while executing `receiveWormholeMessages`

All three of these scenarios can be avoided with correct design by the integrator, and thus, it is up to the integrator to resolve them. Any other scenario that causes a delivery to not be performed should be considered an outage by some component of the system, including potentially the blockchains themselves.

`Forward Request Success` and `Forward Failure` represent when the delivery succeeded and the user requested a forward during the delivery. If the user has enough funds left over as a refund to complete the forward, the forward will be executed, and the status will be `Forward Request Success`. Otherwise, it will be `Forward Request Failure`.

### Other Considerations

Some implementation details should be considered during development to ensure safety and a pleasant UX. Ensure that your engineering efforts have appropriately considered each of the following areas:

- Receiving a message from a relayer
- Checking for expected emitter
- Calling `parseAndVerify` on any additional VAAs
- Replay protection
- Message ordering (no guarantees on order of messages delivered)
- Forwarding and call chaining
- Refunding overpayment of `gasLimit`
- Refunding overpayment of value sent

## Off-Chain Components

No off-chain logic needs to be implemented to take advantage of automatic relaying. While no off-chain programs are required, a developer may want to track the progress of messages in flight. To track the progress of messages in flight, use the Wormhole CLI tool's `status` subcommand. As an example, you can use the following commands to track the status of a transfer by providing the environment, origin network, and transaction hash to the `worm status` command: 

=== "MainNet"

    ```bash
    worm status mainnet ethereum INSERT_TRANSACTION_HASH
    ```

=== "TestNet"

    ```bash
    worm status testnet ethereum INSERT_TRANSACTION_HASH
    ```

See the [Wormhole CLI tool docs](/build/toolkit/cli/) for installation and usage.

## See Also

The [Supported Networks page](/build/start-building/supported-networks/evm/) contains reference documentation for EVM chains.