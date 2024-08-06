 const xfer = await wh.circleTransfer(
  req.amount,
  src.address,
  dst.address,
  req.automatic,
  undefined,
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

console.log('Waiting for Attestation');
const attestIds = await xfer.fetchAttestation(60_000);
console.log(`Got Attestation: `, attestIds);

console.log('Completing Transfer');
const dstTxids = await xfer.completeTransfer(dst.signer);
console.log(`Completed Transfer: `, dstTxids);