---
title: Native Token Transfers Sui Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Sui, including setup, token compatibility, mint/burn modes, and CLI usage.
categories: NTT, Transfer
---

# Deploy NTT to Sui

[Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank} enable seamless multichain transfers of Sui tokens using Wormhole's messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on Sui, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in hub-and-spoke or burn-and-mint mode.

## Prerequisites

Before deploying NTT on Sui, ensure you have the following prerequisites:

- [Sui Client CLI installed](https://docs.sui.io/guides/developer/getting-started/sui-install){target=\_blank}.

## Overview of the Deployment Process

Deploying NTT on the Sui network follows a structured process:

1. **Choose your token setup**:

     - **Use an existing Sui token**: If your token is already deployed on the Sui network, you can skip token creation and move directly to the [Set Up NTT](#set-up-ntt) section.
     - **Create a new Sui token**: If you don't already have a Sui token deployed, you'll need to deploy and configure it on the Sui network before integrating with Wormhole's NTT.

        ???- interface "Create and Deploy a Sui Token"
            --8<-- 'text/products/native-token-transfers/get-started/deploy-sui.md'

2. **Choose your deployment model**:

    - **Hub-and-spoke**: Tokens are locked on a hub chain and minted on destination spoke chains. Since the token supply remains controlled by the hub chain, no changes to the minting authority are required.
    - **Burn-and-mint**: Tokens are burned on the source chain and minted on the destination chain. This requires transferring the Sui Treasury cap object to the NTT manager.

3. **Deploy and configure NTT**: Use the NTT CLI to initialize and deploy the NTT program, specifying your Sui token and deployment mode.


## Set Up NTT

Before deploying NTT contracts on Sui, you need to scaffold a project and initialize your deployment configuration.

!!! note
    If you already have an NTT deployment to another chain (like Solana), you can skip the `ntt new` and `ntt init` commands. Simply navigate to your existing NTT project directory and proceed directly to the [Deploy and Configure NTT](#deploy-and-configure-ntt) section.

The [NTT CLI](/docs/products/native-token-transfers/reference/cli-commands/){target=\_blank} manages deployments, configures settings, and interacts with the NTT system. Follow these steps to set up NTT using the CLI tool:

???- interface "Install the NTT CLI and Scaffold a New Project"
    
    --8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md'

        === "Testnet"

            ```bash
            ntt init Testnet
            ```

## Deploy and Configure NTT

Once you've set up NTT, proceed with deploying the contracts.

1. **Environment Setup**: Ensure you have set up your environment correctly, open your terminal, and run the `export` commands:

    ```bash
    sui keytool export --key-identity goofy
    ```
    **Note**: Replace `goofy` with your actual key alias. This command exports the private key in the format required by the NTT add-chain command.

    ```bash
    export SUI_PRIVATE_KEY=INSERT_PRIVATE_KEY
    ```

    After setting up your deployment, finalize the configuration and deploy the NTT program onto the Sui network by following the steps below.

2. **Deploy NTT to Sui**: Run the appropriate command based on your deployment mode.

    !!! note
        The `--token` parameter requires the full Sui coin type in the format `0xADDRESS::module::struct`. 
        For example, `0x2::sui::SUI` for the native SUI token, or `0x1234567890abcdef::my_module::MyToken` for a custom token.

    !!! warning 
        In burning mode, the NTT CLI moves the treasury-cap object during the add-chain command to the NTT manager, enabling the NTT manager to mint tokens. 
        **Important**: Once the treasury-cap object is moved to the NTT manager, you will no longer be able to modify the token's metadata (such as name, symbol, or icon).

    === "Burn-and-Mint"

        ```bash
        ntt add-chain Sui --latest --mode burning --token INSERT_FULL_COIN_TYPE --sui-treasury-cap YOUR_TREASURY_CAP_ID 
        ```

    === "Hub-and-Spoke"

        ```bash
        ntt add-chain Sui --latest --mode locking --token INSERT_FULL_COIN_TYPE
        ```

3. **Verify deployment status**: After deployment, check if your `deployment.json` file matches the on-chain configuration using the following command.

    ```bash
    ntt status
    ```

    If needed, sync your local configuration with the on-chain state:

    ```bash
    ntt pull
    ```

4. **Configure inbound and outbound rate limits**: By default, the inbound and outbound limits are set to `0` and must be updated before deployment. 

    Open your `deployment.json` file and adjust the values based on your use case:  

    ```json
    "inbound": {
        "Sepolia": "1000.000000000" // inbound limit from Sepolia to Sui
    },
    "outbound": {
        "Sepolia": "1000.000000000" // outbound limit from Sui to Sepolia
    }
    ```

5. **Push the final deployment**: Once rate limits are set, sync the on-chain configuration with local changes made to your `deployment.json` file.

    ```bash
    ntt push
    ```
  
After you deploy the NTT contracts, ensure that the deployment is properly configured and your local representation is consistent with the actual on-chain state by running `ntt status` and following the instructions shown on the screen.


## Where to Go Next

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Test Your Deployment**

    ---

    Follow the NTT Post Deployment Guide for integration examples and testing instructions.

    [:custom-arrow: Test Your NTT deployment](/docs/products/native-token-transfers/guides/post-deployment/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Deploy NTT to SVM Chains**

    ---

    Follow the guide to deploy and configure Wormhole's Native Token Transfers (NTT) for SVM chains.

    [:custom-arrow: Deploy NTT to SVM Chains](/docs/products/native-token-transfers/guides/deploy-to-solana/){target=\_blank}

-   :octicons-question-16:{ .lg .middle } **View FAQs**

    ---

    Find answers to common questions about NTT.

    [:custom-arrow: View FAQs](/docs/products/native-token-transfers/faqs){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Deploy NTT to EVM Chains**

    ---

    Follow the guide to deploy and configure Wormhole's Native Token Transfers (NTT) for EVM chains.

    [:custom-arrow: Deploy NTT to EVM Chains](/docs/products/native-token-transfers/guides/deploy-to-evm/){target=\_blank}

</div>
