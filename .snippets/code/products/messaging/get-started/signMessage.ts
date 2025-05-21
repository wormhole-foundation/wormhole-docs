import { ethers } from 'ethers';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

// Replace with the nickname you used for `cast wallet import`
const ACCOUNT_NAME = 'SEPOLIA';
// Replace with your Sepolia RPC endpoint URL
const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';

export async function signEvmMessage() {
  // Create an ethers.js provider
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Load encrypted keystore
  const keystorePath = path.join(
    os.homedir(),
    '.foundry',
    'keystores',
    'SEPOLIA'
  );
  const keystore = fs.readFileSync(keystorePath, 'utf8');

  // Prompt for the password
  const rl = readline.createInterface({ input, output });
  const password = await rl.question(
    `Enter password to decrypt keystore for "${ACCOUNT_NAME}": `
  );
  rl.close();

  if (!password) {
    throw new Error('No password provided. Cannot decrypt keystore.');
  }

  // Decrypt and connect the wallet
  const wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
  console.log('Keystore decrypted successfully.');
  const connectedWallet = wallet.connect(provider);

  // Connect the wallet to the provider to create a full signer
  const signer = wallet.connect(provider);

  console.log(`Signer loaded for address: ${await signer.getAddress()}`);

  return { signer, provider };
}
