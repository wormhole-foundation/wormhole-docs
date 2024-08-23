function receiveWormholeMessages(
    bytes memory payload,
    bytes[] memory, // additional VAAs (optional, not needed here)
    bytes32, // sender address
    uint16 sourceChain,
    bytes32 // delivery hash
) public payable override {
    require(msg.sender == address(wormholeRelayer), "Only the Wormhole relayer can call this function");

    (string memory message) = abi.decode(payload, (string));

    if (sourceChain != 0) {
        emit SourceChainLogged(sourceChain);
    }

    emit MessageReceived(message);
}
