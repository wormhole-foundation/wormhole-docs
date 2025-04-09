---
title: Cross-Chain Token Transfers
description: Learn how to create cross-chain token transfers using Wormhole's Solidity SDK. Build and deploy smart contracts to send tokens from one blockchain to another.
---

# Create Cross-Chain Token Transfer Contracts

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-cross-chain-token-transfer){target=\_blank}

## Introduction

In this tutorial, you'll learn how to create a simple cross-chain token transfer system using the Wormhole protocol via the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank}. We'll guide you through building and deploying smart contracts that enable seamless token transfers of IERC-20 tokens between blockchains. Whether you're a developer looking to explore cross-chain applications or just interested in the Wormhole protocol, this guide will help you understand the fundamentals.

By the end of this tutorial, you'll have a working cross-chain token transfer system built with the powerful tools provided by the Wormhole Solidity SDK, which you can further customize and integrate into your projects.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for deploying contracts
- Testnet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Celo-Alfajores](https://faucet.celo.org/alfajores){target=\_blank} to cover gas fees
- [USDC Testnet](https://faucet.circle.com/){target=\_blank} tokens on Avalanche-Fuji or/and Celo-Alfajores for cross-chain transfer
- Wallet private key

## Valid Tokens for Transfer

It's important to note that this tutorial leverages [Wormhole's TokenBridge](https://github.com/wormhole-foundation/wormhole/blob/6130bbb6f456b42b789a71f7ea2fd049d632d2fb/ethereum/contracts/bridge/TokenBridge.sol){target=\_blank} to transfer tokens between chains. So, the tokens you'd like to transfer must have an attestation on the `TokenBridge` contract of the target blockchain.

To simplify this process, we've included a tool for verifying if a token has an attestation on the target chain. This tool uses the [`wrappedAsset`](https://github.com/wormhole-foundation/wormhole/blob/6130bbb6f456b42b789a71f7ea2fd049d632d2fb/ethereum/contracts/bridge/BridgeGetters.sol#L50-L52){target=\_blank} function from the `TokenBridge` contract. If the token has an attestation, the `wrappedAsset` function returns the address of the wrapped token on the target chain; otherwise, it returns the zero address.

???- tip "Check Token Attestation"
    1. Clone the [repository](https://github.com/wormhole-foundation/demo-cross-chain-token-transfer){target=\_blank} and navigate to the project directory:
        ```bash
        git clone https://github.com/wormhole-foundation/demo-cross-chain-token-transfer.git
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

        1. Enter the RPC URL of the target chain
        2. Enter the `TokenBridge` contract address on the target chain
        3. Enter the token contract address on the source chain
        4. Enter the source chain ID

    5. The expected output when the token has an attestation:
        
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-10.html"
    
    Using this tool ensures that you only attempt to transfer tokens with verified attestations, avoiding any potential issues during the cross-chain transfer process.

## Project Setup

Let's start by initializing a new Foundry project. This will set up a basic structure for our smart contracts.

1. Open your terminal and run the following command to initialize a new Foundry project:
    
    ```bash
    forge init cross-chain-token-transfers
    ```

    This will create a new directory named `cross-chain-token-transfers` with a basic project structure. This also initializes a new `git` repository.

2. Navigate into the newly created project directory:

    ```bash
    cd cross-chain-token-transfers
    ```

3. Install the Wormhole Solidity SDK:

    ```bash
    forge install wormhole-foundation/wormhole-solidity-sdk
    ```

    To ease development, we'll use the Wormhole Solidity SDK, which provides useful helpers for cross-chain development.
    This SDK includes the `TokenSender` and `TokenReceiver` abstract classes, which simplify sending and receiving tokens across chains.

## Build Cross-Chain Contracts

In this section, we'll build two smart contracts to send tokens from a source chain and receive them on a target chain. These contracts will interact with the Wormhole protocol to facilitate secure and seamless cross-chain token transfers.

At a high level, our contracts will:

1. Send tokens from one blockchain to another using the Wormhole protocol
2. Receive and process the tokens on the target chain, ensuring they are correctly transferred to the intended recipient

Before diving into the contract implementation steps, let’s first break down the key parts of the contracts.

### Sender Contract: CrossChainSender

The `CrossChainSender` contract calculates the cost of sending tokens across chains and then facilitates the actual token transfer.

Let's start writing the `CrossChainSender` contract:

1. Create a new file named `CrossChainSender.sol` in the `/src` directory:
    
    ```bash
    touch src/CrossChainSender.sol
    ```

2. Open the file. First, we'll start with the imports and the contract setup:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-1.sol:1:14"
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-1.sol:58:58"
    ```

    This sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

    With the contract structure in place, define the following functions within its body to enable multichain token transfers.

3. Next, let's add a function that estimates the cost of sending tokens across chains:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-1.sol:17:28"
    ```

    This function, `quoteCrossChainDeposit`, helps calculate the cost of transferring tokens to a different chain. It factors in the delivery cost and the cost of publishing a message via the Wormhole protocol.

4. Finally, we'll add the function that sends the tokens across chains:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-1.sol:31:57"
    ```

    This `sendCrossChainDeposit` function is where the actual token transfer happens. It sends the tokens to the recipient on the target chain using the Wormhole protocol.

Here’s a breakdown of what happens in each step of the `sendCrossChainDeposit` function:

1. **Cost calculation** - the function starts by calculating the cost of the cross-chain transfer using `quoteCrossChainDeposit`(`targetChain`). This cost includes both the delivery fee and the Wormhole message fee. The `sendCrossChainDeposit` function then checks that the user has sent the correct amount of Ether to cover this cost (`msg.value`)

2. **Token transfer to contract** - the next step is to transfer the specified amount of tokens from the user to the contract itself using `IERC-20(token).transferFrom(msg.sender, address(this), amount)`. This ensures that the contract has custody of the tokens before initiating the cross-chain transfer

3. **Payload encoding** - The recipient's address on the target chain is encoded into a payload using `abi.encode(recipient)`. This payload will be sent along with the token transfer, so the target contract knows who should receive the tokens on the destination chain

4. **Cross-chain transfer** - the `sendTokenWithPayloadToEvm` function is called to initiate the cross-chain token transfer. This function:
    - Specifies the `targetChain` (the Wormhole chain ID of the destination blockchain).
    - Sends the `targetReceiver` contract address on the target chain that will receive the tokens.
    - Attaches the payload containing the recipient's address.
    - Sets the `GAS_LIMIT` for the transaction.
    - Passes the token `address` and `amount` to transfer.

    This triggers the Wormhole protocol to handle the cross-chain messaging and token transfer, ensuring the tokens and payload reach the correct destination on the target chain.

You can find the complete code for the `CrossChainSender.sol` below.

??? code "MessageSender.sol"

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-1.sol"
    ```

### Receiver Contract: CrossChainReceiver

The `CrossChainReceiver` contract is designed to handle the receipt of tokens and payloads from another blockchain. It ensures that the tokens are correctly transferred to the designated recipient on the receiving chain.

Let's start writing the `CrossChainReceiver` contract:

1. Create a new file named `CrossChainReceiver.sol` in the `/src` directory:

    ```bash
    touch src/CrossChainReceiver.sol
    ```

2. Open the file. First, we'll start with the imports and the contract setup:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-2.sol:1:14"
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-2.sol:40:40"
    ```

    Similar to the `CrossChainSender` contract, this sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

3. Next, let's add a function inside the contract to handle receiving the payload and tokens:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-2.sol:17:39"
    ```

    This `receivePayloadAndTokens` function processes the tokens and payload sent from another chain, decodes the recipient address, and transfers the tokens to them using the Wormhole protocol. This function also validates the emitter (`sourceAddress`) to ensure the message comes from a trusted sender.

    This function ensures that:

    - It only processes one token transfer at a time
    - The `sourceAddress` is checked against a list of registered senders using the `isRegisteredSender` modifier, which verifies if the emitter is allowed to send tokens to this contract
    - The recipient address is decoded from the payload, and the received tokens are transferred to them using the ERC-20 interface

After we call `sendTokenWithPayloadToEvm` on the source chain, the message goes through the standard Wormhole message lifecycle. Once a [VAA (Verifiable Action Approval)](/docs/learn/infrastructure/vaas/){target=\_blank} is available, the delivery provider will call `receivePayloadAndTokens` on the target chain and target address specified, with the appropriate inputs.

??? tip "Understanding the `TokenReceived` Struct"

    Let’s delve into the fields provided to us in the `TokenReceived` struct:

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-11.sol"
    ```

    - **`tokenHomeAddress`** - the original address of the token on its native chain. This is the same as the token field in the call to `sendTokenWithPayloadToEvm` unless the original token sent is a Wormhole-wrapped token. In that case, this will be the address of the original version of the token (on its native chain) in Wormhole address format (left-padded with 12 zeros)

    - **`tokenHomeChain`** - the Wormhole chain ID corresponding to the home address above. This will typically be the source chain unless the original token sent is a Wormhole-wrapped asset, which will be the chain of the unwrapped version of the token

    - **`tokenAddress`** - the address of the IERC-20 token on the target chain that has been transferred to this contract. If `tokenHomeChain` equals the target chain, this will be the same as `tokenHomeAddress`; otherwise, it will be the Wormhole-wrapped version of the token sent

    - **`amount`** - the token amount sent to you with the same units as the original token. Since `TokenBridge` only sends with eight decimals of precision, if your token has 18 decimals, this will be the "amount" you sent, rounded down to the nearest multiple of 10^10

    - **`amountNormalized`** - the amount of token divided by (1 if decimals ≤ 8, else 10^(decimals - 8))

You can find the complete code for the `CrossChainReceiver.sol` contract below:

??? code "CrossChainReceiver.sol"

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-2.sol"
    ```

## Deploy the Contracts

Now that you've written the `CrossChainSender` and `CrossChainReceiver` contracts, it's time to deploy them to your chosen networks.

1. **Set up deployment configuration** - before deploying, you must configure the networks and the deployment environment. This information is stored in a configuration file

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
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-3.json"
        ```

        This file specifies the details for each chain where you plan to deploy your contracts, including the RPC URL, the `TokenBridge` address, the Wormhole relayer, and the Wormhole Core Contract.

        For a complete list of Wormhole contract addresses on various blockchains, refer to the [Wormhole Contract Addresses](/docs/build/reference/contract-addresses/){target=_blank}.

        !!! note
            You can add your desired chains to this file by specifying the required fields for each chain. In this example, we use the Avalanche Fuji and Celo Alfajores Testnets.

    4. Create a `contracts.json` file in the `deploy-config` directory:

        ```bash
        echo '{}' > deploy-config/contracts.json
        ```

        This file can be left blank initially. It will be automatically updated with the deployed contract addresses after a successful deployment

2. **Set up your Node.js environment** - you'll need to set up your Node.js environment to run the deployment script

    1. Initialize a Node.js project:

        ```bash
        npm init -y
        ```
    
    2. Install the necessary dependencies:

        ```bash
        npm install ethers dotenv readline-sync @types/readline-sync
        ```

        These dependencies are required for the deployment script to work properly.

3. **Compile your smart contracts** - compile your smart contracts using Foundry. This ensures that your contracts are up-to-date and ready for deployment

    - Run the following command to compile your contracts:

        ```bash
        forge build
        ```

        This will generate the necessary ABI and bytecode files in a directory named `/out`.

    The expected output should be similar to this:

    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-6.html"

4. **Write the deployment script** - you’ll need a script to automate the deployment of your contracts. Let’s create the deployment script

    1. Create a new file named `deploy.ts` in the `/script` directory:

        ```bash
        touch script/deploy.ts
        ```

    2. Open the file and load imports and configuration:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:1:7"
        ```

        Import the required libraries and modules to interact with Ethereum, handle file paths, load environment variables, and enable user interaction via the terminal.

    3. Define interfaces to use for chain configuration and contract deployment:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:9:25"
        ```

        These interfaces define the structure of the chain configuration and the contract deployment details.

    4. Load and select the chains for deployment:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:27:47"
        ```

        The `loadConfig` function reads the chain configuration from the `config.json` file, and the `selectChain` function allows the user to choose the source and target chains for deployment interactively. The user is prompted in the terminal to select which chains to use, making the process interactive and user-friendly.

    5. Define the main function for deployment and load the chain configuration:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:48:53"
        ```

        - The `main` function is the entry point for the deployment script
        - We then call the `loadConfig` function we previously defined to load the chain configuration from the `config.json` file

    6. Set up provider and wallet: 
    
        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:54:57"
        ```
        
        The scripts establish a connection to the blockchain using a provider and create a wallet instance using a private key. This wallet is responsible for signing the deployment transaction on the source chain.

    7. Read the compiled contracts:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:58:66"
        ```

        - This code reads the `CrossChainSender.json` file, the compiled output of the `CrossChainSender.sol` contract
        - The file is in the `../out/` directory, which contains the ABI (Application Binary Interface) and bytecode generated during contract compilation
        - It uses the `fs.readFileSync` function to read the file and `JSON.parse` to convert the file contents (in JSON format) into a JavaScript object

    8. Extract the contract ABI and bytecode:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:68:69"
        ```

        - **ABI (Application Binary Interface)** - defines the structure of the contract’s functions, events, and data types, allowing the front end to interact with the contract on the blockchain
        - **Bytecode** - this is the compiled machine code that will be deployed to the blockchain to create the contract

    9. Create the Contract Factory:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:71:75"
        ```

        - **`ethers.ContractFactory`** - creates a new contract factory using the ABI, bytecode, and a wallet (representing the signer). The contract factory is responsible for deploying instances of the contract to the blockchain
        - This is a crucial step for deploying the contract since the factory will create and deploy the `CrossChainSender` contract

    10. Deploy the `CrossChainSender` and `CrossChainReceiver` contracts:

        === "`CrossChainSender`"
            ```typescript
            --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:77:83"
            ```

        === "`CrossChainReceiver`"
            ```typescript
            --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:91:115"
            ```

        Both functions deploy the respective contracts to the selected chains.

        For the `CrossChainReceiver` contract:

        - It defines the wallet related to the target chain
        - The logic reads the compiled ABI and bytecode from the JSON file generated during compilation
        - It creates a new contract factory using the ABI, bytecode, and wallet
        - It deploys the contract to the selected chain passing in the Wormhole Relayer, `TokenBridge`, and Wormhole addresses

    11. Save the deployed contract addresses:

        === "`senderAddress`"
            ```typescript
            --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:86:89"
            ```

        === "`receiverAddress`"
            ```typescript
            --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:118:121"
            ```

        You may display the deployed contract addresses in the terminal or save them to a JSON file for future reference.

    12. Register the `CrossChainSender` address on the target chain:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:128:139"
        ```

        After you deploy the `CrossChainReceiver` contract on the target network, the sender contract address from the source chain needs to be registered. This ensures that only messages from the registered `CrossChainSender` contract are processed.

        This additional step is essential to enforce emitter validation, preventing unauthorized senders from delivering messages to the `CrossChainReceiver` contract.

    13. Save the deployment details:

        ???- example "Save Deployment Details Example"
            ```typescript
            --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:145:185"
            ```
        
        Add your desired logic to save the deployed contract addresses in a JSON file (or another format). This will be important later when transferring tokens, as you'll need these addresses to interact with the deployed contracts.

    14. Handle errors and finalize the script:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts:186:201"
        ```

        The try-catch block wraps the deployment logic to catch any errors that may occur.

        - If the error is due to insufficient funds, it logs a clear message about needing more gas fees
        - For any other errors, it logs the specific error message to help with debugging

        The `process.exit(1)` ensures that the script exits with a failure status code if any error occurs.

    You can find the full code for the `deploy.ts` file below:

    ??? code "deploy.ts"

        ```solidity
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-4.ts"
        ```

5. **Add your private key** - you'll need to provide your private key. It allows your deployment script to sign the transactions that deploy the smart contracts to the blockchain. Without it, the script won't be able to interact with the blockchain on your behalf

    Create a `.env` file in the root of the project and add your private key:

    ```bash
    touch .env
    ```

    Inside `.env`, add your private key in the following format:

    ```env
    PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```
    
6. **Run the deployment script**

    1. Open a terminal and run the following command:

        ```bash
        npx ts-node script/deploy.ts
        ```

        This will execute the deployment script, deploying both contracts to the selected chains.

    2. Check the deployment output:

        - You will see the deployed contract addresses printed in the terminal if successful. The `contracts.json` file will be updated with these addresses
        - If you encounter an error, the script will provide feedback, such as insufficient funds for gas

If you followed the logic provided in the full code above, your terminal output should look something like this:

--8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-7.html"


## Transfer Tokens Across Chains

### Quick Recap

Up to this point, you've set up a new Solidity project using Foundry, developed two key contracts (`CrossChainSender` and `CrossChainReceiver`), and created a deployment script to deploy these contracts to different blockchain networks. The deployment script also saves the new contract addresses for easy reference. With everything in place, it's time to transfer tokens using the deployed contracts.

In this step, you'll write a script to transfer tokens across chains using the `CrossChainSender` and `CrossChainReceiver` contracts you deployed earlier. This script will interact with the contracts and facilitate the cross-chain token transfer.

### Transfer Script

1. **Set up the transfer script**

    1. Create a new file named `transfer.ts` in the `/script` directory:

        ```bash
        touch script/transfer.ts
        ```

    2. Open the file. Start with the necessary imports, interfaces and configurations:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:1:25"
        ```

        These imports include the essential libraries for interacting with Ethereum, handling file paths, loading environment variables, and managing user input.

    3. Load configuration and contracts:


        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:27:47"
        ```

        These functions load the network and contract details that were saved during deployment.

    4. Allow users to select source and target chains:

        Refer to the deployed contracts and create logic as desired. In our example, we made this process interactive, allowing users to select the source and target chains from all the historically deployed contracts. This interactive approach helps ensure the correct chains are selected for the token transfer.

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:49:101"
        ```

2. **Implement the token transfer logic**

    1. Start the `main` function:
    
        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:103:139"
        ```
    
        The `main` function is where the token transfer logic will reside. It loads the chain and contract details, sets up the wallet and provider, and loads the `CrossChainSender` contract.

    2. Ask the user for token transfer details:

        You'll now ask the user for the token contract address, the recipient address on the target chain, and the amount of tokens to transfer.

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:147:171"
        ```

        This section of the script prompts the user for the token contract address and the recipient's address, fetches the token's decimal value, and parses the amount accordingly.

    3. Initiate the transfer:

        Finally, initiate the cross-chain transfer and log the details.

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:174:204"
        ```

        This part of the script first approves the token transfer, then initiates the cross-chain transfer using the `CrossChainSender` contract, and finally logs the transaction hash for the user to track.

    4. Finalize the script:

        ```typescript
        --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts:205:208"
        ```

        This section finalizes the script by calling the `main` function and handling any errors that may occur during the token transfer process.

You can find the full code for the `transfer.ts` file below:

??? code "transfer.ts"

    ```solidity
    --8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-5.ts"
    ```

### Transfer Tokens

Now that your transfer script is ready, it’s time to execute it and perform a cross-chain token transfer.

1. **Run the transfer script**

    Open your terminal and run the transfer script:

    ```bash
    npx ts-node script/transfer.ts
    ```

    This command will start the script, prompting you to select the source and target chains, input the token address, recipient address, and the amount of tokens to transfer.

2. **Follow the prompts** - the script will guide you through selecting the source and target chains and entering the necessary details for the token transfer. Once you provide all the required information, the script will initiate the token transfer

3. **Verify the transaction** - after running the script, you should see a confirmation message with the transaction hash. You can use this transaction hash to check the transfer status on the respective blockchain explorers

You can verify the transaction on the [Wormhole Explorer](https://wormholescan.io/){target=\_balnk} using the link provided in the terminal output. This explorer also offers the option to add the transferred token to your MetaMask wallet automatically.

If you followed the logic provided in the `transfer.ts` file above, your terminal output should look something like this:

--8<-- "code/tutorials/solidity-sdk/cross-chain-token-transfers/snippet-8.html"

!!! note
    In this example, we demonstrated a token transfer from the Avalanche Fuji Testnet to the Celo Alfajores Testnet. We sent two units of USDC Testnet tokens using the token contract address `0x5425890298aed601595a70ab815c96711a31bc65`. You can replace these details with those relevant to your project or use the same for testing purposes.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in the [Cross-Chain Token Transfers GitHub repository](https://github.com/wormhole-foundation/demo-cross-chain-token-transfer){target=\_blank}. The repository includes all the scripts, contracts, and configurations needed to deploy and transfer tokens across chains using the Wormhole protocol.

## Conclusion

Congratulations! You've successfully built and deployed a cross-chain token transfer system using Solidity and the Wormhole protocol. You've learned how to:

 - Set up a new Solidity project using Foundry
 - Develop smart contracts to send and receive tokens across chains
 - Write deployment scripts to manage and deploy contracts on different networks