---
title: Native Token Transfers Access Control
description: Learn about the owner and pauser access roles for the NTT manager contract, which can be used to pause and un-pause token transfers.
categories: NTT, Transfer
---

# Access Control

## Owner and Pauser Roles

Pausing the Native Toke Transfer (NTT) Manager Contract will disallow initiating new token transfers. While the contract is paused, in-flight transfers can still be redeemed (subject to rate limits if configured).

NTT can be paused on a particular chain by updating the `paused` parameter on the deployment to `true` via the NTT CLI, then performing `ntt push` to sync the local configuration with the on-chain deployment.

- **Owner** - full control over NTT contracts, can perform administrative functions. Has the ability to un-pause contracts if they have been paused
- **Pauser** - can pause NTT contracts to halt token transfers temporarily. This role is crucial for responding quickly to adverse events without a prolonged governance process. Cannot un-pause contracts

You may verify the current owner, pauser, and paused status of the NTT Manager contract on the `deployment.json` file in your NTT project directory.

```json
{
    "network": "Testnet",
    "chains": {
        "Sepolia": {
            "version": "1.1.0",
            "mode": "burning",
            "paused": true, // set to true to pause the contract
            "owner": "0x0088DFAC40029f266e0FF62B82E47A07467A0345",
            "manager": "0x5592809cf5352a882Ad5E9d435C6B7355B716357",
            //...
            "pauser": "0x0088DFAC40029f266e0FF62B82E47A07467A0345"
        }
    }
}
```

!!! note
    While the `Pauser` can pause contracts, the ability to un-pause contracts is callable only by the `Owner`.

The `Owner` and the `Pauser` addresses can each pause the contract. Since the contract `Owner` address is typically a multisig or a more complex DAO governance contract, and pausing the contract only affects the availability of token transfers, protocols can choose to set the `Pauser` address to be a different address. Creating a separate `Pauser` helps protocols respond quickly to potential risks without going through a drawn-out process.

Consider separating `Owner` and `Pauser` roles for your multichain deployment. `Owner` and `Pauser` roles are defined directly on the `NttManager` contract.