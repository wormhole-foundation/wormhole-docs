---
title: Get Started with NTT
description: NTT enables cross-chain token movement without wrapping. Install the CLI, deploy test tokens, and scaffold a project to integrate NTT into your app.
categories: NTT, Transfer
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
    --8<-- 'text/products/native-token-transfers/get-started/deploy-erc20.md'

???- interface "Create and Mint an SPL Token"
    --8<-- 'text/products/native-token-transfers/get-started/deploy-spl.md'

???- interface "Create and Deploy a Sui Token"
    --8<-- 'text/products/native-token-transfers/get-started/deploy-sui.md'

## Install NTT CLI

The NTT CLI is recommended to deploy and manage your cross-chain token configuration.

1. Run the installation commands in your terminal:

--8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md:3:5'

2. Verify the NTT CLI is installed:

--8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md:9:11'

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

You have scaffolded your NTT project and initialized the configuration file. Next, follow the appropriate guide below to configure your supported chains and deploy NTT contracts.

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Deploy to EVM Chains**

    ---

    Learn how to deploy NTT on EVM-compatible chains.

    [:custom-arrow: Get Started](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-evm/)

-   :octicons-tools-16:{ .lg .middle } **Deploy to SVM Chains**

    ---

    Follow the guide to deploy and configure NTT for SVM chains.

    [:custom-arrow: Get Started](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-solana/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Deploy to Sui**

    ---

    Learn how to deploy NTT to Sui.

    [:custom-arrow: Get Started](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-sui/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Wormhole Dev Arena**

    ---

    A structured learning hub with hands-on tutorials across the Wormhole ecosystem.

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/){target=\_blank}

</div>

