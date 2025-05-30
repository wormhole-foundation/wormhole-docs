---
title: Wormhole CLI
description: Learn how to install and use the Wormhole CLI, including commands and examples for managing multichain deployments, generating VAAs, and querying contract info.
categories: Solidity-SDK, Typescript-SDK
---

# Wormhole CLI

This tool is a command-line interface to Wormhole, allowing you to perform various actions, such as querying a transaction's status or submitting token transfers.

## Installation

Clone the repository and change directories to the appropriate directory:

```bash
git clone https://github.com/wormhole-foundation/wormhole &&
cd wormhole/clients/js
```

Build and install the CLI tool:

```bash
make install
```

This installs two binaries, `worm-fetch-governance` and `worm` on your `$PATH`. To use `worm`, set up `$HOME/.wormhole/.env` with your private keys, based on `.env.sample` in this folder.

## Usage

You can interact with the Wormhole CLI by typing `worm` and including the `command` and any necessary subcommands and parameters.  

| Command                                                                                                                  | Description                                                                                                     |
|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `worm aptos INSERT_COMMAND`                                                                                              | Aptos utilities                                                                                                 |
| `worm edit-vaa INSERT_COMMAND`                                                                                           | Edits or generates a VAA                                                                                        |
| `worm evm INSERT_COMMAND`                                                                                                | EVM utilities                                                                                                   |
| `worm generate INSERT_COMMAND`                                                                                           | Generate VAAs (Devnet and Testnet only)                                                                         |
| `worm info INSERT_COMMAND`                                                                                               | Contract, chain, RPC, and address information utilities                                                         |
| `worm near INSERT_NETWORK, INSERT_ACCOUNT`                                                                               | NEAR utilities                                                                                                  |
| `worm parse INSERT_VAA`                                                                                                  | Parse a VAA (can be in either hex or base64 format)                                                             |
| `worm recover INSERT_DIGEST INSERT_SIGNATURE`                                                                            | Recover an address from a signature                                                                             |
| `worm status INSERT_NETWORK, INSERT_CHAIN, INSERT_TXN_HASH`                                                              | Prints information about the automatic delivery initiated on the specified network, chain, and transaction hash |
| `worm submit INSERT_VAA`                                                                                                 | Execute a VAA                                                                                                   |
| `worm sui INSERT_COMMAND`                                                                                                | Sui utilities                                                                                                   |
| `worm transfer INSERT_SOURCE_CHAIN, INSERT_DESTINATION_CHAIN, INSERT_DESTINATION_ADDRESS, INSERT_AMOUNT, INSERT_NETWORK` | Transfers a token                                                                                               |
| `worm verify-vaa INSERT_VAA, INSERT_NETWORK`                                                                             | Verifies a VAA by querying the Core Contract on Ethereum                                                        |

You can also refer to the below options, available with all `worm` commands:

```bash
Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### Subcommands

??? interface "Aptos"
    ```bash
    --8<-- 'code/tools/cli/get-started/aptos.txt'
    ```

??? interface "Edit VAA"
    ```bash
    --8<-- 'code/tools/cli/get-started/edit-vaa.txt'
    ```

??? interface "EVM"
    ```bash
    --8<-- 'code/tools/cli/get-started/evm.txt'
    ```

??? interface "Generate"
    ```bash
    --8<-- 'code/tools/cli/get-started/generate.txt'
    ```

??? interface "Info"
    ```bash
    --8<-- 'code/tools/cli/get-started/info.txt'
    ```

??? interface "NEAR"
    ```bash
    --8<-- 'code/tools/cli/get-started/near.txt'
    ```

??? interface "Parse"
    ```bash
    --8<-- 'code/tools/cli/get-started/parse.txt'
    ```

??? interface "Recover"
    ```bash
    --8<-- 'code/tools/cli/get-started/recover.txt'
    ```

??? interface "Status"
    ```bash
    --8<-- 'code/tools/cli/get-started/status.txt'
    ```

??? interface "Submit"
    ```bash
    --8<-- 'code/tools/cli/get-started/submit.txt'
    ```

??? interface "Sui"
    ```bash
    --8<-- 'code/tools/cli/get-started/sui.txt'
    ```

??? interface "Transfer"
    ```bash
    --8<-- 'code/tools/cli/get-started/transfer.txt'
    ```

??? interface "Verify VAA"
    ```bash
    --8<-- 'code/tools/cli/get-started/verify-vaa.txt'
    ```

## Examples

### Generate a VAA

Use `generate` to create VAAs for testing. For example, use the following command to create an NFT bridge registration VAA:

```bash
--8<-- 'code/tools/cli/get-started/vaa-generation-example.txt'
```

The below example generates a token attestation VAA:

```bash
--8<-- 'code/tools/cli/get-started/token-attestation-vaa.txt'
```

### Parse a VAA

Use `parse` to parse a VAA into JSON:

```bash
worm parse $(worm-fetch-governance 13940208096455381020)
```

This example will fetch governance VAA `13940208096455381020` and print it as JSON: 

```bash
--8<-- 'code/tools/cli/get-started/fetch-vaa-example.txt'
```

### Submit VAAs

Use `submit` to submit a VAA to a chain. It first parses the VAA and determines the destination chain and module. For example, a contract upgrade contains both the target chain and module, so the only required argument is the network moniker (`mainnet` or `testnet`):

```bash
worm submit $(cat my-nft-registration.txt) --network mainnet
```

The script will ask you to specify the target chain for VAAs that don't have a specific target chain (like registrations or Guardian set upgrades). For example, to submit a Guardian set upgrade on all chains, simply run:

```bash
--8<-- 'code/tools/cli/get-started/guardian-upgrade.txt'
```

The VAA payload type (Guardian set upgrade) specifies that this VAA should go to the core bridge, and the tool directs it there.

### Fetch Contract Information

To get info about a contract (only EVM supported at this time), use the following command:

```bash
worm evm info -c bsc -n mainnet -m TokenBridge
```

Running this command generates the following output:

```bash
--8<-- 'code/tools/cli/get-started/info-response.txt'
```

You can get the contract address for a module as follows:

```bash
worm info rpc INSERT_NETWORK INSERT_CHAIN INSERT_MODULE
```

To get the contract address for `NFTBridge` on BSC Mainnet, for example, you can provide the following command:

```bash
worm info contract mainnet bsc NFTBridge
```

### Fetch Chain Information

You can get the RPC address for a chain as follows:

```bash
worm info rpc INSERT_NETWORK INSERT_CHAIN
```

To get the RPC address for BSC Mainnet, for example, you can provide the following command: 

```bash
worm info rpc mainnet bsc
```
