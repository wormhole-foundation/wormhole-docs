---
title: Delegated Guardian Set
description: This page documents the chains for which a delegated guardian set is configured, where a subset of Guardians observes events on behalf of the full Guardian Set.
categories: Reference
---

# Delegated Guardian Set

For certain chains, the full set of 19 Guardian nodes is not required to each maintain full-node infrastructure. Instead, a **delegated guardian set** is configured — a configurable subset of Guardians designated to observe events on specific chains. The remaining Canonical Guardians rely on attested observations gossiped by Delegated Guardians to participate in VAA signing. See [the Delegated Guardian Sets whitepaper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0017_delegated_guardian_sets.md) for the full specification.

To see which guardian is a delegate for a chain, refer to the [delegated guardians section](https://wormhole-foundation.github.io/wormhole-dashboard/#/contracts?endpoint=Mainnet&view=byChain) of the Wormhole dashboard.

Alternatively, you may call the relevat function of the delegated guardian set smart contract on Ethereum to get the configuration yourself with tools like Foundry.

```sh
cast call 0x1462800febd49232798132e8c8b721aa86c4c209 "getConfig()((uint16,uint32,uint8,address[])[])"
```