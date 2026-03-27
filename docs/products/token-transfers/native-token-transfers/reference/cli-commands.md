---
title: NTT CLI Commands
description: A comprehensive guide to the Native Token Transfers (NTT) CLI, detailing commands for managing token transfers across chains within the Wormhole ecosystem.
categories: NTT, Transfer
---

# NTT CLI Commands

The NTT Command-Line Interface (CLI) is a powerful tool for managing native token transfers across multiple blockchain networks within the Wormhole ecosystem. This page provides a comprehensive list of available commands, their descriptions, and examples to help you interact with and configure the NTT system effectively. Whether initializing deployments, updating configurations, or working with specific chains, the NTT CLI simplifies these operations through its intuitive commands.

If you haven't installed the NTT CLI yet, follow the [NTT Installation](/docs/products/token-transfers/native-token-transfers/get-started/#install-ntt-cli){target=\_blank} instructions to set it up before proceeding.

## Table of Commands

The following table lists the available NTT CLI commands, descriptions, and examples.

To explore detailed information about any NTT CLI command, including its options and examples, you can append `--help` to the command. This will display a comprehensive guide for the specific command.

### General Commands

| Command                                 | Description                                                                                                                                                               | Example                                                                                                                                                                                                    |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ntt update`                            | Update the NTT CLI.                                                                                                                                                       | `ntt update`                                                                                                                                                                                               |
| `ntt new <path>`                        | Create a new NTT project.                                                                                                                                                 | `ntt new my-ntt-project`                                                                                                                                                                                   |
| `ntt add-chain <chain>`                 | Add a chain to the deployment file. Supports `--manager-variant` (`standard`, `noRateLimiting`, `wethUnwrap`) for EVM chains.                                             | `ntt add-chain Ethereum --token 0x1234... --mode burning --latest --manager-variant standard`                                                                                                              |
| `ntt upgrade <chain>`                   | Upgrade the contract on a specific chain. Supports `--manager-variant` for EVM chains.                                                                                    | `ntt upgrade Solana --ver 1.1.0`                                                                                                                                                                           |
| `ntt clone <network> <chain> <address>` | Initialize a deployment file from an existing contract.                                                                                                                   | `ntt clone Mainnet Solana Sol5678...`                                                                                                                                                                      |
| `ntt init <network>`                    | Initialize a deployment file.                                                                                                                                             | `ntt init devnet`                                                                                                                                                                                          |
| `ntt pull`                              | Pull the remote configuration.                                                                                                                                            | `ntt pull`                                                                                                                                                                                                 |
| `ntt push`                              | Push the local configuration.                                                                                                                                             | `ntt push`                                                                                                                                                                                                 |
| `ntt status`                            | Check the status of the deployment.                                                                                                                                       | `ntt status`                                                                                                                                                                                               |
| `ntt set-mint-authority`                | Set token mint authority to token authority (or valid SPL Multisig if `--multisig` flag is provided).                                                                     | `ntt set-mint-authority --chain Solana --token Sol1234... --manager Sol3456... --payer <SOLANA_KEYPAIR_PATH>`                                                                                              |
| `ntt transfer-ownership <chain>`        | [Transfer NTT manager ownership](/docs/products/token-transfers/native-token-transfers/guides/transfer-ownership/#evm){target=\_blank} to a new wallet (EVM chains only). | `ntt transfer-ownership Ethereum --destination 0x1234...`                                                                                                                                                  |
| `ntt token-transfer`                    | Transfer tokens between chains using the NTT protocol.                                                                                                                    | `ntt token-transfer --network Testnet --source-chain Sepolia --destination-chain Solana --amount 0.5 --destination-address 9yZwWH... --deployment-path ./deployment.json --destination-msg-value 20000000` |

### Advanced Custom Finality

!!! warning 
    Custom finality is an advanced feature. Wormhole Contributors recommend using this with caution. 

The `ntt add-chain` command supports an optional flag that enables custom consistency levels for EVM chains. By default, NTT deployments use the `finalized` consistency level.

Choosing a level of finality other than finalized on EVM chains exposes you to [re-org risk](https://www.alchemy.com/overviews/what-is-a-reorg){target=\_blank}. This is especially dangerous when moving assets cross-chain, because assets released or minted on the destination chain may not have been burned or locked on the source chain.

To select a custom finality level, Wormhole Contributors recommend consulting information on forked blocks in blockchain explorers, focusing on the “ReorgDepth” column.

By proceeding, you affirm that you understand and are comfortable with the risks of setting a custom finality level, and you understand the re-org/rollback risks of Custom finality, accept sole responsibility, and agree that the Wormhole Parties have no liability for losses arising from your selection.

### Configuration Commands

| Command                                      | Description                              | Example                                        |
|----------------------------------------------|------------------------------------------|------------------------------------------------|
| `ntt config set-chain <chain> <key> <value>` | Set a configuration value for a chain.   | `ntt config set-chain Ethereum scan_api_key`   |
| `ntt config unset-chain <chain> <key>`       | Unset a configuration value for a chain. | `ntt config unset-chain Ethereum scan_api_key` |
| `ntt config get-chain <chain> <key>`         | Get a configuration value for a chain.   | `ntt config get-chain Ethereum scan_api_key`   |

### Hyperliquid Commands

| Command                          | Description                                                                                               | Example                                  |
|----------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------|
| `ntt hype link`                  | Link a HyperCore spot token to its HyperEVM ERC-20 contract.                                             | `ntt hype link --token-index 1591`       |
| `ntt hype bridge-in <amount>`    | Bridge tokens from HyperEVM into HyperCore via the asset bridge.                                         | `ntt hype bridge-in 1.0`                 |
| `ntt hype bridge-out <amount>`   | Bridge tokens from HyperCore back to HyperEVM via spotSend.                                              | `ntt hype bridge-out 1.0`               |
| `ntt hype status`                | Display HyperCore token index, asset bridge address, and token identifier for the current deployment.     | `ntt hype status`                        |

For a complete walkthrough on using these commands, see the [Deploy to Hyperliquid](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-hyperliquid/){target=\_blank} guide.

### Solana Commands

| Command                                        | Description                                               | Example                                         |
|------------------------------------------------|-----------------------------------------------------------|-------------------------------------------------|
| `ntt solana key-base58 <keypair>`              | Print private key in base58.                              | `ntt solana key-base58 /path/to/keypair.json`   |
| `ntt solana token-authority <programId>`       | Print the token authority address for a given program ID. | `ntt solana token-authority Sol1234...`         |
| `ntt solana ata <mint> <owner> <tokenProgram>` | Print the token authority address for a given program ID. | `ntt solana ata Mint123... Owner123... token22` |

## Next Steps

<div class="grid cards" markdown>


-   :octicons-gear-16:{ .lg .middle } **Configure NTT**

    ---

    Find information on configuring NTT, including guidance on setting Owner and Pauser access control roles and management of rate-limiting.

    [:custom-arrow: Configure your NTT deployment](/docs/products/token-transfers/native-token-transfers/configuration/access-control/)

-   :octicons-question-16:{ .lg .middle } **NTT FAQs**

    ---

    Frequently asked questions about Wormhole Native Token Transfers, including cross-chain lending, SDK usage, custom RPCs, and integration challenges.

    [:custom-arrow: Check out the FAQs](/docs/products/token-transfers/native-token-transfers/faqs/)

</div>
