import { Wormhole, circle, routes } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/platforms/evm';
import solana from '@wormhole-foundation/sdk/platforms/solana';
import sui from '@wormhole-foundation/sdk/platforms/sui';
import '@wormhole-labs/cctp-executor-route';
import { cctpExecutorRoute } from '@wormhole-labs/cctp-executor-route';
import type { CCTPExecutorRoute } from '@wormhole-labs/cctp-executor-route/dist/esm/routes/cctpV1';
import { getSigner } from './helper';

(async function () {
  // Initialize Wormhole for the Testnet environment and add supported chains (evm, solana and sui)
  const network = 'Testnet';
  const wh = new Wormhole(network, [
    evm.Platform,
    solana.Platform,
    sui.Platform,
  ]);

  // Grab chain contexts (cached RPC clients under the hood)
  const src = wh.getChain('Solana');
  const dst = wh.getChain('BaseSepolia');

  // Get signers from local keys
  const srcSigner = await getSigner(src);
  const dstSigner = await getSigner(dst);

  // Fetch the USDC contract addresses for these chains
  const srcUsdc = circle.usdcContract.get(network, src.chain);
  const dstUsdc = circle.usdcContract.get(network, dst.chain);

  if (!srcUsdc || !dstUsdc) {
    throw new Error(
      'USDC is not configured on the selected source/destination'
    );
  }

  // Build the transfer request for the CCTP v1 executor
  const tr = await routes.RouteTransferRequest.create(wh, {
    source: Wormhole.tokenId(src.chain, srcUsdc),
    destination: Wormhole.tokenId(dst.chain, dstUsdc),
    sourceDecimals: 6,
    destinationDecimals: 6,
    sender: srcSigner.address,
    recipient: dstSigner.address,
  });

  // Configure the executor route (referrer fee off)
  const ExecutorRoute = cctpExecutorRoute({ referrerFeeDbps: 0n });
  const route = new ExecutorRoute(wh);

  // Define the amount of USDC to transfer (in the smallest unit, so 1.000001 USDC = 1,000,001 units assuming 6 decimals)
  const transferAmount = '1.000001';

  // Set the native gas drop-off (0 <= nativeGas <= 1)
  const nativeGasPercent = 0.1;

  const validated = await route.validate(tr, {
    amount: transferAmount,
    options: { nativeGas: nativeGasPercent },
  });

  // Validate inputs and exit early on failure
  if (!validated.valid) {
    const { error } = validated as Extract<typeof validated, { valid: false }>;
    throw new Error(`Validation failed: ${error.message}`);
  }

  // Quote expects the normalized params produced by validate(); cast to that shape
  const validatedParams = validated.params as CCTPExecutorRoute.ValidatedParams;
  const quote = await route.quote(tr, validatedParams);
  if (!quote.success) {
    const { error } = quote as Extract<typeof quote, { success: false }>;
    throw new Error(`Quote failed: ${error.message}`);
  }

  // Start the transfer on the source chain via the executor
  const receipt = await route.initiate(
    tr,
    srcSigner.signer,
    quote,
    dstSigner.address
  );
  if ('originTxs' in receipt && Array.isArray(receipt.originTxs)) {
    console.log('Source transactions:', receipt.originTxs);

    const lastTx = receipt.originTxs[receipt.originTxs.length - 1];
    if (lastTx) {
      const txid =
        typeof lastTx === 'string' ? lastTx : lastTx.txid ?? String(lastTx);
      const wormholeScanUrl = `https://wormholescan.io/#/tx/${txid}?network=${network}`;
      console.log('WormholeScan URL:', wormholeScanUrl);
    }
  } else {
    console.log('Receipt returned without origin transactions:', receipt);
  }
})();
