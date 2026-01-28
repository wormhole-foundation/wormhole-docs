import type { NotionExtraPropertyConfig } from '../config/notion-contracts';
import { ContractTableRow } from '../util';
import { NotionPage, NotionPropertyValue, NotionRichText } from './types';

export type ContractRow = ContractTableRow;
type ExtractContractRowOptions = {
  chainProperty?: string;
  extraProperties?: NotionExtraPropertyConfig[];
};

export function extractTitle(property: NotionPropertyValue | undefined): string | undefined {
  if (!property || property.type !== 'title' || !Array.isArray(property.title)) return undefined;
  return joinPlainText(property.title);
}

export function extractRichText(property: NotionPropertyValue | undefined): { text: string; href?: string } | undefined {
  if (!property || property.type !== 'rich_text' || !Array.isArray(property.rich_text)) return undefined;

  const text = joinPlainText(property.rich_text);
  if (!text || text.trim().length === 0) return undefined;

  const href = property.rich_text.find((entry) => entry.href)?.href;

  return { text: text.trim(), href };
}

export function extractContractRows(
  pages: NotionPage[],
  propertyName: string,
  options?: ExtractContractRowOptions
): ContractTableRow[] {
  const chainProp = options?.chainProperty ?? 'Chain';
  const extraProps = options?.extraProperties ?? [];
  const rows = new Map<string, ContractTableRow>();

  for (const page of pages) {
    const chainName = extractTitle(page.properties?.[chainProp]);
    if (!chainName) continue;

    const normalizedChain = chainName.replace(/\bTesnet\b/gi, 'Testnet');

    const property = extractRichText(page.properties?.[propertyName]);
    if (!property) continue;

    const parts = buildContractParts(property.text, page, extraProps);
    if (parts.length === 0) continue;

    const normalized = parts.join('\n');

    const key = normalizedChain.trim();
    const row: ContractRow = {
      chain: key,
      address: normalized,
      href: property.href,
    };

    rows.set(key.toLowerCase(), row);
  }

  return Array.from(rows.values());
}

function joinPlainText(entries: NotionRichText[]): string {
  return entries.map((entry) => entry.plain_text ?? '').join('').trim();
}

function buildContractParts(
  primaryValue: string,
  page: NotionPage,
  extraProperties: NotionExtraPropertyConfig[],
): string[] {
  const parts: string[] = [];
  const normalizedPrimary = primaryValue.trim();

  if (normalizedPrimary.length > 0 && normalizedPrimary.toLowerCase() !== 'n/a') {
    parts.push(normalizedPrimary);
  }

  for (const extra of extraProperties) {
    const extraValue = extractRichText(page.properties?.[extra.property]);
    if (!extraValue) continue;

    const normalizedExtra = extraValue.text.trim();
    if (normalizedExtra.length === 0 || normalizedExtra.toLowerCase() === 'n/a') continue;

    const label = extra.label?.trim();
    parts.push(label && label.length > 0 ? `${label}: ${normalizedExtra}` : normalizedExtra);
  }

  return parts;
}
