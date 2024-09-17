---
title: Smart Contract Components
description: Learn about the Token Router and Matching Engine smart contracts that enable fast, efficient cross-chain USDC transfers across blockchain networks.
---

# Smart Contract Components

Transferring USDC between different blockchains can be slow, costly, and complex, especially when moving between chains that do not support [Circle's Cross-Chain Transfer Protocol (CCTP)](/learn/messaging/cctp/){target=\_blank}. Managing liquidity and ensuring compatibility across networks is a significant challenge.

The Token Router and Matching Engine smart contracts solve this by enabling fast and efficient cross-chain transfers. The Token Router determines the type of USDC required on the destination chain, while the Matching Engine handles liquidity management and fast transfer auctions, ensuring low fees and quick delivery. They provide seamless token transfers, even between CCTP-enabled and non-CCTP chains.

This page explains the key components and processes behind the Token Router and Matching Engine smart contracts and how they facilitate efficient Fast Transfers across blockchain networks.

## Token Router Contracts

The Token Router smart contract is the entry point for sending USDC and other supported tokens across different blockchain networks. It allows users to transfer tokens from one blockchain to another, handling all interactions with the [Matching Engine](/build/contract-integrations/fast-transfers/smart-components/#matching-engine){target=\_blank} and determining the appropriate routing method depending on whether the destination chain is CCTP-enabled or not.

The Token Router provides two main order types for token transfers: place market order and place fast market order.

### Place Market Order

The `placeMarketOrder` function allows users to send USDC (with an optional message payload) to any CCTP-enabled blockchain network registered with the Token Router. This function is designed to future-proof the contract by including parameters that, while unused now, can be leveraged in future versions to improve functionality.

```sol
--8<-- 'code/build/contract-integrations/fast-transfers/smart-components/market-order.sol'
```

??? interface "Parameters"

    `amountIn` ++"uint128"++
        
    The amount of USDC being transferred.

    ---

    `minAmountOut` ++"uint128"++
        
    The minimum amount of tokens expected on the destination chain.

    ---

    `targetChain` ++"uint16"++
        
    The chain ID of the blockchain where the tokens will be transferred.

    ---

    `redeemer` ++"bytes32"++
        
    The address of the contract that will handle the redemption of tokens on the target chain.

    ---

    `redeemerMessage` ++"bytes calldata"++
        
    Optional message payload to be delivered along with the tokens.

    ---

    `refundAddress` ++"address"++
        
    The address that will receive a refund if the transaction fails.

    ---

??? interface "Returns"

    `sequence` ++"uint64"++

     The sequence number of the `Fill` Wormhole message.

The `minAmountOut` and `refundAddress` parameters are currently unused but are included for future compatibility. The contract is designed to handle future upgrades that could support non-CCTP-enabled chains by swapping CCTP USDC for a wrapped alternative through the Matching Engine.

### Place Fast Market Order

The `placeFastMarketOrder` function allows users to initiate a faster-than-finality USDC transfer by specifying a maxFee and a deadline. This type of order does not wait for finality, enabling faster delivery through market participants who compete for the lowest fee in an auction on the Matching Engine.

```sol
--8<-- 'code/build/contract-integrations/fast-transfers/smart-components/fast-order.sol'
```

??? interface "Parameters"

    `amountIn` ++"uint128"++
        
    The amount of USDC being transferred.

    ---

    `minAmountOut` ++"uint128"++
        
    The minimum expected amount of tokens on the destination chain.

    ---

    `targetChain` ++"uint16"++
        
    The chain ID of the blockchain where tokens will be sent.

    ---

    `redeemer` ++"bytes32"++
        
    The address on the target chain that will redeem the tokens.

    ---

    `maxFee` ++"uint128"++
        
    The maximum fee the user is willing to pay to expedite the transaction.

    ---

    `deadline` ++"uint32"++
        
    The deadline for the fast transfer auction to start. A value of 0 opts out of using a deadline.

    ---

??? interface "Returns"

    `sequence` ++"uint64"++

     The sequence number of the `SlowOrderResponse` Wormhole message.

    ---

    `fastSequence` ++"uint64"++

    The sequence number of the `FastMarketOrder` Wormhole message.

The `placeFastMarketOrder` function allows market participants to engage in a fee-based auction, ensuring the user's transfer is completed as fast as possible based on available liquidity.

### USDC Routing and Canonical USDC

The type of USDC received on the destination chain depends on whether the chain supports CCTP:

- **CCTP-enabled chains** - the user receives native USDC
- **Non-CCTP chains** - the user receives ethUSDC (Ethereum-based USDC)

If the source and destination chains use different types of USDC, the Token Router interacts with the Matching Engine to facilitate a token swap to ensure the correct form of USDC is delivered. If both chains use the same type of USDC, the transfer occurs directly, bypassing the Matching Engine.

In cases where a swap is required, the `minAmountOut` parameter ensures that the user receives a minimum amount of USDC, and any excess USDC is refunded to the specified `refundAddress`.

### Additional Features

The Token Router contract is designed to handle future upgrades and different blockchain configurations. It supports cross-chain USDC transfers by managing liquidity and routing logic and ensuring that the right type of USDC is delivered based on the destination chain's compatibility.

For more detailed implementation, you can explore the Matching Engine smart contract in the [Wormhole Foundation GitHub repository](https://github.com/wormhole-foundation/example-liquidity-layer/blob/main/evm/src/TokenRouter/TokenRouter.sol){target=\_blank}.

## Matching Engine

The Matching Engine handles auctions, determines fees for fast transfers, and facilitates token swaps when required. It operates on Solana and works with the Token Router to ensure liquidity and optimal pricing for cross-chain USDC transfers. By managing liquidity and conducting auctions for fast orders, the Matching Engine ensures that fast transfers occur efficiently with minimal fees. It plays a critical role in matching market participants with transfer requests while operating mainly in the background.

The Matching Engine smart contract includes several important functionalities that ensure efficient and secure cross-chain transfers:

- **Auction management** - the Matching Engine handles fast order auctions, determining fees based on market conditions to provide the most cost-effective cross-chain transfers
- **User penalty and reward system** - the contract includes a system for managing penalties and rewards, ensuring fair participation in fast transfers. The user penalty and reward percentages are customizable during initialization
- **Contract initialization** - the contract is initialized with essential addresses, including the owner, assistant, and fee recipient. The addresses are checked to ensure they are valid before the contract can proceed
- **Immutability checks** - the contract includes safeguards to ensure critical parameters such as token addresses and auction settings are not changed unexpectedly

Some of the key functions and mechanisms within the Matching Engine smart contract include the following:

- **Initialization** - the Matching Engine is initialized with key addresses and configurations (e.g., `ownerAssistant`, `feeRecipient`) to ensure proper contract setup. The function `_parseInitData` decodes initialization data and verifies that the addresses are not zero addresses

    ```sol
    function _parseInitData(bytes memory initData)
        internal
        pure
        returns (address ownerAssistant, address feeRecipient)
    {
        uint256 offset = 0;
        (ownerAssistant, offset) = initData.asAddressUnchecked(offset);
        (feeRecipient, offset) = initData.asAddressUnchecked(offset);
        initData.checkLength(offset);
    }
    ```

- **Penalty and auction settings** - the Matching Engine sets parameters like auction duration, grace period, and penalties for non-compliance during fast transfers. These parameters help manage the auction process and ensure reliability in the system

    ```sol
    assert(this.getUserPenaltyRewardBps() == _userPenaltyRewardBps);
    assert(this.getInitialPenaltyBps() == _initialPenaltyBps);
    assert(this.getAuctionDuration() == _auctionDuration);
    ```

- **Auction execution** - the contract ensures that auctions are executed within the defined auctionDuration and gracePeriod, preventing delays and ensuring efficient processing of fast orders

For more detailed implementation, you can explore the Matching Engine smart contract in the [Wormhole Foundation GitHub repository](https://github.com/wormhole-foundation/example-liquidity-layer/blob/main/evm/src/MatchingEngine/MatchingEngine.sol){target=\_blank}.
