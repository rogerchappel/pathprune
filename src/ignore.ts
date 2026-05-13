import fs from 'node:fs/promises';
import path from 'node:path';
import { matchesGlob } from './glob.js';
import { normalizePath } from './path-utils.js';

export interface IgnoreMatcher {
  readonly patterns: readonly string[];
  isIgnored(relativePath: string, isDirectory?: boolean): boolean;
}

const builtInIgnoredDirectories = ['.git', 'node_modules'];
const builtInIgnoredGlobs = ['.git/**', 'node_modules/**'];

export function parseIgnoreFile(contents: string): string[] {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .filter((line) => !line.startsWith('!'));
}

export async function loadIgnoreMatcher(root: string): Promise<IgnoreMatcher> {
  const ignorePath = path.join(root, '.gitignore');
  let patterns: string[] = [...builtInIgnoredGlobs];

  try {
    const contents = await fs.readFile(ignorePath, 'utf8');
    patterns = patterns.concat(parseIgnoreFile(contents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return createIgnoreMatcher(patterns);
}

export function createIgnoreMatcher(patterns: readonly string[]): IgnoreMatcher {
  const normalized = patterns.map((pattern) => normalizePath(pattern).replace(/^\//, ''));

  return {
    patterns: normalized,
    isIgnored(relativePath: string, isDirectory = false): boolean {
      const normalizedPath = normalizePath(relativePath).replace(/^\.\//, '');
      const firstSegment = normalizedPath.split('/')[0];
      if (firstSegment && builtInIgnoredDirectories.includes(firstSegment)) {
        return true;
      }

      return normalized.some((pattern) => matchesIgnorePattern(normalizedPath, pattern, isDirectory));
    }
  };
}

function matchesIgnorePattern(relativePath: string, pattern: string, isDirectory: boolean): boolean {
  if (pattern.endsWith('/')) {
    const directory = pattern.slice(0, -1);
    return isDirectory ? relativePath === directory || relativePath.startsWith(`${directory}/`) : relativePath.startsWith(`${directory}/`);
  }

  if (!pattern.includes('/')) {
    return relativePath === pattern || relativePath.endsWith(`/${pattern}`) || matchesGlob(relativePath, `**/${pattern}`);
  }

  return matchesGlob(relativePath, pattern) || matchesGlob(relativePath, `${pattern}/**`);
}
