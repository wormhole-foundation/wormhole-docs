import { getEvmSigner } from '@wormhole-foundation/sdk-evm';
import { ethers } from 'ethers';

/**
 * Returns a signer for the given chain using locally scoped credentials.
 * The required values (MOONBEAM_PRIVATE_KEY, SEPOLIA_PRIVATE_KEY) must
 * be loaded securely beforehand, for example via a keystore, secrets
 * manager, or environment variables (not recommended).
 */
// Use a custom RPC or fallback to public endpoints
const MOONBEAM_RPC_URL =
  process.env.MOONBEAM_RPC_URL! || 'https://rpc.api.moonbase.moonbeam.network';
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL! || 'https://eth-sepolia.public.blastapi.io';

// Define raw ethers.Wallets for contract runner interactions
export function getMoonbeamWallet(): ethers.Wallet {
  return new ethers.Wallet(
    MOONBEAM_PRIVATE_KEY!,
    new ethers.JsonRpcProvider(MOONBEAM_RPC_URL)
  );
}
export function getSepoliaWallet(): ethers.Wallet {
  return new ethers.Wallet(
    SEPOLIA_PRIVATE_KEY!,
    new ethers.JsonRpcProvider(SEPOLIA_RPC_URL)
  );
}

// Create Wormhole-compatible signer for SDK interactions
export async function getMoonbeamSigner() {
  const wallet = getMoonbeamWallet(); // Wallet
  const provider = wallet.provider as ethers.JsonRpcProvider; // Provider
  return await getEvmSigner(provider, wallet, { chain: 'Moonbeam' });
}

export async function getSepoliaSigner() {
  const wallet = getSepoliaWallet();
  const provider = wallet.provider as ethers.JsonRpcProvider;
  return await getEvmSigner(provider, wallet, { chain: 'Sepolia' });
}
