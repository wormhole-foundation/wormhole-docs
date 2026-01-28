// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.19;

struct ExecutorArgs {
    // The msg value to be passed into the Executor.
    uint256 value;
    // The refund address used by the Executor.
    address refundAddress;
    // The signed quote to be passed into the Executor.
    bytes signedQuote;
    // The relay instructions to be passed into the Executor.
    bytes instructions;
}

struct FeeArgs {
    // The fee in tenths of basis points.
    uint16 dbps;
    // To whom the fee should be paid (the "referrer").
    address payee;
}

interface INttManagerWithExecutor {
    /// @notice Error when the refund to the sender fails.
    error RefundFailed(uint256 refundAmount);

    /// @notice Transfer tokens using the Executor for relaying.
    /// @param nttManager The NTT manager used for the transfer.
    /// @param amount The amount to transfer.
    /// @param recipientChain The Wormhole chain ID for the destination.
    /// @param recipientAddress The recipient address.
    /// @param refundAddress The address to which unused gas is refunded.
    /// @param shouldQueue Whether the transfer should be queued if the outbound limit is hit.
    /// @param encodedInstructions Additional instructions for the destination chain.
    /// @param executorArgs The arguments to be passed into the Executor.
    /// @param feeArgs The arguments used to compute and pay the referrer fee.
    /// @return msgId The resulting message ID of the transfer.
    function transfer(
        address nttManager,
        uint256 amount,
        uint16 recipientChain,
        bytes32 recipientAddress,
        bytes32 refundAddress,
        bool shouldQueue,
        bytes memory encodedInstructions,
        ExecutorArgs calldata executorArgs,
        FeeArgs calldata feeArgs
    ) external payable returns (uint64 msgId);
}