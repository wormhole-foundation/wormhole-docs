import path from 'node:path';
import { readFile } from 'node:fs/promises';

import type { DocChain } from './types/chains';
import type { QueriesSupportMap } from './generateQueriesSupport';

type ChainOverride = {
  ethCallByTimestamp?: string;
  ethCallWithFinality?: string;
  expectedHistory?: string;
};

type QueriesSupportConfig = {
  sources: Record<string, string>;
  overrides: Record<string, ChainOverride>;
};

const CONFIG_PATH = path.resolve(__dirname, 'config/queries-support-config.json');
const SUPPORT_PATH = path.resolve(process.cwd(), './src/generated/queries-support.json');

async function loadConfig(): Promise<QueriesSupportConfig> {
  const raw = await readFile(CONFIG_PATH, 'utf8');
  return JSON.parse(raw) as QueriesSupportConfig;
}

async function loadSupport(): Promise<QueriesSupportMap> {
  const raw = await readFile(SUPPORT_PATH, 'utf8');
  return JSON.parse(raw) as QueriesSupportMap;
}

function buildDisplayNameMap(chains: DocChain[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const chain of chains) {
    const key = chain.mainnet.name.toLowerCase();
    const title = chain.mainnet.extraDetails?.title ?? chain.mainnet.name;
    map.set(key, title);

    for (const testnet of chain.testnets ?? []) {
      const tKey = testnet.name.toLowerCase();
      const tTitle = testnet.extraDetails?.title ?? testnet.name;
      map.set(tKey, tTitle);
    }
  }
  return map;
}

function getDisplayName(sdkName: string, displayMap: Map<string, string>): string {
  return displayMap.get(sdkName.toLowerCase()) ?? sdkName;
}

function buildNetworkTable(
  entries: Record<string, { timestampSupported: boolean; chainId: number }>,
  overrides: Record<string, ChainOverride>,
  displayMap: Map<string, string>,
): string {
  const header = [
    '|     Chain     | Wormhole Chain ID | eth_call | eth_call_by_timestamp | eth_call_with_finality | Expected History |',
    '|:-------------:|:-----------------:|:--------:|:---------------------:|:----------------------:|:----------------:|',
  ];

  const sorted = Object.entries(entries).sort(
    ([, a], [, b]) => a.chainId - b.chainId,
  );

  const rows: string[] = [];
  for (const [sdkName, data] of sorted) {
    const override = overrides[sdkName] ?? {};
    const displayName = getDisplayName(sdkName, displayMap);

    const ethCall = '✅';
    const ethCallByTimestamp =
      override.ethCallByTimestamp ??
      (data.timestampSupported ? '✅' : '❌');
    const ethCallWithFinality = override.ethCallWithFinality ?? '-';
    const expectedHistory = override.expectedHistory ?? '-';

    rows.push(
      `| ${displayName} | ${data.chainId} | ${ethCall} | ${ethCallByTimestamp} | ${ethCallWithFinality} | ${expectedHistory} |`,
    );
  }

  return [...header, ...rows].join('\n');
}

export async function generateQueriesTable(chains: DocChain[]): Promise<string> {
  const [config, support] = await Promise.all([loadConfig(), loadSupport()]);
  const displayMap = buildDisplayNameMap(chains);

  const mainnetTable = buildNetworkTable(
    support.Mainnet,
    config.overrides,
    displayMap,
  );

  const parts = [`## Mainnet\n\n${mainnetTable}`];

  if (Object.keys(support.Testnet).length > 0) {
    const testnetTable = buildNetworkTable(
      support.Testnet,
      config.overrides,
      displayMap,
    );
    parts.push(`## Testnet\n\n${testnetTable}`);
  }

  return parts.join('\n\n');
}
