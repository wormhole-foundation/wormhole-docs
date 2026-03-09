import { wormhole, amount, Wormhole } from '@wormhole-foundation/sdk';
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

  // Set to false to require manual approval steps
  const nativeGas = amount.units(amount.parse('0.0', 6));

  // Construct the transfer object
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    source.address,
    destination.address,
    'AutomaticTokenBridge',
    nativeGas
  );

  // Initiate the transfer from Avalanche Fuji
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  process.exit(0);
})();
