// Create a TokenTransfer object to track the state of the transfer over time
const xfer = await wh.tokenTransfer(
  route.token,
  route.amount,
  route.source.address,
  route.destination.address,
  route.delivery?.automatic ?? false,
  route.payload,
  route.delivery?.nativeGas
);

const quote = await TokenTransfer.quoteTransfer(
  wh,
  route.source.chain,
  route.destination.chain,
  xfer.transfer
);
console.log(quote);

if (xfer.transfer.automatic && quote.destinationToken.amount < 0)
  throw 'The amount requested is too low to cover the fee and any native gas requested.';

// 1) Submit the transactions to the source chain, passing a signer to sign any txns
console.log('Starting transfer');
const srcTxids = await xfer.initiateTransfer(route.source.signer);
console.log(`Started transfer: `, srcTxids);

// If automatic, we're done
if (route.delivery?.automatic) return xfer;

// 2) Wait for the VAA to be signed and ready (not required for auto transfer)
console.log('Getting Attestation');
const attestIds = await xfer.fetchAttestation(60_000);
console.log(`Got Attestation: `, attestIds);

// 3) Redeem the VAA on the dest chain
console.log('Completing Transfer');
const destTxids = await xfer.completeTransfer(route.destination.signer);
console.log(`Completed Transfer: `, destTxids);