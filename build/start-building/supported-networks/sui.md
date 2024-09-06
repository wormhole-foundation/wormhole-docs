---
title: Sui
description: Learn how to work with Wormhole in the Sui ecosystem with dev tools, address formats, emitter details, and contract info for MainNet, TestNet, and local networks.
---

# Sui

This page contains details for working with Sui chains.

## Developer Tools

You can install the Sui development tools using `cargo install`:

```sh
cargo install --locked \
    --git https://github.com/MystenLabs/sui.git \
    --rev 09b2081498366df936abae26eea4b2d5cafb2788 \
    sui sui-faucet
```

## Addresses

Because Wormhole works with many environments, the Wormhole address format is normalized. For Sui-based chains, no normalization is needed for standard addresses since they're already 32 bytes. E.g., `0x84a5f374d29fc77e370014dce4fd6a55b58ad608de8074b0be5571701724da31` remains the same with no changes.

## Emitter 

On Sui, the emitter is the object ID of the emitter capability.

## Sui

### Ecosystem

- [Website](https://sui.io/){target=_blank}
- [SuiVision Block Explorer](https://suivision.xyz/){target=_blank} | [Suiscan](https://suiscan.xyz/){target=_blank}
- [Developer Docs](https://docs.sui.io/){target=_blank} | [Faucet](https://docs.sui.io/build/faucet){target=_blank}

### Wormhole Details

- Name: `sui`
- Chain ID: `21`
- Contract Source: No source file

### Consistency Levels

The options for [`consistencyLevel`](/build/reference/consistency-levels/) (i.e., finality) are:

|Level|Value|
|-----|-----|
|Finalized|0|

This field may be ignored since the chain provides instant finality.

For more information, see [the Sui consensus docs](https://docs.sui.io/concepts/sui-architecture/consensus){target=_blank}.

=== "MainNet `35834a8a`"

    |    Type    |                                                                                                                                         Contract                                                                                                                                         |
    |:----------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Core    | [`0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c`](https://suivision.xyz/object/0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c){target=_blank} |
    | Token Bridge | [`0xc57508ee0d4595e5a8728974a4a93a787d38f339757230d441e895422c07aba9`](https://suivision.xyz/object/0xc57508ee0d4595e5a8728974a4a93a787d38f339757230d441e895422c07aba9){target=_blank} |
    | NFT Bridge   | N/A                                                                                                                                                              |

=== "TestNet `4c78adac`"

    |    Type    |                                                                                                                                                   Contract                                                                                                                                                   |
    |:----------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    |    Core    | [`0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790`](https://suiscan.xyz/testnet/object/0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790){target=_blank} |
    | Token Bridge | [`0x6fb10cdb7aa299e9a4308752dadecb049ff55a892de92992a1edbd7912b3d6da`](https://suiscan.xyz/testnet/object/0x6fb10cdb7aa299e9a4308752dadecb049ff55a892de92992a1edbd7912b3d6da){target=_blank} |
    | NFT Bridge   | N/A                                                                                                                                                                                  |

=== "Local Network"

    |    Type    |                                  Contract                                   |
    |:----------:|:----------------------------------------------------------------------------:|
    |    Core    | `0x12253210c90f89e7a8525e6c52d41309ff5bfb31f43f561b5fe6f50cd72f9668` |
    | Token Bridge | `0x830ed228c6f1bcb40003bb49af3277df2cbf933d63a6bcdcb0ba4580a1a7654e` |
    | NFT Bridge   | N/A                                                                      |
