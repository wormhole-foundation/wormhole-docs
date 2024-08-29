---
title: TODO
description: TODO
---

# Cross-chain Token Contracts

## Introduction

In this tutorial, you'll learn how to create a simple cross-chain token transfer system using the Wormhole protocol. We'll guide you through building and deploying smart contracts that allow you to send tokens from one blockchain to another seamlessly. Whether you're a developer looking to explore cross-chain applications or just interested in the Wormhole protocol, this guide will help you understand the fundamentals.

By the end of this tutorial, you'll have a working cross-chain token transfer system that you can further customize and integrate into your own projects.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for deploying contracts
- TestNet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Celo-Alfajores](https://faucet.celo.org/alfajores){target=\_blank} to cover gas fees
- Wallet private key

## Project Setup

Let's start by initializing a new Foundry project. This will set up a basic structure for our smart contracts and tests.

1. Open your terminal and run the following command to initialize a new Foundry project:
    
    ```bash
    npx create-foundry-project cross-chain-token-contracts
    ```

    This will create a new directory named `cross-chain-token-transfer` with a basic project structure.

2. Navigate into the newly created project directory:

    ```bash
    cd cross-chain-token-contracts
    ```

## Writing the Smart Contracts

Now that our project is set up, let's start by writing the smart contracts that will handle the cross-chain token transfers. We'll create two main contracts:

 - **`CrossChainSender.sol`** - this contract will handle sending tokens from one blockchain to another.
 - **`CrossChainReceiver.sol`** - this contract will receive tokens on the target blockchain.

### CrossChainSender Contract

1. Create a new file named `CrossChainSender.sol` in the `src` directory:
    
    ```bash
    touch src/CrossChainSender.sol
    ```

2. Open the file. First, we'll start with the imports and the contract setup:

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-1.sol:1:14"
    ```

    This sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

3. Next, let's add a function that estimates the cost of sending tokens across chains:

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-1.sol:17:28"
    ```

    This function, `quoteCrossChainDeposit`, helps calculate how much it will cost to transfer tokens to a different chain. It factors in both the delivery cost and the cost of publishing a message via the Wormhole protocol.

4. Finally, we'll add the function that actually sends the tokens across chains:

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-1.sol:31:57"
    ```

    This sendCrossChainDeposit function is where the actual token transfer happens. It sends the tokens to the recipient on the target chain using the Wormhole protocol.

You can find the full code for the `CrossChainSender.sol` below.

??? code "MessageSender.sol"

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-1.sol"
    ```

### CrossChainReceiver Contract

<!-- The `CrossChainReceiver` contract will: -->

<!-- - Inherit from the `TokenReceiver` contract provided by the Wormhole SDK.
- Receive tokens and a payload sent from the `CrossChainSender` contract on a different chain.
- Decode the payload to determine the recipient on the destination chain.
- Transfer the received tokens to the recipient specified in the payload. -->

1. Create a new file named `CrossChainReceiver.sol` in the `src` directory:

    ```bash
    touch src/CrossChainReceiver.sol
    ```

2. Open the file. First, we'll start with the imports and the contract setup:

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-2.sol:1:13"
    ```

    Same as the `CrossChainSender` contract, this sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

3. Next, let's add a function to handle receiving the payload and tokens:

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-2.sol:16:31"
    ```

    This `receivePayloadAndTokens` function processes the tokens and payload sent from another chain, decoding the recipient address and transferring the tokens to them.

You can find the full code for the `CrossChainReceiver.sol` contract below:

??? code "CrossChainReceiver.sol"

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-2.sol"
    ```

## Deploy the Contracts

Now that you've written the `CrossChainSender` and `CrossChainReceiver` contracts, it's time to deploy them to your chosen networks.

1. Set Up Deployment Configuration:

    Before deploying, you need to configure the networks and the deployment environment. This information is stored in a configuration file.

    1. Create a directory named deploy-config in the root of your project:

        ```bash
        mkdir deploy-config
        ```

    2. Create a `config.json` file in the `deploy-config` directory:

        ```bash
        touch deploy-config/config.json
        ```

    3. Open the `config.json` file and add the following configuration:

        ```json
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-3.json"
        ```

        This file specifies the details for each chain where you plan to deploy your contracts, including the RPC URL, the token bridge address, the Wormhole relayer, and the Wormhole core contract.

2. Write the Deployment Script:

    You’ll need a script to automate the deployment of your contracts. Let’s create the deployment script.

    1. Load imports and configuration:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:1:7"
        ```

        Import required libraries and modules for interacting with Ethereum, handling file paths, loading environment variables, and enabling user interaction via the terminal.
    
    2. Load and select the chains for deployment:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:27:41"
        ```

        The `loadConfig` function reads the chain configuration from the `config.json` file, and the `selectChain` function allows the user to interactively choose the source and target chains for deployment. The user is prompted in the terminal to select which chains to use, making the process interactive and user-friendly.

    3. Deploy the `CrossChainSender` and `CrossChainReceiver` contracts:

        === "`CrossChainSender`"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:80:85"
            ```

        === "`CrossChainReceiver`"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:113:118"
            ```

        Both functions deploy the respective contracts to the selected chains.

    4. Save the deployment details:

        Add your desired logic to save the deployed contract addresses in a JSON file (or another format). This will be important later when transferring tokens, as you'll need these addresses to interact with the deployed contracts.

        Below is an example of how to handle this logic in TypeScript:

        ???- example "Save Deployment Details"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:141:167"
            ```

3. Set Up Your Node.js Environment:

    Before running the deployment script, you'll need to set up your Node.js environment:

    1. Initialize a Node.js project:

        ```bash
        npm init -y
        ```
    
    2. Install the necessary dependencies:

        ```bash
        npm install ethers dotenv readline-sync
        ```

        These dependencies are required for the deployment script to work properly.
    
4. Run the Deployment Script:

    1. Open a terminal and run the following command:

        ```bash
        npx ts-node deploy.ts
        ```

        This will execute the deployment script, deploying both contracts to the selected chains.

    2. Check the deployment output:

        - If successful, you will see the deployed contract addresses printed in the terminal. The `contracts.json` file will be updated with these addresses.
        - If you encounter an error, the script will provide feedback, such as insufficient funds for gas.

You can find the full code for the `deploy.ts` file below:

??? code "deploy.ts"

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts"
    ```

