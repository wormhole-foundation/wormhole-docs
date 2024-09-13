import { Connection, Keypair } from '@solana/web3.js';
import * as wormholeSdk from '@certusone/wormhole-sdk';

const YOUR_RPC_URL = 'INSERT_RPC_URL';
const MATCHING_ENGINE_PROGRAM_ID = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const USDC_MINT_ADDRESS = 'INSERT_USDC_MINT_ADDRESS';

const connection = new Connection(YOUR_RPC_URL, "confirmed");
const feeMicroLamports = yourMethodToDeterminePriorityFee(...);
// This is only for example purposes, it is not recommended to store your secret key in a js file
const payer = Keypair.fromSecretKey('INSERT_PRIVATE_KEY'); 

const matchingEngine = new MatchingEngineProgram(
  connection,
  MATCHING_ENGINE_PROGRAM_ID,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
  USDC_MINT_ADDRESS 
);

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

// above Send Transaction to Place Initial Offer
// below Send Transaction to Settle Complete Auction

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