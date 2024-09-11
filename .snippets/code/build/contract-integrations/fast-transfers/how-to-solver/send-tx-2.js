import { Connection, Keypair } from "@solana/web3.js";
import * as wormholeSdk from "@certusone/wormhole-sdk";

const YOUR_RPC_URL = 'INSERT_RPC_URL';
const MATCHING_ENGINE_PROGRAM_ID = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const USDC_MINT_ADDRESS = 'INSERT_USDC_MINT_ADDRESS';

const connection = new Connection(YOUR_RPC_URL, "confirmed");
const payer = Keypair.fromSecretKey(...); // Replace [...] with your secret key numbers


const matchingEngine = new MatchingEngineProgram(
  connection,
  MATCHING_ENGINE_PROGRAM_ID,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
  USDC_MINT_ADDRESS 
);

const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
const tx = await matchingEngine.placeInitialOfferTx(
    {
        payer,
    },
    {
        fastVaaBytes,
        offerPrice,
        feeMicroLamports,
        nonceAccount, // optional PublicKey (if durable nonce is used)
        addressLookupTableAccounts, // optional AddressLookupTableAccount[];
    }
);

const txSig = await connection.sendTransaction(tx);