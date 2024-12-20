import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import readlineSync from 'readline-sync';

dotenv.config();

interface ChainConfig {
  description: string;
  chainId: number;
  rpc: string;
  tokenBridge: string;
  wormholeRelayer: string;
  wormhole: string;
}

interface DeployedContracts {
  [chainId: number]: {
    networkName: string;
    CrossChainSender?: string;
    CrossChainReceiver?: string;
    deployedAt: string;
  };
}

function loadConfig(): ChainConfig[] {
  const configPath = path.resolve(__dirname, '../deploy-config/config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8')).chains;
}

function loadDeployedContracts(): DeployedContracts {
  const contractsPath = path.resolve(
    __dirname,
    '../deploy-config/contracts.json'
  );
  if (
    !fs.existsSync(contractsPath) ||
    fs.readFileSync(contractsPath, 'utf8').trim() === ''
  ) {
    console.error(
      'No contracts found. Please deploy contracts first before transferring tokens.'
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
}

function selectSourceChain(deployedContracts: DeployedContracts): {
  chainId: number;
  networkName: string;
} {
  const sourceOptions = Object.entries(deployedContracts).filter(
    ([, contracts]) => contracts.CrossChainSender
  );

  if (sourceOptions.length === 0) {
    console.error('No source chains available with CrossChainSender deployed.');
    process.exit(1);
  }

  console.log('\nSelect the source chain:');
  sourceOptions.forEach(([chainId, contracts], index) => {
    console.log(`${index + 1}: ${contracts.networkName}`);
  });

  const selectedIndex =
    readlineSync.questionInt(`\nEnter the number for the source chain: `) - 1;
  return {
    chainId: Number(sourceOptions[selectedIndex][0]),
    networkName: sourceOptions[selectedIndex][1].networkName,
  };
}

function selectTargetChain(deployedContracts: DeployedContracts): {
  chainId: number;
  networkName: string;
} {
  const targetOptions = Object.entries(deployedContracts).filter(
    ([, contracts]) => contracts.CrossChainReceiver
  );

  if (targetOptions.length === 0) {
    console.error(
      'No target chains available with CrossChainReceiver deployed.'
    );
    process.exit(1);
  }

  console.log('\nSelect the target chain:');
  targetOptions.forEach(([chainId, contracts], index) => {
    console.log(`${index + 1}: ${contracts.networkName}`);
  });

  const selectedIndex =
    readlineSync.questionInt(`\nEnter the number for the target chain: `) - 1;
  return {
    chainId: Number(targetOptions[selectedIndex][0]),
    networkName: targetOptions[selectedIndex][1].networkName,
  };
}

async function main() {
  const chains = loadConfig();
  const deployedContracts = loadDeployedContracts();

  // Select the source chain (only show chains with CrossChainSender deployed)
  const { chainId: sourceChainId, networkName: sourceNetworkName } =
    selectSourceChain(deployedContracts);
  const sourceChain = chains.find((chain) => chain.chainId === sourceChainId)!;

  // Select the target chain (only show chains with CrossChainReceiver deployed)
  const { chainId: targetChainId, networkName: targetNetworkName } =
    selectTargetChain(deployedContracts);
  const targetChain = chains.find((chain) => chain.chainId === targetChainId)!;

  // Set up providers and wallets
  const sourceProvider = new ethers.JsonRpcProvider(sourceChain.rpc);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, sourceProvider);

  // Load the ABI from the JSON file (use the compiled ABI from Forge or Hardhat)
  const CrossChainSenderArtifact = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        '../out/CrossChainSender.sol/CrossChainSender.json'
      ),
      'utf8'
    )
  );

  const abi = CrossChainSenderArtifact.abi;

  // Create the contract instance using the full ABI
  const CrossChainSender = new ethers.Contract(
    deployedContracts[sourceChainId].CrossChainSender!,
    abi,
    wallet
  );

  // Display the selected chains
  console.log(
    `\nInitiating transfer from ${sourceNetworkName} to ${targetNetworkName}.`
  );

  // Ask the user for token transfer details
  const tokenAddress = readlineSync.question(
    'Enter the token contract address: '
  );
  const recipientAddress = readlineSync.question(
    'Enter the recipient address on the target chain: '
  );

  // Get the token contract
  const tokenContractDecimals = new ethers.Contract(
    tokenAddress,
    [
      'function decimals() view returns (uint8)',
      'function approve(address spender, uint256 amount) public returns (bool)',
    ],
    wallet
  );

  // Fetch the token decimals
  const decimals = await tokenContractDecimals.decimals();

  // Get the amount from the user, then parse it according to the token's decimals
  const amount = ethers.parseUnits(
    readlineSync.question('Enter the amount of tokens to transfer: '),
    decimals
  );

  // Calculate the cross-chain transfer cost
  const cost = await CrossChainSender.quoteCrossChainDeposit(targetChainId);

  // Approve the CrossChainSender contract to transfer tokens on behalf of the user
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount) public returns (bool)'],
    wallet
  );

  const approveTx = await tokenContract.approve(
    deployedContracts[sourceChainId].CrossChainSender!,
    amount
  );
  await approveTx.wait();
  console.log(`Approved tokens for cross-chain transfer.`);

  // Initiate the cross-chain transfer
  const transferTx = await CrossChainSender.sendCrossChainDeposit(
    targetChainId,
    deployedContracts[targetChainId].CrossChainReceiver!,
    recipientAddress,
    amount,
    tokenAddress,
    { value: cost } // Attach the necessary fee for cross-chain transfer
  );
  await transferTx.wait();
  console.log(
    `Transfer initiated from ${sourceNetworkName} to ${targetNetworkName}. Transaction Hash: ${transferTx.hash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
