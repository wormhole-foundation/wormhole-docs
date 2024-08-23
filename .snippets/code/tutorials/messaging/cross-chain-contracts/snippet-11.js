const provider = new ethers.JsonRpcProvider(avalancheChain.rpc);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);