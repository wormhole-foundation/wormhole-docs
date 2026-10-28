import { wormhole, amount, Wormhole, TokenTransfer } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import evm from '@wormhole-foundation/sdk/evm';
import { getSigner, getTokenDecimals } from './helper';

(async function () {
  // Initialize Wormhole SDK for Avalanche and Base Sepolia on Testnet
  const wh = await wormhole('Testnet', [solana, sui, evm]);

  // Define the source and destination chains
  const sendChain = wh.getChain('Avalanche');
  const rcvChain = wh.getChain('BaseSepolia');

  // Load signers and addresses from helpers
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the token and amount to transfer
  const tokenId = Wormhole.tokenId('Avalanche', 'native');
  const amt = '0.2';

  // Convert to raw units based on token decimals
  const decimals = await getTokenDecimals(wh, tokenId, sendChain);
  const transferAmount = amount.units(amount.parse(amt, decimals));

  // Construct the transfer object using the executor protocol, which relays the
  // transfer to the destination chain on your behalf
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    source.address,
    destination.address,
    'ExecutorTokenBridge'
  );

  // Estimate the destination gas requirements before quoting. The resulting
  // executor quote must be attached before the transfer can be initiated
  const dstTb = await rcvChain.getExecutorTokenBridge();
  const dstToken = await TokenTransfer.lookupDestinationToken(sendChain, rcvChain, tokenId);
  const { msgValue, gasLimit } = await dstTb.estimateMsgValueAndGasLimit(dstToken);

  const quote = await TokenTransfer.quoteTransfer(wh, sendChain, rcvChain, {
    ...xfer.transfer,
    msgValue,
    gasLimit,
  });
  xfer.transfer.executorQuote = quote.details.executorQuote;

  // Initiate the transfer from Avalanche Fuji
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  // The executor relays and redeems the transfer, so no further action is required
  console.log('Automatic transfer: the executor is handling redemption.');

  process.exit(0);
})();
