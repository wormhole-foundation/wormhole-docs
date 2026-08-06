---
title: Executor Addresses
description: Learn about the Wormhole Executor framework and find the link to the live Executor Explorer for up-to-date contract addresses.
categories: Reference
---

# Executor Addresses

!!! note "Live Executor Contract Addresses"
    The [Executor Explorer](https://wormholelabs-xyz.github.io/executor-explorer/#/addresses?endpoint=https%3A%2F%2Fexecutor.labsapis.com&env=Mainnet){target=\_blank} is a live tool for browsing active Executor deployments across chains. The canonical, up-to-date Executor addresses have moved there.

The Executor is a shared execution framework that delivers Wormhole messages across chains. It standardizes how message execution is requested, quoted, and performed, enabling any service or protocol to execute messages permissionlessly through on-chain contracts.

The Executor framework enables anyone to act as a relayer in a permissionless network that uses a request-and-quote model for message delivery. Instead of relying on a single, centralized relayer service, the Executor framework creates an open marketplace where multiple providers can compete to deliver messages based on signed execution quotes.

At its core, the Executor relies on Wormhole’s existing guarantees: messages are still secured by VAAs and verified by the Guardian network. By decentralizing message execution and supporting both EVM and non-EVM environments, the Executor framework enables developers to integrate Wormhole relaying with broader chain compatibility, without deploying or maintaining their own relayers.

Learn more in the [Executor Framework](/docs/protocol/infrastructure/relayers/executor-framework/){target=\_blank} guide.
