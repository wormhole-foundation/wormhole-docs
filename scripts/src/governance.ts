import path from 'node:path';
import { readFile } from 'fs/promises';
import { DOCS_SNIPPETS_DIR } from './env';
import type { DocChain } from './types/chains';
import { fetchText } from './utils/http';
import { buildHTMLTable, formatHTMLTable, makePrioritizedAlphaCompare, escapeHtmlText, fmtCodeStr } from './util';
import { buildChainTitleMap, resolveDisplayChainName } from './utils/chainNames';

type GeneralPurposeGovernance = { address: string; chainId: number };
type ContractsJson = {
  GeneralPurposeGovernances: GeneralPurposeGovernance[];
};

type ChainsJson = {
  chains: Array<{
    description: string;
    chainId: number;
  }>;
};

type SolanaProgramsJson = {
  governanceProgramId?: string;
};

type ContractsConfig = {
  sources: {
    ntt_mainnet: {
      contracts_url: string;
      chains_url: string;
    };
    ntt_testnet: {
      contracts_url: string;
      chains_url: string;
    };
    solana_mainnet: {
      programs_url: string;
    };
    solana_testnet: {
      programs_url: string;
    };
  };
};

type GovernanceRow = {
  name: string;
  address: string;
  nameIsRaw?: boolean;
};

type ParsedRow = {
  rawName: string;
  address: string;
  normalizedName: string;
};

const GOVERNANCE_SNIPPET_RELATIVE = path.join(
  'products',
  'reference',
  'contract-addresses',
  'governance.md'
);

const MAINNET_OVERRIDES: Record<string, string> = {
  'XRPL EVM': 'XRPL-EVM',
};

const TESTNET_OVERRIDES: Record<string, string> = {
  'Sepolia': 'Ethereum Sepolia',
  'XRPL EVM Testnet': 'XRPL-EVM',
};

// --- Load local config (scripts/src/config/contracts-config.json) ---
async function loadContractsConfig(): Promise<ContractsConfig> {
  const url = new URL('./config/contracts-config.json', import.meta.url);
  const raw = await readFile(url, 'utf8');
  const cfg = JSON.parse(raw) as ContractsConfig;
  if (
    !cfg?.sources?.ntt_mainnet?.contracts_url ||
    !cfg?.sources?.ntt_mainnet?.chains_url ||
    !cfg?.sources?.ntt_testnet?.contracts_url ||
    !cfg?.sources?.ntt_testnet?.chains_url ||
    !cfg?.sources?.solana_mainnet?.programs_url ||
    !cfg?.sources?.solana_testnet?.programs_url
  ) {
    throw new Error('governance: invalid contracts-config.json (missing governance source URLs)');
  }
  return cfg;
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeChainName(raw: string): string {
  const withoutTags = stripHtml(raw);
  const withoutMaterial = withoutTags.replace(/:material-[^{]+\{[^}]*\}/g, '');
  return withoutMaterial.replace(/\s+/g, ' ').trim().toLowerCase();
}

function extractTaggedBlock(contents: string, tag: string): string | null {
  const safeTag = escapeRegExp(tag);
  const pattern = new RegExp(`<!--\\s*${safeTag}\\s*-->([\\s\\S]*?)<!--\\s*${safeTag}\\s*-->`);
  const match = contents.match(pattern);
  return match ? match[1] : null;
}

function extractFirstTable(contents: string): string | null {
  const match = contents.match(/<table[\s\S]*?<\/table>/);
  return match ? match[0] : null;
}

function extractTableFromSection(contents: string, sectionTitle: string): string | null {
  const safeSection = escapeRegExp(sectionTitle);
  const sectionPattern = new RegExp(
    `===\\s*"${safeSection}"[\\s\\S]*?(<table[\\s\\S]*?<\\/table>)`
  );
  const match = contents.match(sectionPattern);
  return match ? match[1] : null;
}

function parseExistingRows(contents: string, tag: string, sectionTitle: string): ParsedRow[] {
  const tagged = extractTaggedBlock(contents, tag);
  const tableHtml = extractFirstTable(tagged ?? '') ?? extractTableFromSection(contents, sectionTitle);
  if (!tableHtml) return [];

  const rows: ParsedRow[] = [];
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(tableHtml)) !== null) {
    const rowHtml = match[1];
    const cells = [...rowHtml.matchAll(/<td>([\s\S]*?)<\/td>/g)];
    if (cells.length < 2) continue;

    const rawName = cells[0][1].trim();
    const rawAddress = cells[1][1].trim();
    const nameText = stripHtml(rawName).trim();
    const addressText = stripHtml(rawAddress).trim();
    if (!nameText || !addressText) continue;

    rows.push({
      rawName,
      address: addressText,
      normalizedName: normalizeChainName(rawName),
    });
  }
  return rows;
}

function dedupeByName(rows: GovernanceRow[]): GovernanceRow[] {
  const seen = new Set<string>();
  const out: GovernanceRow[] = [];
  for (const row of rows) {
    const key = normalizeChainName(row.name);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function mergeRows(existing: ParsedRow[], fresh: GovernanceRow[]): GovernanceRow[] {
  const merged: GovernanceRow[] = existing.map((row) => ({
    name: row.rawName,
    address: row.address,
    nameIsRaw: true,
  }));

  const indexByName = new Map<string, number>();
  existing.forEach((row, idx) => {
    if (!indexByName.has(row.normalizedName)) {
      indexByName.set(row.normalizedName, idx);
    }
  });

  for (const row of fresh) {
    const key = normalizeChainName(row.name);
    const idx = indexByName.get(key);
    if (idx !== undefined) {
      merged[idx].address = row.address;
      continue;
    }
    merged.push(row);
  }
  return merged;
}

function sortRows(rows: GovernanceRow[], priorities: string[]): GovernanceRow[] {
  const compareName = makePrioritizedAlphaCompare(priorities);
  return rows.sort((a, b) => {
    const aName = normalizeChainName(a.name);
    const bName = normalizeChainName(b.name);
    const n = compareName(aName, bName);
    if (n !== 0) return n;
    return a.address.toLowerCase().localeCompare(b.address.toLowerCase());
  });
}

function renderGovernanceTable(rows: GovernanceRow[]): string {
  const tableHeader = `
  <thead>
    <th>Chain Name</th>
    <th>Contract Address</th>
  </thead>`;

  const body = rows
    .map((r) => {
      const name = r.nameIsRaw ? r.name : escapeHtmlText(r.name);
      const addr = escapeHtmlText(r.address);
      return `\
<tr>
  <td>${name}</td>
  <td>${fmtCodeStr(addr)}</td>
</tr>`;
    })
    .join('\n');

  return formatHTMLTable(buildHTMLTable(tableHeader, body));
}

function applyDisplayNames(rows: GovernanceRow[], chainTitleMap: Map<string, string>): GovernanceRow[] {
  return rows.map((row) => ({
    ...row,
    name: resolveDisplayChainName(row.name, chainTitleMap),
  }));
}

async function fetchGovernanceEvmRows(
  contractsUrl: string,
  chainsUrl: string,
  overrides: Record<string, string>
): Promise<GovernanceRow[]> {
  const [contractsRaw, chainsRaw] = await Promise.all([
    fetchText(contractsUrl),
    fetchText(chainsUrl),
  ]);

  const contracts = JSON.parse(contractsRaw) as ContractsJson;
  const chains = JSON.parse(chainsRaw) as ChainsJson;

  const idToName = new Map<number, string>();
  for (const chain of chains.chains) {
    const name = overrides[chain.description] ?? chain.description;
    idToName.set(chain.chainId, name);
  }

  const rows: GovernanceRow[] = [];
  for (const g of contracts.GeneralPurposeGovernances ?? []) {
    const name = idToName.get(g.chainId);
    if (!name) continue;
    rows.push({ name, address: g.address });
  }

  return rows;
}

async function fetchSolanaGovernanceRow(
  programsUrl: string,
  label: string
): Promise<GovernanceRow | null> {
  const raw = await fetchText(programsUrl);
  const programs = JSON.parse(raw) as SolanaProgramsJson;
  if (!programs?.governanceProgramId) return null;
  return { name: label, address: programs.governanceProgramId };
}

async function loadGovernanceSnippet(): Promise<string | null> {
  const snippetPath = path.join(DOCS_SNIPPETS_DIR, GOVERNANCE_SNIPPET_RELATIVE);
  try {
    return await readFile(snippetPath, 'utf8');
  } catch (err: unknown) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr?.code === 'ENOENT') {
      return null;
    }
    console.warn(`Failed to read governance snippet from ${snippetPath}:`, err);
    throw err;
  }
}

export async function generateGovernanceMainnetTable(chains: DocChain[]): Promise<string> {
  const chainTitleMap = buildChainTitleMap(chains);
  const cfg = await loadContractsConfig();
  const evmRows = await fetchGovernanceEvmRows(
    cfg.sources.ntt_mainnet.contracts_url,
    cfg.sources.ntt_mainnet.chains_url,
    MAINNET_OVERRIDES
  );
  const solanaRow = await fetchSolanaGovernanceRow(
    cfg.sources.solana_mainnet.programs_url,
    'Solana'
  );

  const resolvedRows = applyDisplayNames(solanaRow ? [...evmRows, solanaRow] : evmRows, chainTitleMap);
  const freshRows = dedupeByName(resolvedRows);
  const existing = await loadGovernanceSnippet();
  const existingRows = existing
    ? parseExistingRows(existing, 'GOVERNANCE_MAINNET', 'Mainnet')
    : [];

  const mergedRows =
    existingRows.length > 0 ? mergeRows(existingRows, freshRows) : freshRows;
  const sortedRows = sortRows(mergedRows, ['Ethereum', 'Solana']);

  return renderGovernanceTable(sortedRows);
}

export async function generateGovernanceTestnetTable(chains: DocChain[]): Promise<string> {
  const chainTitleMap = buildChainTitleMap(chains);
  const cfg = await loadContractsConfig();
  const evmRows = await fetchGovernanceEvmRows(
    cfg.sources.ntt_testnet.contracts_url,
    cfg.sources.ntt_testnet.chains_url,
    TESTNET_OVERRIDES
  );
  const solanaRow = await fetchSolanaGovernanceRow(
    cfg.sources.solana_testnet.programs_url,
    'Solana'
  );

  const resolvedRows = applyDisplayNames(solanaRow ? [...evmRows, solanaRow] : evmRows, chainTitleMap);
  const freshRows = dedupeByName(resolvedRows);
  const existing = await loadGovernanceSnippet();
  const existingRows = existing
    ? parseExistingRows(existing, 'GOVERNANCE_TESTNET', 'Testnet')
    : [];

  const mergedRows =
    existingRows.length > 0 ? mergeRows(existingRows, freshRows) : freshRows;
  const sortedRows = sortRows(mergedRows, ['Ethereum Sepolia', 'Solana']);

  return renderGovernanceTable(sortedRows);
}
