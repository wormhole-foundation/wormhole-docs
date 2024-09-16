function placeFastMarketOrder(
    uint128 amountIn,
    uint128 minAmountOut,
    uint16 targetChain,
    bytes32 redeemer,
    bytes calldata redeemerMessage,
    address refundAddress,
    uint128 maxFee,
    uint32 deadline
) external payable returns (uint64 sequence, uint64 fastSequence);