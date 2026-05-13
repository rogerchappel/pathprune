import path from 'node:path';
import { mergeConfig } from './config.js';
import { detectDeadFiles, detectDuplicatePaths, detectIgnoredCandidates, detectLargeFiles } from './detectors.js';
import { loadIgnoreMatcher } from './ignore.js';
import type { Finding, ScanOptions, ScanReport } from './types.js';
import { walkFiles } from './walker.js';

const deterministicGeneratedAt = '1970-01-01T00:00:00.000Z';

export async function scan(options: ScanOptions): Promise<ScanReport> {
  const root = path.resolve(options.root);
  const config = mergeConfig(options.config);
  const ignoreMatcher = await loadIgnoreMatcher(root);
  const walk = await walkFiles(root, ignoreMatcher);

  const findings = orderFindings([
    ...detectDuplicatePaths(walk.files, config),
    ...detectDeadFiles(walk.files, config),
    ...detectIgnoredCandidates(walk.files, config),
    ...detectLargeFiles(walk.files, config)
  ]);

  return {
    summary: {
      root,
      filesScanned: walk.files.length,
      ignoredFilesSkipped: walk.ignoredFilesSkipped,
      findingCount: findings.length,
      generatedAt: deterministicGeneratedAt
    },
    findings
  };
}

export function orderFindings(findings: readonly Finding[]): Finding[] {
  const severityRank = new Map([
    ['error', 0],
    ['warning', 1],
    ['info', 2]
  ]);

  return [...findings].sort((a, b) => {
    const severityDelta = (severityRank.get(a.severity) ?? 9) - (severityRank.get(b.severity) ?? 9);
    if (severityDelta !== 0) return severityDelta;
    const pathDelta = a.path.localeCompare(b.path, 'en', { numeric: true });
    if (pathDelta !== 0) return pathDelta;
    return a.kind.localeCompare(b.kind, 'en', { numeric: true });
  });
}

export function exitCodeForReport(report: ScanReport, maxFindings = 0): 0 | 1 {
  const actionableFindings = report.findings.filter((finding) => finding.severity !== 'info').length;
  return actionableFindings > maxFindings ? 1 : 0;
}
