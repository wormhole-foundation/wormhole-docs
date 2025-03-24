const srcChain = wh.getChain(senderAddress.chain);
const dstChain = wh.getChain(receiverAddress.chain);

const tb = await srcChain.getTokenBridge(); // => TokenBridge<'Evm'>
srcChain.getRpcClient(); // => RpcClient<'Evm'>