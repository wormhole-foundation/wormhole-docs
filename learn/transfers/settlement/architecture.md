---
title: Settlement Protocol Architecture
description: Explore Wormhole Settlement's native swap protocols—Liquidity Layer, Mayan Swift, and MCTP—for scalable, efficient cross-chain asset transfers.
categories: Settlement, Transfer
---

# Settlement Protocol Architecture

## Introduction

This page describes the high-level mechanics of the underlying native swap protocols in the Wormhole SDK. While built on Wormhole messaging, each protocol uses a novel architecture with unique price discovery, scalability, and latency tradeoffs. These designs enable redundancy to handle highly asymmetric flows and sharp volume changes. These sections will cover the following:

- **Wormhole Liquidity Layer** - a cross-chain transfer protocol that utilizes Solana as the central orchestration layer for cross-chain intents, allowing solvers to deploy liquidity from a single Solana-based hub rather than distributing it across each supported chain
- **Mayan Swift** - a flexible cross-chain intent protocol that embeds a competitive on-chain price auction to determine the best possible execution for the expressed user intent
- **Mayan MCTP** - a cross-chain intents protocol that leverages Circle's CCTP (Cross-Chain Transfer Protocol) mechanism and Wormhole messaging to enable secure, fee-managed asset transfers across chains

## Wormhole Liquidity Layer

Wormhole Liquidity Layer is a cross-chain transfer protocol that enables faster-than-finality transfers across the Wormhole ecosystem through a novel, Solana-based hub-and-spoke architecture. The hub-and-spoke model leverages interoperable token standards like Circle's CCTP (and Wormhole's NTT), allowing the solver to natively mint and burn assets between chains for intent fulfillment. This architecture allows solvers to facilitate cross-chain transfers by fronting assets on the destination chain and assuming the finality risk of the originating source chain transaction. 

Solvers concentrate their liquidity entirely on Solana, where they participate in permissionless on-chain English auctions (open ascending-price auctions where bidders publicly raise bids until only one bidder remains) to fulfill each cross-chain transfer. Upon the conclusion of each auction, the winning solver initiates a transfer from Solana to the specified destination chain. The solver rebalances inventory once the originating source chain transaction reaches finality and arrives to Solana.

![Wormhole Settlments Liquidity layer architecture diagram: source chain to hub to destination chain](/docs/images/learn/transfers/settlement/architecture/architecture-1.webp)

The Wormhole Liquidity Layer serves as the underlying chain abstraction infrastructure layer for protocols across Wormhole-connected ecosystems by enabling protocols to bundle call data containing arbitrary protocol actions, which can be executed atomically alongside each transfer. This feature allows developers to create fully chain-abstracted user experiences, including constructing natively cross-chain decentralized exchanges (DEXs), borrow-lend protocols, payment protocols, and other applications atop this layer.

### Solvers and Liquidity Fragmentation

Traditional intent-based protocols require solvers to distribute their capital across each supported chain in the network. This liquidity fragmentation leads to capital inefficiency and requires complex rebalancing to manage asymmetric flows between chains. As the number of chains increases, solvers face scalability challenges, which can result in market concentration, reducing competition and potentially impacting price discovery in intent execution.

Using a hub-and-spoke model, the Wormhole Liquidity Layer solves these challenges by consolidating solver liquidity on a single chain, Solana. This model eliminates the need for complex cross-chain rebalancing and simplifies solvers' infrastructure requirements. Solvers only need to consider the finality risk of the originating source chain transaction and the payload size when bidding on transfers. By concentrating liquidity on Solana, the protocol can handle large transfer volumes with a smaller capital base, enhancing capital efficiency and lowering barriers to entry for solvers. This approach promotes competition, improves overall market efficiency, and ultimately benefits users with better prices while still preserving the speed of transactions.

### Enable Unified Liquidity

The novel hub-and-spoke liquidity architecture relies on interoperable token standards that enable cross-chain token fungibility, such as Circle's Cross-Chain Transfer Protocol (CCTP) and Wormhole's Native Token Transfers (NTT). These protocols allow assets to move seamlessly between chains, making unified liquidity possible. On the liquidity hub (Solana), solvers concentrate their liquidity in NTT or CCTP-supported assets, such as USDC. These assets act as the shuttle between chains but may not necessarily be the user's original or final asset.

After the Solana auction concludes, the appropriate instructions are called on the CCTP or NTT contract, initiating the transfer from Solana to the destination chain by burning/locking the asset on Solana and sequentially minting on the destination chain. Solvers rebalance their inventory on Solana using these interoperable token standards as well. Once the originating source chain transaction reaches finality and arrives to Solana, the solver can redeem the NTT or CCTP message, minting the inventory for use once again.

By leveraging interoperable token standards like NTT, this model of liquidity facilitation for cross-chain intents can arbitrarily scale to any chain or ecosystem while preserving fully unified liquidity—eliminating the need for solver "buy-in" for new chain expansion. Additionally, this means new chains, even without proven traction, can access the same amount of liquidity for cross-chain intent fulfillment from day one of mainnet launch as they would if they were long-standing ecosystems with clear evidence of adoption — commonly overlooked by solvers who must aggressively prioritize high flow chains to due high opportunity costs. This includes new ecosystems without Centralized Exchange (CEX) enabled withdrawals.

### Protocol Flow: How It Works

1. **Initiation** - users or protocols initiate a transfer via an interface or directly on-chain. They choose between a standard transfer (waiting for finality on the sending chain) or a fast transfer (triggering the auction process). For fast transfers, users or the protocol specify a maximum fee and an auction start deadline

    !!! Note
        If an auction doesn't start within the set deadline, a standard transfer will proceed directly from the source to the destination chain.

2. **Auction** - solvers monitor the Wormhole network for these fast transfer requests and initiate an auction on Solana by offering to fulfill the transfer at or below the user's maximum fee. To start the auction, the solver must transfer the requested funds plus a small security deposit to the Matching Engine contract
3. **Competition** - once initiated, other solvers can participate by submitting lower bids in a simple English auction, aiming to provide users with the best rate. If a new solver submits a better offer, the previous solver's funds and security deposit are returned, with the latest offer taking precedence atomically. This competition ensures that users receive the best possible transfer rate
4. **Fulfillment** - after the auction concludes, the winning solver must complete the transfer within a predefined grace period to earn their fee and reclaim their security deposit. Failure to do so may result in the security deposit being slashed, with the slashed amount compensating the user for delays. This mechanism incentivizes prompt execution. Upon successful completion, the Fast Transfer hub sends the USDC to the user's destination wallet, and the solver receives their security deposit and transfer fee
5. **Settlement** - once the source chain transaction reaches finality, the winning solver can use the finalized Wormhole message to settle the auction with the matching engine and rebalance. This allows the solver to retrieve the original transfer amount into their wallet

## Mayan Swift

Mayan Swift is a flexible cross-chain intent protocol that embeds a competitive on-chain price auction to determine the best possible execution for the expressed user intent.

### On-Chain Competitive Price Discovery Mechanism

Traditional intent-based protocols essentially function as cross-chain limit orders. If the order is profitable, solvers will compete to fulfill it, leading to MEV-like competition focused on speed. While functional, this methodology presents two clear inefficiencies and drawbacks.

First, they lack a competitive price discovery mechanism as limit order prices are typically determined through centralized off-chain systems. Second, in this MEV-like market structure, only a single solver can win, while the others lose out on transaction fees. This dynamic of deadweight loss results in solvers prioritizing high-margin orders, ultimately resulting in elevated fees for end-users without commensurate benefits.

Mayan Swift addresses these limitations by implementing competitive on-chain English auctions on Solana as an embedded price discovery mechanism, fundamentally shifting solver competition from speed-based to price-based execution. Through this architecture, the solver offering the best possible price secures the right to fulfill the order within pre-specified deadline parameters.

![Mayan Swift - Intent-centric design](/docs/images/learn/transfers/settlement/architecture/architecture-2.webp)

### Protocol Flow: How It Works

1. **Initiation** - the user creates an order by signing a transaction that locks one of the primary assets (USDC or ETH) into the Mayan smart contract, specifying the desired outcome. 

    !!!note
        If the input asset is not a primary asset, it is converted into a primary asset within the same transaction before the order is submitted.

    Each order includes properties such as destination chain, destination wallet address, output token address, minimum output amount, gas drop amount, deadline, and 32 bytes of random hex to prevent collisions. A Keccak-256 hash is then calculated to identify the order

2. **Auction** - solvers observe on-chain data or subscribe to the Mayan explorer web socket (solvers using the Mayan explorer verify the order's integrity by checking the data against the on-chain hash). Once the new order is verified, an on-chain auction on Solana is initiated by passing the order ID and the bid amount, which cannot be lower than the minimum amount. Other solvers can increase the bid by submitting a higher amount before the auction ends
3. **Fulfillment** - the auction ends three seconds after the initial bid. Once the auction ends, the winning solver can execute an instruction that passes their wallet address on the destination chain. This triggers a Wormhole message containing the order ID and the winner's wallet address. Wormhole Guardians then sign this message, allowing the winning solver to fulfill the order on the destination chain by submitting proof of their win and the promised amount to the Mayan contract before the deadline. The Mayan contract deducts a protocol fee (currently 3 basis points) and a referral fee (if applicable), transferring the remaining amount to the user's destination wallet. It also triggers a Wormhole message as proof of fulfillment
4. **Settlement** - after the Wormhole Guardians sign the fulfillment message, the winning solver can submit this message on the source chain to unlock the user's funds and transfer them to their own wallet. Upon fulfillment, the solver has the option to delay triggering a Wormhole message immediately. Instead, they can batch the proofs and, once the batch reaches a certain threshold, issue a batched proof to unlock all orders simultaneously, saving on gas fees

## Mayan MCTP

Mayan MCTP is a cross-chain intents protocol that leverages Circle's CCTP (Cross-Chain Transfer Protocol) mechanism and Wormhole messaging to enable secure, fee-managed asset transfers across chains.

![Mayan MCTP diagram](/docs/images/learn/transfers/settlement/architecture/architecture-3.webp)

### Protocol Flow: How It Works

1. **Initiation** - the user creates an order by signing a transaction that locks one USDC into the Mayan smart contract, specifying the desired outcome. 

    !!!note
        If the input asset is not USDC, it is converted into a primary asset within the same transaction before the order is submitted.
    
    The contract constructs a `BridgeWithFeeMsg` structure, which includes parameters such as the action type, payload type, nonce, destination address, gas drop, redeem fee, and an optional custom payload hash

2. **Intent submission** - the contract calls the CCTP messenger to deposit the tokens for bridging. A unique nonce is generated, and a corresponding fee-lock record is created in the contract's storage. This record includes the locked fee, gas drop parameters, and destination details. The constructed message is hashed and published through Wormhole. The protocol fee is deducted during this step, and the Wormhole message is broadcast with the specified [consistency (finality) level](/docs/build/reference/consistency-levels/){target=\_blank}
3. **Fulfillment** - on the destination chain, the protocol receives a CCTP message with corresponding signatures and verifies the payload using Wormhole's verification mechanism. Once validated, the redeemed tokens are transferred to the intended recipient, deducting the redeem fee as per protocol rules

The protocol provides mechanisms for unlocking the fee once the bridging process is completed. This can occur immediately upon fulfillment or be batched for efficiency. In the fee unlock flow, the contract verifies the unlock message via Wormhole and then releases the locked fee to the designated unlocker address.

## Where to Go Next

- To learn more about available EVM functions, see the [Build on the Wormhole Liquidity Layer](/docs/build/transfers/settlement/liquidity-layer/){target=\_blank} guide
- To learn how to integrate settlement routes into your application, see the [Integrate Wormhole Settlement Routes Using the SDK](https://github.com/wormhole-foundation/demo-mayanswift){target=\_blank} tutorial
