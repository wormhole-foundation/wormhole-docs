import * as wormholeSdk from '@certusone/wormhole-sdk';
import { Keypair } from '@solana/web3.js';

// This is only for example purposes, it is not recommended to store your secret key in a js file
const payer = Keypair.fromSecretKey('INSERT_PRIVATE_KEY') 

await wormholeSdk.postVaaSolanaWithRetry(
    solanaConnection, // Connection in @solana/web3.js
    new wormholeSdk.solana.NodeWallet(payer).signTransaction,
    // worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth on mainnet
    CORE_BRIDGE_PROGRAM_ID, 
    payer.publicKey,
    fastVaaBytes // Buffer type JL
);

// above Send Transactions to Verify Signatures and Post VAA
// below Send Transactions to Verify Signatures and Post VAA

await wormholeSdk.postVaaSolanaWithRetry(
    solanaConnection, // Connection in @solana/web3.js
    new wormholeSdk.solana.NodeWallet(payer).signTransaction,
    // worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth on mainnet
    CORE_BRIDGE_PROGRAM_ID, 
    payer.publicKey,
    finalizedVaaBytes // Buffer type
);