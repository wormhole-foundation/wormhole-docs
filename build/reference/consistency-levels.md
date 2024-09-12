---
title: Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
---

# Consistency Levels

The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.

| Chain           | Instant | Safe | Finalized | Otherwise | Time to Finalize | Details                                                                                                            |
|-----------------|---------|------|-----------|-----------|------------------|--------------------------------------------------------------------------------------------------------------------|
| Ethereum        | 200     | 201  |           | finalized | ~ 975&nbsp;s     | [Details](https://www.alchemy.com/overviews/ethereum-commitment-levels){target=_blank}                             |
| Solana          |         | 0    | 1         | finalized | ~ 14&nbsp;s      | [Details](https://docs.solana.com/cluster/commitments){target=_blank}                                              |
| Acala           | 200     |      |           | finalized | ~ 24&nbsp;s      |                                                                                                                    |
| Algorand        |         |      | 0         | finalized | ~ 4&nbsp;s       | [Details](https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality){target=_blank}            |
| Aptos           |         |      | 0         | finalized | ~ 4&nbsp;s       | [Details](https://aptos.dev/reference/glossary/#byzantine-fault-tolerance-bft){target=_blank}                      |
| Arbitrum        | 200     |      |           | finalized | ~ 1066&nbsp;s    | [Details](https://developer.arbitrum.io/tx-lifecycle){target=_blank}                                               |
| Avalanche       |         |      | 0         | finalized | ~ 2&nbsp;s       | [Details](https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality){target=_blank}    |
| Base            | 200     | 201  |           | finalized | ~ 1026&nbsp;s    |                                                                                                                    |
| BNB Smart Chain | 200     | 201  |           | finalized | ~ 48&nbsp;s      | [Details](https://docs.bnbchain.org/docs/learn/consensus){target=_blank}                                           |
| Celestia        | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Celo            | 200     |      |           | finalized | ~ 10&nbsp;s      |                                                                                                                    |
| Cosmos Hub      | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Dymension       | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Evmos           | 200     | 201  |           | finalized | ~ 2&nbsp;s       |                                                                                                                    |
| Fantom          | 200     |      |           | finalized | ~&nbsp;5 s       |                                                                                                                    |
| Injective       | 200     | 201  |           | finalized | ~ 3&nbsp;s       |                                                                                                                    |
| Karura          | 200     |      |           | finalized | ~ 24&nbsp;s      | [Details](https://wiki.polkadot.network/docs/learn-consensus){target=_blank}                                       |
| Klaytn          | 200     |      |           | finalized | ~ 1&nbsp;s       |                                                                                                                    |
| Kujira          | 200     | 201  |           | finalized | ~ 3&nbsp;s       |                                                                                                                    |
| Moonbeam        | 200     |      |           | finalized | ~ 24&nbsp;s      | [Details](https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints){target=_blank} |
| NEAR            |         |      | 0         | finalized | ~ 2&nbsp;s       | [Details](https://nomicon.io/ChainSpec/Consensus){target=_blank}                                                   |
| Neutron         | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Oasis           | 200     | 201  |           | finalized | ~ 12&nbsp;s      |                                                                                                                    |
| Optimism        | 200     |      |           | finalized | ~ 1026&nbsp;s    | [Details](https://community.optimism.io/docs/developers/bridge/comm-strategies/){target=_blank}                    |
| Osmosis         | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| Polygon         | 200     |      |           | finalized | ~ 66&nbsp;s      | [Details](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=_blank}                   |
| Sei             | 200     | 201  |           | finalized | ~ 1&nbsp;s       |                                                                                                                    |
| Stargaze        | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |
| Sui             |         |      | 0         | finalized | ~ 3&nbsp;s       | [Details](https://docs.sui.io/concepts/sui-architecture/consensus){target=_blank}                                  |
| Terra           | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| Terra2          | 200     | 201  |           | finalized | ~ 6&nbsp;s       |                                                                                                                    |
| XPLA            | 200     | 201  |           | finalized | ~ 5&nbsp;s       |                                                                                                                    |