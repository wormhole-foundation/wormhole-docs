console.log(
  `Beginning transfer out of cosmos from ${
    src.chain.chain
  }:${src.address.address.toString()} to ${
    dst.chain.chain
  }:${dst.address.address.toString()}`
);

const xfer = await GatewayTransfer.from(wh, {
  token: token,
  amount: amount,
  from: src.address,
  to: dst.address,
} as GatewayTransferDetails);
console.log('Created GatewayTransfer: ', xfer.transfer);
const srcTxIds = await xfer.initiateTransfer(src.signer);
console.log('Started transfer on source chain', srcTxIds);

const attests = await xfer.fetchAttestation(600_000);
console.log('Got attests', attests);

// Since we're leaving cosmos, this is required to complete the transfer
const dstTxIds = await xfer.completeTransfer(dst.signer);
console.log('Completed transfer on destination chain', dstTxIds);