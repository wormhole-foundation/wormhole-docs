import {
  Chain,
  CircleTransfer,
  Network,
  SignerStuff,
  Wormhole,
  amount,
  wormhole,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

(async function () {
  // Initialize the Wormhole object for the Testnet environment and add supported chains (evm and solana)
  const wh = await wormhole('Testnet', [evm, solana]);

  // Define the source and destination chains (Avalanche to BaseSepolia in this case)
  const sendChain = 'Avalanche'; // Source chain
  const rcvChain = 'BaseSepolia'; // Destination chain

  // Initialize providers and signers for source and destination chains
  const sourceSigner = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    ethers.getDefaultProvider()
  );
  const destinationSigner = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    ethers.getDefaultProvider()
  );

  // Define the amount of USDC to transfer (e.g., 0.2 USDC with 6 decimals)
  const amt = amount.units(amount.parse('0.2', 6));

  // Set automatic transfer to false for manual transfer
  const automatic = false;

  // Initiate the transfer of USDC
  await cctpTransfer(wh, source, destination, {
    amount: amt,
    automatic,
  });
})();

async function cctpTransfer<N extends Network>(
  wh: Wormhole<N>,
  src: SignerStuff<N, Chain>,
  dst: SignerStuff<N, Chain>,
  req: {
    amount: bigint;
    automatic: boolean;
    nativeGas?: bigint;
  }
) {
  // Initiate the Circle USDC transfer
  const xfer = await wh.circleTransfer(
    req.amount, // amount in base units (bigint)
    src.address, // source chain and address
    dst.address, // destination chain and address
    req.automatic, // automatic delivery boolean (false for manual)
    undefined, // optional payload (not used in this example)
    req.nativeGas // optional native gas dropoff (not used in this example)
  );

  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(src.signer);
  console.log(`Started Transfer: `, srcTxids);

  // Manual transfer: wait for Circle attestation and complete the transfer
  if (!req.automatic) {
    console.log('Waiting for Attestation');
    const attestIds = await xfer.fetchAttestation(60_000); // 60-second timeout for attestation
    console.log(`Got Attestation: `, attestIds);

    console.log('Completing Transfer');
    const dstTxids = await xfer.completeTransfer(dst.signer);
    console.log(`Completed Transfer: `, dstTxids);
  }
}
