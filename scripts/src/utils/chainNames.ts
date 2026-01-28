import type { DocChain } from '../types/chains';

const CHAIN_ALIASES: Record<string, string> = {
  kaia: 'Kaia',
  klaytn: 'Kaia',
};

export function normalizeChainName(name: string): string {
  return resolveChainAliasName(name);
}

export function buildChainTitleMap(chains: DocChain[]): Map<string, string> {
  const map = new Map<string, string>();
  const add = (key: string | undefined, value: string | undefined) => {
    if (!key || !value) return;
    map.set(normalizeChainKey(key), value);
  };

  for (const chain of chains) {
    const mainnetTitle = chain.mainnet.extraDetails?.title ?? chain.mainnet.name;
    add(chain.mainnet.name, mainnetTitle);
    add(mainnetTitle, mainnetTitle);

    for (const testnet of chain.testnets ?? []) {
      const testnetTitle = testnet.extraDetails?.title ?? testnet.name;
      add(testnet.name, testnetTitle);
      add(testnetTitle, testnetTitle);
    }

    for (const devnet of chain.devnets ?? []) {
      const devnetTitle = devnet.extraDetails?.title ?? devnet.name;
      add(devnet.name, devnetTitle);
      add(devnetTitle, devnetTitle);
    }
  }

  return map;
}

export function resolveDisplayChainName(raw: string, chainTitleMap: Map<string, string>): string {
  const aliased = resolveChainAliasName(raw);
  const normalized = normalizeChainKey(aliased);
  const direct = chainTitleMap.get(normalized);
  if (direct) return direct;

  const stripped = stripNetworkSuffix(normalized);
  if (stripped !== normalized) {
    const mapped = chainTitleMap.get(stripped);
    if (mapped) return mapped;
  }

  return raw;
}

function normalizeChainKey(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function resolveChainAliasName(raw: string): string {
  const normalized = normalizeChainKey(raw);
  return CHAIN_ALIASES[normalized] ?? raw;
}

function stripNetworkSuffix(value: string): string {
  const suffixes = [' testnet', ' mainnet', ' devnet'];
  for (const suffix of suffixes) {
    if (value.endsWith(suffix)) {
      return value.slice(0, -suffix.length).trim();
    }
  }
  return value;
}
