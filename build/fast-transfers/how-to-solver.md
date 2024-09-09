---
title: How to be a Solver
description: Explore how solvers engage in Fast Transfers auctions, from initiating offers to settling, with steps and mainnet contract addresses.
---

# How to be a Solver

## Overview

In [Fast Transfers](/learn/messaging/fast-transfers/){target=\_blank}, solvers ensure efficient cross-chain transfers through a competitive auction process on the Matching Engine. The auction consists of four key steps: <!-- link to matching engine -->

1. **Starting an auction** - users initiate a transfer, and solvers begin bidding to fulfill it by offering the best rates
2. **Participating in an auction** - solvers compete in a reverse Dutch auction to provide the most cost-effective solution
3. **Execute fast order to complete auction** - the winning solver completes the transfer by sending assets to the destination chain within a set time frame
4. **Settling an auction** - once the transfer is finalized, the solver retrieves their funds and earns the fee for the completed transaction

## Starting an Auction
When users interact with Token Routers to transfer assets faster than finality to another chain, they place an order that is processed by the Matching Engine. <!-- link to token routers -->

To initiate an auction with this message, the following needs to be done on Solana.

### Send Transactions to Verify Signatures and Post VAA

The [VAA (Verified Action Approval)](/learn/infrastructure/vaas/){target=\_blank} is a message that acts as an IOU (I owe you) for the solver when the auction is settled. The [Wormhole Spy](/learn/infrastructure/spy/){target=\_blank} or a [relayer engine](https://github.com/wormhole-foundation/relayer-engine){target=\_blank} listens to the Wormhole gossip network to observe the fast VAA. 

To read VAAs on Solana, someone must verify the signatures and post the VAA to a Solana account using the Wormhole Core Bridge. This is done through the [Wormhole TS SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}.

```js
--8<-- 'code/build/fast-transfers/how-to-solver/send-tx-1.js'
```

- `postVaaSolanaWithRetry` - function that posts the VAA to Solana by verifying its signatures and linking it to the appropriate Solana account
- `payer` - the entity paying the transaction fees, defined by a secret key using the Solana Keypair
- `fastVaaBytes` - the VAA message that acts as an IOU for the auction settlement

### Send Transaction to Place Initial Offer

After the VAA is posted, the next step is to place an initial offer in the auction. This involves setting the offer price and priority fees.
<!-- 
this code will for sure fail because there is a bunch of variables that are not being initialized properly like ":Keypair", "MatchingEngineProgram"

Unclear what we should do here
-->

```js
--8<-- 'code/build/fast-transfers/how-to-solver/send-tx-2.js'
```

- `MatchingEngineProgram`- handles interactions with the auction system on Solana
- `placeInitialOfferTx` - function that submits the solver's initial offer to the Matching Engine with details like the offer price and the fee (in [micro-lamports](https://solana.com/docs/terminology#lamport){target=\_blank})
- `feeMicroLamports` - the priority fee for processing this transaction
- `fastVaaBytes` - the VAA message that represents the auction

## Participating in an Auction

To participate in an already initialized auction, a relayer must place an offer at a price better than the current auction price. The auction data is stored in an account created by the Matching Engine, and the fast VAA hash determines this auction account address.  

The auction account pubkey can be determined by either:

- Listening to a Solana web socket connection to find the account when the initial offer is placed
- Using the fast VAA bytes to compute its hash and derive its auction account address
<!-- 
Would be great to add more info on how you do this
-->

Once the auction account is found, the relayer can submit an improved offer.
<!-- 
this code will for sure fail because there is a bunch of variables that are not being initialized properly like ":Keypair", "MatchingEngineProgram"

Unclear what we should do here
-->

```js
--8<-- 'code/build/fast-transfers/how-to-solver/auction-1.js'
```

- `improveOfferTx` - function  that allows the solver to place a better offer by submitting a lower bid (improved offer price) than the current one
- `auction` - the public key of the auction account derived from the fast VAA hash or detected through the WebSocket
- `feeLamports` - the priority fee for processing the improved offer

## Execute Fast Order to Complete Auction

To complete the auction, the relayer must execute the fast order before the grace period ends. This step releases the funds to the user on the target chain. To execute the fast order, the relayer must interact with the Matching Engine on Solana, using the auction account derived from the fast VAA. 

```js
--8<-- 'code/build/fast-transfers/how-to-solver/auction-2.js'
```

- `executeFastOrderTx` - function that executes the fast order, which releases the intended funds to the user on the target chain, finalizing the auction

The main difference between [_Participating in an auction_](/build/fast-transfers/how-to-solver/#participating-in-an-auction) and [_Execute fast order to complete auction_](/build/fast-transfers/how-to-solver/#execute-fast-order-to-complete-auction) is that the latter focuses on executing the fast order to finalize the auction and release funds to the user on the target chain. In contrast, _Participating in an auction_ is part of the bidding process, where the solver improves their offer to compete for the auction. _Execute fast order to complete auction_ does not involve submitting a new offer price but ensures the transfer is completed once the auction is won.

## Settle Auction with Finalized VAA

### Send Transactions to Verify Signatures and Post VAA

Once the auction is completed, the finalized VAA must be posted to Solana to officially settle the auction. The finalized VAA can be observed using Wormhole Spy or similar processes, such as the relayer engine that listens to the Wormhole Spy network.

Anyone can post the VAAs on Solana to read and verify VAAs using Wormhole Core Bridge instructions. This is typically done using the [Wormhole TS SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}, as shown below:

```js
--8<-- 'code/build/fast-transfers/how-to-solver/settle-auction-1.js'
```

- `postVaaSolanaWithRetry` - posts the finalized VAA to the Solana blockchain by verifying the signatures and associating the VAA with a Solana account
- `payer` - the entity responsible for covering transaction fees
- `finalizedVaaBytes` - the VAA message confirming the auction's settlement

### Send Transaction to Settle Complete Auction

After posting the finalized VAA, the final step is to settle the auction on Solana. This confirms the auction and ensures the winning solver is paid out accordingly. The following code sends a transaction to the Matching Engine to settle the auction:

```js
--8<-- 'code/build/fast-transfers/how-to-solver/settle-auction-2.js'
```

- `settleAuctionTx` - settles the auction by confirming the transfer using both the fast VAA and the finalized VAA
- `sourceRpc` - the RPC connection to the source chain, used for fetching required information during settlement
- `fastVaaBytes` - the initial VAA from the fast transfer process
- `finalizedVaaBytes` - the finalized VAA confirming the completion of the auction and transfer

## Mainnet Contract Addresses 

This section provides the mainnet contract addresses for various components of the Fast Transfers protocol, including the Matching Engine, Token Router, and Upgrade Manager. Each contract is listed with its associated `chainId` and address, ensuring compatibility across multiple blockchain networks.

| Component               | chainId | Address                                      | Constructor Arguments            |
|-------------------------|---------|----------------------------------------------|----------------------------------|
|MatchingEngineProxy      | 1       | HtkeCDdYY4i9ncAxXKjYTx8Uu3WM8JbtiLRYjtHwaVXb |                                  |
|TokenRouterProxy         | 1       | 28topqjtJzMnPaGFmmZk68tzGmj9W9aMntaEK3QkgtRe |                                  |
|TokenRouterProxy         | 30      | 0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47   | 0xE33C682aA6F7F6E31F0E861aAcCd7dB9C002B965, 0x439fab9100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014420e8aa32c31626f7f31d6fcc154eeccd6e6e9cb000000000000000000000000 |
|TokenRouterProxy         | 23      | 0x70287c79ee41C5D1df8259Cd68Ba0890cd389c47   | 0xE33C682aA6F7F6E31F0E861aAcCd7dB9C002B965, 0x439fab9100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014420e8aa32c31626f7f31d6fcc154eeccd6e6e9cb000000000000000000000000 |
|UpgradeManager           | 1       | 4jyJ7EEsYa72REdD8ZMBvHFTXZ4VYGQPUHaJTajsK8SN |
|TokenRouterImplementation| 30      | 0xB2BCa2A79f7C99aA684A14303d368ffDbc4307e9   | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6, 0x1682Ae6375C4E4A97e4B583BC394c861A46D8962, 1, 0x74e70ed52464f997369bbefd141d8a2d9dd3cd15e1f21b37bce18f45e0e923b2, 0xf4c8473a0e8fb093ca12970ed615db09f7ebbbb3d00f40b3e285e12f40e5c9a6, 5|
|TokenRouterImplementation| 23      | 0xB2BCa2A79f7C99aA684A14303d368ffDbc4307e9   | 0xaf88d065e77c8cC2239327C5EDb3A432268e5831, 0xa5f208e072434bC67592E4C49C1B991BA79BCA46, 0x19330d10D9Cc8751218eaf51E8885D058642E08A, 1, 0x74e70ed52464f997369bbefd141d8a2d9dd3cd15e1f21b37bce18f45e0e923b2, 0xf4c8473a0e8fb093ca12970ed615db09f7ebbbb3d00f40b3e285e12f40e5c9a6, 5|
