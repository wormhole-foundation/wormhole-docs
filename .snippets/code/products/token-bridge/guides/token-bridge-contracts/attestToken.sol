IWormhole wormhole = IWormhole(wormholeAddr);
ITokenBridge tokenBridge = ITokenBridge(tokenBridgeAddr);

uint256 wormholeFee = wormhole.messageFee();

tokenBridge.attestToken{value: wormholeFee}(
    address(tokenImpl), // the token contract to attest
    234                 // nonce for the transfer
);