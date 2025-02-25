---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
---

# Native Token Transfers (NTT) Solana Deployment

## Introduction

Native Token Transfers enable seamless cross-chain transfers of SPL tokens on Solana using Wormhole’s messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on Solana, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in Hub-and-Spoke or Burn-and-Mint mode.

By the end, a fully deployed NTT will be set up, allowing your token to transfer between Solana and other supported chains.

## Prerequisites

Before deploying NTT on Solana, ensure you have the following:

-  [Rust](https://www.rust-lang.org/tools/install){target=\_blank} 
-  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} **`{{ ntt.solana_cli_version }}`**
-  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`{{ ntt.anchor_version }}`**

!!!Warning
    Ensure to use the Solana and Anchor versions listed above to avoid compatibility issues.

## Token Setup

You must create and configure an SPL token on Solana to enable cross-chain transfers. If you already have a deployed SPL token, you can [skip this section](#deploy-ntt).

???- interface "Deploy an SPL Token"

    1. Generate a new Solana key pair to create a wallet:
    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

    2. Set Solana configuration to use the new key pair created in step 1:
    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
    ```

    3. If deploying on Devnet, configure Solana to use the default RPC URL:
    ```bash
    solana config set -ud
    ```

    4. Request an airdrop of two SOL and check the balance:
    ```bash
    solana airdrop 2
    solana balance
    ```

    5. Install or update the SPL Token CLI:
    ```bash
    cargo install spl-token-cli
    ```

    6. Create a new token with the SPL Token CLI (make sure you have enough balance to pay for the transaction):
    ```bash
    spl-token create-token
    ```

    7. Create a new account for the token created in step 6:
    ```bash
    spl-token create-account INSERT_TOKEN_ADDRESS
    ```

    8. Mint `1000` tokens to the created account:
    ```bash
    spl-token mint INSERT_TOKEN_ADDRESS 1000
    ```

!!! note
    NTT versions `>=v2.0.0+solana` support SPL tokens with transfer hooks.

## Set Up NTT Deployment

Once your SPL token is set up, deploy the NTT program on Solana.

1. **Create a new NTT project** - set up a deployment workspace

    ```bash
    ntt new INSERT_PROJECT_NAME
    cd INSERT_PROJECT_NAME
    ```

2. **Initialize the deployment** - generate a `deployment.json` file with your deployment settings

    === "Testnet"

        ```bash
        ntt init Testnet
        ```

    === "Mainnet"

        ```bash
        ntt init Mainnet
        ```

The NTT CLI supports two [deployment models](/docs/learn/messaging/native-token-transfers/deployment/){target=\_blank}. If using hub-and-spoke, skip the below steps and proceed to [Deploy & Configure NTT](#deploy-configure-ntt).

???- interface "Burn-and-Mint Mode Only" 

    1. **Generate an NTT program key pair** - create a unique key pair for the NTT program

        ```bash
        solana-keygen grind --starts-with ntt:1 --ignore-case
        ```

    2. **Derive the token authority** - generate the Program Derived Address (PDA), which will manage token minting

        ```bash
        ntt solana token-authority INSERT_YOUR_NTT_PROGRAM_KEY_PAIR
        ```

    3. **Set SPL token mint authority** - delegate minting control to the derived PDA 

        ```bash
        spl-token authorize INSERT_TOKEN_ADDRESS mint INSERT_DERIVED_PDA
        ```

        !!!Warning
            You must create your token's metadata before delegating mint authority. [See an example on how to create metadata for your SPL token](https://github.com/wormhole-foundation/demo-metaplex-metadata){target=\_blank}.

## Deploy & Configure NTT

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

4. **Push the final deployment** - once rate limits are set, push the deployment to Solana 

    ```bash
    ntt push --payer INSERT_YOUR_KEYPAIR_JSON
    ```  

    By default, NTT transfers to Solana require manual relaying, meaning the user must perform a transaction on Solana to complete the transfer. UI components such as [Wormhole Connect](https://docs.wormhole.com/wormhole-connect/){target=\_blank} support this automatically.  

## Next Steps & Resources  

Your NTT deployment on Solana is now complete! To proceed, explore the following:  

 - **Test your deployment** – follow the [NTT Post Deployment Guide](/docs/build/contract-integrations/native-token-transfers/deployment-process/post-deployment/){target=\_blank} for integration examples and testing instructions
 - **Integrate NTT into your application** – use [Wormhole Connect](https://docs.wormhole.com/wormhole-connect/){target=\_blank} to enable seamless cross-chain transfers in your UI
 - **Troubleshoot deployment issues** – if your deployment fails, refer to the [Solana program deployment guide](https://solana.com/docs/programs/deploying#program-buffer-accounts){target=\_blank} to find and close buffer accounts
 - **Understand the NTT CLI** – the NTT CLI takes inspiration from [Git](https://git-scm.com/){target=\_blank}. Many commands work similarly, making version control and configuration updates intuitive 
 - **Get automatic relaying support** – for automatic Wormhole relaying support, [contact Wormhole contributors](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}