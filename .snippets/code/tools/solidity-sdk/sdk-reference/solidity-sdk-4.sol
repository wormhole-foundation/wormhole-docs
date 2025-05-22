pragma solidity ^0.8.19;

import "@wormhole-foundation/wormhole-solidity-sdk/src/WormholeRelayer/TokenBase.sol";

contract CrossChainTokenSender is TokenSender {
    constructor(
        address _wormholeRelayer,
        address _wormhole
    ) TokenSender(_wormholeRelayer, _wormhole) {}

    function sendToken(
        address token,
        uint256 amount,
        uint16 targetChain,
        bytes32 targetAddress
    ) external payable {
        // Send tokens across chains
        transferTokenToTarget(token, amount, targetChain, targetAddress);
    }
}
