---
title: Smart Contract Components
description: Learn about the Token Router and Matching Engine smart contracts that enable fast, efficient cross-chain USDC transfers across blockchain networks.
---

<!-- Explanation of the Token Router Contracts and Matching Engine 
we can put aside the matching engine as a secondary priority since intents protocols composing atop of us integrate against the token routers not the matching engine

toke router

matching engine
the description of the matching references Avax which we deprecated in favor of a Solana matching engine. The Frame I sent above captures that new flow.

[link](#){target=\_blank}
-->

# Smart Contract Components

Transferring USDC between different blockchains can be slow, costly, and complex, especially when moving between chains that do not support CCTP. Managing liquidity and ensuring compatibility across networks is a major challenge.

The Token Router and Matching Engine smart contracts solve this by enabling fast and efficient cross-chain transfers. The Token Router determines the type of USDC required on the destination chain, while the Matching Engine handles liquidity management and fast transfer auctions, ensuring low fees and quick delivery. Together, they provide seamless token transfers, even between CCTP-enabled and non-CCTP chains.

This page explains the key components and processes behind the Token Router and Matching Engine smart contracts, and how they facilitate efficient Fast Transfers across blockchain networks.

## Token Router Contracts 

The Token Router smart contract acts as the entry point for sending USDC and other supported tokens across different blockchain networks. It allows users to transfer tokens from one blockchain to another, handling all interactions with the [Matching Engine](#){target=\_blank} and determining the appropriate routing method depending on whether the destination chain is CCTP-enabled or not.

The Token Router provides two main order types for token transfers: Place Market Order and Place Fast Market Order.

### Place Market Order

The `placeMarketOrder` function allows users to send USDC (with an optional message payload) to any CCTP-enabled blockchain network registered with the TokenRouter. This function is designed to future-proof the contract by including parameters that, while unused now, can be leveraged in future versions to improve functionality. The main parameters include:

- `amountIn` - the amount of USDC being transferred
- `minAmountOut` - the minimum amount of tokens expected on the destination chain
- `targetChain` - the chain ID of the blockchain where the tokens will be transferred
- `redeemer` - the address of the contract that will handle the redemption of tokens on the target chain
- `redeemerMessage` - optional message payload to be delivered along with the tokens
- `refundAddress` - ohe address that will receive a refund if the transaction fails

```sol
--8<-- 'code/build/fast-transfers/smart-components/market-order.sol'
```

The `minAmountOut` and `refundAddress` parameters are currently unused but are included for future compatibility. The contract is designed to handle future upgrades that could support non-CCTP-enabled chains by swapping CCTP USDC for a wrapped alternative through the MatchingEngine.

### Place Fast Market Order

The `placeFastMarketOrder` function allows users to initiate a faster-than-finality USDC transfer by specifying a maxFee and a deadline. This type of order does not wait for finality, enabling faster delivery through market participants who compete for the lowest fee in an auction on the MatchingEngine.

Parameters include:

- `amountIn` - the amount of USDC being transferred
- `minAmountOut` - the minimum expected amount of tokens on the destination chain
- `targetChain` - the chain ID of the blockchain where tokens will be sent
- `redeemer` - the address on the target chain that will redeem the tokens
- `maxFee` - the maximum fee the user is willing to pay to expedite the transaction
- `deadline` - the deadline for the fast transfer auction to start. A value of 0 opts out of using a deadline

```sol
--8<-- 'code/build/fast-transfers/smart-components/fast-order.sol'
```

The `placeFastMarketOrder` function allows market participants to engage in a fee-based auction, ensuring the user’s transfer is completed as fast as possible based on available liquidity.

### USDC Routing and Canonical USDC

The type of USDC received on the destination chain depends on whether the chain supports CCTP:

- **CCTP-enabled chains** - the user receives native USDC
- **Non-CCTP chains** - the user receives ethUSDC (Ethereum-based USDC)

If the source and destination chains use different types of USDC, the TokenRouter interacts with the MatchingEngine to facilitate a token swap to ensure the correct form of USDC is delivered. If both chains use the same type of USDC, the transfer occurs directly, bypassing the MatchingEngine.

In cases where a swap is required, the `minAmountOut` parameter ensures that the user receives a minimum amount of USDC, and any excess USDC is refunded to the specified refundAddress.

### Additional Features

The TokenRouter contract is designed to handle future upgrades and different blockchain configurations, supporting cross-chain USDC transfers by managing liquidity, routing logic, and ensuring that the right type of USDC is delivered based on the destination chain’s compatibility.

## Matching Engine

The Matching Engine is responsible for handling auctions that determine the fees for fast transfers and facilitating token swaps when required. The Matching Engine interacts with the TokenRouter to ensure liquidity and optimal pricing for cross-chain USDC transfers. It plays a critical role in matching market participants with transfer requests, ensuring that fast transfers occur efficiently with minimal fees.

The Matching Engine ensures that transfers between chains are fast and efficient by:

- Conducting auctions for fast orders
- Facilitating token swaps to convert between different forms of USDC (CCTP vs. ethUSDC)
- Matching users’ transfer requests with available liquidity to guarantee the best possible rates