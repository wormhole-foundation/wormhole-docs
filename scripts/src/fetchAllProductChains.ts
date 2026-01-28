import path from 'node:path';
import { readFile } from 'node:fs/promises';

import {
  generateProductSupport,
  type ProductConfig,
} from './generateProductSupport';
import { generateConnectSupport } from './generateConnectSupport';

const configPath = path.resolve(
  __dirname,
  'config/product-support-config.json'
);

async function main() {
  const raw = await readFile(configPath, 'utf8');
  const configs = JSON.parse(raw) as ProductConfig[];

  if (!Array.isArray(configs)) {
    throw new Error('product-support-config.json must export an array');
  }

  for (const entry of configs) {
    await generateProductSupport(entry);
  }

  await generateConnectSupport();
}

void main();
