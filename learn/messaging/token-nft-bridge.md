---
title: Token Bridge 
description: Learn about Wormhole's Token and NFT Bridge for cross-chain transfers using lock and mint mechanisms, ensuring secure and efficient asset movement.
---

# Token and NFT Bridge

## Token Bridge

!!! note
    Before a token transfer can be made, the token being transferred must exist as a wrapped asset on the target chain. This is done by [Attesting](/docs/learn/infrastructure/vaas/#attestation){target=\_blank} the token details on the target chain.

The Token Bridge contract allows token transfers between blockchains through a lock and mint mechanism, using the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} with a specific [payload](/docs/learn/infrastructure/vaas/#token-transfer){target=\_blank} to pass information about the transfer. 

The Token Bridge also supports sending tokens with some additional data in the form of arbitrary byte payload attached to the token transfer. This type of transfer is referred to as a [Contract Controlled Transfer](/docs/learn/infrastructure/vaas/#token-transfer-with-message){target=\_blank}.

While the [Core Contract](/docs/learn/infrastructure/core-contracts/){target=\_blank} has no specific receiver by default, transfers sent through the Token Bridge do have a specific receiver chain and address to ensure the tokens are minted to the expected recipient.

<!--
https://github.com/wormhole-foundation/wormhole/blob/main/whitepapers/0003_token_bridge.md 

Goals:
We want to implement a generalized token bridge using the Wormhole message passing protocol that is able to bridge any standards-compliant token between chains, creating unique wrapped representations on each connected chain on demand.
- Allow transfer of standards-compliant tokens between chains.
- Allow creation of wrapped assets.
- Use a universal token representation that is compatible with most VM data types.
- Allow domain-specific payload to be transferred along the token, enabling tight integration with smart contracts on the target chain.

Non-Goals:
- Support fee-burning / rebasing / non-standard tokens.
- Manage chain-specific token metadata that isn't broadly applicable to all chains.
- Automatically relay token transfer messages to the target chain.

OVERVIEW:   
On each chain of the token bridge network there will be a token bridge endpoint program.
These programs will manage authorization of payloads (emitter filtering), wrapped representations of foreign chain tokens ("Wrapped Assets") and custody locked tokens.



-->

## NFT Bridge

The NFT Bridge functions similarly to the Token Bridge but with special rules for what may be transferred and how the wrapped version is created on the destination chain.
