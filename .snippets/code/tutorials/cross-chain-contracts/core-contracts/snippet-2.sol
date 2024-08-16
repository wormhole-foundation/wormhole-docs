    /**
     * @notice Sends a greeting across chains by updating the list of 'greetings'
     * and emitting a 'GreetingReceived' event on the target HelloWormhole contract
     * at the specified 'targetChain' and 'targetAddress'.
     */
    function sendCrossChainGreeting(
        uint16 targetChain,
        address targetAddress,
        string memory greeting
    ) public payable;