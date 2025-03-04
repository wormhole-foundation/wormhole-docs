---
title: MultiGov Deployment to Solana
description: 
---

# Deploy MultiGov on Solana  

This guide provides instructions to set up and deploy the **MultiGov Staking Program** on Solana. Before proceeding with the deployment, ensure that MultiGov aligns with your project’s governance needs by reviewing the system [architecture](/docs/learn/governance/architecture/){target=\_blank}.  

Once your project setup is complete, follow this guide to configure, compile, and deploy the necessary **Solana programs** and supporting accounts. This deployment enables **decentralized governance participation** on Solana as a spoke chain within the **MultiGov system**.  

## Prerequisites 

To deploy MultiGov on Solana, ensure you have the following installed:  

 - Install [Git](https://git-scm.com/downloads){target=\_blank}  
 - Install [Node.js](https://nodejs.org/){target=\_blank} **`v20.10.0`**
 - Install [Solana CLI](https://docs.solana.com/cli/install-solana-cli){target=\_blank} **`v1.18.20`**
 - Install [Anchor](https://www.anchor-lang.com/docs/installation){target=\_blank} **`v0.30.1`**
 - Install [Rust](https://www.rust-lang.org/tools/install){target=\_blank} **`v1.80.1`**
 - Install [Docker](https://www.docker.com/get-started/){target=\_blank}
 - Clone the repository:  
    ```bash
    git clone https://github.com/wormhole-foundation/multigov.git  
    cd multigov/solana/
    ```

## Build the Project

To create a verifiable build of the MultiGov Staking Program, run the following command:    

```bash
./scripts/build_verifiable_staking_program.sh
```

Once the build is complete, the compiled artifacts will be available in the `target` folder.

## Generate a New Keypair  

To create a new keypair and save it to a file, run:  

```bash
solana-keygen new --outfile ./app/keypairs/deployer.json
```

## Minimum Required Balance
When deploying the MultiGov Staking Program, the deployer account must have enough SOL to cover deployment costs and transaction fees.

 - 7.60219224 SOL for deployment costs
 - 0.00542 SOL for transaction fees

## Check the Deployer Account Address  

To retrieve the public address of the newly created keypair, run:  

```bash
solana address -k ./app/keypairs/deployer.json
```

## Check the Deployer Account Balance  

To verify the current balance of the deployer account, run:  

```bash
solana balance -k ./app/keypairs/deployer.json
```

## Fund the Deployer Account  

If the account does not have enough SOL, use one of the following methods to add funds.  

???- tip "**Transfer SOL from Another Account**"  

    If you already have SOL in another account, transfer it using a wallet (Phantom, Solflare, etc.) or in the terminal:  

    ```bash
    solana transfer <deployer_account_address> <amount> --from /path/to/funder.json
    ```

???- tip "**Request an Airdrop (Devnet Only)**"  

    If deploying to Devnet, you can request free SOL: 

    ```bash
    solana airdrop 2 -k ./app/keypairs/deployer.json
    ```

???- tip "**Use a Solana Faucet (Devnet Only)**"  

    You can use online faucets to receive free 10 SOL:

    [Solana Faucet](https://faucet.solana.com/){target=\_blank}

