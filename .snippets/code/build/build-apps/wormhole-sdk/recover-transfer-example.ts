// Rebuild the transfer from the source txid
const xfer = await CircleTransfer.from(wh, txid);

const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
console.log('Got attestation: ', attestIds);

const dstTxIds = await xfer.completeTransfer(signer);
console.log('Completed transfer: ', dstTxIds);