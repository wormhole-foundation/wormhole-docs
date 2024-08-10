import { wormhole } from '@wormhole-foundation/sdk';

import { Wormhole, amount, signSendWait } from '@wormhole-foundation/sdk';
import algorand from '@wormhole-foundation/sdk/algorand';
import aptos from '@wormhole-foundation/sdk/aptos';
import cosmwasm from '@wormhole-foundation/sdk/cosmwasm';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import { getSigner } from './helpers/index.js';

(async function () {
  const wh = await wormhole('Testnet', [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
    sui,
  ]);

  const ctx = wh.getChain('Solana');

  const rcv = wh.getChain('Algorand');

  const sender = await getSigner(ctx);
  const receiver = await getSigner(rcv);

  // Get a Token Bridge contract client on the source
  const sndTb = await ctx.getTokenBridge();

  // Send the native token of the source chain
  const tokenId = Wormhole.tokenId(ctx.chain, 'native');

  // bigint amount using `amount` module
  const amt = amount.units(amount.parse('0.1', ctx.config.nativeTokenDecimals));

  // Create a transaction stream for transfers
  const transfer = sndTb.transfer(
    sender.address.address,
    receiver.address,
    tokenId.address,
    amt
  );

  // Sign and send the transaction
  const txids = await signSendWait(ctx, transfer, sender.signer);
  console.log('Sent: ', txids);

  // Get the Wormhole message ID from the transaction
  const [whm] = await ctx.parseTransaction(txids[txids.length - 1]!.txid);
  console.log('Wormhole Messages: ', whm);

  const vaa = await wh.getVaa(
    // Wormhole Message ID
    whm!,
    // Protocol:Payload name to use for decoding the VAA payload
    'TokenBridge:Transfer',
    // Timeout in milliseconds, depending on the chain and network, the VAA may take some time to be available
    60_000
  );

  // Now get the token bridge on the redeem side
  const rcvTb = await rcv.getTokenBridge();

  // Create a transaction stream for redeeming
  const redeem = rcvTb.redeem(receiver.address.address, vaa!);

  // Sign and send the transaction
  const rcvTxids = await signSendWait(rcv, redeem, receiver.signer);
  console.log('Sent: ', rcvTxids);

  // Now check if the transfer is completed according to
  // the destination token bridge
  const finished = await rcvTb.isTransferCompleted(vaa!);
  console.log('Transfer completed: ', finished);
})();
