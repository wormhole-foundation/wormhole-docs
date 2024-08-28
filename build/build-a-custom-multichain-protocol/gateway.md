---
title: Wormhole Gateway Cosmos SDK
description: Use the Wormhole Gateway, a Cosmos SDK chain enabling asset bridging into the Cosmos ecosystem, unifying liquidity, and supporting cross-chain transfers.
---

# Wormhole Gateway

## Overview

Wormhole Gateway is a Cosmos SDK chain that provides a way to bridge non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains. Because IBC is used to bridge assets from Gateway to Cosmos chains, liquidity fragmentation is avoided, and liquidity for foreign assets bridged via Wormhole into Cosmos is unified across Cosmos chains. In addition to facilitating asset transfers, Wormhole Gateway allows Wormhole to ensure proper accounting with the [Global Accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank}. 

## Integration

Integrating with Wormhole Gateway is straightforward and can be achieved with just a few lines of code as follows:

- For Transfers from an external chain to any supported Cosmos Chain, see [Into Cosmos](#into-cosmos)
- For Transfers from any supported Cosmos Chain to an external chain, see [Out of Comsos](#out-of-cosmos)
- For Transfers between any supported Cosmos Chains, see [between Cosmos chains](#between-cosmos-chains)

### Into Cosmos

To bridge assets into a Cosmos chain, an asset transfer is initiated on the foreign chain with a [payload](#gatewayibctokenbridgepayload) that is understood by the Gateway, or more specifically, the IBC Shim Contract. Once received on the Gateway, the asset's CW20 representation is sent to the destination chain through IBC using the well-established [ICS20 protocol](https://github.com/cosmos/ibc/tree/main/spec/app/ics-020-fungible-token-transfer){target=\_blank}. 

The following example uses the [Wormhole SDK](/build/build-apps/wormhole-sdk) to prepare a bridge transfer from an external chain into Cosmos.

```ts
--8<-- 'code/build/build-a-custom-multichain-protocol/gateway/into-cosmos.ts'
```

### Out of Cosmos

To bridge assets out of the Cosmos ecosystem or between Cosmos chains, an IBC transfer is initiated on the source chain to the Gateway with a payload containing details about the transfer in the `memo` field.

The following example demonstrates using [CosmJS](https://github.com/cosmos/cosmjs){target=\_blank} to create an IBC transfer:

```ts
--8<-- 'code/build/build-a-custom-multichain-protocol/gateway/out-of-cosmos.ts'
```

### Between Cosmos Chains

From an implementation perspective, transfers between Cosmos chains behave exactly the same as [bridging out of Cosmos](#out-of-cosmos). The exception is that the chain ID passed is a Cosmos chain.

## Data Structures

### GatewayIbcTokenBridgePayload

The core data structure of Gateway token transfers is the `GatewayIbcTokenBridgePayload,` which contains details about the transfer that the Gateway uses to perform the transfer. 

```rust
--8<-- 'code/build/build-a-custom-multichain-protocol/gateway/GatewayIbcTokenBridgePayload.rs'
```

When sending a `GatewayIbcTokenBridge` payload, it must be serialized as JSON. The binary values are `base64` encoded for proper JSON encoding. The `recipient` for Cosmos chains are `base64` encoded `bech32` addresses. For example, if the `recipient` is `wormhole1f3jshdsmzl03v03w2hswqcfmwqf2j5csw223ls`, the encoding will be the direct `base64` encoding of `d29ybWhvbGUxZjNqc2hkc216bDAzdjAzdzJoc3dxY2Ztd3FmMmo1Y3N3MjIzbHM=`.

The `chain` values map to [Wormhole chain IDs](/learn/glossary/#chain-ids). The `fee` and `nonce` are Wormhole-specific parameters, both unused today. For incoming IBC messages from Cosmos chains, the `receiver` field will be base64 encoded in the `Simple.recipient`  field, and the `channel-id` will be included as the equivalent Wormhole chain ID.