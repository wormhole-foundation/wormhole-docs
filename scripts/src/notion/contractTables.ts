import { NOTION_CONTRACT_DATABASES, NOTION_CONTRACT_PROPERTIES } from '../config/notion-contracts';
import type { DocChain } from '../types/chains';
import { renderSimpleContractTable, ContractTableRow } from '../util';
import { buildChainTitleMap, resolveDisplayChainName } from '../utils/chainNames';
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

export async function generateNotionContractTables(chains: DocChain[]): Promise<Map<string, string>> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.warn('[notion] NOTION_API_KEY is not set; skipping Notion-backed contract tables.');
    return new Map();
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

      envMap.set(database.label, rows);
    }
  }

  if (failedSources.size > 0) {
    console.warn(
      `[notion] Skipping updates due to fetch issues: ${Array.from(failedSources).join(', ')}.`,
    );
    return new Map();
  }

  if (propertyData.size === 0) {
    logUnmappedProperties(discoveredProperties);
    return new Map();
  }

  const rendered = new Map<string, string>();

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
    }

    if (blocks.length === 0) continue;

    const block = blocks.join('\n\n');
    const existing = rendered.get(property.tag);
    rendered.set(property.tag, existing ? `${existing}\n\n${block}` : block);
  }

  logUnmappedProperties(discoveredProperties);

  return rendered;
}

const PRIORITY_PREFIXES: Array<{ prefix: string; rank: number }> = [
  { prefix: 'ethereum', rank: 0 },
  { prefix: 'solana', rank: 1 },
];

function sortRows(rows: ContractTableRow[]): ContractTableRow[] {
  return [...rows].sort((a, b) => {
    const aName = a.chain.trim();
    const bName = b.chain.trim();
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
      (name) => !MAPPED_PROPERTIES.has(name) && !IGNORED_UNMAPPED_PROPERTIES.has(name),
    );
    if (unmapped.length === 0) continue;

    console.log(`[notion] ${label}: ignoring unmapped properties -> ${unmapped.join(', ')}`);
  }
}

function normalizeRows(rows: ContractTableRow[], chainTitleMap: Map<string, string>): ContractTableRow[] {
  const normalized = new Map<string, ContractTableRow>();

  for (const row of rows) {
    const resolvedName = resolveDisplayChainName(row.chain, chainTitleMap);
    const key = normalizeChainKey(resolvedName);
    if (normalized.has(key)) continue;
    normalized.set(key, { ...row, chain: resolvedName });
  }

  return Array.from(normalized.values());
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
