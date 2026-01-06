---
title: Native Token Transfers EVM Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for EVM chains, including setup, token compatibility, mint/burn modes, and CLI usage.
categories: NTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/native-token-transfers/guides/deploy-to-evm/
---

# Deploy NTT to EVM Chains

[Native Token Transfers (NTT)](/docs/products/token-transfers/native-token-transfers/overview/){target=\_blank} enable seamless multichain transfers of ERC-20 tokens on [supported EVM-compatible chains](/docs/products/reference/supported-networks/#ntt){target=\_blank} using Wormhole's messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on EVM chains, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in hub-and-spoke or burn-and-mint mode.

## Prerequisites

Before deploying NTT on EVM chains, ensure you have the following prerequisites:

- [Node.js and npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank}.
- [Bun installed](https://bun.sh/){target=\_blank}.
- A wallet private key with tokens on supported chains.
- ERC-20 tokens already deployed on the source and destination chains.

## Overview of the Deployment Process

Deploying NTT on EVM chains follows a structured process:

1. **Choose your token setup**: Use an existing ERC-20 token or deploy a new one.

    ???- interface "Deploy an ERC-20 Token on EVM"
        Use the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token-evm){target=\_blank} to deploy a basic ERC-20 token contract on testnet.

        1. **Install Foundry**: Install the [Forge CLI](https://getfoundry.sh/introduction/installation/){target=\_blank}.

        2. **Clone the repository**: Fetch the example contract repository.

            ```bash
            git clone https://github.com/wormhole-foundation/example-ntt-token-evm.git
            cd example-ntt-token
            ```
        3. **Deploy the token contract**: Deploy to testnet with your preferred name, symbol, minter, and owner addresses.

            ```bash
            forge create --broadcast \
                --rpc-url INSERT_RPC_URL \
                --private-key INSERT_YOUR_PRIVATE_KEY \
                src/PeerToken.sol:PeerToken \
                --constructor-args "INSERT_TOKEN_NAME" "INSERT_TOKEN_SYMBOL" INSERT_MINTER_ADDRESS INSERT_OWNER_ADDRESS
            ```

        4. **Mint tokens**: Send tokens to your address.

            ```bash
            cast send INSERT_TOKEN_ADDRESS \
                "mint(address,uint256)" \
                INSERT_RECIPIENT_ADDRESS \
                INSERT_AMOUNT_IN_WEI \
                --private-key INSERT_YOUR_PRIVATE_KEY \
                --rpc-url INSERT_RPC_URL
            ```

        !!! note
            This token uses 18 decimals by default. All minting values must be specified in `wei` (1 token = 10^18).
2. **Choose your deployment model**: Choose a deployment model. The NTT framework supports two [deployment models](/docs/products/token-transfers/native-token-transfers/overview/#deployment-models){target=\_blank}: burn-and-mint and hub-and-spoke.

    ??? interface "Burn-and-Mint"

        Tokens must implement the following non-standard ERC-20 functions:

        - `burn(uint256 amount)`
        - `mint(address account, uint256 amount)`

        You’ll also need to set mint authority to the relevant `NttManager` contract.

        These functions aren't part of the standard ERC-20 interface. Refer to the [`INttToken` interface](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} for examples of the mentioned functions, as well as optional errors and events.

        ??? interface "`INttToken` Interface"
            ```solidity
            // SPDX-License-Identifier: Apache 2
            pragma solidity >=0.8.8 <0.9.0;

            interface INttToken {
                /// @notice Error when the caller is not the minter.
                /// @dev Selector 0x5fb5729e.
                /// @param caller The caller of the function.
                error CallerNotMinter(address caller);

                /// @notice Error when the minter is the zero address.
                /// @dev Selector 0x04a208c7.
                error InvalidMinterZeroAddress();

                /// @notice Error when insufficient balance to burn the amount.
                /// @dev Selector 0xcf479181.
                /// @param balance The balance of the account.
                /// @param amount The amount to burn.
                error InsufficientBalance(uint256 balance, uint256 amount);

                /// @notice The minter has been changed.
                /// @dev Topic0
                ///      0x0b5e7be615a67a819aff3f47c967d1535cead1b98db60fafdcbf22dcaa8fa5a9.
                /// @param newMinter The new minter.
                event NewMinter(address previousMinter, address newMinter);

                // NOTE: the `mint` method is not present in the standard ERC20 interface.
                function mint(address account, uint256 amount) external;

                // NOTE: the `setMinter` method is not present in the standard ERC20 interface.
                function setMinter(address newMinter) external;

                // NOTE: NttTokens in `burn` mode require the `burn` method to be present.
                //       This method is not present in the standard ERC20 interface, but is
                //       found in the `ERC20Burnable` interface.
                function burn(uint256 amount) external;
            }
            ```

    ??? interface "Hub-and-Spoke"

        Tokens only need to be ERC-20 compliant. The hub chain serves as the source of truth for supply consistency, while only spoke chains need to support minting and burning. For example, if Ethereum is the hub and Polygon is a spoke:

        - Tokens are locked on Ethereum.
        - Tokens are minted or burned on Polygon.

        This setup maintains a consistent total supply across all chains.

    Example deployment scripts for both models are available in the [`example-ntt-token` GitHub repository](https://github.com/wormhole-foundation/example-ntt-token-evm){target=\_blank}.

3. **Configure your chains**: Use the NTT CLI to add EVM chains and configure deployment parameters.
4. **Set Mint Authority**: Set the NTT Manager as a minter for your tokens on the relevant chains.
    - For burn-and-mint mode, set the NTT Manager as a minter on all chains. 
    - For hub-and-spoke, set the NTT Manager as a minter only on spoke chains.

## Set Up NTT

Before deploying NTT contracts on EVM chains, you need to scaffold a project and initialize your deployment configuration.

!!! note
    If you already have an NTT deployment to another chain (like Solana), you can skip the `ntt new` and `ntt init` commands. Simply navigate to your existing NTT project directory and proceed directly to the [Deploy and Configure NTT](#deploy-and-configure-ntt) section.

The [NTT CLI](/docs/products/native-token-transfers/reference/cli-commands/){target=\_blank} manages deployments, configures settings, and interacts with the NTT system. Follow these steps to set up NTT using the CLI tool:

???- interface "Install the NTT CLI and Scaffold a New Project"
    
    1. Install the NTT CLI:

        ```bash
        git clone --branch 'v1.6.0+cli' --single-branch --depth 1 \
            https://github.com/wormhole-foundation/native-token-transfers.git
        cd native-token-transfers
        ```

        ```bash
        curl -fsSL https://bun.com/install | bash -s "bun-v1.2.23"  
        ```

        ```bash
        npm ci
        cd cli
        ./install.sh
        ```

        Verify installation:

        ```bash
        ntt --version
        ```

    2. Initialize a new NTT project:

        ```bash
        ntt new my-ntt-project
        cd my-ntt-project
        ```

    3. Create the deployment config using the following command. This will generate a `deployment.json` file where your settings are stored:

        === "Mainnet"

            ```bash
            ntt init Mainnet
            ```

        === "Testnet"

            ```bash
            ntt init Testnet
            ```

## Deploy and Configure NTT

Once you've set up NTT, proceed with adding your EVM chains and deploying contracts.

1. **Environment Setup**: Ensure you have set up your environment correctly, open your terminal, and run the `export` commands:

    ```bash
    export ETH_PRIVATE_KEY=INSERT_PRIVATE_KEY
    export SEPOLIA_SCAN_API_KEY=INSERT_ETHERSCAN_SEPOLIA_API_KEY
    export ARBITRUMSEPOLIA_SCAN_API_KEY=INSERT_ARBISCAN_SEPOLIA_API_KEY
    ```

2. **Deploy NTT to EVM**: Add each chain you'll be deploying to using the `ntt add-chain` command. The following example demonstrates configuring NTT in burn-and-mint mode on Ethereum Sepolia and Arbitrum Sepolia:

    ```bash

    # Add each chain
    # The contracts will be automatically verified using the scanner API keys above
    ntt add-chain Sepolia --latest --mode burning --token INSERT_YOUR_TOKEN_ADDRESS
    ntt add-chain ArbitrumSepolia --latest --mode burning --token INSERT_YOUR_TOKEN_ADDRESS
    ```

    The `ntt add-chain` command takes the following parameters:

    - Name of each chain.
    - Version of NTT to deploy (use `--latest` for the latest contract versions).
    - Mode - either `burning` or `locking`.
    - Your token contract address.

    While not recommended, you can pass the `-skip-verify` flag to the `ntt add-chain` command if you want to skip contract verification.

3. **Verify deployment status**: After deployment, check if your `deployment.json` file matches the on-chain configuration using the following command:

    ```bash
    ntt status
    ```

    If needed, sync your local configuration with the on-chain configuration:

    ```bash
    ntt pull
    ```

4. **Configure rate limits**: Set up inbound and outbound rate limits. By default, limits are set to 0 and must be updated before deployment. For EVM chains, values must be set using 18 decimals.

    Open your `deployment.json` file and adjust the values based on your use case:

      ```json
      "inbound": {
          "Arbitrum": "1000.000000000000000000" // inbound limit from Arbitrum to Ethereum
      }
      "outbound": {
          "Ethereum": "1000.000000000000000000" // outbound limit from Ethereum to Arbitrum
      }
      ```

    This configuration ensures your rate limits align with the token’s precision on each chain, preventing mismatches that could block or miscalculate transfers. Before setting these values, confirm your token’s decimals on each chain by checking the token contract on the relevant block explorer.

5. **Push the final deployment**: Once rate limits are set, sync the on-chain configuration with local changes made to your `deployment.json` file.

    ```bash
    ntt push 
    ```
  
After you deploy the NTT contracts, ensure that the deployment is properly configured and your local representation is consistent with the actual on-chain state by running `ntt status` and following the instructions shown on the screen.

## Set Mint Authority

The final step in the deployment process is to set the NTT Manager as a minter of your token on all chains you have deployed to in `burning` mode. When performing a hub-and-spoke deployment, it is only necessary to set the NTT Manager as a minter of the token on each spoke chain.

!!! note
    The required NTT Manager address can be found in the `deployment.json` file.

- If you followed the [`INttToken`](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} interface, you can execute the `setMinter(address newMinter)` function.
    ```json
    cast send $TOKEN_ADDRESS "setMinter(address)" $NTT_MANAGER_ADDRESS --private-key $ETH_PRIVATE_KEY --rpc-url $YOUR_RPC_URL  
    ```

- If you have a custom process to manage token minters, you should now follow that process to add the corresponding NTT Manager as a minter.



## NTT Manager Deployment Parameters

This table compares the configuration parameters available when deploying the NTT Manager using the CLI versus those available during a manual deployment with a Forge script. It highlights which options are configurable via each method, whether values are auto-detected or hardcoded, and includes additional comments to help guide deployment decisions.

| <div style="width:150px">Parameter</div> | Forge Script           | CLI                                 | Both   | Comments                                     |
|-------------------------|------------------------|-------------------------------------|--------|----------------------------------------------|
| `token`                 | Input                  | `--token <address>`                 | Yes    |                                              |
| `mode`                  | Input                  | `--mode <locking/burning>`          | Yes    | Key decision: hub-and-spoke or mint-and-burn |
| `wormhole`              | Input                  | Auto-detected via SDK/`ChainContext`  | Similar|                                              |
| `wormholeRelayer`       | Input                  | Auto-detected via on-chain query/SDK| Similar|                                              |
| `specialRelayer`        | Input                  | Not exposed                         | No     | Take into consideration if using custom relaying. Not recommended |
| `decimals`              | Input, overridable     | Auto-detected via token contract, not overridable  | Similar |                              |
| `wormholeChainId`       | Queried from Wormhole contract | `--chain` (network param, mapped internally) | Yes     |                              |
| `rateLimitDuration`     | Hardcoded (`86400`)    | Hardcoded (`86400`)                 | Yes    | Rate limit duration. A day is normal but worth deciding  |
| `shouldSkipRatelimiter` | Hardcoded (`false`)      | Hardcoded (`false`)                   | Yes    | If rate limit should be disabled (when the manager supports it)         |
| `consistencyLevel`      | Hardcoded (`202`)      | Hardcoded (`202`)                   | Yes    | `202` (finalized) is the standard — lower is not recommended  |
| `gasLimit`              | Hardcoded (`500000`)   | Hardcoded (`500000`)                | Yes    |             |
| `outboundLimit`         | Computed               | Auto-detected/Hardcoded             | Similar| Relative to rate limit             |


## Next Steps

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Test Your Deployment**

    ---

    Follow the NTT Post Deployment Guide for integration examples and testing instructions.

    [:custom-arrow: Test Your NTT deployment](/docs/products/token-transfers/native-token-transfers/guides/post-deployment/)

-   :octicons-tools-16:{ .lg .middle } **Deploy NTT to SVM Chains**

    ---

    Follow the guide to deploy and configure Wormhole's Native Token Transfers (NTT) for SVM chains.

    [:custom-arrow: Deploy NTT to SVM Chains](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-solana/)

-   :octicons-tools-16:{ .lg .middle } **Launch a Multichain Native Memecoin**

    ---

    Learn how to use the NTT framework to launch a multi-chain native Memecoin on the Wormhole Dev Arena, a structured learning hub with hands-on tutorials across the Wormhole ecosystem. 

    [:custom-arrow: Explore the Dev Arena](https://arena.wormhole.com/courses/1bee7446-5ed5-8140-9ec4-e800f40a41bc){target=\_blank}

-   :octicons-question-16:{ .lg .middle } **View FAQs**

    ---

    Find answers to common questions about NTT.

    [:custom-arrow: View FAQs](/docs/products/token-transfers/native-token-transfers/faqs/)

</div>
