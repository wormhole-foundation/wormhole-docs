// Set up eth wallet
const ethProvider = new ethers.providers.StaticJsonRpcProvider('INSERT_RPC_URL');
const ethWallet = new ethers.Wallet('INSERT_PRIVATE_KEY', ethProvider);

// Create client to interact with our target app
const ethHelloWorld = HelloWorld__factory.connect('INSERT_CONTRACT_ADDRESS', ethWallet);

// Invoke the receiveMessage on the ETH contract and wait for confirmation
const receipt = await ethHelloWorld
  .receiveMessage(vaaBytes)
  .then((tx: ethers.ContractTransaction) => tx.wait())
  .catch((msg: any) => {
    console.error(msg);
    return null;
  });
