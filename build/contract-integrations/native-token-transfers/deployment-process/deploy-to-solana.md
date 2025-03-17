---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
---

# Deploy Native Token Transfers on Solana

## Introduction

[Native Token Transfers (NTT)](/docs/learn/messaging/native-token-transfers/overview/){target=\_blank} enable seamless cross-chain transfers of SPL tokens on Solana using Wormhole’s messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on Solana, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in hub-and-spoke or burn-and-mint mode.

A fully deployed NTT will be set up by the end, allowing your token to transfer between Solana and other supported chains.

## Prerequisites

Before deploying NTT on Solana, ensure you have the following:

-  [Rust](https://www.rust-lang.org/tools/install){target=\_blank} 
-  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} **`{{ ntt.solana_cli_version }}`**
-  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`{{ ntt.anchor_version }}`**

!!!Warning
    Ensure to use the Solana and Anchor versions listed above to avoid compatibility issues.

## Create and Mint Tokens

If you don’t already have an SPL token deployed, you'll need to deploy and configure it on Solana before integrating with Wormhole's NTT. This section walks you through generating a Solana wallet, deploying an SPL token, creating a token account, and minting tokens.

If you already have an SPL token, skip to [Set Up NTT](#set-up-ntt).

1. **Generate a Solana key pair** - create a new wallet

    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

2. **Set Solana configuration** - configure the Solana CLI to use the generated key pair

    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
    ```

3. **Select an RPC URL** - configure Solana to use the appropriate network

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

4. **Fund your wallet** - ensure you have enough SOL to create a token. If deploying on devnet, request an airdrop

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

## Set Up NTT

To integrate your token with NTT on Solana, you must initialize the deployment and configure its parameters. This process sets up the required contracts and may generate key pairs if they don’t exist. These key pairs are used to sign transactions and authorize actions within the NTT deployment.

The [NTT CLI](/docs/build/contract-integrations/native-token-transfers/deployment-process/installation/) manages deployments, configures settings, and interacts with the NTT system.

1. **Create a new NTT project** - set up a deployment workspace

    ```bash
    ntt new INSERT_PROJECT_NAME
    cd INSERT_PROJECT_NAME
    ```

2. **Initialize the deployment** - generate a `deployment.json` file with your deployment settings

    === "Mainnet"

        ```bash
        ntt init Mainnet
        ```

    === "Testnet"

        ```bash
        ntt init Testnet
        ```
    
    === "Devnet"

        ```bash
        ntt init Devnet
        ```

### Token Authority

The NTT CLI supports two [deployment models](/docs/learn/messaging/native-token-transfers/deployment/){target=\_blank}:

 - **Hub-and-spoke** - tokens are locked on a hub chain and minted on destination spoke chains. Since the token supply remains controlled by the hub chain, no changes to the minting authority are required
 - **Burn-and-mint** - tokens are burned on the source chain and minted on the destination chain. This requires transferring the SPL token’s minting authority to the Program Derived Address (PDA) controlled by the NTT program

If you want to use hub-and-spoke, skip this section and proceed to [Deploy and Configure NTT](#deploy-and-configure-ntt).

Before updating the mint authority, you must first create metadata for your SPL token. [See an example of how to create metadata for your SPL token](https://github.com/wormhole-foundation/demo-metaplex-metadata/blob/main/src/token-metadata.ts){target=\_blank}.

In this section, you will derive the PDA as the token authority and update the SPL token’s mint authority to enable NTT functionality.

1. **Generate an NTT program key pair** - create a unique key pair for the NTT program. The key pair must start with "ntt" to identify it as belonging to the NTT deployment

    ```bash
    solana-keygen grind --starts-with ntt:1 --ignore-case
    ```

2. **Derive the token authority** - generate the PDA, which will manage token minting

    ```bash
    ntt solana token-authority INSERT_YOUR_NTT_PROGRAM_KEY_PAIR
    ```

3. **Set SPL token mint authority** - delegate minting control to the derived PDA 

    ```bash
    spl-token authorize INSERT_TOKEN_ADDRESS mint INSERT_DERIVED_PDA
    ```

## Deploy and Configure NTT

After setting up your deployment, finalize the configuration and deploy the NTT program on Solana.

1. **Deploy NTT to Solana** - run the appropriate command based on your deployment mode:

    === "Burn-and-Mint"

        ```bash
        ntt add-chain Solana --latest --mode burning --token INSERT_TOKEN_ADDRESS --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
        ```

    === "Hub-and-Spoke"

        ```bash
        ntt add-chain Solana --latest --mode locking --token INSERT_TOKEN_ADDRESS --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
        ```

    !!! note
        The `add-chain` command accepts an optional `--solana-priority-fee` flag, which sets the priority fee in microlamports. The default is `50000`.

2. **Verify deployment status** - after deployment, check if your deployment.json file matches the on-chain configuration

    ```bash
    ntt status
    ```

    If needed, sync your local configuration with the on-chain state:

    ```bash
    ntt pull
    ```

3. **Configure inbound and outbound rate limits** - by default, the inbound and outbound limits are set to `0`. You must update them before pushing the deployment. 

    For EVM chains, values must be set using 18 decimals, while Solana uses 9 decimals.

    Open your `deployment.json` file and adjust the values based on your use case:  

    === "Solana (9 decimals)"  

        ```json
        "inbound": {
            "Sepolia": "1000.000000000" // inbound limit from Sepolia to Solana
        },
        "outbound": {
            "Sepolia": "1000.000000000" // outbound limit from Solana to Sepolia
        }
        ```  

    === "Sepolia (18 decimals)"  

        ```json
        "inbound": {
            "Solana": "1000.000000000000000000" // inbound limit from Solana to Sepolia
        },
        "outbound": {
            "Solana": "1000.000000000000000000" // outbound limit from Sepolia to Solana
        }
        ```  

4. **Push the final deployment** - once rate limits are set, push the deployment to Solana using the specified key pair to cover gas fees

    ```bash
    ntt push --payer INSERT_YOUR_KEYPAIR_JSON
    ```

!!! note "Troubleshoot Deployment Issues"
    If your deployment fails, it may be due to leftover program buffer accounts taking up storage on Solana. These temporary accounts are created during deployment but may persist if interrupted. To free up space and allow redeployment, refer to the [Solana program deployment guide](https://solana.com/docs/programs/deploying#program-buffer-accounts){target=\_blank} for instructions on finding and closing them.

## Next Steps and Resources  

Your NTT deployment on Solana is now complete! To proceed, explore the following:  

 - **Test your deployment** – follow the [NTT Post Deployment Guide](/docs/build/contract-integrations/native-token-transfers/deployment-process/post-deployment/){target=\_blank} for integration examples and testing instructions
 - **Integrate NTT into your application** – configure [Wormhole Connect](/docs/build/applications/connect/){target=\_blank}  a plug-and-play bridging UI, to enable cross-chain transfers for your token
 - **Get automatic relaying support** – for automatic Wormhole relaying support, [contact Wormhole contributors](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}