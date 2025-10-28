---
title: Wormhole CLI
description: Learn how to install and use the Wormhole CLI, including commands and examples for managing multichain deployments, generating VAAs, and querying contract info.
categories: Solidity-SDK, Typescript-SDK
url: https://wormhole.com/docs/tools/cli/get-started/
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

| Command                                                                                                                  | Description                                                                                                      |
|--------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `worm aptos INSERT_COMMAND`                                                                                              | Aptos utilities.                                                                                                 |
| `worm edit-vaa INSERT_COMMAND`                                                                                           | Edits or generates a VAA.                                                                                        |
| `worm evm INSERT_COMMAND`                                                                                                | EVM utilities.                                                                                                   |
| `worm generate INSERT_COMMAND`                                                                                           | Generate VAAs (devnet and testnet only).                                                                         |
| `worm info INSERT_COMMAND`                                                                                               | Contract, chain, RPC, and address information utilities.                                                         |
| `worm near INSERT_NETWORK, INSERT_ACCOUNT`                                                                               | NEAR utilities.                                                                                                  |
| `worm parse INSERT_VAA`                                                                                                  | Parse a VAA (can be in either hex or base64 format).                                                             |
| `worm recover INSERT_DIGEST INSERT_SIGNATURE`                                                                            | Recover an address from a signature.                                                                             |
| `worm status INSERT_NETWORK, INSERT_CHAIN, INSERT_TXN_HASH`                                                              | Prints information about the automatic delivery initiated on the specified network, chain, and transaction hash. |
| `worm submit INSERT_VAA`                                                                                                 | Execute a VAA.                                                                                                   |
| `worm sui INSERT_COMMAND`                                                                                                | Sui utilities.                                                                                                   |
| `worm transfer INSERT_SOURCE_CHAIN, INSERT_DESTINATION_CHAIN, INSERT_DESTINATION_ADDRESS, INSERT_AMOUNT, INSERT_NETWORK` | Transfers a token.                                                                                               |
| `worm verify-vaa INSERT_VAA, INSERT_NETWORK`                                                                             | Verifies a VAA by querying the Core Contract on Ethereum.                                                        |

You can also refer to the below options, available with all `worm` commands:

```bash
Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### Subcommands

??? interface "Aptos"
    ```bash
    worm aptos INSERT_COMMAND

    Commands:
      worm aptos init-token-bridge              Init token bridge contract
      worm aptos init-wormhole                  Init Wormhole core contract
      worm aptos deploy <package-dir>           Deploy an Aptos package
      worm aptos deploy-resource <seed>         Deploy an Aptos package using a
      <package-dir>                             resource account
      worm aptos send-example-message           Send example message
      <message>
      worm aptos derive-resource-account        Derive resource account address
      <account> <seed>
      worm aptos derive-wrapped-address         Derive wrapped coin type
      <chain> <origin-address>
      worm aptos hash-contracts <package-dir>   Hash contract bytecodes for upgrade
      worm aptos upgrade <package-dir>          Perform upgrade after VAA has been
                                                submitted
      worm aptos migrate                        Perform migration after contract
                                                upgrade
      worm aptos faucet                         Request money from the faucet for a
                                                given account
      worm aptos start-validator                Start a local aptos validator

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "Edit VAA"
    ```bash
    worm edit-vaa INSERT_COMMAND

    Options:
          --help                       Show help                           [boolean]
          --version                    Show version number                 [boolean]
      -v, --vaa                        vaa in hex format         [string] [required]
      -n, --network                    Network
                                [required] [choices: "mainnet", "testnet", "devnet"]
          --guardian-set-index, --gsi  guardian set index                   [number]
          --signatures, --sigs         comma separated list of signatures   [string]
          --wormscanurl, --wsu         url to wormscan entry for the vaa that
                                       includes signatures                  [string]
          --wormscan, --ws             if specified, will query the wormscan entry
                                       for the vaa to get the signatures   [boolean]
          --emitter-chain-id, --ec     emitter chain id to be used in the vaa
                                                                            [number]
          --emitter-address, --ea      emitter address to be used in the vaa[string]
          --nonce, --no                nonce to be used in the vaa          [number]
          --sequence, --seq            sequence number to be used in the vaa[string]
          --consistency-level, --cl    consistency level to be used in the vaa
                                                                            [number]
          --timestamp, --ts            timestamp to be used in the vaa in unix
                                       seconds                              [number]
      -p, --payload                    payload in hex format                [string]
          --guardian-secret, --gs      Guardian's secret key                [string]
    ```

??? interface "EVM"
    ```bash
    worm evm INSERT_COMMAND

    Commands:
      worm evm address-from-secret <secret>  Compute a 20 byte eth address from a 32
                                             byte private key
      worm evm storage-update                Update a storage slot on an EVM fork
                                             during testing (anvil or hardhat)
      worm evm chains                        Return all EVM chains
      worm evm info                          Query info about the on-chain state of
                                             the contract
      worm evm hijack                        Override the guardian set of the core
                                             bridge contract during testing (anvil
                                             or hardhat)
      worm evm start-validator               Start a local EVM validator

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
      --rpc      RPC endpoint                                               [string]
    ```

??? interface "Generate"
    ```bash
    worm generate INSERT_COMMAND

    Commands:
      worm generate registration                Generate registration VAA
      worm generate upgrade                     Generate contract upgrade VAA
      worm generate attestation                 Generate a token attestation VAA
      worm generate recover-chain-id            Generate a recover chain ID VAA
      worm generate                             Sets the default delivery provider
      set-default-delivery-provider             for the Wormhole Relayer contract

    Options:
          --help             Show help                                     [boolean]
          --version          Show version number                           [boolean]
      -g, --guardian-secret  Guardians' secret keys (CSV)        [string] [required]
    ```

??? interface "Info"
    ```bash
    worm info INSERT_COMMAND

    Commands:
      worm info chain-id <chain>                Print the wormhole chain ID integer
                                                associated with the specified chain
                                                name
      worm info contract <network> <chain>      Print contract address
      <module>
      worm info emitter <chain> <address>       Print address in emitter address
                                                format
      worm info origin <chain> <address>        Print the origin chain and address
                                                of the asset that corresponds to the
                                                given chain and address.
      worm info registrations <network>         Print chain registrations
      <chain> <module>
      worm info rpc <network> <chain>           Print RPC address
      worm info wrapped <origin-chain>          Print the wrapped address on the
      <origin-address> <target-chain>           target chain that corresponds with
                                                the specified origin chain and
                                                address.

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "NEAR"
    ```bash
    worm near INSERT_COMMAND

    Commands:
      worm near contract-update <file>  Submit a contract update using our specific
                                        APIs
      worm near deploy <file>           Submit a contract update using near APIs

    Options:
          --help      Show help                                            [boolean]
          --version   Show version number                                  [boolean]
      -m, --module    Module to query  [choices: "Core", "TokenBridge"]
      -n, --network   Network   [required] [choices: "mainnet", "testnet", "devnet"]
          --account   Near deployment account                    [string] [required]
          --attach    Attach some near                                      [string]
          --target    Near account to upgrade                               [string]
          --mnemonic  Near private keys                                     [string]
          --key       Near private key                                      [string]
      -r, --rpc       Override default rpc endpoint url                     [string]
    ```

??? interface "Parse"
    ```bash
    worm parse INSERT_VAA

    Positionals:
      vaa  vaa                                                              [string]

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "Recover"
    ```bash
    worm recover INSERT_DIGEST INSERT_SIGNATURE

    Positionals:
      digest     digest                                                     [string]
      signature  signature                                                  [string]

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "Status"
    ```bash
    worm status INSERT_NETWORK, INSERT_CHAIN, INSERT_TXN_HASH

    Positionals:
      network  Network                     [choices: 
      'mainnet', 
      'testnet', 
      'devnet']
      chain    Source chain
                 [choices: 
      'unset',
      'solana',
      'ethereum',
      'terra',
      'bsc',
      'polygon',
      'avalanche',
      'oasis',
      'algorand',
      'aurora',
      'fantom',
      'karura',
      'acala',
      'klaytn',
      'celo',
      'near',
      'moonbeam',
      'neon',
      'terra2',
      'injective',
      'osmosis',
      'sui',
      'aptos',
      'arbitrum',
      'optimism',
      'gnosis',
      'pythnet',
      'xpla',
      'btc',
      'base',
      'sei',
      'rootstock',
      'scroll',
      'mantle',
      'blast',
      'xlayer',
      'linea',
      'berachain',
      'seievm',
      'wormchain',
      'cosmoshub',
      'evmos',
      'kujira',
      'neutron',
      'celestia',
      'stargaze',
      'seda',
      'dymension',
      'provenance',
      'sepolia',
      'arbitrum_sepolia',
      'base_sepolia',
      'optimism_sepolia',
      'holesky',
      'polygon_sepolia']
      tx       Source transaction hash                                      [string]

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "Submit"
    ```bash
    worm submit INSERT_VAA

    Positionals:
      vaa  vaa                                                              [string]

    Options:
          --help              Show help                                    [boolean]
          --version           Show version number                          [boolean]
      -c, --chain             chain name
    [choices: 'unset',
      'solana',
      'ethereum',
      'terra',
      'bsc',
      'polygon',
      'avalanche',
      'oasis',
      'algorand',
      'aurora',
      'fantom',
      'karura',
      'acala',
      'klaytn',
      'celo',
      'near',
      'moonbeam',
      'neon',
      'terra2',
      'injective',
      'osmosis',
      'sui',
      'aptos',
      'arbitrum',
      'optimism',
      'gnosis',
      'pythnet',
      'xpla',
      'btc',
      'base',
      'sei',
      'rootstock',
      'scroll',
      'mantle',
      'blast',
      'xlayer',
      'linea',
      'berachain',
      'seievm',
      'wormchain',
      'cosmoshub',
      'evmos',
      'kujira',
      'neutron',
      'celestia',
      'stargaze',
      'seda',
      'dymension',
      'provenance',
      'sepolia',
      'arbitrum_sepolia',
      'base_sepolia',
      'optimism_sepolia',
      'holesky',
      'polygon_sepolia']
      -n, --network           Network
                                [required] 
      [choices: 
      'mainnet', 
      'testnet', 
      'devnet']
      -a, --contract-address  Contract to submit VAA to (override config)   [string]
          --rpc               RPC endpoint                                  [string]
          --all-chains, --ac  Submit the VAA to all chains except for the origin
                              chain specified in the payload
                                                          [boolean] [default: false]
    ```

??? interface "Sui"
    ```bash
    worm sui INSERT_COMMAND

    Commands:
      worm sui build-coin                    Build wrapped coin and dump bytecode.

                                             Example:
                                             worm sui build-coin -d 8 -v V__0_1_1 -n
                                             testnet -r
                                             "https://fullnode.testnet.sui.io:443"
      worm sui deploy <package-dir>          Deploy a Sui package
      worm sui init-example-message-app      Initialize example core message app
      worm sui init-token-bridge             Initialize token bridge contract
      worm sui init-wormhole                 Initialize wormhole core contract
      worm sui publish-example-message       Publish message from example app via
                                             core bridge
      worm sui setup-devnet                  Setup devnet by deploying and
                                             initializing core and token bridges and
                                             submitting chain registrations.
      worm sui objects <owner>               Get owned objects by owner
      worm sui package-id <state-object-id>  Get package ID from State object ID
      worm sui tx <transaction-digest>       Get transaction details

    Options:
      --help     Show help                                                 [boolean]
      --version  Show version number                                       [boolean]
    ```

??? interface "Transfer"
    ```bash
    worm transfer INSERT_SOURCE_CHAIN, INSERT_DESTINATION_CHAIN, INSERT_DESTINATION_ADDRESS, INSERT_AMOUNT, INSERT_NETWORK

    Options:
          --help        Show help                                          [boolean]
          --version     Show version number                                [boolean]
          --src-chain   source chain [required] [choices:
      'solana',
      'ethereum',
      'terra',
      'bsc',
      'polygon',
      'avalanche',
      'oasis',
      'algorand',
      'aurora',
      'fantom',
      'karura',
      'acala',
      'klaytn',
      'celo',
      'near',
      'moonbeam',
      'neon',
      'terra2',
      'injective',
      'osmosis',
      'sui',
      'aptos',
      'arbitrum',
      'optimism',
      'gnosis',
      'pythnet',
      'xpla',
      'btc',
      'base',
      'sei',
      'rootstock',
      'scroll',
      'mantle',
      'blast',
      'xlayer',
      'linea',
      'berachain',
      'seievm',
      'wormchain',
      'cosmoshub',
      'evmos',
      'kujira',
      'neutron',
      'celestia',
      'stargaze',
      'seda',
      'dymension',
      'provenance',
      'sepolia',
      'arbitrum_sepolia',
      'base_sepolia',
      'optimism_sepolia',
      'holesky',
      'polygon_sepolia']
      --dst-chain   destination chain
               [required] [choices: 
      'solana',
      'ethereum',
      'terra',
      'bsc',
      'polygon',
      'avalanche',
      'oasis',
      'algorand',
      'aurora',
      'fantom',
      'karura',
      'acala',
      'klaytn',
      'celo',
      'near',
      'moonbeam',
      'neon',
      'terra2',
      'injective',
      'osmosis',
      'sui',
      'aptos',
      'arbitrum',
      'optimism',
      'gnosis',
      'pythnet',
      'xpla',
      'btc',
      'base',
      'sei',
      'rootstock',
      'scroll',
      'mantle',
      'blast',
      'xlayer',
      'linea',
      'berachain',
      'seievm',
      'wormchain',
      'cosmoshub',
      'evmos',
      'kujira',
      'neutron',
      'celestia',
      'stargaze',
      'seda',
      'dymension',
      'provenance',
      'sepolia',
      'arbitrum_sepolia',
      'base_sepolia',
      'optimism_sepolia',
      'holesky',
      'polygon_sepolia']
          --dst-addr    destination address                      [string] [required]
          --token-addr  token address               [string] [default: native token]
          --amount      token amount                             [string] [required]
      -n, --network     Network [required] [choices: "mainnet", "testnet", "devnet"]
          --rpc         RPC endpoint                                        [string]
    ```

??? interface "Verify VAA"
    ```bash
    worm verify-vaa INSERT_VAA, INSERT_NETWORK

    Options:
          --help     Show help                                             [boolean]
          --version  Show version number                                   [boolean]
      -v, --vaa      vaa in hex format                           [string] [required]
      -n, --network  Network    [required] [choices: "mainnet", "testnet", "devnet"]
    ```
