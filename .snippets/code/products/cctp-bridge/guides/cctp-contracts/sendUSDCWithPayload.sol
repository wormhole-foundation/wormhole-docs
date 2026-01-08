function sendUSDCWithPayload(
    uint16 targetChain,
    address targetMintRecipient,
    uint256 amount,
    bytes calldata userPayload
  ) external returns (uint64 sequence)