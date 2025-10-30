---
title: Create Cross-Chain Contracts
description: Learn how to create cross-chain contracts using Wormhole's Solidity SDK. Deploy contracts on Avalanche and Celo Testnets and send messages across chains.
categories: Basics
url: https://wormhole.com/docs/products/messaging/tutorials/cross-chain-contracts/
---

# Create Cross-Chain Messaging Contracts

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormhole-messaging){target=\_blank}

Wormhole's cross-chain messaging allows smart contracts to interact seamlessly across multiple blockchains. This enables developers to build decentralized applications that leverage the strengths of different networks, whether it's Avalanche, Celo, Ethereum, or beyond. In this tutorial, we'll explore using [Wormhole's Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} to create cross-chain contracts to send and receive messages across chains.

Wormhole's messaging infrastructure simplifies data transmission, event triggering, and transaction initiation across blockchains. In this tutorial, we'll guide you through a simple yet powerful hands-on demonstration that showcases this practical capability. We'll deploy contracts on two testnets, Avalanche Fuji and Celo Alfajores, and send messages from one chain to another. This tutorial is perfect for those new to cross-chain development and seeking hands-on experience with Wormhole's powerful toolkit.

By the end of this tutorial, you will have not only built a fully functioning cross-chain message sender and receiver using Solidity but also developed a comprehensive understanding of how to interact with the relayer, manage cross-chain costs, and ensure your smart contracts are configured correctly on both source and target chains.

This tutorial assumes a basic understanding of Solidity and smart contract development. Before diving in, it may be helpful to review [the basics of Wormhole](/docs/protocol/introduction/){target=\_blank} to familiarize yourself with the protocol.

## Wormhole Overview

We'll interact with two key Wormhole components: the [relayer](/docs/protocol/infrastructure/relayer/){target=\_blank} and the [Wormhole Core Contracts](/docs/protocol/infrastructure/core-contracts/){target=\_blank}. The relayer handles cross-chain message delivery and ensures the message is accurately received on the target chain. This allows smart contracts to communicate across blockchains without developers worrying about the underlying complexity.

Additionally, we'll rely on the relayer to automatically determine cross-chain transaction costs and facilitate payments. This feature simplifies cross-chain development by allowing you to specify only the target chain and the message. The relayer handles the rest, ensuring that the message is transmitted with the appropriate fee.

![Wormhole architecture detailed diagram: source to target chain communication.](/docs/images/protocol/architecture/architecture-1.webp)

## Prerequisites

Before starting this tutorial, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank} for deploying contracts.
- Testnet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Celo-Alfajores](https://faucet.celo.org/alfajores){target=\_blank} to cover gas fees.
- Wallet private key.

## Build Cross-Chain Messaging Contracts

In this section, we'll deploy two smart contracts: one to send a message from Avalanche Fuji and another to receive it on Celo Alfajores. The contracts interact with the relayer to transmit messages across chains.

At a high level, our contracts will:

1. Send a message from Avalanche to Celo using the relayer.
2. Receive and process the message on Celo, logging the content of the message.

Before diving into the deployment steps, let's first break down key parts of the contracts.

### Sender Contract: MessageSender

The `MessageSender` contract is responsible for quoting the cost of sending a message cross-chain and then sending that message. 

Key functions include:

 - **`quoteCrossChainCost`**: Calculates the cost of delivering a message to the target chain using the relayer.
 - **`sendMessage`**: Encodes the message and sends it to the target chain and contract address using the relayer.

Here's the core of the contract:

```solidity
    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        string memory message
    ) external payable {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(message, msg.sender),
            0,
            GAS_LIMIT
        );
    }
```

You can find the full code for the `MessageSender.sol` below.

??? code "MessageSender.sol"

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;

    import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";

    contract MessageSender {
        IWormholeRelayer public wormholeRelayer;
        uint256 constant GAS_LIMIT = 50000;

        constructor(address _wormholeRelayer) {
            wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        }

        function quoteCrossChainCost(
            uint16 targetChain
        ) public view returns (uint256 cost) {
            (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
                targetChain,
                0,
                GAS_LIMIT
            );
        }

        function sendMessage(
            uint16 targetChain,
            address targetAddress,
            string memory message
        ) external payable {
            uint256 cost = quoteCrossChainCost(targetChain);

            require(
                msg.value >= cost,
                "Insufficient funds for cross-chain delivery"
            );

            wormholeRelayer.sendPayloadToEvm{value: cost}(
                targetChain,
                targetAddress,
                abi.encode(message, msg.sender),
                0,
                GAS_LIMIT
            );
        }
    }

    ```

### Receiver Contract: MessageReceiver

The `MessageReceiver` contract handles incoming cross-chain messages. When a message arrives, it decodes the payload and logs the message content. It ensures that only authorized contracts can send and process messages, adding an extra layer of security in cross-chain communication.

#### Emitter Validation and Registration

In cross-chain messaging, validating the sender is essential to prevent unauthorized contracts from sending messages. The `isRegisteredSender` modifier ensures that messages can only be processed if they come from the registered contract on the source chain. This guards against malicious messages and enhances security.

Key implementation details include:

 - **`registeredSender`**: Stores the address of the registered sender contract.
 - **`setRegisteredSender`**: Registers the sender's contract address on the source chain. It ensures that only registered contracts can send messages, preventing unauthorized senders.
 - **`isRegisteredSender`**: Restricts the processing of messages to only those from registered senders, preventing unauthorized cross-chain communication.

```solidity
    mapping(uint16 => bytes32) public registeredSenders;

    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(
            registeredSenders[sourceChain] == sourceAddress,
            "Not registered sender"
        );
        _;
    }

    function setRegisteredSender(
        uint16 sourceChain,
        bytes32 sourceAddress
    ) public {
        require(
            msg.sender == registrationOwner,
            "Not allowed to set registered sender"
        );
        registeredSenders[sourceChain] = sourceAddress;
    }
```

#### Message Processing

The `receiveWormholeMessages` is the core function that processes the received message. It checks that the relayer sent the message, decodes the payload, and emits an event with the message content. It is essential to verify the message sender to prevent unauthorized messages.

```solidity
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32
    ) public payable override isRegisteredSender(sourceChain, sourceAddress) {
        require(
            msg.sender == address(wormholeRelayer),
            "Only the Wormhole relayer can call this function"
        );

        // Decode the payload to extract the message
        string memory message = abi.decode(payload, (string));

        // Example use of sourceChain for logging
        if (sourceChain != 0) {
            emit SourceChainLogged(sourceChain);
        }

        // Emit an event with the received message
        emit MessageReceived(message);
    }
```

You can find the full code for the `MessageReceiver.sol` below.

??? code "MessageReceiver.sol"

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;

    import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeReceiver.sol";

    contract MessageReceiver is IWormholeReceiver {
        IWormholeRelayer public wormholeRelayer;
        address public registrationOwner;

        // Mapping to store registered senders for each chain
        mapping(uint16 => bytes32) public registeredSenders;

        event MessageReceived(string message);
        event SourceChainLogged(uint16 sourceChain);

        constructor(address _wormholeRelayer) {
            wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
            registrationOwner = msg.sender; // Set contract deployer as the owner
        }

        modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
            require(
                registeredSenders[sourceChain] == sourceAddress,
                "Not registered sender"
            );
            _;
        }

        function setRegisteredSender(
            uint16 sourceChain,
            bytes32 sourceAddress
        ) public {
            require(
                msg.sender == registrationOwner,
                "Not allowed to set registered sender"
            );
            registeredSenders[sourceChain] = sourceAddress;
        }

        // Update receiveWormholeMessages to include the source address check
        function receiveWormholeMessages(
            bytes memory payload,
            bytes[] memory,
            bytes32 sourceAddress,
            uint16 sourceChain,
            bytes32
        ) public payable override isRegisteredSender(sourceChain, sourceAddress) {
            require(
                msg.sender == address(wormholeRelayer),
                "Only the Wormhole relayer can call this function"
            );

            // Decode the payload to extract the message
            string memory message = abi.decode(payload, (string));

            // Example use of sourceChain for logging
            if (sourceChain != 0) {
                emit SourceChainLogged(sourceChain);
            }

            // Emit an event with the received message
            emit MessageReceived(message);
        }
    }

    ```

## Deploy Contracts

This section will guide you through deploying the cross-chain messaging contracts on the Avalanche Fuji and Celo Alfajores Testnets. Follow these steps to get your contracts up and running.

### Deployment Tools
We use _Foundry_ to deploy our smart contracts. However, you can use any tool you're comfortable with, such as:

 - [Remix](https://remix.ethereum.org/){target=\_blank} for a browser-based IDE.
 - [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation){target=\_blank} for a more extensive JavaScript/TypeScript workflow.
 - [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank} for a CLI-focused experience with built-in scripting and testing features.

The contracts and deployment steps remain the same regardless of your preferred tool. The key is to ensure you have the necessary Testnet funds and are deploying to the right networks.

### Repository Setup

To get started with cross-chain messaging using Wormhole, first clone the [GitHub repository](https://github.com/wormhole-foundation/demo-wormhole-messaging){target=\_blank}. This repository includes everything you need to deploy, interact, and test the message flow between chains.

This demo focuses on using the scripts, so it's best to take a look at them, starting with `deploySender.ts`, `deployReceiver.ts`, and `sendMessage.ts`.

To configure the dependencies properly, run the following command:

```bash
npm install
```

The repository includes:

- Two Solidity contracts:

    - **`MessageSender.sol`**: Contract that sends the cross-chain message from Avalanche.
    - **`MessageReceiver.sol`**: Contract that receives the cross-chain message on Celo.

- Deployment scripts located in the `script` directory:

    - **`deploySender.ts`**: Deploys the `MessageSender` contract to Avalanche.
    - **`deployReceiver.ts`**: Deploys the `MessageReceiver` contract to Celo.
    - **`sendMessage.ts`**: Sends a message from Avalanche to Celo.

- Configuration files and ABI JSON files for easy deployment and interaction:

    - **`chains.json`**: Configuration file that stores key information for the supported Testnets, including the relayer addresses, RPC URLs, and chain IDs. You likely won't need to modify this file unless you're working with different networks.

 - A dedicated `interfaces` directory inside the `src` folder for TypeScript type definitions:

    - **`ChainsConfig.ts`**: Defines the types for the `chains.json` configuration file.
    - **`DeployedContracts.ts`**: Contains types for deployed contract addresses and related information.
    - **`MessageJsons.ts`**: Includes types for ABI and bytecode JSONs used by the deployment scripts.
    - **`index.ts`**: Serves as an export aggregator for the interfaces, simplifying imports in other files.

### Important Setup Steps

1. **Add your private key**: Create a `.env` file in the root of the project and add your private key.
    
    ```env
    touch .env
    ```

    Inside `.env`, add your private key in the following format:

    ```env
    PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```

2. **Compile the contracts**: Ensure everything is set up correctly by compiling the contracts.

    ```bash
    forge build
    ```

The expected output should be similar to this:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>forge build</span>
	<span data-ty> > [⠒] Compiling...</span>
	<span data-ty> > [⠰] Compiling 30 files with 0.8.23</span>
	<span data-ty> [⠔] Solc 0.8.23 finished in 2.29s</span>
	<span data-ty>Compiler run successful!</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

### Deployment Process

Both deployment scripts, `deploySender.ts` and `deployReceiver.ts`, perform the following key tasks:

1. **Load configuration and contract details**: Each script begins by loading the necessary configuration details, such as the network's RPC URL and the contract's ABI and bytecode. This information is essential for deploying the contract to the correct blockchain network.

    === "`chains.json`"

        ```json
        {
            "chains": [
                {
                    "description": "Avalanche testnet fuji",
                    "chainId": 6,
                    "rpc": "https://api.avax-test.network/ext/bc/C/rpc",
                    "tokenBridge": "0x61E44E506Ca5659E6c0bba9b678586fA2d729756",
                    "wormholeRelayer": "0xA3cF45939bD6260bcFe3D66bc73d60f19e49a8BB",
                    "wormhole": "0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C"
                },
                {
                    "description": "Celo Testnet",
                    "chainId": 14,
                    "rpc": "https://alfajores-forno.celo-testnet.org",
                    "tokenBridge": "0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153",
                    "wormholeRelayer": "0x306B68267Deb7c5DfCDa3619E22E9Ca39C374f84",
                    "wormhole": "0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56"
                }
            ]
        }

        ```

    === "`deploySender.ts`"

        ```typescript
          // Load the chain configuration from JSON
          const chains: ChainsConfig = JSON.parse(
            fs.readFileSync(
              path.resolve(__dirname, '../deploy-config/chains.json'),
              'utf8'
            )
          );

          // Get the Avalanche Fuji configuration
          const avalancheChain = chains.chains.find((chain) =>
            chain.description.includes('Avalanche testnet')
          );
        ```

    === "`deployReceiver.ts`"

        ```typescript
          // Load the chain configuration from the JSON file
          const chains: ChainsConfig = JSON.parse(
            fs.readFileSync(
              path.resolve(__dirname, '../deploy-config/chains.json'),
              'utf8'
            )
          );

          // Get the Celo Testnet configuration
          const celoChain = chains.chains.find((chain) =>
            chain.description.includes('Celo Testnet')
          );
        ```

    !!! note
        The `chains.json` file contains the configuration details for the Avalanche Fuji and Celo Alfajores Testnets. You can modify this file to add more networks if needed. For a complete list of contract addresses, visit the [reference page](/docs/products/reference/contract-addresses/){target=\_blank}.

2. **Set up provider and wallet**: The scripts establish a connection to the blockchain using a provider and create a wallet instance using a private key. This wallet is responsible for signing the deployment transaction.

    === "`deploySender.ts`"

        ```typescript
          const provider = new ethers.JsonRpcProvider(avalancheChain.rpc);
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        ```

    === "`deployReceiver.ts`"

        ```typescript
          const provider = new ethers.JsonRpcProvider(celoChain.rpc);
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        ```

3. **Deploy the contract**: The contract is deployed to the network specified in the configuration. Upon successful deployment, the contract address is returned, which is crucial for interacting with the contract later on.

    === "`deploySender.ts`"

        ```typescript
          const senderContract = await MessageSender.deploy(
            avalancheChain.wormholeRelayer
          );
          await senderContract.waitForDeployment();
        ```

    === "`deployReceiver.ts`"

        ```typescript
          const receiverContract = await MessageReceiver.deploy(
            celoChain.wormholeRelayer
          );
          await receiverContract.waitForDeployment();
        ```

4. **Register the `MessageSender` on the target chain**: After you deploy the `MessageReceiver` contract on the Celo Alfajores network, the sender contract address from Avalanche Fuji needs to be registered. This ensures that only messages from the registered `MessageSender` contract are processed.

    This additional step is essential to enforce emitter validation, preventing unauthorized senders from delivering messages to the `MessageReceiver` contract

    ```typescript
      // Retrieve the address of the MessageSender from the deployedContracts.json file
      const avalancheSenderAddress = deployedContracts.avalanche?.MessageSender;
      if (!avalancheSenderAddress) {
        throw new Error('Avalanche MessageSender address not found.');
      }

      // Define the source chain ID for Avalanche Fuji
      const sourceChainId = 6;

      // Call setRegisteredSender on the MessageReceiver contract
      const tx = await (receiverContract as any).setRegisteredSender(
        sourceChainId,
        ethers.zeroPadValue(avalancheSenderAddress, 32)
      );
      await tx.wait();
    ```

You can find the full code for the `deploySender.ts` and `deployReceiver.ts` below.

??? code "deploySender.ts"

    ```typescript
    import { ethers } from 'ethers';
    import fs from 'fs';
    import path from 'path';
    import dotenv from 'dotenv';
    import {
      ChainsConfig,
      DeployedContracts,
      MessageSenderJson,
    } from './interfaces';

    dotenv.config();

    async function main(): Promise<void> {
      // Load the chain configuration from JSON
      const chains: ChainsConfig = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/chains.json'),
          'utf8'
        )
      );

      // Get the Avalanche Fuji configuration
      const avalancheChain = chains.chains.find((chain) =>
        chain.description.includes('Avalanche testnet')
      );
      if (!avalancheChain) {
        throw new Error(
          'Avalanche testnet configuration not found in chains.json.'
        );
      }

      // Set up the provider and wallet
      const provider = new ethers.JsonRpcProvider(avalancheChain.rpc);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      // Load the ABI and bytecode of the MessageSender contract
      const messageSenderJson: MessageSenderJson = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../out/MessageSender.sol/MessageSender.json'),
          'utf8'
        )
      );

      const { abi, bytecode } = messageSenderJson;

      // Create a ContractFactory for MessageSender
      const MessageSender = new ethers.ContractFactory(abi, bytecode, wallet);

      // Deploy the contract using the Wormhole Relayer address for Avalanche Fuji
      const senderContract = await MessageSender.deploy(
        avalancheChain.wormholeRelayer
      );
      await senderContract.waitForDeployment();

      console.log('MessageSender deployed to:', senderContract.target); // `target` is the address in ethers.js v6

      // Update the deployedContracts.json file
      const deployedContractsPath = path.resolve(
        __dirname,
        '../deploy-config/deployedContracts.json'
      );
      const deployedContracts: DeployedContracts = JSON.parse(
        fs.readFileSync(deployedContractsPath, 'utf8')
      );

      deployedContracts.avalanche = {
        MessageSender: senderContract.target as any,
        deployedAt: new Date().toISOString(),
      };

      fs.writeFileSync(
        deployedContractsPath,
        JSON.stringify(deployedContracts, null, 2)
      );
    }

    main().catch((error) => {
      console.error(error);
      process.exit(1);
    });

    ```

??? code "deployReceiver.ts"

    ```typescript
    import { ethers } from 'ethers';
    import fs from 'fs';
    import path from 'path';
    import dotenv from 'dotenv';
    import {
      ChainsConfig,
      DeployedContracts,
      MessageReceiverJson,
    } from './interfaces';

    dotenv.config();

    async function main(): Promise<void> {
      // Load the chain configuration from the JSON file
      const chains: ChainsConfig = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/chains.json'),
          'utf8'
        )
      );

      // Get the Celo Testnet configuration
      const celoChain = chains.chains.find((chain) =>
        chain.description.includes('Celo Testnet')
      );
      if (!celoChain) {
        throw new Error('Celo Testnet configuration not found.');
      }

      // Set up the provider and wallet
      const provider = new ethers.JsonRpcProvider(celoChain.rpc);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      // Load the ABI and bytecode of the MessageReceiver contract
      const messageReceiverJson: MessageReceiverJson = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '../out/MessageReceiver.sol/MessageReceiver.json'
          ),
          'utf8'
        )
      );

      const { abi, bytecode } = messageReceiverJson;

      // Create a ContractFactory for MessageReceiver
      const MessageReceiver = new ethers.ContractFactory(abi, bytecode, wallet);

      // Deploy the contract using the Wormhole Relayer address for Celo Testnet
      const receiverContract = await MessageReceiver.deploy(
        celoChain.wormholeRelayer
      );
      await receiverContract.waitForDeployment();

      console.log('MessageReceiver deployed to:', receiverContract.target); // `target` is the contract address in ethers.js v6

      // Update the deployedContracts.json file
      const deployedContractsPath = path.resolve(
        __dirname,
        '../deploy-config/deployedContracts.json'
      );
      const deployedContracts: DeployedContracts = JSON.parse(
        fs.readFileSync(deployedContractsPath, 'utf8')
      );

      // Retrieve the address of the MessageSender from the deployedContracts.json file
      const avalancheSenderAddress = deployedContracts.avalanche?.MessageSender;
      if (!avalancheSenderAddress) {
        throw new Error('Avalanche MessageSender address not found.');
      }

      // Define the source chain ID for Avalanche Fuji
      const sourceChainId = 6;

      // Call setRegisteredSender on the MessageReceiver contract
      const tx = await (receiverContract as any).setRegisteredSender(
        sourceChainId,
        ethers.zeroPadValue(avalancheSenderAddress, 32)
      );
      await tx.wait();

      console.log(
        `Registered MessageSender (${avalancheSenderAddress}) for Avalanche chain (${sourceChainId})`
      );

      deployedContracts.celo = {
        MessageReceiver: receiverContract.target as any,
        deployedAt: new Date().toISOString(),
      };

      fs.writeFileSync(
        deployedContractsPath,
        JSON.stringify(deployedContracts, null, 2)
      );
    }

    main().catch((error) => {
      console.error(error);
      process.exit(1);
    });

    ```

### Deploy the Sender Contract

The sender contract will handle quoting and sending messages cross-chain.

1. Run the following command to deploy the sender contract:

    ```bash
    npm run deploy:sender
    ```

2. Once deployed, the contract address will be displayed. You may check the contract on the [Avalanche Fuji Explorer](https://testnet.snowtrace.io/){target=\_blank}.

<div id="termynal" data-termynal>
	<span data-ty="input"
		><span class="file-path"></span>npm run deploy:sender</span
	>
	<span data-ty> > wormhole-cross-chain@1.0.0 deploy:sender</span>
	<span data-ty> > node script/deploySender.ts</span>
	<span data-ty> MessageSender deployed to: 0xf5c474f335fFf617fA6FD04DCBb17E20ee0cEfb1</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

### Deploy the Receiver Contract

The receiver contract listens for cross-chain messages and logs them when received.

1. Deploy the receiver contract with this command:
    
    ```bash
    npm run deploy:receiver
    ```

2. After deployment, note down the contract address. You may check the contract on the [Celo Alfajores Explorer](https://alfajores.celoscan.io/){target=\_blank}.


## Send a Cross-Chain Message

Now that both the sender and receiver contracts are deployed, let's move on to the next exciting step: sending a cross-chain message from Avalanche Fuji to Celo Alfajores.

In this example, we will use the `sendMessage.ts` script to transmit a message from the sender contract on Avalanche to the receiver contract on Celo. The script uses [Ethers.js](https://docs.ethers.org/v6/){target=\_blank} to interact with the deployed contracts, calculate the cross-chain cost dynamically, and handle the transaction.

Let's break down the script step by step.

1. **Load configuration files**:

    1. **`chains.json`**: Contains details about the supported Testnet chains, such as RPC URLs and relayer addresses.
    2. **`deployedContracts.json`**: Stores the addresses of the deployed sender and receiver contracts. This file is dynamically updated when contracts are deployed, but users can also manually add their own deployed contract addresses if needed.

    ```typescript
      const chains: ChainsConfig = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/chains.json'),
          'utf8'
        )
      );

      const deployedContracts: DeployedContracts = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/deployedContracts.json'),
          'utf8'
        )
      );
    ```

2. **Configure the provider and signer**: The script first reads the chain configurations and extracts the contract addresses. One essential step in interacting with a blockchain is setting up a _provider_. A provider is your connection to the blockchain network. It allows your script to interact with the blockchain, retrieve data, and send transactions. In this case, we're using a JSON-RPC provider.

    Next, we configure the wallet, which will be used to sign transactions. The wallet is created using the private key and the provider. This ensures that all transactions sent from this wallet are broadcast to the Avalanche Fuji network.
        
    ```typescript
      const provider = new ethers.JsonRpcProvider(avalancheChain.rpc);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    ```

    After setting up the wallet, the script loads the ABI for the `MessageSender.sol` contract and creates an instance of it.

    ```typescript
      const messageSenderJson = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../out/MessageSender.sol/MessageSender.json'),
          'utf8'
        )
      );
    ```

3. **Set up the message details**: The next part of the script defines the target chain (Celo) and the target address (the receiver contract on Celo).

    ```typescript
      const targetChain = 14; // Wormhole chain ID for Celo Alfajores
      const targetAddress = deployedContracts.celo.MessageReceiver;
    ```

    You can customize the message that will be sent across chains.

    ```typescript
      const message = 'Hello from Avalanche to Celo!';
    ```

4. **Estimate cross-chain cost**: Before sending the message, we dynamically calculate the cross-chain cost using the `quoteCrossChainCost` function.

    ```typescript
      const txCost = await MessageSender.quoteCrossChainCost(targetChain);
    ```

    This ensures that the transaction includes enough funds to cover the gas fees for the cross-chain message.

5. **Send a message**: With everything set up, the message is sent using the `sendMessage` function.

    ```typescript
      const tx = await MessageSender.sendMessage(
        targetChain,
        targetAddress,
        message,
        {
          value: txCost,
        }
      );
    ```

    After sending, the script waits for the transaction to be confirmed.

    ```typescript
      await tx.wait();
    ```

6. **Run the script**: To send the message, run the following command:

    ```bash
    npm run send:message
    ```

If everything is set up correctly, the message will be sent from the Avalanche Fuji Testnet to the Celo Alfajores Testnet. You can monitor the transaction and verify that the message was received on Celo using the [Wormhole Explorer](https://wormholescan.io/#/?network=TESTNET){target=\_blank}.

The console should output something similar to this:

<div id="termynal" data-termynal>
	<span data-ty="input"
		><span class="file-path"></span>npm run send:message</span
	>
	<span data-ty> > wormhole-cross-chain@1.0.0 send:message</span>
	<span data-ty> > node script/sendMessage.ts</span>
	<span data-ty
		>Sender Contract Address: 0xD720BFF42a0960cfF1118454A907a44dB358f2b1</span
	>
	<span data-ty
		>Receiver Contract Address: 0x692550997C252cC5044742D1A2BD91E4f4b46D39</span
	>
	<span data-ty>...</span>
	<span data-ty>Transaction sent, waiting for confirmation...</span>
	<span data-ty>...</span>
	<span data-ty
		>Message sent! Transaction hash:
		0x9d359a66ba42baced80062229c0b02b4f523fe304aff3473dcf53117aee13fb6</span
	>
	<span data-ty
		>You may see the transaction status on the Wormhole Explorer:
		https://wormholescan.io/#/tx/0x9d359a66ba42baced80062229c0b02b4f523fe304aff3473dcf53117aee13fb6?network=TESTNET</span
	>
	<span data-ty="input"><span class="file-path"></span></span>
</div>

You can find the full code for the `sendMessage.ts` below.

??? code "sendMessage.ts"

    ```solidity
    import { ethers } from 'ethers';
    import fs from 'fs';
    import path from 'path';
    import dotenv from 'dotenv';
    import { ChainsConfig, DeployedContracts } from './interfaces';

    dotenv.config();

    async function main(): Promise<void> {
      // Load the chain configuration and deployed contract addresses
      const chains: ChainsConfig = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/chains.json'),
          'utf8'
        )
      );

      const deployedContracts: DeployedContracts = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../deploy-config/deployedContracts.json'),
          'utf8'
        )
      );

      console.log(
        'Sender Contract Address: ',
        deployedContracts.avalanche.MessageSender
      );
      console.log(
        'Receiver Contract Address: ',
        deployedContracts.celo.MessageReceiver
      );
      console.log('...');

      // Get the Avalanche Fuji configuration
      const avalancheChain = chains.chains.find((chain) =>
        chain.description.includes('Avalanche testnet')
      );

      if (!avalancheChain) {
        throw new Error(
          'Avalanche testnet configuration not found in chains.json.'
        );
      }

      // Set up the provider and wallet
      const provider = new ethers.JsonRpcProvider(avalancheChain.rpc);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

      // Load the ABI of the MessageSender contract
      const messageSenderJson = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, '../out/MessageSender.sol/MessageSender.json'),
          'utf8'
        )
      );

      const abi = messageSenderJson.abi;

      // Create a contract instance for MessageSender
      const MessageSender = new ethers.Contract(
        deployedContracts.avalanche.MessageSender, // Automatically use the deployed address
        abi,
        wallet
      );

      // Define the target chain and target address (the Celo receiver contract)
      const targetChain = 14; // Wormhole chain ID for Celo Alfajores
      const targetAddress = deployedContracts.celo.MessageReceiver;

      // The message you want to send
      const message = 'Hello from Avalanche to Celo!';

      // Dynamically quote the cross-chain cost
      const txCost = await MessageSender.quoteCrossChainCost(targetChain);

      // Send the message (make sure to send enough gas in the transaction)
      const tx = await MessageSender.sendMessage(
        targetChain,
        targetAddress,
        message,
        {
          value: txCost,
        }
      );

      console.log('Transaction sent, waiting for confirmation...');
      await tx.wait();
      console.log('...');

      console.log('Message sent! Transaction hash:', tx.hash);
      console.log(
        `You may see the transaction status on the Wormhole Explorer: https://wormholescan.io/#/tx/${tx.hash}?network=TESTNET`
      );
    }

    main().catch((error) => {
      console.error(error);
      process.exit(1);
    });

    ```

## Conclusion

You're now fully equipped to build cross-chain contracts using the Wormhole protocol! With this tutorial, you've learned how to:

- Deploy sender and receiver contracts on different testnets.
- Send a cross-chain message from one blockchain to another.
- Monitor the status of your cross-chain transactions using Wormholescan and the Wormhole Solidity SDK.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
