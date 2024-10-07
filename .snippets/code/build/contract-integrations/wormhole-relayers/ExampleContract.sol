// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";

contract Example {
    IWormholeRelayer public wormholeRelayer;

    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }
}
