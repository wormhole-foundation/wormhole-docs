---
title: Get Started with the Solidity SDK
description: Follow this guide to use the Wormhole Solidity SDK's interfaces and tools to help you quickly build on-chain integrations using smart contracts.
categories: Solidity SDK
url: https://wormhole.com/docs/tools/.solidity-sdk/.get-started/
---

# Get Started with the Solidity SDK

:simple-github: [Repository on GitHub](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank}

The Wormhole Solidity SDK provides Solidity interfaces, prebuilt contracts, and testing tools to help Solidity developers build on-chain Wormhole integrations via smart contracts. You can use the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank} for off-chain integrations without writing Solidity.

## Install the SDK

Use Foundry's [`forge`](https://getfoundry.sh/forge/){target=\_blank} to install the SDK using the following command:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk
```

## Key Components

The following key components and features work together to make your on-chain Wormhole integration easier to build.

??? interface "Base contracts"

    Leverage base contracts to send and receive messages and tokens.

    - **[`Base.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/Base.sol){target=\_blank}**: Uses Wormhole interfaces to authorize and verify a registered sender.
    - **[`TokenBase.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/TokenBase.sol){target=\_blank}**: Uses `TokenReceiver` and `TokenSender` contracts to define functions for transferring tokens.
    - **[`CCTPBase.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/CCTPBase.sol){target=\_blank}**: Uses `CCTPSender` and `CCTPReceiver` contracts to define functions for transferring USDC.

??? interface "Interfaces"

    Use interfaces to ensure consistent interactions with the protocol regardless of the supported chain you use.

    - **[`ITokenBridge.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/ITokenBridge.sol){target=\_blank}**: Defines key structs and functions for token attestation, wrapping and transferring tokens, monitoring transaction progress.
    - **[CCTP Interfaces](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/CCTPInterfaces){target=\_blank}**: A set of interfaces for USDC transfers via CCTP for sending, relaying, and receiving messages and tokens.
    - **[`IWormholeReceiver.sol`](https://github.com/wormhole-foundation/wormhole/blob/main/relayer/ethereum/contracts/interfaces/relayer/IWormholeReceiver.sol){target=\_blank}**: Defines the `receiveWormholeMessages` function.
    - **[`IWormholeRelayer.sol`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/IWormholeRelayer.sol){target=\_blank}**: Defines key structs and functions to identify, send, and deliver messages and follow the progress of transactions.

??? interface "Constants"

    Auto-generated Solidity constants help avoid manual entry errors and ensure consistent delivery.

    - **[Wormhole Chain ID's](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/Chains.sol){target=\_blank}**: Generated list of Wormhole Chain ID's for supported chains.
    - **[Circle CCTP Domain IDs](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/CCTPAndTokenBase.sol){target=\_blank}**: Generated list of defined CCTP domain ID's to ensure USDC transfers use the correct domain for a given chain.
    - **[`chainConsts.ts`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/75ddcec06ffe9d62603d023357caa576c5ea101c/gen/chainConsts.ts){target=\_blank}**: Returns values to identify properties and contract addresses for each supported chain.

## Example Usage

The following demo illustrates the use of Wormhole Solidity SDK-based smart contracts to send testnet USDC between supported chains.

### Prerequisites
Before you begin, ensure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed.
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed.
- [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank} installed.
- Testnet tokens for two supported chains. This example uses [testnet AVAX for Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank} and [testnet CELO for Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank} and can be adapted to any supported chains.
- [USDC testnet tokens](https://faucet.circle.com/){target=\_blank} on your source chain for cross-chain transfer.

### Set Up a Project

Follow these steps to prepare your development environment:

1. Create a directory for your project, navigate into it, and install the Wormhole Solidity SDK: 

    ```bash
    mkdir solidity-token-transfer
    cd solidity-token-transfer
    forge install wormhole-foundation/wormhole-solidity-sdk
    ```

2. Install dependencies for use with your transfer script, including the Wormhole TypeScript SDK, and initiate a new Node.js project:

    ```bash
    npm init -y && npm install @wormhole-foundation/sdk ethers -D tsx typescript
    ```

### Create and Deploy Contracts

This project uses sender and receiver contracts to access the `WormholeRelayer` interface's [`TokenSender`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L24){target=\_blank} and [`TokenReceiver`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/baa085006586a43c42858d355e3ffb743b80d7a4/src/WormholeRelayer/TokenBase.sol#L147){target=\_blank} base classes to simplify sending tokens across chains.

Follow these steps to create and deploy your sender and receiver Solidity contracts:

1. Use the following example code to create `CrossChainSender.sol`:

    ```solidity title="CrossChainSender.sol"
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    // Extend the TokenSender contract inherited from TokenBase
    contract CrossChainSender is TokenSender {
        uint256 constant GAS_LIMIT = 250_000;
        // Initialize the contract with the Wormhole relayer, WTT (Token Bridge),
        // and Wormhole Core Contract addresses
        constructor(
            address _wormholeRelayer,
            address _tokenBridge,
            address _wormhole
        ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

        // Calculate the estimated cost for multichain token transfer using
        // the wormholeRelayer to get the delivery cost and add the message fee
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

    This contract extends `TokenSender`, gaining access to its functionality. It initializes the contract with the required addresses, calculates estimated transfer costs, defines transfer parameters, and initiates the transfer using the `sendTokenWithPayloadToEvm` function from `WormholeRelayer`.

2. Use the following example code to create `CrossChainReceiver.sol`:

    ```solidity title="CrossChainSender.sol"
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.13;

    import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
    import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

    // Extend the TokenReceiver contract inherited from TokenBase
    contract CrossChainReceiver is TokenReceiver {
        // Initialize the contract with the Wormhole relayer, WTT (Token Bridge),
        // and Wormhole Core Contract addresses
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

    This contract extends `TokenReceiver`, gaining access to its functionality. It initializes the contract with the required addresses, receives the payload and tokens, verifies the transfer is from a registered sender, decodes the recipient address, and transfers the tokens to the recipient.

3. Deploy the contracts using your preferred deployment method. Make sure you deploy `CrossChainSender.sol` to your desired source chain and `CrossChainReceiver.sol` to the target chain. Save the deployed contract addresses for each contract. You will need them for your transfer script.

##  Use Contracts to Transfer USDC

1. Once your contracts are deployed, create a `transfer.ts` file to handle the multichain transfer logic:

    ```bash
    touch script/transfer.ts
    ```

2. Set up secure access to your wallets. This guide assumes you are loading your private key(s) from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://getfoundry.sh/cast/reference/wallet/#cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

3. Open `transfer.ts` and add the following code:

    ```typescript title="transfer.ts"
    import { ethers } from 'ethers';
    import fs from 'fs';
    import path from 'path';
    import readlineSync from 'readline-sync';
    import { fileURLToPath } from 'url';
    import { wormhole, chainToChainId } from '@wormhole-foundation/sdk';
    import evm from '@wormhole-foundation/sdk/evm';

    // Replace with your contract address and chain names
    const AVALANCHE_SENDER_ADDRESS = 'INSERT_AVALANCHE_SENDER_CONTRACT_ADDRESS';
    const CELO_RECEIVER_ADDRESS = 'INSERT_CELO_RECEIVER_ADDRESS';
    const AVALANCHE_CHAIN_NAME = 'Avalanche';
    const CELO_CHAIN_NAME = 'Celo';

    // Fetch the contract ABI from the local filesystem
    // This example uses the `out` directory from a Foundry deployment
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const SENDER_ABI_PATH = path.resolve(
      __dirname,
      '../out/CrossChainSender.sol/CrossChainSender.json'
    );

    (async function () {
      try {
        console.log('Initializing Wormhole SDK...');
        const wh = await wormhole('Testnet', [evm]);
        const sendChain = wh.getChain(AVALANCHE_CHAIN_NAME);
        const rcvChain = wh.getChain(CELO_CHAIN_NAME);

        // The EVM_PRIVATE_KEY value must be loaded securely beforehand,
        // for example via a keystore, secrets manager, or environment variables
        // (not recommended)
        const EVM_PRIVATE_KEY = EVM_PRIVATE_KEY!;
        if (!EVM_PRIVATE_KEY) {
          console.error('EVM_PRIVATE_KEY is not set in your .env file.');
          process.exit(1);
        }

        // Get the RPC URL or Provider from the SDK
        const sourceRpcOrProvider = await sendChain.getRpc();
        let sourceProvider: ethers.JsonRpcProvider;
        if (
          sourceRpcOrProvider &&
          typeof (sourceRpcOrProvider as any).getBlockNumber === 'function'
        ) {
          sourceProvider = sourceRpcOrProvider as ethers.JsonRpcProvider;
        } else if (typeof sourceRpcOrProvider === 'string') {
          sourceProvider = new ethers.JsonRpcProvider(sourceRpcOrProvider);
        } else if (
          Array.isArray(sourceRpcOrProvider) &&
          typeof sourceRpcOrProvider[0] === 'string'
        ) {
          sourceProvider = new ethers.JsonRpcProvider(sourceRpcOrProvider[0]);
        } else {
          console.error(
            'Could not get a valid RPC URL or Provider from SDK:',
            sourceRpcOrProvider
          );
          process.exit(1);
        }

        // Create the wallet using the provider and private key
        const sourceWallet = new ethers.Wallet(EVM_PRIVATE_KEY, sourceProvider);

        // Load the sender contract ABI
        if (!fs.existsSync(SENDER_ABI_PATH)) {
          console.error(`ABI file not found at ${SENDER_ABI_PATH}`);
          process.exit(1);
        }
        const CrossChainSenderArtifact = JSON.parse(
          fs.readFileSync(SENDER_ABI_PATH, 'utf8')
        );
        const senderAbi = CrossChainSenderArtifact.abi;

        // Create new sender contract instance
        const senderContract = new ethers.Contract(
          AVALANCHE_SENDER_ADDRESS,
          senderAbi,
          sourceWallet
        );

        // Get user input for token transfer parameters
        const tokenAddress = readlineSync.question(
          'Enter the (ERC20) token contract address on Avalanche: '
        );
        const recipientAddress = readlineSync.question(
          'Enter the recipient address on Celo: '
        );
        const amountStr = readlineSync.question(
          'Enter the amount of tokens to transfer: '
        );

        // Approve sending tokens from the source wallet to the sender contract
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            'function decimals() view returns (uint8)',
            'function approve(address spender, uint256 amount) public returns (bool)',
            'function allowance(address owner, address spender) view returns (uint256)',
          ],
          sourceWallet
        );

        // Convert the amount to the correct units based on token decimals
        const decimals = Number(await tokenContract.decimals());
        const amountToTransfer = ethers.parseUnits(amountStr, decimals);

        // Get a transfer cost quote
        const targetChainId = chainToChainId(rcvChain.chain);
        const cost = await senderContract.quoteCrossChainDeposit(targetChainId);
        // Approve the sender contract to spend the tokens
        const approveTx = await tokenContract.approve(
          AVALANCHE_SENDER_ADDRESS,
          amountToTransfer
        );
        await approveTx.wait();

        // Initiate the transfer
        console.log(
          `Initiating cross-chain transfer to ${CELO_RECEIVER_ADDRESS} on ${rcvChain.chain}...`
        );
        const transferTx = await senderContract.sendCrossChainDeposit(
          targetChainId,
          CELO_RECEIVER_ADDRESS,
          recipientAddress,
          amountToTransfer,
          tokenAddress,
          { value: cost }
        );
        console.log(`Transfer transaction sent: ${transferTx.hash}`);
        await transferTx.wait();
        console.log(`✅ Transfer initiated successfully!`);
      } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
      }

      process.exit(0);
    })();

    ```

    This script defines the sender and receiver contract addresses, fetches the necessary ABI information, creates a connected signer, converts decimals, calculates the estimated transfer cost, and initiates the token transfer.

3. Run the script using the following command:

    ```bash
    npx tsx script/transfer.ts
    ```

4. Follow the prompts in the terminal. This example uses Avalanche Fuji as the source chain, Celo Testnet as the target, [Avalanche Fuji testnet USDC](https://developers.circle.com/stablecoins/usdc-contract-addresses#testnet){target=\_blank}, and a developer wallet as the recipient address. You will see terminal output similar to the following:

    <div id="termynal" data-termynal>
    	<span data-ty="input"><span class="file-path"></span>npx tsx script/transfer.ts</span>
    	<span data-ty>Initializing Wormhole SDK...</span>
        <span data-ty>Enter the (ERC20) token contract address on Avalanche: 0x5425890298aed601595a70ab815c96711a31bc65</span>
        <span data-ty>Enter the recipient address on Celo: 0xCD8Bcd9A793a7381b3C66C763c3f463f70De4e12</span>
        <span data-ty>Initiating cross-chain transfer to 0xff97a7141833fbe829249d4e8952A8e73a4a2fbd on Celo...</span>
        <span data-ty>Transfer transaction sent: 0x2d819aadf88309eb19f59a510aba1f2892b54487f9e287feadd150181a28f771</span>
        <span data-ty=>✅ Transfer initiated successfully!</span>
        <span data-ty="input"><span class="file-path"></span></span>
    </div>
Congratulations! You've successfully created and deployed Wormhole Solidity SDK-based smart contracts and used them to send testnet USDC across blockchains. Consider the following options to build upon what you've accomplished.

## Next Steps

- **[Get Started with Messaging](/docs/products/messaging/get-started/)**: Send a message across blockchains using the Wormhole TypeScript SDK to eliminate smart contract development and auditing overhead.
