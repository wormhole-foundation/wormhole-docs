---
title: How to be a Solver
description: Explore how solvers engage in Fast Transfers auctions, from initiating offers to settling, with steps and MainNet contract addresses.
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

To initiate an auction with this message, complete the steps in the following sections on Solana.

### Send Transactions to Verify Signatures and Post VAA

The [VAA (Verified Action Approval)](/learn/infrastructure/vaas/){target=\_blank} is a message that acts as an I owe you (IOU) for the solver when the auction is settled. The [Wormhole Spy](/learn/infrastructure/spy/){target=\_blank} or a [relayer engine](https://github.com/wormhole-foundation/relayer-engine){target=\_blank} listens to the Wormhole gossip network to observe the fast VAA. 

To read VAAs on Solana, someone must verify the signatures and post the VAA to a Solana account using the Wormhole Core Bridge. This is done through the [Wormhole TS SDK](https://github.com/wormhole-foundation/wormhole-sdk-ts){target=\_blank}.

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/send-tx-1.js'
```

- `postVaaSolanaWithRetry` - function that posts the VAA to Solana by verifying its signatures and linking it to the appropriate Solana account
- `payer` - the entity paying the transaction fees, defined by a secret key using the Solana Keypair
- `fastVaaBytes` - the VAA message that acts as an IOU for the auction settlement

### Send Transaction to Place Initial Offer

After the VAA is posted, the next step is to place an initial offer in the auction. This involves setting the offer price and priority fees.

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/send-tx-2.js'
```

- `MatchingEngineProgram`- handles interactions with the auction system on Solana
- `placeInitialOfferTx` - function that submits the solver's initial offer to the Matching Engine with details like the offer price and the fee (in [micro-lamports](https://solana.com/docs/terminology#lamport){target=\_blank})
- `feeMicroLamports` - the priority fee for processing this transaction
- `fastVaaBytes` - the VAA message that represents the auction

## Participating in an Auction

To participate in an already initialized auction, a relayer must place an offer at a price better than the current auction price. The auction data is stored in an account created by the Matching Engine, and the fast VAA hash determines this auction account address.  

The auction account pubkey can be determined by either:

- Listening to a Solana web socket connection to find the account when the initial offer is placed:
    - Subscribe to a WebSocket service that monitors Solana for new transactions
    - Filter the transactions to identify those related to the initial offer by checking for interaction with the Matching Engine’s program id 
    - Extract the auction account public key from the transaction where the initial offer was placed
- Using the fast VAA bytes to compute its hash and derive its auction account address
    - Convert the fast VAA bytes into a hash using a cryptographic hash function <!-- hashing function ?? Keccak256 ??  -->
    - Derive the auction account public key by using the hash as an input to a deterministic function that maps the hash to a public key within the Matching Engine's account space

Once the auction account is found, the relayer can submit an improved offer.

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/auction-1.js'
```

- `improveOfferTx` - function  that allows the solver to place a better offer by submitting a lower bid (improved offer price) than the current one
- `auction` - the public key of the auction account derived from the fast VAA hash or detected through the WebSocket
- `feeLamports` - the priority fee for processing the improved offer

## Execute Fast Order to Complete Auction

To complete the auction, the relayer must execute the fast order before the grace period ends. This step releases the funds to the user on the target chain. To execute the fast order, the relayer must interact with the Matching Engine on Solana, using the auction account derived from the fast VAA. 

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/auction-2.js'
```

- `executeFastOrderTx` - function that executes the fast order, which releases the intended funds to the user on the target chain, finalizing the auction

Participating in an auction is part of the bidding process, where the solver improves their offer to provide the most cost-effective solution and win the right to fulfill the transfer. In comparison, executing a fast order to complete an auction does not involve submitting a new offer price but ensuring the auction winner appropriately processes the transfer. Funds are transferred within the set time frame to finalize the auction and release funds to the user on the target chain. 

## Settle Auction with Finalized VAA

### Send Transactions to Verify Signatures and Post VAA

Once the auction is completed, the finalized VAA must be posted to Solana to officially settle the auction. The finalized VAA can be observed using Wormhole Spy or similar processes, such as the relayer engine that listens to the Wormhole Spy network.

Anyone can post the VAAs on Solana to read and verify VAAs using Wormhole Core Bridge instructions. This is typically done using the [Wormhole TS SDK](/build/applications/wormhole-sdk/){target=\_blank}, as shown below:

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/settle-auction-1.js'
```

- `postVaaSolanaWithRetry` - posts the finalized VAA to the Solana blockchain by verifying the signatures and associating the VAA with a Solana account
- `payer` - the entity responsible for covering transaction fees
- `finalizedVaaBytes` - the VAA message confirming the auction's settlement

### Send Transaction to Settle Complete Auction

After posting the finalized VAA, the final step is to settle the auction on Solana. This confirms the auction and ensures the winning solver is paid out accordingly. The following code sends a transaction to the Matching Engine to settle the auction:

```js
--8<-- 'code/build/contract-integrations/fast-transfers/how-to-solver/settle-auction-2.js'
```

- `settleAuctionTx` - settles the auction by confirming the transfer using both the fast VAA and the finalized VAA
- `sourceRpc` - the RPC connection to the source chain, used for fetching required information during settlement
- `fastVaaBytes` - the initial VAA from the fast transfer process
- `finalizedVaaBytes` - the finalized VAA confirming the completion of the auction and transfer

## MainNet Contract Addresses 

For MainNet contract addresses for various components of the Fast Transfers protocol, including the Matching Engine, Token Router, and Upgrade Manager, refer to the [Contract Addresses page.](/build/reference/contract-addresses/#fast-transfers){target=\_blank}