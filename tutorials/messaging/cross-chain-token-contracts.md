---
title: Cross-chain Token Contracts
description: Learn how to create cross-chain token transfers using Wormhole's Solidity SDK. Build and deploy smart contracts to send tokens from one blockchain to another.
---

<!-- 
- Valid Tokens for Transfer -> Expand in description and reference to the respective functions. Chack Wormhole official documentation for ideas.

 -->

# Cross-chain Token Contracts

## Introduction

In this tutorial, you'll learn how to create a simple cross-chain token transfer system using the Wormhole protocol and the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank}. We'll guide you through building and deploying smart contracts that enable seamless token transfers of IERC-20 tokens between blockchains. Whether you're a developer looking to explore cross-chain applications or just interested in the Wormhole protocol, this guide will help you understand the fundamentals.

By the end of this tutorial, you'll have a working cross-chain token transfer system, built with the powerful tools provided by the Wormhole Solidity SDK, which you can further customize and integrate into your own projects.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for deploying contracts
- TestNet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Celo-Alfajores](https://faucet.celo.org/alfajores){target=\_blank} to cover gas fees
- [USDC TestNet](https://faucet.circle.com/){target=\_blank} tokens on Avalanche-Fuji or/and Celo-Alfajores for cross-chain transfer
- Wallet private key

## Valid Tokens for Transfer

It's important to note that this tutorial leverages [Wormhole's TokenBridge](https://github.com/wormhole-foundation/wormhole/blob/6130bbb6f456b42b789a71f7ea2fd049d632d2fb/ethereum/contracts/bridge/TokenBridge.sol){target=\_blank} to transfer tokens between chains. Therefore, the tokens you wish to transfer must be attested on the TokenBridge contract of the target blockchain.

To simplify this process, we've included a tool that allows you to check if a token is already attested on the target chain. This tool uses the `wrappedAsset` function from the TokenBridge contract. If the token is attested, the `wrappedAsset` function returns the address of the wrapped token on the target chain; otherwise, it returns the zero address.

???- tip "Check Token Attestation"
    1. Clone the [repository](https://github.com/martin0995/cross-chain-token-transfers){target=\_blank} and navigate to the project directory:
        ```bash
        git clone https://github.com/martin0995/cross-chain-token-transfers.git
        cd cross-chain-token-transfers
        ```
    2. Install the dependencies:
        ```bash
        npm install
        ```
    
    3. Run the script to check token attestation:
        ```bash
        npm run verify
        ```

    4. Follow the prompts:

        - Enter the RPC URL of the target chain
        - Enter the Token Bridge contract address on the target chain
        - Enter the token contract address on the source chain
        - Enter the source chain ID

    5. The expected output when the token is attested:
        
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-10.html"
    
    Using this tool ensures that you only attempt to transfer tokens that are properly attested, avoiding any potential issues during the cross-chain transfer process.

## Project Setup

Let's start by initializing a new Foundry project. This will set up a basic structure for our smart contracts.

1. Open your terminal and run the following command to initialize a new Foundry project:
    
    ```bash
    npx create-foundry-project cross-chain-token-contracts
    ```

    This will create a new directory named `cross-chain-token-transfer` with a basic project structure.

2. Navigate into the newly created project directory:

    ```bash
    cd cross-chain-token-contracts
    ```

3. Install the Wormhole Solidity SDK:

    ```bash
    forge install wormhole-foundation/wormhole-solidity-sdk
    ```

    To ease development, we'll make use of the Wormhole Solidity SDK, which provides useful helpers for cross-chain development.

    This SDK includes the `TokenSender` and `TokenReceiver` abstract classes, which simplify the process of sending and receiving tokens across chains.

## Build Cross-Chain Contracts

In this section, we'll build two smart contracts: one to send tokens from a source chain and another to receive them on a target chain. These contracts will interact with the Wormhole protocol to facilitate secure and seamless cross-chain token transfers.

At a high level, our contracts will:

1. Send tokens from one blockchain to another using the Wormhole protocol
2. Receive and process the tokens on the target chain, ensuring they are correctly transferred to the intended recipient

Before diving into the contract implementation steps, let’s first break down the key parts of the contracts.

### Sender Contract: CrossChainSender

The `CrossChainSender` contract is responsible for calculating the cost of sending tokens across chains and then facilitating the actual token transfer. This contract leverages the Wormhole protocol to ensure seamless cross-chain transactions.

Key functions include:

 - **`quoteCrossChainDeposit`** - calculates the cost of delivering tokens to the target chain using the Wormhole protocol
 - **`sendCrossChainDeposit`** - encodes the recipient's address and sends the tokens to the target chain and contract address using the Wormhole protocol

Let's start writing the `CrossChainSender` contract:

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

    This `sendCrossChainDeposit` function is where the actual token transfer happens. It sends the tokens to the recipient on the target chain using the Wormhole protocol.

You can find the full code for the `CrossChainSender.sol` below.

??? code "MessageSender.sol"

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-1.sol"
    ```

### Receiver Contract: CrossChainReceiver

The `CrossChainReceiver` contract is designed to handle the receipt of tokens and payloads from another blockchain. It ensures that the tokens are properly transferred to the designated recipient on the receiving chain.

Key functions include:

 - **`receivePayloadAndTokens`** - processes the incoming tokens and payload from another chain, decodes the recipient's address, and transfers the tokens to that address using the Wormhole protocol

Let's start writing the `CrossChainReceiver` contract:

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

1. **Set up deployment configuration** - before deploying, you need to configure the networks and the deployment environment. This information is stored in a configuration file

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

        !!! note
            You can add your desired chains to this file by specifying the required fields for each chain. In this example, we're using the Avalanche Fuji and Celo Alfajores TestNets.

    4. Create a `contracts.json` file in the `deploy-config` directory:

        ```bash
        touch deploy-config/contracts.json
        ```

        This file can be left blank initially. It will be automatically updated with the deployed contract addresses after a successful deployment

2. **Write the deployment script** - you’ll need a script to automate the deployment of your contracts. Let’s create the deployment script

    1. Create a new file named `deploy.ts` in the `/src` directory:

        ```bash
        touch src/deploy.ts
        ```

    2. Load imports and configuration:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:1:7"
        ```

        Import required libraries and modules for interacting with Ethereum, handling file paths, loading environment variables, and enabling user interaction via the terminal.
    
    3. Load and select the chains for deployment:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:27:47"
        ```

        The `loadConfig` function reads the chain configuration from the `config.json` file, and the `selectChain` function allows the user to interactively choose the source and target chains for deployment. The user is prompted in the terminal to select which chains to use, making the process interactive and user-friendly.

    4. Set up provider and wallet: 
    
        The scripts establish a connection to the blockchain using a provider and create a wallet instance using a private key. This wallet is responsible for signing the deployment transaction:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:55:57"
        ```

    5. Deploy the `CrossChainSender` and `CrossChainReceiver` contracts:

        === "`CrossChainSender`"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:80:85"
            ```

        === "`CrossChainReceiver`"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:113:118"
            ```

        Both functions deploy the respective contracts to the selected chains.

    6. Save the deployment details:

        Add your desired logic to save the deployed contract addresses in a JSON file (or another format). This will be important later when transferring tokens, as you'll need these addresses to interact with the deployed contracts.

        Below is an example of how to handle this logic in TypeScript:

        ???- example "Save Deployment Details"
            ```typescript
            --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-4.ts:141:167"
            ```

3. **Add your private key**

    Create a `.env` file in the root of the project and add your private key:

    ```bash
    touch .env
    ```

    Inside `.env`, add your private key in the following format:

    ```env
    PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```

4. **Compile your smart contracts** - before running the deployment script, compile your smart contracts using Foundry. This ensures that your contracts are up-to-date and ready for deployment.

    - Run the following command to compile your contracts:

        ```bash
        forge build
        ```

        This will compile all the smart contracts in your project and generate the necessary ABI and bytecode files in a directory named `/out`.

    The expected output should be similar to this:

    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-6.html"

5. **Set up your Node.js environment** - before running the deployment script, you'll need to set up your Node.js environment

    1. Initialize a Node.js project:

        ```bash
        npm init -y
        ```
    
    2. Install the necessary dependencies:

        ```bash
        npm install ethers dotenv readline-sync
        ```

        These dependencies are required for the deployment script to work properly.
    
6. **Run the deployment script**

    1. Open a terminal and run the following command:

        ```bash
        npx ts-node src/deploy.ts
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

If you followed the logic provided in the full code above, your terminal output should look something like this:

--8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-7.html"


## Transfer Tokens Across Chains

### Quick Recap

Up to this point, you've set up a new Solidity project using Foundry, developed two key contracts (`CrossChainSender` and `CrossChainReceiver`), and created a deployment script to deploy these contracts to different blockchain networks. The deployment script also saves the new contract addresses for easy reference. Now, with everything in place, it's time to transfer tokens using the deployed contracts.

In this step, you'll write a script to transfer tokens across chains using the `CrossChainSender` and `CrossChainReceiver` contracts you deployed earlier. This script will interact with the contracts and facilitate the cross-chain token transfer.

### Transfer Script

1. **Set up the transfer script** - first, let's create the transfer script:

    1. Create a new file named `transfer.ts` in the `/src` directory:

        ```bash
        touch src/transfer.ts
        ```

    2. Open the file. Start with the necessary imports and configurations:

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:1:7"
        ```

        These imports include the essential libraries for interacting with Ethereum, handling file paths, loading environment variables, and managing user input.

    3. Load configuration and contracts:


        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:27:47"
        ```

        These functions load the network and contract details that were saved during deployment.

    4. Allow users to select source and target chains:

        Refer to the deployed contracts and create logic as desired. In our example, we made this process interactive, allowing users to select the source and target chains from all the contracts that have been deployed historically. This interactive approach helps ensure that the correct chains are selected for the token transfer.

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:49:101"
        ```

2. **Implement the token transfer logic**

    1. Start the `main` function:
    
        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:103:139"
        ```
    
        The `main` function is where the token transfer logic will reside. It loads the chain and contract details, sets up the wallet and provider, and loads the `CrossChainSender` contract.

    2. Ask the user for token transfer details:

        You'll now ask the user for the token contract address, recipient address on the target chain, and the amount of tokens to transfer.

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:147:171"
        ```

        This section of the script prompts the user for the token contract address and the recipient's address, fetches the token's decimal value, and parses the amount accordingly.

    3. Initiate the transfer:

        Finally, initiate the cross-chain transfer and log the details.

        ```typescript
        --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts:174:199"
        ```

        This part of the script first approves the token transfer, then initiates the cross-chain transfer using the `CrossChainSender` contract, and finally logs the transaction hash for the user to track.

You can find the full code for the `transfer.ts` file below:

??? code "transfer.ts"

    ```solidity
    --8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-5.ts"
    ```

### Transfer Tokens

Now that your transfer script is ready, it’s time to execute it and perform a cross-chain token transfer.

1. **Run the transfer script**

    Open your terminal and run the transfer script:

    ```bash
    npx ts-node src/transfer.ts
    ```

    This command will start the script, prompting you to select the source and target chains, input the token address, recipient address, and the amount of tokens to transfer.

2. **Follow the prompts** - the script will guide you through selecting the source and target chains, as well as entering the necessary details for the token transfer. Once you provide all the required information, the script will initiate the token transfer.

3. **Verify the transaction** - after running the script, you should see a confirmation message with the transaction hash. You can use this transaction hash to check the status of the transfer on the respective blockchain explorers.

You can verify the transaction on the [Wormhole Explorer](https://wormholescan.io/){target=\_balnk} using the provided link in the terminal output. This explorer also offers an option to add the transferred token to your MetaMask wallet automatically.

If you followed the logic provided in the `transfer.ts` file above, your terminal output should look something like this:

--8<-- "code/tutorials/messaging/cross-chain-token-contracts/snippet-8.html"

!!! note
    In this example, we demonstrated a token transfer from the Avalanche Fuji TestNet to the Celo Alfajores TestNet. We sent 2 units of USDC TestNet tokens using the token contract address `0x5425890298aed601595a70ab815c96711a31bc65`. You can replace these details with those relevant to your own project or use the same for testing purposes.

## Resources

If you'd like to explore the full project or need a reference while following this tutorial, you can find the complete codebase in the [GitHub repository](https://github.com/martin0995/cross-chain-token-transfers){target=\_blank}. The repository includes all the scripts, contracts, and configurations needed to deploy and transfer tokens across chains using the Wormhole protocol.

## Conclusion

Congratulations! You've successfully built and deployed a cross-chain token transfer system using Solidity and the Wormhole protocol. You've learned how to:

 - Set up a new Solidity project using Foundry
 - Develop smart contracts to send and receive tokens across chains
 - Write deployment scripts to manage and deploy contracts on different networks