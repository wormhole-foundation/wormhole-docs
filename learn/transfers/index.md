---
title: Multichain Transfers
description: This section introduces the core messaging protocols that power seamless multichain communication and asset transfer within the Wormhole ecosystem.
---

# Multichain Transfers

These sections include information about Wormhole's transfer products to help you learn how they work and determine the best transfer product to fit your needs.

Use the following links to jump directly to each Wormhole transfer product information page or continue for a product comparison:

- [**Native Token Transfers (NTT)**](/docs/learn/transfers/native-token-transfers/) - a mechanism to transfer native tokens multichain seamlessly without converting to a wrapped asset
- [**Wormhole Settlement**](/docs/learn/transfers/settlement/) - a next-generation suite of intent protocols enabling fast multichain transfers, optimizing liquidity flows and interoperability without relying on traditional bridging methods
- [**Token Bridge**](/docs/learn/transfers/token-bridge/) - a bridging solution that uses a lock and mint mechanism

## Compare Transfer Products

A few key comparisons can help you readily differentiate between Wormhole transfer product offerings. Use the following sections to help compare and select products:

### NTT vs. Token Bridge

Understand the key differences between Native Token Transfers (NTT) and Token Bridge to determine which solution best fits your needs.

- Native Token Transfers (NTT) move tokens in their original form without wrapping them, ensuring compatibility with on-chain applications but requiring custom contracts on both the source and destination chains
- Token Bridge locks tokens on the source chain and mints wrapped versions on the destination chain. This method does not require changes to existing token contracts and supports additional message payloads for more complex use cases

<!--
<div markdown class="full-width">

::spantable::

| Supports                  | NTT                | Token Bridge       |
|---------------------------|--------------------|--------------------|
| Message Payload           | :x:                | :white_check_mark: |
| Wrapped Assets            | :x:                | :white_check_mark: |
| Native Assets             | :white_check_mark: | :x:                |
| Contract-Free Development | :x:                | :white_check_mark: |
| User-Owned Contracts      | :white_check_mark: | :x:                |

::end-spantable::

</div>
-->
<!--TODO: embed YouTube video-->

### Settlement  

Wormhole Settlement enables fast and efficient multichain transfers by optimizing liquidity without relying on traditional bridging methods. Unlike NTT, which moves native assets directly between chains, and Token Bridge, which locks tokens and mints wrapped versions, Settlement uses intent-based execution. Users specify the desired transfer outcome, and solvers compete to fulfill it most efficiently. 

<div markdown class="full-width">

::spantable::

| Feature                 | Wormhole Settlement  | Native Token Transfer | Token Bridge       |
|-------------------------|----------------------|-----------------------|--------------------|
| Intent-Based Execution  | :white_check_mark:   | :x:                   | :x:                |
| Fast Settlement         | :white_check_mark:   | :x:                   | :x:                |
| Liquidity Optimization  | :white_check_mark:   | :x:                   | :x:                |
| Native Asset Transfers  | :white_check_mark:   | :white_check_mark:    | :x:                |
| Wrapped Assets          | :x:                  | :x:                   | :white_check_mark: |

::end-spantable::

</div>

By leveraging a decentralized solver network, Settlement ensures efficient cross-chain liquidity without locking assets or requiring asset wrapping, providing a seamless and capital-efficient solution for multichain transactions.

## Additional Resources

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Product Comparison**

    ---

    Compare Wormhole's multichain solutions for bridging, native transfers, data queries, and governance to enable seamless blockchain interoperability.

    [:custom-arrow: Compare Products](/docs/build/start-building/products/){target=\_blank}

-   :octicons-book-16:{ .lg .middle } **Use Cases**

    ---

    Explore Wormhole's use cases, from multichain swaps to DeFi, lending, gaming, and more. See how projects integrate Wormhole solutions.

    [:custom-arrow: Discover Use Cases](/docs/build/start-building/use-cases/)


</div>