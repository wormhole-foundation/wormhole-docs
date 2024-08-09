// Now the transfer may be initiated
const receipt = await bestRoute.initiate(sender.signer, quote);
console.log('Initiated transfer with receipt: ', receipt);