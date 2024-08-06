 const xfer = await wh.circleTransfer(
  // amount as bigint (base units)
  req.amount,
  // sender chain/address
  src.address,
  // receiver chain/address
  dst.address,
  // automatic delivery boolean
  req.automatic,
  // payload to be sent with the transfer
  undefined,
  // If automatic, native gas can be requested to be sent to the receiver
  req.nativeGas
);

const quote = await CircleTransfer.quoteTransfer(
  src.chain,
  dst.chain,
  xfer.transfer
);
console.log('Quote', quote);

console.log('Starting Transfer');
const srcTxids = await xfer.initiateTransfer(src.signer);
console.log(`Started Transfer: `, srcTxids);

if (req.automatic) {
  const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
  console.log(`Finished relay: `, relayStatus);
  return;
}

// Note: Depending on chain finality, this timeout may need to be increased.
// See https://developers.circle.com/stablecoin/docs/cctp-technical-reference#mainnet for more
console.log('Waiting for Attestation');
const attestIds = await xfer.fetchAttestation(60_000);
console.log(`Got Attestation: `, attestIds);

console.log('Completing Transfer');
const dstTxids = await xfer.completeTransfer(dst.signer);
console.log(`Completed Transfer: `, dstTxids);