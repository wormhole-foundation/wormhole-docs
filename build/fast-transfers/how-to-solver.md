---
title: Fast Transfers
description: TODO
---

# Solver

## Overview

In Fast Transfers, solvers play a crucial role in ensuring efficient cross-chain transfers through a competitive auction process on the Matching Engine. The auction consists of four key steps: <!-- link to matching engine -->

1. **Starting an auction** - users initiate a transfer, and solvers begin bidding to fulfill it by offering the best rates
2. **Participating in an auction** - solvers compete in a reverse Dutch auction to provide the most cost-effective solution
3. **Execute fast order to complete auction** - the winning solver completes the transfer by sending assets to the destination chain within a set time frame
4. **Settling an auction** - once the transfer is finalized, the solver retrieves their funds and earns the fee for the completed transaction

## Starting an Auction
When users interact with Token Routers to transfer assets faster than finality to another chain, they place an order that is processed by the Matching Engine. <!-- link to token routers -->

In order to initiate an auction with this message, the following needs to be done on Solana.

### Send transactions to verify signatures and post VAA

The [VAA (Verified Action Approval)](/learn/infrastructure/vaas/){target=\_blank} is a message that acts as an IOU (I owe you) for the solver when the auction is settled. The Wormhole Spy or a [relayer engine](https://github.com/wormhole-foundation/relayer-engine){target=\_blank} listens to the Wormhole gossip network to observe the fast VAA.

To read VAAs on Solana, someone must verify the signatures and post the VAA to a Solana account using the Wormhole Core Bridge. This is done through the Wormhole JS SDK.

```js
--8<-- 'code/build/fast-transfers/how-to-solver/send-tx-1.js'
```

- `postVaaSolanaWithRetry` - function that posts the VAA to Solana by verifying its signatures and linking it to the appropriate Solana account
- `payer` - the entity paying the transaction fees, defined by a secret key using the Solana Keypair
- `fastVaaBytes` - the VAA message that acts as an IOU for the auction settlement

### Send transaction to place initial offer

After the VAA is posted, the next step is to place an initial offer in the auction. This involves setting the offer price and priority fees.

```js
--8<-- 'code/build/fast-transfers/how-to-solver/send-tx-2.js'
```

- `MatchingEngineProgram`- handles interactions with the auction system on Solana
- `placeInitialOfferTx` - function that submits the solver's initial offer to the Matching Engine with details like the offer price and the fee (in [micro-lamports](https://solana.com/docs/terminology#lamport){target=\_blank})
- `feeMicroLamports` - the priority fee for processing this transaction
- `fastVaaBytes` - the VAA message that represents the auction

## Participating in an Auction

In order to participate in an already initialized auction, a relayer must place an offer with a better price than the current auction price. The auction data is stored in an account created by the Matching Engine, and this auction account address is determined by the fast VAA hash. 

The auction account pubkey can be determined by either:

- Listen to a Solana websocket connection to find the account when the initial offer is placed.
- Use the fast VAA bytes to compute its hash and derive the auction account address from it.

Once the auction account is found, the relayer can submit an improved offer.

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

### Send transactions to verify signatures and post VAA

The finalized VAA is observed via Wormhole Spy or a process that listens to the Wormhole Spy network like the relayer engine.

In order to read VAAs on Solana, someone (anyone can do this) needs to verify signatures and post the VAA to a Solana account via Wormhole Core Bridge instructions. The typical way to do this is using the Wormhole JS SDK.

<!-- snippet -->

```js
import * as wormholeSdk from "@certusone/wormhole-sdk";
import { Keypair } from "@solana/web3.js";

const payer = Keypair.fromSecretKey(...)

await wormholeSdk.postVaaSolanaWithRetry(
    solanaConnection, // Connection in @solana/web3.js
    new wormholeSdk.solana.NodeWallet(payer).signTransaction,
    CORE_BRIDGE_PROGRAM_ID, // worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth on mainnet
    payer.publicKey,
    finalizedVaaBytes // Buffer type
);

```

### Send transaction to settle complete auction

<!-- snippet -->

```js
import { Connection } from "@solana/web3.js";
import * as wormholeSdk from "@certusone/wormhole-sdk";

const connection = new Connection(YOUR_RPC_URL, "confirmed");
const payer = Keypair.fromSecretKey(...);

const matchingEngine = new MatchingEngineProgram(
  connection,
	MATCHING_ENGINE_PROGRAM_ID,
  USDC_MINT_ADDRESS // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
);

const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
const tx = await matchingEngine.settleAuctionTx(
    connection,
    payer,
    sourceRpc, // For fetching information from the source chain.
    fastVaaBytes,
    finalizedVaaBytes,
    {
        feeMicroLamports,
        nonceAccount, // optional PublicKey (if durable nonce is used)
        addressLookupTableAccounts, // optional AddressLookupTableAccount[];
    }
);

const txSig = await connection.sendTransaction(tx);

```


## Mainnet Contract Addresses 