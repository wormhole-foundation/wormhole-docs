---
title: Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
---

# Consistency Levels

The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.

| Chain           | Instant | Safe | Finalized | Otherwise | Time to Finalize | Details                                                                                                            |
|-----------------|---------|------|-----------|-----------|------------------|--------------------------------------------------------------------------------------------------------------------|
| Solana          |         | 0    | 1         | finalized | ~ 14&nbsp;s      | [Details](https://docs.solana.com/cluster/commitments){target=_blank}                                              |
| Ethereum        | 200     | 201  |           | finalized | ~ 975&nbsp;s     | [Details](https://www.alchemy.com/overviews/ethereum-commitment-levels){target=_blank}                             |
| Terra           | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| BNB Smart Chain | 200     | 201  |           | finalized | ~ 48&nbsp;s      | [Details](https://docs.bnbchain.org/docs/learn/consensus){target=_blank}                                           |
| Polygon         | 200     |      |           | finalized | ~ 66&nbsp;s      | [Details](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=_blank}                   |
| Avalanche       |         |      | 0         | finalized | ~ 2&nbsp;s       | [Details](https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality){target=_blank}    |
| Oasis           | 200     | 201  |           | finalized | ~ 12&nbsp;s      |                                                                                                                    |
| Algorand        |         |      | 0         | finalized | ~ 4&nbsp;s       | [Details](https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality){target=_blank}            |
| Fantom          | 200     |      |           | finalized | ~&nbsp;5 s       |                                                                                                                    |
| Karura          | 200     |      |           | finalized | ~ 24&nbsp;s      | [Details](https://wiki.polkadot.network/docs/learn-consensus){target=_blank}                                       |
| Acala           | 200     |      |           | finalized | ~ 24&nbsp;s      |                                                                                                                    |
| Klaytn          | 200     |      |           | finalized | ~ 1&nbsp;s       |                                                                                                                    |
| Celo            | 200     |      |           | finalized | ~ 10&nbsp;s      |                                                                                                                    |
| NEAR            |         |      | 0         | finalized | ~ 2&nbsp;s       | [Details](https://nomicon.io/ChainSpec/Consensus){target=_blank}                                                   |
| Moonbeam        | 200     |      |           | finalized | ~ 24&nbsp;s      | [Details](https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints){target=_blank} |
| Terra2          | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| Injective       | 200     | 201  |           | finalized | ~ 3&nbsp;s       |                                                                                                                    |
| Osmosis         | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| Sui             |         |      | 0         | finalized | ~ 3&nbsp;s       | [Details](https://docs.sui.io/concepts/sui-architecture/consensus){target=_blank}                                  |
| Aptos           |         |      | 0         | finalized | ~ 4&nbsp;s       | [Details](https://aptos.dev/reference/glossary/#byzantine-fault-tolerance-bft){target=_blank}                      |
| Arbitrum        | 200     |      |           | finalized | ~ 1066&nbsp;s    | [Details](https://developer.arbitrum.io/tx-lifecycle){target=_blank}                                               |
| Optimism        | 200     |      |           | finalized | ~ 1026&nbsp;s    |                                                                                                                    |
| XPLA            | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Base            | 200     | 201  |           | finalized | ~ 1026&nbsp;s    |                                                                                                                    |
| Sei             | 200     | 201  |           | finalized | ~ 1&nbsp;s       |                                                                                                                    |
| Cosmos Hub      | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Evmos           | 200     | 201  |           | finalized | ~ 2&nbsp;s       |                                                                                                                    |
| Kujira          | 200     | 201  |           | finalized | ~ 3&nbsp;s       |                                                                                                                    |
| Neutron         | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Celestia        | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Stargaze        | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Dymension       | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |