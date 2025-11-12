---
title: Wormhole Finality | Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
categories: Reference
url: https://wormhole.com/docs/products/reference/consistency-levels/
---

# Wormhole Finality

The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.



| Ethereum | 200 | 201 |  | finalized | ~ 19min | Details |
| Solana |  | 0 | 1 |  | ~ 14s | Details |
| Algorand |  |  | 0 |  | ~ 4s | Details |
| Aptos |  |  | 0 |  | ~ 4s | Details |
| Arbitrum | 200 | 201 |  | finalized | ~ 18min | Details |
| Avalanche | 200 |  |  | finalized | ~ 2s | Details |
| Base | 200 | 201 |  | finalized | ~ 18min |  |
| Berachain | 200 |  |  | finalized | ~ 4s |  |
| BNB Smart Chain | 200 | 201 |  | finalized | ~ 12s | Details |
| Celestia |  |  | 0 |  | ~ 5s |  |
| Celo | 200 |  |  | finalized | ~ 10s |  |
| Converge |  |  | 0 |  | ~ 7min |  |
| Cosmos Hub |  |  | 0 |  | ~ 5s |  |
| CreditCoin |  |  | 0 |  | ~ 60s |  |
| Dymension |  |  | 0 |  | ~ 5s |  |
| Evmos |  |  | 0 |  | ~ 2s |  |
| Fantom | 200 |  |  | finalized | ~ 5s |  |
| Fogo |  |  | 0 |  | ~ 14s |  |
| HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' } |  |  | 0 |  | ~ 2s |  |
| Injective |  |  | 0 |  | ~ 3s |  |
| Ink |  |  | 0 |  | ~ 9min |  |
| Kaia | 200 |  |  | finalized | ~ 1s |  |
| Kujira |  |  | 0 |  | ~ 3s |  |
| Mantle | 200 | 201 |  | finalized | ~ 18min |  |
| Mezo |  |  | 0 |  | ~ 8s |  |
| Moca |  |  | 0 |  | ~ 1s |  |
| Monad |  |  | 0 |  | ~ 2s |  |
| Moonbeam | 200 | 201 |  | finalized | ~ 24s | Details |
| NEAR |  |  | 0 |  | ~ 2s | Details |
| Neutron |  |  | 0 |  | ~ 5s |  |
| Optimism | 200 | 201 |  | finalized | ~ 18min |  |
| Osmosis |  |  | 0 |  | ~ 6s |  |
| Plasma |  |  | 0 |  | ~ 3s |  |
| Plume |  |  | 0 |  | ~ 18min |  |
| Polygon | 200 |  |  | finalized | ~ 6s | Details |
| Scroll | 200 |  |  | finalized | ~ 50min |  |
| Sei |  |  | 0 |  | ~ 1s |  |
| Seievm |  |  | 0 |  | ~ 1s |  |
| Sonic |  |  | 0 |  | ~ 1s |  |
| Stacks |  |  | 0 |  | ~ 61min |  |
| Stargaze |  |  | 0 |  | ~ 5s |  |
| Sui |  |  | 0 |  | ~ 3s | Details |
| Unichain | 200 | 201 |  | finalized | ~ 18min |  |
| World Chain |  |  | 0 |  | ~ 18min |  |
| X Layer | 200 | 201 |  | finalized | ~ 16min |  |
| XRPL-EVM |  |  | 0 |  | ~ 10s |  |
