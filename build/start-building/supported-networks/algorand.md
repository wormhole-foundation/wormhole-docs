---
title: Algorand
description: Learn how to work with Wormhole in the Algorand ecosystem with tools, address formats, contract details, and finality levels for a variety of environments.
---

# Algorand

Details for working with Algorand environment chains.

## Developer Tools

The recommended development tool for Algorand is [Algokit](https://developer.algorand.org/docs/get-started/algokit/).

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized.

For Algorand chains, this means a wormhole formatted address is the 58 character address decoded from base32 with its checksum removed.

e.g. `M7UT7JWIVROIDGMQVJZUBQGBNNIIVOYRPC7JWMGQES4KYJIZHVCRZEGFRQ` => `0x67e93fa6c8ac5c819990aa7340c0c16b508abb1178be9b30d024b8ac25193d45`

Algorand also uses a uint64 for Asset and Application IDs. These are converted to a 32 bytes by first converting to a 8 byte big endian byte array, then padding with 24 bytes of 0s.

e.g. `123` => `0x000000000000000000000000000000000000000000000000000000000000007b`

## Emitter

The emitter is the application address, normalized to the wormhole address format.

<!--ALGORAND_CHAIN_DETAILS-->

## Algorand

### Quick Links

- [Network website](https://algorand.com){target=\_blank}
- [Developer documentation](https://developer.algorand.org){target=\_blank}
- [Allo](https://allo.info/){target=\_blank} | [Pera Explorer](https://explorer.perawallet.app/){target=\_blank}
- [Faucet](https://bank.testnet.algorand.network/){target=\_blank}

### Chain Details

- **Name** - `algorand`
- **Wormhole chain ID** - `8`
- **Network chain ID**:
    - **MainNet** - <code>mainnet-v1.0</code>
    - **TestNet** - <code>testnet-v1.0</code>
- **Contract source** - [algorand/wormhole_core.py](https://github.com/wormhole-foundation/wormhole/blob/main/algorand/wormhole_core.py){target=\_blank}

### Consistency Levels

The [consistency level](/build/reference/consistency-levels/) options (i.e., finality) are:

|Level|Value|
|-----|-----|
|Finalized|0|

!!! note
    This field may be ignored since the chain provides instant finality.

For more information, see [https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality](https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality){target=\_blank}

### Contracts

=== "MainNet"

    |Type|Contract|
    |----|--------|
    |Core|`842125965`|
    |Token Bridge|`842126029`|
    |NFT Bridge|**N/A**|

=== "TestNet"

    |Type|Contract|
    |----|--------|
    |Core|`86525623`|
    |Token Bridge|`86525641`|
    |NFT Bridge|**N/A**|

=== "Local Development"

    |Type|Contract|
    |----|--------|
    |Core|`1004`|
    |Token Bridge|`1006`|
    |NFT Bridge|**N/A**|

<!--ALGORAND_CHAIN_DETAILS-->