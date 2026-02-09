import {
  NOTION_CONTRACT_DATABASES,
  NOTION_CONTRACT_PROPERTIES,
} from '../config/notion-contracts';
import type { DocChain } from '../types/chains';
import { renderSimpleContractTable, ContractTableRow } from '../util';
import {
  buildChainTitleMap,
  resolveDisplayChainName,
} from '../utils/chainNames';

export type CctpVersion = 'v1' | 'v2';
export type CctpEnvironment = 'Mainnet' | 'Testnet';
export type CctpVersionSupport = Record<
  CctpVersion,
  Record<CctpEnvironment, string[]>
>;

type CctpCollector = Record<CctpVersion, Record<CctpEnvironment, Set<string>>>;
type NotionContractTableResult = {
  tables: Map<string, string>;
  cctpSupport?: CctpVersionSupport;
};

const CCTP_ENVIRONMENTS: CctpEnvironment[] = ['Mainnet', 'Testnet'];
const CONTRACT_ADDRESS_OVERRIDES: Record<
  string,
  Partial<Record<CctpEnvironment, Record<string, string>>>
> = {
  NTTWithExecutor: {
    Mainnet: {
      Sui: '0xa55f6f81649b071b5967dc56227bbee289e4c411ab610caeec7abce499e262b8',
    },
  },
  CCTPv1WithExecutor: {
    Mainnet: {
      Sui: '0xa55f6f81649b071b5967dc56227bbee289e4c411ab610caeec7abce499e262b8',
    },
  },
  CCTPv2WithExecutor: {
    Mainnet: {
      Sui: '0xa55f6f81649b071b5967dc56227bbee289e4c411ab610caeec7abce499e262b8',
    },
  },
};
import { NotionClient } from './client';
import { extractContractRows } from './parser';
import { NotionPage } from './types';

type PropertyEnvironmentMap = Map<string, Map<string, ContractTableRow[]>>;
const IGNORED_UNMAPPED_PROPERTIES = new Set([
  'Chain',
  'MultiReceiveWithGasDropOff',
  'VAAv1ReceiveWithGasDropOff',
  'CCTPv1ReceiveWithGasDropOff',
  'CCTPv2ReceiveWithGasDropOff',
]);
const MAPPED_PROPERTIES = new Set<string>(
  NOTION_CONTRACT_PROPERTIES.flatMap((entry) => [
    entry.property,
    ...(entry.extraProperties?.map((extra) => extra.property) ?? []),
  ]),
);

export async function generateNotionContractTables(
  chains: DocChain[],
): Promise<NotionContractTableResult> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.warn(
      '[notion] NOTION_API_KEY is not set; skipping Notion-backed contract tables.',
    );
    return { tables: new Map() };
  }

  const client = new NotionClient(apiKey, process.env.NOTION_VERSION);
  const propertyData: PropertyEnvironmentMap = new Map();
  const chainTitleMap = buildChainTitleMap(chains);
  const discoveredProperties = new Map<string, Set<string>>();
  const failedSources: Set<string> = new Set();

  for (const database of NOTION_CONTRACT_DATABASES) {
    let databaseId = database.databaseId?.trim();
    if (!databaseId && database.envVar) {
      const envValue = process.env[database.envVar];
      if (envValue && envValue.trim().length > 0) {
        databaseId = envValue.trim();
      }
    }

    if (!databaseId) {
      const identifier = database.envVar
        ? `${database.envVar} or notion-database-ids.json`
        : 'notion-database-ids.json';
      console.warn(
        `[notion] Missing database ID for ${database.label}; set ${identifier} to enable this table.`,
      );
      failedSources.add(database.label);
      continue;
    }

    let pages: NotionPage[];
    try {
      pages = await client.queryDatabase<NotionPage>(databaseId);
    } catch (err) {
      console.error(
        `[notion] Failed to query database ${database.label} (${databaseId}): ${(err as Error).message}`,
      );
      failedSources.add(database.label);
      continue;
    }

    if (!discoveredProperties.has(database.label)) {
      discoveredProperties.set(database.label, new Set());
    }
    const bucket = discoveredProperties.get(database.label)!;
    for (const page of pages) {
      if (!page?.properties) continue;
      for (const name of Object.keys(page.properties)) {
        bucket.add(name);
      }
    }

    for (const property of NOTION_CONTRACT_PROPERTIES) {
      const rows = normalizeRows(
        extractContractRows(pages, property.property, {
          chainProperty: database.chainProperty,
          extraProperties: property.extraProperties,
        }),
        chainTitleMap,
      );
      if (rows.length === 0) continue;

      let envMap = propertyData.get(property.property);
      if (!envMap) {
        envMap = new Map();
        propertyData.set(property.property, envMap);
      }

      envMap.set(
        database.label,
        applyContractAddressOverrides(
          rows,
          property.property,
          database.label,
          chainTitleMap,
        ),
      );
    }
  }

  if (failedSources.size > 0) {
    console.warn(
      `[notion] Skipping updates due to fetch issues: ${Array.from(failedSources).join(', ')}.`,
    );
    return { tables: new Map() };
  }

  if (propertyData.size === 0) {
    logUnmappedProperties(discoveredProperties);
    return { tables: new Map() };
  }

  const rendered = new Map<string, string>();
  const cctpCollector = createCctpCollector();

  for (const property of NOTION_CONTRACT_PROPERTIES) {
    const environments = propertyData.get(property.property);
    if (!environments) continue;

    const blocks: string[] = [];

    for (const [label, rows] of environments) {
      const sorted = sortRows(rows);
      if (sorted.length === 0) continue;

      const displayLabel = property.labelOverrides?.[label] ?? label;
      const htmlTable = renderSimpleContractTable(sorted);

      blocks.push(`=== "${displayLabel}"\n\n    ${htmlTable}`);
      if (property.cctpVersion && isCctpEnvironment(label)) {
        collectCctpRows(
          cctpCollector,
          property.cctpVersion,
          label as CctpEnvironment,
          sorted,
        );
      }
    }

    if (blocks.length === 0) continue;

    const block = blocks.join('\n\n');
    const existing = rendered.get(property.tag);
    rendered.set(property.tag, existing ? `${existing}\n\n${block}` : block);
  }

  logUnmappedProperties(discoveredProperties);

  const cctpSupport = finalizeCctpSupport(cctpCollector);
  return { tables: rendered, cctpSupport };
}

function createCctpCollector(): CctpCollector {
  return {
    v1: {
      Mainnet: new Set<string>(),
      Testnet: new Set<string>(),
    },
    v2: {
      Mainnet: new Set<string>(),
      Testnet: new Set<string>(),
    },
  };
}

function isCctpEnvironment(label: string): label is CctpEnvironment {
  return (CCTP_ENVIRONMENTS as string[]).includes(label);
}

function collectCctpRows(
  collector: CctpCollector,
  version: CctpVersion,
  environment: CctpEnvironment,
  rows: ContractTableRow[],
) {
  const bucket = collector[version][environment];
  for (const row of rows) {
    const canonical = row.canonicalName ?? row.chain;
    if (!canonical) continue;
    bucket.add(canonical.trim());
  }
}

function finalizeCctpSupport(
  collector: CctpCollector,
): CctpVersionSupport | undefined {
  const result: CctpVersionSupport = {
    v1: {
      Mainnet: Array.from(collector.v1.Mainnet).sort(localeAlphaCompare),
      Testnet: Array.from(collector.v1.Testnet).sort(localeAlphaCompare),
    },
    v2: {
      Mainnet: Array.from(collector.v2.Mainnet).sort(localeAlphaCompare),
      Testnet: Array.from(collector.v2.Testnet).sort(localeAlphaCompare),
    },
  };

  const hasData =
    result.v1.Mainnet.length > 0 ||
    result.v1.Testnet.length > 0 ||
    result.v2.Mainnet.length > 0 ||
    result.v2.Testnet.length > 0;

  return hasData ? result : undefined;
}

function localeAlphaCompare(a: string, b: string): number {
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}

const PRIORITY_PREFIXES: Array<{ prefix: string; rank: number }> = [
  { prefix: 'ethereum', rank: 0 },
  { prefix: 'solana', rank: 1 },
];

function sortRows(rows: ContractTableRow[]): ContractTableRow[] {
  return [...rows].sort((a, b) => {
    const aName = (a.canonicalName ?? a.chain).trim();
    const bName = (b.canonicalName ?? b.chain).trim();
    const aKey = aName.toLowerCase();
    const bKey = bName.toLowerCase();

    const aPriority = getPriorityRank(aKey);
    const bPriority = getPriorityRank(bKey);
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return aName.localeCompare(bName);
  });
}

function logUnmappedProperties(discovered: Map<string, Set<string>>): void {
  if (discovered.size === 0) return;

  for (const [label, names] of discovered) {
    const unmapped = Array.from(names).filter(
      (name) =>
        !MAPPED_PROPERTIES.has(name) && !IGNORED_UNMAPPED_PROPERTIES.has(name),
    );
    if (unmapped.length === 0) continue;

    console.log(
      `[notion] ${label}: ignoring unmapped properties -> ${unmapped.join(', ')}`,
    );
  }
}

function normalizeRows(
  rows: ContractTableRow[],
  chainTitleMap: Map<string, string>,
): ContractTableRow[] {
  const normalized = new Map<string, ContractTableRow>();

  for (const row of rows) {
    const resolvedName = resolveDisplayChainName(row.chain, chainTitleMap);
    const key = normalizeChainKey(resolvedName || row.chain);
    if (normalized.has(key)) continue;
    normalized.set(key, { ...row, canonicalName: resolvedName });
  }

  return Array.from(normalized.values());
}

function applyContractAddressOverrides(
  rows: ContractTableRow[],
  propertyName: string,
  environmentLabel: string,
  chainTitleMap: Map<string, string>,
): ContractTableRow[] {
  const env = environmentLabel as CctpEnvironment;
  const envOverrides = CONTRACT_ADDRESS_OVERRIDES[propertyName]?.[env];
  if (!envOverrides) return rows;

  const updated = [...rows];
  const indexByKey = new Map<string, number>();
  for (let i = 0; i < updated.length; i++) {
    const row = updated[i];
    const key = normalizeChainKey(row.canonicalName ?? row.chain);
    indexByKey.set(key, i);
  }

  for (const [chainName, address] of Object.entries(envOverrides)) {
    const resolvedName = resolveDisplayChainName(chainName, chainTitleMap);
    const displayName = resolvedName ?? chainName;
    const key = normalizeChainKey(displayName);
    const existingIndex = indexByKey.get(key);

    if (existingIndex !== undefined) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        address,
      };
    } else {
      updated.push({
        chain: displayName,
        address,
        canonicalName: resolvedName,
      });
    }
  }

  return updated;
}

function normalizeChainKey(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function getPriorityRank(lowerName: string): number {
  for (const { prefix, rank } of PRIORITY_PREFIXES) {
    if (lowerName.startsWith(prefix)) return rank;
  }
  return PRIORITY_PREFIXES.length;
}
