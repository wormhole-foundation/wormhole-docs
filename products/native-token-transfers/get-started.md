---
title: Get Started with NTT
description: NTT enables cross-chain token movement without wrapping. Install the CLI, deploy test tokens, and scaffold a project to integrate NTT into your app.
categories: NTT, Transfer
---

# Get Started with NTT

## Introduction

The [Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview){target=\_blank} framework enables seamless cross-chain token movement without wrapping or liquidity pools. This guide shows you how to install the NTT CLI, which is used to configure and deploy native token contracts, and scaffold your first project for deployment on testnet or mainnet.

If you are looking for a no-code experience to deploy on mainnet, you can explore the [NTT Launchpad](https://ntt.wormhole.com){target=\_blank}.

## Prerequisites

Before you begin, make sure you have:

- [Node.js and npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}
- [Bun installed](https://bun.sh/){target=\_blank}
- A wallet private key with tokens on supported chains
- ERC-20 or SPL tokens already deployed on the source and destination chains

## Don’t Have a Token Yet?

To use NTT, you must have a token already deployed on the source and destination chains. If you don’t have one, follow the quick guides below to deploy a basic test token.

???- interface "Deploy an ERC-20 Token on EVM"
    You can follow the scripts in the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token){target=\_blank} to deploy a token contract on testnet.


???- interface "Create and Mint SPL Tokens"
    This section walks you through generating a Solana wallet, deploying an SPL token, creating a token account, and minting tokens.

    1. **Generate a Solana key pair** - run the following command to create a new wallet:

        ```bash
        solana-keygen grind --starts-with w:1 --ignore-case
        ```

    2. **Set Solana configuration** - configure the Solana CLI to use the generated key pair using the following command:

        ```bash
        solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
        ```

    3. **Select an RPC URL** - configure Solana to use the appropriate network using one of the following commands:

        === "Mainnet"
            ```bash
            solana config set -um
            ```

        === "Testnet"
            ```bash
            solana config set -ut
            ```

        === "Devnet"
            ```bash
            solana config set -ud
            ```

    4. **Fund your wallet** - ensure you have enough SOL to create a token. If deploying on devnet, request an airdrop with the following commands:

        ```bash
        solana airdrop 2
        solana balance
        ```

    5. **Install SPL Token CLI** - install or update the required [CLI tool](https://spl.solana.com/token){target=\_blank}

        ```bash
        cargo install spl-token-cli
        ```

    6. **Create a new SPL token** - initialize the token on Solana

        ```bash
        spl-token create-token
        ```

    7. **Create a token account** - generate an account to hold the token

        ```bash
        spl-token create-account INSERT_TOKEN_ADDRESS
        ```

    8. **Mint tokens** - send 1000 tokens to the created account

        ```bash
        spl-token mint INSERT_TOKEN_ADDRESS 1000
        ```

    !!! note
        NTT versions `>=v2.0.0+solana` support SPL tokens with [transfer hooks](https://spl.solana.com/transfer-hook-interface){target=\_blank}.

## Install NTT CLI

The NTT CLI is recommended to deploy and manage your cross-chain token configuration.

1. Run the installation command in your terminal:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/wormhole-foundation/native-token-transfers/main/cli/install.sh | bash
    ```

2. Verify the NTT CLI is installed:

    ```bash
    ntt --version
    ```

## Initialize a New NTT Project

1. Once the CLI is installed, scaffold a new project by running:

    ```bash
    ntt new my-ntt-project
    cd my-ntt-project
    ```

2. Initialize a new `deployment.json` file specifying the network:

    === "Mainnet"
        ```bash
        ntt init Mainnet
        ```

    === "Testnet"
        ```bash
        ntt init Testnet
        ```

    After initialization, the `deployment.json` file contains your NTT configuration and starts with the selected network.

    === "Mainnet"
        ```json
        {
            "network": "Mainnet",
            "chains": {}
        }
        ```

    === "Testnet"
        ```json
        {
            "network": "Testnet",
            "chains": {}
        }
        ```

In the deployment steps, you will add your supported chains, their token addresses, deployment modes, and any custom settings.

## Next Steps

You have scaffolded your NTT project and initialized the configuration file. Next, follow the appropriate guide below to configure your supported chains and deploy NTT contracts:

- [Deploy to EVM](/docs/products/native-token-transfers/guides/deploy-to-evm/){target=\_blank}
- [Deploy to Solana](/docs/products/native-token-transfers/guides/deploy-to-solana/){target=\_blank}
