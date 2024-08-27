---
title: Native Token Transfers Security
description: Explore the security measures of Native Token Transfers, including the Global Accountant and governance strategies for seamless token safety.
---

# Security

## Global Accountant

The Global Accountant is a defense-in-depth security feature that performs integrity checks on every token transfer. This feature isolates chain balances, ensuring more tokens cannot be burned and transferred out of a chain than were ever minted.

This CosmWasm-based module acts as a smart contract on Wormhole Gateway and ensures that native asset fungibility remains in 1:1 parity. At no time will assets coming from a spoke chain exceed the number of native assets sent to that spoke chain. Accounting is enforced transparently by Wormhole Guardians, who won't attest to a Native Token Transfer (NTT) if it violates checks.

[Contact](https://discord.com/invite/wormholecrypto){target=\_blank} Wormhole contributors if you are interested in having Global Accountant configured for your multichain deployment.

## Governance and Upgrading

Integrators should implement governance mechanisms to manage the addition and removal of transceivers and to upgrade contracts using proxy patterns, as demonstrated in the upgrade functions in the `NttManager` contracts. These processes can also set thresholds and rules for attestation and message approval.

The registry component of the NTT system is crucial for maintaining a trusted list of transceivers and managing their status. Governance processes for the following actions can be submitted directly to the corresponding contract on-chain, whether it is one or multiple of the bridging contracts or one of the token contracts:

- Adding or removing a transceiver address from the registry
- Setting the token contract address on a bridging contract
- Setting the Wormhole Core Contract address on a bridging contract
- Setting the registered bridging contract address on the token contract

This governance model ensures that the system remains secure while being adaptable to new requirements in any environment where it is deployed.


