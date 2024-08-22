import { encoding, signSendWait, wormhole } from '@wormhole-foundation/sdk';
import { getSigner } from './helpers/index.js';
import solana from '@wormhole-foundation/sdk/solana';
import evm from '@wormhole-foundation/sdk/evm';

(async function () {
  const wh = await wormhole('Testnet', [solana, evm]);

  const chain = wh.getChain('Avalanche');
  const { signer, address } = await getSigner(chain);

  // Get a reference to the core messaging bridge
  const coreBridge = await chain.getWormholeCore();

  // Generate transactions, sign and send them
  const publishTxs = coreBridge.publishMessage(
    // Address of sender (emitter in VAA)
    address.address,
    // Message to send (payload in VAA)
    encoding.bytes.encode('lol'),
    // Nonce (user defined, no requirement for a specific value, useful to provide a unique identifier for the message)
    0,
    // ConsistencyLevel (ie finality of the message, see wormhole docs for more)
    0
  );
  // Send the transaction(s) to publish the message
  const txids = await signSendWait(chain, publishTxs, signer);

  // Take the last txid in case multiple were sent
  // The last one should be the one containing the relevant
  // event or log info
  const txid = txids[txids.length - 1];

  // Grab the wormhole message id from the transaction logs or storage
  const [whm] = await chain.parseTransaction(txid!.txid);

  // Wait for the vaa to be signed and available with a timeout
  const vaa = await wh.getVaa(whm!, 'Uint8Array', 60_000);
  console.log(vaa);

  // Note: calling verifyMessage manually is typically not a useful thing to do
  // As the VAA is typically submitted to the counterpart contract for
  // A given protocol and the counterpart contract will verify the VAA
  // This is simply for demo purposes
  const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
  console.log(await signSendWait(chain, verifyTxs, signer));
})();
