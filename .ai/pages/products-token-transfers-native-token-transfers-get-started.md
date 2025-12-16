---
title: Get Started with NTT
description: NTT enables cross-chain token movement without wrapping. Install the CLI, deploy test tokens, and scaffold a project to integrate NTT into your app.
categories: NTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/native-token-transfers/get-started/
---

# Get Started with NTT

## Introduction

The [Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank} framework enables seamless cross-chain token movement without wrapping or liquidity pools. This guide shows you how to install the NTT CLI, which is used to configure and deploy native token contracts, and scaffold your first project for deployment on testnet or mainnet.

For a coding walkthrough on deploying NTT with the CLI, watch the [NTT deployment demo](https://www.youtube.com/watch?v=ltZmeyjUxRk&t=1686s){target=\_blank}.

## Prerequisites

Before you begin, make sure you have:

- [Node.js and npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
- A wallet private key with tokens on supported chains.
- ERC-20 or SPL tokens already deployed on the source and destination chains.

## Don’t Have a Token Yet?

To use NTT, you must have a token already deployed on the source and destination chains. If you don’t have one, follow the quick guides below to deploy a basic test token.

???- interface "Deploy an ERC-20 Token on EVM"
    Use the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token-evm){target=\_blank} to deploy a basic ERC-20 token contract on testnet.

    1. **Install Foundry**: Install the [Forge CLI](https://getfoundry.sh/introduction/installation/){target=\_blank}.

    2. **Clone the repository**: Fetch the example contract repository.

        ```bash
        git clone https://github.com/wormhole-foundation/example-ntt-token-evm.git
        cd example-ntt-token
        ```
    3. **Deploy the token contract**: Deploy to testnet with your preferred name, symbol, minter, and owner addresses.

        ```bash
        forge create --broadcast \
            --rpc-url INSERT_RPC_URL \
            --private-key INSERT_YOUR_PRIVATE_KEY \
            src/PeerToken.sol:PeerToken \
            --constructor-args "INSERT_TOKEN_NAME" "INSERT_TOKEN_SYMBOL" INSERT_MINTER_ADDRESS INSERT_OWNER_ADDRESS
        ```

    4. **Mint tokens**: Send tokens to your address.

        ```bash
        cast send INSERT_TOKEN_ADDRESS \
            "mint(address,uint256)" \
            INSERT_RECIPIENT_ADDRESS \
            INSERT_AMOUNT_IN_WEI \
            --private-key INSERT_YOUR_PRIVATE_KEY \
            --rpc-url INSERT_RPC_URL
        ```

    !!! note
        This token uses 18 decimals by default. All minting values must be specified in `wei` (1 token = 10^18).
???- interface "Create and Mint an SPL Token"
    This section walks you through generating a Solana wallet, deploying an SPL token, creating a token account, and minting tokens.

    1. **Generate a key pair**: Run the following command to create a new wallet compatible with supported SVM chains.

        ```bash
        solana-keygen grind --starts-with w:1 --ignore-case
        ```

    2. **Set CLI keypair configuration**: Configure the Solana CLI to use the generated key pair.

        ```bash
        solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
        ```

    3. **Select an RPC URL**: Configure the CLI to use the appropriate network using one of the following commands.

        === "Mainnet"
            ```bash
            solana config set -um
            ```

        === "Testnet (Solana's Devnet)"
            ```bash
            solana config set -ud
            ```

        === "Fogo Testnet"
            ```bash
            solana config set --url INSERT_FOGO_TESTNET_RPC_URL
            ```
                    
        !!! note
            Solana's official testnet cluster is not supported for token creation or deployment with NTT. You must use the Solana devnet instead.

    4. **Fund your wallet**: Ensure your wallet has enough native tokens to cover transaction fees.

        - On Solana Devnet, you can request an airdrop:

            ```bash
            solana airdrop 2
            solana balance
            ```

    5. **Install SPL Token CLI**: Install or update the required [CLI tool](https://www.solana-program.com/docs/token#setup){target=\_blank}.

        ```bash
        cargo install spl-token-cli
        ```

    6. **Create a new SPL token**: Initialize the token on your connected SVM chain.

        ```bash
        spl-token create-token
        ```

    7. **Create a token account**: Generate an account to hold the token.

        ```bash
        spl-token create-account INSERT_TOKEN_ADDRESS
        ```

    8. **Mint tokens**: Send 1000 tokens to the created account.

        ```bash
        spl-token mint INSERT_TOKEN_ADDRESS 1000
        ```

    !!! note
        NTT versions `>=v2.0.0+solana` support SPL tokens with [transfer hooks](https://www.solana-program.com/docs/transfer-hook-interface){target=\_blank}.
???- interface "Create and Deploy a Sui Token"
    This section walks you through setting up a wallet, deploying a Sui Coin contract, and minting tokens on testnet.

    1. **Clone the repository**: Use the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token-sui){target=\_blank} to deploy a Sui Coin contract on testnet.

        ```bash
        git clone https://github.com/wormhole-foundation/example-ntt-token-sui
        cd example-ntt-token-sui
        ```

    2. **Set up a new wallet on testnet**: Before building and deploying your token, you'll need to create a new wallet on the Sui testnet and fund it with test tokens.

        1. **Create a new testnet environment**: Configure your Sui client for testnet.

            ```bash
            sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
            ```

        2. **Generate a new address**: Create a new Ed25519 address for your wallet.

            ```bash
            sui client new-address ed25519
            ```

        3. **Switch to the new address**: The above command will output a new address. Copy this address and switch to it.

            ```bash
            sui client switch --address YOUR_ADDRESS_STEP2
            ```

        4. **Fund your wallet**: Use the faucet to get test tokens.

            ```bash
            sui client faucet
            ```

        5. **Verify funding**: Check that your wallet has been funded.

            ```bash
            sui client balance
            ```

    3. **Build the project**: Compile the Move contract.

        ```bash
        sui move build
        ```

    4. **Deploy the token contract**: Deploy to testnet.

        ```bash
        sui client publish --gas-budget 20000000
        ```

    5. **Mint tokens**: Send tokens to your address.

        ```bash
        sui client call \
        --package YOUR_DEPLOYED_PACKAGE_ID_STEP4 \
        --module MODULE_NAME_STEP1 \
        --function mint \
        --args TREASURYCAP_ID_STEP4 AMOUNT_WITH_DECIMALS RECIPIENT_ADDRESS \
        --gas-budget 10000000
        ```

    !!! note
        This token uses 9 decimals by default. All minting values must be specified with that in mind (1 token = 10^9).
## Install NTT CLI

The NTT CLI is recommended to deploy and manage your cross-chain token configuration.

1. Run the installation commands in your terminal:

    ```bash
    git clone --branch 'v1.6.0+cli' --single-branch --depth 1 \
        https://github.com/wormhole-foundation/native-token-transfers.git
    cd native-token-transfers
    ```

    ```bash
    curl -fsSL https://bun.com/install | bash -s "bun-v1.2.23"  
    ```

    ```bash
    npm ci
    cd cli
    ./install.sh
    ```
??? warning "Install permission denied?"
    If the `install.sh` could not be executed due to file permissions, you need to change the ownership of the executable file. For example:

    ```bash
    chmod u+x ./install.sh
    ```

2. Verify the NTT CLI is installed:

    ```bash
    ntt --version
    ```
??? warning "Command not found?"
    If the `ntt` command is not recognized after installation, ensure that [Bun](https://bun.sh/) v1.2.23 is installed and that its binary directory is included in your shell’s PATH.
    
    Append this line to your shell config (e.g., `~/.zshrc` or `~/.bashrc`):

    ```bash
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
    ```

    Then, restart your terminal or run `source ~/.zshrc`.

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

 - [Deploy to EVM](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-evm/){target=\_blank}: Deploy NTT on EVM-compatible chains.
 - [Deploy to SVM](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-solana/){target=\_blank}: Deploy NTT on SVM-compatible chains.
 - [Deploy to Sui](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-sui/){target=\_blank}: Deploy NTT on Sui.
 - **[Explore the Wormhole Dev Arena](https://arena.wormhole.com/){target=\_blank}**: A structured learning hub with hands-on tutorials across the Wormhole ecosystem.
