---
title: Wormhole Finality | Consistency Levels
description: This page documents how long to wait for finality before signing, based on each chain’s consistency (finality) level and consensus mechanism.
categories: Reference
---

# Wormhole Finality

Wormhole allows integrators to specify the finality level at which a VAA is verified. This determines how long the Guardians wait before attesting to a message.

These options provide different trade-offs between latency and re-org resistance:

- `instant` is sufficient when low latency is required and limited reorg risk is acceptable.
- `safe` provides additional protection while maintaining reasonable latency.
- `finalized` offers the strongest guarantees but increases confirmation time.

`finalized` provides the strongest protection against chain re-orgs. Selecting `instant`, `safe`, or a custom finality level increases exposure to re-org risk and should be evaluated carefully based on the application's risk profile.

!!! warning

    Some Wormhole-supported EVM chains support setting a custom finality level. Wormhole Contributors recommend using this advanced feature with caution. Choosing a level of finality other than `finalized` — including `instant`, `safe`, or any custom configuration — on EVM chains exposes you to [re-org risk](https://www.alchemy.com/overviews/what-is-a-reorg){target=\_blank}. This is especially dangerous when moving assets cross-chain, because assets released or minted on the destination chain may not have been burned or locked on the source chain. This risk can extend to other types of cross-chain data, depending on your application. 

    Assumption of risk; no warranty; no liability. By selecting a Custom finality level, you acknowledge and accept all risk of chain re-orgs/rollbacks and any resulting loss, imbalance, or data inconsistency. Wormhole contributors, and their affiliates (“Wormhole Parties”) provide this feature “as is,” make no warranties of any kind, and will not be liable for any losses or damages arising from your selection or use of Custom finality. You are solely responsible for appropriate safeguards (e.g., caps, delays, monitoring, circuit breakers).
    
    See the [Custom Consistency Levels](#custom-consistency-levels-advanced) section.


The following table documents each chain's `consistencyLevel` values (i.e., finality reached before signing). The consistency level defines how long the Guardians should wait before signing a VAA. The finalization time depends on the specific chain's consensus mechanism. The consistency level is a `u8`, so any single byte may be used. However, a small subset has particular meanings. If the `consistencyLevel` isn't one of those specific values, the `Otherwise` column describes how it's interpreted.

--8<-- 'text/products/reference/consistency-levels/consistency-levels.md'

## Custom Consistency Levels (Advanced)

On supported EVM chains (currently Ethereum and Linea), integrators may specify a custom consistency level. See the [white paper](https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0001_generic_message_passing.md#custom-handling){target=\_blank} to learn how this works. 

!!!warning
    **Custom finality is an advanced feature and Wormhole Contributors recommend to use this with caution.** Custom consistency should only be used when standard finality options do not meet the application’s requirements. Most integrations **do not** require custom consistency levels. Using custom finality exposes users to re-org risk. Lower finality levels increase the chance that a source-chain transaction may be reverted after assets are released or minted on the destination chain. Custom finality should be used only with a clear understanding of these risks.
    
How to select a Custom Finality Level:

- For L1s: Wormhole Contributors recommend referring to information on forked blocks in blockchain explorers such as [Etherscan](https://etherscan.io/blocks_forked?p=1){target=\_blank}, [Polygonscan](https://polygonscan.com/blocks_forked){target=\_blank}, and others, paying specific attention to the “ReorgDepth” column. Polygon, for instance, has been known to have reorgs with a depth of up to 128 blocks! 
- For L2s: Wormhole Contributors recommend reviewing L2 block explorers as well as details around whether the sequencer is centralized and how the L2 RPC node treats finality. Typically, the risks one is exposed to when not waiting for full finality from an L2 are: (1) a centralized (or compromised) sequencer censoring transactions, (2) re-orgs if sequencing is not centralized, and (3) L1 reorg risk and the L2 sequencer not re-submitting the transaction batch to the L1.


### CCL Contract Addresses

Custom Consistency Level (CCL) enables advanced finality control for EVM chains. CCL is currently supported on select EVM chains. The contract addresses below are the on-chain contracts queried when 203 (Custom) is used.

=== "Mainnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr><tr><td>Linea</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr></tbody></table>

=== "Testnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr><tr><td>Sepolia</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr><tr><td>Linea</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr></tbody></table>

=== "Devnet"

    <table data-full-width="true" markdown><thead><tr><th>Chain Name</th><th>Contract Address</th></tr></thead><tbody><tr><td>Ethereum</td><td><code>0x6A4B4A882F5F0a447078b4Fd0b4B571A82371ec2</code></td></tr></tbody></table>