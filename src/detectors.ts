import type { FileEntry, Finding, PathPruneConfig } from './types.js';
import { matchesAnyGlob } from './glob.js';
import { basenameKey, parentDirectory } from './path-utils.js';

export function detectDeadFiles(files: readonly FileEntry[], config: PathPruneConfig): Finding[] {
  return files
    .filter((file) => matchesAnyGlob(file.relativePath, config.deadFileGlobs))
    .map((file) => ({
      kind: 'dead-file',
      severity: 'warning',
      path: file.relativePath,
      message: 'Looks like an abandoned backup, obsolete snapshot, or OS artifact.',
      evidence: [`Matched dead-file pattern`, `Size: ${file.sizeBytes} bytes`],
      recommendation: 'Review ownership, then remove manually if the file is truly stale.',
      safeToRemove: false
    }));
}

export function detectIgnoredCandidates(files: readonly FileEntry[], config: PathPruneConfig): Finding[] {
  return files
    .filter((file) => matchesAnyGlob(file.relativePath, config.ignoredCandidateGlobs))
    .map((file) => ({
      kind: 'ignored-candidate',
      severity: 'info',
      path: file.relativePath,
      message: 'This file is usually generated and may belong in .gitignore.',
      evidence: [`Matched generated-file candidate`, `Size: ${file.sizeBytes} bytes`],
      recommendation: 'Confirm it is reproducible before adding an ignore rule or deleting manually.',
      safeToRemove: false
    }));
}

export function detectLargeFiles(files: readonly FileEntry[], config: PathPruneConfig): Finding[] {
  return files
    .filter((file) => file.sizeBytes >= config.largeFileBytes)
    .map((file) => ({
      kind: 'large-file',
      severity: 'info',
      path: file.relativePath,
      message: 'Large tracked file candidate.',
      evidence: [`Size: ${file.sizeBytes} bytes`, `Threshold: ${config.largeFileBytes} bytes`],
      recommendation: 'Check whether the file is source material, fixture data, or accidental build output.',
      safeToRemove: false
    }));
}

export function detectDuplicatePaths(files: readonly FileEntry[], config: PathPruneConfig): Finding[] {
  const candidates = files.filter((file) => matchesAnyGlob(file.relativePath, config.duplicatePathGlobs));
  const groups = new Map<string, FileEntry[]>();

  for (const file of candidates) {
    const key = basenameKey(file.relativePath);
    const existing = groups.get(key) ?? [];
    existing.push(file);
    groups.set(key, existing);
  }

  const findings: Finding[] = [];
  for (const [key, group] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))) {
    if (group.length < 2) {
      continue;
    }

    const sorted = group.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'en', { numeric: true }));
    for (const file of sorted) {
      const siblingPaths = sorted.filter((other) => other.relativePath !== file.relativePath).map((other) => other.relativePath);
      findings.push({
        kind: 'duplicate-path',
        severity: 'warning',
        path: file.relativePath,
        message: `Shares a common documentation/artifact name (${key}) with ${siblingPaths.length} other path(s).`,
        evidence: [`Directory: ${parentDirectory(file.relativePath)}`, `Related: ${siblingPaths.join(', ')}`],
        recommendation: 'Compare content and references before consolidating. PathPrune never deletes for you.',
        safeToRemove: false
      });
    }
  }

  return findings;
}
