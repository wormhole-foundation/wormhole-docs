---
title: Get Started with the Solidity SDK
description: Follow this guide to deploy Wormhole Solidity SDK-based message sender and receiver smart contracts and use them to send messages across chains.
categories: Basics, Solidity-SDK
---

# Get Started with the Solidity SDK

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormhole-messaging){target=\_blank}

## Introduction

Wormhole's messaging protocol simplifies sending data, triggering events, and initiating transactions across blockchain networks. This guide demonstrates how to configure and deploy contracts to send messages from Avalanche Fuji to Celo Alfajores.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} for deploying contracts and encrypting your private key
- [Testnet AVAX for Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}
- [Testnet CELO for Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank}
- Wallet private key

## Install and Set Up Project

1. Clone the demo repository and navigate to the project directory:

    ```bash
    git clone https://github.com/wormhole-foundation/demo-wormhole-messaging.git
    cd demo-wormhole-messaging
    ```

2. Use the following commands to install Foundry and project dependencies:

    ```bash
    npm install
    ```

3. Use Foundry's Forge to compile the contracts in the repository:

    ```bash
    forge build
    ```

    You will see terminal output similar to the following, confirming the contracts were compiled successfully:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-01.html"

4. Run tests to ensure everything is functioning correctly before deployment:

    ```bash
    forge test
    ```

    You will see passing results for all test cases in the terminal output:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-02.html"

## Prepare for Contract Deployment

This project relies on two [Wormhole Solidity SDK-based](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} smart contracts:

- **MessageSender.sol** - sends a message to the target chain. You will deploy this contract to Avalanche Fuji
- **MessageReceiver.sol** - receives and logs the message on the target chain. You will deploy this contract to Celo Alfajores

The `chains.json` configuration defines properties for supported chains, including the Wormhole relayer addresses, RPC URLs, and chain IDs, and provides this information to the deployment scripts when you run them.

### Encrypt Private Key

Foundry supports multiple options for [creating a keystore](https://book.getfoundry.sh/reference/cast/cast-wallet-import){target=\_blank}. This example uses the `--privatekey` option. As long as you have a decryption password to enter when prompted, you can use your preferred options when creating your Foundry keystore.

1. Create a Foundry keystore to encrypt your wallet private key using the following command: 

    ```bash
    cast wallet import CELO_AVAX --privatekey INSERT_PRIVATE_KEY
    ```

2. Enter the password you wish to use to decrypt your private key at the prompt. You will not see the password in the terminal as you type:

    ```bash
    Enter password: INSERT_DECRYPTION_PASSWORD
    ```

3. Select return to save your password, and you will see a success message confirming that the keystore was saved successfully. Keep this password. You will be prompted to enter it in the terminal when a wallet signature is required

## Deploy Sender Contract

Follow these steps to deploy `MessageSender.sol` to Avalanche Fuji:

1. Run the deployment script command in your terminal:

    ```bash
    npm run deploy:sender
    ```

2. Enter your Foundry keystore password in the terminal when prompted

3. You will see terminal output similar to the following:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-03.html"

    The address you see in your terminal is the Avalanche Fuji address for your deployed sender contract. Your deployed contract addresses are also output to the `deployedContracts.json` file.

## Deploy Receiver Contract

Follow these steps to deploy `MessageReceiver.sol` to Celo Alforjes:

1. Run the deployment script command in your terminal:

    ```bash
    npm run deploy:receiver
    ```

2. Enter your Foundry keystore password in the terminal when prompted

3. You will see terminal output similar to the following:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-04.html"

    - The Celo Alforjes address for your deployed receiver contract. Your deployed contract addresses are also output to the `deployedContracts.json` file
    - Confirmation that a `MessageSender` contract is now registered as authorized to send messages to your receiver contract. This address should match the sender contract you deployed to Avalanche Fuji

## Send Your First Message

Follow these steps to use your deployed contracts and send your first message:

1. Run the `sendMessage.ts` script using the following command:

    ```bash
    npm run send:message
    ```

2. Enter your Foundry keystore password in the terminal when prompted

3. You will see terminal output similar to the following:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-05.html"

4. You can also use the [Celo Alfajores Testnet Explorer](https://alfajores.celoscan.io/){target=\_blank} to view your `MessageReceiver` contract. Select **Events** to see the events emitted by the contract when your message was received. You can use the dropdowns to change **Hex** to **Text** to read the message. It will look similar to the image below:

    ![Contract events on Celo Alfajores Testnet Explorer](/docs/images/tools/solidity-sdk/get-started/messaging-contracts01.webp)

Congratulations! You've successfully sent and received a message across networks using Wormhole Solidity SDK-based smart contracts. 

## Next Steps

- [**Fetch the Signed VAA**](TODO WIP){target=\_blank} - whether your message is sent using core protocol or custom smart contracts, follow this guide to use your transaction information to fetch a signed VAA and decode the payload

<!--TODO: links to other guides and tutorials-->
