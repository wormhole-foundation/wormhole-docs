import type { Network, SupportMap } from '../types/support';
import { normalizeChainName, stripNetworkSuffix } from './chainNames';

const NETWORKS: Network[] = ['Mainnet', 'Testnet', 'Devnet'];

export function normalizeSupportKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function normalizeCctpChainName(value: string): string {
  const aliased = normalizeChainName(value);
  const cleaned = aliased.trim().replace(/\s+/g, ' ');
  const stripped = stripNetworkSuffix(cleaned);
  const lower = stripped.toLowerCase();

  if (lower.endsWith('sepolia')) {
    const base = stripped.slice(0, -'sepolia'.length).trim();
    return base.length > 0 ? base : 'Ethereum';
  }

  if (lower.endsWith('holesky')) {
    const base = stripped.slice(0, -'holesky'.length).trim();
    return base.length > 0 ? base : 'Ethereum';
  }

  if (lower.endsWith('testnet')) {
    const base = stripped.slice(0, -'testnet'.length).trim();
    return base.length > 0 ? base : stripped;
  }

  if (lower.endsWith('devnet')) {
    const base = stripped.slice(0, -'devnet'.length).trim();
    return base.length > 0 ? base : stripped;
  }

  return stripped;
}

export function normalizeCctpSupportKey(value: string): string {
  return normalizeSupportKey(normalizeCctpChainName(value));
}

export function sortUnique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function buildSupportLookupWithNormalizer(
  support: SupportMap,
  normalizer: (value: string) => string,
): Record<Network, Set<string>> {
  return {
    Mainnet: new Set(support.Mainnet.map(normalizer)),
    Testnet: new Set(support.Testnet.map(normalizer)),
    Devnet: new Set(support.Devnet.map(normalizer)),
  };
}

export function buildCctpSupportLookup(support: SupportMap): Record<Network, Set<string>> {
  return buildSupportLookupWithNormalizer(support, normalizeCctpSupportKey);
}

export function mergeSupportMaps(a: SupportMap, b: SupportMap): SupportMap {
  const merged: SupportMap = {
    Mainnet: [],
    Testnet: [],
    Devnet: [],
  };

  for (const network of NETWORKS) {
    merged[network] = sortUnique([...(a[network] ?? []), ...(b[network] ?? [])]);
  }

  return merged;
}
