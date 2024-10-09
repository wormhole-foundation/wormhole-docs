---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
---

# Native Token Transfers (NTT) Solana Deployment

## Install Dependencies

Ensure you have the following dependencies installed:

-  [Rust](https://www.rust-lang.org/tools/install){target=\_blank} 
-  [Solana](https://docs.solanalabs.com/cli/install){target=\_blank} v1.18.10
-  [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} v0.29.0

## Deploy NTT

Create a new NTT project (or use an existing NTT project):

```bash
ntt new my-ntt-deployment
cd my-ntt-deployment
```

Initialize a new `deployment.json` file, specifying the network:

=== "Testnet"

    ```bash
	ntt init Testnet
    ```

=== "Mainnet"

    ```bash
	ntt init Mainnet
    ```

## Deploy Your Solana Token

???- code "Deploy an SPL Token (Basic)"

    1. Generate a new Solana key pair to create a wallet:
    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

    2. Set Solana configuration to use the new key pair:
    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_CREATED_IN_STEP1
    ```

    3. Set the Solana configuration to use the default RPC URL for DevNet:
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

    6. Create a new token with the SPL Token CLI using the `token-2022` program:
    ```bash
    spl-token create-token
    ```

    7. Create a new account for the token:
    ```bash
    spl-token create-account INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6
    ```

    8. Mint `1000` tokens to the created account:
    ```bash
    spl-token mint INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6 1000
    ```

???- code "Deploy a Token with the Token-2022 Program (Advanced)"

    1. Generate a new Solana keypair in order to create a wallet:

    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

    2. Set Solana config to use the new keypair:
    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_CREATED_IN_STEP1
    ```

    3. Set the Solana configuration to use the default RPC URL for devnet:
    ```bash
    solana config set -ud
    ```

    4. Request an airdrop of 2 SOL and check the balance:
    ```bash
    solana airdrop 2 & solana balance
    ```

    5. Install or update the SPL Token CLI:
    ```bash
    cargo install spl-token-cli
    ```

    6. Create a new token with the SPL Token CLI using the token-2022 program:
    ```bash
    spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb 
    ```

    7. Create a new account for the token:
    ```bash
    spl-token create-account INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6 --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
    ```

    8. Mint 1000 tokens to the created account:
    ```bash
    spl-token mint INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6 1000
    ```


!!! note
    NTT versions `>=v2.0.0+solana` support SPL tokens with transfer hooks.

## Configuration and Deployment

#### Generate NTT Program Key Pair

When you deploy a Solana program, you need to hardcode the program ID (a Pubkey) into the program code. The NTT CLI allows you to do this seamlessly.

Generate a new NTT program key pair using:

```bash
solana-keygen grind --starts-with ntt:1 --ignore-case
```

#### Derive Token Authority

In this step, you'll derive the token authority Program Derived Address (PDA) of the newly generated NTT program ID:

```bash
ntt solana token-authority INSERT_YOUR_NTT_PROGRAM_KEY_PAIR
```

#### Set SPL Token Mint Authority

In this step, you'll set SPL token mint authority to the newly generated token authority PDA:

```bash
spl-token authorize INSERT_TOKEN_ADDRESS mint INSERT_DERIVED_PDA
```

If deploying to Solana in `burning` mode, set the mint authority for your SPL token to the NTT program ID you generated in the previous step.

### Deploy NTT

Generate or export your payer key pair, then run:

```bash
ntt add-chain Solana --latest --mode burning --token INSERT_YOUR_SPL_TOKEN --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
```

The NTT Solana program will then compile and deploy.

### Configure NTT

The NTT CLI takes inspiration from [git](https://git-scm.com/){target=\_blank}. You can run:

- `ntt status` - checks whether your `deployment.json` file is consistent with what is on-chain
- `ntt pull` - syncs your `deployment.json` file with the on-chain configuration and set up rate limits with the appropriate number of decimals, depending on the specific chain. For example:

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

    This initial configuration ensures that the rate limits are correctly represented for each chain's token precision

### Deploy

You can now push the deployment to the Solana network, specifying the key pair that will cover the gas fees:

```bash
ntt push --payer INSERT_YOUR_KEYPAIR_JSON
```

By default, NTT transfers to Solana support manual relaying, which requires the user to perform a transaction on Solana to complete the transfer. UI components such as Wormhole Connect support this out of the box. For automatic Wormhole relaying support on Solana, [contact](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank} Wormhole contributors.
