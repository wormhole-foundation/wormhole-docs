import './env';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { NOTION_CONTRACT_DATABASES } from './config/notion-contracts';
import { NotionClient } from './notion/client';
import { extractContractRows } from './notion/parser';
import type { NotionPage } from './notion/types';
import {
  mergeSupportMaps,
  normalizeCctpChainName,
  normalizeCctpSupportKey,
  sortUnique,
} from './utils/support';
import type { Network, SupportMap } from './types/support';

type CctpVersion = 'v1' | 'v2';

type CctpSupportResult = {
  v1: SupportMap;
  v2: SupportMap;
};

type CctpSupportStatus = 'updated' | 'noop';

const OUTPUT_V1 = path.resolve(process.cwd(), './src/generated/cctp-v1-support.json');
const OUTPUT_V2 = path.resolve(process.cwd(), './src/generated/cctp-v2-support.json');
const OUTPUT_UNION = path.resolve(process.cwd(), './src/generated/cctp-support.json');

const VERSION_PROPERTIES: Record<CctpVersion, string> = {
  v1: 'CCTPv1WithExecutor',
  v2: 'CCTPv2WithExecutor',
};

const MAINNET_OVERRIDES: Record<CctpVersion, string[]> = {
  v1: ['Sui'],
  v2: ['Sui'],
};

function createSupportMap(): SupportMap {
  return {
    Mainnet: [],
    Testnet: [],
    Devnet: [],
  };
}

function resolveNetworkLabel(label: string): Network | undefined {
  const normalized = label.trim().toLowerCase();
  if (normalized === 'mainnet') return 'Mainnet';
  if (normalized === 'testnet') return 'Testnet';
  if (normalized === 'devnet') return 'Devnet';
  return undefined;
}

function addSupportEntry(map: SupportMap, network: Network, name: string): void {
  if (!map[network].includes(name)) {
    map[network].push(name);
  }
}

async function fetchCctpSupportFromNotion(): Promise<CctpSupportResult | null> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    console.warn('[cctp] NOTION_API_KEY is not set; keeping existing CCTP support data.');
    return null;
  }

  const client = new NotionClient(apiKey, process.env.NOTION_VERSION);
  const v1 = createSupportMap();
  const v2 = createSupportMap();
  const failedSources: string[] = [];

  for (const database of NOTION_CONTRACT_DATABASES) {
    const network = resolveNetworkLabel(database.label);
    if (!network) continue;
    if (network === 'Devnet') {
      console.warn(`[cctp] Ignoring ${database.label} database; devnet is unsupported.`);
      continue;
    }

    let databaseId = database.databaseId?.trim();
    if (!databaseId && database.envVar) {
      const envValue = process.env[database.envVar];
      if (envValue && envValue.trim().length > 0) {
        databaseId = envValue.trim();
      }
    }

    if (!databaseId) {
      failedSources.push(database.label);
      continue;
    }

    let pages: NotionPage[];
    try {
      pages = await client.queryDatabase<NotionPage>(databaseId);
    } catch (err) {
      console.warn(
        `[cctp] Failed to query Notion database ${database.label} (${databaseId}): ${(err as Error).message}`,
      );
      failedSources.push(database.label);
      continue;
    }

    for (const [version, propertyName] of Object.entries(VERSION_PROPERTIES) as [CctpVersion, string][]) {
      const rows = extractContractRows(pages, propertyName, {
        chainProperty: database.chainProperty,
      });

      for (const row of rows) {
        const normalized = normalizeCctpChainName(row.chain);
        if (!normalized) continue;

        if (version === 'v1') {
          addSupportEntry(v1, network, normalized);
        } else {
          addSupportEntry(v2, network, normalized);
        }
      }
    }
  }

  if (failedSources.length > 0) {
    console.warn(
      `[cctp] Notion data unavailable (missing/failed databases: ${failedSources.join(', ')}). Keeping existing CCTP support data.`,
    );
    return null;
  }

  for (const version of Object.keys(MAINNET_OVERRIDES) as CctpVersion[]) {
    for (const chain of MAINNET_OVERRIDES[version]) {
      addSupportEntry(version === 'v1' ? v1 : v2, 'Mainnet', chain);
    }
  }

  const suiKey = normalizeCctpSupportKey('Sui');
  v1.Testnet = v1.Testnet.filter((name) => normalizeCctpSupportKey(name) !== suiKey);
  v2.Testnet = v2.Testnet.filter((name) => normalizeCctpSupportKey(name) !== suiKey);

  const totalEntries =
    v1.Mainnet.length + v1.Testnet.length + v2.Mainnet.length + v2.Testnet.length;
  if (totalEntries === 0) {
    console.warn('[cctp] No CCTP v1/v2 entries found in Notion; keeping existing support data.');
    return null;
  }

  v1.Mainnet = sortUnique(v1.Mainnet);
  v1.Testnet = sortUnique(v1.Testnet);
  v1.Devnet = [];

  v2.Mainnet = sortUnique(v2.Mainnet);
  v2.Testnet = sortUnique(v2.Testnet);
  v2.Devnet = [];

  return { v1, v2 };
}

async function writeJsonIfChanged(
  targetPath: string,
  data: SupportMap,
): Promise<CctpSupportStatus> {
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

export async function generateCctpSupport(): Promise<void> {
  const result = await fetchCctpSupportFromNotion();
  if (!result) return;

  const union = mergeSupportMaps(result.v1, result.v2);

  const [v1Status, v2Status, unionStatus] = await Promise.all([
    writeJsonIfChanged(OUTPUT_V1, result.v1),
    writeJsonIfChanged(OUTPUT_V2, result.v2),
    writeJsonIfChanged(OUTPUT_UNION, union),
  ]);

  const report = (label: string, status: CctpSupportStatus, target: string) => {
    const relative = path.relative(process.cwd(), target) || target;
    if (status === 'noop') {
      console.log(`[CCTP] ${label}: ${relative} is up to date.`);
    } else {
      console.log(`[CCTP] ${label}: wrote -> ${relative}`);
    }
  };

  report('v1', v1Status, OUTPUT_V1);
  report('v2', v2Status, OUTPUT_V2);
  report('union', unionStatus, OUTPUT_UNION);
}
