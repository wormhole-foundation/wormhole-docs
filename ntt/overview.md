---
title: Native Token Transfers Overview
description: Explore Wormhole's Native Token Transfers for flexible cross-chain transfers with full control over token behavior, security, and integration features.
categories: NTT, Transfer
---

# Native Token Transfers

Native Token Transfers (NTT) is an open-source and composable framework  for moving tokens between blockchains without relying on wrapped assets. It enables developers and protocol teams to maintain native token behavior, supply control, and unified token economics across chains.

Unlike traditional bridges that use wrapped assets—leading to fragmented liquidity and governance complexity—NTT uses canonical token deployments and a single mint-and-burn model to keep total supply in sync.

## Key Features

- [x] **No wrapped assets** – tokens retain their native format on each chain
- [x] **Canonical deployments** – one unified token identity across chain
- [x] **Supply control** – enforced mint-and-burn model maintains global supply integrity
- [x] **Composable** – open-source and extensible for widespread adoption and integration with other protocols
- [x] **Customizable controls** – configure rate limits, access control, and attestation thresholds

## Use Cases

Generally speaking, NTT can be used by developers building multichain dApps, token issuers creating and deploying a single token across multiple chains, and governance platforms utilizing native tokens for cross-chain voting and decision-making. Below are some specific use cases where NTT provides added value:

??? interface "Cross-chain swaps and liquidity aggregation"

    💡 Enable seamless swaps between chains with real-time liquidity routing.

    🛠 **Wormhole products used:**

    - [**Connect**](/docs/build/transfers/connect/overview/){target=\_blank} – handles user-friendly asset transfers
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – moves native assets across chains
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetches real-time prices for optimal trade execution

    🔗 **Used in:** Decentralized exchanges (DEXs) and liquidity aggregators

    🏗️ **Used by:** [StellaSwap](https://app.stellaswap.com/exchange/swap){target=\_blank}

??? interface "Borrowing and lending"

    💡 Let users borrow assets on one chain using collateral from another.

    🛠 **Wormhole products used:**

    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – moves loan requests and liquidations across chains
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – transfers collateral as native assets
    - [**Queries**](/docs/build/queries/overview/){target=\_blank} – fetches interest rates and asset prices in real-time

    🔗 **Used in:** Lending protocols and yield platforms
    
    🏗️ **Used by:** [Folks Finance](https://wormhole.com/case-studies/folks-finance){target=\_blank}

??? interface "Asset movement between Bitcoin and other chains"

    💡 Enable direct BTC transfers without wrapped assets.

    🛠 **Wormhole products used:**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – transfers BTC across chains

    🔗 **Used in:** Bitcoin DeFi and lightning network integrations
    
    🏗️ **Used by:** [Synonym](https://wormhole.com/case-studies/synonym){target=\_blank}

??? interface "Memecoin launchpads"

    💡 Launch and distribute memecoins across multiple chains, enabling cross-chain fund raising and liquidity access.

    🛠 **Wormhole products used:**

    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – enables native asset transfers for seamless fundraising
    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – facilitates cross-chain token distribution and claim processes

    🔗 **Used in:** Token launchpads, IDOs, and meme token ecosystems

??? interface "Gas abstraction"

    💡 Allow users to pay gas fees with any token across different networks, removing fric tion in multichain interactions.

    🛠 **Wormhole products used:**

    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – routes gas fee payments across chains
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – facilitates native token conversion for gas payments

    🔗 **Used in:** Wallets, dApps, and multichain user experience improvements

??? interface "Cross-chain payment widgets"

    💡 Allow merchants and platforms to accept payments in any token, auto-converting them into a desired asset.

    🛠 **Wormhole products used:**

    - [**Wormhole Connect**](/docs/build/transfers/connect/overview/){target=\_blank} – facilitates seamless payments in various tokens
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – ensures direct, native asset transfers

    🔗 **Used in:** E-commerce, Web3 payments, and subscription models

??? interface "Cross-chain staking"

    💡 Enable users to stake assets on one chain while earning rewards or securing networks on another.

    🛠 **Wormhole products used:**

    - [**Messaging**](/docs/learn/infrastructure/){target=\_blank} – moves staking rewards and governance signals across chains
    - [**Native Token Transfer**](/docs/build/transfers/native-token-transfers/){target=\_blank} – transfers staked assets natively between networks

    🔗 **Used in:** Liquid staking, cross-chain governance, and PoS networks
    
    🏗️ **Used by:** [Lido](https://lido.fi/){target=\_blank}

## Integration Process

The process for creating, deploying, and monitoring NTTs is as follows.

[timeline left(wormhole-docs/.snippets/text/build/transfers/ntt/ntt-deployment-process-timeline.json)]

## Deployment Models

NTT offers two deployment models, each catering to different token management needs:

- **Hub-and-spoke**

    Locks tokens on a central hub chain and mints equivalent tokens on destination spoke chains, preserving the canonical balance and enabling secure cross-chain transfers.

    Most suitable for existing token deployments that don't want to alter existing token contracts

- **Burn-and-mint**

    Burns tokens on the source chain and mints equivalent tokens on the destination chain, creating a native multichain token and simplifying the transfer process.

    Most suitable for new token deployments or projects willing to upgrade existing contracts

## Next Steps

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Start building**

    ---

    Follow these steps to begin the integration process and deploy NTT.

    [:custom-arrow: Get started]()

-   :octicons-tools-16:{ .lg .middle } **Learn how NTT works**

    ---

    Discover NTT's architecture and how it enables cross-chain token transfers.

    [:custom-arrow: Explore architecture]()

</div>