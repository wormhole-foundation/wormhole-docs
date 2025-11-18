// grab the message NestedResult
const [_, message] = tx.moveCall({
  target: `${tokenMessengerId}::deposit_for_burn::deposit_for_burn`,
  // ... existing CCTP args ...
});

const [source_domain] = tx.moveCall({
  target: `${messageTransmitterId}::message::source_domain`,
  arguments: [message],
});

const [nonce] = tx.moveCall({
  target: `${messageTransmitterId}::message::nonce`,
  arguments: [message],
});

const [requestBytes] = tx.moveCall({
  target: `${executorRequestsId}::executor_requests::make_cctp_v1_request`,
  arguments: [source_domain, nonce],
});

const [executorCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(estimate))]);

tx.moveCall({
  target: `${executorId}::executor::request_execution`,
  arguments: [
    executorCoin,
    tx.object(SUI_CLOCK_OBJECT_ID),
    tx.pure.u16(dstChain),
    tx.pure.address('0x0'),
    tx.pure.address(signer.getPublicKey().toSuiAddress()),
    tx.pure.vector('u8', Buffer.from(quote.substring(2), 'hex')),
    requestBytes,
    tx.pure.vector('u8', Buffer.from(relayInstructions.substring(2), 'hex')),
  ],
});
