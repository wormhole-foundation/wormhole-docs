---
title: MultiGov Deployment to Solana
description: Learn how to deploy the MultiGov Staking Program on Solana, including setup, funding, deployment, and configuration steps. 
---

# Deploy MultiGov on Solana  

This guide provides instructions on how to set up and deploy the **MultiGov Staking Program** on Solana. Before proceeding with the deployment, ensure that MultiGov aligns with your project’s governance needs by reviewing the system [architecture](/docs/learn/governance/architecture/){target=\_blank}.

Once your project setup is complete, follow this guide to configure, compile, and deploy the necessary Solana programs and supporting accounts. This deployment enables decentralized governance participation on Solana as a spoke chain within the MultiGov system.  

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

## Set Up the Deployer Account

For a successful deployment, you need a funded deployer account on Solana. This account will store the program and execute deployment transactions. 

In this section, you will create a new keypair, check the account balance, and ensure it has enough SOL to cover deployment costs. If needed, you can fund the account using different methods before deploying. 

### Generate a New Keypair  

To create a new keypair and save it to a file, run:  

```bash
solana-keygen new --outfile ./app/keypairs/deployer.json
```

### Check the Deployer Account Address  

To retrieve the public address of the newly created keypair, run:  

```bash
solana address -k ./app/keypairs/deployer.json
```

### Check the Deployer Account Balance  

To verify the current balance of the deployer account, run:  

```bash
solana balance -k ./app/keypairs/deployer.json
```

!!! important 
    When deploying the MultiGov Staking Program, the deployer account must have enough SOL to cover deployment costs and transaction fees.

    - 7.60219224 SOL for deployment costs
    - 0.00542 SOL for transaction fees

### Fund the Deployer Account  

If the account does not have enough SOL, use one of the following methods to add funds.  

???- interface "**Transfer SOL from Another Account**"  

    If you already have SOL in another account, transfer it using a wallet (Phantom, Solflare, etc.) or in the terminal:  

    ```bash
    solana transfer <deployer_account_address> <amount> --from /path/to/funder.json
    ```

???- interface "**Request an Airdrop (Devnet Only)**"  

    If deploying to Devnet, you can request free SOL: 

    ```bash
    solana airdrop 2 -k ./app/keypairs/deployer.json
    ```

???- interface "**Use a Solana Faucet (Devnet Only)**"  

    You can use online faucets to receive 10 free SOL:

    - [Solana Faucet](https://faucet.solana.com/){target=\_blank}

## Deploy the MultiGov Staking Program

With the deployer account set up and funded, you can deploy the MultiGov Staking Program to the Solana blockchain. This step involves deploying the program, verifying the deployment, and ensuring the necessary storage and metadata are correctly configured. Once the IDL is initialized, the program will be ready for further setup and interaction.

### Deploy the Program  

Once the deployer account is funded, deploy the MultiGov Staking Program using **Anchor**:  

```bash
anchor deploy --provider.cluster https://api.devnet.solana.com --provider.wallet ./app/keypairs/deployer.json
```

### Verify the Deployment  

After deployment, check if the program is successfully deployed by running:  

```bash
solana program show INSERT_PROGRAM_ID
```

### Extend Program Storage  

If the deployed program requires additional storage space for updates or functionality, extend the program storage using the following command:  

```bash
solana program extend INSERT_PROGRAM_ID 800000
```

### Initialize the IDL  

To associate an IDL file with the deployed program, run:  

```bash
anchor idl init --provider.cluster https://api.devnet.solana.com --filepath ./target/idl/staking.json INSERT_PROGRAM_ID
```

## Configure the Staking Program

The final step after deploying the MultiGov Staking Program is configuring it for proper operation. This includes running a series of deployment scripts to initialize key components and set important governance parameters. These steps ensure that staking, governance, and cross-chain communication function as expected.

### Run Deployment Scripts  

After deploying the program and initializing the IDL, execute the following scripts **in order** to set up the staking environment and necessary accounts.  

1. Initialize the MultiGov Staking Program with default settings:

    ```bash
    npx ts-node app/deploy/01_init_staking.ts
    ```

2. Create an Account Lookup Table (ALT) to optimize transaction processing:

    ```bash
    npx ts-node app/deploy/02_create_account_lookup_table.ts
    ```

3. Set up airlock accounts:

    ```bash
    npx ts-node app/deploy/03_create_airlock.ts
    ```

4. Deploy a metadata collector:

    ```bash
    npx ts-node app/deploy/04_create_spoke_metadata_collector.ts
    ```

5. Configure vote weight window lengths:

    ```bash
    npx ts-node app/deploy/05_initializeVoteWeightWindowLengths.ts
    ```

6. Deploy the message executor for handling governance messages:

    ```bash
    npx ts-node app/deploy/06_create_message_executor.ts
    ```

### Set MultiGov Staking Program Key Parameters  

When deploying MultiGov on Solana, several key parameters need to be set. Here are the most important configuration points:  

 - `maxCheckpointsAccountLimit` ++"u64"++ - the maximum number of checkpoints an account can have. For example, `654998` is used in production, while `15` might be used for testing
 - `hubChainId` `u16` - the chain ID of the hub network where proposals are primarily managed. For example, `10002` for Sepolia testnet
 - `hubProposalMetadata` ++"[u8; 20]"++ - an array of bytes representing the address of the Hub Proposal Metadata contract on Ethereum. This is used to identify proposals from the hub 
 - `voteWeightWindowLength` ++"u64"++ - specifies the length of the checkpoint window in seconds in which the minimum voting weight is taken. The window ends at the vote start for a proposal and begins at the vote start minus the vote weight window. The vote weight window helps solve problems such as manipulating votes in a chain 
 - `votingTokenMint` ++"Pubkey"++ - the mint address of the token used for voting  
 - `governanceAuthority` ++"Pubkey"++ - the account's public key that has the authority to govern the staking system. The `governanceAuthority` should not be the default Pubkey, as this would indicate an uninitialized or incorrectly configured setup
 - `vestingAdmin` ++"Pubkey"++ - the account's public key for managing vesting operations. The `vestingAdmin` should not be the default Pubkey, as this would indicate an uninitialized or incorrectly configured setup
 - `hubDispatcher` ++"Pubkey"++ - the Solana public key derived from an Ethereum address on the hub chain that dispatches messages to the spoke chains. This is crucial for ensuring that only authorized messages from the hub are executed on the spoke
