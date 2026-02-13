import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { fetchText } from './utils/http';

type QueriesSupportConfig = {
  sources: {
    perChainConfig: string;
    chainIds: string;
  };
  overrides: Record<string, Record<string, string>>;
};

type ChainEntry = {
  timestampSupported: boolean;
  chainId: number;
};

export type QueriesSupportMap = Record<'Mainnet' | 'Testnet', Record<string, ChainEntry>>;

const CONFIG_PATH = path.resolve(__dirname, 'config/queries-support-config.json');
const OUTPUT_PATH = path.resolve(process.cwd(), './src/generated/queries-support.json');

/** Map Go constant suffixes to SDK-style chain names where they differ. */
const GO_TO_SDK_NAME: Record<string, string> = {
  BSC: 'Bsc',
  Klaytn: 'Kaia',
  XLayer: 'Xlayer',
  SeiEVM: 'Seievm',
  XRPLEVM: 'XrplEvm',
  HyperEVM: 'HyperEvm',
  MegaETH: 'MegaEth',
  FileCoin: 'Filecoin',
  BOB: 'Bob',
};

/**
 * Parse perChainConfig entries from query.go.
 * Returns map of Go constant suffix → TimestampCacheSupported boolean.
 *
 * Example line:
 *   vaa.ChainIDEthereum: {NumWorkers: 5, TimestampCacheSupported: true},
 */
function parsePerChainConfig(raw: string): Map<string, boolean> {
  const result = new Map<string, boolean>();
  const re = /vaa\.ChainID(\w+)\s*:\s*\{[^}]*TimestampCacheSupported\s*:\s*(true|false)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1];
    const supported = m[2] === 'true';
    result.set(name, supported);
  }
  return result;
}

/**
 * Parse ChainID constants from structs.go.
 * Returns map of Go constant suffix → numeric chain ID.
 *
 * Example line:
 *   ChainIDEthereum ChainID = 2
 */
function parseChainIdConstants(raw: string): Map<string, number> {
  const result = new Map<string, number>();
  const re = /ChainID(\w+)\s+ChainID\s*=\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1];
    const id = parseInt(m[2], 10);
    if (name === 'Unset') continue;
    result.set(name, id);
  }
  return result;
}

function goNameToSdkName(goSuffix: string): string {
  return GO_TO_SDK_NAME[goSuffix] ?? goSuffix;
}

async function loadConfig(): Promise<QueriesSupportConfig> {
  const raw = await readFile(CONFIG_PATH, 'utf8');
  const cfg = JSON.parse(raw) as QueriesSupportConfig;
  if (!cfg?.sources?.perChainConfig || !cfg?.sources?.chainIds) {
    throw new Error('queries: invalid queries-support-config.json');
  }
  return cfg;
}

async function writeJsonIfChanged(
  targetPath: string,
  data: QueriesSupportMap,
): Promise<'updated' | 'noop'> {
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

export async function generateQueriesSupport(): Promise<void> {
  const cfg = await loadConfig();

  const [queryGoRaw, structsGoRaw] = await Promise.all([
    fetchText(cfg.sources.perChainConfig),
    fetchText(cfg.sources.chainIds),
  ]);

  const perChain = parsePerChainConfig(queryGoRaw);
  const chainIds = parseChainIdConstants(structsGoRaw);

  if (perChain.size === 0) {
    throw new Error('queries: no perChainConfig entries found in query.go');
  }

  const mainnet: Record<string, ChainEntry> = {};
  const testnet: Record<string, ChainEntry> = {};

  for (const [goSuffix, timestampSupported] of perChain) {
    const numericId = chainIds.get(goSuffix);
    if (numericId === undefined) {
      console.warn(`[queries] No ChainID constant found for ${goSuffix}; skipping.`);
      continue;
    }

    const sdkName = goNameToSdkName(goSuffix);
    const entry: ChainEntry = { timestampSupported, chainId: numericId };

    if (numericId >= 10000) {
      testnet[sdkName] = entry;
    } else {
      mainnet[sdkName] = entry;
    }
  }

  const support: QueriesSupportMap = { Mainnet: mainnet, Testnet: testnet };
  const status = await writeJsonIfChanged(OUTPUT_PATH, support);
  const relativePath = path.relative(process.cwd(), OUTPUT_PATH) || OUTPUT_PATH;

  if (status === 'noop') {
    console.log(`[QUERIES] ${relativePath} is up to date.`);
  } else {
    console.log(`[QUERIES] ${relativePath} updated.`);
  }
}
