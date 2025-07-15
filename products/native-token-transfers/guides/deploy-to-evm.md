---
title: Native Token Transfers EVM Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for EVM chains, including setup, token compatibility, mint/burn modes, and CLI usage.
categories: NTT, Transfer
---

# Deploy NTT to EVM Chains

[Native Token Transfers (NTT)](/docs/products/native-token-transfers/overview/){target=\_blank} enable seamless multichain transfers of ERC-20 tokens on [supported EVM-compatible chains](/docs/products/reference/supported-networks/#ntt){target=\_blank} using Wormhole's messaging protocol. Instead of creating wrapped tokens, NTT allows native assets to move across chains while maintaining their original properties.

This guide walks you through deploying NTT on EVM chains, including setting up dependencies, configuring token compatibility, and using the NTT CLI to deploy in hub-and-spoke or burn-and-mint mode.

## Deploy Your Token and Ensure Compatibility

If you still need to do so, deploy the token contract to the destination or spoke chains.

### Requirements for Token Deployment

Wormhole’s NTT framework supports two [deployment models](/docs/products/native-token-transfers/overview#deployment-models){target=\_blank}: burn-and-mint and hub-and-spoke. **Both require an ERC-20 token (new or existing).**

??? interface "Burn-and-Mint"

    Tokens must implement the following non-standard ERC-20 functions:

    - `burn(uint256 amount)`
    - `mint(address account, uint256 amount)`

    You’ll also need to set the mint authority to the relevant `NttManager` contract. Example scripts are available in the [`example-ntt-token` GitHub repository](https://github.com/wormhole-foundation/example-ntt-token){target=\_blank}.

    Refer to the [`INttToken` interface](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} as an example of the above mentioned functions and additionally optional errors, and events.

    ??? interface "`INttToken` Interface"
        ```solidity
        --8<-- 'code/products/native-token-transfers/guides/deploy-to-evm/INttToken.sol'
        ```

??? interface "Hub-and-Spoke Mode"

    Tokens only need to be ERC-20 compliant. The hub chain serves as the source of truth for supply consistency, while only spoke chains need to support minting and burning. For example, if Ethereum is the hub and Polygon is a spoke:

    - Tokens are locked on Ethereum
    - Tokens are minted or burned on Polygon

    This setup maintains a consistent total supply across all chains.

## NTT Manager Deployment Parameters

This table compares the configuration parameters available when deploying the NTT Manager using the CLI versus a manual deployment with a Forge script. It highlights which options are configurable via each method, whether values are auto-detected or hardcoded, and includes additional comments to help guide deployment decisions.

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


## Deploy NTT

Before deploying NTT contracts on EVM chains, you need to scaffold a project and initialize your deployment configuration.

???- interface "Install the NTT CLI and Scaffold a New Project"
    
    --8<-- 'text/products/native-token-transfers/guides/install-ntt-project.md'

        === "Testnet"

            ```bash
            ntt init Testnet
            ```

Once you've completed those steps, return here to proceed with adding your EVM chains and deploying contracts.

Ensure you have set up your environment correctly: 

```bash
export ETH_PRIVATE_KEY=INSERT_PRIVATE_KEY
```

Add each chain you'll be deploying to. The following example demonstrates configuring NTT in burn-and-mint mode on Ethereum Sepolia and Arbitrum Sepolia:

```bash
--8<-- 'code/products/native-token-transfers/guides/deploy-to-evm/initialize.txt'
```

While not recommended, you can pass the `-skip-verify` flag to the `ntt add-chain` command if you want to skip contract verification.

The `ntt add-chain` command takes the following parameters:

- Name of each chain
- Version of NTT to deploy (use `--latest` for the latest contract versions)
- Mode (either `burning` or `locking`)
- Your token contract address

The NTT CLI prints detailed logs and transaction hashes, so you can see exactly what's happening under the hood.

## Configure NTT

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
  
- `ntt push` - syncs the on-chain configuration with local changes made to your `deployment.json` file

After you deploy the NTT contracts, ensure that the deployment is properly configured and your local representation is consistent with the actual on-chain state by running `ntt status` and following the instructions shown on the screen.

## Set Token Minter to NTT Manager

The final step in the deployment process is to set the NTT Manager as a minter of your token on all chains you have deployed to in `burning` mode. When performing a hub-and-spoke deployment, it is only necessary to set the NTT Manager as a minter of the token on each spoke chain.

!!! note
    The required NTT Manager address can be found in the `deployment.json` file.

- If you followed the [`INttToken`](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} interface, you can execute the `setMinter(address newMinter)` function
    ```json
    cast send $TOKEN_ADDRESS "setMinter(address)" $NTT_MANAGER_ADDRESS --private-key $ETH_PRIVATE_KEY --rpc-url $YOUR_RPC_URL  
    ```

- If you have a custom process to manage token minters, you should now follow that process to add the corresponding NTT Manager as a minter

By default, NTT transfers to EVM blockchains support automatic relaying via the Wormhole relayer, which doesn't require the user to perform a transaction on the destination chain to complete the transfer.

!!!important
    To proceed with testing and find integration examples, check out the [NTT Post Deployment](/docs/products/native-token-transfers/guides/post-deployment/){target=\_blank} page.