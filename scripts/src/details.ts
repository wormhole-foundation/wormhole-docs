import { Chain, finality, toChain } from '@wormhole-foundation/sdk';
import * as types from './types/chains';
import { networkString } from './config';
import {
  fmtNum,
  fmtCodeStr,
  buildHTMLTable,
  formatHTMLTable,
  sortMainnets,
  sortTestnets,
  sortChainTypes,
  CONTRACT_TABLE_HEADER,
  indentBlock,
} from './util';
import type { CctpVersionSupport } from './notion/contractTables';

type ProductTableOptions = {
  cctpVersionSupport?: CctpVersionSupport;
};

export function generateAllChainIdsTable(dc: types.DocChain[]): string {
  // Create Mainnet Chain Table
  const orderedDc = sortMainnets(dc);
  const tableHeader = `
    <thead>
      <th>Chain Name</th>
      <th style="width:26%">Wormhole Chain ID</th>
      <th>Network ID</th>
    </thead>`;
  let mainNetTableBody: string[] = [];
  let testNetTableBody: string[] = [];

  for (const c of orderedDc) {
    // Assemble the Mainnet table data
    const mainnetAlias = networkString(c.mainnet.extraDetails?.mainnet);
    const mainnetName = c.mainnet.extraDetails?.title
      ? c.mainnet.extraDetails.title
      : c.mainnet.name;

    mainNetTableBody.push(
      `<tr>
        <td>${mainnetName}</td>
        <td><code>${c.mainnet.id}</code></td>
        <td>${mainnetAlias}</td>
      </tr>`,
    );

    function processTestnets(testnets: types.ChainDetails[]) {
      testnets.forEach((testnet) => {
        const testnetAlias = networkString(testnet.extraDetails?.testnet);

        testNetTableBody.push(`
          <tr>
            <td>${testnet.extraDetails ? testnet.extraDetails.title : testnet.name}</td>
            <td><code>${testnet.id}</code></td>
            <td>${testnetAlias}</td>
          </tr>`);
      });
    }

    // Assemble the Testnet table data
    if (c.testnets.length > 1) {
      const orderedTestnets = sortTestnets(c.testnets);
      processTestnets(orderedTestnets);
    } else {
      processTestnets(c.testnets);
    }
  }

  return `
=== "Mainnet"

    ${formatHTMLTable(buildHTMLTable(tableHeader, mainNetTableBody.join('')))}

=== "Testnet"

    ${formatHTMLTable(buildHTMLTable(tableHeader, testNetTableBody.join('')))}
`;
}

export function generateAllConsistencyLevelsTable(
  dc: types.DocChain[],
): string {
  const orderedDc = sortMainnets(dc);

  const tableHeader = `
<thead>
  <th>Chain</th>
  <th>Instant</th>
  <th>Safe</th>
  <th>Finalized</th>
  <th>Otherwise</th>
  <th>Time to Finalize</th>
  <th>Details</th>
</thead>`;

  const tableBody: string[] = [];
  for (const c of orderedDc) {
    if (!c.mainnet.extraDetails) {
      console.log('No extra details for: ', c.mainnet.name);
      continue;
    }

    const f =
      c.mainnet.extraDetails?.finality === undefined
        ? {
            finalized: 0,
          }
        : c.mainnet.extraDetails.finality;

    const header = c.mainnet.extraDetails.title
      ? c.mainnet.extraDetails.title
      : c.mainnet.name;

    const instant = fmtNum(f.instant);
    const safe = fmtNum(
      f.safe !== undefined
        ? f.safe
        : f.confirmed !== undefined
          ? f.confirmed
          : undefined,
    );
    const finalized = fmtNum(f.finalized);
    const otherwise = f.otherwise ? f.otherwise : '';
    const details = f.details
      ? `<a href="${f.details}" target="_blank">Details</a>`
      : ' ';

    let sdkChain: Chain;
    try {
      sdkChain = toChain(c.mainnet.id);
    } catch {
      console.log(
        'No sdk chain for ',
        c.mainnet.name,
        ' with id ',
        c.mainnet.id,
      );
      continue;
    }

    const finalizationBlocks = finality.finalityThreshold.get(sdkChain);
    const blockTime = finality.blockTime.get(toChain(c.mainnet.id));

    if (finalizationBlocks !== undefined && blockTime !== undefined) {
      const finalizationSeconds = ((finalizationBlocks + 1) * blockTime) / 1000;

      const finalizationTime =
        finalizationSeconds < 120
          ? `~ ${Math.ceil(finalizationSeconds)}s`
          : `~ ${Math.ceil(finalizationSeconds / 60)}min`;

      tableBody.push(`
<tr>
  <td>${header}</td>
  <td>${instant}</td>
  <td>${safe}</td>
  <td>${finalized}</td>
  <td>${otherwise}</td>
  <td>${finalizationTime}</td>
  <td>${details}</td>
</tr>
`);
    }
  }

  return formatHTMLTable(buildHTMLTable(tableHeader, tableBody.join('\n')));
}

export function generateAllContractsTable(
  chains: types.DocChain[],
  module: string,
): string {
  const orderedChains = sortMainnets(chains);

  // If addresses aren't yet available in the SDK, we can manually add them here
  const newMainnetAddresses: Partial<types.ChainDetails>[] = [
    {
      name: 'Worldchain',
      contracts: { relayer: '0x1520cc9e779c56dab5866bebfb885c86840c33d3' },
    },
  ];
  const newTestnetAddresses: Partial<types.ChainDetails>[] = [];
  const newDevnetAddress: Partial<types.ChainDetails>[] = [];

  // Helper function to generate table rows
  const generateRows = (
    networks: types.ChainDetails[],
    chainType: string,
  ): string[] => {
    return networks
      .map((network) => {
        let address =
          module === 'cctp'
            ? network.contracts?.cctp?.wormhole
            : module === 'tokenBridgeRelayer'
              ? (network.contracts?.executorTokenBridge?.relayer ??
                network.contracts?.tokenBridgeRelayer)
              : module === 'tokenBridgeRelayerWithReferrer'
                ? network.contracts?.executorTokenBridge?.relayerWithReferrer
                : network.contracts?.[module];

        if (!address) {
          let newAddress: Partial<types.ChainDetails> | undefined;

          if (chainType === 'mainnet') {
            newAddress = newMainnetAddresses.find(
              (chain) => chain?.name === network.name,
            );
          } else if (chainType === 'testnet') {
            newAddress = newTestnetAddresses.find(
              (chain) => chain?.name === network.name,
            );
          } else {
            newAddress = newDevnetAddress.find(
              (chain) => chain?.name === network.name,
            );
          }

          if (newAddress?.contracts?.[module] && module !== 'cctp') {
            address = newAddress.contracts[module];
            // Update the network object directly if necessary
            network.contracts = network.contracts || {};
            network.contracts[module] = address;
          }
        }

        if (!address) {
          return null; // Skip this network
        }

        return `
          <tr>
            <td>${network.extraDetails?.title || network.name}</td>
            <td>${fmtCodeStr(address)}</td>
          </tr>`;
      })
      .filter((row) => row !== null); // Filter out null rows
  };

  // Generate table rows
  const mainNetTableBody = orderedChains.flatMap((chain) =>
    generateRows([chain.mainnet], 'mainnet'),
  );

  const testNetTableBody = orderedChains.flatMap((chain) =>
    generateRows(sortTestnets(chain.testnets || []), 'testnet'),
  );

  const devNetTableBody = orderedChains.flatMap((chain) =>
    generateRows(chain.devnets || [], 'devnet'),
  );

  // Render each tab
  const mainnetHtml = formatHTMLTable(
    buildHTMLTable(CONTRACT_TABLE_HEADER, mainNetTableBody.join('')),
  );
  const testnetHtml = formatHTMLTable(
    buildHTMLTable(CONTRACT_TABLE_HEADER, testNetTableBody.join('')),
  );
  const devnetHtml =
    devNetTableBody.length > 0
      ? formatHTMLTable(
          buildHTMLTable(CONTRACT_TABLE_HEADER, devNetTableBody.join('')),
        )
      : '';

  // Assemble tabs; only include Devnet if it has rows
  const parts: string[] = [
    `=== "Mainnet"\n\n    ${mainnetHtml}`,
    `=== "Testnet"\n\n    ${testnetHtml}`,
  ];

  if (devnetHtml) {
    parts.push(`=== "Devnet"\n\n    ${devnetHtml}`);
  }

  return parts.join('\n\n');
}

export function generateSupportedNetworksTable(dc: types.DocChain[]): string {
  const orderedDc = sortChainTypes(dc);

  // Group chains by their chainType
  const chainsByType: Record<string, types.DocChain[]> = {};
  for (const chain of orderedDc) {
    if (!chainsByType[chain.chainType]) {
      chainsByType[chain.chainType] = [];
    }
    chainsByType[chain.chainType].push(chain);
  }

  const tableHeader = `
  <thead>
    <th>Blockchain</th>
    <th>Environment</th>
    <th>Mainnet</th>
    <th>Testnet</th>
    <th>Quick Links</th>
  </thead>`;

  // Generate tables for each chain type
  let tables: string[] = [];
  for (const [chainType, chains] of Object.entries(chainsByType)) {
    let tableBody: string[] = [];

    for (const c of chains) {
      const mainnetSupport =
        c.mainnet.contracts.coreBridge || c.mainnet.contracts.gateway
          ? ':white_check_mark:'
          : ':x:';
      const testnetSupport =
        c.testnets[0]?.contracts.coreBridge || c.testnets[0]?.contracts.gateway
          ? ':white_check_mark:'
          : ':x:';

      // Filter out unsupported chains that have chain IDs (i.e., if they were previously
      // supported) but are no longer supported
      if (mainnetSupport === ':x:' && testnetSupport === ':x:') {
        continue;
      }

      const website = c.mainnet.extraDetails?.homepage
        ? ':material-web: ' +
          `<a href="${c.mainnet.extraDetails.homepage}" target="_blank">Website</a>`
        : undefined;

      const devDocs = c.mainnet.extraDetails?.devDocs
        ? ':material-file-document: ' +
          `<a href="${c.mainnet.extraDetails.devDocs}" target="_blank">Developer Docs</a>`
        : undefined;

      const explorer = c.mainnet.extraDetails?.explorer
        ? ':octicons-package-16: ' +
          `<a href="${c.mainnet.extraDetails.explorer[0].url}" target="_blank">Block Explorer</a>`
        : undefined;

      tableBody.push(
        `<tr>
          <td>${c.mainnet.extraDetails?.title ?? c.mainnet.name}</td>
          <td>${c.chainType}</td>
          <td>${mainnetSupport}</td>
          <td>${testnetSupport}</td>
          <td>
            ${website ? website + '<br>' : ''}
            ${devDocs ? devDocs + '<br>' : ''}
            ${explorer ? explorer : ''}
          </td>
        </tr>`,
      );
    }

    tables.push(
      `### ${chainType}\n\n${formatHTMLTable(buildHTMLTable(tableHeader, tableBody.join('\n')))}`,
    );
  }

  // Combine all tables into one string
  return `<div class="full-width" markdown>\n\n${tables.join('\n\n')}\n\n</div>`;
}

export function generateTestnetFaucetsTable(dc: types.DocChain[]): string {
  // Order chains in a consistent way (your existing helper)
  const orderedDc = sortChainTypes(dc);

  // Group chains by chainType, but skip unnamed buckets ('' -> no section)
  const chainsByType: Record<string, types.DocChain[]> = {};
  for (const chain of orderedDc) {
    const key = (chain.chainType ?? '').trim();
    if (!key) continue; // avoid creating a "### " empty heading
    if (!chainsByType[key]) chainsByType[key] = [];
    chainsByType[key].push(chain);
  }

  const tableHeader = `
  <thead>
    <th>Testnet</th>
    <th>Environment</th>
    <th>Token</th>
    <th>Faucet</th>
  </thead>`;

  // Build one table per chainType; only render sections with at least one valid row
  const tables: string[] = [];
  for (const [chainType, chains] of Object.entries(chainsByType)) {
    const tableBody: string[] = [];

    for (const c of chains) {
      for (const t of c.testnets) {
        // Require a real faucet URL; otherwise skip the row
        const faucetUrl = t.extraDetails?.faucet?.url?.trim();
        if (!faucetUrl) continue;

        const token = t.extraDetails?.faucet?.token ?? 'N/A';
        const faucetDesc = t.extraDetails?.faucet?.description ?? 'Faucet';
        const title = t.extraDetails?.title ?? t.name;

        tableBody.push(
          `<tr>
            <td>${title}</td>
            <td>${c.chainType}</td>
            <td>${token}</td>
            <td><a href="${faucetUrl}" target="_blank">${faucetDesc}</a></td>
          </tr>`,
        );
      }
    }

    // Skip rendering this chainType section if no rows survived the filters
    if (tableBody.length === 0) continue;

    const tableHtml = buildHTMLTable(tableHeader, tableBody.join('\n'));
    tables.push(`### ${chainType}\n\n${formatHTMLTable(tableHtml)}`);
  }

  // Wrap all sections
  return `<div class="full-width" markdown>\n\n${tables.join('\n\n')}\n\n</div>`;
}

export function generateProductSupportTables(
  chains: types.DocChain[],
  options: ProductTableOptions = {},
): Record<string, string> {
  const products = [
    'connect',
    'ntt',
    'tokenBridge',
    'multigov',
    'settlement',
    'cctp',
  ];

  const tableHeader = `
  <thead>
    <th>Blockchain</th>
    <th>Environment</th>
    <th>Mainnet</th>
    <th>Testnet</th>
    <th>Devnet</th>
    <th>Quick Links</th>
  </thead>`;

  const productDisplayNames: Record<string, string> = {
    connect: 'Connect',
    ntt: 'NTT',
    tokenBridge: 'WTT',
    multigov: 'MultiGov',
    settlement: 'Settlement',
    cctp: 'CCTP',
  };

  const tables: Record<string, string> = {};

  for (const product of products) {
    if (product === 'cctp' && options.cctpVersionSupport) {
      tables[product] = renderVersionedCctpTables(
        chains,
        options.cctpVersionSupport,
        tableHeader,
      );
      continue;
    }

    const rows: string[] = [];

    for (const chain of chains) {
      const productData = chain.products?.[product];
      if (!productData) continue;

      const mainnet = productData.mainnet ? ':white_check_mark:' : ':x:';
      const testnet = productData.testnet ? ':white_check_mark:' : ':x:';
      const devnet = productData.devnet ? ':white_check_mark:' : ':x:';

      const quickLinks = buildQuickLinksCell(chain);

      rows.push(`<tr>
        <td>${chain.mainnet.extraDetails?.title ?? chain.mainnet.name}</td>
        <td>${chain.chainType}</td>
        <td>${mainnet}</td>
        <td>${testnet}</td>
        <td>${devnet}</td>
        <td>${quickLinks}</td>
      </tr>`);
    }

    const content = formatHTMLTable(
      buildHTMLTable(tableHeader, rows.join('\n')),
    );

    tables[product] =
      `<div class="full-width" markdown>\n\n${content}\n\n</div>`;
  }

  return tables;
}

function buildQuickLinksCell(chain: types.DocChain): string {
  const website = chain.mainnet.extraDetails?.homepage
    ? `:material-web: <a href="${chain.mainnet.extraDetails.homepage}" target="_blank">Website</a><br>`
    : '';
  const devDocs = chain.mainnet.extraDetails?.devDocs
    ? `:material-file-document: <a href="${chain.mainnet.extraDetails.devDocs}" target="_blank">Developer Docs</a><br>`
    : '';
  const explorer = chain.mainnet.extraDetails?.explorer?.[0]?.url
    ? `:octicons-package-16: <a href="${chain.mainnet.extraDetails.explorer[0].url}" target="_blank">Block Explorer</a>`
    : '';

  return `${website}${devDocs}${explorer}`;
}

type CctpVersionSlice = Record<'Mainnet' | 'Testnet', string[]>;

const CCTP_VERSION_LABELS: Array<{
  key: keyof CctpVersionSupport;
  label: string;
}> = [
  { key: 'v1', label: 'CCTP v1' },
  { key: 'v2', label: 'CCTP v2' },
];

function renderVersionedCctpTables(
  chains: types.DocChain[],
  support: CctpVersionSupport,
  tableHeader: string,
): string {
  const ordered = sortMainnets([...chains]);
  const blocks: string[] = [];

  for (const { key, label } of CCTP_VERSION_LABELS) {
    const content = renderSingleCctpTable(ordered, support[key], tableHeader);
    blocks.push(`=== "${label}"\n\n${indentBlock(content, 4)}`);
  }

  return blocks.join('\n\n');
}

function renderSingleCctpTable(
  chains: types.DocChain[],
  versionSupport: CctpVersionSlice,
  tableHeader: string,
): string {
  const normalizedSupport = {
    Mainnet: versionSupport.Mainnet.map(normalizeNameForComparison),
    Testnet: versionSupport.Testnet.map(normalizeNameForComparison),
  };

  const rows: string[] = [];

  for (const chain of chains) {
    const candidates = buildChainNameCandidates(chain);
    const mainnetSupported = matchesVersionSupport(
      normalizedSupport.Mainnet,
      candidates.mainnet,
    );
    const testnetSupported = matchesVersionSupport(
      normalizedSupport.Testnet,
      candidates.testnet,
    );

    if (!mainnetSupported && !testnetSupported) continue;

    const quickLinks = buildQuickLinksCell(chain);

    rows.push(`<tr>
        <td>${chain.mainnet.extraDetails?.title ?? chain.mainnet.name}</td>
        <td>${chain.chainType}</td>
        <td>${mainnetSupported ? ':white_check_mark:' : ':x:'}</td>
        <td>${testnetSupported ? ':white_check_mark:' : ':x:'}</td>
        <td>:x:</td>
        <td>${quickLinks}</td>
      </tr>`);
  }

  if (rows.length === 0) {
    return '<div class="full-width" markdown>\n\nN/A\n\n</div>';
  }

  const content = formatHTMLTable(buildHTMLTable(tableHeader, rows.join('\n')));
  return `<div class="full-width" markdown>\n\n${content}\n\n</div>`;
}

type ChainNameCandidates = {
  mainnet: string[];
  testnet: string[];
};

function buildChainNameCandidates(chain: types.DocChain): ChainNameCandidates {
  const mainTitle = chain.mainnet.extraDetails?.title ?? chain.mainnet.name;
  const mainnetNames = uniqNormalized([
    mainTitle,
    chain.mainnet.name,
    `${mainTitle} Mainnet`,
    `${chain.mainnet.name} Mainnet`,
  ]);

  const testnetNames: string[] = [];

  for (const testnet of chain.testnets) {
    const testTitle = testnet.extraDetails?.title ?? testnet.name;
    const envName = testnet.extraDetails?.testnet?.name ?? testnet.name;

    testnetNames.push(
      testTitle,
      testnet.name,
      envName,
      `${testTitle} ${envName}`,
      `${mainTitle} ${envName}`,
      `${chain.mainnet.name} ${envName}`,
    );

    if (envName) {
      testnetNames.push(
        `${testTitle} (${envName})`,
        `${mainTitle} (${envName})`,
      );
    }
  }

  return {
    mainnet: mainnetNames,
    testnet: uniqNormalized(testnetNames),
  };
}

function matchesVersionSupport(
  supportedNames: string[],
  candidateNames: string[],
): boolean {
  if (supportedNames.length === 0 || candidateNames.length === 0) return false;

  return supportedNames.some((supported) =>
    candidateNames.some(
      (candidate) =>
        supported === candidate ||
        supported.includes(candidate) ||
        candidate.includes(supported),
    ),
  );
}

function uniqNormalized(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeNameForComparison(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function normalizeNameForComparison(value: string): string {
  return value.trim().toLowerCase().replace(/[()]/g, '').replace(/\s+/g, ' ');
}
