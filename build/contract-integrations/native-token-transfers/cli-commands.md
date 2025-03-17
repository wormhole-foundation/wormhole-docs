---
title: NTT CLI Commands
description: A comprehensive guide to the Native Token Transfers (NTT) CLI, detailing commands for managing token transfers across chains within the Wormhole ecosystem.
---

# NTT CLI Commands

## Introduction

The NTT Command-Line Interface (CLI) is a powerful tool for managing native token transfers across multiple blockchain networks within the Wormhole ecosystem. This page provides a comprehensive list of available commands, their descriptions, and examples to help you interact with and configure the NTT system effectively. Whether initializing deployments, updating configurations, or working with specific chains, the NTT CLI simplifies these operations through its intuitive commands.

If you haven't installed the NTT CLI yet, follow the [NTT Installation Guide](/docs/build/contract-integrations/native-token-transfers/deployment-process/installation/#installation){target=\_blank} to set it up before proceeding.

## Table of Commands

The following table lists the available NTT CLI commands, descriptions, and examples.

!!! note
    To explore detailed information about any NTT CLI command, including its options and examples, you can append `--help` to the command. This will display a comprehensive guide for the specific command.

### General Commands

| Command                                 | Description                                           | Examples                 |
|-----------------------------------------|-------------------------------------------------------|--------------------------|
| `ntt update`                            | update the NTT CLI                                    | `ntt update`             |
| `ntt new <path>`                        | create a new NTT project                              | `ntt new my-ntt-project` |
| `ntt add-chain <chain>`                 | add a chain to the deployment file                    | `ntt add-chain Ethereum --token 0x1234... --mode burning --latest`|
| `ntt upgrade <chain>`                   | upgrade the contract on a specific chain              | `ntt upgrade Solana --ver 1.1.0`|
| `ntt clone <network> <chain> <address>` | initialize a deployment file from an existing contract| `ntt clone Mainnet Solana Sol5678...`|
| `ntt init <network>`                    | initialize a deployment file                          | `ntt init devnet`        |
| `ntt pull`                              | pull the remote configuration                         | `ntt pull`               |
| `ntt push`                              | push the local configuration                          | `ntt push`               |
| `ntt status`                            | check the status of the deployment                    | `ntt status`             |

### Configuration Commands

| Command                                     | Description                            | Examples                            |
|---------------------------------------------|----------------------------------------|-------------------------------------|
| `ntt config set-chain <chain> <key> <value>`| set a configuration value for a chain  | `ntt config set-chain Ethereum scan_api_key`|
| `ntt config unset-chain <chain> <key>`      | unset a configuration value for a chain| `ntt config unset-chain Ethereum scan_api_key`|
| `ntt config get-chain <chain> <key>`        | get a configuration value for a chain  | `ntt config get-chain Ethereum scan_api_key`|

### Solana Commands

| Command                                       | Description                                             | Examples         |
|-----------------------------------------------|---------------------------------------------------------|------------------|
| `ntt solana key-base58 <keypair>`             | print private key in base58                             | `ntt solana key-base58 /path/to/keypair.json`|
| `ntt solana token-authority <programId>`      | print the token authority address for a given program ID| `ntt solana token-authority Sol1234...`|
| `ntt solana ata <mint> <owner> <tokenProgram>`| print the token authority address for a given program ID| `ntt solana ata Mint123... Owner123... token22`|
