---
title: Introduction to Wormhole
description: Wormhole is a protocol for seamless communication between blockchains, enabling cross-chain applications and integrations.
categories: Basics
---

# Introduction to Wormhole

In the rapidly evolving landscape of blockchain technology, interoperability between different blockchains remains a significant challenge. Developers often face hurdles in creating applications that can seamlessly operate across multiple blockchains, limiting innovation and the potential of decentralized ecosystems.

Wormhole addresses this problem by providing a _generic message-passing_ protocol that enables secure and efficient communication between blockchains. By allowing data and asset transfers across various blockchain networks, Wormhole breaks down the walls that traditionally separate these ecosystems.

Wormhole is distinguished by its focus on robust security, scalability, and transparency. The protocol is supported by a decentralized network of validators that ensure the integrity of every cross-chain transaction. This, combined with Wormhole’s proven performance in real-world applications, gives developers a dependable platform to create and scale multichain applications confidently.

![Message-passing process in the Wormhole protocol](/docs/images/protocol/introduction/introduction-1.webp)

!!! note
    The above is an oversimplified illustration of the protocol; details about the architecture and components are available on the [architecture page](/docs/protocol/architecture/){target=\_blank}.

Wormhole allows developers to leverage the strengths of multiple blockchain ecosystems without being confined to one. This means applications can benefit from the unique features of various networks—such as Solana's high throughput, Ethereum's security, and Cosmos's interoperability while maintaining a unified, efficient user experience.

This page introduces the key concepts and components necessary to understand how Wormhole enables fast, secure, and scalable cross-chain communication.

## What Problems Does Wormhole Solve?

Interoperability is a critical challenge in the rapidly evolving blockchain landscape. Individual blockchains are often isolated, limiting the potential for integrated applications operating across multiple ecosystems. Wormhole solves this problem by enabling seamless communication between blockchains, allowing developers to create multichain applications that can leverage the unique features of each network.

Critical problems Wormhole addresses include:

- **Blockchain isolation**: Wormhole connects disparate blockchains, enabling the transfer of assets, data, and governance actions across networks.
- **Cross-chain complexity**: By abstracting the complexities of cross-chain communication, Wormhole makes it easier for developers to build and deploy cross-chain applications.
- **Security and decentralization**: Wormhole prioritizes security through a decentralized Guardian network that validates and signs messages, ensuring the integrity of cross-chain interactions.

## What Does Wormhole Offer?

Wormhole provides a suite of tools and protocols that support a wide range of use cases:

- **Cross-chain messaging**: Securely transfer arbitrary data between blockchains, enabling the development of cross-chain decentralized applications.
- **Asset transfers**: Facilitate the movement of tokens and NFTs across supported chains with ease, powered by protocols built on Wormhole like [Portal](https://portalbridge.com/){target=\_blank}.
- **Developer tools**: Leverage Wormhole’s [TypeScript SDK](/docs/tools/typescript-sdk/get-started/){target=\_blank},<!-- [Solidity SDK](/docs/tools/solidity-sdk/get-started/),--> [Wormholescan](https://wormholescan.io/){target=\_blank}, and the [Wormholescan API](https://wormholescan.io/#/developers/api-doc){target=\_blank} and documentation to build and deploy cross-chain applications quickly and efficiently.

## What Isn't Wormhole?

- **Wormhole is _not_ a blockchain**: It acts as a communication layer that connects different blockchains, enabling them to interact without being a blockchain itself.
- **Wormhole is _not_ a token bridge**: While it facilitates token transfers, Wormhole also supports a wide range of cross-chain applications, making it much more versatile than a typical bridge.

## Use Cases of Wormhole

Consider the following examples of potential applications enabled by Wormhole:

- **Cross-chain exchange**: Using [Wormhole Connect](/docs/products/connect/overview/){target=\_blank}, developers can build exchanges that allow deposits from any Wormhole-connected chain, significantly increasing liquidity access.
- **[Cross-chain governance](https://wormhole.com/blog/stake-for-governance-is-now-live-for-w-token-holders){target=\_blank}**: NFT collections on different networks can use Wormhole to communicate votes cast on their respective chains to a designated "voting" chain for combined proposals
- **Cross-chain game**: Games can be developed on a performant network like Solana, with rewards issued as NFTs on another network, such as Ethereum.

## Explore

Discover more about the Wormhole ecosystem, components, and protocols:

- **[Architecture](/docs/protocol/architecture/){target=\_blank}**: Explore the components of the protocol.
- **[Protocol Specifications](https://github.com/wormhole-foundation/wormhole/tree/main/whitepapers){target=\_blank}**: Learn about the protocols built on top of Wormhole.

## Demos

Demos offer more realistic implementations than tutorials:

- **[Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding){target=\_blank}**: Quickly set up a project with the Scaffolding repository.
- **[Demo Tutorials](https://github.com/wormhole-foundation/demo-tutorials){target=\_blank}**: Explore various demos that showcase Wormhole's capabilities across different blockchains.

<!-- TODO: Add this back once we have the demos page under the Tutorials section

More demos are available in the [demos page](/docs/build/start-building/demos/){target=\_blank}. -->

!!! note
    Wormhole Integration Complete?

    Let us know so we can list your project in our ecosystem directory and introduce you to our global, multichain community!

    **[Reach out now!](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}**

## Supported Networks by Product

Wormhole supports a growing number of blockchains. Check out the [Supported Networks by Product](/docs/products/reference/supported-networks/){target=\_blank} page to see which networks are supported for each Wormhole product.