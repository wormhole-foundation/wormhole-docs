function receiveMessage(bytes memory encodedMessage) public {
    // Call the Wormhole core contract to parse and verify the encodedMessage
    (
        IWormhole.VM memory wormholeMessage,
        bool valid,
        string memory reason
    ) = wormhole().parseAndVerifyVM(encodedMessage);

    // Perform safety checks here

    // Decode the message payload into the HelloWorldMessage struct
    HelloWorldMessage memory parsedMessage = decodeMessage(
        wormholeMessage.payload
    );

    // Your custom application logic here
}