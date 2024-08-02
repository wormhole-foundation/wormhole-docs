// Now the transfer may be initiated
// A receipt will be returned, guess what you gotta do with that?
const receipt = await bestRoute.initiate(sender.signer, quote);
console.log('Initiated transfer with receipt: ', receipt);