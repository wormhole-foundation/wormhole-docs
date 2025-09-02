---
title: Native Token Transfers EVM Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for EVM chains, including setup, token compatibility, mint/burn modes, and CLI usage.
categories: NTT, Transfer
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
        --8<-- 'text/products/native-token-transfers/get-started/deploy-erc20.md'

2. **Choose your deployment model**: Choose a deployment model. The NTT framework supports two [deployment models](/docs/products/token-transfers/native-token-transfers/overview/#deployment-models){target=\_blank}: burn-and-mint and hub-and-spoke.

    ??? interface "Burn-and-Mint"

        Tokens must implement the following non-standard ERC-20 functions:

        - `burn(uint256 amount)`
        - `mint(address account, uint256 amount)`

        These functions aren't part of the standard ERC-20 interface. Refer to the [`INttToken` interface](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} for all required functions, errors, and events.

        ??? interface "`INttToken` Interface"
            ```solidity
            --8<-- 'code/products/native-token-transfers/guides/deploy-to-evm/INttToken.sol'
            ```

        You’ll also need to set mint authority to the relevant `NttManager` contract.

    ??? interface "Hub-and-Spoke"

        Tokens only need to be ERC-20 compliant. The hub chain serves as the source of truth for supply consistency, while only spoke chains need to support minting and burning. For example, if Ethereum is the hub and Polygon is a spoke:

        - Tokens are locked on Ethereum.
        - Tokens are minted or burned on Polygon.

        This setup maintains a consistent total supply across all chains.

    Example deployment scripts for both models are available in the [`example-ntt-token` GitHub repository](https://github.com/wormhole-foundation/example-ntt-token){target=\_blank}.

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
    
    --8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md'

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
    --8<-- 'code/products/native-token-transfers/guides/deploy-to-evm/initialize.txt:4'
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

By default, NTT transfers to EVM blockchains support automatic relaying via the Wormhole relayer, which doesn't require the user to perform a transaction on the destination chain to complete the transfer.

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


## Where to Go Next

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Test Your Deployment**

    ---

    Follow the NTT Post Deployment Guide for integration examples and testing instructions.

    [:custom-arrow: Test Your NTT deployment](/docs/products/token-transfers/native-token-transfers/guides/post-deployment/){target=\_blank}

-   :octicons-tools-16:{ .lg .middle } **Deploy NTT to SVM Chains**

    ---

    Follow the guide to deploy and configure Wormhole's Native Token Transfers (NTT) for SVM chains.

    [:custom-arrow: Deploy NTT to SVM Chains](/docs/products/token-transfers/native-token-transfers/guides/deploy-to-solana/){target=\_blank}

-   :octicons-question-16:{ .lg .middle } **View FAQs**

    ---

    Find answers to common questions about NTT.

    [:custom-arrow: View FAQs](/docs/products/token-transfers/native-token-transfers/faqs/){target=\_blank}

</div>
