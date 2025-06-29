import {
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
  Chain,
  isTokenId,
  TokenId,
} from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import sui from '@wormhole-foundation/sdk/sui';
import evm from '@wormhole-foundation/sdk/evm';

/**
 * Returns a signer for the given chain using locally scoped credentials.
 * The required values (EVM_PRIVATE_KEY, SOL_PRIVATE_KEY, SUI_MNEMONIC) must
 * be loaded securely beforehand, for example via a keystore, secrets
 * manager, or environment variables (not recommended).
 */
export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>
): Promise<{
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}> {
  let signer: Signer;
  const platform = chain.platform.utils()._platform;

  switch (platform) {
    case 'Evm':
      signer = await (
        await evm()
      ).getSigner(await chain.getRpc(), EVM_PRIVATE_KEY!);
      break;
    case 'Solana':
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), SOL_PRIVATE_KEY!);
      break;
    case 'Sui':
      signer = await (
        await sui()
      ).getSigner(await chain.getRpc(), SUI_MNEMONIC!);
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return {
    chain,
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}

/**
 * Get the number of decimals for the token on the source chain.
 * This helps convert a user-friendly amount (e.g., '1') into raw units.
 */
export async function getTokenDecimals<N extends Network>(
  wh: Wormhole<N>,
  token: TokenId,
  chain: ChainContext<N, any>
): Promise<number> {
  return isTokenId(token)
    ? Number(await wh.getDecimals(token.chain, token.address))
    : chain.config.nativeTokenDecimals;
}
