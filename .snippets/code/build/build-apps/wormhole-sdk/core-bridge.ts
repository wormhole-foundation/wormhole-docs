const wh = await wormhole('Testnet', [solana]);
const chain = wh.getChain('Solana');
const { signer, address } = await getSigner(chain);
const coreBridge = await chain.getWormholeCore();

// Generate transactions, sign and send them
const publishTxs = coreBridge.publishMessage(
  // Address of sender (emitter in VAA)
  address.address,
  // Message to send (payload in VAA)
  encoding.bytes.encode('lol'),
  // Nonce (user defined, no requirement for a specific value)
  0,
  // ConsistencyLevel (ie finality of the message)
  0
);
// Send the transaction(s) to publish the message
const txids = await signSendWait(chain, publishTxs, signer);

// Take the last txid in case multiple were sent
const txid = txids[txids.length - 1];

// Grab the wormhole message id from the transaction logs or storage
const [whm] = await chain.parseTransaction(txid!.txid);

// Wait for the vaa to be signed and available with a timeout
const vaa = await wh.getVaa(whm!, 'Uint8Array', 60_000);
console.log(vaa);

const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
console.log(await signSendWait(chain, verifyTxs, signer));