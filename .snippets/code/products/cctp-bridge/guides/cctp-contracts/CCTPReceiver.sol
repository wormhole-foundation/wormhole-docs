abstract contract CCTPReceiver is CCTPBase {
    function redeemUSDC(
        bytes memory cctpMessage
    ) internal returns (uint256 amount) {
        (bytes memory message, bytes memory signature) = abi.decode(
            cctpMessage,
            (bytes, bytes)
        );
        uint256 beforeBalance = IERC20(USDC).balanceOf(address(this));
        circleMessageTransmitter.receiveMessage(message, signature);
        return IERC20(USDC).balanceOf(address(this)) - beforeBalance;
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable {
        // Currently, 'sendUSDCWithPayloadToEVM' only sends one CCTP transfer
        // That can be modified if the integrator desires to send multiple CCTP transfers
        // in which case the following code would have to be modified to support
        // redeeming these multiple transfers and checking that their 'amount's are accurate
        require(
            additionalMessages.length <= 1,
            "CCTP: At most one Message is supported"
        );

        uint256 amountUSDCReceived;
        if (additionalMessages.length == 1)
            amountUSDCReceived = redeemUSDC(additionalMessages[0]);

        (uint256 amount, bytes memory userPayload) = abi.decode(
            payload,
            (uint256, bytes)
        );

        // Check that the correct amount was received
        // It is important to verify that the 'USDC' sent in by the relayer is the same amount
        // that the sender sent in on the source chain
        require(amount == amountUSDCReceived, "Wrong amount received");

        receivePayloadAndUSDC(
            userPayload,
            amountUSDCReceived,
            sourceAddress,
            sourceChain,
            deliveryHash
        );
    }

    // Implement this function to handle in-bound deliveries that include a CCTP transfer
    function receivePayloadAndUSDC(
        bytes memory payload,
        uint256 amountUSDCReceived,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) internal virtual {}
}
