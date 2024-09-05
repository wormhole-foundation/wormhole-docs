import * as wormholeSdk from "@certusone/wormhole-sdk";
import { Keypair } from "@solana/web3.js";

const payer = Keypair.fromSecretKey(...)

await wormholeSdk.postVaaSolanaWithRetry(
    solanaConnection, // Connection in @solana/web3.js
    new wormholeSdk.solana.NodeWallet(payer).signTransaction,
    // worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth on mainnet
    CORE_BRIDGE_PROGRAM_ID, 
    payer.publicKey,
    fastVaaBytes // Buffer type JL
);