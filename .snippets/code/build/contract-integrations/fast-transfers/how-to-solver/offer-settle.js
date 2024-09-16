import { Connection, Keypair } from '@solana/web3.js';
import * as wormholeSdk from '@certusone/wormhole-sdk';

const rpcUrl = 'INSERT_RPC_URL';
const matchingEngineProgramId = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const usdcMintAddress = 'INSERT_USDC_MINT_ADDRESS';

const connection = new Connection(rpcUrl, "confirmed");
// You will need to create your own logic for the following method
const feeMicroLamports =  INSERT_METHOD_TO_FIND_AUCTION; 
// This is only for example purposes, it is not recommended to store your secret key in a js file
const payer = Keypair.fromSecretKey('INSERT_PRIVATE_KEY'); 

const matchingEngine = new MatchingEngineProgram(
  connection,
  matchingEngineProgramId,
  // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v on mainnet
  usdcMintAddress 
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

// above snippet Send Transaction to Place Initial Offer section
// below snippet Send Transaction to Settle Complete Auction section

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