// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

contract CrossChainReceiver is TokenReceiver {
    // Constructor that passes the required arguments to the base contract
    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole
    ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

    // Function to receive the cross-chain payload and tokens
    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32,
        uint16,
        bytes32
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length == 1, "Expected 1 token transfer");

        address recipient = abi.decode(payload, (address));

        IERC20(receivedTokens[0].tokenAddress).transfer(
            recipient,
            receivedTokens[0].amount
        );
    }
}