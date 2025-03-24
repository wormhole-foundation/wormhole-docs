function receivePayloadAndUSDC(
    bytes memory payload,
    uint256 amountUSDCReceived,
    bytes32, // sourceAddress
    uint16, // sourceChain
    bytes32 // deliveryHash
) internal override onlyWormholeRelayer {
    address recipient = abi.decode(payload, (address));

    IERC20(USDC).transfer(recipient, amountUSDCReceived);
}
