---
title: Get Started with the Solidity SDK
description: Follow this guide to deploy Wormhole Solidity SDK-based sender and receiver smart contracts and use them to send testnet USDC across chains.
categories: Basics, Solidity-SDK
---

# Get Started with the Solidity SDK

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} makes it easier for EVM compatible chains to integrate with Wormhole by providing all necessary Solidity interfaces along with useful libraries and tools for testing. This guide demonstrates how to configure and deploy Wormhole Solidity SDK-based contracts to send testnet USDC from Avalanche Fuji to Celo Alfajores.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for contract deployment
- Encrypted private key to sign for contract deployment. This example uses a [Foundry keystore](https://book.getfoundry.sh/reference/cast/cast-wallet-import){target=\_blank} 
- [Testnet AVAX for Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}
- [Testnet CELO for Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank}
- [USDC Testnet tokens](https://faucet.circle.com/){target=\_blank} on Avalanche-Fuji or/and Celo-Alfajores for cross-chain transfer

## Set Up Your Project

1. Run the following command in your terminal to initialize a new Foundry project with a basic structure for your smart contracts:

    ```bash
    forge init multichain-token-transfers
    ```

2. Navigate into the newly created project directory and install the Wormhole Solidity SDK:

    ```bash
    cd multichain-token-transfers
    forge install wormhole-foundation/wormhole-solidity-sdk
    ```

## Create Sender Contract

The `MultichainSender` contract uses the `WormholeRelayer` interface's [`TokenSender`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L24){target=\_blank} base class to simplify sending tokens across chains. 

1. Create a new file named `MultichainSender.sol` in the `/src` directory:

    ```bash
    touch src/MultichainSender.sol
    ```

2. Open the file and add the following code:

```solidity title="MultichainSender.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

// Assign the contract to the TokenSender role inherited from TokenBase
contract MultichainSender is TokenSender {
    uint256 constant GAS_LIMIT = 250_000;
    // Initialize the contract with the Wormhole relayer, token bridge, and wormhole address
    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole
    ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

    // Calculate the estimated cost for multichain token transfer
    // using the wormholeRelayer to get the delivery cost and add the message fee
    function quoteCrossChainDeposit(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        uint256 deliveryCost;
        (deliveryCost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );

        cost = deliveryCost + wormhole.messageFee();
    }

    // Send tokens and payload to the recipient on the target chain
    function sendCrossChainDeposit(
        uint16 targetChain,
        address targetReceiver,
        address recipient,
        uint256 amount,
        address token
    ) public payable {
        // Calculate the estimated cost for the multichain deposit
        uint256 cost = quoteCrossChainDeposit(targetChain);
        require(
            msg.value == cost,
            "msg.value must equal quoteCrossChainDeposit(targetChain)"
        );
        // Transfer the tokens from the sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        // Encode the recipient address into the payload
        bytes memory payload = abi.encode(recipient);
        // Initiate the multichain transfer using the wormholeRelayer
        sendTokenWithPayloadToEvm(
            targetChain,
            targetReceiver,
            payload,
            0,
            GAS_LIMIT,
            token,
            amount
        );
    }
}
```

## Create Receiver Contract

The `MultichainReceiver` contract uses the `WormholeRelayer` interface's [`TokenReceiver`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L147){target=\_blank} base class to handle the receipt of tokens and payloads across chains.

1. Create a new file named `MultichainReceiver.sol` in the `/src` directory:

    ```bash
    touch src/MultichainReceiver.sol
    ```

2. Open the file and add the following code:

```solidity title="MultichainReceiver.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

// Assign the contract to the TokenReceiver role inherited from TokenBase
contract MultichainReceiver is TokenReceiver {
    
    // Initialize the contract with the Wormhole relayer, token bridge, and wormhole address
    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole
    ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

    // Receive the multichain payload and tokens
    // Verify the transfer is from a registered sender
    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 // deliveryHash
    )
        internal
        override
        onlyWormholeRelayer
        isRegisteredSender(sourceChain, sourceAddress) 
    {
        // Ensure the payload is not empty and only has one token transfer
        require(receivedTokens.length == 1, "Expected 1 token transfer");

        // Decode the recipient address from the payload
        address recipient = abi.decode(payload, (address));

        // Transfer the received tokens to the intended recipient
        IERC20(receivedTokens[0].tokenAddress).transfer(
            recipient,
            receivedTokens[0].amount
        );
    }
}
```

## Prepare for Contract Deployment

Now that you've created the sender and receiver contracts, you must deploy them before you can use them to transfer tokens. Follow these steps to prepare to deploy your contracts:

### Create Deployment Configuration 

This file will store needed configuration information for the networks and deployment environment. 

1. Create a directory named deploy-config in the root of your project and create a `config.json` file inside:

    ```bash
    mkdir deploy-config
    touch deploy-config/config.json
    ```

2. Open the file and add the following configuration:

```json title="config.json"
{
    "chains": [
        {
            "description": "Avalanche Fuji Testnet",
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

3. Create a `contracts.json` file in the `deploy-config` using the following command:

    ```bash
    echo '{}' > deploy-config/contracts.json
    ```

    Leave this file blank for now. Your contract addresses will automatically output here after a successful deployment.

### Set Up Your Node.js Environment

You will use Node.js to run your deployment script.

1. Initialize a Node.js project:

    ```bash
    npm init -y
    ```

2. Install the remaining dependencies you'll need for the deployment script:

    ```bash
    npm install ethers readline-sync @types/readline-sync
    ```

### Compile the Smart Contracts

Run the following command to use [Foundry's `forge` tool](https://book.getfoundry.sh/forge/){target=\_blank} to compile your contracts and ensure they are ready for deployment:

```bash
forge build
```

You will see terminal output similar to the following, confirming the contracts were compiled successfully:

--8<-- "code/tools/solidity-sdk/get-started/terminal-output-01.html"

### Write the Deployment Script

Follow these steps to create a script to automate deployment of your contracts. 

1. Create a new file named `deploy.ts` in the /script directory:

    ```bash
    touch script/deploy.ts
    ```

2. 

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

<!--TODO: links to other guides and tutorials-->
