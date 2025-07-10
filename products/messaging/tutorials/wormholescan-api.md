---
title: Explore NTT Tokens and Transfers with WormholeScan API
description: Learn how to query Native Token Transfer (NTT) tokens and transfer operations using the WormholeScan API.
---

# Query NTT Data and Transfers with WormholeScan

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/demo-wormholescan-api){target=\_blank}

The [WormholeScan API](https://wormholescan.io/#/developers/api-doc){target=\_blank} provides a public interface for exploring cross-chain activity powered by Wormhole. You can use it to fetch token transfer operations, [Native Token Transfer (NTT)](/docs/products/native-token-transfers/overview/) metadata, VAA details, and more.

In this tutorial, you'll learn how to build a simple TypeScript project that:

 - Lists NTT tokens available on Wormhole
 - Fetches metadata for a selected token across chains
 - Retrieves recent transfer operations using an emitter address

This guide is useful if you're building a dashboard, writing monitoring tools, or simply want to explore how data flows across Wormhole-connected chains.

We'll start from scratch and write everything step by step, no API keys or wallets required.

