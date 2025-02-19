---
title: Contract Integrations FAQs
description: Frequently asked questions about integrating contracts with Wormhole, including ownership of wrapped tokens and developing custom relayers.
---

# Contract Integrations FAQs

## Can ownership of wrapped tokens be transferred from the Token Bridge?

No, you cannot transfer ownership of wrapped token contracts from the [Token Bridge](/docs/learn/transfers/token-bridge/){target=\_blank} because the Token Bridge deploys and retains ownership of these contracts and tokens.

 - **On EVM chains** - when you attest a token, the Token Bridge deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the Token Bridge contract itself
 - **On Solana** - the Token Bridge deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the Token Bridge

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows the Token Bridge to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/main/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

## How do I start developing a custom relayer?

Previously referred to as specialized relayers, custom relayers allow you to build and tailor relayers to fit your specific use case. To get started, refer to the following resources:

 - [Custom Relayers documentation](/docs/learn/infrastructure/relayer/#custom-relayers){target=\_blank}
 - [Relayer Engine](/docs/infrastructure/relayers/run-relayer/#get-started-with-the-relayer-engine){target=\_blank}
 - [Run a Custom Relayer](/docs/infrastructure/relayers/run-relayer/){target=\_blank}

These resources will guide you through building and deploying custom relayers tailored to your use case.

## Is there a way to use NTT tokens with chains that don't currently support NTT?

Yes. NTT tokens can be used with chains that do not support NTT by leveraging the [Token Bridge](/docs/learn/transfers/token-bridge/){target=\_blank}. For example:

- **Wrapped token scenario** - a token, such as the W token, can be bridged to non-NTT networks using the Token Bridge. When the token is bridged to a chain like Sui, a wrapped version of the token is created (e.g., Wrapped W token)
- **Unwrapping requirement** - tokens bridged using the Token Bridge cannot be directly transferred to NTT-supported chains. To transfer them, they must first be unwrapped on the non-NTT chain and then transferred via the appropriate mechanism
- **Messaging consistency** - the Token Bridge exclusively uses Wormhole messaging, ensuring consistent communication across all chains, whether or not they support NTT

This approach ensures interoperability while maintaining the integrity of the token's cross-chain movement.

## How do I update the metadata of a wrapped token?

Because wrapped tokens are deployed and controlled by the Token Bridge program, which is under the authority of the Wormhole Guardians, there is no direct way for you to update their metadata. Instead, you must coordinate with the respective block explorer teams to request and apply metadata changes.

## How do I calculate the current gas costs for Ethereum Mainnet VAA verification?

You can refer to the [core-bridge repository](https://github.com/nonergodic/core-bridge){target=\_blank} for guidance on how to calculate the current gas costs associated with verifying VAAs on Ethereum Mainnet. This repository provides up-to-date references and examples to help you gauge costs accurately.

## How can I update my wrapped token image on Solscan?

Updating the metadata (such as the token image, name, or symbol) of a wrapped token on Solscan requires contacting the Solscan team directly. Wormhole cannot make these updates for you because the wrapped token contracts are owned and controlled by the Token Bridge, not individual developers or projects.

To request an update, contact Solscan via [support@solscan.io](mailto:support@solscan.io) or their [contact form](https://solscan.io/contactus){target=\_blank}.