---
title: Native Token Transfers EVM Deployment
description: Deploy and configure Wormhole’s Native Token Transfers (NTT) for EVM chains, including setup, token compatibility, mint/burn modes, and CLI usage.
---

# Native Token Transfers (NTT) EVM Development

## Deploy Your Token and Ensure Compatibility

If you still need to do so, deploy the token contract to the destination or spoke chains.

### Requirements for Token Deployment

Wormhole’s NTT is an open framework that supports various deployment modes. The NTT CLI currently supports two deployment modes: burn-and-mint and hub-and-spoke. These modes differ in how tokens are managed across chains.

#### Burn-and-Mint Mode

Tokens integrated with `NttManager` in `burning` mode require the following two functions to be present:

- `burn(uint256 amount)`
- `mint(address account, uint256 amount)`

These functions aren't part of the standard ERC-20 interface. The [`INttToken` interface](https://github.com/wormhole-foundation/native-token-transfers/blob/main/evm/src/interfaces/INttToken.sol){target=\_blank} documents the required functions and convenience methods, errors, and events.

??? code "View the complete `INttToken` Interface`"
    ```solidity
    --8<-- 'code/build/transfers/native-token-transfers/deployment-process/INttToken.sol'
    ```

Later, you set mint authority to the corresponding `NttManager` contract. You can also follow the scripts in the [example NTT token](https://github.com/wormhole-foundation/example-ntt-token){target=\_blank} repository to deploy a token contract.

#### Hub-and-Spoke Mode

A central hub chain (e.g., Ethereum) manages the total token supply in hub-and-spoke mode. Other chains (spokes) mint or burn tokens during cross-chain transfers, ensuring consistency with the locked tokens on the hub chain.

 - **Hub chain** - tokens are locked on the hub chain when transferring to spoke chains
 - **Spoke chains** - tokens are native to the spoke chains and are either minted or burned during cross-chain transfers

!!! note
    The only requirement for using the NTT framework is an ERC20 token, which can be newly deployed or existing. Steps like setting mint authority apply only to spoke chains.

For example, when transferring tokens from Ethereum (hub) to Polygon (spoke), the NTT Manager locks tokens on Ethereum, and the corresponding amount is minted on Polygon. Similarly, transferring tokens back from Polygon to Ethereum burns the tokens on Polygon and unlocks the equivalent tokens on Ethereum.

This process ensures that the total token supply remains consistent across all chains, with the hub chain acting as the source of truth.

For more detailed information, see the [Deployment Models](/docs/learn/transfers/native-token-transfers/deployment/){target=\_blank} page.

### Key Differences Between Modes

 - **Burn-and-mint** - tokens must implement custom `mint` and `burn` functions, allowing each chain to manage token issuance independently
 - **Hub-and-spoke** - tokens only need to be ERC20 compliant, with the hub chain acting as the source of truth for supply consistency

## Deploy NTT

Create a new NTT project:

```bash
ntt new my-ntt-deployment
cd my-ntt-deployment
```

Initialize a new `deployment.json` file specifying the network:

=== "Testnet"

    ```bash
    ntt init Testnet
    ```

=== "Mainnet"

    ```bash
    ntt init Mainnet
    ```

Ensure you have set up your environment correctly: 

```bash
export ETH_PRIVATE_KEY=INSERT_PRIVATE_KEY
```

Add each chain you'll be deploying to. The following example demonstrates configuring NTT in burn-and-mint mode on Ethereum Sepolia and Arbitrum Sepolia:

```bash
--8<-- 'code/build/transfers/native-token-transfers/deployment-process/initialize.txt'
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
    To proceed with testing and find integration examples, check out the [NTT Post Deployment](/docs/build/transfers/native-token-transfers/deployment-process/post-deployment/){target=\_blank} page.