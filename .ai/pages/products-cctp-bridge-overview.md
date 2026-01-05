---
title: CCTP Bridge with Wormhole
description: Learn how the integration of Circle's CCTP with Wormhole enables secure and efficient native USDC transfers and complex cross-chain interactions.
categories: Transfer, CCTP
url: https://wormhole.com/docs/products/cctp-bridge/overview/
---

# CCTP with Wormhole Overview 

The integration of [Circle's Cross-Chain Transfer Protocol (CCTP)](https://www.circle.com/cross-chain-transfer-protocol){target=\_blank} with the Wormhole messaging protocol creates a robust system for securely and efficiently transferring native USDC across different blockchain networks while enabling more complex multichain interactions. This combination streamlines the movement of stablecoins, reduces risk, and unlocks new possibilities for decentralized applications.

## Key Features

- **Secure native USDC transfers**: At its core, CCTP provides a "burn-and-mint" mechanism for transferring native USDC. This eliminates the need for wrapped assets and the associated risks of intermediary bridges.
- **Atomic execution**: By combining CCTP and Wormhole, the transfer of USDC and the execution of accompanying instructions on the destination chain can occur as a single atomic transaction.
- **Automated relaying**: Eliminates the need for users to redeem USDC transfers themselves.
- **Enhanced composability**: Developers can build more sophisticated cross-chain applications by sending additional data alongside the transfer.
- **Gas drop off**: Enables users to convert a portion of USDC into the destination chain's gas token upon a successful transfer.
- **Gas payment**: Covering destination gas in automated vs. manual transfers.
    - **Automated**: Users often don't need destination gas tokens upfront, relayers cover these gas costs, reimbursed via gas drop-off or initial fees.
    - **Manual**: Users pay destination gas directly, the protocol may offer post-claim USDC-to-gas conversion.

## How It Works

This section outlines the end-to-end flow for transferring native USDC across chains using CCTP while optionally triggering an action on the destination chain. Circle and Wormhole coordinate each step to ensure a secure, verifiable transfer and execution process.

1. **Alice initiates a transfer on Ethereum**: She submits a request to the Circle Bridge to send 100 USDC to Avalanche. If desired, she could include optional payload data.

2. **Tokens are taken into custody and burned**: The Circle Bridge takes custody of Alice's USDC and initiates a burn using Circle's CCTP, triggering an off-chain attestation process.

3. **A Wormhole message is published**: The transfer metadata is emitted as a Wormhole message. [Guardians](/docs/protocol/infrastructure/guardians/){target=\_blank} validate and sign it to produce a [Verifiable Action Approval (VAA)](/docs/protocol/infrastructure/vaas/){target=\_blank}.

4. **A relayer automatically processes the messages**: Once the VAA and Circle attestation are available, a relayer submits them to the Circle Bridge on Avalanche.

5. **Tokens are minted**: The Circle Bridge verifies both proofs and mints 100 USDC to Alice using Circle's CCTP. If a payload is included, it can be executed atomically.

```mermaid
sequenceDiagram
    participant User as Alice
    participant SourceChain as Circle Bridge<br>on Ethereum
    participant Circle
    participant Guardians as Wormhole Guardians
    participant Relayer
    participant DestinationChain as Circle Bridge<br>on Avalanche

    User->>SourceChain: Submit transfer <br>(100 USDC to Avalanche)
    SourceChain->>Circle: Initiate a burn
    Circle->>Circle: Burn USDC and provide attestation
    SourceChain->>Guardians: Emit Wormhole message (transfer metadata)
    Guardians->>Guardians: Sign message and produce VAA
    Relayer->>Guardians: Fetch signed VAA
    Relayer->>Circle: Fetch Circle burn attestation
    Relayer->>DestinationChain: Submit VAA and<br> attestation
    DestinationChain->>Circle: Verify Circle attestation
    Circle->>User: Mint USDC to Alice
```

!!! note 
    For a cross-chain transfer to be successful, both the source and destination chains must be among those supported by [Circle's CCTP](https://developers.circle.com/cctp/cctp-supported-blockchains#cctp-domains){target=\_blank}.

## CCTP vs Wrapped Token Transfers (WTT)

| Feature               | CCTP (native USDC)                                                | WTT (wrapped tokens)                                                        |
|-----------------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Supported assets      | Circle-issued USDC                                                | Standards-compliant tokens (e.g., ERC-20, SPL)                              |
| Mechanism             | Burn on source, mint on destination                               | Lock on source, mint wrapped on destination                                 |
| Result on destination | Native USDC                                                       | Wormhole-wrapped token                                                      |
| Payload               | Optional transfer with payload; executed on the destination when USDC is minted | Optional transfer with payload; executed by the recipient contract during redemption |
| Use it for            | Native USDC between CCTP-enabled chains                           | Non-USDC assets, or USDC when CCTP isn't supported on the destination       |

Check the [CCTP Supported Networks](/docs/products/cctp-bridge/reference/supported-networks/){target=\_blank} to see which routes are available.

## When to Use CCTP

CCTP is the right choice in the following situations:

- **Sending USDC between [CCTP-enabled chains](/docs/products/cctp-bridge/reference/supported-networks/){target=\_blank}**: This route appears only if both chains support Circle CCTP and the asset is native USDC.
- **Sending USDC with an attached payload**: The destination contract can execute logic as the tokens are minted on the target chain.

For other transfers, consider these options:

- **Data-only transfers without moving USDC**: Use [Messaging](/docs/products/messaging/overview/){target=\_blank}.
- **Destinations without CCTP support**: The transfer routes via [WTT](/docs/products/token-bridge/overview/){target=\_blank}, with the option to include a payload executed on redemption.

## Use Cases

Integrating Wormhole's messaging with CCTP enables the secure transfer of native USDC across blockchains, unlocking key cross-chain use cases, which include:

- **USDC Payments Across Chains**
    - **[CCTP](/docs/products/cctp-bridge/get-started/)**: Transfer native USDC using Circle's burn-and-mint protocol.
    - **[Wormhole TypeScript SDK](/docs/tools/typescript-sdk/sdk-reference/)**: Automate attestation delivery and gas handling.
    - **[Connect](/docs/products/connect/overview/)**: Embed multichain USDC transfers directly in your app.

## Next Steps

Now that you're familiar with CCTP, here is a list of resources for more hands-on practice.

<div class="grid cards" markdown>

-   :octicons-tools-16:{ .lg .middle } **Get Started with the CCTP Bridge**

    ---

    Perform a multichain USDC transfer from Avalanche to Sepolia using Wormhole's TypeScript SDK and Circle's CCTP.

    [:custom-arrow: Get Started](/docs/products/cctp-bridge/get-started/)

-   :octicons-tools-16:{ .lg .middle } **Complete USDC Transfer Flow**

    ---

    Execute a USDC cross-chain transfer using Wormhole SDK and Circle's CCTP, covering manual, automatic, and partial transfer recovery.

    [:custom-arrow: Get Started](/docs/products/cctp-bridge/tutorials/complete-usdc-transfer/)

-   :octicons-book-16:{ .lg .middle } **Circle CCTP Documentation**

    ---

    Learn how USDC cross-chain transfers work and explore advanced CCTP features.

    [:custom-arrow: See the Circle Docs](https://developers.circle.com/cctp){target=\_blank}

</div>
