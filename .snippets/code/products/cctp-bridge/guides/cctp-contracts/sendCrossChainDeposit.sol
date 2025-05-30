function sendCrossChainDeposit(
    uint16 targetChain,
    address targetAddress,
    address recipient,
    uint256 amount,
    uint256,
    gasLimit
) public payable {
    uint256 cost = quoteCrossChainDeposit(targetChain);
    require(
        msg.value == cost,
        "msg.value must be quoteCrossChainDeposit(targetChain)"
    );

    IERC20(USDC).transferFrom(msg.sender, address(this), amount);

    bytes memory payload = abi.encode(recipient);
    sendUSDCWithPayloadToEvm(
        targetChain,
        targetAddress, // address (on targetChain) to send token and payload to
        payload,
        0, // receiver value
        gasLimit,
        amount
    );
}
