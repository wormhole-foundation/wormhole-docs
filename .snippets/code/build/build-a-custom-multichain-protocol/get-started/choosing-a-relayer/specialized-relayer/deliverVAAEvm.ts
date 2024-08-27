// Set up eth wallet
const ethProvider = new ethers.providers.StaticJsonRpcProvider(ETH_HOST);
const ethWallet = new ethers.Wallet(WALLET_PRIVATE_KEY, ethProvider);

// Create client to interact with our target app
const ethHelloWorld = HelloWorld__factory.connect('INSERT-CONTRACT-ADDRESS', ethWallet);

// Invoke the receiveMessage on the ETH contract and wait for confirmation
const receipt = await ethHelloWorld
  .receiveMessage(vaaBytes)
  .then((tx: ethers.ContractTransaction) => tx.wait())
  .catch((msg: any) => {
    console.error(msg);
    return null;
  });
