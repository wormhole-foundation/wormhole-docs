// Get the chain context for the source and destination chains
// This is useful to grab direct clients for the protocols
const srcChain = wh.getChain(senderAddress.chain);
const dstChain = wh.getChain(receiverAddress.chain);

const tb = await srcChain.getTokenBridge(); // => TokenBridge<'Evm'>
srcChain.getRpcClient(); // => RpcClient<'Evm'>