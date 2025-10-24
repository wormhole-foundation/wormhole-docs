import { wormhole, amount, Wormhole } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import evm from '@wormhole-foundation/sdk/evm';
import { getSigner, getTokenDecimals } from './helper';

(async function () {
  // Initialize Wormhole SDK for Solana and Sepolia on Testnet
  const wh = await wormhole('Testnet', [solana, sui, evm]);

  // Define the source and destination chains
  const sendChain = wh.getChain('Solana');
  const rcvChain = wh.getChain('Sepolia');

  // Load signers and addresses from helpers
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the token and amount to transfer
  const tokenId = Wormhole.tokenId('Solana', 'native');
  const amt = '0.1';

  // Convert to raw units based on token decimals
  const decimals = await getTokenDecimals(wh, tokenId, sendChain);
  const transferAmount = amount.units(amount.parse(amt, decimals));

  // Construct the transfer object
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    source.address,
    destination.address,
    'TokenBridge',
    undefined
  );

  // Initiate the transfer from Solana
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  // Wait for the signed attestation from the Guardian network
  console.log('Fetching Attestation');
  const timeout = 5 * 60 * 1000; // 5 minutes
  await xfer.fetchAttestation(timeout);

  // Redeem the tokens on Sepolia
  console.log('Completing Transfer');
  const destTxids = await xfer.completeTransfer(destination.signer);
  console.log(`Completed Transfer: `, destTxids);

  process.exit(0);
})();
