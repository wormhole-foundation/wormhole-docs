---
title: Get Started with the Solidity SDK
description: Follow this guide to deploy Wormhole Solidity SDK-based sender and receiver smart contracts and use them to send testnet USDC across chains.
categories: Basics, Solidity-SDK
---

# Get Started with the Solidity SDK

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} makes it easier for EVM-compatible chains to integrate with Wormhole by providing all necessary Solidity interfaces along with useful libraries and tools for testing. This guide demonstrates configuring and deploying Wormhole Solidity SDK-based contracts to send testnet USDC from Avalanche Fuji to Celo Alfajores.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for contract deployment
- Encrypted private key to sign for contract deployment. This example uses a [Foundry keystore](https://book.getfoundry.sh/reference/cast/cast-wallet-import){target=\_blank} 
- [Testnet AVAX for Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}
- [Testnet CELO for Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank}
- [USDC Testnet tokens](https://faucet.circle.com/){target=\_blank} on Avalanche-Fuji or/and Celo-Alfajores for cross-chain transfer 

## Set Up Your Project

1. Run the following command in your terminal to initialize a new Foundry project with a basic structure for your smart contracts:

    ```bash
    forge init wh-solidity-token-transfer
    ```

2. Navigate into the newly created project directory and install the Wormhole Solidity SDK:

    ```bash
    cd wh-solidity-token-transfer
    forge install wormhole-foundation/wormhole-solidity-sdk
    ```

3. Install dependencies for the deployment and transfer scripts:

    ```bash
    npm install ethers
    npm install --save-dev @types/readline-sync
    ```

## Create Sender Contract

The `CrossChainSender.sol` contract uses the `WormholeRelayer` interface's [`TokenSender`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L24){target=\_blank} base class to simplify sending tokens across chains. 

1. Create a new file named `CrossChainSender.sol` in the `/src` directory:

    ```bash
    touch src/CrossChainSender.sol
    ```

2. Open the file and add the following code:

    ```solidity title="CrossChainSender.sol"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-1.sol"
    ```

## Create Receiver Contract

The `CrossChainReceiver.sol` contract uses the `WormholeRelayer` interface's [`TokenReceiver`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L147){target=\_blank} base class to handle the receipt of tokens and payloads across chains.

1. Create a new file named `CrossChainReceiver.sol` in the `/src` directory:

    ```bash
    touch src/CrossChainReceiver.sol
    ```

2. Open the file and add the following code:

    ```solidity title="CrossChainReceiver.sol"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-2.sol"
    ```

## Prepare for Contract Deployment

Now that you've created the sender and receiver contracts, you must deploy them before using them to transfer tokens. Follow these steps to prepare to deploy your contracts.

### Create Deployment Configuration 

This file will store the needed configuration information for the networks and deployment environment. 

1. Create a directory named deploy-config in the root of your project and create a `chains.json` file inside:

    ```bash
    mkdir deploy-config
    touch deploy-config/chains.json
    ```

2. Open the file and add the following configuration:

    ```json title="chains.json"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-3.json"
    ```

3. Create a `deployedContracts.json` file in the `deploy-config` using the following command:

    ```bash
    echo '{}' > deploy-config/deployedContracts.json
    ```

    Leave the JSON object empty for now. Your contract addresses will automatically output here after a successful deployment.

### Set Up Your Node.js Environment

You will use Node.js to run your deployment script. Initialize a Node.js project using the following command:

    ```bash
    npm init -y
    ```

### Compile the Smart Contracts

Run the following command to use [Foundry's `forge` tool](https://book.getfoundry.sh/forge/){target=\_blank} to compile your contracts and ensure they are ready for deployment:

```bash
forge build
```

You will see terminal output similar to the following, confirming the contracts were compiled successfully:

--8<-- "code/tools/solidity-sdk/get-started/terminal-output-01.html"

### Write the Deployment Script

Follow these steps to create a script to automate the deployment of your contracts. 

1. Create a new file called `interfaces.ts` in the /script directory:

    ```bash
    touch script/interfaces.ts
    ```

2. Open the new file and add the following code to define the TypeScript interfaces needed for the deployment and transfer scripts:

    ```typescript title="interfaces.ts"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-4.ts"
    ```

3. Create a new file named `deploy.ts` in the /script directory:

    ```bash
    touch script/deploy.ts
    ```

4. Open the new file and add the following code:

    ```typescript title="deploy.ts"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-5.ts"
    ```

    This script prompts the user to select source and target chains from the `chains.json` options, prompts for a password to sign for deployment, deploys the sender and receiver contracts, and updates `deployedContracts.json` upon successful deployment.


## Deploy Your Contracts

Follow these steps to deploy your sender and receiver contracts:

1. Run the deployment script using the following command:

    ```bash
    npx tsx script/deploy.ts
    ```

2. Follow the prompts in your terminal, selecting Avalanche Fuji Testnet as your source chain and Celo Testnet as your target chain, then providing your keystore password to sign the deployment transaction

You will see terminal output similar to the following:

--8<-- "code/tools/solidity-sdk/get-started/terminal-output-02.html"

## Send Your First Message

Follow these steps to create a transfer script that calls your deployed contracts and sends your first message:

1. Create a new file called `transfer.ts` using the following command:

    ```bash
    touch script/transfer.ts
    ```

2. Open the new file and add the following code:

    ```typescript title="transfer.ts"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-6.ts"
    ```

    This script prompts the user to select target and source chains, checks to ensure the needed contract is deployed on each, prompts the user for a keystore password for signing, the contract address for the token to transfer, and the recipient address on the target chain. 

3. Run the script using the following command:

    ```bash
    npx tsx script/transfer.ts
    ```

4. Follow the prompts in the terminal. This example uses Avalanche Fuji as the source chain, Celo Testnet as the target, [Avalanche Fuji testnet USDC](https://developers.circle.com/stablecoins/usdc-on-test-networks){target=\_blank}, and a developer wallet as the recipient address. You will see terminal output similar to the following:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-03.html"

Congratulations! You've successfully created and deployed Wormhole Solidity SDK-based smart contracts and used them to send testnet USDC across blockchains. 

## Next Steps

TODO