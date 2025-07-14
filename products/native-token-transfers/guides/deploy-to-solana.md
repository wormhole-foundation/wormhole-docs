---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole's Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
categories: NTT, Transfer
---

# Deploy NTT on Solana

[Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank} enable seamless multichain transfers of SPL tokens on Solana using Wormhole's messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on Solana, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in hub-and-spoke or burn-and-mint mode. By the end, a fully deployed NTT will be set up, allowing your token to transfer between Solana and other supported chains.

## Prerequisites

Before deploying NTT on Solana, ensure you have the following:

- [Rust](https://www.rust-lang.org/tools/install){target=\_blank} installed 
- The correct versions of the Solana CLI and Anchor installed, depending on your NTT version:

    === "v3"
        | Dependency | Version |
        |------------|---------|
        | [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} | `{{ ntt.solana_cli_version }}` |
        | [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} | `{{ ntt.anchor_version }}` |

    === "v2/v1"
        | Dependency | Version |
        |------------|---------|
        | [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} | `v1.18.10` |
        | [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} | `v0.29.0` |


Use the Solana and Anchor versions listed above to avoid compatibility issues while following this guide.

## Overview of the Deployment Process

Deploying NTT with the CLI on Solana follows a structured process:

1. **Choose your token setup**:

     - **Use an existing SPL token** - if your token is already deployed on Solana, you can skip token creation and move directly to the [Set Up NTT](#set-up-ntt) section
     - **Create a new SPL token** - if you don't already have an SPL token deployed, you'll need to deploy and configure it on Solana before integrating with Wormhole's NTT

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

                === "Testnet (Solana's Devnet)"
                    ```bash
                    solana config set -ud
                    ```
                
                !!! note
                    Solana's official testnet cluster is not supported for token creation or deployment with NTT. You must use the Solana devnet instead.

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

2. **Choose your deployment model**:

    - **Hub-and-spoke** - tokens are locked on a hub chain and minted on destination spoke chains. Since the token supply remains controlled by the hub chain, no changes to the minting authority are required
    - **Burn-and-mint** - tokens are burned on the source chain and minted on the destination chain. This requires transferring the SPL token's minting authority to the Program Derived Address (PDA) controlled by the NTT program

3. **Deploy and configure NTT** - use the NTT CLI to initialize and deploy the NTT program, specifying your SPL token and deployment mode

![Solana NTT deployment diagram](/docs/images/products/native-token-transfers/guides/solana/ntt-solana-guide-1.webp)

Following this process, your token will fully integrate with NTT, enabling seamless transfers between Solana and other chains.

By default, NTT transfers to Solana require manual [relaying](/docs/protocol/infrastructure/relayer/){target=\_blank}, meaning users must complete a transaction on Solana to finalize the transfer. For automatic relaying, where transactions are completed without user intervention, additional setup is required. [Contact Wormhole contributors](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank} to enable automatic relaying support for your deployment.

## Set Up NTT

To integrate your token with NTT on Solana, you must initialize the deployment and configure its parameters. This process sets up the required contracts and may generate key pairs if they don't exist. These key pairs are used to sign transactions and authorize actions within the NTT deployment.

The [NTT CLI](/docs/products/native-token-transfers/reference/cli-commands/){target=\_blank} manages deployments, configures settings, and interacts with the NTT system. Follow these steps to set up NTT using the CLI tool:

???- interface "Install the NTT CLI and Scaffold a New Project"

    --8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md'

        === "Testnet (Solana's Devnet)"

            ```bash
            ntt init Testnet
            ```

!!! note
    When deploying NTT to Solana in `Testnet` mode, you must use [**Devnet tokens**](https://faucet.solana.com/){target=\_blank}. Solana's official testnet cluster is not supported for token creation or deployment in NTT.

### Generate an NTT Program Key Pair

Create a unique key pair for the NTT program:

```bash
solana-keygen grind --starts-with ntt:1 --ignore-case
```

### Set Mint Authority

If you use burn-and-mint mode, follow these steps to enable the NTT program to mint tokens on Solana. This involves deriving the PDA as the token authority and updating the SPL token's minting permissions.

For hub-and-spoke and Solana as the hubchain skip this section and proceed to [Deploy and Configure NTT](#deploy-and-configure-ntt), otherwise follow the burn-and-mint instructions below for Solana as a spoke.

Before updating the mint authority, you must create metadata for your SPL token. You can visit this repository to see an example of [how to create metadata for your SPL token](https://github.com/wormhole-foundation/demo-metaplex-metadata/blob/main/src/token-metadata.ts){target=\_blank}.


Options to set the mint authority for your SPL token:

**For undeployed programs:**

- **Set to token authority PDA:**
```bash
ntt solana set-mint-authority --token INSERT_TOKEN_ADDRESS --manager INSERT_NTT_PROGRAM_ADDRESS --payer INSERT_KEYPAIR_JSON
```

- **Set to SPL Multisig:**
    1. Create valid SPL Multisig:
    ```bash
    ntt solana create-spl-multisig INSERT_MINTER_PUBKEY_1 INSERT_MINTER_PUBKEY_2 ... --token INSERT_TOKEN_ADDRESS --manager INSERT_NTT_PROGRAM_ADDRESS --payer INSERT_KEYPAIR_JSON
    ```

    2. Set to created SPL Multisig:
    ```bash
    ntt solana set-mint-authority --token INSERT_TOKEN_ADDRESS --manager INSERT_NTT_PROGRAM_ADDRESS --multisig INSERT_MULTISIG_ADDRESS --payer INSERT_KEYPAIR_JSON
    ```

**For deployed programs:**

- **Set to token authority PDA:**

```bash
ntt solana set-mint-authority --payer INSERT_KEYPAIR_JSON
```

!!! note
    Check out [this utility script](https://github.com/wormhole-foundation/demo-ntt-token-mint-authority-transfer/tree/main){target=\_blank} for transferring token mint authority out of NTT.

## Deploy and Configure NTT

!!! warning
    If deploying to Solana mainnet, you must use a custom RPC. See how to [set it up in your project](/docs/products/native-token-transfers/faqs/#how-can-i-specify-a-custom-rpc-for-ntt){target=\_blank} using an `overrides.json` file. For optimal performance, consider using a staked RPC connection from either Triton or Helius.

After setting up your deployment, finalize the configuration and deploy the NTT program on Solana by following these steps:

1. **Deploy NTT to Solana** - run the appropriate command based on your deployment mode:

    === "Burn-and-Mint"

        ```bash
        ntt add-chain Solana --latest --mode burning --token INSERT_TOKEN_ADDRESS --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
        ```

    === "Hub-and-Spoke"

        ```bash
        ntt add-chain Solana --latest --mode locking --token INSERT_TOKEN_ADDRESS --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
        ```

    You can optionally add `--solana-priority-fee` to the script to increase the priority fee in microlamports. The default is `50000`.

2. **Verify deployment status** - after deployment, check if your `deployment.json` file matches the on-chain configuration using the following command:

    ```bash
    ntt status
    ```

    If needed, sync your local configuration with the on-chain state:

    ```bash
    ntt pull
    ```

3. **Configure inbound and outbound rate limits** - by default, the inbound and outbound limits are set to `0` and must be updated before deployment. For EVM chains, values must be set using 18 decimals, while Solana uses nine decimals. 

    Open your `deployment.json` file and adjust the values based on your use case:  

    ```json
    "inbound": {
        "Sepolia": "1000.000000000" // inbound limit from Sepolia to Solana
    },
    "outbound": {
        "Sepolia": "1000.000000000" // outbound limit from Solana to Sepolia
    }
    ```

4. **Push the final deployment** - once rate limits are set, push the deployment to Solana using the specified key pair to cover gas fees

    ```bash
    ntt push --payer INSERT_YOUR_KEYPAIR_JSON
    ```

### Recovering Rent for Failed Solana Deployments

Failed Solana deployments don't result in lost SOL. Instead, SOL may be locked in deployment buffer accounts that persist after interruptions. To recover these funds, refer to the [Solana program deployment guide](https://solana.com/docs/programs/deploying#program-buffer-accounts){target=\_blank} for instructions on identifying and closing these buffer accounts.

## Where to Go Next

<div class="grid cards" markdown>

-   :octicons-globe-16:{ .lg .middle } **Deploy NTT on EVM Chains**  

    ---  

    After deploying NTT on Solana, deploy and integrate it on EVM chains to enable seamless multichain transfers.  

    [:custom-arrow: Deploy NTT on EVM Chains](/docs/products/native-token-transfers/guides/deploy-to-evm/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Test Your Deployment**

    ---

    Follow the NTT Post Deployment Guide for integration examples and testing instructions.

    [:custom-arrow: Test Your NTT deployment](/docs/products/native-token-transfers/guides/post-deployment/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Add NTT to Your dApp**

    ---

    Configure Wormhole Connect, a plug-and-play bridging UI, to enable multichain transfers for your token.

    [:custom-arrow: Use Connect to Integrate NTT](/docs/products/connect/overview/){target=\_blank}

-   :octicons-question-16:{ .lg .middle } **View FAQs**

    ---

    Find answers to common questions about NTT.

    [:custom-arrow: View FAQs](/docs/products/native-token-transfers/faqs){target=\_blank}

</div>
