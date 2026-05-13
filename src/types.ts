export type OutputFormat = 'text' | 'json';

export type FindingKind = 'duplicate-path' | 'dead-file' | 'ignored-candidate' | 'large-file';

export type Severity = 'info' | 'warning' | 'error';

export interface PathPruneConfig {
  readonly duplicatePathGlobs: readonly string[];
  readonly deadFileGlobs: readonly string[];
  readonly ignoredCandidateGlobs: readonly string[];
  readonly largeFileBytes: number;
  readonly maxFindings: number;
}

export interface ScanOptions {
  readonly root: string;
  readonly config?: Partial<PathPruneConfig>;
}

export interface FileEntry {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly sizeBytes: number;
  readonly mtimeMs: number;
}

export interface Finding {
  readonly kind: FindingKind;
  readonly severity: Severity;
  readonly path: string;
  readonly message: string;
  readonly evidence: readonly string[];
  readonly recommendation: string;
  readonly safeToRemove: boolean;
}

export interface ScanSummary {
  readonly root: string;
  readonly filesScanned: number;
  readonly ignoredFilesSkipped: number;
  readonly findingCount: number;
  readonly generatedAt: string;
}

export interface ScanReport {
  readonly summary: ScanSummary;
  readonly findings: readonly Finding[];
}

export interface ExplainSection {
  readonly title: string;
  readonly body: string;
}
