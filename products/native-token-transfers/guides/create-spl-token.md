---
title: Create and Mint Solana SPL Tokens
description: Step-by-step guide to create and mint Solana SPL tokens, and prepare them for integration with Wormhole's Native Token Transfers (NTT).
categories: NTT, Transfer
---

# Create and Mint Solana SPL Tokens

This guide walks you through the process of creating and minting a new SPL token on Solana for use with Wormhole's [Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank}. If your project doesn't already have a token deployed, start here before setting up your NTT deployment.

You will generate a wallet, configure the Solana CLI, create the token, and mint an initial supply. Once complete, your token will be ready to integrate with NTT using either the burn-and-mint or hub-and-spoke model.

## Prerequisites

Before creating and minting a Solana SPL token, make sure the following tools are installed:

-  [Rust](https://www.rust-lang.org/tools/install){target=\_blank} 
-  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} **`{{ ntt.solana_cli_version }}`**
-  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`{{ ntt.anchor_version }}`**

## Steps to Create and Mint a Token

Follow the steps below to create a new SPL token and mint an initial supply. If you already have an SPL token deployed, you can skip this guide and proceed to [Deploy Native Token Transfers on Solana](/docs/products/native-token-transfers/guides/deploy-to-solana/){target=\_blank}.

1. **Generate a Solana key pair**: Run the following command to create a new wallet.

    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

2. **Set Solana configuration**: Configure the Solana CLI to use the generated key pair using the following command.

    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
    ```

3. **Select an RPC URL**: Configure Solana to use the appropriate network using one of the following commands.

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

4. **Fund your wallet**: Ensure you have enough SOL to create a token. If deploying on devnet, request an airdrop with the following commands.

    ```bash
    solana airdrop 2
    solana balance
    ```

5. **Install SPL Token CLI**: Install or update the required [CLI tool](https://spl.solana.com/token){target=\_blank}.

    ```bash
    cargo install spl-token-cli
    ```

6. **Create a new SPL token**: Initialize the token on Solana.

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
    NTT versions `>=v2.0.0+solana` support SPL tokens with [transfer hooks](https://spl.solana.com/transfer-hook-interface){target=\_blank}.

## Where to Go Next

<div class="grid cards" markdown>

-   :octicons-globe-16:{ .lg .middle } **Deploy NTT on Solana**  

    ---  

    Now that your SPL token is live, connect it to Wormhole using the NTT protocol on Solana.

    [:custom-arrow: Deploy NTT on Solana](/docs/products/native-token-transfers/guides/deploy-to-solana/){target=\_blank}

</div>