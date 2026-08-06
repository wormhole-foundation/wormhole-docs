---
title: Delegated Guardian Set
description: This page documents the chains for which a delegated guardian set is configured, where a subset of Guardians observes events on behalf of the full Guardian Set.
categories: Reference
---

# Delegated Guardian Set

For certain chains, the full set of 19 Guardian nodes is not required to each maintain full-node infrastructure. Instead, a **delegated guardian set** is configured — a configurable subset of Guardians designated to observe events on specific chains. The remaining Canonical Guardians rely on attested observations gossiped by Delegated Guardians to participate in VAA signing. See [the Delegated Guardian Sets whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0017_delegated_guardian_sets.md) for the full specification.

The following table lists which chains use a delegated guardian set and the guardian set they are delegated to.

| Chain ID | Name       | Quorum | GS Size |
|----------|------------|--------|---------|
| 4        | BSC        | 5 /7   | 7       |
| 5        | Polygon    | 5 /7   | 7       |
| 6        | Avalanche  | 5 /7   | 7       |
| 8        | Algorand   | 5 /7   | 7       |
| 13       | Klaytn     | 5 /7   | 7       |
| 14       | Celo       | 5 /7   | 7       |
| 15       | Near       | 5 /7   | 7       |
| 16       | Moonbeam   | 5 /7   | 7       |
| 19       | Injective  | 5 /7   | 7       |
| 21       | Sui        | 5 /7   | 7       |
| 22       | Aptos      | 5 /7   | 7       |
| 23       | Arbitrum   | 5 /7   | 7       |
| 32       | Sei        | 5 /7   | 7       |
| 38       | Linea      | 5 /7   | 7       |
| 39       | Berachain  | 5 /7   | 7       |
| 40       | SeiEVM     | 5 /7   | 7       |
| 44       | Unichain   | 5 /7   | 7       |
| 45       | Worldchain | 5 /7   | 7       |
| 47       | HyperEVM   | 5 /7   | 7       |
| 48       | Monad      | 5 /7   | 7       |
| 50       | Mezo       | 5 /7   | 7       |
| 51       | Fogo       | 5 /7   | 7       |
| 55       | Plume      | 5 /7   | 7       |
| 57       | XRPLEVM    | 5 /7   | 7       |
| 59       | CreditCoin | 5 /7   | 7       |
| 63       | Moca       | 5 /7   | 7       |
| 64       | MegaETH    | 5 /7   | 7       |
| 67       | ZeroGravity| 5 /7   | 7       |
| 69       | Nexus      | 5 /7   | 7       |
