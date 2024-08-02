// what tokens are available on the source chain?
const srcTokens = await resolver.supportedSourceTokens(sendChain);
console.log(
  'Allowed source tokens: ',
  srcTokens.map((t) => canonicalAddress(t))
);

// Grab the first one for the example
// const sendToken = srcTokens[0]!;
const sendToken = Wormhole.tokenId(sendChain.chain, 'native');

// given the send token, what can we possibly get on the destination chain?
const destTokens = await resolver.supportedDestinationTokens(
  sendToken,
  sendChain,
  destChain
);
console.log(
  'For the given source token and routes configured, the following tokens may be receivable: ',
  destTokens.map((t) => canonicalAddress(t))
);
//grab the first one for the example
const destinationToken = destTokens[0]!;