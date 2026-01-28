// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.19;

import {VaaLib} from "wormhole-sdk/libraries/VaaLib.sol";

contract EnvelopeParser {
    using VaaLib for bytes;

    function parseEnvelope(
        bytes memory encodedVaa
    )
        public
        pure
        returns (
            uint32 timestamp,
            uint32 nonce,
            uint16 emitterChainId,
            bytes32 emitterAddress,
            uint64 sequence,
            uint8 consistencyLevel
        )
    {
        // Skip the header and decode the envelope
        uint offset = VaaLib.skipVaaHeaderMemUnchecked(encodedVaa, 0);
        return VaaLib.decodeVaaEnvelopeMemUnchecked(encodedVaa, offset);
    }
}
