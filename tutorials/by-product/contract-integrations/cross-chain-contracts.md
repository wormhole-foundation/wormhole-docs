---
title: Create Cross-Chain Contracts
description: Learn how to create cross-chain contracts using Wormhole's Solidity SDK. Deploy contracts on Avalanche and Celo Testnets and send messages across chains.
---

# Create Cross-Chain Messaging Contracts

## Introduction

Wormhole's cross-chain messaging allows smart contracts to interact seamlessly across multiple blockchains. This enables developers to build decentralized applications that leverage the strengths of different networks, whether it's Avalanche, Celo, Ethereum, or beyond. In this tutorial, we'll explore using [Wormhole's Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} to create cross-chain contracts to send and receive messages across chains.

Wormhole's messaging infrastructure simplifies data transmission, event triggering, and transaction initiation across blockchains. In this tutorial, we'll guide you through a simple yet powerful hands-on demonstration that showcases this practical capability. We'll deploy contracts on two Testnets—Avalanche Fuji and Celo Alfajores—and send messages from one chain to another. This tutorial is perfect for those new to cross-chain development and seeking hands-on experience with Wormhole's powerful toolkit.

By the end of this tutorial, you will have not only built a fully functioning cross-chain message sender and receiver using Solidity but also developed a comprehensive understanding of how to interact with the Wormhole relayer, manage cross-chain costs, and ensure your smart contracts are configured correctly on both source and target chains.

This tutorial assumes a basic understanding of Solidity and smart contract development. Before diving in, it may be helpful to review [the basics of Wormhole](/docs/learn/){target=\_blank} to familiarize yourself with the protocol.

## Wormhole Overview

We'll interact with two key Wormhole components: the [Wormhole relayer](/docs/learn/infrastructure/relayer/){target=\_blank} and the [Wormhole Core Contracts](/docs/learn/infrastructure/core-contracts/){target=\_blank}. The relayer handles cross-chain message delivery and ensures the message is accurately received on the target chain. This allows smart contracts to communicate across blockchains without developers worrying about the underlying complexity.

Additionally, we'll rely on the Wormhole relayer to automatically determine cross-chain transaction costs and facilitate payments. This feature simplifies cross-chain development by allowing you to specify only the target chain and the message. The relayer handles the rest, ensuring that the message is transmitted with the appropriate fee.

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/learn/fundamentals/architecture/architecture-1.webp)

## Prerequisites

Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for deploying contracts
- Testnet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Celo-Alfajores](https://faucet.celo.org/alfajores){target=\_blank} to cover gas fees
- Wallet private key

## Build Cross-Chain Messaging Contracts

In this section, we'll deploy two smart contracts: one to send a message from Avalanche Fuji and another to receive it on Celo Alfajores. The contracts interact with the Wormhole relayer to transmit messages across chains.

At a high level, our contracts will:

1. Send a message from Avalanche to Celo using the Wormhole relayer
2. Receive and process the message on Celo, logging the content of the message

Before diving into the deployment steps, let's first break down key parts of the contracts.

### Sender Contract: MessageSender

The `MessageSender` contract is responsible for quoting the cost of sending a message cross-chain and then sending that message. 

Key functions include:

 - **`quoteCrossChainCost`** - calculates the cost of delivering a message to the target chain using the Wormhole relayer
 - **`sendMessage`** - encodes the message and sends it to the target chain and contract address using the Wormhole relayer

Here's the core of the contract:

```solidity
--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-1.sol:24:43"
```

You can find the full code for the `MessageSender.sol` below.

??? code "MessageSender.sol"

    ```solidity
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-1.sol"
    ```

### Receiver Contract: MessageReceiver

The `MessageReceiver` contract handles incoming cross-chain messages. When a message arrives, it decodes the payload and logs the message content. It ensures that only authorized contracts can send and process messages, adding an extra layer of security in cross-chain communication.

#### Emitter Validation and Registration

In cross-chain messaging, validating the sender is essential to prevent unauthorized contracts from sending messages. The `isRegisteredSender` modifier ensures that messages can only be processed if they come from the registered contract on the source chain. This guards against malicious messages and enhances security.

Key implementation details include:

 - **`registeredSender`** - stores the address of the registered sender contract
 - **`setRegisteredSender`** - registers the sender's contract address on the source chain. It ensures that only registered contracts can send messages, preventing unauthorized senders
 - **`isRegisteredSender`** - restricts the processing of messages to only those from registered senders, preventing unauthorized cross-chain communication

```solidity
--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-2.sol:12:13"
--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-2.sol:22:39"
```

#### Message Processing

The `receiveWormholeMessages` is the core function that processes the received message. It checks that the Wormhole relayer sent the message, decodes the payload, and emits an event with the message content. It is essential to verify the message sender to prevent unauthorized messages.

```solidity
--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-2.sol:42:64"
```

You can find the full code for the `MessageReceiver.sol` below.

??? code "MessageReceiver.sol"

    ```solidity
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-2.sol"
    ```

## Deploy Contracts

This section will guide you through deploying the cross-chain messaging contracts on the Avalanche Fuji and Celo Alfajores Testnets. Follow these steps to get your contracts up and running.

### Deployment Tools
We use _Foundry_ to deploy our smart contracts. However, you can use any tool you're comfortable with, such as:

 - [Remix](https://remix.ethereum.org/){target=\_blank} for a browser-based IDE
 - [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation){target=\_blank} for a more extensive JavaScript/TypeScript workflow
 - [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for a CLI-focused experience with built-in scripting and testing features

The contracts and deployment steps remain the same regardless of your preferred tool. The key is to ensure you have the necessary Testnet funds and are deploying to the right networks.

### Repository Setup

To get started with cross-chain messaging using Wormhole, first clone the [GitHub repository](https://github.com/wormhole-foundation/demo-wormhole-messaging){target=\_blank}. This repository includes everything you need to deploy, interact, and test the message flow between chains.

This demo focuses on using the scripts, so it's best to take a look at them, starting with `deploySender.js`, `deployReceiver.js`, and `sendMessage.js`.

To configure the dependencies properly, run the following command:

```bash
npm install
```

The repository includes:

- Two Solidity contracts:

    - **`MessageSender.sol`** - contract that sends the cross-chain message from Avalanche
    - **`MessageReceiver.sol`** - contract that receives the cross-chain message on Celo

- Deployment scripts located in the `script` directory:

    - **`deploySender.js`** - deploys the MessageSender contract to Avalanche
    - **`deployReceiver.js`** - deploys the MessageReceiver contract to Celo
    - **`sendMessage.js`** - sends a message from Avalanche to Celo

- Configuration files and ABI JSON files for easy deployment and interaction:

    - **`chains.json`** - configuration file that stores key information for the supported Testnets, including the Wormhole relayer addresses, RPC URLs, and chain IDs. You likely won't need to modify this file unless you're working with different networks

### Important Setup Steps

1. **Add your private key** - create a `.env` file in the root of the project and add your private key:
    
    ```env
    touch .env
    ```

    Inside `.env`, add your private key in the following format:

    ```env
    PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```

2. **Compile the contracts** - ensure everything is set up correctly by compiling the contracts:

    ```bash
    forge build
    ```

The expected output should be similar to this:

--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-7.html"

### Deployment Process

Both deployment scripts, `deploySender.js` and `deployReceiver.js`, perform the following key tasks:

1. **Load configuration and contract details** - each script begins by loading the necessary configuration details, such as the network's RPC URL and the contract's ABI and bytecode. This information is essential for deploying the contract to the correct blockchain network

    === "`chains.json`"

        ```json
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-9.json"
        ```

    === "`deploySender.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-5.js:7:15"
        ```

    === "`deployReceiver.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-6.js:7:15"
        ```

    !!! note
        The `chains.json` file contains the configuration details for the Avalanche Fuji and Celo Alfajores Testnets. You can modify this file to add more networks if needed. For a complete list of contract addresses, visit the [reference page](/docs/build/reference/){target=\_blank}.

2. **Set up provider and wallet** - the scripts establish a connection to the blockchain using a provider and create a wallet instance using a private key. This wallet is responsible for signing the deployment transaction

    === "`deploySender.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-5.js:18:19"
        ```

    === "`deployReceiver.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-6.js:18:19"
        ```

3. **Deploy the contract** - the contract is deployed to the network specified in the configuration. Upon successful deployment, the contract address is returned, which is crucial for interacting with the contract later on

    === "`deploySender.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-5.js:36:39"
        ```

    === "`deployReceiver.js`"

        ```javascript
        --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-6.js:39:42"
        ```

4. **Register the `MessageSender` on the target chain** - after you deploy the `MessageReceiver` contract on the Celo Alfajores network, the sender contract address from Avalanche Fuji needs to be registered. This ensures that only messages from the registered `MessageSender` contract are processed

    This additional step is essential to enforce emitter validation, preventing unauthorized senders from delivering messages to the `MessageReceiver` contract

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-6.js:55:66"
    ```

You can find the full code for the `deploySender.js` and `deployReceiver.js` below.

??? code "deploySender.js"

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-5.js"
    ```

??? code "deployReceiver.js"

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-6.js"
    ```

### Deploy the Sender Contract

The sender contract will handle quoting and sending messages cross-chain.

1. Run the following command to deploy the sender contract:

    ```bash
    npm run deploy:sender
    ```

2. Once deployed, the contract address will be displayed. You may check the contract on the [Avalanche Fuji Explorer](https://testnet.snowtrace.io/){target=\_blank}

--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-8.html"


### Deploy the Receiver Contract

The receiver contract listens for cross-chain messages and logs them when received.

1. Deploy the receiver contract with this command:
    
    ```bash
    npm run deploy:receiver
    ```

2. After deployment, note down the contract address. You may check the contract on the [Celo Alfajores Explorer](https://alfajores.celoscan.io/){target=\_blank}.


## Send a Cross-Chain Message

Now that both the sender and receiver contracts are deployed, let's move on to the next exciting step: sending a cross-chain message from Avalanche Fuji to Celo Alfajores.

In this example, we will use the `sendMessage.js` script to transmit a message from the sender contract on Avalanche to the receiver contract on Celo. The script uses [Ethers.js](https://docs.ethers.org/v6/){target=\_blank} to interact with the deployed contracts, calculate the cross-chain cost dynamically, and handle the transaction.

Let's break down the script step by step.

1. **Load configuration files**

    1. **`chains.json`** - contains details about the supported Testnet chains, such as RPC URLs and relayer addresses
    2. **`deployedContracts.json`** - stores the addresses of the deployed sender and receiver contracts. This file is dynamically updated when contracts are deployed, but users can also manually add their own deployed contract addresses if needed

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:8:16"
    ```

2. **Configure the provider and signer** - the script first reads the chain configurations and extracts the contract addresses. One essential step in interacting with a blockchain is setting up a _provider_. A provider is your connection to the blockchain network. It allows your script to interact with the blockchain, retrieve data, and send transactions. In this case, we're using a JSON-RPC provider

    Next, we configure the wallet, which will be used to sign transactions. The wallet is created using the private key and the provider. This ensures that all transactions sent from this wallet are broadcast to the Avalanche Fuji network:
        
    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:34:35"
    ```

    After setting up the wallet, the script loads the ABI for the `MessageSender.sol` contract and creates an instance of it:

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:38:43"
    ```

3. **Set up the message details** - the next part of the script defines the target chain (Celo) and the target address (the receiver contract on Celo):

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:55:56"
    ```

    You can customize the message that will be sent across chains:

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:59:59"
    ```

4. **Estimate cross-chain cost** - before sending the message, we dynamically calculate the cross-chain cost using the `quoteCrossChainCost` function:

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:62:62"
    ```

    This ensures that the transaction includes enough funds to cover the gas fees for the cross-chain message.

5. **Send a message** - with everything set up, the message is sent using the `sendMessage` function:

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:65:72"
    ```

    After sending, the script waits for the transaction to be confirmed:

    ```javascript
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js:75:75"
    ```

6. **Run the script** - to send the message, run the following command:

    ```bash
    npm run send:message
    ```

If everything is set up correctly, the message will be sent from the Avalanche Fuji Testnet to the Celo Alfajores Testnet. You can monitor the transaction and verify that the message was received on Celo using the [Wormhole Explorer](https://wormholescan.io/#/?network=TESTNET){target=\_blank}.

The console should output something similar to this:

--8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-4.html"

You can find the full code for the `sendMessage.js` below.

??? code "sendMessage.js"

    ```solidity
    --8<-- "code/tutorials/by-product/contract-integrations/cross-chain-contracts/snippet-3.js"
    ```

## Conclusion

You're now fully equipped to build cross-chain contracts using the Wormhole protocol! With this tutorial, you've learned how to:

- Deploy sender and receiver contracts on different Testnets
- Send a cross-chain message from one blockchain to another
- Monitor the status of your cross-chain transactions using the Wormhole Explorer and Wormhole-Solidity-SDK