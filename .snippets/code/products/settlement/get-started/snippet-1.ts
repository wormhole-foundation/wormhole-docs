import {
  Chain,
  ChainAddress,
  ChainContext,
  Network,
  Signer,
  Wormhole,
} from '@wormhole-foundation/sdk-connect';
import { getEvmSignerForKey } from '@wormhole-foundation/sdk-evm';
import { getSolanaSigner } from '@wormhole-foundation/sdk-solana';
import { JsonRpcProvider } from "ethers";

/**
 * Create a helper function that returns a signer for the given chain using locally scoped credentials.
 * The required values (MAINNET_ETH_PRIVATE_KEY, ETHEREUM_MAINNET_RPC)
 * must be loaded securely beforehand, for example via a keystore,
 * secrets manager, or environment variables (not recommended).
 */

// Define transfer interface.
export interface SignerContext<N extends Network, C extends Chain> {
  signer: Signer<N, C>;
  address: ChainAddress<C>;
}

export async function getSigner<N extends Network, C extends Chain>(
  chain: ChainContext<N, C>
): Promise<SignerContext<N, C>> {
  let signer: Signer;
  const platform = chain.platform.utils()._platform;
  switch (platform) {
    case "Solana":
      signer = await getSolanaSigner(
        await chain.getRpc(),
        "MAINNET_SOL_PRIVATE_KEY"
      );
      break;
    case 'Evm':
      signer = await getEvmSignerForKey(
        await chain.getRpc(),
        'MAINNET_ETH_PRIVATE_KEY'
      );
      break;
    default:
      throw new Error('Unrecognized platform: ' + platform);
  }

  return {
    signer: signer as Signer<N, C>,
    address: Wormhole.chainAddress(chain.chain, signer.address()),
  };
}
