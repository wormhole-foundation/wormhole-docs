import { ethers } from 'ethers';

// Update the following variables
const rpcUrl = 'INSERT_RPC_URL';
const privateKey = 'INSERT_PRIVATE_KEY';
const toAddress = 'INSERT_RECIPIENT_ADDRESS';

// Set up a provider and signer
const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

// Example: Signing and sending a transaction
async function sendTransaction() {
  const tx = {
    to: toAddress,
    value: ethers.parseUnits('0.1'), // Sending 0.1 ETH
    gasPrice: await provider.getGasPrice(),
    gasLimit: ethers.toBeHex(21000),
  };

  const transaction = await signer.sendTransaction(tx);
  console.log('Transaction hash:', transaction.hash);
}
sendTransaction();
