??? child "Event Arguments"

    `nonce` ++"uint64"++ 
    
    Unique nonce reserved by message (indexed).

    ---

    `burnToken` ++"address"++ 
    
    Address of token burnt on source domain.

    ---

    `amount` ++"uint256"++
    
    The deposit amount.

    ---

    `depositor` ++"address"++
    
    Address where deposit is transferred from.

    ---

    `mintRecipient` ++"bytes32"++
    
    Address receiving minted tokens on destination domain.

    ---

    `destinationDomain` ++"uint32"++ -
    
    Destination domain.

    ---

    `destinationTokenMessenger` ++"bytes32"++
    
    Address of `TokenMessenger` on destination domain.
    
    ---

    `destinationCaller` ++"bytes32"++
    
    Authorized caller of the `receiveMessage` function on the destination domain, if not equal to `bytes32(0)`. If equal to `bytes32(0)`, any address can call `receiveMessage`.
