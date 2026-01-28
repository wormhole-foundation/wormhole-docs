import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let envLoaded = false;

function loadLocalEnv(): void {
  if (envLoaded) return;
  envLoaded = true;

  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(moduleDir, '..');

  const candidates = [
    path.resolve(projectRoot, '.env'),
    path.resolve(projectRoot, '..', '.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const candidate of candidates) {
    if (!candidate || !fs.existsSync(candidate)) continue;

    const contents = fs.readFileSync(candidate, 'utf8');
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (line.length === 0 || line.startsWith('#')) continue;

      const equals = line.indexOf('=');
      if (equals <= 0) continue;

      const key = line.slice(0, equals).trim();
      if (!key || process.env[key] !== undefined) continue;

      const valueRaw = line.slice(equals + 1).trim();
      const match = valueRaw.match(/^(['"])(.*)\1$/);
      const value = match ? match[2] : valueRaw;

      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const DEFAULT_SNIPPETS_RELATIVE = '../wormhole-docs/.snippets/text';

/**
 * Directory that contains the reusable doc snippets. Can be overridden with DOCS_SNIPPETS_DIR.
 */
export const DOCS_SNIPPETS_DIR = (() => {
  const custom = process.env.DOCS_SNIPPETS_DIR;
  if (custom && custom.trim().length > 0) {
    return path.resolve(custom);
  }
  return path.resolve(process.cwd(), DEFAULT_SNIPPETS_RELATIVE);
})();
