import { toChainId } from '@wormhole-foundation/sdk';
import { NTTToken, Operation } from './types';

export function getRandomPlatform(
  token: NTTToken
): { platform: string; address: string; chainId: number } | null {
  const platforms = Object.entries(token.platforms);

  if (platforms.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * platforms.length);
  const [platform, address] = platforms[randomIndex];

  try {
    // SDK expects "Ethereum" not "ethereum"
    const capitalizedPlatform =
      platform.charAt(0).toUpperCase() + platform.slice(1);
    const chainId = toChainId(capitalizedPlatform);
    return { platform, address, chainId };
  } catch (error) {
    const platformMapping: Record<string, string> = {
      'arbitrum-one': 'Arbitrum',
      'binance-smart-chain': 'Bsc',
      'polygon-pos': 'Polygon',
      'optimistic-ethereum': 'Optimism',
    };

    const mappedPlatform = platformMapping[platform.toLowerCase()];
    if (mappedPlatform) {
      try {
        const chainId = toChainId(mappedPlatform);
        return { platform, address, chainId };
      } catch (mappedError) {
        console.warn(
          `Could not convert mapped platform ${mappedPlatform} to chain ID`
        );
        return null;
      }
    }

    console.warn(`Could not convert platform ${platform} to chain ID`);
    return null;
  }
}

export function getOperationStatus(operation: Operation): string {
  if (operation.targetChain) {
    return 'Completed';
  } else if (operation.vaa) {
    return 'Emitted';
  } else if (operation.sourceChain) {
    return 'In Progress';
  } else {
    return 'Unknown';
  }
}
