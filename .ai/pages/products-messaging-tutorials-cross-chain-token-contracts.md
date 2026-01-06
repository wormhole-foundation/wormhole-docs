---
title: Cross-Chain Token Transfers
description: Learn how to create cross-chain token transfers using Wormhole's Solidity SDK. Build and deploy smart contracts to send tokens from one blockchain to another.
categories: Basics
url: https://wormhole.com/docs/products/messaging/tutorials/cross-chain-token-contracts/
---

# Create Cross-Chain Token Transfer Contracts

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-cross-chain-token-transfer){target=\_blank}

In this tutorial, you'll learn how to create a simple cross-chain token transfer system using the Wormhole protocol via the [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank}. We'll guide you through building and deploying smart contracts that enable seamless token transfers of IERC-20 tokens between blockchains. Whether you're a developer looking to explore cross-chain applications or just interested in the Wormhole protocol, this guide will help you understand the fundamentals.

By the end of this tutorial, you'll have a working cross-chain token transfer system built with the powerful tools provided by the Wormhole Solidity SDK, which you can further customize and integrate into your projects.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your machine.
- [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank} for deploying contracts.
- Testnet tokens for [Avalanche-Fuji](https://core.app/tools/testnet-faucet/?token=C){target=\_blank} and [Base Sepolia](https://faucets.chain.link/base-sepolia){target=\_blank} to cover gas fees.
- [USDC Testnet](https://faucet.circle.com/){target=\_blank} tokens on Avalanche-Fuji or/and Base Sepolia for cross-chain transfer.
- Wallet private key.

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

        1. Enter the RPC URL of the target chain.
        2. Enter the `TokenBridge` contract address on the target chain.
        3. Enter the token contract address on the source chain.
        4. Enter the source chain ID.

    5. The expected output when the token has an attestation:
        
        <div id="termynal" data-termynal>
        	<span data-ty="input"><span class="file-path"></span>npm run verify</span>
        	<span data-ty> > cross-chain-token-transfer@1.0.0 verify</span>
        	<span data-ty> > npx ts-node script/check-attestation.ts</span>
          <span data-ty> </span>
        	<span data-ty> Enter the TARGET chain RPC URL: https://base-sepolia-rpc.publicnode.com</span>
        	<span data-ty> Enter the WTT contract address on the TARGET chain: 0x05...E153</span>
          <span data-ty> Enter the token contract address on the SOURCE chain: 0x54...bc65</span>
          <span data-ty> Enter the SOURCE chain ID: 6</span>
          <span data-ty> The token is attested on the target chain. Wrapped token address: 0xDDB349c976cA2C873644F21f594767Eb5390C831</span>
        	<span data-ty="input"><span class="file-path"></span></span>
        </div>
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

1. Send tokens from one blockchain to another using the Wormhole protocol.
2. Receive and process the tokens on the target chain, ensuring they are correctly transferred to the intended recipient.

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
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    contract CrossChainSender is TokenSender {
        uint256 constant GAS_LIMIT = 250_000;

        constructor(
            address _wormholeRelayer,
            address _tokenBridge,
            address _wormhole
        ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}
    }
    ```

    This sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

    With the contract structure in place, define the following functions within its body to enable multichain token transfers.

3. Next, let's add a function that estimates the cost of sending tokens across chains:

    ```solidity
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
    ```

    This function, `quoteCrossChainDeposit`, helps calculate the cost of transferring tokens to a different chain. It factors in the delivery cost and the cost of publishing a message via the Wormhole protocol.

4. Finally, we'll add the function that sends the tokens across chains:

    ```solidity
        function sendCrossChainDeposit(
            uint16 targetChain,
            address targetReceiver,
            address recipient,
            uint256 amount,
            address token
        ) public payable {
            uint256 cost = quoteCrossChainDeposit(targetChain);
            require(
                msg.value == cost,
                "msg.value must equal quoteCrossChainDeposit(targetChain)"
            );

            IERC20(token).transferFrom(msg.sender, address(this), amount);

            bytes memory payload = abi.encode(recipient);

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
    ```

    This `sendCrossChainDeposit` function is where the actual token transfer happens. It sends the tokens to the recipient on the target chain using the Wormhole protocol.

Here’s a breakdown of what happens in each step of the `sendCrossChainDeposit` function:

1. **Cost calculation**: The function starts by calculating the cost of the cross-chain transfer using `quoteCrossChainDeposit`(`targetChain`). This cost includes both the delivery fee and the Wormhole message fee. The `sendCrossChainDeposit` function then checks that the user has sent the correct amount of Ether to cover this cost (`msg.value`).

2. **Token transfer to contract**: The next step is to transfer the specified amount of tokens from the user to the contract itself using `IERC-20(token).transferFrom(msg.sender, address(this), amount)`. This ensures that the contract has custody of the tokens before initiating the cross-chain transfer.

3. **Payload encoding**: The recipient's address on the target chain is encoded into a payload using `abi.encode(recipient)`. This payload will be sent along with the token transfer, so the target contract knows who should receive the tokens on the destination chain.

4. **Cross-chain transfer**: The `sendTokenWithPayloadToEvm` function is called to initiate the cross-chain token transfer. This function does the following:
    - Specifies the `targetChain` (the Wormhole chain ID of the destination blockchain).
    - Sends the `targetReceiver` contract address on the target chain that will receive the tokens.
    - Attaches the payload containing the recipient's address.
    - Sets the `GAS_LIMIT` for the transaction.
    - Passes the token `address` and `amount` to transfer.

    This triggers the Wormhole protocol to handle the cross-chain messaging and token transfer, ensuring the tokens and payload reach the correct destination on the target chain.

You can find the complete code for the `CrossChainSender.sol` below.

??? code "CrossChainSender.sol"

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    contract CrossChainSender is TokenSender {
        uint256 constant GAS_LIMIT = 250_000;

        constructor(
            address _wormholeRelayer,
            address _tokenBridge,
            address _wormhole
        ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

        // Function to get the estimated cost for cross-chain deposit
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

        // Function to send tokens and payload across chains
        function sendCrossChainDeposit(
            uint16 targetChain,
            address targetReceiver,
            address recipient,
            uint256 amount,
            address token
        ) public payable {
            uint256 cost = quoteCrossChainDeposit(targetChain);
            require(
                msg.value == cost,
                "msg.value must equal quoteCrossChainDeposit(targetChain)"
            );

            IERC20(token).transferFrom(msg.sender, address(this), amount);

            bytes memory payload = abi.encode(recipient);

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

### Receiver Contract: CrossChainReceiver

The `CrossChainReceiver` contract is designed to handle the receipt of tokens and payloads from another blockchain. It ensures that the tokens are correctly transferred to the designated recipient on the receiving chain.

Let's start writing the `CrossChainReceiver` contract:

1. Create a new file named `CrossChainReceiver.sol` in the `/src` directory:

    ```bash
    touch src/CrossChainReceiver.sol
    ```

2. Open the file. First, we'll start with the imports and the contract setup:

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    contract CrossChainReceiver is TokenReceiver {
        // The Wormhole relayer and registeredSenders are inherited from the Base.sol contract

        constructor(
            address _wormholeRelayer,
            address _tokenBridge,
            address _wormhole
        ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}
    }
    ```

    Similar to the `CrossChainSender` contract, this sets up the basic structure of the contract, including the necessary imports and the constructor that initializes the contract with the Wormhole-related addresses.

3. Next, let's add a function inside the contract to handle receiving the payload and tokens:

    ```solidity
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
            require(receivedTokens.length == 1, "Expected 1 token transfer");

            // Decode the recipient address from the payload
            address recipient = abi.decode(payload, (address));

            // Transfer the received tokens to the intended recipient
            IERC20(receivedTokens[0].tokenAddress).transfer(
                recipient,
                receivedTokens[0].amount
            );
        }
    ```

    This `receivePayloadAndTokens` function processes the tokens and payload sent from another chain, decodes the recipient address, and transfers the tokens to them using the Wormhole protocol. This function also validates the emitter (`sourceAddress`) to ensure the message comes from a trusted sender.

    This function ensures that:

    - It only processes one token transfer at a time.
    - The `sourceAddress` is checked against a list of registered senders using the `isRegisteredSender` modifier, which verifies if the emitter is allowed to send tokens to this contract.
    - The recipient address is decoded from the payload, and the received tokens are transferred to them using the ERC-20 interface.

After we call `sendTokenWithPayloadToEvm` on the source chain, the message goes through the standard Wormhole message lifecycle. Once a [VAA (Verifiable Action Approval)](/docs/protocol/infrastructure/vaas/){target=\_blank} is available, the delivery provider will call `receivePayloadAndTokens` on the target chain and target address specified, with the appropriate inputs.

??? tip "Understanding the `TokenReceived` Struct"

    Let’s delve into the fields provided to us in the `TokenReceived` struct:

    ```solidity
    struct TokenReceived {
        bytes32 tokenHomeAddress;
        uint16 tokenHomeChain;
        address tokenAddress;
        uint256 amount;
        uint256 amountNormalized;
    }
    ```

    - **`tokenHomeAddress`**: The original address of the token on its native chain. This is the same as the token field in the call to `sendTokenWithPayloadToEvm` unless the original token sent is a Wormhole-wrapped token. In that case, this will be the address of the original version of the token (on its native chain) in Wormhole address format (left-padded with 12 zeros).

    - **`tokenHomeChain`**: The Wormhole chain ID corresponding to the home address above. This will typically be the source chain unless the original token sent is a Wormhole-wrapped asset, which will be the chain of the unwrapped version of the token.

    - **`tokenAddress`**: The address of the IERC-20 token on the target chain that has been transferred to this contract. If `tokenHomeChain` equals the target chain, this will be the same as `tokenHomeAddress`; otherwise, it will be the Wormhole-wrapped version of the token sent.

    - **`amount`**: The token amount sent to you with the same units as the original token. Since `TokenBridge` only sends with eight decimals of precision, if your token has 18 decimals, this will be the "amount" you sent, rounded down to the nearest multiple of 10^10.

    - **`amountNormalized`**: The amount of token divided by (1 if decimals ≤ 8, else 10^(decimals - 8)).

You can find the complete code for the `CrossChainReceiver.sol` contract below:

??? code "CrossChainReceiver.sol"

    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    contract CrossChainReceiver is TokenReceiver {
        // The Wormhole relayer and registeredSenders are inherited from the Base.sol contract

        constructor(
            address _wormholeRelayer,
            address _tokenBridge,
            address _wormhole
        ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

        // Function to receive the cross-chain payload and tokens with emitter validation
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

## Deploy the Contracts

Now that you've written the `CrossChainSender` and `CrossChainReceiver` contracts, it's time to deploy them to your chosen networks.

1. **Set up deployment configuration**: Before deploying, you must configure the networks and the deployment environment. This information is stored in a configuration file.

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
                    "description": "Base Sepolia",
                    "chainId": 10004,
                    "rpc": "https://base-sepolia-rpc.publicnode.com",
                    "tokenBridge": "0x86F55A04690fd7815A3D802bD587e83eA888B239",
                    "wormholeRelayer": "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE",
                    "wormhole": "0x79A1027a6A159502049F10906D333EC57E95F083"
                }
            ]
        }

        ```

        This file specifies the details for each chain where you plan to deploy your contracts, including the RPC URL, the `TokenBridge` address, the relayer, and the Wormhole Core contract.

        For a complete list of Wormhole contract addresses on various blockchains, refer to the [Wormhole Contract Addresses](/docs/products/reference/contract-addresses/){target=\_blank}.

        !!! note
            You can add your desired chains to this file by specifying the required fields for each chain. In this example, we use the Avalanche Fuji and Base Sepolia Testnets.

    4. Create a `contracts.json` file in the `deploy-config` directory:

        ```bash
        echo '{}' > deploy-config/contracts.json
        ```

        This file can be left blank initially. It will be automatically updated with the deployed contract addresses after a successful deployment.

2. **Set up your Node.js environment**: You'll need to set up your Node.js environment to run the deployment script.

    1. Initialize a Node.js project:

        ```bash
        npm init -y
        ```

    2. Create a `.gitignore` file to ensure your private key isn't accidentally exposed or committed to version control:

    ```bash
    echo ".env" >> .gitignore
    ```
    
    3. Install the necessary dependencies:

        ```bash
        npm install ethers dotenv readline-sync @types/readline-sync
        ```

        These dependencies are required for the deployment script to work properly.

3. **Compile your smart contracts**: Compile your smart contracts using Foundry. This ensures that your contracts are up-to-date and ready for deployment.

    - Run the following command to compile your contracts:

        ```bash
        forge build
        ```

        This will generate the necessary ABI and bytecode files in a directory named `/out`.

    The expected output should be similar to this:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>forge build</span>
    	<span data-ty> > [⠒] Compiling...</span>
    	<span data-ty> > [⠰] Compiling 30 files with 0.8.23</span>
    	<span data-ty> > [⠔] Solc 0.8.23 finished in 2.29s</span>
    	<span data-ty>Compiler run successful!</span>
    	<span data-ty="input"><span class="file-path"></span></span>
    </div>
4. **Write the deployment script**: You’ll need a script to automate the deployment of your contracts. Let’s create the deployment script.

    1. Create a new file named `deploy.ts` in the `/script` directory:

        ```bash
        touch script/deploy.ts
        ```

    2. Open the file and load imports and configuration:

        ```typescript
        import { BytesLike, ethers } from 'ethers';
        import * as fs from 'fs';
        import * as path from 'path';
        import * as dotenv from 'dotenv';
        import readlineSync from 'readline-sync';

        dotenv.config();
        ```

        Import the required libraries and modules to interact with Ethereum, handle file paths, load environment variables, and enable user interaction via the terminal.

    3. Define interfaces to use for chain configuration and contract deployment:

        ```typescript
        interface ChainConfig {
          description: string;
          chainId: number;
          rpc: string;
          tokenBridge: string;
          wormholeRelayer: string;
          wormhole: string;
        }

        interface DeployedContracts {
          [chainId: number]: {
            networkName: string;
            CrossChainSender?: string;
            CrossChainReceiver?: string;
            deployedAt: string;
          };
        }
        ```

        These interfaces define the structure of the chain configuration and the contract deployment details.

    4. Load and select the chains for deployment:

        ```typescript
        function loadConfig(): ChainConfig[] {
          const configPath = path.resolve(__dirname, '../deploy-config/config.json');
          return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
        }

        function selectChain(
          chains: ChainConfig[],
          role: 'source' | 'target'
        ): ChainConfig {
          console.log(`\nSelect the ${role.toUpperCase()} chain:`);
          chains.forEach((chain, index) => {
            console.log(`${index + 1}: ${chain.description}`);
          });

          const chainIndex =
            readlineSync.questionInt(
              `\nEnter the number for the ${role.toUpperCase()} chain: `
            ) - 1;
          return chains[chainIndex];
        }

        ```

        The `loadConfig` function reads the chain configuration from the `config.json` file, and the `selectChain` function allows the user to choose the source and target chains for deployment interactively. The user is prompted in the terminal to select which chains to use, making the process interactive and user-friendly.

    5. Define the main function for deployment and load the chain configuration:

        ```typescript
        async function main() {
          const chains = loadConfig();

          const sourceChain = selectChain(chains, 'source');
          const targetChain = selectChain(chains, 'target');

        ```

        - The `main` function is the entry point for the deployment script.
        - We then call the `loadConfig` function we previously defined to load the chain configuration from the `config.json` file.

    6. Set up provider and wallet: 
    
        ```typescript
          const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
          const targetProvider = new ethers.JsonRpcProvider(targetChain.rpc);
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, sourceProvider);

        ```
        
        The scripts establish a connection to the blockchain using a provider and create a wallet instance using a private key. This wallet is responsible for signing the deployment transaction on the source chain.

    7. Read the compiled contracts:

        ```typescript
          const senderJson = JSON.parse(
            fs.readFileSync(
              path.resolve(
                __dirname,
                '../out/CrossChainSender.sol/CrossChainSender.json'
              ),
              'utf8'
            )
          );
        ```

        - This code reads the `CrossChainSender.json` file, the compiled output of the `CrossChainSender.sol` contract.
        - The file is in the `../out/` directory, which contains the ABI (Application Binary Interface) and bytecode generated during contract compilation.
        - It uses the `fs.readFileSync` function to read the file and `JSON.parse` to convert the file contents (in JSON format) into a JavaScript object.

    8. Extract the contract ABI and bytecode:

        ```typescript
          const abi = senderJson.abi;
          const bytecode = senderJson.bytecode;
        ```

        - **ABI (Application Binary Interface)**: Defines the structure of the contract’s functions, events, and data types, allowing the front end to interact with the contract on the blockchain.
        - **Bytecode**: This is the compiled machine code that will be deployed to the blockchain to create the contract.

    9. Create the Contract Factory:

        ```typescript
          const CrossChainSenderFactory = new ethers.ContractFactory(
            abi,
            bytecode,
            wallet
          );
        ```

        - **`ethers.ContractFactory`**: Creates a new contract factory using the ABI, bytecode, and a wallet (representing the signer). The contract factory is responsible for deploying instances of the contract to the blockchain.
        - This is a crucial step for deploying the contract since the factory will create and deploy the `CrossChainSender` contract.

    10. Deploy the `CrossChainSender` and `CrossChainReceiver` contracts:

        === "`CrossChainSender`"
            ```typescript
              try {
                const senderContract = await CrossChainSenderFactory.deploy(
                  sourceChain.wormholeRelayer,
                  sourceChain.tokenBridge,
                  sourceChain.wormhole
                );
                await senderContract.waitForDeployment();
            ```

        === "`CrossChainReceiver`"
            ```typescript
                const targetWallet = new ethers.Wallet(
                  process.env.PRIVATE_KEY!,
                  targetProvider
                );
                const receiverJson = JSON.parse(
                  fs.readFileSync(
                    path.resolve(
                      __dirname,
                      '../out/CrossChainReceiver.sol/CrossChainReceiver.json'
                    ),
                    'utf8'
                  )
                );
                const CrossChainReceiverFactory = new ethers.ContractFactory(
                  receiverJson.abi,
                  receiverJson.bytecode,
                  targetWallet
                );

                const receiverContract = await CrossChainReceiverFactory.deploy(
                  targetChain.wormholeRelayer,
                  targetChain.tokenBridge,
                  targetChain.wormhole
                );
                await receiverContract.waitForDeployment();
            ```

        Both functions deploy the respective contracts to the selected chains.

        For the `CrossChainReceiver` contract:

        - It defines the wallet related to the target chain.
        - The logic reads the compiled ABI and bytecode from the JSON file generated during compilation.
        - It creates a new contract factory using the ABI, bytecode, and wallet.
        - It deploys the contract to the selected chain passing in the relayer, `TokenBridge`, and Wormhole addresses.

    11. Save the deployed contract addresses:

        === "`senderAddress`"
            ```typescript
                const senderAddress = (senderContract as ethers.Contract).target;
                console.log(
                  `CrossChainSender on ${sourceChain.description}: ${senderAddress}`
                );
            ```

        === "`receiverAddress`"
            ```typescript
                const receiverAddress = (receiverContract as ethers.Contract).target;
                console.log(
                  `CrossChainReceiver on ${targetChain.description}: ${receiverAddress}`
                );
            ```

        You may display the deployed contract addresses in the terminal or save them to a JSON file for future reference.

    12. Register the `CrossChainSender` address on the target chain:

        ```typescript
            const CrossChainReceiverContract = new ethers.Contract(
              receiverAddress,
              receiverJson.abi,
              targetWallet
            );

            const tx = await CrossChainReceiverContract.setRegisteredSender(
              sourceChain.chainId,
              ethers.zeroPadValue(senderAddress as BytesLike, 32)
            );

            await tx.wait();
        ```

        After you deploy the `CrossChainReceiver` contract on the target network, the sender contract address from the source chain needs to be registered. This ensures that only messages from the registered `CrossChainSender` contract are processed.

        This additional step is essential to enforce emitter validation, preventing unauthorized senders from delivering messages to the `CrossChainReceiver` contract.

    13. Save the deployment details:

        ???- example "Save Deployment Details Example"
            ```typescript
                const deployedContractsPath = path.resolve(
                  __dirname,
                  '../deploy-config/contracts.json'
                );
                let deployedContracts: DeployedContracts = {};

                if (fs.existsSync(deployedContractsPath)) {
                  deployedContracts = JSON.parse(
                    fs.readFileSync(deployedContractsPath, 'utf8')
                  );
                }

                // Update the contracts.json file:
                // If a contract already exists on a chain, update its address; otherwise, add a new entry.
                if (!deployedContracts[sourceChain.chainId]) {
                  deployedContracts[sourceChain.chainId] = {
                    networkName: sourceChain.description,
                    deployedAt: new Date().toISOString(),
                  };
                }
                deployedContracts[sourceChain.chainId].CrossChainSender =
                  senderAddress.toString();
                deployedContracts[sourceChain.chainId].deployedAt =
                  new Date().toISOString();

                if (!deployedContracts[targetChain.chainId]) {
                  deployedContracts[targetChain.chainId] = {
                    networkName: targetChain.description,
                    deployedAt: new Date().toISOString(),
                  };
                }
                deployedContracts[targetChain.chainId].CrossChainReceiver =
                  receiverAddress.toString();
                deployedContracts[targetChain.chainId].deployedAt =
                  new Date().toISOString();

                // Save the updated contracts.json file
                fs.writeFileSync(
                  deployedContractsPath,
                  JSON.stringify(deployedContracts, null, 2)
                );
            ```
        
        Add your desired logic to save the deployed contract addresses in a JSON file (or another format). This will be important later when transferring tokens, as you'll need these addresses to interact with the deployed contracts.

    14. Handle errors and finalize the script:

        ```typescript
          } catch (error: any) {
            if (error.code === 'INSUFFICIENT_FUNDS') {
              console.error(
                'Error: Insufficient funds for deployment. Please make sure your wallet has enough funds to cover the gas fees.'
              );
            } else {
              console.error('An unexpected error occurred:', error.message);
            }
            process.exit(1);
          }
        }

        main().catch((error) => {
          console.error(error);
          process.exit(1);
        });
        ```

        The try-catch block wraps the deployment logic to catch any errors that may occur.

        - If the error is due to insufficient funds, it logs a clear message about needing more gas fees.
        - For any other errors, it logs the specific error message to help with debugging.

        The `process.exit(1)` ensures that the script exits with a failure status code if any error occurs.

    You can find the full code for the `deploy.ts` file below:

    ??? code "deploy.ts"

        ```solidity
        import { BytesLike, ethers } from 'ethers';
        import * as fs from 'fs';
        import * as path from 'path';
        import * as dotenv from 'dotenv';
        import readlineSync from 'readline-sync';

        dotenv.config();

        interface ChainConfig {
          description: string;
          chainId: number;
          rpc: string;
          tokenBridge: string;
          wormholeRelayer: string;
          wormhole: string;
        }

        interface DeployedContracts {
          [chainId: number]: {
            networkName: string;
            CrossChainSender?: string;
            CrossChainReceiver?: string;
            deployedAt: string;
          };
        }

        function loadConfig(): ChainConfig[] {
          const configPath = path.resolve(__dirname, '../deploy-config/config.json');
          return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
        }

        function selectChain(
          chains: ChainConfig[],
          role: 'source' | 'target'
        ): ChainConfig {
          console.log(`\nSelect the ${role.toUpperCase()} chain:`);
          chains.forEach((chain, index) => {
            console.log(`${index + 1}: ${chain.description}`);
          });

          const chainIndex =
            readlineSync.questionInt(
              `\nEnter the number for the ${role.toUpperCase()} chain: `
            ) - 1;
          return chains[chainIndex];
        }

        async function main() {
          const chains = loadConfig();

          const sourceChain = selectChain(chains, 'source');
          const targetChain = selectChain(chains, 'target');

          const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
          const targetProvider = new ethers.JsonRpcProvider(targetChain.rpc);
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, sourceProvider);

          const senderJson = JSON.parse(
            fs.readFileSync(
              path.resolve(
                __dirname,
                '../out/CrossChainSender.sol/CrossChainSender.json'
              ),
              'utf8'
            )
          );

          const abi = senderJson.abi;
          const bytecode = senderJson.bytecode;

          const CrossChainSenderFactory = new ethers.ContractFactory(
            abi,
            bytecode,
            wallet
          );

          try {
            const senderContract = await CrossChainSenderFactory.deploy(
              sourceChain.wormholeRelayer,
              sourceChain.tokenBridge,
              sourceChain.wormhole
            );
            await senderContract.waitForDeployment();

            // Safely access the deployed contract's address
            const senderAddress = (senderContract as ethers.Contract).target;
            console.log(
              `CrossChainSender on ${sourceChain.description}: ${senderAddress}`
            );

            const targetWallet = new ethers.Wallet(
              process.env.PRIVATE_KEY!,
              targetProvider
            );
            const receiverJson = JSON.parse(
              fs.readFileSync(
                path.resolve(
                  __dirname,
                  '../out/CrossChainReceiver.sol/CrossChainReceiver.json'
                ),
                'utf8'
              )
            );
            const CrossChainReceiverFactory = new ethers.ContractFactory(
              receiverJson.abi,
              receiverJson.bytecode,
              targetWallet
            );

            const receiverContract = await CrossChainReceiverFactory.deploy(
              targetChain.wormholeRelayer,
              targetChain.tokenBridge,
              targetChain.wormhole
            );
            await receiverContract.waitForDeployment();

            // Safely access the deployed contract's address
            const receiverAddress = (receiverContract as ethers.Contract).target;
            console.log(
              `CrossChainReceiver on ${targetChain.description}: ${receiverAddress}`
            );

            // Register the sender contract in the receiver contract
            console.log(
              `Registering CrossChainSender (${senderAddress}) as a valid sender in CrossChainReceiver (${receiverAddress})...`
            );

            const CrossChainReceiverContract = new ethers.Contract(
              receiverAddress,
              receiverJson.abi,
              targetWallet
            );

            const tx = await CrossChainReceiverContract.setRegisteredSender(
              sourceChain.chainId,
              ethers.zeroPadValue(senderAddress as BytesLike, 32)
            );

            await tx.wait();
            console.log(
              `CrossChainSender registered as a valid sender on ${targetChain.description}`
            );

            // Load existing deployed contract addresses from contracts.json
            const deployedContractsPath = path.resolve(
              __dirname,
              '../deploy-config/contracts.json'
            );
            let deployedContracts: DeployedContracts = {};

            if (fs.existsSync(deployedContractsPath)) {
              deployedContracts = JSON.parse(
                fs.readFileSync(deployedContractsPath, 'utf8')
              );
            }

            // Update the contracts.json file:
            // If a contract already exists on a chain, update its address; otherwise, add a new entry.
            if (!deployedContracts[sourceChain.chainId]) {
              deployedContracts[sourceChain.chainId] = {
                networkName: sourceChain.description,
                deployedAt: new Date().toISOString(),
              };
            }
            deployedContracts[sourceChain.chainId].CrossChainSender =
              senderAddress.toString();
            deployedContracts[sourceChain.chainId].deployedAt =
              new Date().toISOString();

            if (!deployedContracts[targetChain.chainId]) {
              deployedContracts[targetChain.chainId] = {
                networkName: targetChain.description,
                deployedAt: new Date().toISOString(),
              };
            }
            deployedContracts[targetChain.chainId].CrossChainReceiver =
              receiverAddress.toString();
            deployedContracts[targetChain.chainId].deployedAt =
              new Date().toISOString();

            // Save the updated contracts.json file
            fs.writeFileSync(
              deployedContractsPath,
              JSON.stringify(deployedContracts, null, 2)
            );
          } catch (error: any) {
            if (error.code === 'INSUFFICIENT_FUNDS') {
              console.error(
                'Error: Insufficient funds for deployment. Please make sure your wallet has enough funds to cover the gas fees.'
              );
            } else {
              console.error('An unexpected error occurred:', error.message);
            }
            process.exit(1);
          }
        }

        main().catch((error) => {
          console.error(error);
          process.exit(1);
        });

        ```

5. **Add your private key**: You'll need to provide your private key. It allows your deployment script to sign the transactions that deploy the smart contracts to the blockchain. Without it, the script won't be able to interact with the blockchain on your behalf.

    Create a `.env` file in the root of the project and add your private key:

    ```bash
    touch .env
    ```

    Inside `.env`, add your private key in the following format:

    ```env
    PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```
    
6. **Run the deployment script**:

    1. Open a terminal and run the following command:

        ```bash
        npx ts-node script/deploy.ts
        ```

        This will execute the deployment script, deploying both contracts to the selected chains.

    2. Check the deployment output:

        - You will see the deployed contract addresses printed in the terminal if successful. The `contracts.json` file will be updated with these addresses.
        - If you encounter an error, the script will provide feedback, such as insufficient funds for gas.

If you followed the logic provided in the full code above, your terminal output should look something like this:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>npx ts-node deploy.ts</span>
	<span data-ty> > cross-chain-token-transfer@1.0.0 deploy</span>
	<span data-ty> > npx ts-node script/deploy.ts</span>
	<span data-ty> Select the SOURCE chain:</span>
	<span data-ty> 1: Avalanche testnet fuji</span>
  <span data-ty> 2: Base Sepolia</span>
  <span data-ty> </span>
  <span data-ty> Enter the number for the SOURCE chain: 1</span>
  <span data-ty> </span>
  <span data-ty> Select the TARGET chain:</span>
  <span data-ty> 1: Avalanche testnet fuji</span>
  <span data-ty> 2: Base Sepolia</span>
  <span data-ty> </span>
  <span data-ty> Enter the number for the TARGET chain: 2</span>
  <span data-ty> CrossChainSender Avalanche testnet fuji: 0x1Cac52a183D02F9002fdb37b13eC2fAB950d44E3</span>
  <span data-ty> CrossChainReceiver Base Sepolia: 0xD720BFF42a0960cfF1118454A907a44dB358f2b1</span>
  <span data-ty> </span>
  <span data-ty> Registering CrossChainSender (0x1Cac52a183D02F9002fdb37b13eC2fAB950d44E3) as a valid sender in CrossChainReceiver (0xD720BFF42a0960cfF1118454A907a44dB358f2b1)...</span>
  <span data-ty> </span>
  <span data-ty> CrossChainSender registered as a valid sender on Base Sepolia</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>
## Transfer Tokens Across Chains

### Quick Recap

Up to this point, you've set up a new Solidity project using Foundry, developed two key contracts (`CrossChainSender` and `CrossChainReceiver`), and created a deployment script to deploy these contracts to different blockchain networks. The deployment script also saves the new contract addresses for easy reference. With everything in place, it's time to transfer tokens using the deployed contracts.

In this step, you'll write a script to transfer tokens across chains using the `CrossChainSender` and `CrossChainReceiver` contracts you deployed earlier. This script will interact with the contracts and facilitate the cross-chain token transfer.

### Transfer Script

1. Set up the transfer script:

    1. Create a new file named `transfer.ts` in the `/script` directory:

        ```bash
        touch script/transfer.ts
        ```

    2. Open the file. Start with the necessary imports, interfaces and configurations:

        ```typescript
        import { ethers } from 'ethers';
        import * as fs from 'fs';
        import * as path from 'path';
        import * as dotenv from 'dotenv';
        import readlineSync from 'readline-sync';

        dotenv.config();

        interface ChainConfig {
          description: string;
          chainId: number;
          rpc: string;
          tokenBridge: string;
          wormholeRelayer: string;
          wormhole: string;
        }

        interface DeployedContracts {
          [chainId: number]: {
            networkName: string;
            CrossChainSender?: string;
            CrossChainReceiver?: string;
            deployedAt: string;
          };
        }
        ```

        These imports include the essential libraries for interacting with Ethereum, handling file paths, loading environment variables, and managing user input.

    3. Load configuration and contracts:


        ```typescript
        function loadConfig(): ChainConfig[] {
          const configPath = path.resolve(__dirname, '../deploy-config/config.json');
          return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
        }

        function loadDeployedContracts(): DeployedContracts {
          const contractsPath = path.resolve(
            __dirname,
            '../deploy-config/contracts.json'
          );
          if (
            !fs.existsSync(contractsPath) ||
            fs.readFileSync(contractsPath, 'utf8').trim() === ''
          ) {
            console.error(
              'No contracts found. Please deploy contracts first before transferring tokens.'
            );
            process.exit(1);
          }
          return JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
        }
        ```

        These functions load the network and contract details that were saved during deployment.

    4. Allow users to select source and target chains:

        Refer to the deployed contracts and create logic as desired. In our example, we made this process interactive, allowing users to select the source and target chains from all the historically deployed contracts. This interactive approach helps ensure the correct chains are selected for the token transfer.

        ```typescript
        function selectSourceChain(deployedContracts: DeployedContracts): {
          chainId: number;
          networkName: string;
        } {
          const sourceOptions = Object.entries(deployedContracts).filter(
            ([, contracts]) => contracts.CrossChainSender
          );

          if (sourceOptions.length === 0) {
            console.error('No source chains available with CrossChainSender deployed.');
            process.exit(1);
          }

          console.log('\nSelect the source chain:');
          sourceOptions.forEach(([chainId, contracts], index) => {
            console.log(`${index + 1}: ${contracts.networkName}`);
          });

          const selectedIndex =
            readlineSync.questionInt(`\nEnter the number for the source chain: `) - 1;
          return {
            chainId: Number(sourceOptions[selectedIndex][0]),
            networkName: sourceOptions[selectedIndex][1].networkName,
          };
        }

        function selectTargetChain(deployedContracts: DeployedContracts): {
          chainId: number;
          networkName: string;
        } {
          const targetOptions = Object.entries(deployedContracts).filter(
            ([, contracts]) => contracts.CrossChainReceiver
          );

          if (targetOptions.length === 0) {
            console.error(
              'No target chains available with CrossChainReceiver deployed.'
            );
            process.exit(1);
          }

          console.log('\nSelect the target chain:');
          targetOptions.forEach(([chainId, contracts], index) => {
            console.log(`${index + 1}: ${contracts.networkName}`);
          });

          const selectedIndex =
            readlineSync.questionInt(`\nEnter the number for the target chain: `) - 1;
          return {
            chainId: Number(targetOptions[selectedIndex][0]),
            networkName: targetOptions[selectedIndex][1].networkName,
          };
        }
        ```

2. Implement the token transfer logic:

    1. **Create the `main` function**: Add the token transfer logic, including the chain and contract details, wallet and provider for the source chain, and the `CrossChainSender` contract for interaction.
    
        ```typescript
        async function main() {
          const chains = loadConfig();
          const deployedContracts = loadDeployedContracts();

          // Select the source chain (only show chains with CrossChainSender deployed)
          const { chainId: sourceChainId, networkName: sourceNetworkName } =
            selectSourceChain(deployedContracts);
          const sourceChain = chains.find((chain) => chain.chainId === sourceChainId)!;

          // Select the target chain (only show chains with CrossChainReceiver deployed)
          const { chainId: targetChainId, networkName: targetNetworkName } =
            selectTargetChain(deployedContracts);
          const targetChain = chains.find((chain) => chain.chainId === targetChainId)!;

          // Set up providers and wallets
          const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, sourceProvider);

          // Load the ABI from the JSON file (use the compiled ABI from Forge or Hardhat)
          const CrossChainSenderArtifact = JSON.parse(
            fs.readFileSync(
              path.resolve(
                __dirname,
                '../out/CrossChainSender.sol/CrossChainSender.json'
              ),
              'utf8'
            )
          );

          const abi = CrossChainSenderArtifact.abi;

          // Create the contract instance using the full ABI
          const CrossChainSender = new ethers.Contract(
            deployedContracts[sourceChainId].CrossChainSender!,
            abi,
            wallet
          );
        ```

    2. **Ask the user for token transfer details**: You'll now ask the user for the token contract address, the recipient address on the target chain, and the amount of tokens to transfer.

        ```typescript
          const tokenAddress = readlineSync.question(
            'Enter the token contract address: '
          );
          const recipientAddress = readlineSync.question(
            'Enter the recipient address on the target chain: '
          );

          // Get the token contract
          const tokenContractDecimals = new ethers.Contract(
            tokenAddress,
            [
              'function decimals() view returns (uint8)',
              'function approve(address spender, uint256 amount) public returns (bool)',
            ],
            wallet
          );

          // Fetch the token decimals
          const decimals = await tokenContractDecimals.decimals();

          // Get the amount from the user, then parse it according to the token's decimals
          const amount = ethers.parseUnits(
            readlineSync.question('Enter the amount of tokens to transfer: '),
            decimals
          );
        ```

        This section of the script prompts the user for the token contract address and the recipient's address, fetches the token's decimal value, and parses the amount accordingly.

    3. **Initiate the transfer**: Finally, initiate the cross-chain transfer and log the details.

        ```typescript
          const cost = await CrossChainSender.quoteCrossChainDeposit(targetChainId);

          // Approve the CrossChainSender contract to transfer tokens on behalf of the user
          const tokenContract = new ethers.Contract(
            tokenAddress,
            ['function approve(address spender, uint256 amount) public returns (bool)'],
            wallet
          );

          const approveTx = await tokenContract.approve(
            deployedContracts[sourceChainId].CrossChainSender!,
            amount
          );
          await approveTx.wait();
          console.log(`Approved tokens for cross-chain transfer.`);

          // Initiate the cross-chain transfer
          const transferTx = await CrossChainSender.sendCrossChainDeposit(
            targetChainId,
            deployedContracts[targetChainId].CrossChainReceiver!,
            recipientAddress,
            amount,
            tokenAddress,
            { value: cost } // Attach the necessary fee for cross-chain transfer
          );
          await transferTx.wait();
          console.log(
            `Transfer initiated from ${sourceNetworkName} to ${targetNetworkName}. Transaction Hash: ${transferTx.hash}`
          );
        }

        ```

        This part of the script first approves the token transfer, then initiates the cross-chain transfer using the `CrossChainSender` contract, and finally logs the transaction hash for the user to track.

    4. **Finalize the script**: Call the `main` function and handle any errors that may occur during the token transfer process.

        ```typescript
        main().catch((error) => {
          console.error(error);
          process.exit(1);
        });
        ```

You can find the full code for the `transfer.ts` file below:

??? code "transfer.ts"

    ```solidity
    import { ethers } from 'ethers';
    import * as fs from 'fs';
    import * as path from 'path';
    import * as dotenv from 'dotenv';
    import readlineSync from 'readline-sync';

    dotenv.config();

    interface ChainConfig {
      description: string;
      chainId: number;
      rpc: string;
      tokenBridge: string;
      wormholeRelayer: string;
      wormhole: string;
    }

    interface DeployedContracts {
      [chainId: number]: {
        networkName: string;
        CrossChainSender?: string;
        CrossChainReceiver?: string;
        deployedAt: string;
      };
    }

    function loadConfig(): ChainConfig[] {
      const configPath = path.resolve(__dirname, '../deploy-config/config.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
    }

    function loadDeployedContracts(): DeployedContracts {
      const contractsPath = path.resolve(
        __dirname,
        '../deploy-config/contracts.json'
      );
      if (
        !fs.existsSync(contractsPath) ||
        fs.readFileSync(contractsPath, 'utf8').trim() === ''
      ) {
        console.error(
          'No contracts found. Please deploy contracts first before transferring tokens.'
        );
        process.exit(1);
      }
      return JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    }

    function selectSourceChain(deployedContracts: DeployedContracts): {
      chainId: number;
      networkName: string;
    } {
      const sourceOptions = Object.entries(deployedContracts).filter(
        ([, contracts]) => contracts.CrossChainSender
      );

      if (sourceOptions.length === 0) {
        console.error('No source chains available with CrossChainSender deployed.');
        process.exit(1);
      }

      console.log('\nSelect the source chain:');
      sourceOptions.forEach(([chainId, contracts], index) => {
        console.log(`${index + 1}: ${contracts.networkName}`);
      });

      const selectedIndex =
        readlineSync.questionInt(`\nEnter the number for the source chain: `) - 1;
      return {
        chainId: Number(sourceOptions[selectedIndex][0]),
        networkName: sourceOptions[selectedIndex][1].networkName,
      };
    }

    function selectTargetChain(deployedContracts: DeployedContracts): {
      chainId: number;
      networkName: string;
    } {
      const targetOptions = Object.entries(deployedContracts).filter(
        ([, contracts]) => contracts.CrossChainReceiver
      );

      if (targetOptions.length === 0) {
        console.error(
          'No target chains available with CrossChainReceiver deployed.'
        );
        process.exit(1);
      }

      console.log('\nSelect the target chain:');
      targetOptions.forEach(([chainId, contracts], index) => {
        console.log(`${index + 1}: ${contracts.networkName}`);
      });

      const selectedIndex =
        readlineSync.questionInt(`\nEnter the number for the target chain: `) - 1;
      return {
        chainId: Number(targetOptions[selectedIndex][0]),
        networkName: targetOptions[selectedIndex][1].networkName,
      };
    }

    async function main() {
      const chains = loadConfig();
      const deployedContracts = loadDeployedContracts();

      // Select the source chain (only show chains with CrossChainSender deployed)
      const { chainId: sourceChainId, networkName: sourceNetworkName } =
        selectSourceChain(deployedContracts);
      const sourceChain = chains.find((chain) => chain.chainId === sourceChainId)!;

      // Select the target chain (only show chains with CrossChainReceiver deployed)
      const { chainId: targetChainId, networkName: targetNetworkName } =
        selectTargetChain(deployedContracts);
      const targetChain = chains.find((chain) => chain.chainId === targetChainId)!;

      // Set up providers and wallets
      const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, sourceProvider);

      // Load the ABI from the JSON file (use the compiled ABI from Forge or Hardhat)
      const CrossChainSenderArtifact = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '../out/CrossChainSender.sol/CrossChainSender.json'
          ),
          'utf8'
        )
      );

      const abi = CrossChainSenderArtifact.abi;

      // Create the contract instance using the full ABI
      const CrossChainSender = new ethers.Contract(
        deployedContracts[sourceChainId].CrossChainSender!,
        abi,
        wallet
      );

      // Display the selected chains
      console.log(
        `\nInitiating transfer from ${sourceNetworkName} to ${targetNetworkName}.`
      );

      // Ask the user for token transfer details
      const tokenAddress = readlineSync.question(
        'Enter the token contract address: '
      );
      const recipientAddress = readlineSync.question(
        'Enter the recipient address on the target chain: '
      );

      // Get the token contract
      const tokenContractDecimals = new ethers.Contract(
        tokenAddress,
        [
          'function decimals() view returns (uint8)',
          'function approve(address spender, uint256 amount) public returns (bool)',
        ],
        wallet
      );

      // Fetch the token decimals
      const decimals = await tokenContractDecimals.decimals();

      // Get the amount from the user, then parse it according to the token's decimals
      const amount = ethers.parseUnits(
        readlineSync.question('Enter the amount of tokens to transfer: '),
        decimals
      );

      // Calculate the cross-chain transfer cost
      const cost = await CrossChainSender.quoteCrossChainDeposit(targetChainId);

      // Approve the CrossChainSender contract to transfer tokens on behalf of the user
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        wallet
      );

      const approveTx = await tokenContract.approve(
        deployedContracts[sourceChainId].CrossChainSender!,
        amount
      );
      await approveTx.wait();
      console.log(`Approved tokens for cross-chain transfer.`);

      // Initiate the cross-chain transfer
      const transferTx = await CrossChainSender.sendCrossChainDeposit(
        targetChainId,
        deployedContracts[targetChainId].CrossChainReceiver!,
        recipientAddress,
        amount,
        tokenAddress,
        { value: cost } // Attach the necessary fee for cross-chain transfer
      );
      await transferTx.wait();
      console.log(
        `Transfer initiated from ${sourceNetworkName} to ${targetNetworkName}. Transaction Hash: ${transferTx.hash}`
      );
    }

    main().catch((error) => {
      console.error(error);
      process.exit(1);
    });

    ```

### Transfer Tokens

Now that your transfer script is ready, it’s time to execute it and perform a cross-chain token transfer.

1. **Run the transfer script**: Open your terminal and run the transfer script.

    ```bash
    npx ts-node script/transfer.ts
    ```

    This command will start the script, prompting you to select the source and target chains, input the token address, recipient address, and the amount of tokens to transfer.

2. **Follow the prompts**: The script will guide you through selecting the source and target chains and entering the necessary details for the token transfer. Once you provide all the required information, the script will initiate the token transfer.

3. **Verify the transaction**: After running the script, you should see a confirmation message with the transaction hash. You can use this transaction hash to check the transfer status on the respective blockchain explorers.

You can verify the transaction on the [Wormhole Explorer](https://wormholescan.io/){target=\_blank} using the link provided in the terminal output. This explorer also offers the option to add the transferred token to your MetaMask wallet automatically.

If you followed the logic provided in the `transfer.ts` file above, your terminal output should look something like this:

<div id="termynal" data-termynal>
	<span data-ty="input"><span class="file-path"></span>npx ts-node transfer.ts</span>
	<span data-ty> > cross-chain-token-transfer@1.0.0 transfer</span>
	<span data-ty> > npx ts-node script/transfer.ts</span>
  <span data-ty> </span>
	<span data-ty> Select the source chain:</span>
	<span data-ty> 1: Avalanche testnet fuji</span>
  <span data-ty> 2: Base Sepolia</span>
  <span data-ty> </span>
  <span data-ty> Enter the number for the SOURCE chain: 1</span>
  <span data-ty> </span>
  <span data-ty> Select the target chain:</span>
  <span data-ty> 1: Avalanche testnet fuji</span>
  <span data-ty> 2: Base Sepolia</span>
  <span data-ty> </span>
  <span data-ty> Enter the number for the TARGET chain: 2</span>
  <span data-ty> </span>
  <span data-ty> Initiating transfer from Avalanche testnet fuji to Base Sepolia</span>
  <span data-ty> Enter the token contract address: 0x5425890298aed601595a70ab815c96711a31bc65</span>
  <span data-ty> Enter the recipient address on the target chain: INSERT_YOUR_WALLET_ADDRESS</span>
  <span data-ty> Enter the amount of tokens to transfer: 2</span>
  <span data-ty> Approved tokens for cross-chain transfer.</span>
  <span data-ty> Transfer initiated from Avalanche testnet fuji to Base Sepolia. Transaction Hash: 0x4a923975d955c1f226a1c2f61a1a0fa1ab1a9e229dc29ceaeadf8ef40acd071f</span>
	<span data-ty="input"><span class="file-path"></span></span>
</div>
!!! note
    In this example, we demonstrated a token transfer from the Avalanche Fuji Testnet to the Base Sepolia Testnet. We sent two units of USDC Testnet tokens using the token contract address `0x5425890298aed601595a70ab815c96711a31bc65`. You can replace these details with those relevant to your project or use the same for testing purposes.

## Resources

If you'd like to explore the complete project or need a reference while following this tutorial, you can find the complete codebase in the [Cross-Chain Token Transfers GitHub repository](https://github.com/wormhole-foundation/demo-cross-chain-token-transfer){target=\_blank}. The repository includes all the scripts, contracts, and configurations needed to deploy and transfer tokens across chains using the Wormhole protocol.

## Conclusion

Congratulations! You've successfully built and deployed a cross-chain token transfer system using Solidity and the Wormhole protocol. You've learned how to:

 - Set up a new Solidity project using Foundry.
 - Develop smart contracts to send and receive tokens across chains.
 - Write deployment scripts to manage and deploy contracts on different networks.

Looking for more? Check out the [Wormhole Tutorial Demo repository](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank} for additional examples.
