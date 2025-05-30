IWormhole wormhole = IWormhole(wormholeAddr);

uint256 wormholeFee = wormhole.messageFee();

wormhole.attestToken{value: wormholeFee}(
    address(tokenImpl), // the token contract to attest
    234                 // nonce for the transfer
);