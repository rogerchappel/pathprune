import { normalizePath } from './path-utils.js';

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

export function globToRegExp(glob: string): RegExp {
  const normalized = normalizePath(glob).replace(/^\.\//, '');
  let source = '^';

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (char === '*' && next === '*') {
      const after = normalized[index + 2];
      if (after === '/') {
        source += '(?:.*/)?';
        index += 2;
      } else {
        source += '.*';
        index += 1;
      }
      continue;
    }

    if (char === '*') {
      source += '[^/]*';
      continue;
    }

    if (char === '?') {
      source += '[^/]';
      continue;
    }

    source += escapeRegex(char ?? '');
  }

  source += '$';
  return new RegExp(source);
}

export function matchesGlob(relativePath: string, glob: string): boolean {
  const normalized = normalizePath(relativePath).replace(/^\.\//, '');
  const pattern = normalizePath(glob).replace(/^\.\//, '');

  if (pattern.endsWith('/**')) {
    const prefix = pattern.slice(0, -3);
    return normalized === prefix || normalized.startsWith(`${prefix}/`);
  }

  return globToRegExp(pattern).test(normalized);
}

export function matchesAnyGlob(relativePath: string, globs: readonly string[]): boolean {
  return globs.some((glob) => matchesGlob(relativePath, glob));
}
