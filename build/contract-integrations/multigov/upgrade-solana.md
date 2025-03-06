---
title: Upgrading MultiGov on Solana
description: Learn the process and key considerations for upgrading MultiGov on Solana, ensuring system integrity and careful planning across cross-chain components.
---

# Upgrade MultiGov Contracts on Solana

The MultiGov Staking Program on Solana is designed to be upgradeable while maintaining stability. Upgrades introduce improvements, bug fixes, and new features, but they must be carefully planned and executed to prevent disruptions.  

This guide covers the key considerations and step-by-step process for upgrading the MultiGov Staking Program, including updating the program binary, Interface Description Language (IDL), and `HubProposalMetadata`, while ensuring cross-chain compatibility.

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


