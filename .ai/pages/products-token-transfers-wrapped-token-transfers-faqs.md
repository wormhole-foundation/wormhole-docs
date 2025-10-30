---
title: Wrapped Token Transfers (WTT) FAQs
description: Find answers to common questions about the Wormhole WTT, including managing wrapped assets and understanding gas fees.
categories: WTT, Transfer
url: https://wormhole.com/docs/products/token-transfers/wrapped-token-transfers/faqs/
---

# Wrapped Token Transfers (WTT) FAQs

## Can ownership of wrapped tokens be transferred from the WTT?

No. Ownership of wrapped token contracts cannot be transferred, because [WTT](/docs/products/token-transfers/wrapped-token-transfers/overview/){target=\_blank} deploys and retains control of these contracts and tokens.

 - **On EVM chains**: When you attest a token, WTT deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the WTT contract itself.
 - **On Solana**: The WTT deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the WTT contract.

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows WTT to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/main/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

## How do I update the metadata of a wrapped token?

Wrapped tokens are deployed and controlled by the WTT program under Guardian authority. You cannot update their metadata directly. Instead, you must coordinate with the respective block explorer teams to request and apply metadata changes.

## How do I calculate the current gas costs for Ethereum Mainnet VAA verification?

You can refer to the [core-bridge repository](https://github.com/nonergodic/core-bridge){target=\_blank} for guidance on how to calculate the current gas costs associated with verifying VAAs on Ethereum Mainnet. This repository provides up-to-date references and examples to help you gauge costs accurately.

## How can I update my wrapped token image on Solscan?

Updating the metadata (such as the token image, name, or symbol) of a wrapped token on [Solscan](https://solscan.io/){target=\_blank} requires [contacting the Solscan team](https://solscan.io/contactus){target=\_blank} directly. Wormhole cannot make these updates for you because the wrapped token contracts are owned and controlled by the WTT program, not individual developers or projects.

To request an update, contact Solscan via [support@solscan.io](mailto:support@solscan.io) or their [contact form](https://solscan.io/contactus){target=\_blank}.
