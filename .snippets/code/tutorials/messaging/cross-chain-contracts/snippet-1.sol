function sendMessage(
    uint16 targetChain, 
    address targetAddress, 
    string memory message
) external payable {
    uint256 cost = quoteCrossChainCost(targetChain);
    require(msg.value >= cost, "Insufficient funds for cross-chain delivery");

    wormholeRelayer.sendPayloadToEvm{value: cost}(
        targetChain,
        targetAddress,
        abi.encode(message, msg.sender), // Payload contains the message and sender address
        0, // No receiver value needed
        GAS_LIMIT // Gas limit for the transaction
    );
}