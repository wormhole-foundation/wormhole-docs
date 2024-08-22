---
title: Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
---

The following table documents the `consistencyLevel` values (i.e. finality reached before signing) or for each chain. The consistency level defines how long the Guardians should wait before signing a VAA. The amount of time for finalization depends on the specific chain's consensus mechanism. Consistency level is a `u8` so any single byte may be used, however a small subset have specific meanings. If the `consistencyLevel` is not one of those specific values, the `Otherwise` column describes how its interpreted.

| Chain           | Instant | Safe | Finalized | Otherwise | Time to Finalize | Details                                                                                                            |
|-----------------|---------|------|-----------|-----------|------------------|--------------------------------------------------------------------------------------------------------------------|
| Solana          |         | 0    | 1         | finalized | ~ 14s            | [Details](https://docs.solana.com/cluster/commitments){target=_blank}                                              |
| Ethereum        | 200     | 201  |           | finalized | ~ 975s           | [Details](https://www.alchemy.com/overviews/ethereum-commitment-levels){target=_blank}                             |
| Terra           | 200     | 201  |           | finalized | ~ 6s             |                                                                                                                    |
| BNB Smart Chain | 200     | 201  |           | finalized | ~ 48s            | [Details](https://docs.bnbchain.org/docs/learn/consensus){target=_blank}                                           |
| Polygon         | 200     |      |           | finalized | ~ 66s            | [Details](https://docs.polygon.technology/pos/architecture/heimdall/checkpoints/){target=_blank}                   |
| Avalanche       |         |      | 0         | finalized | ~ 2s             | [Details](https://docs.avax.network/build/dapp/advanced/integrate-exchange#determining-finality){target=_blank}    |
| Oasis           | 200     | 201  |           | finalized | ~ 12s            |                                                                                                                    |
| Algorand        |         |      | 0         | finalized | ~ 4s             | [Details](https://developer.algorand.org/docs/get-started/basics/why_algorand/#finality){target=_blank}            |
| Fantom          | 200     |      |           | finalized | ~ 5s             |                                                                                                                    |
| Karura          | 200     |      |           | finalized | ~ 24s            | [Details](https://wiki.polkadot.network/docs/learn-consensus){target=_blank}                                       |
| Acala           | 200     |      |           | finalized | ~ 24s            |                                                                                                                    |
| Klaytn          | 200     |      |           | finalized | ~ 1s             |                                                                                                                    |
| Celo            | 200     |      |           | finalized | ~ 10s            |                                                                                                                    |
| NEAR            |         |      | 0         | finalized | ~ 2s             | [Details](https://nomicon.io/ChainSpec/Consensus){target=_blank}                                                   |
| Moonbeam        | 200     |      |           | finalized | ~ 24s            | [Details](https://docs.moonbeam.network/builders/build/moonbeam-custom-api/#finality-rpc-endpoints){target=_blank} |
| Terra2          | 200     | 201  |           | finalized | ~ 6s             |                                                                                                                    |
| Injective       | 200     | 201  |           | finalized | ~ 3s             |                                                                                                                    |
| Osmosis         | 200     | 201  |           | finalized | ~ 6s             |                                                                                                                    |
| Sui             |         |      | 0         | finalized | ~ 3s             | [Details](https://docs.sui.io/concepts/sui-architecture/consensus){target=_blank}                                  |
| Aptos           |         |      | 0         | finalized | ~ 4s             | [Details](https://aptos.dev/reference/glossary/#byzantine-fault-tolerance-bft){target=_blank}                      |
| Arbitrum        | 200     |      |           | finalized | ~ 1066s          | [Details](https://developer.arbitrum.io/tx-lifecycle){target=_blank}                                               |
| Optimism        | 200     |      |           | finalized | ~ 1026s          | [Details](https://community.optimism.io/docs/developers/bridge/comm-strategies/){target=_blank}                    |
| Xpla            | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |
| Base            | 200     | 201  |           | finalized | ~ 1026s          |                                                                                                                    |
| Sei             | 200     | 201  |           | finalized | ~ 1s             |                                                                                                                    |
| Cosmoshub       | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |
| Evmos           | 200     | 201  |           | finalized | ~ 2s             |                                                                                                                    |
| Kujira          | 200     | 201  |           | finalized | ~ 3s             |                                                                                                                    |
| Neutron         | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |
| Celestia        | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |
| Stargaze        | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |
| Dymension       | 200     | 201  |           | finalized | ~ 5s             |                                                                                                                    |