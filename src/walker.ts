import fs from 'node:fs/promises';
import path from 'node:path';
import type { FileEntry } from './types.js';
import type { IgnoreMatcher } from './ignore.js';
import { assertInsideRoot, sortPaths, toRelativePath } from './path-utils.js';

export interface WalkResult {
  readonly files: readonly FileEntry[];
  readonly ignoredFilesSkipped: number;
}

export async function walkFiles(root: string, ignoreMatcher: IgnoreMatcher): Promise<WalkResult> {
  const resolvedRoot = path.resolve(root);
  const stats = await fs.stat(resolvedRoot);
  if (!stats.isDirectory()) {
    throw new Error(`PathPrune needs a directory root, got: ${root}`);
  }

  const files: FileEntry[] = [];
  let ignoredFilesSkipped = 0;

  async function visit(directory: string): Promise<void> {
    assertInsideRoot(resolvedRoot, directory);
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const sortedEntries = entries.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));

    for (const entry of sortedEntries) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = toRelativePath(resolvedRoot, absolutePath);
      const isDirectory = entry.isDirectory();

      if (ignoreMatcher.isIgnored(relativePath, isDirectory)) {
        ignoredFilesSkipped += isDirectory ? await countFiles(absolutePath) : 1;
        continue;
      }

      if (isDirectory) {
        await visit(absolutePath);
      } else if (entry.isFile()) {
        const fileStats = await fs.stat(absolutePath);
        files.push({
          absolutePath,
          relativePath,
          sizeBytes: fileStats.size,
          mtimeMs: fileStats.mtimeMs
        });
      }
    }
  }

  await visit(resolvedRoot);

  const order = new Map(sortPaths(files.map((file) => file.relativePath)).map((filePath, index) => [filePath, index]));
  return {
    files: files.sort((a, b) => (order.get(a.relativePath) ?? 0) - (order.get(b.relativePath) ?? 0)),
    ignoredFilesSkipped
  };
}

async function countFiles(root: string): Promise<number> {
  let count = 0;
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        count += await countFiles(absolutePath);
      } else if (entry.isFile()) {
        count += 1;
      }
    }
  } catch {
    return count;
  }
  return count;
}
