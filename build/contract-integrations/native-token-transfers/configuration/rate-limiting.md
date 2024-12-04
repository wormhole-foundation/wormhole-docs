---
title: Native Token Transfers Rate Limiting
description: Learn about rate limits in Wormhole NTT by configuring send/receive limits, queuing, and canceling flows to manage multichain token transfers efficiently.
---

## Introduction

The Native Token Transfer (NTT) framework provides configurable per-chain rate limits for sending and receiving token transfers. Integrators can manage these limits via their own governance processes to quickly adapt to on-chain activity.

If a transfer is rate-limited on the source chain and queueing is enabled via `shouldQueue = true`, the transfer is placed into an outbound queue and can be released after the rate limit expires.

You can configure the following limits on every chain where NTT is deployed directly using the manager:

- **Sending limit** - a single outbound limit for sending tokens from the chain
- **Per-chain receiving limits** - the maximum receiving limit, which can be configured on a per-chain basis. For example, allowing `100` tokens to be received from Ethereum but only 50 tokens to be received from Arbitrum

Rate limits are replenished every second over a fixed duration. While the default duration is 24 hours, the value is configurable at contract creation. Rate-limited transfers on the destination chain are added to an inbound queue with a similar release delay.

## Update Rate Limits

To configure or update the sending and receiving rate limits, follow these steps:

1. **Locate the deployment file** - open the `deployment.json` file in your NTT project directory. This file contains the configuration for your deployed contracts

2. **Modify the limits section** - for each chain, locate the limits field and update the outbound and inbound values as needed

    ```json
    "limits": {
        "outbound": "1000.000000000000000000",
        "inbound": {
            "Ethereum": "100.000000000000000000",
            "Arbitrum": "50.000000000000000000"
        }
    }
    ```

     - `outbound` - sets the maximum tokens allowed to leave the chain
     - `inbound` - configure per-chain receiving limits for tokens arriving from specific chains

3. **Push the configuration** - use the NTT CLI to synchronize the updated configuration with the blockchain

    ```bash
    ntt push
    ```

4. **Verify the changes** - after pushing, confirm the new rate limits by checking the deployment status

    ```bash
    ntt status
    ```

???- note "`deployment.json` example"
    ```json
    {
        "network": "Testnet",
        "chains": {
            "Sepolia": {
                "version": "1.1.0",
                "mode": "burning",
                "paused": false,
                "owner": "0x0088DFAC40029f266e0FF62B82E47A07467A0345",
                "manager": "0x5592809cf5352a882Ad5E9d435C6B7355B716357",
                "token": "0x5CF5D6f366eEa7123BeECec1B7c44B2493569995",
                "transceivers": {
                    "threshold": 1,
                    "wormhole": {
                        "address": "0x91D4E9629545129D427Fd416860696a9659AD6a1",
                        "pauser": "0x0088DFAC40029f266e0FF62B82E47A07467A0345"
                    }
                },
                "limits": {
                    "outbound": "184467440737.095516150000000000",
                    "inbound": {
                        "ArbitrumSepolia": "500.000000000000000000"
                    }
                },
                "pauser": "0x0088DFAC40029f266e0FF62B82E47A07467A0345"
            }
        }
    }
    ```

## Queuing Mechanism

When a transfer exceeds the rate limit, it is held in a queue and can be released after the set rate limit duration has expired. The sending and receiving queuing behavior is as follows:

- **Sending** - if an outbound transfer violates rate limits, users can either revert and try again later or queue their transfer. Users must return after the queue duration has expired to complete sending their transfer
- **Receiving** - if an inbound transfer violates rate limits, it is in a queue. Users or relayers must return after the queue duration has expired to complete receiving their transfer on the destination chain

Queuing is configured dynamically during each transfer by passing the `shouldQueue` parameter to the [transfer function](https://github.com/wormhole-foundation/native-token-transfers/blob/5e7ceaef9a5e7eaa13e823a67c611dc684cc0c1d/evm/src/NttManager/NttManager.sol#L171-L182){target=\_blank} in the `NttManager` contract.

## Cancel Flows

If users bridge frequently between a given source chain and destination chain, the capacity could be exhausted quickly. Loss of capacity can leave other users rate-limited, potentially delaying their transfers.  The outbound transfer cancels the inbound rate limit on the source chain to avoid unintentional delays. This allows for refilling the inbound rate limit by an amount equal to the outbound transfer amount and vice-versa, with the inbound transfer canceling the outbound rate limit on the destination chain and refilling the outbound rate limit with an amount.