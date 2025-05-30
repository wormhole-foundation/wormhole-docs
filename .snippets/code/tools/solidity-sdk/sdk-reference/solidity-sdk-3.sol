pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/Base.sol";

contract CrossChainSender is Base {
    constructor(
        address _wormholeRelayer,
        address _wormhole
    ) Base(_wormholeRelayer, _wormhole) {}

    function sendMessage(
        bytes memory message,
        uint16 targetChain,
        bytes32 targetAddress
    ) external payable {
        // Register sender and send message through WormholeRelayer
        setRegisteredSender(targetChain, msg.sender);
        onlyWormholeRelayer().sendPayloadToEvm(
            targetChain,
            address(targetAddress),
            message,
            0,
            500_000
        );
    }
}