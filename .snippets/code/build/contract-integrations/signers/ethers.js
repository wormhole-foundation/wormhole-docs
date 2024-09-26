import { ethers } from 'ethers';

// Set up a provider and signer (replace with your own provider URL)
const provider = new ethers.providers.JsonRpcProvider(
  'https://your-rpc-provider-url'
);
const privateKey = 'your-private-key';
const signer = new ethers.Wallet(privateKey, provider);

// Example: Signing and sending a transaction
async function sendTransaction() {
  const tx = {
    to: 'recipient-address',
    value: ethers.utils.parseEther('0.1'), // Sending 0.1 ETH
    gasPrice: await provider.getGasPrice(),
    gasLimit: ethers.utils.hexlify(21000),
  };

  const transaction = await signer.sendTransaction(tx);
  console.log('Transaction hash:', transaction.hash);
}
sendTransaction();
