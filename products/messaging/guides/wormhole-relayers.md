---
title: Wormhole-Deployed Relayers
description: Learn about the Wormhole-deployed relayer configuration for seamless cross-chain messaging between contracts on different EVM blockchains without off-chain deployments.
categories: Relayers, Basics
---

# Wormhole Relayer

## Introduction

The Wormhole-deployed relayers provide a mechanism for contracts on one blockchain to send messages to contracts on another without requiring off-chain infrastructure. Through the Wormhole relayer module, developers can use an untrusted delivery provider to transport VAAs, saving the need to build and maintain custom relaying solutions. The option to [run a custom relayer](/docs/protocol/infrastructure-guides/run-relayer/) is available for more complex needs.

This section covers the components and interfaces involved in using the Wormhole relayer module, such as message sending and receiving, delivery guarantees, and considerations for building reliable and efficient cross-chain applications. Additionally, you'll find details on how to handle specific implementation scenarios and track message delivery progress using the Wormhole CLI tool.

## Get Started with the Wormhole Relayer

Before getting started, it's important to note that the Wormhole-deployed relayer configuration is currently **limited to EVM environments**. The complete list of EVM environment blockchains is on the [Supported Networks](/docs/products/reference/supported-networks/) page.

To interact with the Wormhole relayer, you'll need to create contracts on the source and target chains to handle the sending and receiving of messages. No off-chain logic needs to be implemented to take advantage of Wormhole-powered relaying.

<figure markdown="span">
  ![Wormhole Relayer](/docs/images/products/messaging/guides/wormhole-relayers/relayer-1.webp)
  <figcaption>The components outlined in blue must be implemented.</figcaption>
</figure>

### Wormhole Relayer Interfaces

There are three relevant interfaces to discuss when utilizing the Wormhole relayer module:

- [**`IWormholeRelayer`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeRelayer.sol){target=\_blank} - the primary interface by which you send and receive messages. It allows you to request the sending of messages and VAAs
- [**`IWormholeReceiver`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeReceiver.sol){target=\_blank} - this is the interface you are responsible for implementing. It allows the selected delivery provider to deliver messages/VAAs to your contract
- [**`IDeliveryProvider`**](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IDeliveryProvider.sol){target=\_blank} - this interface represents the delivery pricing information for a given relayer network. Each delivery provider implements this on every blockchain they support delivering from

## Interact with the Wormhole Relayer

To start interacting with the Wormhole relayer in your contracts, you'll need to import the `IWormholeRelayer` interface and set up a reference using the contract address to the Wormhole-deployed relayer on the supported network of your choice.

To easily integrate with the Wormhole relayer interface, you can use the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank}.

To retrieve the contract address of the Wormhole relayer, refer to the Wormhole relayer section on the [Contract Addresses](/docs/products/reference/contract-addresses/#wormhole-relayer) reference page.

Your initial set up should resemble the following:

```solidity
--8<-- 'code/products/messaging/guides/wormhole-relayers/ExampleContract.sol'
```

The code provided sets up the basic structure for your contract to interact with the Wormhole relayer using the address supplied to the constructor. By leveraging methods from the `IWormholeRelayer` interface, you can implement message sending and receiving functionalities. The following sections will detail the specific methods you need to use for these tasks.

### Send a Message

To send a message to a contract on another EVM chain, you can call the `sendPayloadToEvm` method provided by the `IWormholeRelayer` interface.

```solidity
--8<-- 'code/products/messaging/guides/wormhole-relayers/sendPayloadToEvm.sol'
```

!!! tip
    To reduce transaction confirmation time, you can lower the consistency level using the [`sendToEvm`](https://github.com/wormhole-foundation/wormhole/blob/v{{repositories.wormhole.version}}/sdk/js/src/relayer/relayer/send.ts#L33){target=\_blank} method.

The `sendPayloadToEvm` method is marked `payable` to receive fee payment for the transaction. The value to attach to the invocation is determined by calling the `quoteEVMDeliveryPrice`, which provides an estimate of the cost of gas on the target chain.

```solidity
--8<-- 'code/products/messaging/guides/wormhole-relayers/quoteEVMDeliveryPrice.sol'
```

This method should be called before sending a message, and the value returned for `nativePriceQuote` should be attached to the call to send the payload to cover the transaction's cost on the target chain.

In total, sending a message across EVM chains can be as simple as getting a fee quote and sending the message as follows:

```solidity
--8<-- 'code/products/messaging/guides/wormhole-relayers/getQuoteAndSend.sol'
```

### Receive a Message

To receive a message using a Wormhole relayer, the target contract must implement the [`IWormholeReceiver`](https://github.com/wormhole-foundation/wormhole-relayer-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol){target=\_blank} interface, as shown in the [previous section](#interact-with-the-wormhole-relayer).

```solidity
--8<-- 'code/products/messaging/guides/wormhole-relayers/receiveWormholeMessages.sol'
```

The logic inside the function body may be whatever business logic is required to take action on the specific payload.

## Delivery Guarantees

The Wormhole relayer protocol is intended to create a service interface whereby mutually distrustful integrators and delivery providers can work together to provide a seamless dApp experience. You don't trust the delivery providers with your data, and the delivery providers don't trust your smart contract. The primary agreement between integrators and delivery providers is that when a delivery is requested, the provider will attempt to deliver the VAA within the provider's stated delivery timeframe.

This creates a marketplace whereby providers can set different price levels and service guarantees. Delivery providers effectively accept the slippage risk premium of delivering your VAAs in exchange for a set fee rate. Thus, the providers agree to deliver your messages even if they do so at a loss.

Delivery providers should set their prices such that they turn a profit on average but not necessarily on every single transfer. Thus, some providers may choose to set higher rates for tighter guarantees or lower rates for less stringent guarantees.

## Delivery Statuses

All deliveries result in one of the following four outcomes before the delivery provider's delivery timeframe. When they occur, these outcomes are emitted as EVM events from the Wormhole relayer contract. The four possible outcomes are:

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

## Other Considerations

Some implementation details should be considered during development to ensure safety and a pleasant UX. Ensure that your engineering efforts have appropriately considered each of the following areas:

- Receiving a message from a relayer
- Checking for expected emitter
- Calling `parseAndVerify` on any additional VAAs
- Replay protection
- Message ordering (no guarantees on order of messages delivered)
- Forwarding and call chaining
- Refunding overpayment of `gasLimit`
- Refunding overpayment of value sent

## Track the Progress of Messages with the Wormhole CLI

While no off-chain programs are required, a developer may want to track the progress of messages in flight. To track the progress of messages in flight, use the [Wormhole CLI](/docs/build/toolkit/cli/) tool's `status` subcommand. As an example, you can use the following commands to track the status of a transfer by providing the environment, origin network, and transaction hash to the `worm status` command:

=== "Mainnet"

    ```bash
    worm status mainnet ethereum INSERT_TRANSACTION_HASH
    ```

=== "Testnet"

    ```bash
    worm status testnet ethereum INSERT_TRANSACTION_HASH
    ```

See the [Wormhole CLI tool docs](/docs/build/toolkit/cli/) for installation and usage.

## Step-by-Step Tutorial

For detailed, step-by-step guidance on creating cross-chain contracts that interact with the Wormhole relayer, refer to the [Create Cross-Chain Contracts](/docs/products/messaging/tutorials/cross-chain-contracts/) tutorial.
