---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
---

# Native Token Transfers (NTT) Solana Deployment

## Install Dependencies

Ensure you have the following dependencies installed:

-  [Rust](https://www.rust-lang.org/tools/install){target=\_blank} 
-  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} **`{{ ntt.solana_cli_version }}`**
-  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`{{ ntt.anchor_version }}`**

!!!Warning
    Ensure you are using the above versions of Solana and Anchor. Running the deployment with a different version may cause issues.

## Deploy NTT

Create a new NTT project (or use an existing NTT project):

```bash
ntt new my-ntt-deployment
cd my-ntt-deployment
```

Initialize a new `deployment.json` file specifying the network:

=== "Testnet"

    ```bash
	ntt init Testnet
    ```

=== "Mainnet"

    ```bash
	ntt init Mainnet
    ```

## Deploy Your Solana Token

???- interface "Deploy an SPL Token"

    1. Generate a new Solana key pair to create a wallet:
    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

    2. Set Solana configuration to use the new key pair created in step 1:
    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
    ```

    3. Set the Solana configuration to use the default RPC URL for Devnet:
    ```bash
    solana config set -ud
    ```

    4. Request an airdrop of two SOL and check the balance:
    ```bash
    solana airdrop 2 & solana balance
    ```

    5. Install or update the SPL Token CLI:
    ```bash
    cargo install spl-token-cli
    ```

    6. Create a new token with the SPL Token CLI:
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

### Hub Chain Requirements

For hub chain deployments on Solana, the token can be either an SPL or Token2022 token. No additional configuration, such as setting the mint authority, is required for hub chain tokens.

For more detailed information, see the [Deployment Models](/docs/learn/messaging/native-token-transfers/deployment/){target=\_blank} page.

### Burning Mode Requirements

In burning mode, tokens require their mint authority to be assigned to the NTT program. This allows the NTT Manager to mint and burn tokens as needed during cross-chain transfers. 

All necessary steps for configuring burning mode, including mint authority setup, are explained in the sections below.

## Configuration and Deployment

### Generate NTT Program Key Pair

When you deploy a Solana program, you need to hardcode the program ID (a Pubkey) into the program code. The NTT CLI allows you to do this seamlessly.

Generate a new NTT program key pair using:

```bash
solana-keygen grind --starts-with ntt:1 --ignore-case
```

### Derive Token Authority

In this step, you'll derive the token authority Program Derived Address (PDA) of the newly generated NTT program ID:

```bash
ntt solana token-authority INSERT_YOUR_NTT_PROGRAM_KEY_PAIR
```

This script will output the derived PDA, which you will use in the next step.

### Set SPL Token Mint Authority

If deploying in `burning` mode, you'll set the SPL token mint authority to the newly generated token authority PDA:

```bash
spl-token authorize INSERT_TOKEN_ADDRESS mint INSERT_DERIVED_PDA
```

!!! note
    Please ensure that you are using Anchor CLI version `0.29.0`. Running the deployment with a different version may cause compatibility issues.


### Deploy NTT

Generate or export your payer key pair, then run:

```bash
ntt add-chain Solana --latest --mode burning --token INSERT_TOKEN_ADDRESS --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
```

!!! note
    The `add-chain` command accepts an optional `--solana-priority-fee` flag, which sets the priority fee in microlamports. The default is `50000`.

The NTT Solana program will then compile and deploy, returning the program ID.

### Configure NTT

The NTT CLI takes inspiration from [git](https://git-scm.com/){target=\_blank}. You can run:

- `ntt status` - checks whether your `deployment.json` file is consistent with what is on-chain
- `ntt pull` - syncs your `deployment.json` file with the on-chain configuration and sets up rate limits with the appropriate number of decimals, depending on the specific chain. For example:

    For Solana, the limits are set with 9 decimal places:
      ```json
      "inbound": {
          "Sepolia": "1000.000000000" // inbound limit from Sepolia to Solana
      }
      ```

    For Sepolia (Ethereum Testnet), the limits are set with 18 decimal places:
      ```json
      "inbound": {
          "Solana": "1000.000000000000000000" // inbound limit from Solana to Sepolia
      }
      ```

    This initial configuration ensures that the rate limits are correctly represented for each chain's token precision.

### Deploy NTT to Solana

You can now push the deployment to the Solana network, specifying the key pair that will cover the gas fees:

```bash
ntt push --payer INSERT_YOUR_KEYPAIR_JSON
```

By default, NTT transfers to Solana support manual relaying, which requires the user to perform a transaction on Solana to complete the transfer. UI components such as Wormhole Connect support this out of the box. For automatic Wormhole relaying support on Solana, [contact](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank} Wormhole contributors.
