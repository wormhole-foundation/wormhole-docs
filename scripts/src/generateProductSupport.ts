import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import {
  extractArrayAfterConst,
  stripCommentsPreserveStrings,
  toJsonArray,
} from './utils/parsing';
import { normalizeChainName } from './utils/chainNames';
import { fetchText } from './utils/http';

type Network = 'Mainnet' | 'Testnet' | 'Devnet';
type NetworkRecord<T> = Record<Network, T>;

export type ProductConfig = {
  product: string;
  url?: string;
  urls?: string[];
  consts: string[];
  outputFile: string;
  customChains?: Record<string, string[]>;
  excludeChains?: string[];
  filterUrls?: string[];
  filterConsts?: string[];
  manualAdd?: Record<string, string[]>;
};

const NETWORKS: Network[] = ['Mainnet', 'Testnet', 'Devnet'];
const NETWORK_CANON_MAP: Record<string, Network> = {
  mainnet: 'Mainnet',
  mainnets: 'Mainnet',
  testnet: 'Testnet',
  testnets: 'Testnet',
  devnet: 'Devnet',
  devnets: 'Devnet',
};

const canonicalizeNetwork = (input: string): Network | undefined =>
  NETWORK_CANON_MAP[input.toLowerCase()];

function createNetworkRecord<T>(factory: () => T): NetworkRecord<T> {
  return {
    Mainnet: factory(),
    Testnet: factory(),
    Devnet: factory(),
  };
}

function parseContractsArray(
  rawSource: string,
  constNames: string[]
): Array<[string, Array<[string, unknown]>]> {
  const withoutComments = stripCommentsPreserveStrings(rawSource);

  for (const name of constNames) {
    const arrayText = extractArrayAfterConst(withoutComments, name);
    if (!arrayText) continue;
    try {
      return toJsonArray(arrayText);
    } catch (err) {
      console.warn(`Failed to parse array for ${name}: ${(err as Error).message}`);
    }
  }
  return [];
}

function mergeEthereumTestnets(chains: NetworkRecord<string[]>) {
  const ensure = (testnet: string) => {
    if (!chains.Testnet.includes(testnet)) chains.Testnet.push(testnet);
  };

  for (const name of [...chains.Testnet]) {
    if (name.endsWith('Sepolia')) {
      const base = name.replace(/Sepolia$/, '') || 'Ethereum';
      ensure(base);
    } else if (name.endsWith('Holesky')) {
      ensure('Ethereum');
    }
  }
}

function sortAndDedupe(record: NetworkRecord<string[]>) {
  for (const net of NETWORKS) {
    record[net] = Array.from(new Set(record[net])).sort((a, b) =>
      a.localeCompare(b)
    );
  }
}

async function fetchAll(urls: string[]): Promise<string[]> {
  return Promise.all(urls.map((u) => fetchText(u)));
}

function resolveOutputPath(outputFile: string): { absolute: string; relative: string } {
  const absolute = path.resolve(outputFile);
  const relative = path.relative(process.cwd(), absolute) || outputFile;
  return { absolute, relative };
}

async function writeJsonIfChanged(
  targetPath: string,
  data: NetworkRecord<string[]>
): Promise<'created' | 'updated' | 'noop'> {
  const payload = JSON.stringify(data, null, 2) + '\n';
  try {
    const current = await readFile(targetPath, 'utf8');
    if (current === payload) {
      return 'noop';
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, payload);
  return 'updated';
}

export async function generateProductSupport(config: ProductConfig) {
  const {
    product,
    url,
    urls,
    consts,
    outputFile,
    customChains,
    excludeChains,
    filterUrls,
    filterConsts,
    manualAdd,
  } = config;

  if (!consts?.length) {
    throw new Error(
      `[${product}] No 'consts' provided. Define 'consts' in product-support-config.json.`
    );
  }

  const sourceUrls = urls?.length ? urls : url ? [url] : undefined;
  if (!sourceUrls?.length) {
    throw new Error(`[${product}] No url(s) provided.`);
  }

  const exclusionSet = new Set(
    (excludeChains ?? []).map((name) => name.toLowerCase())
  );
  const productChains = createNetworkRecord<string[]>(() => []);

  // 1) Fetch product contract sources
  const sources = await fetchAll(sourceUrls);

  for (const src of sources) {
    const entries = parseContractsArray(src, consts);
    for (const [networkRaw, values] of entries) {
      const network = canonicalizeNetwork(String(networkRaw));
      if (!network || !Array.isArray(values)) continue;

      for (const item of values) {
        if (!Array.isArray(item) || item.length < 2) continue;
        const chain = normalizeChainName(String(item[0]));
        if (exclusionSet.has(chain.toLowerCase())) continue;
        productChains[network].push(chain);
      }
    }
  }

  // 2) Custom overrides (legacy)
  if (customChains) {
    for (const [networkRaw, names] of Object.entries(customChains)) {
      const network = canonicalizeNetwork(networkRaw);
      if (!network) continue;
      for (const name of names ?? []) {
        const chain = normalizeChainName(name);
        if (!exclusionSet.has(chain.toLowerCase())) {
          productChains[network].push(chain);
        }
      }
    }
  }

  sortAndDedupe(productChains);
  mergeEthereumTestnets(productChains);
  sortAndDedupe(productChains);

  // 3) Filter by allow-list (if provided)
  if (filterUrls?.length) {
    if (!filterConsts?.length) {
      console.warn(
        `[${product}] 'filterUrls' provided without 'filterConsts'; skipping allow-list step.`
      );
    } else {
      const allowed = createNetworkRecord<Set<string>>(() => new Set<string>());
      const filterSources = await fetchAll(filterUrls);

      for (const src of filterSources) {
        const entries = parseContractsArray(src, filterConsts);
        if (!entries.length) continue;

        for (const [networkRaw, values] of entries) {
          const network = canonicalizeNetwork(String(networkRaw));
          if (!network || !Array.isArray(values)) continue;

          for (const item of values) {
            if (!Array.isArray(item) || item.length < 2) continue;
            allowed[network].add(normalizeChainName(String(item[0])));
          }
        }
      }

      for (const network of NETWORKS) {
        productChains[network] = productChains[network].filter((name) =>
          allowed[network].has(name)
        );
      }
    }
  }

  // 4) Manual inclusions (force add back)
  if (manualAdd) {
    for (const [networkRaw, names] of Object.entries(manualAdd)) {
      const network = canonicalizeNetwork(networkRaw);
      if (!network) continue;
      for (const name of names ?? []) {
        const chain = normalizeChainName(name);
        if (!productChains[network].includes(chain)) {
          productChains[network].push(chain);
        }
      }
    }
  }

  sortAndDedupe(productChains);

  const { absolute, relative } = resolveOutputPath(outputFile);
  const result = await writeJsonIfChanged(absolute, productChains);

  if (result === 'noop') {
    console.log(`[${product}] ${relative} is up to date.`);
  } else {
    console.log(`[${product}] wrote -> ${relative}`);
  }
}
