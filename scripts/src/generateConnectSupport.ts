import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { fetchText } from './utils/http';
import { stripCommentsPreserveStrings, extractArrayAfterConst } from './utils/parsing';
import { normalizeChainName } from './utils/chainNames';

type Network = 'Mainnet' | 'Testnet' | 'Devnet';
type SupportMap = Record<Network, string[]>;

type ConnectSupportConfig = {
  sources: {
    connect_mainnet: { chains_url: string };
    connect_testnet: { chains_url: string };
    connect_devnet: { chains_url: string };
  };
};

const CONFIG_PATH = path.resolve(__dirname, 'config/connect-support-config.json');
const OUTPUT_PATH = path.resolve(process.cwd(), './src/generated/connect-support.json');

function ensureStrings(label: string, values: string[]): string[] {
  if (!values.length) {
    throw new Error(`connect: no ${label} chains found`);
  }
  return values;
}

function parseSdkNamesFromChainsConfig(raw: string): string[] {
  const cleaned = stripCommentsPreserveStrings(raw);
  const out = new Set<string>();
  const re = /sdkName\s*:\s*(['"])([^'"]+)\1/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(cleaned)) !== null) {
    const name = match[2].trim();
    out.add(normalizeChainName(name));
  }
  return Array.from(out);
}

function parseChainOrder(raw: string): string[] {
  const cleaned = stripCommentsPreserveStrings(raw);
  const arrayText = extractArrayAfterConst(cleaned, 'CHAIN_ORDER');
  if (!arrayText) {
    throw new Error('connect: CHAIN_ORDER not found in constants.ts');
  }

  const out = new Set<string>();
  const re = /(['"])([^'"]+)\1/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(arrayText)) !== null) {
    const name = match[2].trim();
    out.add(normalizeChainName(name));
  }
  return Array.from(out);
}

function sortUnique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

async function loadConnectConfig(): Promise<ConnectSupportConfig> {
  const raw = await readFile(CONFIG_PATH, 'utf8');
  const cfg = JSON.parse(raw) as ConnectSupportConfig;

  if (
    !cfg?.sources?.connect_mainnet?.chains_url ||
    !cfg?.sources?.connect_testnet?.chains_url ||
    !cfg?.sources?.connect_devnet?.chains_url
  ) {
    throw new Error('connect: invalid connect-support-config.json (missing chains_url)');
  }

  return cfg;
}

async function writeJsonIfChanged(
  targetPath: string,
  data: SupportMap
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

export async function generateConnectSupport(): Promise<void> {
  const cfg = await loadConnectConfig();
  const [mainnetRaw, testnetRaw, devnetRaw] = await Promise.all([
    fetchText(cfg.sources.connect_mainnet.chains_url),
    fetchText(cfg.sources.connect_testnet.chains_url),
    fetchText(cfg.sources.connect_devnet.chains_url),
  ]);

  // mainnet/devnet use sdkName fields from chains.ts; testnet uses CHAIN_ORDER from constants.ts
  const mainnet = ensureStrings('mainnet', parseSdkNamesFromChainsConfig(mainnetRaw));
  const testnet = ensureStrings('testnet', parseChainOrder(testnetRaw));
  const devnet = ensureStrings('devnet', parseSdkNamesFromChainsConfig(devnetRaw));

  const support: SupportMap = {
    Mainnet: sortUnique(mainnet),
    Testnet: sortUnique(testnet),
    Devnet: sortUnique(devnet),
  };

  const status = await writeJsonIfChanged(OUTPUT_PATH, support);
  const relativePath = path.relative(process.cwd(), OUTPUT_PATH) || OUTPUT_PATH;
  if (status === 'noop') {
    console.log(`[CONNECT] ${relativePath} is up to date.`);
  } else {
    console.log(`[CONNECT] ${relativePath} updated.`);
  }
}
