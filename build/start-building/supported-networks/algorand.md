---
title: Algorand
description: Learn how to work with Wormhole in the Algorand ecosystem with tools, address formats, contract details, and finality levels for a variety of environments.
---

# Algorand

This page includes details for working with Algorand environment chains.

## Developer Tools

The recommended development tool for Algorand is [Algokit](https://developer.algorand.org/docs/get-started/algokit/){target=_blank}.

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For Algorand chains, a Wormhole formatted address is the 58-character address decoded from base32 with its checksum removed. E.g. `M7UT7JWIVROIDGMQVJZUBQGBNNIIVOYRPC7JWMGQES4KYJIZHVCRZEGFRQ` becomes `0x67e93fa6c8ac5c819990aa7340c0c16b508abb1178be9b30d024b8ac25193d45`.

Algorand also uses a uint64 for asset and application IDs. These are converted to 32 bytes by first converting to an 8-byte big-endian byte array, then padding with 24 bytes of zeroes. For example, `123` becomes `0x000000000000000000000000000000000000000000000000000000000000007b`.

## Emitter 

The emitter is the application address, normalized to the Wormhole address format. 

## Algorand

### Ecosystem

- [Website](https://algorand.com){target=_blank}
- [Allo Explorer](https://allo.info/){target=_blank} | [Pera Explorer](https://explorer.perawallet.app/){target=_blank}
- [Developer Docs](https://developer.algorand.org){target=_blank} | [Faucet](https://bank.testnet.algorand.network/){target=_blank}

### Wormhole Details

- Name: `algorand`
- Chain ID: `8`
- Contract Source: [algorand/wormhole_core.py](https://github.com/wormhole-foundation/wormhole/blob/main/algorand/wormhole_core.py){target=_blank}

### Consistency Levels

The options for [`consistencyLevel`](/docs/build/reference/consistency-levels/){target=\_blank} (i.e., finality) are:

|   Level   | Value |
|:---------:|:-----:|
| Finalized |   0   |

This field may be ignored since the chain provides instant finality.

For more information see [https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality](https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality){target=_blank}.

### Mainnet Contracts `mainnet-v1.0`

|     Type     |                                       Contract                                       |
|:------------:|:------------------------------------------------------------------------------------:|
|     Core     | [`842125965`](https://explorer.perawallet.app/application/842125965/){target=_blank} |
| Token Bridge | [`842126029`](https://explorer.perawallet.app/application/842126029/){target=_blank} |
|  NFT Bridge  |                                         N/A                                          |

### Testnet Contracts `testnet-v1.0`

|     Type     |                                          Contract                                          |
|:------------:|:------------------------------------------------------------------------------------------:|
|     Core     | [`86525623`](https://testnet.explorer.perawallet.app/application/86525623/){target=_blank} |
| Token Bridge | [`86525641`](https://testnet.explorer.perawallet.app/application/86525641/){target=_blank} |
|  NFT Bridge  |                                            N/A                                             |

### Local Network Contract

|     Type     | Contract |
|:------------:|:--------:|
|     Core     |  `1004`  |
| Token Bridge |  `1006`  |
|  NFT Bridge  |   N/A    |