IWormhole wormhole = IWormhole(wormholeAddr);
ITokenBridge tokenBridge = ITokenBridge(tokenBridgeAddr);

// Get the fee for publishing a message
uint256 wormholeFee = wormhole.messageFee();

tokenBridge.transferTokensWithPayload{value: wormholeFee}(
    token,           // address of the ERC-20 token to transfer
    amount,          // amount of tokens to transfer
    recipientChain,  // Wormhole chain ID of the destination chain
    recipient,       // recipient address on the destination chain (as bytes32)
    nonce,           // nonce for this transfer
    additionalPayload // additional payload data
);