import {
  wormhole,
  toNative,
  toUniversal,
  serialize,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import {
  getMoonbeamSigner,
  getMoonbeamWallet,
  getSepoliaSigner,
  getSepoliaWallet,
} from './helpers';
import { ethers } from 'ethers';
import { writeFile } from 'fs/promises';

async function transferTokens() {
  // Initialize Wormhole SDK with EVM support
  const wh = await wormhole('Testnet', [evm]);
  // Get source and destination chain contexts
  const sourceChainCtx = wh.getChain('Moonbeam');
  const destinationChainCtx = wh.getChain('Sepolia');
  /** Get signers, wallets, and addresses for source and destination chains
   * Signers: Wormhole-compatible signers for SDK interactions
   * Wallets: Raw ethers.Wallets for contract interactions
   * Addresses: EVM addresses that won't trigger ENS resolve errors
   * */
  const sourceSigner = await getMoonbeamSigner();
  const sourceWallet = await getMoonbeamWallet();
  const destinationSigner = await getSepoliaSigner();
  const destinationWallet = await getSepoliaWallet();
  const sourceAddress = await sourceSigner.address();
  const destinationAddress = ethers.getAddress(
    await destinationSigner.address()
  );
  if (typeof destinationAddress !== 'string') {
    throw new Error('Destination address must be a string');
  }

  // Define the ERC-20 token and amount to transfer
  // Replace with contract address of the ERC-20 token to transfer
  const ERC20_ADDRESS = 'INSERT_TOKEN_ADDRESS';
  const tokenAddress = toNative('Moonbeam', ERC20_ADDRESS);
  const amount = '0.01';
  // Get the Token Bridge protocol for source chain
  const tokenBridge = await sourceChainCtx.getProtocol('TokenBridge');
  // Check source wallet balance of the ERC-20 token to transfer
  const tokenContract = new ethers.Contract(
    tokenAddress.toString(),
    [
      'function balanceOf(address) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function decimals() view returns (uint8)',
    ],
    sourceWallet
  );
  const tokenBalance = await tokenContract.balanceOf(sourceAddress);
  // Get the decimals from the token metadata
  const decimals = await tokenContract.decimals();
  // Convert the amount to BigInt for comparison
  const amountBigInt = BigInt(ethers.parseUnits(amount, decimals).toString());
  const humanBalance = ethers.formatUnits(tokenBalance, decimals);
  console.log(`💰 ERC-20 balance: ${humanBalance}`);

  if (tokenBalance < amountBigInt) {
    throw new Error(
      `🚫 Insufficient ERC-20 balance. Have ${humanBalance}, need ${amount}`
    );
  }

  // Check if token is registered with the destination chain token bridge
  const destinationTokenBridge = await destinationChainCtx.getTokenBridge();
  const isRegistered = await destinationTokenBridge.hasWrappedAsset({
    chain: sourceChainCtx.chain,
    address: tokenAddress.toUniversalAddress(),
  });
  // If it isn't registered, prompt user to attest the token
  if (!isRegistered) {
    console.log(`🚫 Token not registered on ${destinationChainCtx.chain}.`);
    console.log(
      `👉 Open attestToken.ts, define the token address, and run npx tsx attest:token`
    );
    return;
    // If it is registered, proceed with transfer
  } else {
    console.log(
      `✅ Token is registered on ${destinationChainCtx.chain}. Proceeding with transfer...`
    );
  }

// Additional transfer code
// Replace with the token bridge address for your source chain
const tokenBridgeAddress = "INSERT_TOKEN_BRIDGE_ADDRESS"; // e.g., "0xYourTokenBridgeAddress"
// Approve the Token Bridge to spend your ERC-20 token
const approveTx = await tokenContract.approve(tokenBridgeAddress, amountBigInt);
await approveTx.wait();
console.log(`✅ Approved Token Bridge to spend ${amount} ERC-20 token.`);

// Build transfer transactions
const transferTxs = await tokenBridge.transfer(
toNative(sourceChainCtx.chain, sourceAddress),
{
chain: destinationChainCtx.chain,
address: toUniversal(destinationChainCtx.chain, await destinationSigner.address),
},
tokenAddress,
amountBigInt
);
// Gather transaction IDs for each transfer
const txids: string[] = [];
// Iterate through each unsigned transaction, sign and send it,
// and collect the transaction IDs
for await (const unsignedTx of transferTxs) {
const tx = unsignedTx.transaction as ethers.TransactionRequest;
const sentTx = await sourceSigner.sendTransaction(tx);
await sentTx.wait();
txids.push(sentTx.hash);
}

console.log("✅ Sent txs:", txids);

// Parse the transaction to get Wormhole messages
const messages = await sourceChainCtx.parseTransaction(txids[0]!);
console.log("📨 Parsed transfer messages:", messages);
// Set a timeout for VAA retrieval
// This can take several minutes depending on the network and finality
const timeout = 25 _ 60 _ 1000; // 25 minutes
const vaaBytes = await wh.getVaa(messages[0]!, "TokenBridge:Transfer", timeout);

// Save VAA to file. You will need this to submit
// the transfer on the destination chain
if (!vaaBytes) {
throw new Error("❌ No VAA was returned. Token transfer may not have finalized yet.");
}
await writeFile("vaa.bin", Buffer.from(serialize(vaaBytes)));
console.log("📝 VAA saved to vaa.bin");
}

transferTokens().catch((e) => {
  console.error('❌ Error in transferViaAutoBridge:', e);
  process.exit(1);
});