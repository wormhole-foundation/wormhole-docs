pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/TokenBase.sol";

contract CrossChainTokenReceiver is TokenReceiver {
    constructor(
        address _wormholeRelayer,
        address _wormhole
    ) TokenReceiver(_wormholeRelayer, _wormhole) {}

    // Function to handle received tokens from another chain
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) external payable override {
        // Process the received tokens here
        receiveTokens(payload);
    }
}
