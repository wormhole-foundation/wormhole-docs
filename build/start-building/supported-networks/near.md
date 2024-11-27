---
title: NEAR
description: Learn how to work with Wormhole in the NEAR ecosystem with tools, address formats, contract details, and finality levels for various environments.
---

# NEAR

This page includes details for working with NEAR-environment chains

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For NEAR-based chains, because NEAR addresses are arbitrary-length strings, a Wormhole formatted address is the sha256 hash of the address. E.g., `contract.portalbridge.near` => `0x148410499d3fcda4dcfd68a1ebfcdddda16ab28326448d4aae4d2f0465cdfcb7`.

## Emitter 

The emitter address on NEAR chains is the sha256 digest of the program address string, normalized to Wormhole address format.

### Ecosystem

- [Website](https://near.org/){target=_blank}
- [Block Explorer](https://nearblocks.io/){target=_blank}
- [Developer Docs](https://docs.near.org/){target=_blank}

## Wormhole Details

- Name: `near`
- Chain ID: `15`
- Contract Source: No source file

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

| Level     | Value |
|-----------|-------|
| Finalized | 0     |

This field may be ignored since the chain provides instant finality.

For more information, see [the NEAR Consensus docs](https://nomicon.io/ChainSpec/Consensus){target=_blank}.

=== "Mainnet"

|     Type     |            Contract             |
|:------------:|:-------------------------------:|
|     Core     | `contract.wormhole_crypto.near` |
| Token Bridge |  `contract.portalbridge.near`   |

=== "Testnet"

|     Type     |          Contract           |
|:------------:|:---------------------------:|
|     Core     | `wormhole.wormhole.testnet` |
| Token Bridge |  `token.wormhole.testnet`   |

=== "Local Network"

|     Type     |       Contract       |
|:------------:|:--------------------:|
|     Core     | `wormhole.test.near` |
| Token Bridge |  `token.test.near`   |