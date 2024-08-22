---
title: Native Token Transfers Solana Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for Solana, including setup, token compatibility, mint/burn modes, and CLI usage.
---

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

=== "TestNet"

    ```bash
	ntt init Testnet
    ```

=== "MainNet"

    ```bash
	ntt init Mainnet
    ```

## Deploy your SPL Token

If you haven't already, deploy your SPL token to Solana.

1. Generate a new Solana keypair to create a wallet:
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
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb 
```

7. Create a new account for the token:
```bash
spl-token create-account INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6 --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

8. Mint `1000` tokens to the created account:
```bash
spl-token mint INSERT_ADDRESS_OF_TOKEN_CREATED_IN_STEP6 1000
```

NTT versions `>=v2.0.0+solana` support SPL tokens with transfer hooks.

## Configuration and Deployment

#### Generate NTT Program Keypair

When you deploy a Solana program, you need to hardcode the program ID (a pubkey) into the program code. The NTT CLI allows you to do this seamlessly.

Generate a new NTT program keypair using:

```bash
solana-keygen grind --starts-with ntt:1 --ignore-case
```

#### Derive Token Authority

In this step, you'll derive the token authority PDA of the newly generated NTT program ID:

```bash
ntt solana token-authority INSERT-YOUR-NTT-PROGRAM-KEYPAIR
```

#### Set SPL Token Mint Authority

In this step, you'll set SPL token mint authority to the newly generated token authority PDA:

```bash
spl-token authorize INSERT-TOKEN-ADDRESS mint INSERT-DERIVED-PDA
```

If deploying to Solana in `burning` mode, set the mint authority for your SPL token to the NTT program ID you generated in the previous step.

### Deploy NTT

Generate or export your payer keypair, then run:

```bash
ntt add-chain Solana --latest --mode burning --token INSERT_YOUR_SPL_TOKEN --payer INSERT_YOUR_KEYPAIR_JSON --program-key INSERT_YOUR_NTT_PROGRAM_KEYPAIR_JSON
```

The NTT Solana program will then compile and deploy.

### Configure NTT

As with other deployments, run the following commands to ensure that the on-chain configuration is correct and your local `deployment.json` file is synced with the on-chain state:

- `ntt status`
- `ntt pull`

### Deploy

You can now push the deployment to the Solana network, specifying the Keypair that will cover the gas fees:

```bash
ntt push --payer INSERT_YOUR_KEYPAIR_JSON
```

By default, NTT transfers to Solana support manual relaying, which requires the user to perform a transaction on Solana to complete the transfer. UI components such as Wormhole Connect support this out of the box. For automatic relaying support on Solana, [contact](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank} Wormhole contributors.