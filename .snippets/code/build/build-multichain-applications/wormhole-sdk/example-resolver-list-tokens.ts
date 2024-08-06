const srcTokens = await resolver.supportedSourceTokens(sendChain);
console.log(
  'Allowed source tokens: ',
  srcTokens.map((t) => canonicalAddress(t))
);

const sendToken = Wormhole.tokenId(sendChain.chain, 'native');

const destTokens = await resolver.supportedDestinationTokens(
  sendToken,
  sendChain,
  destChain
);
console.log(
  'For the given source token and routes configured, the following tokens may be receivable: ',
  destTokens.map((t) => canonicalAddress(t))
);

const destinationToken = destTokens[0]!;