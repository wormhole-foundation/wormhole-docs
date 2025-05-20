import { ethers } from 'ethers';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline/promises';
import readlineSync from 'readline-sync';
import { stdin as input, stdout as output } from 'process';
import { fileURLToPath } from 'url';
import { Chain, ChainConfig, CrossChainSenderJson, CrossChainReceiverJson, DeployedContracts } from './interfaces.js';

// Define a function for loading the chain configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function loadConfig(): ChainConfig[] {
  const configPath = path.resolve(__dirname, '../deploy-config/chains.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
}

// Define a function for selecting the source and target chains 
// from the configuration based on user input
function selectChain(
  chains: ChainConfig[],
  role: 'source' | 'target',
): ChainConfig {
  console.log(`\nSelect the ${role.toUpperCase()} chain:`);
  chains.forEach((chain, index) => {
    console.log(`${index + 1}: ${chain.description}`);
  });

  const chainIndex =
    readlineSync.questionInt(
      `\nEnter the number for the ${role.toUpperCase()} chain: `,
    ) - 1;
  return chains[chainIndex];
}

async function main() {
  // Load the chain configuration
  const chains = loadConfig();

  const sourceChain = selectChain(chains, 'source');
  const targetChain = selectChain(chains, 'target');

  //Set up the provider for the source and target chains
  const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
  const targetProvider = new ethers.JsonRpcProvider(targetChain.rpc);

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
  const targetWallet = wallet.connect(targetProvider);

  // -- Deploy CrossChainSender contract --

  // Read the compiled sender contract from the output directory
  const crossChainSenderJsonContent = fs.readFileSync(
    path.resolve(
      __dirname,
      '../out/CrossChainSender.sol/CrossChainSender.json',
    ),
    'utf8',
  );
  const crossChainSenderJson: CrossChainSenderJson = JSON.parse(crossChainSenderJsonContent);

  // Destructure for sender contract, renaming the variables
  const { abi: senderAbi, bytecode: senderBytecode } = crossChainSenderJson; // Or just { abi, bytecode } if preferred for the first set

  console.log('Deploying CrossChainSender...');
  const CrossChainSenderFactory = new ethers.ContractFactory( 
    senderAbi,    
    senderBytecode, 
    sourceWallet,
  );
  const senderContract = await CrossChainSenderFactory.deploy(
    sourceChain.wormholeRelayer,
    sourceChain.tokenBridge,
    sourceChain.wormhole,
  );
  await senderContract.waitForDeployment();
  console.log(`CrossChainSender deployed at: ${await senderContract.getAddress()}`);

  // Update deployedContracts.json for source chain
  const deployedContractsPath = path.resolve(__dirname, '../deploy-config/deployedContracts.json');
  let deployedContracts: DeployedContracts = JSON.parse(fs.readFileSync(deployedContractsPath, 'utf8'));

  deployedContracts.sourceChain = {
    chainId: sourceChain.chainId,
    networkName: sourceChain.description,
    CrossChainSender: await senderContract.getAddress(),
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(deployedContractsPath, JSON.stringify(deployedContracts, null, 2));
  console.log('Updated deployedContracts.json for source chain.');

  // -- Deploy CrossChainReceiver contract --

  // Extract the ABI and bytecode
  const crossChainReceiverJsonContent = fs.readFileSync(
    path.resolve(
      __dirname,
      '../out/CrossChainReceiver.sol/CrossChainReceiver.json',
    ),
    'utf8',
  );
  const crossChainReceiverJson: CrossChainReceiverJson = JSON.parse(crossChainReceiverJsonContent);
  // Destructure for receiver, renaming the variables
  const { abi: receiverAbi, bytecode: receiverBytecode } = crossChainReceiverJson;

  if (!receiverAbi) {
    throw new Error("Receiver ABI is undefined. Check CrossChainReceiver.json and destructuring.");
  }
  if (!receiverBytecode) {
    throw new Error("Receiver bytecode is undefined. Check CrossChainReceiver.json and destructuring.");
  }

  console.log('Deploying CrossChainReceiver...');
  const CrossChainReceiverFactory = new ethers.ContractFactory( 
    receiverAbi,    
    receiverBytecode, 
    targetWallet,
  );
  const receiverContract = await CrossChainReceiverFactory.deploy(
    targetChain.wormholeRelayer,
    targetChain.tokenBridge,
    targetChain.wormhole,
  );
  await receiverContract.waitForDeployment();
  console.log(`CrossChainReceiver deployed at: ${await receiverContract.getAddress()}`);

  // Update deployedContracts.json for target chain 
  deployedContracts.targetChain = {
    chainId: targetChain.chainId,
    networkName: targetChain.description,
    CrossChainReceiver: await receiverContract.getAddress(),
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(deployedContractsPath, JSON.stringify(deployedContracts, null, 2));
  console.log('Updated deployedContracts.json for target chain.');
  console.log('Deployment script finished successfully!');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});