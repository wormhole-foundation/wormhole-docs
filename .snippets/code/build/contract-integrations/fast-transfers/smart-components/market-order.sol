function placeMarketOrder(
    uint128 amountIn,
    uint128 minAmountOut,
    uint16 targetChain,
    bytes32 redeemer,
    bytes calldata redeemerMessage,
    address refundAddress
) external payable returns (uint64 sequence);