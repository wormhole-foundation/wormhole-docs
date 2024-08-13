---
title: Native Token Transfers - Deployment Models
description: Explore Wormhole's Native Token Transfers Deployment Models - Hub and Spoke, Burn and Mint for seamless cross-chain token transfers.
---

# Deployment Models

The Wormhole framework offers two deployment models, each catering to different token management needs: the Hub and Spoke model and the Burn and Mint model. These models provide flexible solutions for both existing token deployments and new projects looking to enable secure and seamless multichain token transfers.

## Hub and Spoke

The hub and spoke model involves locking tokens on a central hub chain and minting them on destination spoke chains. This model maintains the total supply on the hub chain and is backward-compatible with any existing token deployment.

This model is ideal for existing token deployments that do not want to alter existing token contracts. It maintains the canonical balance on a hub chain while allowing for secure native deployment to new blockchains.

- **Hub chain** - tokens are locked when initiating a transfer
- **Spoke chains** - Equivalent tokens are minted on the destination chain

When transferring back to the original hub chain, tokens are burned on the source spoke chain and unlocked on the hub chain. When transferring between spoke chains, tokens are burned on the source spoke chain and minted on the destination spoke chain.

## Burn and Mint

The burn and mint model involves burning tokens on the source chain and minting them on the destination chain. This results in a simplified multichain transfer process that distributes the total supply across multiple chains and produces a native multichain token.

This model best suits new token deployments or projects willing to upgrade existing contracts.

- **Source chain** - tokens are burned when initiating a transfer
- **Destination chain** - equivalent tokens are minted on the destination chain