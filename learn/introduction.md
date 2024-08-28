---
title: Introduction to Wormhole
description: Wormhole is a protocol for seamless communication between blockchains, enabling cross-chain applications and integrations.
---

<!-- This needs updating. It should include  more info on what wormhole is and what problems it solves and how (what it offers) -->

# Introduction to Wormhole

Wormhole is a generic _message-passing protocol_ that enables communication between blockchains.

Wormhole is a cutting-edge generic message-passing protocol designed to bridge communication between distinct blockchain ecosystems. It serves as the backbone for cross-chain applications, facilitating the secure and efficient transfer of data and assets across 30+ blockchains, including major networks like Ethereum, Solana, and more.

Wormhole is a versatile, cross-chain communication protocol designed to enable seamless interaction between multiple blockchain networks. Unlike traditional methods that often result in fragmented liquidity and slow transactions, Wormhole facilitates the transfer of data, tokens, and other assets across different blockchains quickly and efficiently. It does this by acting as a bridge that securely relays messages between chains, allowing for the development of truly cross-chain applications.

![Message-passing process in the Wormhole protocol](/images/learn/introduction/introduction-1.webp)

!!! note
    The above is an oversimplified illustration of the protocol; details about the architecture and components are available on the [architecture page](/learn/architecture/){target=\_blank}.

This simple message-passing protocol allows developers and users of cross-chain applications to leverage the advantages of multiple ecosystems.

Wormhole allows developers to leverage the strengths of multiple blockchain ecosystems without being confined to one. This means applications can benefit from the unique features of various networks—such as Solana's high throughput, Ethereum's security, and Cosmos's interoperability—while maintaining a unified, efficient user experience.

## What Problems Does Wormhole Solve?

In the rapidly evolving blockchain landscape, interoperability is a critical challenge. Individual blockchains are often isolated, limiting the potential for integrated applications that can operate across multiple ecosystems. Wormhole solves this problem by enabling seamless communication between blockchains, allowing developers to create multichain applications that can leverage the unique features of each network.

Key problems Wormhole addresses include:

- Blockchain Isolation: Wormhole connects disparate blockchains, enabling the transfer of assets, data, and governance actions across networks.
- Cross-Chain Complexity: By abstracting the complexities of cross-chain communication, Wormhole makes it easier for developers to build and deploy cross-chain applications.
- Security and Decentralization: Wormhole prioritizes security through a decentralized Guardian network that validates and signs messages, ensuring the integrity of cross-chain interactions.

## What Does Wormhole Offer?

Wormhole provides a suite of tools and protocols that support a wide range of use cases:

- Cross-Chain Messaging: Securely transfer arbitrary data between blockchains, enabling the development of cross-chain decentralized applications (xDapps).
- Asset Transfer: Facilitate the movement of tokens and NFTs across supported chains with ease, powered by protocols built on Wormhole like Portal.
- Cross-Chain Governance: Execute governance actions that span multiple chains, allowing for unified decision-making in multichain ecosystems.
- Developer Tools: Leverage Wormhole’s SDKs, APIs, and documentation to build and deploy cross-chain applications quickly and efficiently.

## What Isn't Wormhole?

- **Wormhole is _not_ a blockchain** - it provides a means of communication between blockchains or rollups

- **Wormhole is _not_ a token bridge** - however, there are [protocols built on Wormhole](https://portalbridge.com/#/transfer){target=\_blank} that serve this purpose

## Use Cases of Wormhole

Consider the following examples of potential applications enabled by Wormhole:

- **Cross-Chain Exchange** - using [Wormhole Connect](#){target=\_blank}, developers can build exchanges that allow deposits from any Wormhole-connected chain, significantly increasing liquidity access <!-- Wormhole Connect: Bridging Made Easy -->
- **Cross-Chain Governance** - NFT collections on different networks can use Wormhole to communicate votes cast on their respective chains to a designated "voting" chain for combined proposals
- **Cross-Chain Game** - games can be developed on a performant network like Solana, with rewards issued as NFTs on another network, such as Ethereum

## Get Started

### Quick Start Tutorials

Tutorials are available to get started quickly and explain the concepts involved.

- **[Quick Start - Off Chain](#){target=\_blank}** - integrate Wormhole Connect into a new or existing web UI <!-- Wormhole Connect: Bridging Made Easy -->
- **[Quick Start - On Chain](#){target=\_blank}** - send your first cross-chain message <!-- Developing Cross Chain Dapps -->

More tutorials are available [on github](#){target=\_blank}. <!-- tutorials will be on the docs site -->

## Explore

Discover more about the Wormhole ecosystem, components, and protocols:

- **[Architecture](/learn/architecture/){target=\_blank}** - explore the components of the protocol
- **[Protocol Specifications](https://github.com/wormhole-foundation/wormhole/tree/main/whitepapers){target=\_blank}** - learn about the protocols built on top of Wormhole

## Demos

Demos offer more realistic implementations than tutorials:

- **[Wormhole Scaffolding](https://github.com/wormhole-foundation/wormhole-scaffolding){target=\_blank}** - quickly set up a project with the Scaffolding repo
- **[xDapp Book Projects](https://github.com/wormhole-foundation/xdapp-book/tree/main/projects){target=\_blank}** - run and learn from example programs

More demos are available in the [demos page](#){target=\_blank}. <!-- demos page -->

!!! note
    Wormhole Integration Complete?

    Let us know so we can list your project in our ecosystem directory and introduce you to our global, multichain community!

    **[Reach out now!](https://forms.clickup.com/45049775/f/1aytxf-10244/JKYWRUQ70AUI99F32Q){target=\_blank}**

## Supported Blockchains

Wormhole supports a growing number of blockchains.

<!-- List of Blockchains here -->