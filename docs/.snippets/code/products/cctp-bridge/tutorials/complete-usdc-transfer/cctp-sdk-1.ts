import {
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
  Chain,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

export interface SignerStuff<N extends Network, C extends Chain> {
  chain: ChainContext<N, C>;
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

// Signer setup function for different blockchain platforms
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
    case 'Solana':
      signer = await (
        await solana()
      ).getSigner(await chain.getRpc(), 'SOL_PRIVATE_KEY');
      break;
    case 'Evm':
      signer = await (
        await evm()
      ).getSigner(await chain.getRpc(), 'ETH_PRIVATE_KEY');
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
