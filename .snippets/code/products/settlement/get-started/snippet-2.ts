import {
  Wormhole,
  routes,
} from "@wormhole-foundation/sdk-connect";
import { EvmPlatform } from "@wormhole-foundation/sdk-evm";
import { SolanaPlatform } from "@wormhole-foundation/sdk-solana";
import {
  MayanRouteSWIFT,
} from '@mayanfinance/wormhole-sdk-route';
import { getSigner } from "./helpers";

(async function () {
  // Setup
  const wh = new Wormhole("Mainnet", [EvmPlatform, SolanaPlatform]);

  const sendChain = wh.getChain("Ethereum");
  const destChain = wh.getChain("Solana");

  //  To transfer native ETH on Ethereum to native SOL on Solana
  const source = Wormhole.tokenId(sendChain.chain, "native");
  const destination = Wormhole.tokenId(destChain.chain, "native");

  // Create a new Wormhole route resolver, adding the Mayan route to the default list
  // @ts-ignore: Suppressing TypeScript error because the resolver method expects a specific type,
  // but MayanRouteSWIFT is compatible and works as intended in this context.
  const resolver = wh.resolver([MayanRouteSWIFT]);

  // Show supported tokens
  const dstTokens = await resolver.supportedDestinationTokens(
    source,
    sendChain,
    destChain
  );
  console.log(dstTokens.slice(0, 5));

  // Load signers and addresses from helpers
  const sender = await getSigner(sendChain);
  const receiver = await getSigner(destChain);

  // Creating a transfer request fetches token details
  // since all routes will need to know about the tokens
  const tr = await routes.RouteTransferRequest.create(wh, {
    source,
    destination,
  });

  // Resolve the transfer request to a set of routes that can perform it
  const foundRoutes = await resolver.findRoutes(tr);
  const bestRoute = foundRoutes[0]!;

  // Specify the amount as a decimal string
  const transferParams = {
    amount: "0.002",
    options: bestRoute.getDefaultOptions(),
  };

  // Validate the queries route
  let validated = await bestRoute.validate(tr, transferParams);
  if (!validated.valid) {
    console.error(validated.error);
    return;
  }
  console.log("Validated: ", validated);

  const quote = await bestRoute.quote(tr, validated.params);
  if (!quote.success) {
    console.error(`Error fetching a quote: ${quote.error.message}`);
    return;
  }
  console.log("Quote: ", quote);

  // Initiate the transfer
  const receipt = await bestRoute.initiate(
    tr,
    sender.signer,
    quote,
    receiver.address
  );
  console.log("Initiated transfer with receipt: ", receipt);

  await routes.checkAndCompleteTransfer(
    bestRoute,
    receipt,
    receiver.signer,
    15 * 60 * 1000
  );
})();