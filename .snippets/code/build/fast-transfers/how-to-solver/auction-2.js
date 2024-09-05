import { Connection } from "@solana/web3.js";
import * as wormholeSdk from "@certusone/wormhole-sdk";

const connection = new Connection(YOUR_RPC_URL, "confirmed");
const payer = Keypair.fromSecretKey(...);

const matchingEngine = new MatchingEngineProgram(
  connection,
  MATCHING_ENGINE_PROGRAM_ID,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
  USDC_MINT_ADDRESS 
);

const auction = yourMethodToFindAuctionPubkey(...);
const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
const tx = await matchingEngine.executeFastOrderTx(
    {
	  payer, // Transaction payer
	  auction, // Auction account public key
    },
    {
      feeMicroLamports, // Priority fee for the transaction
      nonceAccount, // optional PublicKey (if durable nonce is used)
      addressLookupTableAccounts, // optional AddressLookupTableAccount[];
    }
);

const txSig = await connection.sendTransaction(tx);