import type { Finding, ScanReport } from './types.js';

export function formatJson(report: ScanReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function formatText(report: ScanReport): string {
  const lines: string[] = [];
  lines.push('PathPrune cleanup preview');
  lines.push('=========================');
  lines.push(`Root: ${report.summary.root}`);
  lines.push(`Files scanned: ${report.summary.filesScanned}`);
  lines.push(`Ignored files skipped: ${report.summary.ignoredFilesSkipped}`);
  lines.push(`Findings: ${report.summary.findingCount}`);
  lines.push('Safety: preview only; no files were changed.');
  lines.push('');

  if (report.findings.length === 0) {
    lines.push('No cleanup candidates found. Tiny broom, spotless floor.');
    return `${lines.join('\n')}\n`;
  }

  for (const [index, finding] of report.findings.entries()) {
    lines.push(`${index + 1}. ${formatFindingHeader(finding)}`);
    lines.push(`   ${finding.message}`);
    for (const evidence of finding.evidence) {
      lines.push(`   - ${evidence}`);
    }
    lines.push(`   Recommendation: ${finding.recommendation}`);
    lines.push(`   Safe-to-remove flag: ${finding.safeToRemove ? 'yes' : 'no - human review required'}`);
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function formatFindingHeader(finding: Finding): string {
  return `[${finding.severity}] ${finding.kind}: ${finding.path}`;
}
