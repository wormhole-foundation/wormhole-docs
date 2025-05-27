import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';
import { wormhole, amount, Wormhole, ChainContext, Signer, Chain, Network, ChainAddress, isTokenId, TokenId, chainToChainId } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';

// Replace with your contract address and chain names
const AVALANCHE_SENDER_ADDRESS = "INSERT_AVALANCHE_SENDER_CONTRACT_ADDRESS";
const CELO_RECEIVER_ADDRESS = "INSERT_CELO_RECEIVER_ADDRESS";
const AVALANCHE_CHAIN_NAME = "Avalanche";
const CELO_CHAIN_NAME = "Celo";

// Fetch the contract ABI from the local filesystem
// This example uses the `out` directory from a Foundry deployment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SENDER_ABI_PATH = path.resolve(
  __dirname,
  '../out/CrossChainSender.sol/CrossChainSender.json',
);


(async function () {
  try {
    console.log("Initializing Wormhole SDK...");
    const wh = await wormhole('Testnet', [evm]);
    const sendChain = wh.getChain(AVALANCHE_CHAIN_NAME);
    const rcvChain = wh.getChain(CELO_CHAIN_NAME);
    console.log(`Source Chain: ${sendChain.chain}, Target Chain: ${rcvChain.chain}`);

    // Create an ethers.Signer wallet with your EVM private key
    // using locally scoped credentials. EVM_PRIVATE_KEY must
    // be loaded securely beforehand, for example via a keystore, secrets
    // manager, or environment variables (not recommended).

    console.log("Getting RPC and creating ethers Signer...");
    const EVM_PRIVATE_KEY = EVM_PRIVATE_KEY!; 
    if (!EVM_PRIVATE_KEY) {
      console.error("EVM_PRIVATE_KEY is not set in your .env file.");
      process.exit(1);
    }

    // Get the RPC URL or Provider from the SDK
    const sourceRpcOrProvider = await sendChain.getRpc();

    let sourceProvider: ethers.JsonRpcProvider;
    if (sourceRpcOrProvider && typeof (sourceRpcOrProvider as any).getBlockNumber === 'function') {
      sourceProvider = sourceRpcOrProvider as ethers.JsonRpcProvider;
    } else if (typeof sourceRpcOrProvider === 'string') {
      sourceProvider = new ethers.JsonRpcProvider(sourceRpcOrProvider);
    } else if (Array.isArray(sourceRpcOrProvider) && typeof sourceRpcOrProvider[0] === 'string') {
      sourceProvider = new ethers.JsonRpcProvider(sourceRpcOrProvider[0]);
    } else {
      console.error("Could not get a valid RPC URL or Provider from SDK:", sourceRpcOrProvider);
      process.exit(1);
    }

    // Create the wallet using the provider and private key
    const sourceWallet = new ethers.Wallet(EVM_PRIVATE_KEY, sourceProvider);

    // Load the sender contract ABI
    console.log("Loading CrossChainSender ABI...");
    if (!fs.existsSync(SENDER_ABI_PATH)) {
      console.error(`ABI file not found at ${SENDER_ABI_PATH}`);
      process.exit(1);
    }
    const CrossChainSenderArtifact = JSON.parse(fs.readFileSync(SENDER_ABI_PATH, 'utf8'));
    const senderAbi = CrossChainSenderArtifact.abi;

    // Create new sender contract instance
    const senderContract = new ethers.Contract(
      AVALANCHE_SENDER_ADDRESS,
      senderAbi,
      sourceWallet
    );
    console.log(`CrossChainSender contract instance created at ${AVALANCHE_SENDER_ADDRESS}`);

    // Get user input for token transfer parameters
    const tokenAddress = readlineSync.question('Enter the (ERC20) token contract address on Avalanche: ');
    const recipientAddress = readlineSync.question('Enter the recipient address on Celo: ');
    const amountStr = readlineSync.question('Enter the amount of tokens to transfer: ');

    // Approve sending tokens from the source wallet to the sender contract
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function decimals() view returns (uint8)',
        'function approve(address spender, uint256 amount) public returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
      ],
      sourceWallet
    );

    // Convert the amount to the correct units based on token decimals
    const decimals = Number(await tokenContract.decimals());
    const amountToTransfer = ethers.parseUnits(amountStr, decimals);

    // Get a transfer cost quote
    const targetChainId = chainToChainId(rcvChain.chain);
    const cost = await senderContract.quoteCrossChainDeposit(targetChainId);

    console.log(`Approving ${amountStr} tokens for transfer...`);
    const approveTx = await tokenContract.approve(AVALANCHE_SENDER_ADDRESS, amountToTransfer);
    console.log(`Approval transaction sent: ${approveTx.hash}`);
    await approveTx.wait();

    // Initiate the transfer
    console.log(`Initiating cross-chain transfer to ${CELO_RECEIVER_ADDRESS} on ${rcvChain.chain}...`);
    const transferTx = await senderContract.sendCrossChainDeposit(
      targetChainId,
      CELO_RECEIVER_ADDRESS,
      recipientAddress,
      amountToTransfer,
      tokenAddress,
      { value: cost }
    );
    console.log(`Transfer transaction sent: ${transferTx.hash}`);
    await transferTx.wait();
    console.log(`✅ Transfer initiated successfully!`);

  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }

  process.exit(0);
})();