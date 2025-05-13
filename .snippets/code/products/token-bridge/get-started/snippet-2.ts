import { wormhole, amount, Wormhole } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import { getSigner, getTokenDecimals } from './helper';

(async function () {
  // Initialize Wormhole SDK for Solana and Sui on Testnet
  const wh = await wormhole('Testnet', [solana, sui]);

  // Define the source and destination chains
  const sendChain = wh.getChain('Solana');
  const rcvChain = wh.getChain('Sui');

  // Load signers and addresses from environment variables
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the token and amount to transfer
  const tokenId = Wormhole.tokenId('Solana', 'native');
  const amt = '1';

  // Convert to raw units based on token decimals
  const decimals = await getTokenDecimals(wh, tokenId, sendChain);
  const transferAmount = amount.units(amount.parse(amt, decimals));

  // Set to false to require manual approval steps
  const automatic = false;
  const nativeGas = automatic ? amount.units(amount.parse('0.0', 6)) : 0n;

  // Construct the transfer object
  const xfer = await wh.tokenTransfer(
    tokenId,
    transferAmount,
    source.address,
    destination.address,
    automatic,
    undefined,
    nativeGas
  );

  // Initiate the transfer from Solana
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  // Wait for the signed attestation from the Guardian network
  console.log('Fetching Attestation');
  const timeout = 5 * 60 * 1000; // 5 minutes
  await xfer.fetchAttestation(timeout);

  // Redeem the tokens on Sui
  console.log('Completing Transfer');
  const destTxids = await xfer.completeTransfer(destination.signer);
  console.log(`Completed Transfer: `, destTxids);

  process.exit(0);
})();
