function sendUSDCWithPayloadToEvm(
    uint16 targetChain,
    address targetAddress,
    bytes memory payload,
    uint256 receiverValue,
    uint256 gasLimit,
    uint256 amount
) internal returns (uint64 sequence) 