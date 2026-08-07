---
title: Supported Networks
description: Learn about the networks each Wormhole product supports, and explore links to documentation, official websites, and block explorers.
categories: Reference
---

Wormhole supports many blockchains across mainnet, testnet, and devnets across multiple runtimes. From Solana, Ethereum, Sui, Base, Avalanche, Polygon, Binance Smart Chain (BSC) and many more, Wormhole is constantly expanding.

For a list of live integrations, please read on.

!!! warning
    Wormhole requires that all connected chains implement robust security practices including (but not exclusively): open sourcing code and running public bug bounty programs, undergoing security audits and publishing those reports, using version control with adequate access controls and mandatory code review, and high unit and integration test coverage where the results of those tests are available publicly. Connected chains that can't verifiably prove that they've implemented a high percentage of these practices may be noted with the :warning: symbol in the docs. 
    
    Wormhole integrators are encouraged to understand the security assumptions of any chain before trusting messages from it. See the recommended security practices for chains in [Wormhole's security program](https://github.com/wormhole-foundation/wormhole/blob/main/SECURITY.md#chain-integrators){target=\_blank}.

## Live connections

A chain being present in the documentation or in the various Wormhole toolkits does not necessarily mean that the chain is currently connected to Wormhole. To check what chains are fully integrated and online at any given time, refer to [this dashboard](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet&view=byChain){target=\_blank} maintained by Wormhole contributors, or [this alternative one](https://wormhole.liquify.com/#chains){target=\_blank} hosted by one of the guardians.

## Wormhole Chain IDs

Wormhole chain IDs are different from the more commonly referenced [EVM chain IDs](https://chainlist.org/){target=\_blank}. They are Wormhole-specific unique identifiers (mostly sequential integers 1 and up) by which the protocol identifies different chains. For example, the Wormhole chain ID of Solana is 1, and Ethereum's is 2.

The authoritative source of truth of all Wormhole chain IDs [is this file](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/vaa/structs.go#L248/){target=\_blank} in the Wormhole reference implementation repository.

!!! Note
    Chains generally don't have separate chain IDs for testnet and mainnet, because there is no strong reason they should. Given that the guardian set (which signs the VAAs) is guaranteed to be different on testnet than on mainnet at all times, no testnet VAA can ever be accepted on mainnet or vica versa.
    
    However, if a testnet is deprecated/wiped and another is spun up in its place, Wormhole needs to differentiate between the new testnet and the old - otherwise, VAAs produced on the old testnet would be replayable on the new testnet. In those cases, a new chain ID is introduced for the new testnet, typically in the ~4000 range.