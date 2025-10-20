---
title: Live Crypto Price Widget
description: Learn how to fetch real-time crypto prices using Wormhole Queries and display them in a live widget powered by secure and verified Witnet data feeds.
categories: Queries
---

# Live Crypto Price Widget

:simple-github: [Source code on GitHub](https://github.com/wormhole-foundation/e2e-tutorial-live-crypto-prices){target=\_blank}

In this tutorial, you'll build a widget that displays live crypto prices using [Wormhole Queries](/docs/products/queries/overview/){target=\_blank} and [Witnet](https://witnet.io/){target=\_blank} data feeds. You'll learn how to request signed price data from the network, verify the response, and show it in a responsive frontend built with [Next.js](https://nextjs.org/){target=\_blank} and [TypeScript](https://www.typescriptlang.org/){target=\_blank}.

Wormhole Queries make it possible to fetch verified off-chain data directly on-chain or in web applications without needing your own oracle infrastructure. Each response is cryptographically signed by the [Wormhole Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank}, ensuring authenticity and preventing tampering. By combining Queries with Witnet's decentralized price feeds, you can access real-time, trustworthy market data through a single API call, without managing relayers or custom backends.

## Prerequisites

Before starting, make sure you have the following set up:

 - [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=\_blank} installed on your system
 - [Next.js](https://nextjs.org/docs/app/getting-started/installation){target=\_blank} project environment (you can use an existing one or create a new app)
 - A Wormhole Queries API key, you can get one from the Queries dashboard
 - Access to an EVM-compatible [testnet RPC](https://chainlist.org/?testnets=true){target=\_blank}, such as Arbitrum Sepolia
 - A [Witnet data feed identifier](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses){target=\_blank} (this tutorial uses the ETH/USD feed as an example)

!!! note
    You can use a different Witnet feed or testnet if you prefer. Make sure to update the environment variables later in this tutorial with the correct values for your setup.

## Project Setup

1. Create a new Next.js app:

    ```bash
    npx create-next-app@latest live-crypto-prices
    cd live-crypto-prices
    ```

    Enable TypeScript, Tailwind CSS, and the `src/` directory when prompted. Other options are up to you. 

2. Install dependencies:

    ```bash
    npm install @wormhole-foundation/wormhole-query-sdk axios ethers
    ```

3. Start the dev server to verify the base app:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the default Next.js welcome page.



