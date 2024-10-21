---
title: Contract Integrations FAQs
description: Frequently asked questions about integrating contracts with Wormhole, including ownership of wrapped tokens and developing custom relayers.
---

# Contract Integrations FAQs

## Can ownership of wrapped tokens be transferred from the Token Bridge?

No, you cannot transfer ownership of wrapped token contracts from the [Token Bridge](/learn/messaging/token-nft-bridge/){target=\_blank} because the Token Bridge deploys and retains ownership of these contracts and tokens.

 - **On EVM chains** - when you attest a token, the Token Bridge deploys a new ERC-20 contract as a beacon proxy. The upgrade authority for these contracts is the Token Bridge contract itself
 - **On Solana** - the Token Bridge deploys a new SPL token, where the upgrade authority is a Program Derived Address (PDA) controlled by the Token Bridge

The logic behind deploying these token contracts involves submitting an attestation VAA, which allows the Token Bridge to verify and deploy the wrapped token contract on the destination chain.

Relevant contracts:

 - [Ethereum ERC-20](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/ethereum/contracts/bridge/token/Token.sol){target=\_blank}
 - [Solana SPL](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/solana/modules/token_bridge/program/src/api/create_wrapped.rs#L128-L145){target=\_blank}
 - [Attestation VAA and Token Contract Deployment Logic](https://github.com/wormhole-foundation/wormhole/blob/gateway-integration/ethereum/contracts/bridge/Bridge.sol#L385-L431){target=\_blank}

## How do I start developing a custom relayer?

Previously referred to as specialized relayers, custom relayers allow you to build and tailor relayers to fit your specific use case. To get started, refer to the following resources:

 - [Custom Relayers documentation](/docs/learn/infrastructure/relayer/#custom-relayers){target=\_blank}
 - [Relayer Engine](/docs/infrastructure/relayers/run-relayer/#get-started-with-the-relayer-engine){target=\_blank}
 - [Run a Custom Relayer](/docs/infrastructure/relayers/run-relayer/){target=\_blank}

These resources will guide you through building and deploying custom relayers tailored to your use case.