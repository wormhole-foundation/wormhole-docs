---
title: Native Token Transfers Access Control
description: Learn how to Manage NTT access with Owner/Pauser roles, control the pausing of token transfers, define roles for quick responses, and sync settings via NTT CLI.
---

## Owner and Pauser Roles

Pausing the NTT manager contract will disallow initiating new token transfers. While the contract is paused, in-flight transfers can still be redeemed (subject to rate limits, if configured).

NTT can be paused on a particular chain by updating the `paused` parameter on the deployment to `true` via the NTT CLI, then performing `ntt push` to sync the local configuration with the on-chain deployment.

- **Owner** - full control over NTT contracts, can perform administrative functions. Has the ability to un-pause contracts if they have been paused
- **Pauser** - can pause NTT contracts to halt token transfers temporarily. This is crucial for responding quickly to potential risks without a prolonged governance process. Cannot un-pause contracts

!!! note
    While the `Pauser` can pause contracts, the ability to un-pause contracts is callable only by the `Owner`.

The contract can be paused via the contract `Owner` or the `Pauser` address. Since the contract `Owner` address is typically a multi-sig or a more complex DAO governance contract, and pausing the contract only affects the liveness of token transfers, protocols can choose to set the `Pauser` address to be a different address. This can help ensure that protocols can respond very quickly to potential risks without going through a drawn-out process.

Consider separating `Owner` and `Pauser` roles for your multichain deployment. Owner and Pauser roles are defined directly on the `NttManager`.