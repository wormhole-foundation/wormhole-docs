---
title: Gateway
description: TODO
---

<!--
[link](#){target=\_blank}
![img description](/images/learn/introduction/introduction-1.webp)
`
```js
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```
=== "Testnet"
```sh
```
```text
```
- `variable` ++"type"++ - description
-->

# Gateway 

## Overview

_Wormhole Gateway_ is a Cosmos-SDK chain that provides a way to bridge non-native assets into the Cosmos ecosystem and serves as a source for unified liquidity across Cosmos chains.

!!! note
    Because IBC is used to bridge assets from Gateway to Cosmos chains, liquidity fragmentation is avoided and liquidity for foreign assets bridged via Wormhole into Cosmos is unified across Cosmos chains.

In addition to facilitating asset transfers, _Wormhole Gateway_ (FKA `wormchain`, AKA `Shai-Hulud`) allows Wormhole to ensure proper accounting with the [accountant](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0011_accountant.md){target=\_blank}. 

## Details

Wormhole Gateway is implemented as a set of contracts and modules.

The contract addreses for these components are:

|   **Contract**  |  **Mainnet Address**  |   **Testnet Address**    |
|:---------------:|:---------------------:|:------------------------:|
| **Wormhole core bridge** | `wormhole1ufs3tlq4umljk0qfe8k5ya0x6hpavn897u2cnf9k0en9jr7qarqqaqfk2j` |  `wormhole16jzpxp0e8550c9aht6q9svcux30vtyyyyxv5w2l2djjra46580wsazcjwp` |
| **Wormhole token bridge** | `wormhole1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjq4lyjmh` | `wormhole1aaf9r6s7nxhysuegqrxv0wpm27ypyv4886medd3mrkrw6t4yfcnst3qpex` |
| **IBC Translator** | `wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx` | `wormhole1ctnjk7an90lz5wjfvr3cf6x984a8cjnv8dpmztmlpcq4xteaa2xs9pwmzk` |

### Wormhole Core Contracts

The [core contracts](#){target=\_blank} to emit messages and verify [Guardian](/learn/infrastructure/guardians/){target=\_blank} signatures are still required on each Cosmos chain that requires generic message passing. Notably, for Gateway token bridging, no core contracts need be deployed. <!-- link core contracts -->

## Integration

## Data Structures

## Fee Structure

## See Also <!-- rename -->