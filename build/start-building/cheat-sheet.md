---
title: Cheat Sheet
description: Find essential resources and quick guides for developers building cross-chain applications with Wormhole, covering SDKs, queries, and integrations.
---

# Hacker Cheat Sheet

We are super thrilled that you are building on Wormhole! This page contains a quick Cheat Sheet to help you get started. Don't hesitate to reach out with any questions. Happy hacking!

## Essential links

- [**Official Documentation**](/docs/){target=\_blank}
- [**Discord Circle / Wormhole** ](https://discord.com/invite/buildoncircle){target=\_blank}
- [**General Wormhole Discord group**](https://discord.com/invite/GYeQg2a4){target=\_blank}

## Product-specific informations

### [Application Layer most suitable products](/docs/build/applications/){target=\_blank}

**Wormhole Connect**

- Wormhole Connect is a React widget that lets developers offer an easy-to-use interface to facilitate cross-chain asset transfers via Wormhole directly in a web application
- [Implementation guide](/docs/build/applications/connect/overview/){target=\_blank} 

**Wormhole TS SDK**

- TypeScript SDK is useful for interacting with the chains Wormhole supports and the protocols built on top of Wormhole. We highly recommend using it as it abstracts a lot of the complexity for you
- [Implementation guide](/docs/build/applications/wormhole-sdk/){target=\_blank}

**Wormhole Queries**

- Wormhole Queries offers on-demand access to Guardian-attested on-chain data. You get a REST endpoint to initiate an off-chain request via a proxy.
-  [How to use Queries](/docs/build/applications/queries/use-queries/){target=\_blank}
-  [FAQ](/docs/build/applications/queries/faqs/){target=\_blank}

### [Infrastructure Layer most suitable Products](/docs/build/contract-integrations/){target=\_blank}

**Wormhole NTT**

- Wormhole NTT is NOT a token standard. It’s an open-source framework that is highly customizable. You can configure parameters, custom payloads and it’s composable
- [Deploy NTT on EVM](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/){target=\_blank}
- [Deploy NTT on Solana](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/){target=\_blank}

**Wormhole and CCTP**

- With Wormhole's generic messaging you can execute more versatile cross-chain experiences while using native USDC transfers
- [Get started with CCTP Contracts](/docs/build/contract-integrations/cctp/){target=\_blank}

## Keywords

- [**Relayers**](/docs/learn/infrastructure/relayer/){target=\_blank} - any off-chain process that relays a VAA to the target chain. We recommend you use the Wormhole relayer, but custom relayers are also available
- [**Guardian**](/docs/learn/infrastructure/guardians/){target=\_blank} - one of 19 validators in the Guardian Network that contributes to the VAA multisig
- [**VAAs (Verified Action Approvals)**](/docs/learn/infrastructure/vaas/){target=\_blank} - Verifiable Action Approvals (VAAs) are the signed attestation of an observed message from the Wormhole Core Contract
- [**Chain IDs**](/docs/build/reference/chain-ids/){target=\_blank}

    !!! note
        Please note that Wormhole chain IDs differ from the more commonly referenced EVM chain IDs.

## Technical Resources and Tools

- [**Wormhole GitHub Repository**](https://github.com/wormhole-foundation){target=\_blank}
- [**CLI**](/docs/build/toolkit/cli/){target=\_blank}
- [**WormholeScan**](https://wormholescan.io/){target=\_blank}

## Network Information

- [**Supported Chains**](/docs/build/start-building/supported-networks/){target=\_blank}
- [**Wormhole Contract Addresses**](/docs/build/reference/contract-addresses/){target=\_blank}

## Quick Start

The list below includes some examples showcasing how to use Wormhole's core features to help you dive in quickly.

- [**Send a message between two EVM chains using Wormhole**](https://github.com/wormhole-foundation/xdapp-book/tree/main/projects/evm-messenger){target=\_blank}
- [**Attest and send tokens from one EVM contract to another on another EVM chain**](https://github.com/wormhole-foundation/xdapp-book/tree/main/projects/evm-tokenbridge){target=\_blank}
- [**Simple project that sends a message between EVM, Solana, and Aptos chains using Wormhole.**](https://github.com/wormhole-foundation/xdapp-book/tree/main/projects/messenger-v2){target=\_blank}
- [**A set of scripts to get started using Wormhole**](https://github.com/wormhole-foundation/xdapp-book/tree/main/projects/wormhole-local-validator){target=\_blank}
- You can find more examples in the [**Demos**](){target=\_blank} page

