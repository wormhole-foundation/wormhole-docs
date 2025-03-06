---
title: Upgrading MultiGov on Solana
description: Learn the process and key considerations for upgrading MultiGov on Solana, ensuring system integrity and careful planning across cross-chain components.
---

# Upgrade MultiGov Contracts on Solana

The MultiGov Staking Program on Solana is designed to be upgradeable while maintaining stability. Upgrades introduce improvements, bug fixes, and new features but must be carefully planned and executed to prevent disruptions. 

This guide covers the key considerations and step-by-step process for upgrading the MultiGov Staking Program, including updating the program binary, Interface Description Language (IDL), and `HubProposalMetadata` while ensuring cross-chain compatibility.

## Key Considerations for Upgrades

### Program Upgradeability

- The MultiGov Staking Program on Solana is upgradeable using the `anchor upgrade` command 
- Upgrades require the program's new bytecode (`.so` file) and an updated IDL file to reflect any changes in the program's interface
- The program's authority (deployer) must execute the upgrade

### `HubProposalMetadata` Updates

- The `HubProposalMetadata` can be updated without redeploying the entire program. This is done by invoking the `updateHubProposalMetadata` instruction
- Updates to `HubProposalMetadata` must be carefully validated to ensure compatibility with the existing system

### Cross-Chain Compatibility

- Ensure that any changes to the Solana program do not break compatibility with the Ethereum-based `HubGovernor` 
- Test upgrades thoroughly on devnet before deploying to mainnet

## Process for Upgrading the MultiGov Program

Follow these steps to upgrade the MultiGov Staking Program on Solana.  

1. **Prepare the new program binary** - build the updated program using the provided script

    ```bash
    ./scripts/build_verifiable_staking_program.sh
    ```

    The new program binary will be located at:

    ```bash
    target/deploy/staking.so
    ```

2. **Upgrade the program** - use the anchor upgrade command to deploy the new program binary

    ```bash
    anchor upgrade --program-id INSERT_PROGRAM_ID --provider.cluster INSERT_CLUSTER_URL INSERT_PATH_TO_PROGRAM_BINARY
    ```

    ???- note "Example"
        ```bash
        anchor upgrade --program-id DgCSKsLDXXufYeEkvf21YSX5DMnFK89xans5WdSsUbeY --provider.cluster https://api.devnet.solana.com ./target/deploy/staking.so
        ```

3. **Update the IDL** - after upgrading the program, update the IDL to reflect any changes in the program's interface

    ```bash
    anchor idl upgrade INSERT_PROGRAM_ID --filepath INSERT_PATH_TO_IDL_FILE
    ```

    ???- note "Example"
        ```bash
        anchor idl upgrade --provider.cluster https://api.devnet.solana.com --filepath ./target/idl/staking.json DgCSKsLDXXufYeEkvf21YSX5DMnFK89xans5WdSsUbeY
        ```

4. **Update `HubProposalMetadata`** - if `HubProposalMetadata` requires an update, run the following script to invoke the `updateHubProposalMetadata` instruction and apply the changes

    ```bash
    npx ts-node app/deploy/07_update_HubProposalMetadata.ts
    ```

