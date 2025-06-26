import { wormhole, amount } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import { getSigner } from './helper';

(async function () {
  // Initialize the Wormhole object for the Testnet environment and add supported chains (evm, solana and sui)
  const wh = await wormhole('Testnet', [evm, solana, sui]);

  // Grab chain Contexts -- these hold a reference to a cached rpc client
  const sendChain = wh.getChain('Sepolia');
  const rcvChain = wh.getChain('Avalanche');

  // Get signer from local key
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Define the amount of USDC to transfer (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
  const amt = 1_000_001n;

  // Whether to use automatic delivery
  const automatic = true;

  // The amount of native gas to send with the transfer
  const nativeGas = amount.units(amount.parse('0.1', 6));

  // Create the circleTransfer transaction (USDC-only)
  const xfer = await wh.circleTransfer(
    amt,
    source.address,
    destination.address,
    automatic,
    undefined,
    nativeGas
  );

  // Initiate the transfer on the source chain (Avalanche)
  console.log('Starting Transfer');
  const srcTxids = await xfer.initiateTransfer(source.signer);
  console.log(`Started Transfer: `, srcTxids);

  process.exit(0);
})();
