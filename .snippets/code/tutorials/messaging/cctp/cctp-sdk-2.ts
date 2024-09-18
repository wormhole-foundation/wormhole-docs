import { wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import * as dotenv from 'dotenv';
import { getSigner } from './helpers/helpers';

// Load environment variables
dotenv.config();

(async function () {
  const wh = await wormhole('Testnet', [evm, solana]);

  // Set up source and destination chains
  const sendChain = wh.getChain('Avalanche');
  const rcvChain = wh.getChain('Solana');

  // Configure the signers
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the transfer amount (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
  const amt = 100_000n;

  const automatic = false;

  // Create the Circle transfer object 
  const xfer = await wh.circleTransfer(
    amt,
    source.address,
    destination.address,
    automatic
  );

  console.log('Circle Transfer object created:', xfer);

  // Initiate the transfer on the source chain (Avalanche)
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  // Wait for Circle Attestation (VAA)
  const timeout = 60 * 1000; // Timeout in milliseconds (60 seconds)
  console.log('Waiting for Attestation');
  const attestIds = await xfer.fetchAttestation(timeout);
  console.log(`Got Attestation: `, attestIds);

  // Complete the transfer on the destination chain (Solana)
  console.log('Completing Transfer');
  const dstTxids = await xfer.completeTransfer(destination.signer);
  console.log(`Completed Transfer: `, dstTxids);

  console.log('Circle Transfer status: ', xfer);

  process.exit(0);
})();
