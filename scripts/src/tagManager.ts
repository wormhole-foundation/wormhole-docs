import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type FileRecord = {
  original: string;
  updated: string;
  dirty: boolean;
};

type TagIndex = Map<string, Set<string>>;

const TAG_CAPTURE = /<!--\s*([A-Za-z0-9:_-]+)\s*-->/g;

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getLineIndent(source: string, index: number): string {
  const lineStart = source.lastIndexOf('\n', index - 1);
  const start = lineStart === -1 ? 0 : lineStart + 1;
  const prefix = source.slice(start, index);
  return /^[ \t]*$/.test(prefix) ? prefix : '';
}

export class TagManager {
  private readonly files = new Map<string, FileRecord>();
  private readonly tags: TagIndex = new Map();
  private readonly touched = new Map<string, Set<string>>();

  private constructor(private readonly rootDir: string) {}

  static async create(rootDir: string): Promise<TagManager> {
    const manager = new TagManager(rootDir);
    try {
      await manager.indexDirectory(rootDir);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          `Snippet directory not found: ${rootDir}. Set DOCS_SNIPPETS_DIR if your docs live elsewhere.`
        );
      }
      throw err;
    }
    return manager;
  }

  getKnownTags(): string[] {
    return Array.from(this.tags.keys()).sort();
  }

  async replace(tag: string, replacement: string): Promise<void> {
    const files = this.tags.get(tag);
    if (!files || files.size === 0) {
      console.warn(`No tags found for ${tag}`);
      return;
    }

    const markerPattern = new RegExp(`<!--\\s*${escapeRegExp(tag)}\\s*-->`, 'g');

    for (const filePath of files) {
      const record = this.files.get(filePath);
      if (!record) continue;

      markerPattern.lastIndex = 0;
      const matches = [...record.updated.matchAll(markerPattern)];
      if (matches.length === 0) continue;

      if (matches.length % 2 !== 0) {
        console.error(
          `Unmatched tag markers for ${tag} in ${filePath}; skipping`
        );
        continue;
      }

      let working = record.updated;
      for (let i = matches.length - 2; i >= 0; i -= 2) {
        const open = matches[i];
        const close = matches[i + 1];
        if (open.index === undefined || close.index === undefined) continue;

        const insertionStart = open.index + open[0].length;
        const insertionEnd = close.index;

        const closeIndent = getLineIndent(working, close.index);
        const openIndent = getLineIndent(working, open.index);
        const indent = closeIndent || openIndent;

        const normalized = replacement.replace(/\r\n/g, '\n');
        const withoutOuterNewlines = normalized
          .replace(/^\n+/, '')
          .replace(/\n+$/, '');
        const trailingIndent = indent.length > 0 ? `\n${indent}` : '\n';
        const replacementBlock =
          withoutOuterNewlines.length > 0
            ? `\n${withoutOuterNewlines}${trailingIndent}`
            : `\n${trailingIndent}`;

        working =
          working.slice(0, insertionStart) +
          replacementBlock +
          working.slice(insertionEnd);
      }

      if (working !== record.updated) {
        record.updated = working;
        record.dirty = true;
        this.noteModification(tag, filePath);
      }
    }
  }

  async commit(): Promise<string[]> {
    const written: string[] = [];
    for (const [filePath, record] of this.files) {
      if (!record.dirty || record.original === record.updated) continue;
      await writeFile(filePath, record.updated);
      written.push(filePath);
      record.original = record.updated;
      record.dirty = false;
    }
    return written;
  }

  private async indexDirectory(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await this.indexDirectory(entryPath);
          return;
        }
        if (!entry.isFile()) return;

        const contents = await readFile(entryPath, 'utf8');
        this.files.set(entryPath, {
          original: contents,
          updated: contents,
          dirty: false,
        });

        const seenInFile = new Set<string>();
        let match: RegExpExecArray | null;
        TAG_CAPTURE.lastIndex = 0;
        while ((match = TAG_CAPTURE.exec(contents)) !== null) {
          const tag = match[1]?.trim();
          if (!tag) continue;
          seenInFile.add(tag);
        }

        for (const tag of seenInFile) {
          if (!this.tags.has(tag)) this.tags.set(tag, new Set());
          this.tags.get(tag)!.add(entryPath);
        }
      })
    );
  }

  getModifications(): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const [tag, files] of this.touched) {
      out[tag] = Array.from(files).sort();
    }
    return out;
  }

  private noteModification(tag: string, filePath: string) {
    if (!this.touched.has(tag)) this.touched.set(tag, new Set());
    this.touched.get(tag)!.add(filePath);
  }
}
