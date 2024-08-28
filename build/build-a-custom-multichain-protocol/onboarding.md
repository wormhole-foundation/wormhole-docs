---
title: Gateway Onboarding Instructions
description: Guide for Cosmos chain developers to connect to Wormhole Gateway, enabling Ethereum-to-Cosmos bridging via governance proposals, IBC setup, and UI integration

Learn how to onboard your Cosmos chain to Wormhole Gateway, enabling Ethereum-to-Cosmos bridging via governance proposals, IBC setup, and UI integration
---

# Wormhole Gateway Onboarding Instructions

This page is for any Cosmos chain developer who wants to enable bridging from Gateway. Gateway is Wormhole's Cosmos chain that leverages the Wormhole Guardian network for easy bridging from Ethereum to Cosmos. For an overview of Gateway, see [The Gateway to Cosmos](https://wormhole.com/gateway/){target=\_blank}.

## Step 1 - Propose Adding Your Chain to the Wormhole Guardians

1. Open a new GitHub governance discussion under Wormhole Gateway by filling out the [Cosmos Chain Governance Proposal Template](https://github.com/wormhole-foundation/wormhole/discussions/new?category=gateway){target=\_blank}
2. Allow 96 hours for discussion and governance vote

## Step 2 - Join the Wormhole Discord

1. Join the [Wormhole Discord](https://discord.gg/wormholecrypto){target=\_blank}
2. Ping the moderator, Susu (`susu.wormhole`), to get added to the `#guardian-cosmos` channel

## Step 3 - Establish an IBC Connection

1. Allowlist your IBC relayer on Wormhole Gateway

    1. The IBC relayer should [generate an address via the `wormchaind` CLI](https://github.com/wormhole-foundation/wormhole/tree/main/wormchain){target=\_blank}
    2. Fill out the IBC relayer allowlist request template below and post the request in the `#guardian-cosmos` channel
    ???+ code "View IBC relayer allowlist request template"
        ```text
        --8<-- 'code/build/build-a-custom-multichain-protocol/gateway/IBCRelayerAllowlistTemplate.md'
        ```

2. Establish the IBC connection.

    1. Please ensure that the parameters `trusting_period` and `trust_threshold` are set to the safest values. For example:
        1. `Trust_threshold` should be 2/3.
        2. `Trusting_period` should be 2/3 of the unbonding period of your chain
    2. Please see [Wormchain Syncing documentation](https://github.com/wormhole-foundation/wormhole/blob/main/wormchain/syncing.md){target=\_blank} to learn how to set up your own Wormhole Gateway node to connect your IBC relayer to. Alternatively, you can browse and connect to available public nodes on the [Cosmos chain registry](https://github.com/cosmos/chain-registry/blob/master/gateway/chain.json){target=\_blank}
    2. Below, you'll find an example IBC relayer configuration for Wormhole Gateway

    ??? code "View example IBC Relayer configuration for Wormhole Gateway"
        ```toml
        --8<-- 'code/build/build-a-custom-multichain-protocol/gateway/gatewayIBCRelayerConfig.toml'
        ```

3. Share the IBC connection details in the `#guardian-cosmos` channel along with a request to the Wormhole Contributors to prepare governance for the IBC connection

    1. Allow 48 hours for governance vote on accepting this IBC channel

## Step 4 - Optional UI Integration with Wormhole Connect

[Wormhole Connect](https://wormhole.com/connect/){target=\_blank} is a seamless way to embed bridging directly to your app with three lines of code. [Integrating Connect](https://wormhole-connect-builder.netlify.app/){target=\_blank} is fast, customizable, and brings all the functionality and utility of Wormhole right into your own application. 

If you'd like to add your Cosmos chain into Wormhole Connect, please refer to these reference PRs. Wormhole Core Contributors will need to review your PRs prior to merging them.

1. [Add your Cosmos chain ID to the Wormhole SDK](https://github.com/wormhole-foundation/wormhole/pull/3381/files){target=\_blank}
2. [Add your Cosmos chain to Wormhole Connect](https://github.com/wormhole-foundation/wormhole-connect/pull/1009/files){target=\_blank}

## Step 5 - Register Assets

This final step involves registering bridged assets with the Cosmos Chain Registry and other relevant wallet and frontend registries.

1. Permissionlessly attest the assets you want to bridge into your chain (if not already attested) to Wormhole Gateway.
2. Raise relevant PRs to ensure that explorers, wallets, and other UIs recognize the Wormhole assets when they are bridged to your chain.
    1. Here is an [example PR adding Wormhole assets to Osmosis Mintscan](https://github.com/cosmostation/chainlist/pull/865){target=\_blank}

Congratulations! You’ve successfully connected your Cosmos chain to Gateway. If you have any questions or concerns, please contact Susu on the Wormhole Discord.