import { Connection, Keypair } from '@solana/web3.js';
import * as wormholeSdk from '@certusone/wormhole-sdk';

const YOUR_RPC_URL = 'INSERT_RPC_URL';
const MATCHING_ENGINE_PROGRAM_ID = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const USDC_MINT_ADDRESS = 'INSERT_USDC_MINT_ADDRESS';

const connection = new Connection(YOUR_RPC_URL, "confirmed");
// This is only for example purposes, it is not recommended to store your secret key in a js file
const payer = Keypair.fromSecretKey('INSERT_PRIVATE_KEY'); 


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