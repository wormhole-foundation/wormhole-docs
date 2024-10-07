IWormhole wormhole = IWormhole(wormholeAddr);

// Get the fee for publishing a message
uint256 wormholeFee = wormhole.messageFee();

// Check fee and send parameters

// Create the HelloWorldMessage struct
HelloWorldMessage memory parsedMessage = HelloWorldMessage({
    payloadID: uint8(1),
    message: helloWorldMessage
});

// Encode the HelloWorldMessage struct into bytes
bytes memory encodedMessage = encodeMessage(parsedMessage);

// Send the HelloWorld message by calling publishMessage on the
// wormhole core contract and paying the Wormhole protocol fee.
messageSequence = wormhole.publishMessage{value: wormholeFee}(
    0, // batchID
    encodedMessage,
    wormholeFinality()
);