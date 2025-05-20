import { ethers } from 'ethers';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline/promises';
import readlineSync from 'readline-sync';
import { stdin as input, stdout as output } from 'process';
import { fileURLToPath } from 'url';
import { Chain, ChainConfig, DeployedContracts } from './interfaces.js';

// Define a function for loading the chain configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function loadConfig(): ChainConfig[] {
  const configPath = path.resolve(__dirname, '../deploy-config/chains.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
}

// Define a function to load the deployed contracts from deployedContracts.json
function loadDeployedContracts(): DeployedContracts {
  const contractsPath = path.resolve(
    __dirname,
    '../deploy-config/deployedContracts.json',
  );
  if (
    !fs.existsSync(contractsPath) ||
    fs.readFileSync(contractsPath, 'utf8').trim() === ''
  ) {
    console.error(
      'No contracts found. Please deploy contracts first before transferring tokens.',
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
}

// Define a function to allow the user to select the source chain from the configuration
function selectSourceChain(deployedContracts: DeployedContracts): {
  chainId: number;
  networkName: string;
  crossChainSenderAddress: string;
} {
  const sourceOptions = Object.entries(deployedContracts).filter(
    ([_key, contractDetails]) => contractDetails && contractDetails.CrossChainSender,
  );

  if (sourceOptions.length === 0) {
    console.error('No source chains available with CrossChainSender deployed.');
    process.exit(1);
  }

  console.log('\nSelect the source chain:');
  sourceOptions.forEach(([_key, contractDetails], index) => {
    console.log(`${index + 1}: ${contractDetails.networkName}`);
  });

  const selectedIndex =
    readlineSync.questionInt(`\nEnter the number for the source chain: `) - 1;
    if (selectedIndex < 0 || selectedIndex >= sourceOptions.length) {
        console.error('Invalid selection. Exiting.');
        process.exit(1);
      }

      // Get the selected entry
      const selectedEntryValue = sourceOptions[selectedIndex][1]; 

      if (!selectedEntryValue.CrossChainSender) {
          console.error("Selected source chain option is missing CrossChainSender address internally.");
          process.exit(1);
      }

      return {
        chainId: selectedEntryValue.chainId, // Get chainId from the value object
        networkName: selectedEntryValue.networkName, // Get networkName from the value object
        crossChainSenderAddress: selectedEntryValue.CrossChainSender, // Return the sender address 
      };
}

// Define a function to allow the user to select the target chain from the configuration
function selectTargetChain(deployedContracts: DeployedContracts): {
  chainId: number;
  networkName: string;
  crossChainReceiverAddress: string;
} {
  const targetOptions = Object.entries(deployedContracts).filter(
    ([_key, contractDetails]) => contractDetails && contractDetails.CrossChainReceiver,
  );

  if (targetOptions.length === 0) {
    console.error(
      'No target chains available with CrossChainReceiver deployed.',
    );
    process.exit(1);
  }

  console.log('\nSelect the target chain:');
  targetOptions.forEach(([_key, contractDetails], index) => {
    console.log(`${index + 1}: ${contractDetails.networkName}`);
  });

  const selectedIndex =
    readlineSync.questionInt(`\nEnter the number for the target chain: `) - 1;
    if (selectedIndex < 0 || selectedIndex >= targetOptions.length) {
        console.error('Invalid selection. Exiting.');
        process.exit(1);
      }

      const selectedEntryValue = targetOptions[selectedIndex][1];

      if (!selectedEntryValue.CrossChainReceiver) {
        console.error("Selected target chain option is missing CrossChainReceiver address internally.");
        process.exit(1);
      }

      return {
        chainId: selectedEntryValue.chainId,
        networkName: selectedEntryValue.networkName,
        crossChainReceiverAddress: selectedEntryValue.CrossChainReceiver,
      };
}

async function main() {
  // Load the chain configuration and deployed contracts from the JSON files
  const chains = loadConfig();
  const deployedContracts = loadDeployedContracts();

  // Select the source chain (only show chains with CrossChainSender deployed)
  const {
    chainId: sourceChainId,
    networkName: sourceNetworkName,
    crossChainSenderAddress,
  } = selectSourceChain(deployedContracts);

  const sourceChain = chains.find(
    (chain) => chain.chainId === sourceChainId,
  )!;
  if (!sourceChain) {
    console.error(
      `Could not find chain configuration for source chain ID: ${sourceChainId}`,
    );
    process.exit(1);
  }

  // Select the target chain (only show chains with CrossChainReceiver deployed)
  const {
    chainId: targetChainId,
    networkName: targetNetworkName,
    crossChainReceiverAddress,
  } = selectTargetChain(deployedContracts);
  const targetChain = chains.find(
    (chain) => chain.chainId === targetChainId,
  )!;
  if (!targetChain) {
    console.error(
      `Could not find chain configuration for target chain ID: ${targetChainId}`,
    );
    process.exit(1);
  }

  // Set up the provider for the source chain
  const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
  // Load the encrypted keystore
  const keystorePath = path.join(
    os.homedir(),
    '.foundry',
    'keystores',
    'CELO_AVAX',
  );
  const keystore = fs.readFileSync(keystorePath, 'utf8');

  // Prompt for the password to decrypt the keystore
  const rl = readline.createInterface({ input, output });
  const password = await rl.question('Enter keystore password: ');
  rl.close();

  if (!password) {
    throw new Error('No password provided.');
  }

  // Decrypt and connect the wallet
  const wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
  const sourceWallet = wallet.connect(sourceProvider);
  console.log(`Wallet connected for address: ${sourceWallet.address} on source chain.`);

  // Load the ABI from the JSON file (use the compiled ABI from Forge or Hardhat)
  const CrossChainSenderArtifact = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        '../out/CrossChainSender.sol/CrossChainSender.json',
      ),
      'utf8',
    ),
  );

  const senderAbi = CrossChainSenderArtifact.abi;

  // Create the contract instance using the full ABI
  const senderContract = new ethers.Contract(
    crossChainSenderAddress, // Use the address returned by selectSourceChain
    senderAbi, // Your loaded ABI
    sourceWallet // Wallet connected to the source provider
    );

  // Get the token address from the user
  const tokenAddress = readlineSync.question(
    'Enter the token contract address: ',
  );
  // Get the recipient address from the user
  const recipientAddress = readlineSync.question(
    'Enter the recipient address on the target chain: ',
  );

  // Get the token contract
  const tokenContractDecimals = new ethers.Contract(
    tokenAddress,
    [
      'function decimals() view returns (uint8)',
      'function approve(address spender, uint256 amount) public returns (bool)',
    ],
    sourceWallet,
  );
  console.log(`Token contract instance created at ${tokenAddress}`);
  // Fetch the token decimals
  const decimals = await tokenContractDecimals.decimals();

  // Get the amount from the user, then parse it according to the token's decimals
  const amount = ethers.parseUnits(
    readlineSync.question('Enter the amount of tokens to transfer: '),
    decimals,
  );
  // Initiate the transfer
  const cost = await senderContract.quoteCrossChainDeposit(targetChain.chainId);
  // Approve the CrossChainSender contract to transfer tokens on behalf of the user
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount) public returns (bool)'],
    sourceWallet,
  );

  const approveTx = await tokenContract.approve(
    deployedContracts.sourceChain.CrossChainSender!,
    amount
  );
  await approveTx.wait();

  const receiverContractAddress = deployedContracts.targetChain.CrossChainReceiver;
  if (!receiverContractAddress) {
      console.error("CrossChainReceiver address not found in deployedContracts.targetChain.");
      process.exit(1);
  }

  console.log(`Initiating cross-chain transfer to ${receiverContractAddress} on target chain...`);
  // Initiate the cross-chain transfer
  const transferTx = await senderContract.sendCrossChainDeposit(
    targetChain.chainId,
    crossChainReceiverAddress,
    recipientAddress,
    amount,
    tokenAddress,
    { value: cost }, // Attach the necessary fee for cross-chain transfer
  );
  await transferTx.wait();
  console.log(
    `Transfer initiated from ${sourceNetworkName} to ${targetNetworkName}. Transaction Hash: ${transferTx.hash}`,
  );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  });