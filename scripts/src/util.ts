import * as types from './types/chains';

export function fmtNum(n?: number): string {
  return n === undefined ? " " : n.toString();
}

export function fmtStr(s?: string): string {
  return s === undefined ? "**N/A**" : `\`${s}\``;
}

export function fmtCodeStr(s?: string): string {
  return s === undefined ? "<code>-</code>" : `<code>${s}</code>`;
}

export const CONTRACT_TABLE_HEADER = `
  <thead>
    <th>Chain Name</th>
    <th>Contract Address</th>
  </thead>`;

const ETHEREUM_ADDRESS_PATTERN = /0x[a-fA-F0-9]{40}/g;

export function buildHTMLTable(tableHeader: string, tableBody: string): string {
  if (tableBody.trim() == "") {
    return 'N/A';
  }

  return `
    <table data-full-width="true" markdown>
      ${tableHeader}
      <tbody>
        ${tableBody}
      </tbody>
    </table>
  `;
 
}

// Function to format an HTML table string with consistent indentation and newlines
export function formatHTMLTable(htmlTable: string): string {
  const indentStep = '  '; // Define the indent step
  let indentLevel = 0; // Initial indentation level

  // Helper function to add proper indentation
  function addIndentation(html: string): string {
    return html
      .split('\n')
      .map((line) => indentStep.repeat(indentLevel) + line.trim())
      .join('\n');
  }

  // Clean up extra spaces and newlines around tags
  const cleanedHtmlTable = htmlTable
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .replace(/(^|\n)\s+</g, '\n<') // Remove leading spaces before opening tags
    .replace(/\s+(<\/\w+>)/g, '$1') // Remove trailing spaces before closing tags
    .trim(); // Remove leading and trailing whitespace

  const lines = cleanedHtmlTable.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    // Handle opening and closing tags for indentation levels
    if (line.match(/^<\/\w/)) {
      indentLevel--; // Decrease indentation level for closing tags
    }

    result.push(addIndentation(line));

    if (line.match(/^<\w[^>]*[^\/]>/)) {
      indentLevel++; // Increase indentation level for opening tags
    }
  }

  // Handle the case where the last line is not properly closed
  return result.join('\n').trim();
}

export type ContractTableRow = {
  chain: string;
  address: string;
  href?: string;
};

export function renderSimpleContractTable(rows: ContractTableRow[]): string {
  if (rows.length === 0) {
    return 'N/A';
  }

  const body = rows
    .map(({ chain, address }) => {
      const safeChain = escapeHtmlText(chain);
      const cell = formatContractCell(address);

      return `
          <tr>
            <td>${safeChain}</td>
            <td>${cell}</td>
          </tr>`;
    })
    .join('');

  return formatHTMLTable(buildHTMLTable(CONTRACT_TABLE_HEADER, body));
}

function formatContractCell(raw: string): string {
  const parts = raw.split(/\n+/).map((p) => p.trim()).filter((p) => p.length > 0);
  if (parts.length === 0) {
    return fmtCodeStr(raw.trim());
  }

  const [primary, ...rest] = parts;
  const primaryHtml = fmtCodeStr(primary);

  if (rest.length === 0) {
    return primaryHtml;
  }

  const extras = rest
    .map((line) => {
      const escaped = escapeHtmlText(line);
      return escaped.replace(ETHEREUM_ADDRESS_PATTERN, (match) => fmtCodeStr(match));
    })
    .filter((line) => line.length > 0)
    .join('<br>');

  return extras.length > 0 ? `${primaryHtml}<br>${extras}` : primaryHtml;
}

export function sortMainnets(dc: types.DocChain[]): types.DocChain[] {
  return dc.sort((a, b) => {
    const aTitle =
      a.mainnet.extraDetails && a.mainnet.extraDetails.title
        ? a.mainnet.extraDetails.title
        : 'N/A';
    const bTitle =
      b.mainnet.extraDetails && b.mainnet.extraDetails.title
        ? b.mainnet.extraDetails.title
        : 'N/A';

    if (aTitle === 'Ethereum') return -1; // Ethereum should be first
    if (bTitle === 'Ethereum') return 1; // Ethereum should be first
    if (aTitle === 'Solana') return -1; // Solana should be second
    if (bTitle === 'Solana') return 1; // Solana should be second
    return aTitle.localeCompare(bTitle); // Sort the rest alphabetically
  });
}

export function sortTestnets (
  testnets: types.ChainDetails[]
): types.ChainDetails[] {
  return testnets.sort((a, b) => {
    const aTitle = a.extraDetails?.title || 'N/A';
    const bTitle = b.extraDetails?.title || 'N/A';
    if (aTitle === 'Ethereum') return -1;
    if (bTitle === 'Ethereum') return 1;
    if (aTitle === 'Solana') return -1;
    if (bTitle === 'Solana') return 1;
    return aTitle.localeCompare(bTitle);
  });
}

export function sortChainTypes(dc: types.DocChain[]): types.DocChain[] {
  return dc.sort((a, b) => {
    // Define chain type priorities
    const chainTypePriority: Record<string, number> = {
      EVM: 1, // Highest priority
      SVM: 2, // Second priority
      // Other chain types are sorted alphabetically by type
    };

    // Get chain type priorities, default to a higher number for unknown types
    const aPriority = chainTypePriority[a.chainType] ?? 99;
    const bPriority = chainTypePriority[b.chainType] ?? 99;

    // Primary sort by chain type priority
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // For chain types not explicitly prioritized, sort alphabetically by chain type
    if (aPriority === 99 && bPriority === 99) {
      return a.chainType.localeCompare(b.chainType);
    }

    // Secondary sort within the same chain type
    const aTitle = a.mainnet.extraDetails?.title ?? 'N/A';
    const bTitle = b.mainnet.extraDetails?.title ?? 'N/A';

    // Special handling for prioritized chain names within types
    if (a.chainType === 'EVM') {
      if (aTitle === 'Ethereum') return -1;
      if (bTitle === 'Ethereum') return 1;
    }

    if (a.chainType === 'SVM') {
      if (aTitle === 'Solana') return -1;
      if (bTitle === 'Solana') return 1;
    }

    // Sort alphabetically by title for other chains within the same type
    return aTitle.localeCompare(bTitle);
  });
}

// Indents each line in a block of text by the specified number of spaces
export function indentBlock(s: string, spaces = 4): string {
  const pad = ' '.repeat(spaces);
  return s
    .replace(/^\s+|\s+$/g, '')
    .split('\n')
    .map(line => pad + line)
    .join('\n');
}

// Testnet Ethereum first for governance contracts (governance.ts)
export function makePrioritizedAlphaCompare(priorities: string[]) {
  const set = new Set(priorities.map(p => p.toLowerCase()));
  return (a: string, b: string) => {
    const aHit = set.has(a.toLowerCase());
    const bHit = set.has(b.toLowerCase());
    if (aHit && !bHit) return -1;
    if (bHit && !aHit) return 1;
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  };
}

// Escapes HTML special characters in a string to prevent HTML injection
export function escapeHtmlText(s: string): string {
  const str = String(s);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
