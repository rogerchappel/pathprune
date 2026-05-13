import path from 'node:path';

export function normalizePath(input: string): string {
  return input.split(path.sep).join('/');
}

export function toRelativePath(root: string, absolutePath: string): string {
  const relative = path.relative(root, absolutePath);
  return normalizePath(relative || '.');
}

export function sortPaths(paths: readonly string[]): string[] {
  return [...paths].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

export function basenameKey(relativePath: string): string {
  const parsed = path.posix.parse(normalizePath(relativePath));
  return `${parsed.name.toLowerCase()}${parsed.ext.toLowerCase()}`;
}

export function parentDirectory(relativePath: string): string {
  return path.posix.dirname(normalizePath(relativePath));
}

export function assertInsideRoot(root: string, target: string): void {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to scan outside requested root: ${target}`);
  }
}
