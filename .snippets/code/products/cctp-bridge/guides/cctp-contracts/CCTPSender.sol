abstract contract CCTPSender is CCTPBase {
    uint8 internal constant CONSISTENCY_LEVEL_FINALIZED = 15;

    using CCTPMessageLib for *;

    mapping(uint16 => uint32) public chainIdToCCTPDomain;

    /**
     * Sets the CCTP Domain corresponding to chain 'chain' to be 'cctpDomain'
     * So that transfers of USDC to chain 'chain' use the target CCTP domain 'cctpDomain'
     *
     * This action can only be performed by 'cctpConfigurationOwner', who is set to be the deployer
     *
     * Currently, cctp domains are:
     * Ethereum: Wormhole chain id 2, cctp domain 0
     * Avalanche: Wormhole chain id 6, cctp domain 1
     * Optimism: Wormhole chain id 24, cctp domain 2
     * Arbitrum: Wormhole chain id 23, cctp domain 3
     * Base: Wormhole chain id 30, cctp domain 6
     *
     * These can be set via:
     * setCCTPDomain(2, 0);
     * setCCTPDomain(6, 1);
     * setCCTPDomain(24, 2);
     * setCCTPDomain(23, 3);
     * setCCTPDomain(30, 6);
     */
    function setCCTPDomain(uint16 chain, uint32 cctpDomain) public {
        require(
            msg.sender == cctpConfigurationOwner,
            "Not allowed to set CCTP Domain"
        );
        chainIdToCCTPDomain[chain] = cctpDomain;
    }

    function getCCTPDomain(uint16 chain) internal view returns (uint32) {
        return chainIdToCCTPDomain[chain];
    }

    /**
     * transferUSDC wraps common boilerplate for sending tokens to another chain using IWormholeRelayer
     * - approves the Circle TokenMessenger contract to spend 'amount' of USDC
     * - calls Circle's 'depositForBurnWithCaller'
     * - returns key for inclusion in WormholeRelayer `additionalVaas` argument
     *
     * Note: this requires that only the targetAddress can redeem transfers.
     *
     */

    function transferUSDC(
        uint256 amount,
        uint16 targetChain,
        address targetAddress
    ) internal returns (MessageKey memory) {
        IERC20(USDC).approve(address(circleTokenMessenger), amount);
        bytes32 targetAddressBytes32 = addressToBytes32CCTP(targetAddress);
        uint64 nonce = circleTokenMessenger.depositForBurnWithCaller(
            amount,
            getCCTPDomain(targetChain),
            targetAddressBytes32,
            USDC,
            targetAddressBytes32
        );
        return
            MessageKey(
                CCTPMessageLib.CCTP_KEY_TYPE,
                abi.encodePacked(getCCTPDomain(wormhole.chainId()), nonce)
            );
    }

    // Publishes a CCTP transfer of 'amount' of USDC
    // and requests a delivery of the transfer along with 'payload' to 'targetAddress' on 'targetChain'
    //
    // The second step is done by publishing a wormhole message representing a request
    // to call 'receiveWormholeMessages' on the address 'targetAddress' on chain 'targetChain'
    // with the payload 'abi.encode(amount, payload)'
    // (and we encode the amount so it can be checked on the target chain)
    function sendUSDCWithPayloadToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes memory payload,
        uint256 receiverValue,
        uint256 gasLimit,
        uint256 amount
    ) internal returns (uint64 sequence) {
        MessageKey[] memory messageKeys = new MessageKey[](1);
        messageKeys[0] = transferUSDC(amount, targetChain, targetAddress);

        bytes memory userPayload = abi.encode(amount, payload);
        address defaultDeliveryProvider = wormholeRelayer
            .getDefaultDeliveryProvider();

        (uint256 cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            receiverValue,
            gasLimit
        );

        sequence = wormholeRelayer.sendToEvm{value: cost}(
            targetChain,
            targetAddress,
            userPayload,
            receiverValue,
            0,
            gasLimit,
            targetChain,
            address(0x0),
            defaultDeliveryProvider,
            messageKeys,
            CONSISTENCY_LEVEL_FINALIZED
        );
    }

    function addressToBytes32CCTP(address addr) private pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }
}
