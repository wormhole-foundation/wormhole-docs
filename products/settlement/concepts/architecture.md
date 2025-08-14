---
title: Settlement Protocol Architecture
description: Explore Wormhole Settlement's native swap protocols—Mayan Swift and MCTP—for scalable, efficient cross-chain asset transfers.
categories: Settlement, Transfer
---

# Settlement Protocol Architecture

This page describes the high-level mechanics of the underlying native swap protocols in the Wormhole SDK. While built on Wormhole messaging, each protocol uses a novel architecture with unique price discovery, scalability, and latency tradeoffs. These designs enable redundancy to handle highly asymmetric flows and sharp volume changes. These sections will cover the following:

- **Mayan Swift**: A flexible cross-chain intent protocol that embeds a competitive on-chain price auction to determine the best possible execution for the expressed user intent.
- **Mayan MCTP**: A cross-chain intents protocol that leverages Circle's CCTP (Cross-Chain Transfer Protocol) mechanism and Wormhole messaging to enable secure, fee-managed asset transfers across chains.

## Mayan Swift

Mayan Swift is a flexible cross-chain intent protocol that embeds a competitive on-chain price auction to determine the best possible execution for the expressed user intent.

### On-Chain Competitive Price Discovery Mechanism

Traditional intent-based protocols essentially function as cross-chain limit orders. If the order is profitable, solvers will compete to fulfill it, leading to MEV-like competition focused on speed. While functional, this methodology presents two clear inefficiencies and drawbacks.

First, they lack a competitive price discovery mechanism as limit order prices are typically determined through centralized off-chain systems. Second, in this MEV-like market structure, only a single solver can win, while the others lose out on transaction fees. This dynamic of deadweight loss results in solvers prioritizing high-margin orders, ultimately resulting in elevated fees for end-users without commensurate benefits.

Mayan Swift addresses these limitations by implementing competitive on-chain English auctions on Solana as an embedded price discovery mechanism, fundamentally shifting solver competition from speed-based to price-based execution. Through this architecture, the solver offering the best possible price secures the right to fulfill the order within pre-specified deadline parameters.

![Mayan Swift - Intent-centric design](/docs/images/products/settlement/concepts/architecture/architecture-2.webp)

### Protocol Flow: How It Works

1. **Initiation**: The user creates an order by signing a transaction that locks one of the primary assets (USDC or ETH) into the Mayan smart contract, specifying the desired outcome. 

    !!!note
        If the input asset is not a primary asset, it is converted into a primary asset within the same transaction before the order is submitted.

    Each order includes properties such as destination chain, destination wallet address, output token address, minimum output amount, gas drop amount, deadline, and 32 bytes of random hex to prevent collisions. A Keccak-256 hash is then calculated to identify the order.

2. **Auction**: Solvers observe on-chain data or subscribe to the Mayan explorer web socket (solvers using the Mayan explorer verify the order's integrity by checking the data against the on-chain hash). Once the new order is verified, an on-chain auction on Solana is initiated by passing the order ID and the bid amount, which cannot be lower than the minimum amount. Other solvers can increase the bid by submitting a higher amount before the auction ends.
3. **Fulfillment**: The auction ends three seconds after the initial bid. Once the auction ends, the winning solver can execute an instruction that passes their wallet address on the destination chain. This triggers a Wormhole message containing the order ID and the winner's wallet address. Wormhole Guardians then sign this message, allowing the winning solver to fulfill the order on the destination chain by submitting proof of their win and the promised amount to the Mayan contract before the deadline. The Mayan contract deducts a protocol fee (currently 3 basis points) and a referral fee (if applicable), transferring the remaining amount to the user's destination wallet. It also triggers a Wormhole message as proof of fulfillment.
4. **Settlement**: After the Wormhole Guardians sign the fulfillment message, the winning solver can submit this message on the source chain to unlock the user's funds and transfer them to their own wallet. Upon fulfillment, the solver has the option to delay triggering a Wormhole message immediately. Instead, they can batch the proofs and, once the batch reaches a certain threshold, issue a batched proof to unlock all orders simultaneously, saving on gas fees.

## Mayan MCTP

Mayan MCTP is a cross-chain intents protocol that leverages Circle's CCTP (Cross-Chain Transfer Protocol) mechanism and Wormhole messaging to enable secure, fee-managed asset transfers across chains.

![Mayan MCTP diagram](/docs/images/products/settlement/concepts/architecture/architecture-3.webp)

### Protocol Flow: How It Works

1. **Initiation**: The user creates an order by signing a transaction that locks one USDC into the Mayan smart contract, specifying the desired outcome. 

    !!!note
        If the input asset is not USDC, it is converted into a primary asset within the same transaction before the order is submitted.
    
    The contract constructs a `BridgeWithFeeMsg` structure, which includes parameters such as the action type, payload type, nonce, destination address, gas drop, redeem fee, and an optional custom payload hash.

2. **Intent submission**: The contract calls the CCTP messenger to deposit the tokens for bridging. A unique nonce is generated, and a corresponding fee-lock record is created in the contract's storage. This record includes the locked fee, gas drop parameters, and destination details. The constructed message is hashed and published through Wormhole. The protocol fee is deducted during this step, and the Wormhole message is broadcast with the specified [consistency (finality) level](/docs/products/reference/consistency-levels/){target=\_blank}.
3. **Fulfillment**: On the destination chain, the protocol receives a CCTP message with corresponding signatures and verifies the payload using Wormhole's verification mechanism. Once validated, the redeemed tokens are transferred to the intended recipient, deducting the redeem fee as per protocol rules.

The protocol provides mechanisms for unlocking the fee once the bridging process is completed. This can occur immediately upon fulfillment or be batched for efficiency. In the fee unlock flow, the contract verifies the unlock message via Wormhole and then releases the locked fee to the designated unlocker address.

## Where to Go Next

- To learn how to integrate settlement routes into your application, see the [Integrate Wormhole Settlement Routes Using the SDK](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank} tutorial.
