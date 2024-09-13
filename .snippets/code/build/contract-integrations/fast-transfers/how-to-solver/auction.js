import { Connection, Keypair } from '@solana/web3.js';
import * as wormholeSdk from '@certusone/wormhole-sdk';

const matchingEngineProgramId = 'INSERT_MATCHING_ENGINE_PROGRAM_ID';
const usdcMintAddress = 'INSERT_USDC_MINT_ADDRESS';
const connection = new Connection('YOUR_RPC_URL', "confirmed");
// This is only for example purposes, it is not recommended to store your secret key in a js file
const payer = Keypair.fromSecretKey('INSERT_PRIVATE_KEY');

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