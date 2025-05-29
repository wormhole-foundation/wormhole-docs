// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/wormhole-solidity-sdk/src/WormholeRelayerSDK.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IERC20.sol";

// Extend the TokenSender contract inherited from TokenBase
contract CrossChainSender is TokenSender {
    uint256 constant GAS_LIMIT = 250_000;
    // Initialize the contract with the Wormhole relayer, Token Bridge,
    // and Wormhole Core Contract addresses
    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole
    ) TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) {}

    // Calculate the estimated cost for multichain token transfer using
    // the wormholeRelayer to get the delivery cost and add the message fee
    function quoteCrossChainDeposit(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        uint256 deliveryCost;
        (deliveryCost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );

        cost = deliveryCost + wormhole.messageFee();
    }

    // Send tokens and payload to the recipient on the target chain
    function sendCrossChainDeposit(
        uint16 targetChain,
        address targetReceiver,
        address recipient,
        uint256 amount,
        address token
    ) public payable {
        // Calculate the estimated cost for the multichain deposit
        uint256 cost = quoteCrossChainDeposit(targetChain);
        require(
            msg.value == cost,
            "msg.value must equal quoteCrossChainDeposit(targetChain)"
        );
        // Transfer the tokens from the sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        // Encode the recipient address into the payload
        bytes memory payload = abi.encode(recipient);
        // Initiate the multichain transfer using the wormholeRelayer
        sendTokenWithPayloadToEvm(
            targetChain,
            targetReceiver,
            payload,
            0,
            GAS_LIMIT,
            token,
            amount
        );
    }
}
