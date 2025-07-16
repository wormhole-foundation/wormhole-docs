---
title: Token Bridge FAQs
description: Find answers to common questions about the Wormhole Token Bridge, including managing wrapped assets and understanding gas fees.
categories: Token Bridge, Transfer
---

# Token Bridge FAQs

## Can ownership of wrapped tokens be transferred from the Token Bridge?

No, you cannot transfer ownership of wrapped token contracts from the [Token Bridge](/docs/products/token-bridge/overview/){target=\_blank} because the Token Bridge deploys and retains ownership of these contracts and tokens.

 - **On EVM chains**: When you attest a token, the Token Bridge deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the Token Bridge contract itself.
 - **On Solana**: The Token Bridge deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the Token Bridge.

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows the Token Bridge to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/main/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

## How do I update the metadata of a wrapped token?

Because wrapped tokens are deployed and controlled by the Token Bridge program, which is under the authority of the Wormhole Guardians, there is no direct way for you to update their metadata. Instead, you must coordinate with the respective block explorer teams to request and apply metadata changes.

## How do I calculate the current gas costs for Ethereum Mainnet VAA verification?

You can refer to the [core-bridge repository](https://github.com/nonergodic/core-bridge){target=\_blank} for guidance on how to calculate the current gas costs associated with verifying VAAs on Ethereum Mainnet. This repository provides up-to-date references and examples to help you gauge costs accurately.

## How can I update my wrapped token image on Solscan?

Updating the metadata (such as the token image, name, or symbol) of a wrapped token on [Solscan](https://solscan.io/){target=\_blank} requires [contacting the Solscan team](https://solscan.io/contactus){target=\_blank} directly. Wormhole cannot make these updates for you because the wrapped token contracts are owned and controlled by the Token Bridge, not individual developers or projects.

To request an update, contact Solscan via [support@solscan.io](mailto:support@solscan.io) or their [contact form](https://solscan.io/contactus){target=\_blank}.
