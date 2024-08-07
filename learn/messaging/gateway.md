---
title: Gateway
description: TODO
---

<!--
[link](#){target=\_blank}
![img description](/images/learn/introduction/introduction-1.webp)
`
```ts
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```
=== "Testnet"
```sh
```
```text
```
- `variable` ++"type"++ - description
-->

# Gateway 

## Overview

_Wormhole Gateway_ is a Cosmos-SDK chain that provides a way to bridge non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains.

!!! note
    Because IBC is used to bridge assets from Gateway to Cosmos chains, liquidity fragmentation is avoided and liquidity for foreign assets bridged via Wormhole into Cosmos is unified across Cosmos chains.

In addition to facilitating asset transfers, _Wormhole Gateway_ (FKA `wormchain`, AKA `Shai-Hulud`) allows Wormhole to ensure proper accounting with the [accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank}. 

## Details

Wormhole Gateway is implemented as a set of contracts and modules.

The contract addreses for these components are:

|   **Contract**  |  **Mainnet Address**  |   **Testnet Address**    |
|:---------------:|:---------------------:|:------------------------:|
| **Wormhole core bridge** | `wormhole1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqqaqfk2j` |  `wormhole16jzpxp0e8550c9aht6q9svcux30vtyyyyxv5w2l2djjra46580wsazcjwp` |
| **Wormhole token bridge** | `wormhole1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjq4lyjmh` | `wormhole1aaf9r6s7nxhysuegqrxv0wpm27ypyv4886medd3mrkrw6t4yfcnst3qpex` |
| **IBC Translator** | `wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx` | `wormhole1ctnjk7an90lz5wjfvr3cf6x984a8cjnv8dpmztmlpcq4xteaa2xs9pwmzk` |

### Wormhole Core Contracts

The [core contracts](/learn/messaging/core-contracts/){target=\_blank} to emit messages and verify [Guardian](/learn/infrastructure/guardians/){target=\_blank} signatures are still required on each Cosmos chain that requires generic message passing. Notably, for Gateway token bridging, no core contracts need be deployed.

### IBC Shim Contract

A CosmWasm contract that handles bridging into and out of the Cosmos ecosystem by translating between Wormhole and IBC message formats. It maintains a mapping of `chainId -> channelId` for whitelisted IBC channels to send packets over and accept packets from.

The contract supports transfers into the Cosmos ecosystem by receiving [Contract Controlled Transfer VAAs](/learn/infrastructure/vaas/){target=\_blank}.

The logical flow of this type of transfer is as follows:

1. Redeem the VAA against the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank}
2. Mint [Token Factory](/learn/messaging/gateway/#token-factory-module){target=\_blank} tokens
3. Decode the additional payload as a `GatewayIbcTokenBridgePayload`
4. Send tokens via IBC to destination cosmos chains

The contract also supports transfers out of the Cosmos ecosystem by implementing an `execute` handler which accepts a `GatewayIbcTokenBridgePayload` and an amount of tokenfactory tokens in `info.funds` (which are the tokens to be bridged out).

The logical flow for this type of transfer is as follows:

1. Burn the [Token Factory](/learn/messaging/gateway/#token-factory-module){target=\_blank} tokens
2. Unlock the CW20 tokens
3. Grant approval to the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} to spend the CW20 Tokens
4. Call `InitiateTransfer` or `InitiateTransferWithPayload` based on whether the `GatewayIbcTokenBridgePayload` is of type `Simple` or `ContractControlled`

### Token Factory Module

A deployment of the canonical [Token Factory](https://github.com/CosmosContracts/juno/tree/v14.1.1/x/tokenfactory){target=\_blank} module on Wormhole Gateway to create new tokens.

### IBC Composability Middleware

The IBC Composability Middleware sits on top of the PFM (Packet Forwarding Module) and IBC Hooks middleware to compose the two together. It enables integrators on Cosmos chains to support both the `Cosmos -> Cosmos` and `Cosmos -> External` flows with a single payload structure.

It accepts a payload of `GatewayIbcTokenBridgePayload` and determines whether to call the PFM or IBC Hooks middleware by looking up the `chainId` in the payload.

- If the `chainId` is an IBC-enabled chain, it formats a payload for the PFM to forward the ICS20 transfer to the IBC-enabled destination chain.
- If the `chainId` is an external chain, it will format a payload for the IBC Hooks middleware to call the IBC Shim contract’s execute handler to bridge out.

### IBC Hooks Middleware

A deployment of the [IBC Hooks Middleware](https://github.com/osmosis-labs/osmosis/tree/v15.2.0/x/ibc-hooks){target=\_blank} on Wormhole Gateway allows ICS-20 token transfers to also initiate contract calls.

## Integration

Integration with Wormhole Gateway can be accomplished with a few lines of code and supports

- Transfers from an External Chain to any supported Cosmos Chain, see [Into Cosmos](/learn/messaging/gateway/#into-cosmos){target=\_blank}
- Transfers from any supported Cosmos Chain to an External Chain, see [Out of Comsos](/learn/messaging/gateway/#out-of-cosmos){target=\_blank}
- Transfers between any supported Cosmos Chains, see [Between Cosmos Chains](/learn/messaging/gateway/#between-cosmos-chains){target=\_blank}

### Into Cosmos

To bridge assets into a Cosmos chain, an asset transfer is initiated on the foreign chain with a [payload](/learn/messaging/gateway/#data-structures){target=\_blank} that is understood by the Gateway, or more specifically, the [IBC Shim Contract](/learn/messaging/gateway/#ibc-shim-contract){target=\_blank}.

Once received on the Gateway, the asset's CW20 representation is sent to the destination chain through IBC using the well established [ICS20 protocol](https://github.com/cosmos/ibc/tree/main/spec/app/ics-020-fungible-token-transfer){target=\_blank}.

An example using the [SDK](#){target=\_blank}: <!-- link to legacy SDK -->

```js
--8<-- 'code/learn/messaging/gateway/into-cosmos.js'
```

### Out of Cosmos

To bridge assets out of the Cosmos ecosystem or between Cosmos chains, an IBC transfer is initiated on the source chain to the Gateway with a payload containing details about the transfer in the `memo` field.

For example, using [cosmjs](https://github.com/cosmos/cosmjs){target=\_blank}:

```js
--8<-- 'code/learn/messaging/gateway/out-cosmo.js'
```

### Between Cosmos Chains

## Data Structures

**GatewayIbcTokenBridgePayload**

## Fee Structure

### Fees Required

### Fees Not Required

## See Also <!-- rename -->