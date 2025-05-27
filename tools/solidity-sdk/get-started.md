---
title: Get Started with the Solidity SDK
description: Follow this guide to deploy Wormhole Solidity SDK-based sender and receiver smart contracts and use them to send testnet USDC across chains.
categories: Basics, Solidity-SDK
---

# Get Started with the Solidity SDK

The [Wormhole Solidity SDK](https://github.com/wormhole-foundation/wormhole-solidity-sdk){target=\_blank} provides Solidity interfaces, prebuilt contracts, and testing tools to help Solidity developers build on-chain Wormhole integrations via smart contracts. You can use the [Wormhole TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank} for off-chain integrations without writing Solidity.

## Install the Wormhole Solidity SDK

Use Foundry's [`forge`](https://book.getfoundry.sh/forge/){target=\_blank} to install the SDK using the following command:

```bash
forge install wormhole-foundation/wormhole-solidity-sdk
```

Next, review the following sections for more information on SDK components and features, or jump to [How It Works](#how-it-works) for a build-along demo project.

## Key Components and Features

The following key component and features work together to make your on-chain Wormhole integration easier to build.

### Wormhole Relayer Integration

- Easy integration with [Wormhole Relayer](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/IWormholeRelayer.sol){target=\_blank} to allow you to request a delivery provider to relay a payload to the target chain and address.
- **Reduce operational burden**: No need to run your own relay infrastructure or manage gas on multiple chains.
- **Accelerate development with pre-built contracts**: Common use cases like sending messages, tokens, and USDC come together quickly leveraging base contracts like the following:

    - [**`Base.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/Base.sol){target=\_blank}: Uses Wormhole interfaces to authorize and verify a registered sender.
    - [**`TokenBase.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/TokenBase.sol){target=\_blank}: Uses `TokenReceiver` and `TokenSender` contracts to define functions for transferring tokens.
    - [**`CCTPBase.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/CCTPBase.sol){target=\_blank}: Uses `CCTPSender` and `CCTPReceiver` contracts to define functions for transferring USDC.

### Solidity Interfaces

The SDK offers a number of Solidity interfaces for interacting with Wormhole ecosystem contracts.  

- [**`ITokenBridge.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/ITokenBridge.sol){target=\_blank}: Defines key structs and functions for token attestation, wrapping and transferring tokens, monitoring transaction progess.
- [**CCTP Interfaces**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/CCTPInterfaces){target=\_blank}: A set of interfaces for USDC transfers via CCTP for sending, relaying, and receiving messages and tokens.
- [**`IWormholeReceiver.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/IWormholeReceiver.sol){target=\_blank}: Defines the `receiveWormholeMessages` function.
- [**`IWormholeRelayer.sol`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/interfaces/IWormholeRelayer.sol){target=\_blank}: Defines key structs and functions to identify, send, and deliver messages and follow the progress of transactions.

### Helpful Constants

Auto-generated Solidity constants help avoid manual entry errors and ensure consistent delivery. 

- [**Wormhole Chain ID's**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/Chains.sol){target=\_blank}: Generated list of Wormhole Chain ID's for supported chains.
- [**Circle CCTP Domain IDs**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/b9e129e65d34827d92fceeed8c87d3ecdfc801d0/src/CCTPAndTokenBase.sol){target=\_blank}: Generated list of defined CCTP domain ID's to ensure USDC transfers use the correct domain for a given chain. 
- [**`chainConsts.ts`**](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/75ddcec06ffe9d62603d023357caa576c5ea101c/gen/chainConsts.ts){target=\_blank}: Returns values to identify properties and contract addresses for each supported chain.

### Testing Utilities

The Wormhole Solidity SDK also includes a robust set of [testing utilities](https://github.com/wormhole-foundation/wormhole-solidity-sdk/tree/75ddcec06ffe9d62603d023357caa576c5ea101c/test) for simulating message and token transfers to test your build.

## How It Works

The following demo illustrates use of Wormhole Solidity SDK-based smart contracts to send testnet USDC from Avalanche Fuji to Celo Alfajores.

### Prerequisites

Before you begin, make sure you have the following:

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed
- [TypeScript](https://www.typescriptlang.org/download/){target=\_blank} installed
- [Foundry](https://book.getfoundry.sh/getting-started/installation){target=\_blank} installed
- [Testnet AVAX for Avalanche Fuji](https://core.app/tools/testnet-faucet/?subnet=c&token=c){target=\_blank}
- [Testnet CELO for Celo Alfajores](https://faucet.celo.org/alfajores){target=\_blank}
- [USDC Testnet tokens](https://faucet.circle.com/){target=\_blank} on Avalanche Fuji and/or Celo Alfajores for cross-chain transfer

### Set Up Your Project

Follow these steps to prepare your development environment:

1. Create a directory for your project, navigate into it, and install the Wormhole Solidity SDK: 

    ```bash
    mkdir wh-solidity-token-transfer
    cd wh-solidity-token-transfer
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
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-1.sol"
    ```

    This contract assigns `CrossChainSender` to the `TokenSender` role, initializes the contract, calculates a cost of transfer estimate, defines transfer parameters, and initiates the transfer using the `sendTokenWithPayloadToEvm` function from `WormholeRelayer`.

2. Use the following example code to create `CrossChainReceiver.sol`:

    ```solidity title="CrossChainSender.sol"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-2.sol"
    ```

    This contract assigns `CrossChainReceiver` to the `TokenReceiver` role, initializes the contract, receives the payload and tokens, verifies the transfer is from a registered sender, decodes the recipient address, and transfers the tokens to the recipient.

3. Deploy the contracts using your preferred deployment method. Make sure you deploy `CrossChainSender.sol` to your desired source chain and `CrossChainReceiver.sol` to the target chain. Save the deployed contract addresses for each contract. You will need them for your transfer script.

### Create Your Transfer Script

1. Once your contracts are deployed, create a `transfer.ts` file to handle the multichain transfer logic:

    ```bash
    touch script/transfer.ts
    ```

2. Set up secure access to your wallets. This guide assumes you are loading your private key(s) from a secure keystore of your choice, such as a secrets manager or a CLI-based tool like [`cast wallet`](https://book.getfoundry.sh/reference/cast/cast-wallet){target=\_blank}.

    !!! warning
        If you use a `.env` file during development, add it to your `.gitignore` to exclude it from version control. Never commit private keys or mnemonics to your repository.

3. Open `transfer.ts` and add the following code:

    ```typescript title="transfer.ts"
    --8<-- "code/tools/solidity-sdk/get-started/solidity-sdk-3.ts"
    ```

    This script defines sender and receiver contract addresses, fetches needed ABI information, creates a connected signer, converts decimals, qoutes transfer cost, and initiates the token transfer.

3. Run the script using the following command:

    ```bash
    npx tsx script/transfer.ts
    ```

4. Follow the prompts in the terminal. This example uses Avalanche Fuji as the source chain, Celo Testnet as the target, [Avalanche Fuji testnet USDC](https://developers.circle.com/stablecoins/usdc-on-test-networks){target=\_blank}, and a developer wallet as the recipient address. You will see terminal output similar to the following:

    --8<-- "code/tools/solidity-sdk/get-started/terminal-output-01.html"

Congratulations! You've successfully created and deployed Wormhole Solidity SDK-based smart contracts and used them to send testnet USDC across blockchains. Consider the following options to build upon what you've accomplished.

## Next Steps

- [**Get Started with Messaging**](/docs/products/messaging/get-started/): Send a message across blockchains using the Wormhole TypeScript SDK to eliminate smart contract development and auditing overhead.
