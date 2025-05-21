---
title: CCTP Bridge with Wormhole
description: Learn how the integration of Circle's CCTP with Wormhole enables secure and efficient native USDC transfers and complex cross-chain interactions.
categories: Transfer
---

# CCTP with Wormhole Overview 

The integration of [Circle's Cross-Chain Transfer Protocol (CCTP)](https://www.circle.com/cross-chain-transfer-protocol){target=\_blank} with the Wormhole messaging protocol creates a robust system for securely and efficiently transferring native USDC across different blockchain networks while enabling more complex multichain interactions. This combination streamlines the movement of stablecoins, reduces risk, and unlocks new possibilities for decentralized applications.

## Key Features

- **Secure native USDC transfers** - at its core, CCTP provides a "burn-and-mint" mechanism for transferring native USDC. This eliminates the need for wrapped assets and the associated risks of intermediary bridges
- **Generic cross-chain messaging** - wormhole acts as a powerful communication layer, allowing for the transmission of arbitrary data between blockchains
- **Atomic execution** - by combining CCTP and Wormhole, the transfer of USDC and the execution of accompanying instructions on the destination chain can occur as a single, atomic transaction
- **Enhanced composability** - developers can build more sophisticated cross-chain applications by sending additional data alongside the USDC transfer

## How It Works

Imagine a user wants to move USDC from a source chain to a destination chain and trigger an action there. This is what that flow would look like:


1. **Initiation on source chain** - user on source chain dApp initiates native USDC transfer and specifies action on destination chain
2. **CCTP burn and Wormhole message** - Wormhole packages CCTP burn of native USDC on source chain and destination chain action instructions
3. **Circle attestation** -  Circle's attestation service confirms the USDC burn on the source chain and issues a cryptographic signature
4. **Wormhole relayer network** - Guardians sign and relay burn attestation and action instructions to the destination chain
5. **Message delivery and CCTP mint** - Circle's attestation in Wormhole message triggers CCTP mint of native USDC on the destination chain after verification
6. **Automated action** - action on destination chain executes if included in Wormhole message, potentially using new USDC

This process highlights how CCTP ensures the secure transfer of native USDC, while Wormhole provides the messaging infrastructure to carry the attestation and enable more complex, automated cross-chain workflows.

_Note_ Wormhole supports all CCTP chains, however, Circle currently supports a few that you can find listed in [Circles supported domains](https://developers.circle.com/stablecoins/supported-domains). 

## Use Cases

Integrating Wormhole's messaging with CCTP enables the secure transfer of native USDC across blockchains, unlocking key cross-chain use cases, which include:

- **USDC Payments Across Chains**
    - [**CCTP**](/docs/products/cctp-bridge/get-started/) – transfer native USDC using Circle’s burn-and-mint protocol
    - [**Wormhole TypeScript SDK**](/docs/tools/typescript-sdk/sdk-reference/) – automate attestation delivery and gas handling
    - [**Connect**](/docs/products/connect/overview/) – embed multichain USDC transfers directly in your app

- **USDC-Powered Multichain Settlement**
    - [**Settlement**](/docs/products/settlement/overview/) – use the Liquidity Layer to settle intents with native USDC
    - [**Wormhole TypeScript SDK**](/docs/tools/typescript-sdk/sdk-reference/) – initiate transfers, discover routes, and execute swaps seamlessly

## Next Steps

Now that you're familiar with CCTP, here is a guide for hands-on practice:

[timeline(wormhole-docs/.snippets/text/products/reference/cctp/cctp-timeline.json)]
