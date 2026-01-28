import databaseOverrides from './notion-database-ids.json' assert { type: 'json' };

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

export type NotionPropertyConfig = {
  /**
   * Property name inside the Notion database.
   */
  property: string;
  /**
   * Tag marker used inside the snippet file.
   */
  tag: string;
  /**
   * Optional override for tab labels keyed by database label.
   */
  labelOverrides?: Record<string, string>;
  /**
   * Optional additional properties that should be merged into the same table cell.
   */
  extraProperties?: NotionExtraPropertyConfig[];
};

export type NotionExtraPropertyConfig = {
  /**
   * Property name inside the Notion database.
   */
  property: string;
  /**
   * Optional label prefix to render before the value.
   */
  label?: string;
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

export const NOTION_CONTRACT_PROPERTIES: NotionPropertyConfig[] = [
  {
    property: 'NTTWithExecutor',
    tag: 'NTT_EXECUTOR_ADDRESS',
    extraProperties: [{ property: 'MultiTokenNttWithExecutor', label: 'Multi Ntt' }],
  },
  { property: 'Executor', tag: 'EXECUTOR_ADDRESS' },
  { property: 'TokenBridgeRelayer', tag: 'WTT_EXECUTOR_ADDRESS' },
  {
    property: 'TokenBridgeRelayerWithReferrer',
    tag: 'WTT_EXECUTOR_WITH_REFERRER_ADDRESS',
  },
  { property: 'MayanForwarderWithReferrer', tag: 'MAYAN_FORWARDER_WITH_REFERRER_ADDRESS' },
  {
    property: 'CCTPv1WithExecutor',
    tag: 'CCTP_EXECUTOR_ADDRESS',
    labelOverrides: { Mainnet: 'Mainnet v1', Testnet: 'Testnet v1' },
  },
  {
    property: 'CCTPv2WithExecutor',
    tag: 'CCTP_EXECUTOR_ADDRESS',
    labelOverrides: { Mainnet: 'Mainnet v2', Testnet: 'Testnet v2' },
  },
  { property: 'M0PortalWithExecutor', tag: 'M0_PORTAL_WITH_EXECUTOR_ADDRESS' },
];
