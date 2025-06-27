function placeMarketOrder(
    uint128 amountIn,
    uint16 targetChain,
    bytes32 redeemer,
    bytes calldata redeemerMessage,
) external payable returns (uint64 sequence, uint64 protocolSequence);