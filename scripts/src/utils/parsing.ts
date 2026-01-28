// -------------------- Parsing: safe array extraction --------------------
// 1) Strip comments while preserving string contents
export function stripCommentsPreserveStrings(src: string): string {
  let out = '',
    i = 0,
    inStr = false,
    q = '',
    inLine = false,
    inBlock = false;
  while (i < src.length) {
    const c = src[i],
      n = src[i + 1];
    if (inLine) {
      if (c === '\n') {
        inLine = false;
        out += c;
      }
      i++;
      continue;
    }
    if (inBlock) {
      if (c === '*' && n === '/') {
        inBlock = false;
        i += 2;
      } else i++;
      continue;
    }
    if (inStr) {
      out += c;
      if (c === '\\') {
        out += src[i + 1] ?? '';
        i += 2;
        continue;
      }
      if (c === q) {
        inStr = false;
        q = '';
      }
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      q = c;
      out += c;
      i++;
      continue;
    }
    if (c === '/' && n === '/') {
      inLine = true;
      i += 2;
      continue;
    }
    if (c === '/' && n === '*') {
      inBlock = true;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

// 2) From "const <name> =" find the first '[' and return the balanced array text
export function extractArrayAfterConst(src: string, constName: string): string | undefined {
  const re = new RegExp(
    String.raw`(?:export\s+)?const\s+` +
      constName +
      String.raw`(?:\s*:[^=]+)?\s*=`,
    'm'
  );
  const m = re.exec(src);
  if (!m) return;
  let i = src.indexOf('[', m.index + m[0].length);
  if (i < 0) return;
  let depth = 0,
    start = -1,
    inStr = false,
    q = '',
    inLine = false,
    inBlock = false;
  for (; i < src.length; i++) {
    const c = src[i],
      n = src[i + 1];
    if (inLine) {
      if (c === '\n') inLine = false;
      continue;
    }
    if (inBlock) {
      if (c === '*' && n === '/') {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === q) {
        inStr = false;
        q = '';
      }
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      q = c;
      continue;
    }
    if (c === '/' && n === '/') {
      inLine = true;
      i++;
      continue;
    }
    if (c === '/' && n === '*') {
      inBlock = true;
      i++;
      continue;
    }
    if (c === '[') {
      if (depth === 0) start = i;
      depth++;
      continue;
    }
    if (c === ']') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
      continue;
    }
  }
  return;
}

// 3) JSON-ify TS array literal (remove trailing commas)
export function toJsonArray<T = unknown>(text: string): T[] {
  const noTrailingCommas = text.replace(/,\s*([\]\}])/g, '$1');
  return JSON.parse(noTrailingCommas);
}
