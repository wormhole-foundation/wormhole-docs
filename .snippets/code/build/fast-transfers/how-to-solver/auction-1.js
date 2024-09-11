import { Connection, Keypair } from "@solana/web3.js";
import * as wormholeSdk from "@certusone/wormhole-sdk";

const rpcUrl = 'INSERT_RPC_URL';
const matchingEngineProgramId = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const usdcMintAddress = 'INSERT_USDC_MINT_ADDRESS';

const connection = new Connection(rpcUrl, "confirmed");
const payer = Keypair.fromSecretKey(...);

const matchingEngine = new MatchingEngineProgram(
  connection,
  matchingEngineProgramId,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on MainNet
  usdcMintAddress 
);

const auction = yourMethodToFindAuctionPubkey(...);
const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
const tx = await matchingEngine.improveOfferTx(
    {
	    payer, // Transaction payer
	    auction, // Auction account public key
    },
    {
      offerPrice, // New improved offer price
      feeMicroLamports, // Priority fee for the transaction
      nonceAccount, // optional PublicKey (if durable nonce is used)
      addressLookupTableAccounts, // optional AddressLookupTableAccount[];
    }
);

const txSig = await connection.sendTransaction(tx);