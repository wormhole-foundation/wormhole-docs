import { Connection, Keypair } from "@solana/web3.js";
import * as wormholeSdk from "@certusone/wormhole-sdk";

const connection = new Connection(YOUR_RPC_URL, "confirmed");
const payer = Keypair.fromSecretKey(...);

const matchingEngine = new MatchingEngineProgram(
  connection,
  MATCHING_ENGINE_PROGRAM_ID,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
  USDC_MINT_ADDRESS 
);

const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
const tx = await matchingEngine.settleAuctionTx(
    connection,
    payer,
    sourceRpc, // For fetching information from the source chain.
    fastVaaBytes, // The initial fast VAA bytes
    finalizedVaaBytes, // The finalized VAA bytes to confirm the auction
    {
        feeMicroLamports, // Priority fee for the transaction
        nonceAccount, // optional PublicKey (if durable nonce is used)
        addressLookupTableAccounts, // optional AddressLookupTableAccount[];
    }
);

// Send the transaction to Solana
const txSig = await connection.sendTransaction(tx);