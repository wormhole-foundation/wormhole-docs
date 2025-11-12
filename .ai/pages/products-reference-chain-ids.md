---
title: Chain IDs
description: This page documents the Wormhole-specific chain IDs for each chain and contrasts them to the more commonly referenced EVM chain IDs originating in EIP-155.
categories: Reference
url: https://wormhole.com/docs/products/reference/chain-ids/
---

# Chain IDs

The following table documents the chain IDs used by Wormhole and places them alongside the more commonly referenced [EVM Chain IDs](https://chainlist.org/){target=\_blank}.

!!! note
    Please note, Wormhole chain IDs are different than the more commonly referenced [EVM chain IDs](https://chainlist.org/){target=\_blank}, specified in the Mainnet and Testnet ID columns.

!!!warning
    Wormhole Contributors recommend that all connected chains implement robust security practices including (but not exclusively): open sourcing code and running public bug bounty programs, undergoing security audits and publishing those reports, using version control with adequate access controls and mandatory code review, and high unit and integration test coverage where the results of those tests are available publicly. Connected chains that can't verifiably prove that they've implemented a high percentage of these practices may be noted below with the :warning: symbol. 
    
    Wormhole integrators are encouraged to understand the security assumptions of any chain before trusting messages from it. See the recommended security practices for chains in [Wormhole's security program](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#chain-integrators){target=\_blank}.



=== "Mainnet"

    | Ethereum | 2 | 1 |
| Solana | 1 | Mainnet Beta-5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d |
| Algorand | 8 | mainnet-v1.0 |
| Aptos | 22 | 1 |
| Arbitrum | 23 | Arbitrum One-42161 |
| Avalanche | 6 | C-Chain-43114 |
| Base | 30 | Base-8453 |
| Berachain | 39 |  |
| BNB Smart Chain | 4 | 56 |
| Celestia | 4004 | celestia |
| Celo | 14 | 42220 |
| Converge | 53 |  |
| Cosmos Hub | 4000 | cosmoshub-4 |
| CreditCoin | 59 |  |
| Dymension | 4007 | dymension_1100-1 |
| Evmos | 4001 | evmos_9001-2 |
| Fantom | 10 | 250 |
| Fogo | 51 |  |
| HyperCore | 65000 | 20000 |
| HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' } | 47 |  |
| Injective | 19 | injective-1 |
| Ink | 46 |  |
| Kaia | 13 | 8217 |
| Kujira | 4002 | kaiyo-1 |
| Linea | 38 | 59144 |
| Mantle | 35 | 5000 |
| Mezo | 50 |  |
| Moca | 63 | 2288 |
| Monad | 48 |  |
| Moonbeam | 16 | 1284 |
| NEAR | 15 | mainnet |
| Neutron | 4003 | neutron-1 |
| Noble | 4009 | noble-1 |
| Optimism | 24 | 10 |
| Osmosis | 20 | osmosis-1 |
| Plasma | 58 |  |
| Plume | 55 | 98866 |
| Polygon | 5 | 137 |
| Provenance | 4008 | pio-mainnet-1 |
| Pythnet | 26 |  |
| Scroll | 34 | 534352 |
| SEDA | 4006 |  |
| Sei | 32 | pacific-1 |
| Seievm | 40 |  |
| Sonic | 52 | 146 |
| Stacks | 60 | 1 |
| Stargaze | 4005 | stargaze-1 |
| Sui | 21 | 35834a8a |
| Unichain | 44 |  |
| World Chain | 45 | 480 |
| X Layer | 37 | 196 |
| XRPL-EVM | 57 | 1440000 |

=== "Testnet"

    | Ethereum Holesky | 10006 | Holesky-17000 |
| Ethereum Sepolia | 10002 | Sepolia-11155111 |
| Solana | 1 | Devnet-EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG |
| Algorand | 8 | testnet-v1.0 |
| Aptos | 22 | 2 |
| Arbitrum Sepolia | 10003 | Sepolia-421614 |
| Avalanche | 6 | Fuji-43113 |
| Base Sepolia | 10004 | Base Sepolia-84532 |
| Berachain | 39 | 80084 |
| BNB Smart Chain | 4 | 97 |
| Celestia | 4004 | mocha-4 |
| Celo | 14 | Alfajores-44787 |
| Converge | 53 | 52085145 |
| Cosmos Hub | 4000 | theta-testnet-001 |
| CreditCoin | 59 |  |
| Dymension | 4007 |  |
| Evmos | 4001 | evmos_9000-4 |
| Fantom | 10 | 4002 |
| Fogo | 51 | 9GGSFo95raqzZxWqKM5tGYvJp5iv4Dm565S4r8h5PEu9 |
| HyperCore | 65000 | 20000 |
| HyperEVM :material-alert:{ title='⚠️ The HyperEVM integration is experimental, as its node software is not open source. Use Wormhole messaging on HyperEVM with caution.' } | 47 | 998 |
| Injective | 19 | injective-888 |
| Ink | 46 | 763373 |
| Kaia | 13 | Kairos-1001 |
| Kujira | 4002 | harpoon-4 |
| Linea | 38 | 59141 |
| Mantle | 35 | Sepolia-5003 |
| Mezo | 50 | 31611 |
| Moca | 63 | 222888 |
| Monad | 48 | 10143 |
| Moonbeam | 16 | Moonbase-Alphanet-1287 |
| NEAR | 15 | testnet |
| Neutron | 4003 | pion-1 |
| Noble | 4009 | grand-1 |
| Optimism Sepolia | 10005 | Optimism Sepolia-11155420 |
| Osmosis | 20 | osmo-test-5 |
| Plasma | 58 |  |
| Plume | 55 | 98867 |
| Polygon Amoy | 10007 | Amoy-80002 |
| Provenance | 4008 |  |
| Pythnet | 26 |  |
| Scroll | 34 | Sepolia-534351 |
| SEDA | 4006 | seda-1-testnet |
| Sei | 32 | atlantic-2 |
| Seievm | 40 |  |
| Sonic | 52 | 57054 |
| Stacks | 60 | 2147483648 |
| Stargaze | 4005 |  |
| Sui | 21 | 4c78adac |
| Unichain | 44 | Unichain Sepolia-1301 |
| World Chain | 45 | 4801 |
| X Layer | 37 | 195 |
| XRPL-EVM | 57 | 1449000 |
