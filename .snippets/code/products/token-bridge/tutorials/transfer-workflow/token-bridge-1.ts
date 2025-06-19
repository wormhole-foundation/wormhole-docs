import {
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
  Chain,
  TokenId,
  isTokenId,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import aptos from '@wormhole-foundation/sdk/aptos';
import { config } from 'dotenv';
config();

export interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

/**
 * Returns a signer for the given chain using locally scoped credentials.
 * The required values (EVM_PRIVATE_KEY, SOL_PRIVATE_KEY, SUI_MNEMONIC, APTOS_PRIVATE_KEY) must
 * be loaded securely beforehand, for example via a keystore, secrets
 * manager, or environment variables (not recommended).
 */
export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>,
  gasLimit?: bigint
): Promise<{
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}> {
  let signer: Signer;
  const platform = chain.platform.utils()._platform;

  switch (platform) {
    case 'Solana':
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), 'SOL_PRIVATE_KEY');
      break;
    case 'Evm':
      const evmSignerOptions = gasLimit ? { gasLimit } : {};
      signer = await (
        await evm()
      ).getSigner(await chain.getRpc(), 'ETH_PRIVATE_KEY', evmSignerOptions);
      break;
    case 'Sui':
      signer = await (
        await sui()
      ).getSigner(await chain.getRpc(), 'SUI_MNEMONIC');
      break;
    case 'Aptos':
      signer = await (
        await aptos()
      ).getSigner(await chain.getRpc(), 'APTOS_PRIVATE_KEY');
      break;
    default:
      throw new Error('Unsupported platform: ' + platform);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

export async function getTokenDecimals<
  N extends 'Mainnet' | 'Testnet' | 'Devnet'
>(
  wh: Wormhole<N>,
  token: TokenId,
  sendChain: ChainContext<N, any>
): Promise<number> {
  return isTokenId(token)
    ? Number(await wh.getDecimals(token.chain, token.address))
    : sendChain.config.nativeTokenDecimals;
}
