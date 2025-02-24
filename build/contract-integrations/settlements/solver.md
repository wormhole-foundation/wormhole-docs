---
title: Wormhole Settlement Solver
description: Set up, configure, and run a Wormhole Settlement Solver on Solana's Matching Engine to fulfill cross-chain transfers efficiently and securely.
---

# Run a Wormhole Settlement Solver

## Introduction

This page provides instructions on how to set up, configure, and run a Solver for Wormhole Settlement using the [example solver](https://github.com/wormholelabs-xyz/example-liquidity-layer/tree/update-solver-example/solver){target=\_blank}. 

A Solver is an off-chain agent responsible for:

- Listening to cross-chain transfer requests sent over Wormhole
- Bidding in auctions (on Solana) to fulfill each request
- Facilitating the actual cross-chain transfer by locking/burning assets on Solana and minting/unlocking them on the destination chain
- Rebalancing once the origin chain transaction finalizes and is redeemed back on Solana

For information on how the protocol functions and its core features, please visit the [Wormhole Settlement](/docs/learn/messaging/wormhole-settlements/overview/){target=\_blank} page.

## Background

The Solana Matching Engine's permissionless English auction is a central component of Wormhole Settlements protocol architecture. The Matching Engine contract allows any third-party solver to interact with the matching engine to place bids or improve existing ones. The contract includes four key instructions:

1. `initialize_auction` - creates a new auction account on-chain and sets basic parameters like the auction's token mint, the amount required, and the bidding period details
2. `bid` - allows a solver to place or update a bid on the active auction
3. `finalize_auction` - following the conclusion of the auction, this instruction completes the fast transfer by sending funds to the recipient on the target chain. This instruction may call the Circle CCTP contract or release an NTT contract in the future, depending on the shuttle asset in question. Failure to execute this message within a predefined grace period may result in a penalty for the winning bidder.
4. `cancel_auction` - cancels an open auction when the auction is no longer valid or was created by mistake. The program returns all locked funds to their respective owners

These instructions work together to carry out the auction as follows:

- The solver transfers the bid amount to the program escrow account, which ensures they have liquidity 
- With each successful call of `bid`, the program updates the auction to the new highest bidder, and the prior bid is atomically sent back to the originating solver 
- The originating solver can repurpose the returned funds and use them to improve their bid
- Following the auction, the winning solver has to call an instruction on the matching engine to execute the intent

When placing a bid, whether initial or improved, the solver must deposit the required funds plus a security deposit into the matching engine contract. In this permissionless auction, the requirement of this principal amount plus the security deposit ensures a solver's credible commitment to fulfill the transfer. Malicious actors could place hollow bids without this safeguard, undermining the auction's credibility and hindering true price discovery.

If the winning solver fails to call the `finalize_auction` instruction, other competing solvers may permissionlessly 'slash' the solver by executing the instruction on their behalf and collecting a portion of the original security deposit as a reward. The remaining portion is routed to the user as compensation for the unanticipated delay. This mechanism properly incentivizes timely execution through solver redundancy and competition.

## Testnet Example Solver

You can clone the Wormhole [`example-liquidity-layer`](https://github.com/wormholelabs-xyz/example-liquidity-layer){target=\_blank} repository to use the included [`solver`](https://github.com/wormholelabs-xyz/example-liquidity-layer/tree/main/solver){target=\_blank} directory as an example solver to fulfill fast orders by interacting with the Matching Engine on Solana.

!!!warning
    This example is not optimized for performance, has only been tested on Solana devnet, and is not intended for production use. Any assumptions made in this example may not translate to mainnet.

### Prerequisites

In order to build and install dependencies locally in this repo, you will need: 

- node v20.18.1
- npmv - get started by installing `nvm` using this [installation guide](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating){target=\_blank}

Navigate into the `solver` directory, then run the command below to set up your environment and install the node dependencies and Matching Engine package:

```sh
make dependencies
```

### Set up Config

The following is an example of a `config.json` file for Solana devnet. The keys here are required for both the publisher and example solver processes.

```json
{
  "environment": "Testnet",
  "zmqChannels": {
    "fastVaa": "tcp://localhost:6001",
    "finalizedVaa": "tcp://localhost:6002"
  },
  "publisher": {
    "log": {
      "level": "info"
    },
    "vaaSpy": {
      "host": "localhost:7073",
      "enableObservationCleanup": true,
      "observationSeenThresholdMs": 1500000,
      "observationCleanupIntervalMs": 500,
      "observationsToRemovePerInterval": 5,
      "delayedThresholdMs": 60000
    }
  },
  "solver": {
    "log": {
      "level": "info",
      "filename": "logs/solver.log"
    },
    "connection": {
      "rpc": "<https://your-devnet-rpc-here/>",
      "maxTransactionsPerSecond": 5,
      "commitment": "processed",
      "addressLookupTable": "YourAddressLookupTab1eHere11111111111111111",
      "matchingEngine": "mPydpGUWxzERTNpyvTKdvS7v8kvw5sgwfiP8WQFrXVS",
      "mint": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
      "knownAtaOwners": [
        "Payer11111111111111111111111111111111111111",
        "Payer11111111111111111111111111111111111112",
        "Payer11111111111111111111111111111111111113"
      ]
    }
  },
  "routerEndpoints": [
    {
      "chain": "Sepolia",
      "endpoint": "0xE57D917bf955FedE2888AAbD056202a6497F1882",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    },
    {
      "chain": "Avalanche",
      "endpoint": "0x8Cd7D7C980cd72eBD16737dC3fa04469dcFcf07A",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    },
    {
      "chain": "OptimismSepolia",
      "endpoint": "0x6BAa7397c18abe6221b4f6C3Ac91C88a9faE00D8",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    },
    {
      "chain": "ArbitrumSepolia",
      "endpoint": "0xe0418C44F06B0b0D7D1706E01706316DBB0B210E",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    },
    {
      "chain": "BaseSepolia",
      "endpoint": "0x824Ea687CD1CC2f2446235D33Ae764CbCd08e18C",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    },
    {
      "chain": "Polygon",
      "endpoint": "0xa098368AaaDc0FdF3e309cda710D7A5f8BDEeCD9",
      "rollbackRisk": 0.0069,
      "offerEdge": 0.042
    }
  ]
}
```

The rollback risks and offer edges configured in the sample config are arbitrary placeholders. You should use historical data and your risk tolerance, to determine appropriate values for your project.

### Listen to Activity

The example solver listens to attested Wormhole messages (VAAs) published on the Wormhole Guardian gossip network. To listen to this gossip network and run the VAA publisher, run the command below. Docker compose is used to listen to the Pyth Beacon and start the [`publishActivity`](https://github.com/wormholelabs-xyz/example-liquidity-layer/blob/update-solver-example/solver/app/publishActivity.ts){target=\_blank} process.

```sh
NETWORK=testnet CONFIG=path/to/config.json make run-publisher
```

You should see output resembling:

```sh
Start logging with info level.
2025-01-21 16:38:28.145 [publisher] info: Environment: Testnet
2025-01-21 16:38:36.631 [publisher] info: Fast VAA. chain=OptimismSepolia, sequence=33635, vaaTime=1737499116
2025-01-21 16:38:51.044 [publisher] info: Fast VAA. chain=OptimismSepolia, sequence=33637, vaaTime=1737499130
2025-01-21 16:40:24.890 [publisher] info: Fast VAA. chain=OptimismSepolia, sequence=33639, vaaTime=1737499224
```

To set up the Pyth Beacon (which is run using make `run-publisher`), you may need to increase the UDP buffer size for the OS:

```sh
# for linux
sudo sysctl -w net.core.rmem_max=2097152
sudo sysctl -w net.core.rmem_default=2097152
# for macos
sudo sysctl -w net.inet.udp.recvspace=2097152
```

### Running the Example Solver

Using the same config for your publisher, run the example solver with the command below.

```sh
CONFIG=path/to/config.json make run-solver
```

It is recommended you write log output to a file so errors can be tracked. The example config above specifies an example log filename.

This process reads the following environment variables:

```sh
SOLANA_PRIVATE_KEY_1=
SOLANA_PRIVATE_KEY_2=
SOLANA_PRIVATE_KEY_3=
SOLANA_PRIVATE_KEY_4=
SOLANA_PRIVATE_KEY_5=
```

At least one of these environment variables must be defined as a keypair encoded in base64 format. These payers must have SOL to send transactions on Solana devnet. If they need funds, they can request them from the [Solana devnet faucet](https://faucet.solana.com/){target=\_blank}.

The example solver assumes that these payers own USDC Associated Token Accounts(ATAs), which will be used to fulfill fast transfers. These ATAs must be funded with Solana Devnet USDC. If your ATAs need funds, request some at the [Circle testnet faucet](https://faucet.circle.com/){target=\_blank}.

Wallets and their corresponding ATA will be disabled if there are insufficient funds to pay for transactions or fulfill fast transfers. These constraints can be modified using the `updatePayerMinimumLamports` and `updateTokenMinimumBalance` methods.

An address lookup table is required to execute some transactions. Use the command below to create one.

```sh
CONFIG=path/to/config.json make create-lut
```

`SOLANA_PRIVATE_KEY_1` must be defined for this script to work.

The example solver has the following toggles depending on which orders you want to fulfill:

- `enableCctpOrderPipeline()`
- `enableLocalOrderPipeline()`
- `enablePlaceInitialOffer()`
- `enableImproveOffer()`

See the comments in [runExampleSolver](https://github.com/wormholelabs-xyz/example-liquidity-layer/blob/update-solver-example/solver/app/runExampleSolver.ts){target=\_blank} for more information.

This example solver does NOT do the following:

- Discriminate between the CCTP source networks. You must add logic to determine whether you want to constrain fulfilling orders from specific networks. This solver will try to fulfill all orders as long as `enableCctpOrderPipeline()` is called
- Discriminate among fulfillment sizes. No logic determines how small or large fast order transfer sizes should be. This solver will try to fulfill anything as long as your balance can handle it
- Add auctions to auction history. We recommend that after settling a complete auction (one that you have won), you write the auction pubkey to a database and have a separate process to add auction history entries to reclaim rent from these auction accounts. The auction history time delay is two hours after the VAA timestamp. This example does not prescribe any specific database, so add whichever you want



