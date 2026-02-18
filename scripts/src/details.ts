import { Chain, finality, toChain } from '@wormhole-foundation/sdk';
import * as types from './types/chains';
import { networkString } from './config';
import type { SupportMap } from './types/support';
import { fmtNum, fmtCodeStr, buildHTMLTable, formatHTMLTable, sortMainnets, sortTestnets, sortChainTypes, CONTRACT_TABLE_HEADER } from './util';
import { buildCctpSupportLookup, normalizeCctpSupportKey } from './utils/support';

type SupportFlags = {
  mainnet: boolean;
  testnet: boolean;
  devnet: boolean;
};

function buildQuickLinks(details?: types.ExtraDetails): string {
  const website = details?.homepage
    ? `:material-web: <a href="${details.homepage}" target="_blank">Website</a><br>`
    : '';
  const devDocs = details?.devDocs
    ? `:material-file-document: <a href="${details.devDocs}" target="_blank">Developer Docs</a><br>`
    : '';
  const explorer = details?.explorer?.[0]?.url
    ? `:octicons-package-16: <a href="${details.explorer[0].url}" target="_blank">Block Explorer</a>`
    : '';

  return `${website}${devDocs}${explorer}`;
}

function buildSupportRow(chain: types.DocChain, support: SupportFlags): string | null {
  if (!support.mainnet && !support.testnet && !support.devnet) return null;

  const mainnet = support.mainnet ? ':white_check_mark:' : ':x:';
  const testnet = support.testnet ? ':white_check_mark:' : ':x:';
  const devnet = support.devnet ? ':white_check_mark:' : ':x:';

  const quickLinks = buildQuickLinks(chain.mainnet.extraDetails);
  const title = chain.mainnet.extraDetails?.title ?? chain.mainnet.name;

  return `<tr>
        <td>${title}</td>
        <td>${chain.chainType}</td>
        <td>${mainnet}</td>
        <td>${testnet}</td>
        <td>${devnet}</td>
        <td>${quickLinks}</td>
      </tr>`;
}

function renderSupportTable(rows: string[]): string {
  const tableHeader = `
  <thead>
    <th>Blockchain</th>
    <th>Environment</th>
    <th>Mainnet</th>
    <th>Testnet</th>
    <th>Devnet</th>
    <th>Quick Links</th>
  </thead>`;

  return formatHTMLTable(buildHTMLTable(tableHeader, rows.join('\n')));
}

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
    const mainnetName = c.mainnet.extraDetails?.title ? c.mainnet.extraDetails.title : c.mainnet.name;

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

export function generateAllConsistencyLevelsTable(dc: types.DocChain[]): string {
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

    const header = c.mainnet.extraDetails.title ? c.mainnet.extraDetails.title : c.mainnet.name;

    const instant = fmtNum(f.instant);
    const safe = fmtNum(f.safe !== undefined ? f.safe : f.confirmed !== undefined ? f.confirmed : undefined);
    const finalized = fmtNum(f.finalized);
    const otherwise = f.otherwise ? f.otherwise : '';
    const details = f.details ? `<a href="${f.details}" target="_blank">Details</a>` : ' ';

    let sdkChain: Chain;
    try {
      sdkChain = toChain(c.mainnet.id);
    } catch {
      console.log('No sdk chain for ', c.mainnet.name, ' with id ', c.mainnet.id);
      continue;
    }

    const finalizationBlocks = finality.finalityThreshold.get(sdkChain);
    const blockTime = finality.blockTime.get(toChain(c.mainnet.id));

    if (finalizationBlocks !== undefined && blockTime !== undefined) {
      const finalizationSeconds = ((finalizationBlocks + 1) * blockTime) / 1000;

      const finalizationTime = finalizationSeconds < 120 ? `~ ${Math.ceil(finalizationSeconds)}s` : `~ ${Math.ceil(finalizationSeconds / 60)}min`;

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

export function generateAllContractsTable(chains: types.DocChain[], module: string): string {
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
  const generateRows = (networks: types.ChainDetails[], chainType: string): string[] => {
    return networks
      .map((network) => {
        let address =
          module === 'cctp'
            ? network.contracts?.cctp?.wormhole
            : module === 'tokenBridgeRelayer'
            ? network.contracts?.executorTokenBridge?.relayer ?? network.contracts?.tokenBridgeRelayer
            : module === 'tokenBridgeRelayerWithReferrer'
            ? network.contracts?.executorTokenBridge?.relayerWithReferrer
            : network.contracts?.[module];

        if (!address) {
          let newAddress: Partial<types.ChainDetails> | undefined;

          if (chainType === 'mainnet') {
            newAddress = newMainnetAddresses.find((chain) => chain?.name === network.name);
          } else if (chainType === 'testnet') {
            newAddress = newTestnetAddresses.find((chain) => chain?.name === network.name);
          } else {
            newAddress = newDevnetAddress.find((chain) => chain?.name === network.name);
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
  const mainNetTableBody = orderedChains.flatMap((chain) => generateRows([chain.mainnet], 'mainnet'));

  const testNetTableBody = orderedChains.flatMap((chain) => generateRows(sortTestnets(chain.testnets || []), 'testnet'));

  const devNetTableBody = orderedChains.flatMap((chain) => generateRows(chain.devnets || [], 'devnet'));

  // Render each tab
  const mainnetHtml = formatHTMLTable(buildHTMLTable(CONTRACT_TABLE_HEADER, mainNetTableBody.join('')));
  const testnetHtml = formatHTMLTable(buildHTMLTable(CONTRACT_TABLE_HEADER, testNetTableBody.join('')));
  const devnetHtml =
    devNetTableBody.length > 0
      ? formatHTMLTable(buildHTMLTable(CONTRACT_TABLE_HEADER, devNetTableBody.join('')))
      : '';

  // Assemble tabs; only include Devnet if it has rows
  const parts: string[] = [`=== "Mainnet"\n\n    ${mainnetHtml}`, `=== "Testnet"\n\n    ${testnetHtml}`];

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
      const mainnetSupport = c.mainnet.contracts.coreBridge || c.mainnet.contracts.gateway ? ':white_check_mark:' : ':x:';
      const testnetSupport = c.testnets[0]?.contracts.coreBridge || c.testnets[0]?.contracts.gateway ? ':white_check_mark:' : ':x:';

      // Filter out unsupported chains that have chain IDs (i.e., if they were previously
      // supported) but are no longer supported
      if (mainnetSupport === ':x:' && testnetSupport === ':x:') {
        continue;
      }

      const website = c.mainnet.extraDetails?.homepage ? ':material-web: ' + `<a href="${c.mainnet.extraDetails.homepage}" target="_blank">Website</a>` : undefined;

      const devDocs = c.mainnet.extraDetails?.devDocs ? ':material-file-document: ' + `<a href="${c.mainnet.extraDetails.devDocs}" target="_blank">Developer Docs</a>` : undefined;

      const explorer = c.mainnet.extraDetails?.explorer ? ':octicons-package-16: ' + `<a href="${c.mainnet.extraDetails.explorer[0].url}" target="_blank">Block Explorer</a>` : undefined;

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

    tables.push(`### ${chainType}\n\n${formatHTMLTable(buildHTMLTable(tableHeader, tableBody.join('\n')))}`);
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

export function generateProductSupportTables(chains: types.DocChain[]): Record<string, string> {
  const products = ['connect', 'ntt', 'tokenBridge', 'multigov', 'settlement'];

  const tables: Record<string, string> = {};

  for (const product of products) {
    const rows: string[] = [];

    for (const chain of chains) {
      const productData = chain.products?.[product];
      if (!productData) continue;

      const row = buildSupportRow(chain, {
        mainnet: Boolean(productData.mainnet),
        testnet: Boolean(productData.testnet),
        devnet: Boolean(productData.devnet),
      });
      if (row) rows.push(row);
    }

    const content = renderSupportTable(rows);

    tables[product] = `<div class="full-width" markdown>\n\n${content}\n\n</div>`;
  }

  return tables;
}

function buildRowsFromSupport(chains: types.DocChain[], support: SupportMap): string[] {
  const lookup = buildCctpSupportLookup(support);
  const rows: string[] = [];

  for (const chain of chains) {
    const key = normalizeCctpSupportKey(chain.mainnet.name);
    const row = buildSupportRow(chain, {
      mainnet: lookup.Mainnet.has(key),
      testnet: lookup.Testnet.has(key),
      devnet: lookup.Devnet.has(key),
    });
    if (row) rows.push(row);
  }

  return rows;
}

function warnMissingSupportChains(
  label: string,
  support: SupportMap,
  chains: types.DocChain[],
): void {
  const knownKeys = new Set(
    chains.map((chain) => normalizeCctpSupportKey(chain.mainnet.name)),
  );
  const missing = new Map<string, { name: string; networks: Set<string> }>();

  const addMissing = (network: string, name: string) => {
    const key = normalizeCctpSupportKey(name);
    if (knownKeys.has(key)) return;
    const entry = missing.get(key);
    if (entry) {
      entry.networks.add(network);
      return;
    }
    missing.set(key, { name, networks: new Set([network]) });
  };

  for (const name of support.Mainnet) addMissing('Mainnet', name);
  for (const name of support.Testnet) addMissing('Testnet', name);
  for (const name of support.Devnet) addMissing('Devnet', name);

  if (missing.size === 0) return;

  const details = Array.from(missing.values())
    .map((entry) => {
      const networks = Array.from(entry.networks).sort().join(', ');
      return `${entry.name} (${networks})`;
    })
    .join('; ');

  const message =
    `[cctp] Missing chain metadata for ${label}: ${details}. ` +
    'Add src/chains/<Chain>.json to include links and chain type, then rerun the generator.';
  const useColor = Boolean(process.stderr.isTTY);
  const output = useColor ? `\u001b[33m${message}\u001b[0m` : message;
  console.warn(output);
}

export function generateCctpSupportTabs(
  chains: types.DocChain[],
  v1Support: SupportMap,
  v2Support: SupportMap,
): string {
  warnMissingSupportChains('CCTP v1', v1Support, chains);
  warnMissingSupportChains('CCTP v2', v2Support, chains);
  const v1Table = renderSupportTable(buildRowsFromSupport(chains, v1Support));
  const v2Table = renderSupportTable(buildRowsFromSupport(chains, v2Support));

  return `<div class="full-width" markdown>\n\n=== \"CCTP v1\"\n\n    ${v1Table}\n\n=== \"CCTP v2\"\n\n    ${v2Table}\n\n</div>`;
}
