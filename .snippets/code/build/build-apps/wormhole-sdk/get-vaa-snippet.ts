// Get the VAA from the wormhole message id
const vaa = await wh.getVaa(
  // Wormhole Message ID
  whm!,
  // Protocol:Payload name to use for decoding the VAA payload
  'TokenBridge:Transfer',
  // Timeout in milliseconds
  60_000
);