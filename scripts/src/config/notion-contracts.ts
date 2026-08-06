import databaseOverrides from './notion-database-ids.json' with { type: 'json' };

type DatabaseOverrideEntry = {
  databaseId?: string;
  chainProperty?: string;
};

type DatabaseOverrideMap = Record<string, DatabaseOverrideEntry | undefined>;

const overrides = databaseOverrides as DatabaseOverrideMap;

export type NotionDatabaseConfig = {
  /**
   * Label used for the tab header in the rendered table.
   */
  label: string;
  /**
   * Environment variable that contains the Notion database ID.
   */
  envVar?: string;
  /**
   * Notion database ID loaded from config (preferred when provided).
   */
  databaseId?: string;
  /**
   * Optional override for the property that stores the chain name.
   */
  chainProperty?: string;
};

const BASE_DATABASES: NotionDatabaseConfig[] = [
  { envVar: 'NOTION_CONTRACTS_MAINNET_DB_ID', label: 'Mainnet' },
  { envVar: 'NOTION_CONTRACTS_TESTNET_DB_ID', label: 'Testnet' },
];

const mergedDatabases: NotionDatabaseConfig[] = BASE_DATABASES.map((entry) => {
  const override = overrides[entry.label];
  return {
    ...entry,
    databaseId: override?.databaseId ?? entry.databaseId,
    chainProperty: override?.chainProperty ?? entry.chainProperty,
  };
});

for (const [label, override] of Object.entries(overrides)) {
  if (!override) continue;
  if (mergedDatabases.some((entry) => entry.label === label)) continue;
  mergedDatabases.push({
    label,
    databaseId: override.databaseId,
    chainProperty: override.chainProperty,
  });
}

export const NOTION_CONTRACT_DATABASES = mergedDatabases;
