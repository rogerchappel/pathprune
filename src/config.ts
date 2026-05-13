import type { PathPruneConfig } from './types.js';

export const defaultConfig: PathPruneConfig = {
  duplicatePathGlobs: [
    'README*',
    'CHANGELOG*',
    'CONTRIBUTING*',
    'LICENSE*',
    'docs/README*',
    'docs/**/*.md',
    'examples/**/*.md'
  ],
  deadFileGlobs: [
    '**/*.bak',
    '**/*.old',
    '**/*.orig',
    '**/*~',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/unused/**',
    '**/__snapshots__/obsolete-*'
  ],
  ignoredCandidateGlobs: [
    'dist/**',
    'coverage/**',
    '.turbo/**',
    '.next/**',
    'tmp/**',
    'temp/**',
    '*.log'
  ],
  largeFileBytes: 1024 * 1024,
  maxFindings: 0
};

export function mergeConfig(override: Partial<PathPruneConfig> = {}): PathPruneConfig {
  return {
    duplicatePathGlobs: override.duplicatePathGlobs ?? defaultConfig.duplicatePathGlobs,
    deadFileGlobs: override.deadFileGlobs ?? defaultConfig.deadFileGlobs,
    ignoredCandidateGlobs: override.ignoredCandidateGlobs ?? defaultConfig.ignoredCandidateGlobs,
    largeFileBytes: override.largeFileBytes ?? defaultConfig.largeFileBytes,
    maxFindings: override.maxFindings ?? defaultConfig.maxFindings
  };
}

export function createConfigJson(): string {
  return `${JSON.stringify(defaultConfig, null, 2)}\n`;
}
